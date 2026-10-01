import { useCallback, useEffect, useState } from 'react';
import { getAdminOrdersData } from '../../services/adminOrdersService.js';
import { buildAdminOrders } from '../../utils/adminOrders.js';

export function useAdminOrders() {
  const [state, setState] = useState({ status: 'loading', orders: [], error: null });
  const [reloadKey, setReloadKey] = useState(0);
  const retry = useCallback(() => {
    setState({ status: 'loading', orders: [], error: null });
    setReloadKey(value => value + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    getAdminOrdersData({ signal: controller.signal })
      .then(data => setState({ status: 'success', orders: buildAdminOrders(data), error: null }))
      .catch(error => { if (error?.name !== 'AbortError') setState({ status: 'error', orders: [], error }); });
    return () => controller.abort();
  }, [reloadKey]);

  return { ...state, retry };
}
