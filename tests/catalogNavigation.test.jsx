import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CatalogPage, ProductPage } from '../src/pages/Shop.jsx';
import { getAdminCatalogData } from '../src/services/adminCatalogService.js';
import { useAuth } from '../src/hooks/useAuth.js';
import { useCart } from '../src/hooks/useCart.js';
import { usePreferences } from '../src/hooks/usePreferences.js';

jest.mock('../src/services/adminCatalogService.js', () => ({ getAdminCatalogData: jest.fn() }));
jest.mock('../src/hooks/useAuth.js', () => ({ useAuth: jest.fn() }));
jest.mock('../src/hooks/useCart.js', () => ({ useCart: jest.fn() }));
jest.mock('../src/hooks/usePreferences.js', () => ({ usePreferences: jest.fn() }));
jest.mock('../src/features/products/ProductReviews.jsx', () => ({ ProductReviews: () => null }));

const catalog = {
  products: [{ id: 'p1', name: 'Organizador modular', slug: 'organizador', categoryId: 'cat1', description: 'Pieza de escritorio', images: [], price: 8500, currency: 'CRC', material: 'PLA', availableColors: ['Negro'], status: 'ACTIVE' }],
  categories: [{ id: 'cat1', name: 'Gadgets' }],
};

describe('navegación entre el catálogo y la ficha', () => {
  afterEach(() => { cleanup(); jest.clearAllMocks(); });

  it('conserva búsqueda y filtros al abrir la ficha y volver al catálogo', async () => {
    getAdminCatalogData.mockResolvedValue(catalog);
    useAuth.mockReturnValue({ user: null });
    useCart.mockReturnValue({ ready: false, add: jest.fn() });
    usePreferences.mockReturnValue({ language: 'es' });

    render(<MemoryRouter initialEntries={['/catalogo?categoria=cat1&material=PLA&buscar=organizador']}>
      <Routes>
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/producto/:id" element={<ProductPage />} />
      </Routes>
    </MemoryRouter>);

    fireEvent.click(await screen.findByRole('link', { name: 'Elegir pieza: Organizador modular' }));
    expect(await screen.findByRole('heading', { name: 'Organizador modular' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Volver al catálogo/ })).toHaveAttribute('href', '/catalogo?categoria=cat1&material=PLA&buscar=organizador');
  });
});
