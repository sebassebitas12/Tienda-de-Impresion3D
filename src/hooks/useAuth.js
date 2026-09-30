import { useContext } from 'react';
import { AuthContext } from '../app/providers/contexts.js';

export function useAuth() { return useContext(AuthContext); }
