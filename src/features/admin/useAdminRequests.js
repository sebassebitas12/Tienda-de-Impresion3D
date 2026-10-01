import { useCallback, useEffect, useState } from 'react';
import { getAdminRequestsData } from '../../services/adminOverviewService.js';
import { buildAdminRequests } from '../../utils/adminRequests.js';

export function useAdminRequests() {
  const [state, setState] = useState({ status: 'loading', requests: [], error: null });
  const [reloadKey, setReloadKey] = useState(0);
  const retry = useCallback(() => {
    setState({ status: 'loading', requests: [], error: null });
    setReloadKey(value => value + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    getAdminRequestsData({ signal: controller.signal })
      .then(data => setState({ status: 'success', requests: buildAdminRequests(data), error: null }))
      .catch(error => {
        if (error?.name !== 'AbortError') setState({ status: 'error', requests: [], error });
      });
    return () => controller.abort();
  }, [reloadKey]);

  return { ...state, retry };
}
