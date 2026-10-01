export class AuthServiceError extends Error {
  constructor(code, message, cause) {
    super(message);
    this.name = 'AuthServiceError';
    this.code = code;
    this.cause = cause;
  }
}

const notConfigured = async () => {
  throw new AuthServiceError(
    'AUTH_NOT_CONFIGURED',
    'La autenticación todavía no está conectada a un backend real.'
  );
};

export const unconfiguredAuthAdapter = Object.freeze({
  restoreSession: async () => null,
  hasPersistedSession: () => false,
  login: notConfigured,
  register: notConfigured,
  logout: async () => undefined,
});

export function normalizeAuthSession(session) {
  if (!session || typeof session !== 'object') {
    throw new AuthServiceError('INVALID_SESSION', 'La sesión recibida no es válida.');
  }

  const { user, token = null } = session;
  if (!user || typeof user !== 'object' || !user.id || !user.email || !user.role) {
    throw new AuthServiceError('INVALID_SESSION', 'La sesión no contiene un usuario válido.');
  }

  return {
    user: {
      id: String(user.id),
      name: user.name ? String(user.name) : '',
      email: String(user.email),
      role: String(user.role),
      status: user.status ? String(user.status) : null,
    },
    token: token == null ? null : String(token),
  };
}

export function createAuthService(adapter = unconfiguredAuthAdapter) {
  const current = { ...unconfiguredAuthAdapter, ...adapter };

  return {
    async restoreSession() {
      const session = await current.restoreSession();
      return session ? normalizeAuthSession(session) : null;
    },

    hasPersistedSession() {
      return Boolean(current.hasPersistedSession?.());
    },

    async login(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new AuthServiceError('INVALID_CREDENTIALS_INPUT', 'Correo y contraseña son obligatorios.');
      }
      return normalizeAuthSession(await current.login(credentials));
    },

    async register(payload) {
      if (!payload?.name || !payload?.email || !payload?.password) {
        throw new AuthServiceError('INVALID_REGISTER_INPUT', 'Nombre, correo y contraseña son obligatorios.');
      }
      return normalizeAuthSession(await current.register(payload));
    },

    async logout(session) {
      await current.logout(session);
    },
  };
}
