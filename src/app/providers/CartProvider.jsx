import { useState } from 'react';
import { CartContext } from './contexts.js';
import { cleanCart } from '../../utils/cart.js';
import { readPreference } from '../../utils/preferences.js';

const KEY = 'vertice-cart-v1';
export function CartProvider({ children }) {
  const [lines, setLines] = useState(() => {
    try { return cleanCart(JSON.parse(readPreference(KEY, '[]'))); } catch { return []; }
  });
  const [storageError, setStorageError] = useState(false);
  function commit(next) {
    setLines(next);
    try { window.localStorage.setItem(KEY, JSON.stringify(next)); setStorageError(false); }
    catch { setStorageError(true); }
  }
  const add = (productId, color, quantity) => {
    if (!Number.isSafeInteger(quantity) || quantity < 1) return false;
    const exists = lines.find(line => line.productId === String(productId) && line.color === color);
    if (exists && !Number.isSafeInteger(exists.quantity + quantity)) return false;
    commit(cleanCart(exists ? lines.map(line => line === exists ? { ...line, quantity: line.quantity + quantity } : line)
      : [...lines, { productId: String(productId), color, quantity }]));
    return true;
  };
  const update = (productId, color, quantity) => {
    if (!Number.isSafeInteger(quantity) || quantity < 1) return false;
    commit(lines.map(line => line.productId === productId && line.color === color ? { ...line, quantity } : line));
    return true;
  };
  const remove = (productId, color) => commit(lines.filter(line => line.productId !== productId || line.color !== color));
  return <CartContext.Provider value={{ lines, add, update, remove, storageError, count: lines.reduce((sum, line) => sum + line.quantity, 0) }}>{children}</CartContext.Provider>;
}
