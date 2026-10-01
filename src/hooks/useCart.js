import { useContext } from 'react';
import { CartContext } from '../app/providers/contexts.js';
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart requiere CartProvider');
  return context;
}
