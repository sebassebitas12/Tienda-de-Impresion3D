import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PreferencesProvider } from '../src/app/providers/PreferencesProvider.jsx';
import { AdminCatalogDetailPage, AdminCatalogPage } from '../src/features/admin/AdminCatalog.jsx';
import { getAdminCatalogData } from '../src/services/adminCatalogService.js';
import { buildAdminCatalog, filterAdminCatalog, summarizeAdminCatalog } from '../src/utils/adminCatalog.js';

jest.mock('../src/services/adminCatalogService.js', () => ({ getAdminCatalogData: jest.fn() }));

const rawData = {
  products: [
    { id: 'p1', name: 'Organizador modular', slug: 'organizador', categoryId: 'c1', description: 'Sistema de escritorio', images: ['/products/organizador.jpg'], price: 8500, currency: 'CRC', material: 'PLA', availableColors: ['Negro', 'Blanco'], dimensions: '180 × 120 × 60 mm', weightGrams: 95, estimatedProductionHours: 2.5, status: 'ACTIVE', featured: true, stock: 20, minStock: 10 },
    { id: 'p2', name: 'Dragón articulado', slug: 'dragon', categoryId: 'c2', price: 12000, material: 'PLA Silk', status: 'ACTIVE', featured: false, stock: 20 },
  ],
  categories: [{ id: 'c1', name: 'Organización' }, { id: 'c2', name: 'Colección' }],
};

function renderAdmin(path = '/admin/catalogo') {
  return render(<MemoryRouter initialEntries={[path]}><PreferencesProvider><Routes>
    <Route path="/admin/catalogo" element={<AdminCatalogPage />} />
    <Route path="/admin/catalogo/:id" element={<AdminCatalogDetailPage />} />
  </Routes></PreferencesProvider></MemoryRouter>);
}

describe('administración del catálogo', () => {
  afterEach(() => { cleanup(); jest.clearAllMocks(); localStorage.clear(); });

  it('enriquece el catálogo con categoría y detecta materiales fuera de FDM vigente', () => {
    const products = buildAdminCatalog(rawData);
    expect(products.find(product => product.id === 'p1').category.name).toBe('Organización');
    expect(summarizeAdminCatalog(products)).toMatchObject({ all: 2, needsReview: 1, statuses: { ACTIVE: 2 }, materials: { PLA: 1, 'PLA SILK': 1 } });
    expect(filterAdminCatalog(products, { material: 'PLA' }).map(product => product.id)).toEqual(['p1']);
    expect(filterAdminCatalog(products, { query: 'colección' }).map(product => product.id)).toEqual(['p2']);
  });

  it('muestra modelos, permite filtrar y nunca presenta los campos heredados de inventario', async () => {
    getAdminCatalogData.mockResolvedValue(rawData);
    renderAdmin();
    expect(await screen.findByText(/1 registro\(s\) usan un material fuera de la capacidad vigente/)).toBeInTheDocument();
    await waitFor(() => expect(document.querySelectorAll('.admin-catalog-row')).toHaveLength(2));
    expect(screen.queryByText(/stock|existencias/i)).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar modelo' }), { target: { value: 'organizador' } });
    await waitFor(() => expect(document.querySelectorAll('.admin-catalog-row')).toHaveLength(1));
    expect(screen.getByRole('link', { name: /Organizador modular/ })).toHaveAttribute('href', '/admin/catalogo/p1');
  });

  it('reemplaza una URL de foto rota por una señal legible', async () => {
    getAdminCatalogData.mockResolvedValue(rawData);
    const { container } = renderAdmin();
    await screen.findByRole('link', { name: /Organizador modular/ });
    const images = [...container.querySelectorAll('img')];
    images.forEach(image => fireEvent.error(image));
    expect(await screen.findAllByText('Sin foto')).toHaveLength(2);
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('muestra ficha informativa y permite corregir un material antiguo', async () => {
    getAdminCatalogData.mockResolvedValue(rawData);
    renderAdmin('/admin/catalogo/p2');
    expect(await screen.findByRole('heading', { name: 'Dragón articulado' })).toBeInTheDocument();
    expect(screen.getByText(/Material fuera de la capacidad vigente/)).toBeInTheDocument();
    expect(screen.getByText(/se fabrica después de recibir el pedido/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Editar|Edit/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ocultar|Hide/ })).toBeInTheDocument();
  });

  it('presenta los datos registrados sin hacer cálculos de precio ni mostrar existencias', async () => {
    getAdminCatalogData.mockResolvedValue(rawData);
    renderAdmin('/admin/catalogo/p1');
    const heading = await screen.findByRole('heading', { name: 'Organizador modular' });
    expect(heading).toBeInTheDocument();
    expect(screen.getByText(/₡8.?500/)).toBeInTheDocument();
    expect(screen.getByText('180 × 120 × 60 mm')).toBeInTheDocument();
    expect(screen.queryByText('20')).not.toBeInTheDocument();
  });
});
