import { useState } from 'react';
import { Link } from 'react-router-dom';
import { automationAction, automationError } from '../../services/automationService.js';

const labels = { name: 'Nombre', description: 'Descripción', material: 'Material', price: 'Precio (₡)', status: 'Publicación', categoryId: 'Categoría', availableColors: 'Colores', dimensions: 'Medidas', weightGrams: 'Peso aproximado (g)', estimatedProductionHours: 'Tiempo aproximado (h)', featured: 'Destacado', slug: 'Referencia', priceSource: 'Origen del precio' };
const display = value => value == null ? '—' : Array.isArray(value) ? value.join(', ') : typeof value === 'boolean' ? (value ? 'Sí' : 'No') : String(value);

export function AdminCatalogActionPreview({ action, token, language }) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [cancelled, setCancelled] = useState(false);
  const es = language !== 'en';
  async function confirm() {
    if (busy || result || cancelled) return;
    setBusy(true); setError('');
    try { const response = await automationAction('/admin/actions/catalog-ai-confirm', { action }, { token }); setResult(response.result); }
    catch (failure) { setError(automationError(failure.code, language)); }
    finally { setBusy(false); }
  }
  if (cancelled) return <p role="status">{es ? 'Propuesta descartada.' : 'Proposal discarded.'}</p>;
  if (result) return <div className="admin-ai-action" role="status"><strong>{es ? 'Cambio guardado' : 'Change saved'} ✓</strong><p>{result.name}</p><Link to={result.path}>{es ? 'Ver catálogo actualizado' : 'View updated catalog'} ↗</Link></div>;
  const operation = es ? ({ CREATE: 'Crear', UPDATE: 'Editar', DELETE: 'Eliminar' }[action.operation]) : action.operation;
  return <section className="admin-ai-action" aria-label={es ? 'Revisar cambio propuesto' : 'Review proposed change'}>
    <h3>{operation}: {action.name}</h3>
    <dl>{action.preview.map(row => <div key={row.field}><dt>{es ? labels[row.field] || row.field : row.field}</dt><dd>{action.operation === 'UPDATE' && <span>{display(row.before)} → </span>}{display(row.after)}</dd></div>)}</dl>
    {action.changes?.priceSource === 'DEMO' && <p>{es ? 'Precio calculado con peso y tiempo aproximados y costos DEMO. Al confirmar aceptás esta propuesta.' : 'Price uses approximate weight/time and DEMO costs. Confirmation accepts this proposal.'}</p>}
    {action.operation === 'DELETE' && <p>{es ? 'Esto elimina el registro. Los registros asociados a pedidos se conservan.' : 'This deletes the record. Records used by orders are protected.'}</p>}
    {error && <p role="alert">{error}</p>}
    <div className="admin-ai-action__buttons"><button type="button" className="admin-action-secondary" disabled={busy} onClick={() => setCancelled(true)}>{es ? 'Descartar propuesta' : 'Discard proposal'}</button><button type="button" className="admin-action-primary" disabled={busy} onClick={confirm}>{busy ? (es ? 'Guardando…' : 'Saving…') : es ? 'Confirmar y guardar' : 'Confirm and save'}</button></div>
  </section>;
}
