import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PreferencesProvider } from '../src/app/providers/PreferencesProvider.jsx';
import { AdminCustomerDetailPage, AdminCustomersPage } from '../src/features/admin/AdminCustomers.jsx';
import { getAdminCustomersData } from '../src/services/adminCustomersService.js';
import { buildAdminCustomers, filterAdminCustomers } from '../src/utils/adminCustomers.js';

jest.mock('../src/services/adminCustomersService.js', () => ({ getAdminCustomersData: jest.fn() }));

const sample = {
  users: [
    { id: 'u1', name: 'Ana Rodríguez', email: 'ana@example.com', role: 'customer', status: 'ACTIVE', createdAt: '2026-08-05T14:30:00Z', demoPassword: 'never display' },
    { id: 'u2', name: 'Taller', email: 'admin@example.com', role: 'admin', status: 'ACTIVE' },
    { id: 'u3', name: 'Luis Mora', email: 'luis@example.com', role: 'customer', status: 'INACTIVE' },
  ],
  orders: [{ id: 'o1', userId: 'u1', status: 'READY', createdAt: '2026-09-01T00:00:00Z' }],
  customPrintRequests: [{ id: 'r1', userId: 'u1', status: 'IN_REVIEW', submittedAt: '2026-09-02T00:00:00Z', fileName: 'pieza.stl' }],
};

function renderCustomers(path = '/admin/clientes') {
  return render(<MemoryRouter initialEntries={[path]}><PreferencesProvider><Routes>
    <Route path="/admin/clientes" element={<AdminCustomersPage />} />
    <Route path="/admin/clientes/:id" element={<AdminCustomerDetailPage />} />
  </Routes></PreferencesProvider></MemoryRouter>);
}

describe('clientes de administración', () => {
  afterEach(() => { cleanup(); jest.clearAllMocks(); localStorage.clear(); });

  it('construye perfiles cliente y excluye roles de admin y credenciales', () => {
    const customers = buildAdminCustomers(sample);
    expect(customers.map(customer => customer.id)).toEqual(['u1', 'u3']);
    expect(customers[0].orders).toHaveLength(1);
    expect(customers[0].requests).toHaveLength(1);
    expect(customers[0]).not.toHaveProperty('demoPassword');
    expect(filterAdminCustomers(customers, 'ANA@EXAMPLE')).toHaveLength(1);
  });

  it('muestra una lista buscable y no expone credenciales demo', async () => {
    getAdminCustomersData.mockResolvedValue(sample);
    renderCustomers();
    expect(await screen.findByRole('link', { name: /Ana Rodríguez/ })).toBeInTheDocument();
    expect(screen.queryByText('never display')).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar cliente' }), { target: { value: 'luis' } });
    expect(screen.getByRole('link', { name: /Luis Mora/ })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Ana Rodríguez/ })).not.toBeInTheDocument();
  });

  it('relaciona el detalle con pedidos y solicitudes sin ofrecer mutaciones personales', async () => {
    getAdminCustomersData.mockResolvedValue(sample);
    renderCustomers('/admin/clientes/u1');
    expect(await screen.findByRole('heading', { name: 'Ana Rodríguez' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /#0001/ })).toHaveAttribute('href', '/admin/pedidos/o1');
    expect(screen.getByRole('link', { name: /pieza\.stl/ })).toHaveAttribute('href', '/admin/solicitudes/r1');
    expect(screen.queryByRole('button', { name: /editar|eliminar/i })).not.toBeInTheDocument();
  });
});
