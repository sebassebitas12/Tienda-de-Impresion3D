import { useCallback, useEffect, useState } from 'react';
import { getAdminCatalogData } from '../../services/adminCatalogService.js';
import { buildAdminCatalog } from '../../utils/adminCatalog.js';

export function useAdminCatalog() {
  const [state, setState] = useState({ status: 'loading', products: [], categories: [], error: null });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getAdminCatalogData({ signal: controller.signal })
      .then(data => setState({ status: 'success', products: buildAdminCatalog(data), categories: data.categories, error: null }))
      .catch(error => { if (error?.name !== 'AbortError') setState({ status: 'error', products: [], categories: [], error }); });
    return () => controller.abort();
  }, [reloadKey]);

  const retry = useCallback(() => {
    setState({ status: 'loading', products: [], categories: [], error: null });
    setReloadKey(value => value + 1);
  }, []);
  return { ...state, retry };
}
