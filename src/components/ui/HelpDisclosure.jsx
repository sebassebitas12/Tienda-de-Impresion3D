import { useId, useRef, useState } from 'react';
import { IconButton } from './IconButton.jsx';
import './ui.css';

export function HelpDisclosure({ label, children }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const trigger = useRef(null);
  return (
    <div className="v-help" onKeyDown={event => {
      if (open && event.key === 'Escape') { event.stopPropagation(); setOpen(false); trigger.current?.focus(); }
    }}>
      <IconButton ref={trigger} label={'Ayuda sobre ' + label} aria-expanded={open} aria-controls={id} onClick={() => setOpen(value => !value)}>?</IconButton>
      <div id={id} hidden={!open} className="v-help__content">{children}</div>
    </div>
  );
}
