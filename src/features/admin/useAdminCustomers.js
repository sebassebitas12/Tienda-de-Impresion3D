import { useCallback, useEffect, useState } from 'react';
import { getAdminCustomersData } from '../../services/adminCustomersService.js';
import { buildAdminCustomers } from '../../utils/adminCustomers.js';

export function useAdminCustomers() {
  const [state, setState] = useState({ status: 'loading', customers: [], error: null });
  const [reloadKey, setReloadKey] = useState(0);
  const retry = useCallback(() => {
    setState({ status: 'loading', customers: [], error: null });
    setReloadKey(value => value + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    getAdminCustomersData({ signal: controller.signal })
      .then(data => setState({ status: 'success', customers: buildAdminCustomers(data), error: null }))
      .catch(error => { if (error?.name !== 'AbortError') setState({ status: 'error', customers: [], error }); });
    return () => controller.abort();
  }, [reloadKey]);

  return { ...state, retry };
}
