import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { CustomerQuotesPage } from '../src/pages/CustomerQuotesPage.jsx';
import { useAuth } from '../src/hooks/useAuth.js';
import { usePreferences } from '../src/hooks/usePreferences.js';
import { automationAction } from '../src/services/automationService.js';

jest.mock('../src/hooks/useAuth.js', () => ({ useAuth: jest.fn() }));
jest.mock('../src/hooks/usePreferences.js', () => ({ usePreferences: jest.fn() }));
jest.mock('../src/services/automationService.js', () => ({ automationAction: jest.fn(), automationError: code => code || 'Error' }));
jest.mock('../src/services/commerceService.js', () => ({ fetchMyOrders: jest.fn().mockResolvedValue({ orders: [] }) }));

const offer = {
  id: 'r1', userId: 'c1', status: 'AWAITING_APPROVAL', description: 'Soporte modular',
  quantity: 2, material: 'PETG', quotedPrice: 9500, quoteVersion: 2,
  quoteValidUntil: '2099-10-10T23:59:59Z', quoteNotes: 'No incluye envío.',
  quotePricing: { mode: 'DEMO', breakdown: { materialCrc: 2000, wearCrc: 200, electricityCrc: 300, postProcessCrc: 500, designCrc: 0, otherCostsCrc: 0, costSubtotalCrc: 3000, markupPercent: 50, amountCrc: 4500 } },
};

function setup(request = offer, entry = '/cuenta', user = { id: 'c1', name: 'Ana', role: 'customer' }, actionImplementation) {
  useAuth.mockReturnValue({ user, token: 'sim-token' });
  usePreferences.mockReturnValue({ language: 'es' });
  automationAction.mockImplementation(actionImplementation || (async () => ({ requests: request ? [request] : [] })));
  return render(<MemoryRouter initialEntries={[entry]}><Routes>
    <Route path="/cuenta" element={<CustomerQuotesPage />} />
    <Route path="/pedidos/:id" element={<ReceiptProbe />} />
  </Routes></MemoryRouter>);
}

function ReceiptProbe() { const { id } = useParams(); return <output>recibo:{id}</output>; }

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
    expect(await screen.findByText(/Comprobante DEMO ord-44 registrado/)).toBeInTheDocument();
    expect(screen.getByText(/No se transfirió dinero real/)).toBeInTheDocument();
  });

  it('lleva al carrito una cotización aprobada para continuar el pago', async () => {
    setup({ ...offer, status: 'APPROVED' }, '/cuenta', undefined, async path => path === '/quotes/mine'
      ? { requests: [{ ...offer, status: 'APPROVED' }] }
      : { order: { id: 'ord-quote-1' } });
    fireEvent.click(await screen.findByRole('button', { name: /Continuar al carrito/ }));
    expect(automationAction).toHaveBeenCalledWith('/quotes/checkout', { requestId: 'r1', expectedVersion: 2 }, { token: 'sim-token' });
  });

  it('orienta al administrador a su panel en vez de dejar un enlace suelto en /cuenta', async () => {
    setup(null, '/cuenta', { id: 'a1', name: 'Sebastián', role: 'admin' });
    expect(await screen.findByRole('heading', { name: /tu espacio de taller/i })).toBeInTheDocument();
    expect(screen.getByText(/solicitudes, catálogo, clientes y actividad/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /abrir administración/i })).toHaveAttribute('href', '/admin');
    expect(screen.getByRole('link', { name: /volver a la tienda/i })).toHaveAttribute('href', '/catalogo');
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });
});
