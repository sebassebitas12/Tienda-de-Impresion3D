import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PreferencesProvider } from '../src/app/providers/PreferencesProvider.jsx';
import { CustomerInformationPage } from '../src/pages/CustomerInformationPage.jsx';
import { CustomerOrderDetailPage } from '../src/pages/CustomerOrderDetailPage.jsx';
import { useAuth } from '../src/hooks/useAuth.js';
import { usePreferences } from '../src/hooks/usePreferences.js';
import { fetchMyOrders } from '../src/services/commerceService.js';

jest.mock('../src/hooks/useAuth.js', () => ({ useAuth: jest.fn() }));
jest.mock('../src/hooks/usePreferences.js', () => ({ usePreferences: jest.fn() }));
jest.mock('../src/services/commerceService.js', () => ({ fetchMyOrders: jest.fn() }));
jest.mock('../src/services/automationService.js', () => ({ automationError: code => code || 'Error' }));

const order = {
  id: 'ord-customer-7', status: 'PENDING', total: 6800, subtotalCrc: 6800,
  createdAt: '2026-10-04T10:00:00.000Z',
  orderItems: [{ id: 'item-1', productId: 'p1', productName: 'Engranaje funcional', color: 'Negro', material: 'PETG', quantity: 2, unitPrice: 3400, subtotal: 6800 }],
};

describe('rutas informativas y detalle de pedido del cliente', () => {
  afterEach(() => { cleanup(); jest.clearAllMocks(); });

  it('muestra preguntas frecuentes accionables en español', () => {
    usePreferences.mockReturnValue({ language: 'es' });
    render(<MemoryRouter><CustomerInformationPage pageKey="faq" /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1, name: /respuestas para seguir/i })).toBeInTheDocument();
    expect(screen.getByText(/no transfieras dinero/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /catálogo de piezas/i })).toHaveAttribute('href', '/catalogo');
  });

  it('expone requisitos reales de archivos en inglés', () => {
    usePreferences.mockReturnValue({ language: 'en' });
    render(<MemoryRouter><CustomerInformationPage pageKey="requirements" /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1, name: /share only what is needed/i })).toBeInTheDocument();
    expect(screen.getByText(/up to five files per request/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /prepare a file request/i })).toHaveAttribute('href', '/solicitud/archivo');
  });

  it('carga el detalle de un pedido desde las órdenes propias y vuelve a su pestaña', async () => {
    useAuth.mockReturnValue({ token: 'sim-customer' });
    usePreferences.mockReturnValue({ language: 'es' });
    fetchMyOrders.mockResolvedValue({ orders: [order] });
    render(<MemoryRouter initialEntries={['/pedidos/ord-customer-7']}><PreferencesProvider><Routes>
      <Route path="/pedidos/:id" element={<CustomerOrderDetailPage />} />
    </Routes></PreferencesProvider></MemoryRouter>);

    expect(await screen.findByRole('heading', { name: 'Detalle del pedido' })).toBeInTheDocument();
    expect(screen.getByText('Engranaje funcional')).toBeInTheDocument();
    expect(screen.getAllByText(/₡6\s?800/)).toHaveLength(3);
    expect(screen.getByRole('link', { name: /volver a mis pedidos/i })).toHaveAttribute('href', '/cuenta?tab=orders');
    expect(fetchMyOrders).toHaveBeenCalledWith(expect.objectContaining({ token: 'sim-customer', signal: expect.any(AbortSignal) }));
  });

  it('no muestra un pedido que no pertenece a la colección entregada por el servicio', async () => {
    useAuth.mockReturnValue({ token: 'sim-customer' });
    usePreferences.mockReturnValue({ language: 'en' });
    fetchMyOrders.mockResolvedValue({ orders: [] });
    render(<MemoryRouter initialEntries={['/pedidos/other-user-order']}><PreferencesProvider><Routes>
      <Route path="/pedidos/:id" element={<CustomerOrderDetailPage />} />
    </Routes></PreferencesProvider></MemoryRouter>);

    expect(await screen.findByText('We could not find that order in your account.')).toBeInTheDocument();
  });

  it('permite reintentar una lectura temporalmente fallida', async () => {
    useAuth.mockReturnValue({ token: 'sim-customer' });
    usePreferences.mockReturnValue({ language: 'en' });
    fetchMyOrders.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({ orders: [order] });
    render(<MemoryRouter initialEntries={['/pedidos/ord-customer-7']}><PreferencesProvider><Routes>
      <Route path="/pedidos/:id" element={<CustomerOrderDetailPage />} />
    </Routes></PreferencesProvider></MemoryRouter>);

    expect(await screen.findByRole('alert')).toHaveTextContent('Error');
    screen.getByRole('button', { name: 'Try again' }).click();
    expect(await screen.findByRole('heading', { name: 'Order details' })).toBeInTheDocument();
    expect(fetchMyOrders).toHaveBeenCalledTimes(2);
  });
});
