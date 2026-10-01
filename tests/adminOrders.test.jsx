import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PreferencesProvider } from '../src/app/providers/PreferencesProvider.jsx';
import { AdminOrderDetailPage, AdminOrdersPage } from '../src/features/admin/AdminOrders.jsx';
import { getAdminOrdersData } from '../src/services/adminOrdersService.js';
import { buildAdminOrders, filterAdminOrders, summarizeOrderGroups } from '../src/utils/adminOrders.js';

jest.mock('../src/services/adminOrdersService.js', () => ({ getAdminOrdersData: jest.fn() }));

const rawData = {
  orders: [
    { id: 'o8', userId: 'u1', status: 'READY', subtotal: 4800, shipping: 2000, discount: 0, taxes: 0, total: 6800, createdAt: '2026-09-13T14:00:00Z' },
    { id: 'o1', userId: 'u2', status: 'DELIVERED', subtotal: 8500, shipping: 2000, discount: 0, taxes: 0, total: 10500, createdAt: '2026-08-15T10:00:00Z', deliveredAt: '2026-08-19T15:00:00Z' },
    { id: 'o9', userId: 'u1', status: 'UNSETTLED', total: 1200, createdAt: '2026-09-14T14:00:00Z' },
  ],
  orderItems: [
    { id: 'oi8', orderId: 'o8', productId: 'p1', quantity: 1, unitPrice: 4800, subtotal: 4800 },
    { id: 'oi1', orderId: 'o1', productId: 'p2', quantity: 1, unitPrice: 8500, subtotal: 8500 },
  ],
  products: [{ id: 'p1', name: 'Engranaje funcional', material: 'PETG' }, { id: 'p2', name: 'Organizador', material: 'PLA' }],
  users: [{ id: 'u1', name: 'Ana Rodríguez', email: 'ana@example.com' }, { id: 'u2', name: 'Diego Solano' }],
};

function readyOrders() { return buildAdminOrders(rawData); }

function renderAdmin(path = '/admin/pedidos') {
  return render(<MemoryRouter initialEntries={[path]}><PreferencesProvider><Routes>
    <Route path="/admin/pedidos" element={<AdminOrdersPage />} />
    <Route path="/admin/pedidos/:id" element={<AdminOrderDetailPage />} />
  </Routes></PreferencesProvider></MemoryRouter>);
}

describe('administración de pedidos', () => {
  afterEach(() => { cleanup(); jest.clearAllMocks(); localStorage.clear(); });

  it('enriquece pedidos con nombres de cliente/pieza y ordena por fecha reciente', () => {
    const orders = readyOrders();
    expect(orders.map(order => order.id)).toEqual(['o9', 'o8', 'o1']);
    expect(orders[1].customer.name).toBe('Ana Rodríguez');
    expect(orders[1].items[0].product.name).toBe('Engranaje funcional');
    expect(orders[1].isKnownStatus).toBe(true);
    expect(orders[0].isKnownStatus).toBe(false);
  });

  it('agrupa por estados reales y permite buscar en piezas y cliente', () => {
    const orders = readyOrders();
    expect(summarizeOrderGroups(orders)).toEqual({ all: 3, active: 1, delivered: 1, closed: 0, unrecognized: 1 });
    expect(filterAdminOrders(orders, 'active').map(order => order.id)).toEqual(['o8']);
    expect(filterAdminOrders(orders, 'all', 'engranaje').map(order => order.id)).toEqual(['o8']);
    expect(filterAdminOrders(orders, 'all', 'ana@example.com').map(order => order.id)).toEqual(['o9', 'o8']);
  });

  it('presenta una bandeja desde datos JSON Server y filtra por estado', async () => {
    getAdminOrdersData.mockResolvedValue(rawData);
    renderAdmin();

    const table = await screen.findByRole('table', { name: /Pedidos del taller/ });
    expect(within(table).getByRole('row', { name: /#0008 Ana Rodríguez/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Entregados 1/ }));
    expect(within(await screen.findByRole('table')).getByRole('row', { name: /#0001 Diego Solano/ })).toBeInTheDocument();
    expect(screen.queryByRole('row', { name: /#0008 Ana Rodríguez/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /En producción 1/ }));
    expect(screen.getByRole('row', { name: /#0008 Ana Rodríguez/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entregados 1/ })).toHaveAttribute('aria-pressed', 'true');
  });

  it('abre el detalle relacionado, muestra piezas/importe y no ofrece cambiar estado', async () => {
    getAdminOrdersData.mockResolvedValue(rawData);
    renderAdmin();

    fireEvent.click(await screen.findByRole('link', { name: /#0008/ }));
    expect(await screen.findByRole('heading', { name: 'Pedido #0008' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Engranaje funcional PETG' })).toBeInTheDocument();
    expect(screen.getByText('En producción')).toBeInTheDocument();
    expect(screen.getByText('Este registro no confirma por sí solo un pago.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /actualizar|cambiar estado/i })).not.toBeInTheDocument();
  });

  it('conserva y explica los estados ajenos al flujo documentado', async () => {
    getAdminOrdersData.mockResolvedValue(rawData);
    renderAdmin('/admin/pedidos/o9');

    expect(await screen.findByText(/El estado «UNSETTLED» no pertenece al flujo documentado/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pedido #0009' })).toBeInTheDocument();
  });
});
