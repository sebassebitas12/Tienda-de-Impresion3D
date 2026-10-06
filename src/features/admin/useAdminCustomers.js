import { useCallback, useEffect, useState } from 'react';
import { getAdminCustomersData } from '../../services/adminCustomersService.js';
import { buildAdminCustomers } from '../../utils/adminCustomers.js';
import { useAuth } from '../../hooks/useAuth.js';

export function useAdminCustomers() {
  const auth = useAuth();
  const [state, setState] = useState({ status: 'loading', customers: [], error: null });
  const [reloadKey, setReloadKey] = useState(0);
  const retry = useCallback(() => {
    setState({ status: 'loading', customers: [], error: null });
    setReloadKey(value => value + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    getAdminCustomersData({ signal: controller.signal, token: auth?.token })
      .then(data => setState({ status: 'success', customers: buildAdminCustomers(data), error: null }))
      .catch(error => { if (error?.name !== 'AbortError') setState({ status: 'error', customers: [], error }); });
    return () => controller.abort();
  }, [reloadKey, auth?.token]);

  return { ...state, retry };
}
