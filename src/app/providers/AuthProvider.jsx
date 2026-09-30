import { AuthContext } from './contexts.js';

const guestSession = Object.freeze({ user: null, isAuthenticated: false });

export function AuthProvider({ children }) {
  return <AuthContext value={guestSession}>{children}</AuthContext>;
}
