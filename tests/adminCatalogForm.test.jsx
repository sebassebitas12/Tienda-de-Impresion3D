import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PreferencesProvider } from '../src/app/providers/PreferencesProvider.jsx';
import { AdminCategoriesPage, AdminProductFormPage } from '../src/features/admin/AdminCatalogManagement.jsx';
import { AdminCatalogDetailPage } from '../src/features/admin/AdminCatalog.jsx';
import { createAdminCategory, createAdminProduct, deleteAdminCategory, deleteAdminProduct, getAdminCatalogData, getAdminCatalogReferences, updateAdminProduct } from '../src/services/adminCatalogService.js';

jest.mock('../src/services/adminCatalogService.js', () => ({
  getAdminCatalogData: jest.fn(), createAdminProduct: jest.fn(), updateAdminProduct: jest.fn(),
  createAdminCategory: jest.fn(), updateAdminCategory: jest.fn(), deleteAdminCategory: jest.fn(),
  getAdminCatalogReferences: jest.fn(), deleteAdminProduct: jest.fn(), AdminCatalogMutationError: Error,
}));

const product = { id: 'p7', name: 'Base para control', slug: 'base-control', categoryId: 'c1', status: 'DRAFT', price: null, material: null, images: ['/images/producto-base-control.jpg', '/images/hero-soporte.jpg'] };
const categories = [{ id: 'c1', name: 'Gadgets', status: 'ACTIVE' }];

function openForm(path = '/admin/catalogo/nuevo') {
  render(<PreferencesProvider><MemoryRouter initialEntries={[path]}><Routes>
    <Route path="/admin/catalogo/nuevo" element={<AdminProductFormPage />} />
    <Route path="/admin/catalogo/:id/editar" element={<AdminProductFormPage />} />
    <Route path="/admin/catalogo" element={<p>Catálogo actualizado</p>} />
  </Routes></MemoryRouter></PreferencesProvider>);
}

beforeEach(() => {
  localStorage.clear(); jest.clearAllMocks();
  getAdminCatalogData.mockResolvedValue({ products: [product], categories });
  createAdminProduct.mockResolvedValue({ id: 'new' }); updateAdminProduct.mockResolvedValue(product);
});

describe('Categorías y bajas confirmadas', () => {
  function openCategories() {
    render(<PreferencesProvider><MemoryRouter><AdminCategoriesPage /></MemoryRouter></PreferencesProvider>);
  }

  it('genera referencia desde el nombre completo escrito y permite una referencia explícita', async () => {
    openCategories();
    const name = await screen.findByLabelText('Nombre de categoría');
    await userEvent.type(name, 'Útiles del taller');
    expect(screen.getByLabelText('Referencia URL')).toHaveValue('utiles-del-taller');
    fireEvent.change(screen.getByLabelText('Referencia URL'), { target: { value: 'utiles' } });
    await userEvent.type(name, ' nuevos');
    expect(screen.getByLabelText('Referencia URL')).toHaveValue('utiles');
    fireEvent.click(screen.getByRole('button', { name: 'Agregar categoría' }));
    await waitFor(() => expect(createAdminCategory).toHaveBeenCalledWith(expect.objectContaining({ name: 'Útiles del taller nuevos', slug: 'utiles' })));
  });

  it('permite cancelar la baja de categoría vacía y exige confirmación antes de borrarla', async () => {
    getAdminCatalogData.mockResolvedValue({ products: [], categories });
    openCategories();
    fireEvent.click(await screen.findByRole('button', { name: 'Eliminar', exact: true }));
    const dialog = screen.getByRole('dialog', { name: 'Eliminar categoría' });
    expect(within(dialog).getByText('Gadgets')).toBeInTheDocument();
    expect(deleteAdminCategory).not.toHaveBeenCalled();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Cancelar', exact: true }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar', exact: true }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar eliminación' }));
    await waitFor(() => expect(deleteAdminCategory).toHaveBeenCalledWith('c1'));
  });

  it('bloquea borrar un modelo con pedido antes de ofrecer la confirmación', async () => {
    getAdminCatalogReferences.mockResolvedValue([{ productId: 'p7' }]);
    render(<PreferencesProvider><MemoryRouter initialEntries={['/admin/catalogo/p7']}><Routes><Route path="/admin/catalogo/:id" element={<AdminCatalogDetailPage />} /></Routes></MemoryRouter></PreferencesProvider>);
    fireEvent.click(await screen.findByRole('button', { name: 'Eliminar', exact: true }));
    expect(await screen.findByRole('alert')).toHaveTextContent('forma parte del historial de pedidos');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(deleteAdminProduct).not.toHaveBeenCalled();
  });

  it('devuelve el foco al disparador al cancelar la baja de producto', async () => {
    getAdminCatalogReferences.mockResolvedValue([]);
    render(<PreferencesProvider><MemoryRouter initialEntries={['/admin/catalogo/p7']}><Routes><Route path="/admin/catalogo/:id" element={<AdminCatalogDetailPage />} /></Routes></MemoryRouter></PreferencesProvider>);
    const trigger = await screen.findByRole('button', { name: 'Eliminar', exact: true });
    await userEvent.click(trigger);
    await screen.findByRole('dialog', { name: 'Eliminar modelo' });
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar', exact: true }));
    expect(trigger).toHaveFocus();
    expect(deleteAdminProduct).not.toHaveBeenCalled();
  });
});
afterEach(cleanup);

describe('Fotos y publicación del formulario Admin', () => {
  it('crea un borrador sin inventar precio/material y guarda la foto seleccionada', async () => {
    openForm();
    await screen.findByRole('heading', { name: 'Nuevo modelo' });
    fireEvent.change(screen.getByLabelText('Nombre', { exact: true }), { target: { value: 'Modelo de prueba' } });
    fireEvent.change(screen.getByLabelText('Categoría', { exact: true }), { target: { value: 'c1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Usar foto: Soporte para celular' }));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar modelo' }));
    await screen.findByText('Catálogo actualizado');
    expect(createAdminProduct).toHaveBeenCalledWith(expect.objectContaining({ status: 'DRAFT', material: null, price: null, images: ['/images/producto-soporte-celular.jpg'] }));
  });

  it('reemplaza la foto principal y conserva fotos secundarias al editar', async () => {
    openForm('/admin/catalogo/p7/editar');
    await screen.findByRole('heading', { name: 'Editar modelo' });
    expect(screen.getByRole('button', { name: 'Usar foto: Base para control' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.change(screen.getByLabelText('Buscar foto'), { target: { value: 'llavero' } });
    fireEvent.click(screen.getByRole('button', { name: 'Usar foto: Llavero', exact: true }));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar modelo' }));
    await waitFor(() => expect(updateAdminProduct).toHaveBeenCalledWith('p7', expect.objectContaining({ images: ['/images/producto-llavero-charm.jpg', '/images/hero-soporte.jpg'], status: 'DRAFT' })));
  });

  it('preserva todas las fotos registradas cuando solo cambian datos del modelo', async () => {
    openForm('/admin/catalogo/p7/editar');
    await screen.findByRole('heading', { name: 'Editar modelo' });
    fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'Descripción actualizada' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar modelo' }));
    await waitFor(() => expect(updateAdminProduct).toHaveBeenCalledWith('p7', expect.objectContaining({ images: product.images })));
  });

  it('elegir foto no permite publicar un borrador sin precio y material confirmados', async () => {
    openForm('/admin/catalogo/p7/editar');
    await screen.findByRole('heading', { name: 'Editar modelo' });
    fireEvent.change(screen.getByLabelText('Publicación'), { target: { value: 'ACTIVE' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar modelo' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Completa los campos obligatorios');
    expect(updateAdminProduct).not.toHaveBeenCalled();
  });
});
