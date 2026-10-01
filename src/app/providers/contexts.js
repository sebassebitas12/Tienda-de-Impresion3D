import { createContext } from 'react';

export const ThemeContext = createContext(null);
export const AuthContext = createContext({ user: null, isAuthenticated: false });
export const PreferencesContext = createContext(null);
export const CartContext = createContext(null);
