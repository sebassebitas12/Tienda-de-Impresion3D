import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CustomerQuotesPage } from '../src/pages/CustomerQuotesPage.jsx';
import { useAuth } from '../src/hooks/useAuth.js';
import { usePreferences } from '../src/hooks/usePreferences.js';
import { automationAction } from '../src/services/automationService.js';

jest.mock('../src/hooks/useAuth.js', () => ({ useAuth: jest.fn() }));
jest.mock('../src/hooks/usePreferences.js', () => ({ usePreferences: jest.fn() }));
jest.mock('../src/services/automationService.js', () => ({ automationAction: jest.fn(), automationError: code => code || 'Error' }));

const offer = {
  id: 'r1', userId: 'c1', status: 'AWAITING_APPROVAL', description: 'Soporte modular',
  quantity: 2, material: 'PETG', quotedPrice: 9500, quoteVersion: 2,
  quoteValidUntil: '2099-10-10T23:59:59Z', quoteNotes: 'No incluye envío.',
  quotePricing: { mode: 'DEMO', breakdown: { materialCrc: 2000, wearCrc: 200, electricityCrc: 300, postProcessCrc: 500, designCrc: 0, otherCostsCrc: 0, costSubtotalCrc: 3000, markupPercent: 50, amountCrc: 4500 } },
};

function setup(request = offer, entry = '/cuenta') {
  useAuth.mockReturnValue({ user: { id: 'c1', name: 'Ana', role: 'customer' }, token: 'sim-token' });
  usePreferences.mockReturnValue({ language: 'es' });
  automationAction.mockResolvedValue({ requests: request ? [request] : [] });
  return render(<MemoryRouter initialEntries={[entry]}><CustomerQuotesPage /></MemoryRouter>);
}

describe('vista de cotizaciones del cliente', () => {
  afterEach(() => { cleanup(); jest.clearAllMocks(); });

  it('muestra importe, vigencia, notas y desglose solo en espera de aprobación', async () => {
    setup();
    expect(await screen.findByText('Cotización recibida')).toBeInTheDocument();
    expect(screen.getByText(/Monto cotizado:/)).toBeInTheDocument();
    expect(screen.getByText(/Válida hasta/)).toBeInTheDocument();
    expect(screen.getByText('No incluye envío.')).toBeInTheDocument();
    expect(screen.getByText('Electricidad')).toBeInTheDocument();
    expect(screen.getByText(/Recargo aplicado/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Aprobar cotización' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Solicitar cambios / Rechazar' })).toBeInTheDocument();
  });

  it('envía la solicitud de cambios o rechazo con versión y motivo', async () => {
    setup();
    fireEvent.click(await screen.findByRole('button', { name: 'Solicitar cambios / Rechazar' }));
    fireEvent.click(screen.getByLabelText('Rechazar esta cotización'));
    fireEvent.change(screen.getByLabelText('Motivo breve (obligatorio)'), { target: { value: 'No me sirve el plazo' } });
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar rechazo' }));
    expect(automationAction).toHaveBeenLastCalledWith('/quotes/respond', {
      requestId: 'r1', expectedVersion: 2, decision: 'REJECTED', reason: 'No me sirve el plazo',
    }, { token: 'sim-token' });
  });

  it('no ofrece decisiones a una cotización que todavía no se envió al cliente', async () => {
    setup({ ...offer, status: 'QUOTED' });
    await screen.findByText('Soporte modular');
    expect(screen.queryByRole('button', { name: 'Aprobar cotización' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Solicitar cambios / Rechazar' })).not.toBeInTheDocument();
  });

  it('presenta el acuse de encargo recibido al volver a /cuenta', async () => {
    setup(null, { pathname: '/cuenta', state: { orderConfirmation: { id: 'ord-44', subtotalCrc: 5000 } } });
    expect(await screen.findByText(/Encargo ord-44 recibido/)).toBeInTheDocument();
    expect(screen.getByText(/no se ha cobrado/)).toBeInTheDocument();
  });
});
