import { useRef } from 'react';
import { Panel } from '../../components/ui/index.js';
import './catalog-delete-dialog.css';

export function CatalogDeleteDialog({ name, category = false, language = 'es', busy, error, triggerRef, onCancel, onConfirm }) {
  const cancelRef = useRef(null);
  const es = language === 'es';
  return <Panel modal title={es ? (category ? 'Eliminar categoría' : 'Eliminar modelo') : (category ? 'Delete category' : 'Delete model')} className="admin-catalog-delete" initialFocusRef={cancelRef} triggerRef={triggerRef} onClose={busy ? undefined : onCancel} closeLabel={es ? 'Cancelar eliminación' : 'Cancel deletion'}>
    <p>{es ? 'Vas a eliminar definitivamente:' : 'You are about to permanently delete:'}</p>
    <strong>{name}</strong>
    <p>{es ? 'Esta acción no se puede deshacer.' : 'This action cannot be undone.'}</p>
    {error && <p role="alert">{error}</p>}
    <footer><button ref={cancelRef} type="button" className="admin-action-secondary" disabled={busy} onClick={onCancel}>{es ? 'Cancelar' : 'Cancel'}</button><button type="button" className="admin-action-primary" disabled={busy} onClick={onConfirm}>{busy ? (es ? 'Eliminando…' : 'Deleting…') : (es ? 'Confirmar eliminación' : 'Confirm deletion')}</button></footer>
  </Panel>;
}
