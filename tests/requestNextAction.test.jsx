import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RequestNextAction } from '../src/features/admin/RequestNextAction.jsx';
import { sendQuoteEmail, transitionRequest } from '../src/services/adminActionsService.js';
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
  afterEach(() => { cleanup(); jest.clearAllMocks(); });

  it('muestra los dos destinatarios y pasa a aprobación solo tras confirmar el envío', async () => {
    sendQuoteEmail.mockResolvedValue({ request: { status: 'AWAITING_APPROVAL' } });
    renderAction();
    expect(screen.getByText(/Para: cliente@vertice.cr/)).toBeInTheDocument();
    expect(screen.getByText(/Copia oculta: taller@vertice.cr/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Enviar al cliente y copiarme' }));
    await waitFor(() => expect(sendQuoteEmail).toHaveBeenCalledWith({ requestId: 'r2', actorId: 'u1', expectedVersion: 2 }, { token: undefined }));
    expect(await screen.findByText(/Correo enviado al cliente con copia oculta/)).toHaveAttribute('role', 'status');
    expect(transitionRequest).not.toHaveBeenCalled();
  });

  it('bloquea el envío cuando la dirección aún es un correo de ejemplo', async () => {
    renderAction({ customerEmail: 'ana@example.com' });
    await screen.findByText('0 referencias');
    expect(screen.getByRole('button', { name: 'Enviar al cliente y copiarme' })).toBeDisabled();
    expect(screen.getByText(/contienen correos de ejemplo o inválidos/)).toBeInTheDocument();
  });
});
