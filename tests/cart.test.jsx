import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { CartProvider } from '../src/app/providers/CartProvider.jsx';
import { useCart } from '../src/hooks/useCart.js';
import { cleanCart, reconcileCart } from '../src/utils/cart.js';

function Controls() {
  const cart = useCart();
  return <><output>{cart.count}</output><button onClick={() => cart.add('p1', 'Negro', 2)}>Agregar</button><button onClick={() => cart.update('p1', 'Negro', 0)}>Inválido</button><button onClick={() => cart.remove('p1', 'Negro')}>Quitar</button>{cart.storageError && <span role="alert">No se pudo guardar</span>}</>;
}
describe('carrito de catálogo bajo pedido', () => {
  afterEach(() => { cleanup(); localStorage.clear(); jest.restoreAllMocks(); });
  it('combina variantes iguales, persiste sin precios y restaura cantidades', () => {
    const { unmount } = render(<CartProvider><Controls /></CartProvider>);
    fireEvent.click(screen.getByText('Agregar')); fireEvent.click(screen.getByText('Agregar'));
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('vertice-cart-v1'))).toEqual([{ productId: 'p1', color: 'Negro', quantity: 4 }]);
    fireEvent.click(screen.getByText('Inválido')); expect(screen.getByText('4')).toBeInTheDocument();
    unmount(); render(<CartProvider><Controls /></CartProvider>); expect(screen.getByText('4')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Quitar')); expect(screen.getByText('0')).toBeInTheDocument();
  });
  it('usa precios actuales y publicación/color; nunca usa stock', () => {
    const lines = [{ productId: 'p1', color: 'Negro', quantity: 3 }];
    const products = [{ id: 'p1', status: 'ACTIVE', material: 'PLA', currency: 'CRC', price: 2000, availableColors: ['Negro'], stock: 0 }];
    expect(reconcileCart(lines, products)[0]).toMatchObject({ available: true, subtotal: 6000 });
    expect(reconcileCart(lines, [{ ...products[0], status: 'INACTIVE' }])[0]).toMatchObject({ available: false, subtotal: null });
    expect(reconcileCart(lines, [])[0].available).toBeFalsy();
    expect(cleanCart([{ ...lines[0], quantity: 1.5 }])).toEqual([]);
  });
  it('mantiene el carrito usable y avisa cuando el almacenamiento falla', () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('unavailable'); });
    render(<CartProvider><Controls /></CartProvider>); fireEvent.click(screen.getByText('Agregar'));
    expect(screen.getByText('2')).toBeInTheDocument(); expect(screen.getByRole('alert')).toHaveTextContent('No se pudo guardar');
  });
});
