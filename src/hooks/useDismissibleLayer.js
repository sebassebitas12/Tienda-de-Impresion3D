import { useEffect, useRef } from 'react';

const layers = [];
const focusableSelector = 'a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])';

export function useDismissibleLayer({ open, modal, panelRef, triggerRef, initialFocusRef, onClose }) {
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!open || !panel) return undefined;
    const previous = triggerRef?.current || document.activeElement;
    layers.push(panel);
    const animationFrame = requestAnimationFrame(() => {
      (initialFocusRef?.current || panel.querySelector(focusableSelector) || panel).focus();
    });
    const keydown = event => {
      if (layers.at(-1) !== panel) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current?.();
      }
      if (modal && event.key === 'Tab') {
        const controls = [...panel.querySelectorAll(focusableSelector)].filter(node =>
          !node.closest('[hidden],[inert]') && node.getAttribute('aria-hidden') !== 'true',
        );
        const first = controls[0];
        const last = controls.at(-1);
        if (!first) { event.preventDefault(); panel.focus(); return; }
        if (!panel.contains(document.activeElement) || document.activeElement === panel) {
          event.preventDefault(); (event.shiftKey ? last : first).focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }
    };
    document.addEventListener('keydown', keydown);
    return () => {
      cancelAnimationFrame(animationFrame);
      document.removeEventListener('keydown', keydown);
      const index = layers.indexOf(panel);
      if (index !== -1) layers.splice(index, 1);
      if (previous?.isConnected) previous.focus();
    };
  }, [open, modal, panelRef, triggerRef, initialFocusRef]);
}
