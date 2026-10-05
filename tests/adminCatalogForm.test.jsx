import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PreferencesProvider } from '../src/app/providers/PreferencesProvider.jsx';
import { AdminCategoriesPage, AdminProductFormPage } from '../src/features/admin/AdminCatalogManagement.jsx';
import { AdminCatalogDetailPage } from '../src/features/admin/AdminCatalog.jsx';
import { automationAction } from '../src/services/automationService.js';
import { createAdminCategory, createAdminProduct, deleteAdminCategory, deleteAdminProduct, getAdminCatalogData, getAdminCatalogReferences, updateAdminProduct } from '../src/services/adminCatalogService.js';

jest.mock('../src/hooks/useAuth.js', () => ({ useAuth: () => ({ token: 'admin-token' }) }));
jest.mock('../src/services/automationService.js', () => {
  const actual = jest.requireActual('../src/services/automationService.js');
  return {
    automationAction: jest.fn(),
    automationError: actual.automationError,
  };
});

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
  automationAction.mockReset();
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

  it('ofrece un acceso directo al cotizador DEMO de la pieza seleccionada', async () => {
    render(<PreferencesProvider><MemoryRouter initialEntries={['/admin/catalogo/p7']}><Routes><Route path="/admin/catalogo/:id" element={<AdminCatalogDetailPage />} /></Routes></MemoryRouter></PreferencesProvider>);
    await screen.findByRole('heading', { name: 'Base para control' });
    expect(screen.getByRole('link', { name: 'Calcular precio DEMO' })).toHaveAttribute('href', '/admin/catalogo/p7/editar#cotizador');
  });
});
afterEach(cleanup);

describe('Fotos y publicación del formulario Admin', () => {
  it('pide una ficha al agente, llena campos y no cotiza sus gramos/horas sin validación', async () => {
    automationAction.mockResolvedValue({
      reply: 'Propuesta lista para revisar.',
      productDraft: { description: 'Soporte compacto para mantener el teléfono elevado sobre el escritorio.', material: 'PETG', colors: ['Negro', 'Gris'], weightGrams: 45, estimatedProductionHours: 2.5, estimateBasis: 'Supuesto grueso para una pieza compacta; verificar en el laminador.' },
    });
    openForm();
    await screen.findByRole('heading', { name: 'Nuevo modelo' });
    fireEvent.change(screen.getByLabelText('Nombre', { exact: true }), { target: { value: 'Soporte para teléfono' } });
    fireEvent.click(screen.getByRole('button', { name: 'Autocompletar ficha con IA' }));
    await waitFor(() => expect(automationAction).toHaveBeenCalledWith('/assistants/chat', expect.objectContaining({ mode: 'general', task: 'catalog_product_draft', message: 'Soporte para teléfono', language: 'es' }), { token: 'admin-token' }));
    expect(await screen.findByLabelText('Descripción')).toHaveValue('Soporte compacto para mantener el teléfono elevado sobre el escritorio.');
    expect(screen.getByLabelText('Material FDM')).toHaveValue('PETG');
    expect(screen.getByLabelText('Colores sugeridos (confirmá disponibilidad)')).toHaveValue('Negro, Gris');
    expect(screen.getByLabelText('Peso (g)')).toHaveValue(45);
    expect(screen.getByLabelText('Horas estimadas de producción')).toHaveValue(2.5);
    expect(screen.getByText(/Estimación IA, no medición/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Calcular sugerencia DEMO/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent('La IA solo estimó gramos y horas');
    fireEvent.click(screen.getByRole('checkbox', { name: /Ya contrasté y actualicé los gramos y las horas/ }));
    fireEvent.click(screen.getByRole('button', { name: /Calcular sugerencia DEMO/ }));
    expect(await screen.findByText(/RESULTADO DEMO/)).toBeInTheDocument();
  });

  it('muestra advertencia cuando el nombre está vacío sin llamar a la API', async () => {
    openForm();
    await screen.findByRole('heading', { name: 'Nuevo modelo' });
    fireEvent.click(screen.getByRole('button', { name: 'Autocompletar ficha con IA' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Escribí primero el nombre del producto');
    expect(automationAction).not.toHaveBeenCalled();
  });

  it('muestra error de sesión caducada (ROLE_REQUIRED) inline bajo el botón de autocompletado', async () => {
    automationAction.mockRejectedValue(Object.assign(new Error('ROLE_REQUIRED'), { code: 'ROLE_REQUIRED' }));
    openForm();
    await screen.findByRole('heading', { name: 'Nuevo modelo' });
    fireEvent.change(screen.getByLabelText('Nombre', { exact: true }), { target: { value: 'Engranaje cónico' } });
    fireEvent.click(screen.getByRole('button', { name: 'Autocompletar ficha con IA' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('La API local no reconoce la sesión Admin');
  });

  it('muestra error cuando n8n devuelve respuesta inválida y conserva campos existentes', async () => {
    automationAction.mockRejectedValue(Object.assign(new Error('ASSISTANT_INVALID_RESPONSE'), { code: 'ASSISTANT_INVALID_RESPONSE' }));
    openForm();
    await screen.findByRole('heading', { name: 'Nuevo modelo' });
    fireEvent.change(screen.getByLabelText('Nombre', { exact: true }), { target: { value: 'Caja organizadora' } });
    fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'Texto previo del usuario' } });
    fireEvent.click(screen.getByRole('button', { name: 'Autocompletar ficha con IA' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('n8n devolvió una respuesta inválida');
    expect(screen.getByLabelText('Nombre', { exact: true })).toHaveValue('Caja organizadora');
    expect(screen.getByLabelText('Descripción')).toHaveValue('Texto previo del usuario');
  });

  it('autocompletar genera el slug automáticamente si estaba vacío', async () => {
    automationAction.mockResolvedValue({
      reply: 'Ficha generada.',
      productDraft: { description: 'Soporte articulado con base roscada.', material: 'PETG', colors: ['Negro'], weightGrams: 50, estimatedProductionHours: 2.0, estimateBasis: 'Volumen referencial' },
    });
    openForm();
    await screen.findByRole('heading', { name: 'Nuevo modelo' });
    fireEvent.change(screen.getByLabelText('Nombre', { exact: true }), { target: { value: 'Brazo articulado' } });
    expect(screen.getByLabelText('Referencia URL')).toHaveValue('');
    fireEvent.click(screen.getByRole('button', { name: 'Autocompletar ficha con IA' }));
    await waitFor(() => {
      expect(screen.getByLabelText('Referencia URL')).toHaveValue('brazo-articulado');
    });
  });

  it('muestra el error de n8n y conserva los campos si la propuesta falla', async () => {
    automationAction.mockRejectedValue(Object.assign(new Error('ASSISTANT_TIMEOUT'), { code: 'ASSISTANT_TIMEOUT' }));
    openForm();
    await screen.findByRole('heading', { name: 'Nuevo modelo' });
    fireEvent.change(screen.getByLabelText('Nombre', { exact: true }), { target: { value: 'Prensa pequeña' } });
    fireEvent.click(screen.getByRole('button', { name: 'Autocompletar ficha con IA' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('n8n tardó demasiado en responder');
    expect(screen.getByLabelText('Descripción')).toHaveValue('');
  });

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

  it('promueve una foto de biblioteca a portada y conserva el resto de la galería', async () => {
    openForm('/admin/catalogo/p7/editar');
    await screen.findByRole('heading', { name: 'Editar modelo' });
    expect(screen.getByRole('button', { name: 'Usar foto: Base para control' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.change(screen.getByLabelText(/buscar en la biblioteca/i), { target: { value: 'llavero' } });
    fireEvent.click(screen.getByRole('button', { name: 'Usar foto: Llavero', exact: true }));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar modelo' }));
    await waitFor(() => expect(updateAdminProduct).toHaveBeenCalledWith('p7', expect.objectContaining({ images: ['/images/producto-llavero-charm.jpg', '/images/producto-base-control.jpg', '/images/hero-soporte.jpg'], status: 'DRAFT' })));
  });

  it('usa el borrador más reciente al elegir dos fotos seguidas', async () => {
    openForm('/admin/catalogo/p7/editar');
    await screen.findByRole('heading', { name: 'Editar modelo' });
    fireEvent.change(screen.getByLabelText(/buscar en la biblioteca/i), { target: { value: 'llavero' } });
    fireEvent.click(screen.getByRole('button', { name: 'Usar foto: Llavero', exact: true }));
    fireEvent.change(screen.getByLabelText(/buscar en la biblioteca/i), { target: { value: 'engranaje' } });
    fireEvent.click(screen.getByRole('button', { name: 'Usar foto: Engranaje', exact: true }));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar modelo' }));
    await waitFor(() => expect(updateAdminProduct).toHaveBeenCalledWith('p7', expect.objectContaining({ images: ['/images/producto-engranaje.jpg', '/images/producto-llavero-charm.jpg', '/images/producto-base-control.jpg', '/images/hero-soporte.jpg'] })));
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

  it('calcula precio de catálogo con entradas explícitas y exige confirmar una sugerencia DEMO al publicar', async () => {
    openForm();
    await screen.findByRole('heading', { name: 'Nuevo modelo' });
    fireEvent.change(screen.getByLabelText('Nombre', { exact: true }), { target: { value: 'Soporte de teléfono' } });
    fireEvent.change(screen.getByLabelText('Categoría', { exact: true }), { target: { value: 'c1' } });
    fireEvent.change(screen.getByLabelText('Material FDM'), { target: { value: 'PETG' } });
    fireEvent.change(screen.getByLabelText('Peso (g)'), { target: { value: '45' } });
    fireEvent.change(screen.getByLabelText('Horas estimadas de producción'), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: /Calcular sugerencia DEMO/ }));
    expect(await screen.findByText(/RESULTADO DEMO/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar sugerencia al borrador' }));
    expect(Number(screen.getByLabelText('Precio publicado (₡)').value)).toBeGreaterThan(0);
    fireEvent.change(screen.getByLabelText('Publicación'), { target: { value: 'ACTIVE' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar modelo' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Confirmá que revisaste el precio DEMO');
    fireEvent.click(screen.getByRole('checkbox', { name: /Revisé esta sugerencia DEMO/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar modelo' }));
    await waitFor(() => expect(createAdminProduct).toHaveBeenCalledWith(expect.objectContaining({
      status: 'ACTIVE', priceSource: 'DEMO', quotePricing: expect.objectContaining({ mode: 'DEMO' }),
      priceConfirmation: expect.objectContaining({ mode: 'DEMO' }),
    })));
  });
});
