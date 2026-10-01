import { useCallback, useEffect, useState } from 'react';
import { getAdminOverviewData } from '../../services/adminOverviewService.js';
import { calculateAdminOverview } from '../../utils/adminOverview.js';

export function useAdminOverview() {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });
  const [reloadKey, setReloadKey] = useState(0);
  const retry = useCallback(() => {
    setState({ status: 'loading', data: null, error: null });
    setReloadKey(value => value + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    getAdminOverviewData({ signal: controller.signal })
      .then(data => setState({ status: 'success', data: calculateAdminOverview(data), error: null }))
      .catch(error => {
        if (error?.name !== 'AbortError') setState({ status: 'error', data: null, error });
      });
    return () => controller.abort();
  }, [reloadKey]);

  return { ...state, retry };
}
