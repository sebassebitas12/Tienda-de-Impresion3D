import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CustomerQuotesPage } from '../src/pages/CustomerQuotesPage.jsx';
import { useAuth } from '../src/hooks/useAuth.js';
import { usePreferences } from '../src/hooks/usePreferences.js';
import { automationAction } from '../src/services/automationService.js';
import { fetchMyOrders, submitOrderPaymentProof } from '../src/services/commerceService.js';

jest.mock('../src/hooks/useAuth.js', () => ({ useAuth: jest.fn() }));
jest.mock('../src/hooks/usePreferences.js', () => ({ usePreferences: jest.fn() }));
jest.mock('../src/services/automationService.js', () => ({ automationAction: jest.fn(), automationError: code => code || 'Error' }));
jest.mock('../src/services/commerceService.js', () => ({ fetchMyOrders: jest.fn(), submitOrderPaymentProof: jest.fn() }));

const mockOrder = {
  id: 'ord-test-999',
  userId: 'c1',
  status: 'PENDING',
  total: 8500,
  subtotalCrc: 8500,
  createdAt: '2026-10-04T12:00:00.000Z',
  orderItems: [
    { id: 'oi-1', productId: 'p1', productName: 'Brazo Robótico', color: 'Negro', material: 'PETG', quantity: 2, unitPrice: 4250, subtotal: 8500 },
  ],
};

function setupOrders(orders = [mockOrder], initialEntry = '/cuenta') {
  useAuth.mockReturnValue({ user: { id: 'c1', name: 'Ana Sofía', role: 'customer' }, token: 'sim-token' });
  usePreferences.mockReturnValue({ language: 'es' });
  automationAction.mockResolvedValue({ requests: [] });
  fetchMyOrders.mockResolvedValue({ orders });
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <CustomerQuotesPage />
    </MemoryRouter>
  );
}

describe('pestaña de pedidos de cliente en /cuenta', () => {
  afterEach(() => { cleanup(); jest.clearAllMocks(); });

  it('permite cambiar a la pestaña Mis pedidos y muestra el pedido con stepper y SINPE', async () => {
    setupOrders();
    const ordersTabBtn = await screen.findByRole('tab', { name: /Mis pedidos/i });
    expect(ordersTabBtn).toBeInTheDocument();

    fireEvent.click(ordersTabBtn);

    expect(await screen.findByText('Brazo Robótico')).toBeInTheDocument();
    expect(screen.getByText('ord-test-999')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ver detalle del pedido/i })).toHaveAttribute('href', '/pedidos/ord-test-999');
    expect(screen.getByText('Reporte de pago · demostración académica')).toBeInTheDocument();
    expect(screen.getByText(/8888-8888 es de ejemplo: no transfirás dinero/)).toBeInTheDocument();
    expect(screen.getByText('Brazo Robótico').compareDocumentPosition(screen.getByRole('button', { name: /Notificar comprobante/ })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('muestra opción de dejar opinión cuando el pedido está completado', async () => {
    setupOrders([{ ...mockOrder, id: 'ord-done-1', status: 'COMPLETED' }]);
    const ordersTabBtn = await screen.findByRole('tab', { name: /Mis pedidos/i });
    fireEvent.click(ordersTabBtn);

    expect(await screen.findByText('Dejar opinión sobre este modelo ↗')).toBeInTheDocument();
  });

  it('permite reportar comprobante SINPE y llama a submitOrderPaymentProof', async () => {
    submitOrderPaymentProof.mockResolvedValue({ order: { ...mockOrder, paymentProof: { status: 'SUBMITTED' } } });
    setupOrders();
    const ordersTabBtn = await screen.findByRole('tab', { name: /Mis pedidos/i });
    fireEvent.click(ordersTabBtn);

    const refInput = await screen.findByPlaceholderText(/Ej: 94820194/);
    const phoneInput = screen.getByPlaceholderText('8888-1234');
    const notesInput = screen.getByPlaceholderText(/Transferencia a nombre de/);

    fireEvent.change(refInput, { target: { value: 'SINPE-998877' } });
    fireEvent.change(phoneInput, { target: { value: '8888-9999' } });
    fireEvent.change(notesInput, { target: { value: 'Pago desde BAC' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Notificar comprobante al taller/i }));
    });

    expect(submitOrderPaymentProof).toHaveBeenCalledWith({
      orderId: 'ord-test-999',
      referenceNumber: 'SINPE-998877',
      sinpePhone: '8888-9999',
      proofNotes: 'Pago desde BAC',
    }, { token: 'sim-token' });
  });

  it('muestra el estado del comprobante si ya fue registrado previamente', async () => {
    setupOrders([{
      ...mockOrder,
      paymentProof: {
        referenceNumber: 'REF-776655',
        sinpePhone: '8765-4321',
        submittedAt: '2026-10-04T14:30:00.000Z',
        status: 'SUBMITTED',
        proofNotes: 'Comprobante verificado',
      },
    }]);
    const ordersTabBtn = await screen.findByRole('tab', { name: /Mis pedidos/i });
    fireEvent.click(ordersTabBtn);

    expect(await screen.findByText('COMPROBANTE REGISTRADO')).toBeInTheDocument();
    expect(screen.getByText('En verificación por taller')).toBeInTheDocument();
    expect(screen.getByText(/REF-776655/)).toBeInTheDocument();
    expect(screen.getByText(/8765-4321/)).toBeInTheDocument();
    expect(screen.getByText(/La confirmación del pago no inicia la impresión/)).toBeInTheDocument();
  });

  it('E03: pedido con paymentStatus PAID muestra badge de pago verificado y no solicita SINPE', async () => {
    setupOrders([{
      ...mockOrder,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      sourceQuoteId: 'rq-99',
    }]);
    const ordersTabBtn = await screen.findByRole('tab', { name: /Mis pedidos/i });
    fireEvent.click(ordersTabBtn);

    expect(await screen.findByText('PAGO VERIFICADO')).toBeInTheDocument();
    expect(screen.getByText('Acreditado')).toBeInTheDocument();
    expect(screen.queryByText(/Transferir el total/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Reportar comprobante/i })).not.toBeInTheDocument();
  });

  it.each([['READY', 'Listo'], ['SHIPPED', 'Enviado'], ['DELIVERED', 'Entregado']])('reconoce la etapa real %s del taller', async (status, label) => {
    setupOrders([{ ...mockOrder, status }]);
    fireEvent.click(await screen.findByRole('tab', { name: /Mis pedidos/i }));
    expect(screen.getByRole('navigation', { name: 'Progreso de taller' }).querySelector('[aria-current="step"]')).toHaveTextContent(label);
    expect(screen.queryByText('Total a liquidar')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Notificar comprobante/ })).not.toBeInTheDocument();
  });

  it('no representa un pedido cancelado como recibido o en producción', async () => {
    setupOrders([{ ...mockOrder, status: 'CANCELLED' }]);
    fireEvent.click(await screen.findByRole('tab', { name: /Mis pedidos/i }));
    expect(screen.getByText('Cancelado')).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Progreso de taller' })).not.toBeInTheDocument();
  });

  it('permite actualizar el seguimiento sin recargar la página', async () => {
    setupOrders();
    fireEvent.click(await screen.findByRole('tab', { name: /Mis pedidos/i }));
    fetchMyOrders.mockResolvedValue({ orders: [{ ...mockOrder, status: 'READY' }] });
    fireEvent.click(screen.getByRole('button', { name: 'Actualizar pedidos' }));
    expect(await screen.findByText('Listo', { selector: '.v-badge' })).toBeInTheDocument();
    expect(fetchMyOrders).toHaveBeenCalledTimes(2);
  });

  it('muestra los cargos registrados sin suponer entrega gratuita cuando faltan', async () => {
    setupOrders([{ ...mockOrder, subtotal: 6500, shipping: 2000, taxes: 0, discount: 0 }]);
    fireEvent.click(await screen.findByRole('tab', { name: /Mis pedidos/i }));
    expect(screen.getByText('Entrega registrada').nextElementSibling).toHaveTextContent('2');
    expect(screen.queryByText(/Entrega e impuestos sin confirmar/)).not.toBeInTheDocument();
  });
});
