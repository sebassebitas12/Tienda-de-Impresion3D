import { AuthServiceError, normalizeAuthSession } from './authService.js';

export const AUTH_SESSION_STORAGE_KEY = 'vertice.auth.session';
export const DEFAULT_AUTH_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

const ACTIVE_STATUS = 'ACTIVE';

function getDefaultStorage() {
  return typeof globalThis !== 'undefined' && globalThis.localStorage
    ? globalThis.localStorage
    : null;
}

function getDefaultFetch() {
  if (typeof globalThis !== 'undefined' && typeof globalThis.fetch === 'function') {
    return globalThis.fetch.bind(globalThis);
  }

  throw new AuthServiceError('AUTH_NOT_CONFIGURED', 'No existe fetch disponible para conectar JSON Server.');
}

function getDefaultBaseUrl() {
  if (typeof globalThis !== 'undefined' && globalThis.__VERTICE_JSON_SERVER_URL__) {
    return globalThis.__VERTICE_JSON_SERVER_URL__;
  }

  return 'http://localhost:3000';
}

function encodeBase64Url(value) {
  if (typeof btoa !== 'function') throw new Error('btoa no está disponible.');
  const encoded = btoa(value);
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/u, '');
}

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  if (typeof atob !== 'function') throw new Error('atob no está disponible.');
  const decoded = atob(padded);
  return JSON.parse(decoded);
}

export function createSimulatedToken(user, { now = Date.now(), ttlMs = DEFAULT_AUTH_TOKEN_TTL_MS } = {}) {
  const issuedAt = Math.floor(now / 1000);
  const expiresAt = issuedAt + Math.floor(ttlMs / 1000);
  const payload = {
    kind: 'SIMULATED_JWT',
    sub: String(user.id),
    role: String(user.role),
    iat: issuedAt,
    exp: expiresAt,
  };

  return `sim.v1.${encodeBase64Url(JSON.stringify(payload))}`;
}

export function readSimulatedToken(token) {
  if (typeof token !== 'string' || !token.startsWith('sim.v1.')) return null;

  try {
    const payload = decodeBase64Url(token.slice('sim.v1.'.length));
    if (payload.kind !== 'SIMULATED_JWT' || !payload.sub || !payload.role || !payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getTokenExpiresAt(token) {
  const payload = readSimulatedToken(token);
  if (!payload || !Number.isFinite(payload.exp)) return null;
  return payload.exp * 1000;
}

export function isTokenExpired(token, now = Date.now()) {
  const expiresAt = getTokenExpiresAt(token);
  if (expiresAt === null) return true;
  return expiresAt <= now;
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function normalizeUser(user) {
  if (!user || typeof user !== 'object' || !user.id || !user.email || !user.role || !user.status) {
    throw new AuthServiceError('INVALID_SESSION', 'JSON Server devolvió un usuario incompleto.');
  }

  return {
    id: String(user.id),
    name: user.name ? String(user.name) : '',
    email: normalizeEmail(user.email),
    role: String(user.role),
    status: String(user.status),
  };
}

function ensureActiveUser(user) {
  if (user.status !== ACTIVE_STATUS) {
    throw new AuthServiceError('AUTH_INACTIVE_USER', 'El usuario no tiene una cuenta activa.');
  }
}

function createSession(user, options) {
  const normalizedUser = normalizeUser(user);
  ensureActiveUser(normalizedUser);
  return normalizeAuthSession({
    user: normalizedUser,
    token: createSimulatedToken(normalizedUser, options),
  });
}

export function createJsonServerAuthAdapter({
  baseUrl = getDefaultBaseUrl(),
  fetchImpl,
  storage = getDefaultStorage(),
  now = () => Date.now(),
  tokenTtlMs = DEFAULT_AUTH_TOKEN_TTL_MS,
} = {}) {
  const apiUrl = String(baseUrl).replace(/\/$/u, '');
  const requestFetch = fetchImpl || ((...args) => getDefaultFetch()(...args));

  async function request(path, options) {
    let response;
    try {
      response = await requestFetch(`${apiUrl}${path}`, options);
    } catch (cause) {
      throw new AuthServiceError('AUTH_NETWORK', 'No se pudo conectar con JSON Server.', cause);
    }

    let body = null;
    try {
      body = await response.json();
    } catch {
      // DELETE y algunas respuestas de error pueden no tener JSON.
    }

    if (!response.ok) {
      throw new AuthServiceError('AUTH_API_ERROR', body?.message || `JSON Server respondió ${response.status}.`);
    }

    return body;
  }

  async function findUsersByEmail(email) {
    const query = encodeURIComponent(normalizeEmail(email));
    const users = await request(`/users?email=${query}`);
    return Array.isArray(users) ? users : [];
  }

  function persistSession(session) {
    if (storage) storage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
    return session;
  }

  function clearSession() {
    if (storage) storage.removeItem(AUTH_SESSION_STORAGE_KEY);
  }

  return {
    async login({ email, password }) {
      const users = await findUsersByEmail(email);
      const user = users[0];

      if (!user || user.demoPassword !== password) {
        throw new AuthServiceError('AUTH_INVALID_CREDENTIALS', 'El correo o la contraseña no son válidos.');
      }

      const session = createSession(user, { now: now(), ttlMs: tokenTtlMs });
      return persistSession(session);
    },

    async register({ name, email, password }) {
      const normalizedEmail = normalizeEmail(email);
      const existingUsers = await findUsersByEmail(normalizedEmail);
      if (existingUsers.length > 0) {
        throw new AuthServiceError('AUTH_EMAIL_TAKEN', 'Ya existe una cuenta con ese correo.');
      }

      const createdUser = await request('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(name).trim(),
          email: normalizedEmail,
          role: 'customer',
          status: ACTIVE_STATUS,
          demoPassword: password,
          createdAt: new Date(now()).toISOString(),
        }),
      });

      const session = createSession(createdUser, { now: now(), ttlMs: tokenTtlMs });
      return persistSession(session);
    },

    async restoreSession() {
      if (!storage) return null;

      let persisted;
      try {
        persisted = JSON.parse(storage.getItem(AUTH_SESSION_STORAGE_KEY) || 'null');
      } catch {
        clearSession();
        return null;
      }

      const tokenPayload = readSimulatedToken(persisted?.token);
      if (!persisted?.user?.id || !tokenPayload || tokenPayload.sub !== String(persisted.user.id)) {
        clearSession();
        return null;
      }

      if (tokenPayload.exp <= Math.floor(now() / 1000)) {
        clearSession();
        return null;
      }

      let user;
      try {
        user = await request(`/users/${encodeURIComponent(String(persisted.user.id))}`);
      } catch (error) {
        if (error.code === 'AUTH_API_ERROR' && /404|not found|no encontrado/iu.test(error.message)) {
          clearSession();
          return null;
        }
        throw error;
      }

      try {
        const currentUser = normalizeUser(user);
        ensureActiveUser(currentUser);
        if (currentUser.role !== tokenPayload.role || currentUser.role !== persisted.user.role) {
          throw new AuthServiceError('AUTH_ROLE_CHANGED', 'El rol de la sesión ya no coincide con el usuario.');
        }

        const session = normalizeAuthSession({ user: currentUser, token: persisted.token });
        return persistSession(session);
      } catch (error) {
        clearSession();
        if (error.code === 'AUTH_INACTIVE_USER' || error.code === 'AUTH_ROLE_CHANGED' || error.code === 'INVALID_SESSION') {
          return null;
        }
        throw error;
      }
    },

    hasPersistedSession() {
      if (!storage) return false;
      try {
        return Boolean(storage.getItem(AUTH_SESSION_STORAGE_KEY));
      } catch {
        return false;
      }
    },

    async logout() {
      clearSession();
    },
  };
}

export const jsonServerAuthAdapter = createJsonServerAuthAdapter();
