import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RequestNextAction } from '../src/features/admin/RequestNextAction.jsx';
import { sendQuoteEmail, transitionRequest } from '../src/services/adminActionsService.js';
import { automationAction } from '../src/services/automationService.js';
import { calculateManualQuote } from '../src/utils/quotePricing.js';

jest.mock('../src/services/adminActionsService.js', () => ({
  sendQuoteEmail: jest.fn(),
  transitionRequest: jest.fn(),
}));
jest.mock('../src/services/automationService.js', () => ({
  automationAction: jest.fn(async () => ({ profiles: [] })),
  automationError: jest.fn(() => 'Servicio no disponible'),
}));

const inputs = {
  material: 'PETG', weightGrams: 100, printHours: 1, filamentUsdPerKg: 20, wearUsdPerKg: 5,
  usdToCrc: 500, printerPowerWatts: 200, electricityCrcPerKwh: 100, postProcessMinutesPerPiece: 0,
  laborCrcPerHour: 0, designHours: 0, designCrcPerHour: 0, otherCostsCrc: 0, markupPercent: 20,
  ratesCheckedAt: '2026-10-01',
};
const amount = calculateManualQuote(inputs, 1).breakdown.amountCrc;
const request = {
  id: 'r2', status: 'QUOTED', quantity: 1, customerEmail: 'cliente@vertice.cr', quotedPrice: amount, currency: 'CRC',
  quoteVersion: 2, quoteValidUntil: '2099-10-10T23:59:59-06:00', quoteNotes: 'Fabricación FDM según el alcance acordado.',
  quotePricing: calculateManualQuote(inputs, 1),
};
const user = { id: 'u1', role: 'admin', email: 'taller@vertice.cr' };

function renderAction(overrides = {}) {
  return render(<MemoryRouter><RequestNextAction request={{ ...request, ...overrides }} user={user} language="es" onSaved={jest.fn()} /></MemoryRouter>);
}

describe('paso de envío de cotización', () => {
  it('explica el cambio de estado y exige confirmación antes de guardar una cotización DEMO', async () => {
    const onSaved = jest.fn();
    render(<MemoryRouter><RequestNextAction request={{ ...request, status: 'IN_REVIEW' }} user={user} language="es" onSaved={onSaved} /></MemoryRouter>);
    const prepare = await screen.findByRole('button', { name: 'Preparar cotización DEMO' });
    await waitFor(() => expect(prepare).toBeEnabled());
    fireEvent.click(prepare);
    expect(screen.getByText(/guarda una estimación DEMO y pasa la solicitud a «Cotizada»\. No envía ningún correo/)).toBeInTheDocument();
    expect(automationAction).not.toHaveBeenCalledWith('/admin/actions/auto-quote', expect.anything(), expect.anything());
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByRole('group', { name: 'Confirmar cotización DEMO' })).not.toBeInTheDocument();
    expect(automationAction).not.toHaveBeenCalledWith('/admin/actions/auto-quote', expect.anything(), expect.anything());
    fireEvent.click(prepare);
    fireEvent.click(screen.getByRole('button', { name: 'Guardar estimación DEMO' }));
    await waitFor(() => expect(automationAction).toHaveBeenCalledWith('/admin/actions/auto-quote', expect.objectContaining({ requestId: 'r2', expectedStatus: 'IN_REVIEW' }), { token: undefined }));
    await waitFor(() => expect(onSaved).toHaveBeenCalled());
  });

  it('muestra el motivo y guarda una revisión sin enviar la oferta anterior', async () => {
    transitionRequest.mockResolvedValue({});
    renderAction({ status: 'CHANGES_REQUESTED', customerDecisionReason: 'Necesito un acabado distinto' });
    expect(screen.getByText('Necesito un acabado distinto')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Enviar al cliente y copiarme' })).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox', { name: 'Alcance y condiciones para el cliente' }), { target: { value: 'Nuevo acabado acordado.' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Guardar cotización' }).closest('form'));
    await waitFor(() => expect(transitionRequest).toHaveBeenCalledWith(expect.objectContaining({ action: 'save-quote', expectedStatus: 'CHANGES_REQUESTED', expectedVersion: 2, notes: 'Nuevo acabado acordado.' }), { token: undefined }));
    expect(sendQuoteEmail).not.toHaveBeenCalled();
  });
  afterEach(() => { cleanup(); jest.clearAllMocks(); });

  it('muestra los dos destinatarios y pasa a aprobación solo tras confirmar el envío', async () => {
    sendQuoteEmail.mockResolvedValue({ request: { status: 'AWAITING_APPROVAL' } });
    renderAction();
    expect(screen.getByText(/Para: cliente@vertice.cr/)).toBeInTheDocument();
    expect(screen.getByText(/Copia oculta: taller@vertice.cr/)).toBeInTheDocument();
    expect(screen.queryByText(/Probar correo conmigo/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Enviar al cliente y copiarme' }));
    await waitFor(() => expect(sendQuoteEmail).toHaveBeenCalledWith({ requestId: 'r2', actorId: 'u1', expectedVersion: 2 }, { token: undefined }));
    expect(await screen.findByText(/Correo enviado al cliente con copia oculta/)).toHaveAttribute('role', 'status');
    expect(transitionRequest).not.toHaveBeenCalled();
  });

  it('bloquea el envío cuando la dirección aún es un correo de ejemplo', async () => {
    renderAction({ customerEmail: 'ana@example.com' });
    expect(await screen.findByText(/contienen correos de ejemplo o inválidos/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar al cliente y copiarme' })).toBeDisabled();
  });

  it('permite devolver la solicitud a revisión técnica y muestra título de cotización registrada', async () => {
    transitionRequest.mockResolvedValue({ request: { status: 'IN_REVIEW' } });
    renderAction();
    expect(screen.getByText('Cotización registrada · Lista para enviar')).toBeInTheDocument();
    const reopenBtn = screen.getByRole('button', { name: 'Devolver a revisión técnica' });
    expect(reopenBtn).toBeInTheDocument();
    fireEvent.click(reopenBtn);
    await waitFor(() => expect(transitionRequest).toHaveBeenCalledWith(
      expect.objectContaining({ requestId: 'r2', actorId: 'u1', action: 'reopen-review', expectedStatus: 'QUOTED', expectedVersion: 2 }),
      { token: undefined }
    ));
    expect(await screen.findByText(/Solicitud devuelta a revisión técnica/)).toHaveAttribute('role', 'status');
  });
});
