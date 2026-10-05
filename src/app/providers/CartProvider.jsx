import { useMemo, useSyncExternalStore } from 'react';
import { CartContext } from './contexts.js';
import { cleanCart } from '../../utils/cart.js';
import { useAuth } from '../../hooks/useAuth.js';

const LEGACY_KEY = 'vertice-cart-v1';
const GUEST_KEY = 'vertice-cart-v2:guest';
const userCartKey = userId => `vertice-cart-v2:user:${encodeURIComponent(String(userId))}`;

function readCart(key) {
  if (!key) return [];
  try { return cleanCart(JSON.parse(window.localStorage.getItem(key) || '[]')); }
  catch { return []; }
}

function initialCart(key) {
  if (!key) return { lines: [], storageError: false };
  try {
    const stored = window.localStorage.getItem(key);
    if (key === GUEST_KEY && stored === null) {
      const legacy = window.localStorage.getItem(LEGACY_KEY);
      return { lines: legacy === null ? [] : cleanCart(JSON.parse(legacy)), storageError: false };
    }
    return { lines: cleanCart(JSON.parse(stored || '[]')), storageError: false };
  } catch {
    return { lines: [], storageError: false };
  }
}

function mergeLines(...carts) {
  const merged = new Map();
  carts.flat().forEach(line => {
    const key = JSON.stringify([line.productId, line.color]);
    const existing = merged.get(key);
    const quantity = (existing?.quantity || 0) + line.quantity;
    if (Number.isSafeInteger(quantity)) merged.set(key, { productId: line.productId, color: line.color, quantity });
  });
  return [...merged.values()];
}

function createCartStore(key) {
  let snapshot = initialCart(key);
  let didMigrate = false;
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
      if (!didMigrate && key === GUEST_KEY) {
        didMigrate = true;
        try {
          if (window.localStorage.getItem(GUEST_KEY) === null) {
            const legacy = window.localStorage.getItem(LEGACY_KEY);
            if (legacy !== null) window.localStorage.setItem(GUEST_KEY, JSON.stringify(snapshot.lines));
          }
        } catch {
          publish({ ...snapshot, storageError: true });
        }
      }
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
      if (!key || !Number.isSafeInteger(quantity) || quantity < 1) return false;
      const current = snapshot.lines;
      const exists = current.find(line => line.productId === String(productId) && line.color === color);
      if (exists && !Number.isSafeInteger(exists.quantity + quantity)) return false;
      return store.commit(exists ? current.map(line => line === exists ? { ...line, quantity: line.quantity + quantity } : line)
        : [...current, { productId: String(productId), color, quantity }]);
    },
    update(productId, color, quantity) {
      if (!key || !Number.isSafeInteger(quantity) || quantity < 1) return false;
      return store.commit(snapshot.lines.map(line => line.productId === productId && line.color === color ? { ...line, quantity } : line));
    },
    remove(productId, color) {
      return store.commit(snapshot.lines.filter(line => line.productId !== productId || line.color !== color));
    },
    clear() { return store.commit([]); },
    importGuestCart(user) {
      if (!key || !user?.id || user.role !== 'customer') return false;
      try {
        const guestLines = key === GUEST_KEY ? snapshot.lines : readCart(GUEST_KEY);
        const destination = userCartKey(user.id);
        const merged = mergeLines(readCart(destination), guestLines);
        window.localStorage.setItem(destination, JSON.stringify(merged));
        window.localStorage.removeItem(GUEST_KEY);
        if (key === destination) publish({ lines: merged, storageError: false });
        else if (key === GUEST_KEY) publish({ lines: [], storageError: false });
        return true;
      } catch {
        publish({ ...snapshot, storageError: true });
        return false;
      }
    },
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
  importGuestCart: () => false,
};

export function CartProvider({ children }) {
  const auth = useAuth();
  const storageKey = auth?.isRestoring ? null : auth?.user?.id ? userCartKey(auth.user.id) : GUEST_KEY;
  const cartStore = useMemo(() => storageKey ? createCartStore(storageKey) : restoringStore, [storageKey]);
  const snapshot = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getSnapshot);
  const lines = cartStore.ready ? snapshot.lines : [];
  const value = {
    lines,
    add: cartStore.add,
    update: cartStore.update,
    remove: cartStore.remove,
    clear: cartStore.clear,
    importGuestCart: cartStore.importGuestCart,
    ready: cartStore.ready,
    storageError: cartStore.ready && snapshot.storageError,
    count: lines.reduce((sum, line) => sum + line.quantity, 0),
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
