import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { CartProvider } from '../src/app/providers/CartProvider.jsx';
import { AuthContext } from '../src/app/providers/contexts.js';
import { useCart } from '../src/hooks/useCart.js';
import { cleanCart, MAX_CATALOG_ORDER_QUANTITY, reconcileCart } from '../src/utils/cart.js';

function Controls() {
  const cart = useCart();
  return <><output>{cart.ready ? cart.count : 'Cargando carrito'}</output><button onClick={() => cart.add('p1', 'Negro', 2)}>Agregar</button><button onClick={() => cart.add('p1', 'Negro', MAX_CATALOG_ORDER_QUANTITY + 1)}>Exceder máximo</button><button onClick={() => cart.update('p1', 'Negro', 0)}>Inválido</button><button onClick={() => cart.remove('p1', 'Negro')}>Quitar</button><button onClick={cart.clear}>Vaciar</button>{cart.storageError && <span role="alert">No se pudo guardar</span>}</>;
}

function CartFor({ user = null, isRestoring = false, children }) {
  return <AuthContext.Provider value={{ user, isRestoring }}><CartProvider>{children || <Controls />}</CartProvider></AuthContext.Provider>;
}

describe('carrito de catálogo bajo pedido', () => {
  afterEach(() => { cleanup(); localStorage.clear(); jest.restoreAllMocks(); });
  it('solo asigna y persiste el carrito a una cuenta de cliente', () => {
    const { unmount } = render(<CartFor user={{ id: 'customer-a', role: 'customer' }} />);
    fireEvent.click(screen.getByText('Agregar'));
    fireEvent.click(screen.getByText('Agregar'));
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('vertice-cart-v2:user:customer-a'))).toEqual([{ productId: 'p1', color: 'Negro', quantity: 4 }]);
    unmount(); render(<CartFor user={{ id: 'customer-a', role: 'customer' }} />);
    expect(screen.getByText('4')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Quitar'));
    expect(screen.getByText('0')).toBeInTheDocument();
  });
  it('un visitante no puede leer ni crear un carrito', () => {
    localStorage.setItem('vertice-cart-v2:guest', JSON.stringify([{ productId: 'p1', color: 'Negro', quantity: 2 }]));
    render(<CartFor />);
    expect(screen.getByText('0')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Agregar'));
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(localStorage.getItem('vertice-cart-v2:guest')).not.toBeNull();
  });
  it('no importa selecciones históricas de visitante a una cuenta', () => {
    localStorage.setItem('vertice-cart-v2:guest', JSON.stringify([{ productId: 'p1', color: 'Negro', quantity: 2 }]));
    localStorage.setItem('vertice-cart-v1', JSON.stringify([{ productId: 'p1', color: 'Negro', quantity: 3 }]));
    render(<CartFor user={{ id: 'customer-a', role: 'customer' }} />);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(localStorage.getItem('vertice-cart-v2:user:customer-a')).toBeNull();
  });
  it('no excede el tope de 100 unidades por variante', () => {
    render(<CartFor user={{ id: 'customer-a', role: 'customer' }} />);
    fireEvent.click(screen.getByText('Exceder máximo'));
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(cleanCart([{ productId: 'p1', color: 'Negro', quantity: 101 }])).toEqual([]);
  });
  it('usa precio vigente y publicación/color; nunca usa stock', () => {
    const lines = [{ productId: 'p1', color: 'Negro', quantity: 3 }];
    const products = [{ id: 'p1', status: 'ACTIVE', material: 'PLA', currency: 'CRC', price: 2000, availableColors: ['Negro'], stock: 0 }];
    expect(reconcileCart(lines, products)[0]).toMatchObject({ available: true, subtotal: 6000 });
    expect(reconcileCart(lines, [{ ...products[0], status: 'INACTIVE' }])[0]).toMatchObject({ available: false, subtotal: null });
    expect(reconcileCart(lines, [])[0].available).toBeFalsy();
    expect(cleanCart([{ ...lines[0], quantity: 1.5 }])).toEqual([]);
  });
  it('mantiene el carrito en memoria y avisa cuando el almacenamiento falla', () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('unavailable'); });
    render(<CartFor user={{ id: 'customer-a', role: 'customer' }} />); fireEvent.click(screen.getByText('Agregar'));
    expect(screen.getByText('2')).toBeInTheDocument(); expect(screen.getByRole('alert')).toHaveTextContent('No se pudo guardar');
  });
  it('aísla pedidos entre cuentas diferentes', () => {
    const { rerender } = render(<CartFor user={{ id: 'customer-a', role: 'customer' }} />);
    fireEvent.click(screen.getByText('Agregar'));
    expect(JSON.parse(localStorage.getItem('vertice-cart-v2:user:customer-a'))).toHaveLength(1);
    rerender(<CartFor user={{ id: 'customer-b', role: 'customer' }} />);
    expect(screen.getByText('0')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Agregar'));
    expect(JSON.parse(localStorage.getItem('vertice-cart-v2:user:customer-b'))).toHaveLength(1);
    rerender(<CartFor user={{ id: 'customer-a', role: 'customer' }} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });
  it('sincroniza cambios de una misma cuenta entre pestañas', () => {
    render(<CartFor user={{ id: 'customer-a', role: 'customer' }} />);
    const event = new StorageEvent('storage', { key: 'vertice-cart-v2:user:customer-a', newValue: JSON.stringify([{ productId: 'p2', color: 'Blanco', quantity: 3 }]) });
    localStorage.setItem(event.key, event.newValue);
    act(() => window.dispatchEvent(event));
    expect(screen.getByText('3')).toBeInTheDocument();
  });
  it('no muestra el carrito hasta restaurar la identidad', () => {
    localStorage.setItem('vertice-cart-v2:user:customer-a', JSON.stringify([{ productId: 'p2', color: 'Blanco', quantity: 3 }]));
    const { rerender } = render(<CartFor isRestoring />);
    expect(screen.getByText('Cargando carrito')).toBeInTheDocument();
    rerender(<CartFor user={{ id: 'customer-a', role: 'customer' }} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
