import { useMemo, useSyncExternalStore } from 'react';
import { CartContext } from './contexts.js';
import { cleanCart, MAX_CATALOG_ORDER_QUANTITY } from '../../utils/cart.js';
import { useAuth } from '../../hooks/useAuth.js';

const userCartKey = userId => `vertice-cart-v2:user:${encodeURIComponent(String(userId))}`;

function readCart(key) {
  if (!key) return [];
  try { return cleanCart(JSON.parse(window.localStorage.getItem(key) || '[]')); }
  catch { return []; }
}

function initialCart(key) {
  try {
    return { lines: cleanCart(JSON.parse(window.localStorage.getItem(key) || '[]')), storageError: false };
  } catch {
    return { lines: [], storageError: false };
  }
}

function createCartStore(key) {
  let snapshot = initialCart(key);
  const listeners = new Set();

  const publish = next => {
    snapshot = next;
    listeners.forEach(listener => listener());
  };

  const onStorage = event => {
    if (event.key && event.key !== key) return;
    publish({ lines: event.key ? readCart(key) : [], storageError: false });
  };

  const store = {
    ready: Boolean(key),
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      if (listeners.size === 1 && key) window.addEventListener('storage', onStorage);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0 && key) window.removeEventListener('storage', onStorage);
      };
    },
    commit(lines) {
      if (!key) return false;
      let storageError = false;
      const cleaned = cleanCart(lines);
      try { window.localStorage.setItem(key, JSON.stringify(cleaned)); }
      catch { storageError = true; }
      publish({ lines: cleaned, storageError });
      return true;
    },
    add(productId, color, quantity) {
      if (!key || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > MAX_CATALOG_ORDER_QUANTITY) return false;
      const current = snapshot.lines;
      const exists = current.find(line => line.productId === String(productId) && line.color === color);
      if (exists && (!Number.isSafeInteger(exists.quantity + quantity) || exists.quantity + quantity > MAX_CATALOG_ORDER_QUANTITY)) return false;
      return store.commit(exists ? current.map(line => line === exists ? { ...line, quantity: line.quantity + quantity } : line)
        : [...current, { productId: String(productId), color, quantity }]);
    },
    update(productId, color, quantity) {
      if (!key || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > MAX_CATALOG_ORDER_QUANTITY) return false;
      return store.commit(snapshot.lines.map(line => line.productId === productId && line.color === color ? { ...line, quantity } : line));
    },
    remove(productId, color) {
      return store.commit(snapshot.lines.filter(line => line.productId !== productId || line.color !== color));
    },
    clear() { return store.commit([]); },
  };
  return store;
}

const restoringSnapshot = { lines: [], storageError: false };
const restoringStore = {
  ready: false,
  getSnapshot: () => restoringSnapshot,
  subscribe: () => () => {},
  add: () => false,
  update: () => false,
  remove: () => false,
  clear: () => false,
};

const anonymousStore = {
  ...restoringStore,
  ready: true,
  getSnapshot: () => restoringSnapshot,
};

export function CartProvider({ children }) {
  const auth = useAuth();
  const storageKey = auth?.user?.role === 'customer' && auth?.user?.id ? userCartKey(auth.user.id) : null;
  const cartStore = useMemo(() => auth?.isRestoring ? restoringStore : storageKey ? createCartStore(storageKey) : anonymousStore, [auth?.isRestoring, storageKey]);
  const snapshot = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getSnapshot);
  const lines = cartStore.ready ? snapshot.lines : [];
  const value = {
    lines,
    add: cartStore.add,
    update: cartStore.update,
    remove: cartStore.remove,
    clear: cartStore.clear,
    ready: cartStore.ready,
    storageError: cartStore.ready && snapshot.storageError,
    count: lines.reduce((sum, line) => sum + line.quantity, 0),
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
