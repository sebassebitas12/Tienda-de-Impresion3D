import { useId, useState } from 'react';
import './reference-picker.css';

export function ReferencePicker({ profiles, value, onChange, disabled = false, loading = false, language = 'es', allowAutomatic = false }) {
  const id = useId();
  const [query, setQuery] = useState('');
  const es = language === 'es';
  const normalize = text => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const filtered = profiles.filter(profile => normalize(`${profile.name} ${profile.id}`).includes(normalize(query.trim())));
  const selected = profiles.find(profile => profile.id === value);
  return <section className="reference-picker" aria-labelledby={`${id}-title`}>
    <header><div><h3 id={`${id}-title`}>{es ? 'Referencia de pieza similar' : 'Similar part reference'}</h3><p>{es ? 'Elegí un modelo del taller con geometría similar para estimar peso, volumen y tiempo de manufactura.' : 'Choose a workshop model with similar geometry to estimate weight, volume, and manufacturing time.'}</p></div><span className="reference-picker__demo">{es ? 'PARÁMETROS FDM' : 'FDM PROFILE'}</span></header>
    <label htmlFor={`${id}-search`}>{es ? 'Buscar por nombre o tipo de pieza' : 'Search by name or part type'}</label>
    <input id={`${id}-search`} type="search" value={query} onChange={event => setQuery(event.target.value)} disabled={disabled || loading} placeholder={es ? 'Organizador, soporte, engranaje…' : 'Organizer, stand, gear…'} />
    {allowAutomatic && <button type="button" className="reference-picker__automatic" aria-pressed={!value} disabled={disabled} onClick={() => onChange('')}>{es ? 'Usar la descripción de la solicitud' : 'Use the request description'} <span aria-hidden="true">{!value ? '✓' : '↗'}</span></button>}
    {selected && <div className="reference-picker__selection"><span>{es ? 'Referencia elegida' : 'Selected reference'}</span><strong>{selected.name}</strong><button type="button" disabled={disabled} onClick={() => onChange('')}>{es ? 'Quitar' : 'Clear'}</button></div>}
    <p className="reference-picker__count" role="status">{loading ? (es ? 'Cargando referencias…' : 'Loading references…') : `${filtered.length} ${es ? (filtered.length === 1 ? 'referencia' : 'referencias') : (filtered.length === 1 ? 'reference' : 'references')}`}</p>
    <div className="reference-picker__results" role="group" aria-label={es ? 'Modelos de referencia' : 'Reference models'}>
      {filtered.map(profile => <button key={profile.id} type="button" className="reference-picker__item" aria-pressed={value === profile.id} disabled={disabled} onClick={() => onChange(profile.id)}>
        <img src={profile.image} alt="" loading="lazy" /><span><strong>{profile.name}</strong><small>{profile.weightGrams} g · ~{profile.printHours} h</small></span><span className="reference-picker__check" aria-hidden="true">{value === profile.id ? '✓' : '+'}</span>
      </button>)}
    </div>
    {!loading && !filtered.length && <p>{es ? 'No encontramos coincidencias. Probá con otro nombre o borrá la búsqueda.' : 'No matches. Try another name or clear the search.'}</p>}
  </section>;
}
