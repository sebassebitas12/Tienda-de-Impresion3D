import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { CustomerQuotesPage } from '../src/pages/CustomerQuotesPage.jsx';
import { useAuth } from '../src/hooks/useAuth.js';
import { usePreferences } from '../src/hooks/usePreferences.js';
import { automationAction } from '../src/services/automationService.js';
import { fetchMyOrders } from '../src/services/commerceService.js';

jest.mock('../src/hooks/useAuth.js', () => ({ useAuth: jest.fn() }));
jest.mock('../src/hooks/usePreferences.js', () => ({ usePreferences: jest.fn() }));
jest.mock('../src/services/automationService.js', () => ({ automationAction: jest.fn(), automationError: code => code || 'Error' }));
jest.mock('../src/services/commerceService.js', () => ({ fetchMyOrders: jest.fn() }));

const mockOrder = {
  id: 'ord-test-999', userId: 'c1', status: 'PENDING', total: 8500, subtotalCrc: 8500,
  createdAt: '2026-10-04T12:00:00.000Z',
  orderItems: [{ id: 'oi-1', productId: 'p1', productName: 'Brazo Robótico', color: 'Negro', material: 'PETG', quantity: 2, unitPrice: 4250, subtotal: 8500 }],
};

function ReceiptProbe() {
  const { id } = useParams();
  return <output>recibo:{id}</output>;
}
function setupOrders(orders = [mockOrder]) {
  useAuth.mockReturnValue({ user: { id: 'c1', name: 'Ana Sofía', role: 'customer' }, token: 'sim-token' });
  usePreferences.mockReturnValue({ language: 'es' });
  automationAction.mockResolvedValue({ requests: [] });
  fetchMyOrders.mockResolvedValue({ orders });
  return render(<MemoryRouter initialEntries={['/cuenta']}><Routes>
    <Route path="/cuenta" element={<CustomerQuotesPage />} />
    <Route path="/pedidos/:id" element={<ReceiptProbe />} />
  </Routes></MemoryRouter>);
}

describe('pestaña Mis pedidos del cliente', () => {
  afterEach(() => { cleanup(); jest.clearAllMocks(); });

  it('muestra una orden pendiente y dirige el pago al carrito', async () => {
    setupOrders();
    fireEvent.click(await screen.findByRole('tab', { name: /Mis pedidos/i }));
    expect(await screen.findByText('Brazo Robótico')).toBeInTheDocument();
    expect(screen.getByText('ord-test-999')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Encargo · 2 piezas' })).toBeInTheDocument();
    expect(screen.getByText('Pedido pendiente de pago')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Continuar al carrito para pagar/ })).toHaveAttribute('href', '/carrito?orderId=ord-test-999');
    expect(screen.queryByRole('button', { name: /Pagar/ })).not.toBeInTheDocument();
    expect(screen.getByText(/Elegí PayPal Sandbox o reportá un SINPE desde el carrito/)).toBeInTheDocument();
  });

  it('un pedido pagado exhibe recibo DEMO sin pedir otro pago', async () => {
    setupOrders([{ ...mockOrder, status: 'CONFIRMED', paymentStatus: 'PAID', paymentMode: 'DEMO' }]);
    fireEvent.click(await screen.findByRole('tab', { name: /Mis pedidos/i }));
    expect(await screen.findByText('PAGO SIMULADO · DEMO')).toBeInTheDocument();
    expect(screen.getByText(/no se transfirió ni cobró dinero/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Pagar/ })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ver detalle del pedido/i })).toHaveAttribute('href', '/pedidos/ord-test-999');
  });

  it('permite dejar opinión cuando el pedido fue completado', async () => {
    setupOrders([{ ...mockOrder, id: 'ord-done-1', status: 'COMPLETED', paymentStatus: 'PAID', paymentMode: 'DEMO' }]);
    fireEvent.click(await screen.findByRole('tab', { name: /Mis pedidos/i }));
    expect(await screen.findByText('Dejar opinión sobre este modelo ↗')).toBeInTheDocument();
  });

  it('no presenta como pendiente de pago un pedido legado ya entregado sin historial de pago', async () => {
    setupOrders([{ ...mockOrder, status: 'DELIVERED', paymentStatus: undefined }]);
    fireEvent.click(await screen.findByRole('tab', { name: /Mis pedidos/i }));
    expect(await screen.findByText('Pago sin conciliar')).toBeInTheDocument();
    expect(screen.getByText('Historial de pago incompleto')).toBeInTheDocument();
    expect(screen.getByText(/No vuelvas a pagar desde aquí/)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Continuar al carrito para pagar/ })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Consultar al taller/ })).toHaveAttribute('href', '/contacto');
  });

  it('no deja separadores vacíos en piezas antiguas sin color ni material registrados', async () => {
    setupOrders([{ ...mockOrder, orderItems: [{ ...mockOrder.orderItems[0], color: '', material: '' }] }]);
    fireEvent.click(await screen.findByRole('tab', { name: /Mis pedidos/i }));
    expect(await screen.findByText('Material no registrado · Cant: 2')).toBeInTheDocument();
    expect(screen.queryByText(/^ · /)).not.toBeInTheDocument();
  });

  it('no ofrece reiniciar un pago que ya requiere revisión', async () => {
    setupOrders([{ ...mockOrder, paymentStatus: 'REVIEW_REQUIRED' }]);
    fireEvent.click(await screen.findByRole('tab', { name: /Mis pedidos/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Pago requiere revisión');
    expect(screen.getByRole('alert')).toHaveTextContent('No vuelvas a iniciar el pago');
    expect(screen.queryByRole('link', { name: /Continuar al carrito para pagar/ })).not.toBeInTheDocument();
  });
});
