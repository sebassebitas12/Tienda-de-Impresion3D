import { useId, useState } from 'react';
import { catalogImageLibrary } from './catalogImageLibrary.js';
import './image-picker.css';

const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function ImagePicker({ value = '', onChange, language = 'es', disabled = false }) {
  const id = useId();
  const [query, setQuery] = useState('');
  const [failedPath, setFailedPath] = useState('');
  const es = language === 'es';
  const selected = catalogImageLibrary.find(image => image.path === value);
  const label = image => image.labels[language] || image.labels.es;
  const filtered = catalogImageLibrary.filter(image => normalize(`${label(image)} ${image.file}`).includes(normalize(query.trim())));

  return <section className="admin-image-picker" aria-labelledby={`${id}-title`}>
    <header><div><h2 id={`${id}-title`}>{es ? 'Foto principal' : 'Main photo'}</h2><p>{es ? 'Elegí una de las fotos del taller. Se mostrará en la ficha y en las listas del catálogo.' : 'Choose a workshop photo. It will appear in the product details and catalog lists.'}</p></div><span>{es ? 'Biblioteca del taller' : 'Workshop library'}</span></header>
    <div className="admin-image-picker__layout">
      <div className="admin-image-picker__preview">
        {value && failedPath !== value ? <img key={value} src={value} alt={selected ? label(selected) : (es ? 'Foto actual del modelo' : 'Current model photo')} onError={() => setFailedPath(value)} /> : <div className="admin-image-picker__placeholder">{value ? (es ? 'Esta foto no está disponible' : 'This photo is unavailable') : (es ? 'Todavía sin foto' : 'No photo selected')}</div>}
        <p role="status"><strong>{selected ? label(selected) : value ? (es ? 'Foto registrada' : 'Recorded photo') : (es ? 'Seleccioná una foto' : 'Choose a photo')}</strong>{value && <small>{selected?.file || value}</small>}</p>
        {value && <button type="button" className="admin-action-secondary" disabled={disabled} onClick={() => onChange('')}>{es ? 'Quitar foto principal' : 'Remove main photo'}</button>}
      </div>
      <div className="admin-image-picker__library">
        <label htmlFor={`${id}-search`}>{es ? 'Buscar foto' : 'Find a photo'}</label>
        <input id={`${id}-search`} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={es ? 'Soporte, llavero, maceta…' : 'Stand, keychain, planter…'} disabled={disabled} />
        <p className="admin-image-picker__count" role="status">{filtered.length} {es ? 'fotos disponibles' : 'available photos'}</p>
        <div className="admin-image-picker__grid" role="group" aria-label={es ? 'Fotos del taller' : 'Workshop photos'}>
          {filtered.map(image => <button key={image.path} type="button" disabled={disabled} aria-pressed={image.path === value} aria-label={`${es ? 'Usar foto' : 'Use photo'}: ${label(image)}`} onClick={() => onChange(image.path)}>
            <img src={image.path} alt="" loading="lazy" />
            <span>{label(image)}</span>{image.path === value && <i aria-hidden="true">✓</i>}
          </button>)}
        </div>
        {!filtered.length && <p className="admin-image-picker__empty">{es ? 'No hay fotos con ese nombre. Probá otra búsqueda.' : 'No photos with that name. Try another search.'}</p>}
      </div>
    </div>
  </section>;
}
