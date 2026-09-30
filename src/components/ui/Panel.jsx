import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useDismissibleLayer } from '../../hooks/useDismissibleLayer.js';
import { IconButton } from './IconButton.jsx';
import './ui.css';

// Nonmodal by default; callers pair their trigger with aria-controls + aria-expanded.
export function Panel({
  open = true, modal = false, title, onClose, closeLabel = 'Cerrar panel',
  initialFocusRef, triggerRef, id: suppliedId, children, className = '', ...props
}) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  const panelRef = useRef(null);
  useDismissibleLayer({ open, modal, panelRef, triggerRef, initialFocusRef, onClose });

  useEffect(() => {
    const dialog = panelRef.current;
    if (!modal || !dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    return () => { if (dialog.open) dialog.close(); };
  }, [modal, open]);

  const Tag = modal ? 'dialog' : 'section';
  const content = (
    <Tag {...props} ref={panelRef} id={id} role="dialog" aria-modal={modal}
      aria-labelledby={id + '-title'} aria-hidden={!open} hidden={!open} tabIndex={-1}
      className={'v-panel ' + (modal ? 'v-panel--modal ' : '') + className}
      onCancel={event => { event.preventDefault(); onClose?.(); }}>
      <header className="v-panel__header">
        <h2 id={id + '-title'}>{title}</h2>
        {onClose && <IconButton variant="round" label={closeLabel} onClick={onClose}>×</IconButton>}
      </header>
      <div className="v-panel__body">{children}</div>
    </Tag>
  );
  return modal ? createPortal(content, document.body) : content;
}
