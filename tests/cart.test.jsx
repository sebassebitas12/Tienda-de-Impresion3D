import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { useEffect } from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { CartProvider } from '../src/app/providers/CartProvider.jsx';
import { AuthContext } from '../src/app/providers/contexts.js';
import { useCart } from '../src/hooks/useCart.js';
import { cleanCart, reconcileCart } from '../src/utils/cart.js';

function Controls({ user }) {
  const cart = useCart();
  return <><output>{cart.ready ? cart.count : 'Cargando carrito'}</output><button onClick={() => cart.add('p1', 'Negro', 2)}>Agregar</button><button onClick={() => cart.update('p1', 'Negro', 0)}>Inválido</button><button onClick={() => cart.remove('p1', 'Negro')}>Quitar</button><button onClick={cart.clear}>Vaciar</button><button onClick={() => cart.importGuestCart(user)}>Importar visitante</button>{cart.storageError && <span role="alert">No se pudo guardar</span>}</>;
}

function CartFor({ user = null, isRestoring = false, children }) {
  return <AuthContext.Provider value={{ user, isRestoring }}><CartProvider>{children || <Controls user={user} />}</CartProvider></AuthContext.Provider>;
}

describe('carrito de catálogo bajo pedido', () => {
  afterEach(() => { cleanup(); localStorage.clear(); jest.restoreAllMocks(); });
  it('combina variantes iguales, persiste sin precios y restaura cantidades', () => {
    const { unmount } = render(<CartFor />);
    fireEvent.click(screen.getByText('Agregar')); fireEvent.click(screen.getByText('Agregar'));
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('vertice-cart-v2:guest'))).toEqual([{ productId: 'p1', color: 'Negro', quantity: 4 }]);
    fireEvent.click(screen.getByText('Inválido')); expect(screen.getByText('4')).toBeInTheDocument();
    unmount(); render(<CartFor />); expect(screen.getByText('4')).toBeInTheDocument();
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
    render(<CartFor />); fireEvent.click(screen.getByText('Agregar'));
    expect(screen.getByText('2')).toBeInTheDocument(); expect(screen.getByRole('alert')).toHaveTextContent('No se pudo guardar');
  });
  it('limpia y persiste el carrito después de confirmar un encargo', () => {
    render(<CartFor />);
    fireEvent.click(screen.getByText('Agregar'));
    fireEvent.click(screen.getByText('Vaciar'));
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(localStorage.getItem('vertice-cart-v2:guest')).toBe('[]');
  });
  it('aísla el carrito por cliente y no lo expone al visitante ni a otra cuenta', () => {
    const { rerender } = render(<CartFor user={{ id: 'customer-a', role: 'customer' }} />);
    fireEvent.click(screen.getByText('Agregar'));
    expect(JSON.parse(localStorage.getItem('vertice-cart-v2:user:customer-a'))).toHaveLength(1);
    rerender(<CartFor user={{ id: 'customer-b', role: 'customer' }} />);
    expect(screen.getByText('0')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Agregar'));
    expect(JSON.parse(localStorage.getItem('vertice-cart-v2:user:customer-b'))).toHaveLength(1);
    rerender(<CartFor />);
    expect(screen.getByText('0')).toBeInTheDocument();
    rerender(<CartFor user={{ id: 'customer-a', role: 'customer' }} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });
  it('migra el carrito global anterior como visitante y permite importarlo al iniciar sesión desde carrito', () => {
    localStorage.setItem('vertice-cart-v1', JSON.stringify([{ productId: 'p1', color: 'Negro', quantity: 2 }]));
    const { rerender } = render(<CartFor />);
    expect(screen.getByText('2')).toBeInTheDocument();
    rerender(<CartFor user={{ id: 'customer-a', role: 'customer' }} />);
    expect(screen.getByText('0')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Importar visitante'));
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('vertice-cart-v2:user:customer-a'))).toEqual([{ productId: 'p1', color: 'Negro', quantity: 2 }]);
    expect(localStorage.getItem('vertice-cart-v2:guest')).toBeNull();
  });
  it('aplica dos añadidos consecutivos sin perder una actualización', () => {
    render(<CartFor />);
    fireEvent.click(screen.getByText('Agregar'));
    fireEvent.click(screen.getByText('Agregar'));
    expect(screen.getByText('4')).toBeInTheDocument();
  });
  it('sincroniza cambios de la misma cuenta entre pestañas', () => {
    render(<CartFor user={{ id: 'customer-a', role: 'customer' }} />);
    const event = new StorageEvent('storage', { key: 'vertice-cart-v2:user:customer-a', newValue: JSON.stringify([{ productId: 'p2', color: 'Blanco', quantity: 3 }]) });
    localStorage.setItem(event.key, event.newValue);
    act(() => window.dispatchEvent(event));
    expect(screen.getByText('3')).toBeInTheDocument();
  });
  it('no muestra el carrito de visitante mientras restaura la identidad del cliente', () => {
    localStorage.setItem('vertice-cart-v2:guest', JSON.stringify([{ productId: 'p1', color: 'Negro', quantity: 2 }]));
    localStorage.setItem('vertice-cart-v2:user:customer-a', JSON.stringify([{ productId: 'p2', color: 'Blanco', quantity: 3 }]));
    const { rerender } = render(<CartFor isRestoring />);
    expect(screen.getByText('Cargando carrito')).toBeInTheDocument();
    rerender(<CartFor user={{ id: 'customer-a', role: 'customer' }} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });
  it('cambia de espacio al restaurar identidad sin desmontar la navegación', () => {
    const onMount = jest.fn();
    function NavigationProbe() {
      useEffect(() => { onMount(); }, []);
      return <output>Navegación estable</output>;
    }
    const { rerender } = render(<CartFor isRestoring><NavigationProbe /></CartFor>);
    rerender(<CartFor user={{ id: 'customer-a', role: 'customer' }}><NavigationProbe /></CartFor>);
    expect(screen.getByText('Navegación estable')).toBeInTheDocument();
    expect(onMount).toHaveBeenCalledTimes(1);
  });
});
