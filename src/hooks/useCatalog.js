import { useEffect, useState } from 'react';
import { getAdminCatalogData } from '../services/adminCatalogService.js';
import { buildAdminCatalog } from '../utils/adminCatalog.js';

export function useCatalog() {
  const [reload, setReload] = useState(0);
  const [state, setState] = useState({ status: 'loading', products: [] });
  useEffect(() => {
    const controller = new AbortController();
    getAdminCatalogData({ signal: controller.signal }).then(data => setState({ status: 'success', products: buildAdminCatalog(data) }))
      .catch(error => { if (error.name !== 'AbortError') setState({ status: 'error', products: [] }); });
    return () => controller.abort();
  }, [reload]);
  return { ...state, retry: () => { setState({ status: 'loading', products: [] }); setReload(value => value + 1); } };
}
