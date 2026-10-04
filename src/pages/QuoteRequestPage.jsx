import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { usePreferences } from '../hooks/usePreferences.js';
import { submitQuoteIntake, automationError } from '../services/automationService.js';
import { FDM_MATERIALS } from '../utils/quotePricing.js';
import { AssistantPanel } from '../features/chatbot/AssistantPanel.jsx';
import './quotes.css';
import './quote-intake.css';

const emptyDraft = { description: '', intendedUse: '', dimensions: '', material: '', quantity: 1, needsDesign: false, referenceUrl: '' };
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function QuoteRequestPage() {
  const location = useLocation();
  const summaryHeading = useRef(null);
  const manuallyEditedFields = useRef(new Set());
  const intent = location.pathname.endsWith('/archivo') ? 'file' : location.pathname.endsWith('/ayuda-diseno') ? 'design' : null;
  const auth = useAuth();
  const { language } = usePreferences();
  const es = language !== 'en';
  const [draft, setDraft] = useState(emptyDraft);
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(null);
  const [assistantDraftReady, setAssistantDraftReady] = useState(false);
  const idempotencyKey = useRef('');
  const authenticatedCustomer = auth?.user?.role === 'customer';

  function updateDraft(key, value) {
    manuallyEditedFields.current.add(key);
    setDraft(current => ({ ...current, [key]: value }));
    idempotencyKey.current = '';
    setError('');
  }

  function applyAssistantDraft(value) {
    if (!value || typeof value !== 'object') return;
    setAssistantDraftReady(true);
    setDraft(current => Object.fromEntries(Object.entries(current).map(([key, previous]) => {
      const next = value[key];
      if (manuallyEditedFields.current.has(key)) return [key, previous];
      return [key, next === null || next === undefined || next === '' ? emptyDraft[key] : next];
    })));
    idempotencyKey.current = '';
    setError('');
  }

  function reviewSummary() {
    const heading = summaryHeading.current;
    if (!heading) return;
    const prefersReducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      || document.documentElement.dataset.motion === 'reduced';
    heading.scrollIntoView?.({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    heading.focus();
  }

  function selectFiles(event) {
    const selected = [...event.target.files];
    event.target.value = '';
    if (selected.length > 5) { setError(es ? 'Podés adjuntar hasta 5 archivos.' : 'You can attach up to 5 files.'); return; }
    if (selected.some(file => file.size > MAX_FILE_SIZE)) { setError(es ? 'Cada archivo debe pesar 5 MB o menos.' : 'Each file must be 5 MB or smaller.'); return; }
    if (!selected.every(file => /\.(png|jpe?g|webp|gif|stl|obj)$/i.test(file.name))) { setError(es ? 'Usá imágenes PNG/JPG/WebP/GIF o modelos STL/OBJ.' : 'Use PNG/JPG/WebP/GIF images or STL/OBJ models.'); return; }
    setFiles(selected);
    idempotencyKey.current = '';
    setError('');
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    if (!authenticatedCustomer) { setError(es ? 'Iniciá sesión con una cuenta de cliente para enviar esta solicitud.' : 'Sign in with a customer account to submit this request.'); return; }
    if (draft.description.trim().length < 3) { setError(es ? 'Contá brevemente qué pieza necesitás.' : 'Briefly describe the part you need.'); return; }
    if (draft.referenceUrl && !/^https:\/\//i.test(draft.referenceUrl.trim())) { setError(es ? 'La referencia debe ser un enlace HTTPS.' : 'The reference must be an HTTPS link.'); return; }
    setBusy(true);
    if (!idempotencyKey.current) idempotencyKey.current = globalThis.crypto?.randomUUID?.() || `rq-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    try {
      const result = await submitQuoteIntake({ ...draft, description: draft.description.trim(), referenceUrl: draft.referenceUrl.trim(), sourceType: intent === 'file' ? 'FILE_UPLOAD' : 'DESIGN_HELP', idempotencyKey: idempotencyKey.current }, files, { token: auth?.token });
      setSubmitted(result.request);
    } catch (failure) { setError(automationError(failure.code, language)); }
    finally { setBusy(false); }
  }

  const heading = intent === 'file' ? (es ? 'Mandá tu modelo y sus referencias.' : 'Send your model and references.')
    : intent === 'design' ? (es ? 'Contanos qué querés crear.' : 'Tell us what you want to make.')
      : (es ? '¿En qué punto estás?' : 'Where are you starting?');
  return <section className="quote-page" aria-labelledby="quote-title" aria-busy={busy}>
    {intent && <Link className="quote-back" to="/solicitud">← {es ? 'Cambiar tipo de proyecto' : 'Change project type'}</Link>}
    <header><span className="quote-eyebrow">{es ? 'TU PROYECTO · VÉRTICE CR' : 'YOUR PROJECT · VÉRTICE CR'}</span><h1 id="quote-title">{heading}</h1>
      <p>{intent === 'file' ? (es ? 'Adjuntá el archivo, fotos o enlaces que ayuden a entender la pieza. El taller recibe una solicitud sin precio automático.' : 'Attach the model, photos or links that help explain the part. The workshop receives a request, not an automatic price.') : intent === 'design' ? (es ? 'El asistente organiza la idea y completa este resumen. Revisalo, adjuntá referencias y enviá una sola solicitud al taller.' : 'The assistant organizes your idea into this summary. Review it, add references and submit one request to the workshop.') : (es ? 'Elegí el camino que se parece a tu proyecto. Siempre podés adjuntar referencias para explicar lo que necesitás.' : 'Choose the path that fits your project. You can always attach references to show what you need.')}</p></header>

    {!intent && <nav className="quote-intents" aria-label={es ? 'Tipo de cotización' : 'Quote type'}>
      <Link className="quote-intent" to="/solicitud/archivo"><span className="quote-intent__index">01 / MODELO</span><h2>{es ? 'Ya tengo una pieza o referencia' : 'I have a part or reference'}</h2><p>{es ? 'Adjuntá un STL/OBJ, imágenes o enlaces y describí qué necesitas.' : 'Attach an STL/OBJ, images or links and describe what you need.'}</p><strong>{es ? 'Preparar solicitud' : 'Prepare request'} <span aria-hidden="true">↗</span></strong></Link>
      <Link className="quote-intent" to="/solicitud/ayuda-diseno"><span className="quote-intent__index">02 / IDEA</span><h2>{es ? 'Quiero ayuda para definirla' : 'Help me define it'}</h2><p>{es ? 'Conversá con el asistente y revisá el resumen antes de enviarlo.' : 'Talk to the assistant and review the summary before submitting.'}</p><strong>{es ? 'Organizar mi idea' : 'Organize my idea'} <span aria-hidden="true">↗</span></strong></Link>
    </nav>}

    {intent && <div className={`quote-intake-layout${intent === 'file' ? ' quote-intake-layout--file' : ''}`}>
      {intent === 'design' ? <AssistantPanel key={auth?.user?.id || 'guest'} mode="quote" id="quote-assistant" embedded onDraftChange={applyAssistantDraft} draftReady={assistantDraftReady} onReviewDraft={reviewSummary} />
        : <aside className="quote-intake-brief"><span className="quote-eyebrow">01 / REFERENCIAS</span><h2>{es ? 'Mostrá la pieza desde varios ángulos.' : 'Show the part from useful angles.'}</h2><p>{es ? 'Podés adjuntar fotos, STL u OBJ y compartir un enlace HTTPS. La imagen ayuda al taller a entender la intención; no se usa para fingir mediciones.' : 'Attach photos, STL or OBJ files, or share an HTTPS link. Images help the workshop understand the intent; they are not treated as measurements.'}</p><ul><li>{es ? 'Hasta 5 archivos, máximo 5 MB cada uno' : 'Up to 5 files, 5 MB each'}</li><li>{es ? 'PNG, JPG, WebP, GIF, STL u OBJ' : 'PNG, JPG, WebP, GIF, STL or OBJ'}</li><li>{es ? 'No se calcula un precio al enviar' : 'No price is calculated on submission'}</li></ul></aside>}

      <form className="quote-intake-form" onSubmit={submit}>
        <div className="quote-intake-form__heading"><span className="quote-eyebrow">02 / {es ? 'RESUMEN DE SOLICITUD' : 'REQUEST SUMMARY'}</span><h2 ref={summaryHeading} tabIndex="-1">{es ? 'Revisá lo que va a recibir el taller.' : 'Review what the workshop will receive.'}</h2><p>{es ? 'No hace falta saberlo todo ahora. Lo que no conozcas puede quedar sin definir.' : 'You do not need every detail now. Unknowns can remain unspecified.'}</p></div>
        {submitted ? <div className="quote-intake-success" role="status"><span>✓</span><div><h3>{es ? 'Solicitud enviada al taller' : 'Request sent to the workshop'}</h3><p>{es ? `Referencia ${submitted.id}. No se generó un precio ni se envió un correo.` : `Reference ${submitted.id}. No price was created and no email was sent.`}</p><Link to="/cuenta">{es ? 'Ver mis solicitudes' : 'View my requests'} ↗</Link></div></div> : <>
          <label>{es ? '¿Qué querés fabricar?' : 'What do you want to make?'}<textarea rows="4" maxLength="2000" required value={draft.description} onChange={event => updateDraft('description', event.target.value)} placeholder={es ? 'Describí la pieza, qué forma tiene o qué problema resuelve.' : 'Describe the part, its shape or what problem it solves.'} /></label>
          <label>{es ? '¿Para qué la vas a usar?' : 'What will you use it for?'}<input maxLength="500" value={draft.intendedUse} onChange={event => updateDraft('intendedUse', event.target.value)} placeholder={es ? 'Uso previsto (si ya lo sabés)' : 'Intended use (if known)'} /></label>
          <div className="quote-intake-form__grid"><label>{es ? 'Medidas aproximadas' : 'Approximate dimensions'}<input maxLength="200" value={draft.dimensions} onChange={event => updateDraft('dimensions', event.target.value)} placeholder={es ? 'Ej.: largo 15 cm, ancho 3 cm' : 'e.g. 15 cm long, 3 cm wide'} /></label>
            <label>{es ? 'Material deseado' : 'Preferred material'}<select value={draft.material} onChange={event => updateDraft('material', event.target.value)}><option value="">{es ? 'Aún no definido' : 'Not decided'}</option>{FDM_MATERIALS.map(material => <option key={material}>{material}</option>)}</select></label>
            <label>{es ? 'Cantidad' : 'Quantity'}<input type="number" min="1" max="100" step="1" value={draft.quantity} onChange={event => updateDraft('quantity', Number(event.target.value))} /></label>
            <label className="quote-intake-check"><input type="checkbox" checked={draft.needsDesign} onChange={event => updateDraft('needsDesign', event.target.checked)} />{es ? 'Necesito ayuda con el diseño' : 'I need design help'}</label></div>
          <label>{es ? 'Enlace de referencia (opcional)' : 'Reference link (optional)'}<input type="url" value={draft.referenceUrl} onChange={event => updateDraft('referenceUrl', event.target.value)} placeholder="https://" /></label>
          <label className="quote-intake-upload">{es ? 'Fotos o archivos 3D' : 'Photos or 3D files'}<input type="file" accept="image/png,image/jpeg,image/webp,image/gif,.stl,.obj" multiple onChange={selectFiles} /><small>{es ? 'Hasta 5 archivos · 5 MB máximo cada uno' : 'Up to 5 files · 5 MB maximum each'}</small></label>
          {files.length > 0 && <ul className="quote-intake-files" aria-label={es ? 'Archivos seleccionados' : 'Selected files'}>{files.map((file, index) => <li key={`${file.name}-${index}`}><span>{file.name}</span><small>{(file.size / 1024 / 1024).toFixed(1)} MB</small><button type="button" onClick={() => { setFiles(current => current.filter((_, itemIndex) => itemIndex !== index)); idempotencyKey.current = ''; }}>{es ? 'Quitar' : 'Remove'}</button></li>)}</ul>}
          <p className="quote-intake-notice">{es ? 'Algunos usos (por ejemplo, contacto corporal, médico o estructural) requieren evaluación del taller. El asistente no certifica seguridad ni calcula precio.' : 'Some uses (such as body contact, medical or structural) need workshop evaluation. The assistant does not certify safety or calculate a price.'}</p>
          {error && <p className="quote-intake-error" role="alert">{error}{!authenticatedCustomer && <Link to="/login">{es ? ' Iniciar sesión ↗' : ' Sign in ↗'}</Link>}</p>}
          <button className="v-button v-button--primary quote-intake-submit" type="submit" disabled={busy}>{busy ? (es ? 'Enviando solicitud…' : 'Sending request…') : (es ? 'Revisé el resumen · Enviar al taller' : 'I reviewed the summary · Send to workshop')} <span aria-hidden="true">↗</span></button>
          {!authenticatedCustomer && <small className="quote-intake-auth-note">{es ? 'Necesitás iniciar sesión con cuenta de cliente para enviarla. ' : 'Sign in with a customer account to submit. '}<Link to="/login">{es ? 'Iniciar sesión' : 'Sign in'} ↗</Link></small>}
        </>}
      </form>
    </div>}
  </section>;
}
