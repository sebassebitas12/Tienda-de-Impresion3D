import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PreferencesProvider } from '../src/app/providers/PreferencesProvider.jsx';
import { AdminCategoriesPage } from '../src/features/admin/AdminCatalogManagement.jsx';
import { useAdminCatalog } from '../src/features/admin/useAdminCatalog.js';
import { createAdminCategory, updateAdminCategory } from '../src/services/adminCatalogService.js';

jest.mock('../src/features/admin/useAdminCatalog.js', () => ({ useAdminCatalog: jest.fn() }));
jest.mock('../src/services/adminCatalogService.js', () => ({
  createAdminCategory: jest.fn(), updateAdminCategory: jest.fn(), deleteAdminCategory: jest.fn(),
}));

const categories = [
  { id: 'c1', name: 'Gadgets', slug: 'gadgets', status: 'ACTIVE' },
  { id: 'c2', name: 'Figuras', slug: 'figuras', status: 'ACTIVE' },
];
const products = [{ id: 'p1', name: 'Soporte', categoryId: 'c1' }];
const retry = jest.fn();

function renderCategories() {
  return render(<MemoryRouter initialEntries={['/admin/catalogo/categorias']}><PreferencesProvider><Routes>
    <Route path="/admin/catalogo/categorias" element={<AdminCategoriesPage />} />
  </Routes></PreferencesProvider></MemoryRouter>);
}

describe('gestión visual y edición contextual de categorías', () => {
  afterEach(() => { cleanup(); jest.clearAllMocks(); localStorage.clear(); });

  it('abre el editor junto a la categoría y previsualiza su identidad sin mezclar el alta', async () => {
    useAdminCatalog.mockReturnValue({ status: 'success', categories, products, retry });
    renderCategories();

    fireEvent.click(screen.getAllByRole('button', { name: 'Editar categoría' })[0]);
    const editor = screen.getByRole('form', { name: 'Editar categoría: Gadgets' });
    const createForm = screen.getByRole('form', { name: 'Agregar categoría' });
    expect(within(editor).getByLabelText('Nombre de categoría')).toHaveValue('Gadgets');
    expect(within(createForm).getByLabelText('Nombre de categoría')).toHaveValue('');

    fireEvent.change(within(editor).getByLabelText('Nombre de categoría'), { target: { value: 'Gadgets casuales' } });
    fireEvent.change(within(editor).getByLabelText('Referencia URL'), { target: { value: 'gadgets-casuales' } });
    expect(within(editor).getByText('Gadgets casuales')).toBeInTheDocument();
    expect(within(editor).getByText('gadgets-casuales')).toBeInTheDocument();

    fireEvent.click(within(editor).getByRole('button', { name: 'Guardar categoría' }));
    await waitFor(() => expect(updateAdminCategory).toHaveBeenCalledWith('c1', {
      name: 'Gadgets casuales', slug: 'gadgets-casuales', status: 'ACTIVE',
    }));
  });

  it('crea una categoría desde el formulario de alta separado', async () => {
    useAdminCatalog.mockReturnValue({ status: 'success', categories, products, retry });
    renderCategories();
    const createForm = screen.getByRole('form', { name: 'Agregar categoría' });
    fireEvent.change(within(createForm).getByLabelText('Nombre de categoría'), { target: { value: 'Accesorios' } });
    fireEvent.click(within(createForm).getByRole('button', { name: 'Agregar categoría' }));
    await waitFor(() => expect(createAdminCategory).toHaveBeenCalledWith({
      name: 'Accesorios', slug: 'accesorios', status: 'ACTIVE',
    }));
  });
});
