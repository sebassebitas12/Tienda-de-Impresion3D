import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PreferencesProvider } from '../src/app/providers/PreferencesProvider.jsx';
import { AdminCatalogDetailPage, AdminCatalogPage } from '../src/features/admin/AdminCatalog.jsx';
import { getAdminCatalogData } from '../src/services/adminCatalogService.js';
import { buildAdminCatalog, filterAdminCatalog, isCatalogProductReadyToPublish, summarizeAdminCatalog } from '../src/utils/adminCatalog.js';
import { isOrderableProduct } from '../src/utils/cart.js';

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
    expect(screen.getByRole('link', { name: 'Calcular precio DEMO para Organizador modular' })).toHaveAttribute('href', '/admin/catalogo/p1/editar#cotizador');
    expect(screen.getByRole('link', { name: 'Calcular precio DEMO para Dragón articulado' })).toHaveAttribute('href', '/admin/catalogo/p2/editar#cotizador');
    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar modelo' }), { target: { value: 'organizador' } });
    await waitFor(() => expect(document.querySelectorAll('.admin-catalog-row')).toHaveLength(1));
    expect(screen.getByRole('link', { name: 'Organizador modular Organización' })).toHaveAttribute('href', '/admin/catalogo/p1');
  });

  it('reemplaza una URL de foto rota por una señal legible', async () => {
    getAdminCatalogData.mockResolvedValue(rawData);
    const { container } = renderAdmin();
    await screen.findByRole('link', { name: 'Organizador modular Organización' });
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

  it('mantiene accesible el filtro de borradores aunque el catálogo no tenga ninguno', async () => {
    getAdminCatalogData.mockResolvedValue(rawData);
    renderAdmin();
    const draftFilter = await screen.findByRole('button', { name: 'Borrador 0' });
    fireEvent.click(draftFilter);
    expect(draftFilter).toHaveAttribute('aria-pressed', 'true');
    expect(await screen.findByText('No hay modelos con esos filtros.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Crear primer borrador' })).toHaveAttribute('href', '/admin/catalogo/nuevo');
  });

  it('mantiene borradores sin precio fuera de publicación y del conteo de materiales legados', async () => {
    const draft = { id: 'p7', name: 'Base para control', slug: 'base-control', categoryId: 'c1', images: ['/images/producto-base-control.jpg'], price: null, currency: 'CRC', material: null, status: 'DRAFT', featured: false };
    const draftData = { products: [rawData.products[0], draft], categories: [{ id: 'c1', name: 'Gadgets' }] };
    getAdminCatalogData.mockResolvedValue(draftData);
    renderAdmin();
    expect(await screen.findByRole('link', { name: 'Base para control Gadgets' })).toHaveAttribute('href', '/admin/catalogo/p7');
    expect(screen.getByText(/Los borradores siguen ocultos/)).toBeInTheDocument();
    const reviewLink = screen.getByRole('link', { name: 'Revisar borradores (1) ↗' });
    expect(reviewLink).toHaveAttribute('href', '/admin/catalogo?estado=DRAFT');
    fireEvent.click(reviewLink);
    await waitFor(() => expect(screen.getByRole('button', { name: /Borrador 1/ })).toHaveAttribute('aria-pressed', 'true'));
    expect(document.querySelectorAll('.admin-catalog-row')).toHaveLength(1);
    expect(screen.queryByText(/material fuera de la capacidad vigente/)).not.toBeInTheDocument();
    expect(filterAdminCatalog(buildAdminCatalog(draftData), { status: 'DRAFT' })).toHaveLength(1);
    expect(summarizeAdminCatalog(draftData.products)).toMatchObject({ drafts: 1, needsReview: 0, statuses: { DRAFT: 1 } });
    expect(isOrderableProduct(draft)).toBe(false);
  });

  it('bloquea la publicación del borrador hasta tener precio, material y categoría válidos', async () => {
    const draft = { id: 'p7', name: 'Base para control', slug: 'base-control', categoryId: 'c1', images: ['/images/producto-base-control.jpg'], price: null, currency: 'CRC', material: null, status: 'DRAFT', featured: false };
    getAdminCatalogData.mockResolvedValue({ products: [draft], categories: [{ id: 'c1', name: 'Gadgets' }] });
    renderAdmin('/admin/catalogo/p7');
    expect(await screen.findByRole('heading', { name: 'Base para control' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Publicar' })).toBeDisabled();
    expect(screen.getByText(/sigue en borrador/i)).toBeInTheDocument();
    expect(isCatalogProductReadyToPublish(draft)).toBe(false);
    expect(isCatalogProductReadyToPublish({ ...draft, price: 1200, material: 'PLA' })).toBe(true);
  });
});
