import { afterEach, describe, expect, jest, test } from '@jest/globals';
import {
  AUTH_SESSION_STORAGE_KEY,
  createJsonServerAuthAdapter,
  createSimulatedToken,
} from '../src/services/jsonServerAuthAdapter.js';

const admin = {
  id: 'u1',
  name: 'Admin Demo',
  email: 'admin@example.com',
  role: 'admin',
  status: 'ACTIVE',
  demoPassword: 'demo-admin',
};

function response(body, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

function adapterWith(fetchImpl, options = {}) {
  return createJsonServerAuthAdapter({
    baseUrl: 'http://localhost:3000',
    fetchImpl,
    storage: window.localStorage,
    ...options,
  });
}

afterEach(() => {
  window.localStorage.clear();
});

describe('jsonServerAuthAdapter', () => {
  test('login correcto genera token simulado y persiste la sesión', async () => {
    const fetchImpl = jest.fn().mockResolvedValue(response([admin]));
    const adapter = adapterWith(fetchImpl);

    const session = await adapter.login({ email: ' ADMIN@example.com ', password: 'demo-admin' });

    expect(fetchImpl).toHaveBeenCalledWith('http://localhost:3000/users?email=admin%40example.com', undefined);
    expect(session.user).toMatchObject({ id: 'u1', role: 'admin', status: 'ACTIVE' });
    expect(session.token).toMatch(/^sim\.v1\./u);
    expect(JSON.parse(window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY))).toEqual(session);
  });

  test('login con password incorrecta falla', async () => {
    const adapter = adapterWith(jest.fn().mockResolvedValue(response([admin])));

    await expect(adapter.login({ email: admin.email, password: 'incorrecta' }))
      .rejects.toMatchObject({ code: 'AUTH_INVALID_CREDENTIALS' });
  });

  test('login informa error controlado cuando JSON Server no responde', async () => {
    const adapter = adapterWith(jest.fn().mockRejectedValue(new Error('offline')));

    await expect(adapter.login({ email: admin.email, password: 'demo-admin' }))
      .rejects.toMatchObject({ code: 'AUTH_NETWORK' });
  });

  test('registro duplicado no crea un usuario', async () => {
    const fetchImpl = jest.fn().mockResolvedValue(response([admin]));
    const adapter = adapterWith(fetchImpl);

    await expect(adapter.register({ name: 'Otra persona', email: admin.email, password: 'demo' }))
      .rejects.toMatchObject({ code: 'AUTH_EMAIL_TAKEN' });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  test('registro crea customer ACTIVE y persiste sesión', async () => {
    const created = { id: 'u-new', name: 'Nueva persona', email: 'new@example.com', role: 'customer', status: 'ACTIVE' };
    const fetchImpl = jest.fn()
      .mockResolvedValueOnce(response([]))
      .mockResolvedValueOnce(response(created, 201));
    const adapter = adapterWith(fetchImpl, { now: () => Date.parse('2026-09-30T12:00:00Z') });

    const session = await adapter.register({ name: 'Nueva persona', email: 'NEW@example.com', password: 'demo' });
    const [, postCall] = fetchImpl.mock.calls;

    expect(postCall[0]).toBe('http://localhost:3000/users');
    expect(JSON.parse(postCall[1].body)).toMatchObject({ role: 'customer', status: 'ACTIVE', demoPassword: 'demo' });
    expect(session.user.email).toBe('new@example.com');
  });

  test('restore expirado invalida y limpia la sesión sin HTTP', async () => {
    const now = Date.parse('2026-09-30T12:00:02Z');
    const token = createSimulatedToken(admin, { now: now - 2000, ttlMs: 1000 });
    window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify({ user: admin, token }));
    const fetchImpl = jest.fn();
    const adapter = adapterWith(fetchImpl, { now: () => now });

    await expect(adapter.restoreSession()).resolves.toBeNull();
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY)).toBeNull();
  });

  test.each([
    ['usuario inactivo', { ...admin, status: 'INACTIVE' }, 'AUTH_INACTIVE_USER'],
    ['rol cambiado', { ...admin, role: 'customer' }, 'AUTH_ROLE_CHANGED'],
  ])('restore invalida %s', async (...caseData) => {
    const [, currentUser, expectedCode] = caseData;
    const now = Date.parse('2026-09-30T12:00:00Z');
    const token = createSimulatedToken(admin, { now, ttlMs: 60_000 });
    window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify({ user: admin, token }));
    const adapter = adapterWith(jest.fn().mockResolvedValue(response(currentUser)), { now: () => now });

    await expect(adapter.restoreSession()).resolves.toBeNull();
    expect(window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY)).toBeNull();
    expect(expectedCode).toMatch(/^AUTH_/u);
  });

  test('restore invalida usuario no encontrado', async () => {
    const now = Date.parse('2026-09-30T12:00:00Z');
    const token = createSimulatedToken(admin, { now, ttlMs: 60_000 });
    window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify({ user: admin, token }));
    const adapter = adapterWith(jest.fn().mockResolvedValue(response({}, 404)), { now: () => now });

    await expect(adapter.restoreSession()).resolves.toBeNull();
    expect(window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY)).toBeNull();
  });

  test('logout limpia la sesión persistida', async () => {
    window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify({ user: admin, token: 'sim.v1.test' }));
    const adapter = adapterWith(jest.fn());
    expect(adapter.hasPersistedSession()).toBe(true);

    await adapter.logout();

    expect(window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY)).toBeNull();
    expect(adapter.hasPersistedSession()).toBe(false);
  });
});
