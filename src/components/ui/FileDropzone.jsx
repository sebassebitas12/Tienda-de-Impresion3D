import { useId, useRef, useState } from 'react';
import { formatFileSize, validateFile } from '../../utils/files.js';
import { Button } from './Button.jsx';
import './ui.css';

export function FileDropzone({
  file = null, onFile, extensions = ['stl', 'obj'], maxBytes, processing = false, error,
  label = 'Archivo 3D', disabled = false, chooseLabel = 'Seleccionar archivo', removeLabel = 'Quitar archivo',
}) {
  const id = useId();
  const inputRef = useRef(null);
  const depth = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [validation, setValidation] = useState(null);
  const locked = disabled || processing;
  const state = processing ? 'processing' : validation?.status || (error ? 'error' : dragging ? 'drag-over' : file ? 'success' : 'idle');

  function choose(files) {
    if (locked) return;
    if (files.length !== 1) {
      setValidation({ status: 'error-format', message: 'Seleccioná un solo archivo.' });
      return;
    }
    const selected = files[0];
    const invalid = validateFile(selected, { extensions, maxBytes });
    setValidation(invalid);
    if (!invalid) onFile?.(selected);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="v-field">
      <label htmlFor={id}>{label}</label>
      <div className="v-dropzone" data-state={state} aria-busy={processing}
        onDragEnter={event => { event.preventDefault(); depth.current += 1; if (!locked) setDragging(true); }}
        onDragOver={event => { event.preventDefault(); event.dataTransfer.dropEffect = locked ? 'none' : 'copy'; }}
        onDragLeave={event => { event.preventDefault(); depth.current -= 1; if (depth.current <= 0) setDragging(false); }}
        onDrop={event => { event.preventDefault(); depth.current = 0; setDragging(false); choose(event.dataTransfer.files); }}>
        <p>{dragging ? 'Soltá el archivo aquí' : 'Arrastrá tu archivo o seleccionalo desde tu dispositivo.'}</p>
        <p id={id + '-hint'}>{extensions.join(' / ').toUpperCase()}{Number.isFinite(maxBytes) && ' · Máximo ' + formatFileSize(maxBytes)}</p>
        <input ref={inputRef} id={id} type="file" disabled={locked}
          accept={extensions.map(extension => '.' + extension.replace(/^\./, '')).join(',')}
          aria-describedby={id + '-hint ' + id + '-status'} aria-invalid={Boolean(validation || error)}
          onChange={event => { if (event.target.files.length) choose(event.target.files); }} />
        <span className="v-sr-only">{chooseLabel}</span>
        <p id={id + '-status'} role={validation || error ? 'alert' : 'status'}>
          {processing ? 'Procesando archivo…' : validation?.message || error || (file ? 'Archivo seleccionado: ' + file.name : 'Ningún archivo seleccionado.')}
        </p>
        {file && <Button variant="ghost" disabled={locked} onClick={() => {
          onFile?.(null); setValidation(null); if (inputRef.current) inputRef.current.value = '';
        }}>{removeLabel}</Button>}
      </div>
    </div>
  );
}
