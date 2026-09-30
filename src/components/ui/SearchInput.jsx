import { useId, useState } from 'react';
import './ui.css';

export function SearchInput({
  label = 'Buscar piezas y materiales', value = '', onChange, results = [], onSelect,
  loading = false, error, onRetry, emptyMessage = 'No encontramos piezas con ese término.',
  placeholder = 'Nombre, material o referencia', className = '', disabled = false,
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const available = !loading && !error ? results : [];
  const expanded = open && !disabled;
  const activeIndex = active >= 0 && active < available.length ? active : -1;
  const select = result => { onSelect?.(result); setOpen(false); setActive(-1); };

  function handleKey(event) {
    if (event.key === 'Escape' && open) {
      event.preventDefault(); event.stopPropagation(); setOpen(false); setActive(-1); return;
    }
    if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault(); setOpen(true);
      if (available.length) setActive(index =>
        event.key === 'ArrowDown' ? (index + 1) % available.length : (index <= 0 ? available.length - 1 : index - 1),
      );
    } else if (open && ['Home', 'End'].includes(event.key) && available.length) {
      event.preventDefault(); setActive(event.key === 'Home' ? 0 : available.length - 1);
    } else if (open && event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault(); select(available[activeIndex]);
    }
  }

  return (
    <div className={'v-search ' + className} onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) { setOpen(false); setActive(-1); }
    }}>
      <label htmlFor={id}>{label}</label>
      <input id={id} className="v-input" role="combobox" type="search" autoComplete="off"
        value={value} disabled={disabled} placeholder={placeholder} aria-expanded={expanded}
        aria-controls={id + '-results'} aria-autocomplete="list" aria-invalid={Boolean(error)}
        aria-describedby={id + '-status'} aria-activedescendant={expanded && activeIndex >= 0 ? id + '-option-' + activeIndex : undefined}
        onFocus={() => setOpen(true)} onKeyDown={handleKey}
        onChange={event => { onChange?.(event.target.value); setOpen(true); setActive(-1); }} />
      <div className="v-search__popover" hidden={!expanded}>
        <ul role="listbox" id={id + '-results'} aria-label={label} aria-busy={loading}>
          {available.map((result, index) =>
            <li key={result.id} id={id + '-option-' + index} role="option" aria-selected={index === activeIndex}
              onMouseDown={event => event.preventDefault()} onClick={() => select(result)}>
              <strong>{result.label}</strong>{result.description && <small>{result.description}</small>}
            </li>,
          )}
        </ul>
        <p id={id + '-status'} role="status">
          {loading ? 'Buscando…' : error || (available.length ? available.length + ' resultados' : emptyMessage)}
        </p>
        {error && onRetry && <button type="button" className="v-button v-button--ghost" onClick={onRetry}>Reintentar</button>}
      </div>
    </div>
  );
}
