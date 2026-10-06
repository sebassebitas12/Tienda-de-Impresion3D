import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { usePreferences } from '../hooks/usePreferences.js';
import { submitQuoteIntake, automationError } from '../services/automationService.js';
import { FDM_MATERIALS } from '../utils/quotePricing.js';
import { isValidQuoteDimensions, parseQuoteDimensions } from '../utils/quoteDimensions.js';
import { AssistantPanel } from '../features/chatbot/AssistantPanel.jsx';
import './quotes.css';
import './quote-intake.css';

const emptyDraft = { description: '', intendedUse: '', dimensions: '', dimensionsUnit: 'cm', material: '', quantity: 1, needsDesign: false, referenceUrl: '' };
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function readPersistedQuoteDraft() {
  try {
    const raw = (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('vertice.quote.draft'))
      || (typeof localStorage !== 'undefined' && localStorage.getItem('vertice.quote.draft'));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function QuoteRequestPage() {
  const location = useLocation();
  const summaryHeading = useRef(null);
  const intent = location.pathname.endsWith('/archivo') ? 'file' : location.pathname.endsWith('/ayuda-diseno') ? 'design' : null;
  const auth = useAuth();
  const { language } = usePreferences();
  const es = language !== 'en';

  const [persistedSnapshot] = useState(() => readPersistedQuoteDraft());
  const manuallyEditedFields = useRef(new Set(persistedSnapshot?.manuallyEditedFields || []));
  const [editedFieldNames, setEditedFieldNames] = useState(() => [...(persistedSnapshot?.manuallyEditedFields || [])]);

  const [draft, setDraft] = useState(() => (persistedSnapshot?.draft ? { ...emptyDraft, ...persistedSnapshot.draft } : emptyDraft));
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(null);
  const [assistantDraftReady, setAssistantDraftReady] = useState(() => Boolean(persistedSnapshot?.assistantDraftReady));
  const [assistantDraftSource, setAssistantDraftSource] = useState(() => persistedSnapshot?.assistantDraftSource || (persistedSnapshot?.assistantDraftReady ? 'ai' : ''));
  const [restoredNotice, setRestoredNotice] = useState(() => {
    if (!persistedSnapshot?.draft) return '';
    if (persistedSnapshot.unpersistedFileNames?.length) {
      return es
        ? `Recuperamos los datos de tu solicitud. Por seguridad del navegador, los archivos adjuntos (${persistedSnapshot.unpersistedFileNames.join(', ')}) deben seleccionarse nuevamente.`
        : `Your request details were restored. Due to browser security, attachments (${persistedSnapshot.unpersistedFileNames.join(', ')}) must be selected again.`;
    }
    return es
      ? 'Recuperamos los datos de tu solicitud para que puedas continuar.'
      : 'Your request details were restored so you can continue.';
  });
  const idempotencyKey = useRef('');
  const submitLock = useRef(false);
  const authenticatedCustomer = auth?.user?.role === 'customer';
  const dimensionsDefaultUnit = intent === 'file' ? draft.dimensionsUnit : '';
  const invalidDimensions = !isValidQuoteDimensions(draft.dimensions, dimensionsDefaultUnit);
  const quoteDimensions = parseQuoteDimensions(draft.dimensions, dimensionsDefaultUnit);
  const needsAssistantDraft = intent === 'design' && !assistantDraftReady;

  function persistDraft(nextDraft, nextFiles, nextAssistantReady, nextAssistantSource = assistantDraftSource) {
    try {
      const hasContent = Object.entries(nextDraft).some(([k, v]) => v && v !== emptyDraft[k]);
      if (!hasContent && !nextFiles.length) {
        sessionStorage.removeItem('vertice.quote.draft');
        localStorage.removeItem('vertice.quote.draft');
        return;
      }
      const payload = JSON.stringify({
        draft: nextDraft,
        assistantDraftReady: nextAssistantReady,
        assistantDraftSource: nextAssistantReady ? nextAssistantSource : '',
        manuallyEditedFields: [...manuallyEditedFields.current],
        unpersistedFileNames: nextFiles.map(f => f.name),
        savedAt: Date.now(),
      });
      sessionStorage.setItem('vertice.quote.draft', payload);
      localStorage.setItem('vertice.quote.draft', payload);
    } catch {
      // storage unavailable
    }
  }

  function updateDraft(key, value) {
    manuallyEditedFields.current.add(key);
    setEditedFieldNames(current => current.includes(key) ? current : [...current, key]);
    setDraft(current => {
      const next = { ...current, [key]: value };
      persistDraft(next, files, assistantDraftReady, assistantDraftSource);
      return next;
    });
    idempotencyKey.current = '';
    setError('');
    setRestoredNotice('');
  }

  function applyAssistantDraft(value, metadata = {}) {
    if (!value || typeof value !== 'object') return;
    const ready = metadata.ready === true;
    const clearFields = new Set(ready && Array.isArray(metadata.clearFields) ? metadata.clearFields : []);
    clearFields.forEach(key => manuallyEditedFields.current.delete(key));
    const source = ready ? metadata.source || 'ai' : '';
    setAssistantDraftReady(ready);
    setAssistantDraftSource(source);
    setDraft(current => {
      const next = Object.fromEntries(Object.entries(current).map(([key, previous]) => {
        if (clearFields.has(key)) return [key, emptyDraft[key]];
        const incoming = value[key];
        if (incoming !== undefined && incoming !== null && incoming !== '') {
          manuallyEditedFields.current.delete(key);
          return [key, incoming];
        }
        if (manuallyEditedFields.current.has(key)) return [key, previous];
        return [key, emptyDraft[key]];
      }));
      setEditedFieldNames([...manuallyEditedFields.current]);
      persistDraft(next, files, ready, source);
      return next;
    });
    idempotencyKey.current = '';
    setError('');
    setRestoredNotice('');
  }

  function reviewSummary() {
    const heading = summaryHeading.current;
    if (!heading) return;
    const formElement = heading.closest('form');
    if (formElement) {
      formElement.classList.remove('is-highlighted-pulse');
      void formElement.offsetWidth;
      formElement.classList.add('is-highlighted-pulse');
      setTimeout(() => formElement.classList.remove('is-highlighted-pulse'), 1400);
    }
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
    persistDraft(draft, selected, assistantDraftReady, assistantDraftSource);
    idempotencyKey.current = '';
    setError('');
    setRestoredNotice('');
  }

  async function submit(event) {
    event.preventDefault();
    if (submitLock.current) return;
    setError('');
    if (!authenticatedCustomer) { setError(es ? 'Iniciá sesión con una cuenta de cliente para enviar esta solicitud.' : 'Sign in with a customer account to submit this request.'); return; }
    if (draft.description.trim().length < 3) { setError(es ? 'Contá brevemente qué pieza necesitás.' : 'Briefly describe the part you need.'); return; }
    if (draft.referenceUrl && !/^https:\/\//i.test(draft.referenceUrl.trim())) { setError(es ? 'La referencia debe ser un enlace HTTPS.' : 'The reference must be an HTTPS link.'); return; }
    if (invalidDimensions) { setError(es ? 'Revisá las medidas: usá números mayores que cero, unidades y separadores. Ej.: largo 15 cm, ancho 8 cm.' : 'Check the dimensions: use numbers above zero, units and separators. Example: length 15 cm, width 8 cm.'); document.getElementById('quote-intake-dimensions')?.focus(); return; }
    submitLock.current = true;
    setBusy(true);
    if (!idempotencyKey.current) idempotencyKey.current = globalThis.crypto?.randomUUID?.() || `rq-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    try {
      const dimensions = intent === 'file' && draft.dimensions.trim() && !quoteDimensions.hasExplicitUnits
        ? `${draft.dimensions.trim()} ${draft.dimensionsUnit}`
        : draft.dimensions.trim();
      const result = await submitQuoteIntake({ ...draft, dimensions, description: draft.description.trim(), referenceUrl: draft.referenceUrl.trim(), sourceType: intent === 'file' ? 'FILE_UPLOAD' : 'DESIGN_HELP', idempotencyKey: idempotencyKey.current }, files, { token: auth?.token });
      setSubmitted(result.request);
      try {
        sessionStorage.removeItem('vertice.quote.draft');
        localStorage.removeItem('vertice.quote.draft');
        sessionStorage.removeItem('vertice.quote.thread');
      } catch {
        // cleanup fallback
      }
    } catch (failure) { setError(automationError(failure.code, language)); }
    finally { setBusy(false); submitLock.current = false; }
  }

  const heading = intent === 'file' ? (es ? 'Mandá tu modelo y sus referencias.' : 'Send your model and references.')
    : intent === 'design' ? (es ? 'Contanos qué querés crear.' : 'Tell us what you want to make.')
      : (es ? '¿En qué punto estás?' : 'Where are you starting?');
  return <section className={`quote-page${intent ? ' quote-page--intake' : ''}`} aria-labelledby="quote-title" aria-busy={busy}>
    {intent && <div className="quote-intake-nav-bar">
      <Link className="quote-back" to="/solicitud">← {es ? 'Cambiar tipo de proyecto' : 'Change project type'}</Link>
      <nav className="quote-mode-switcher" aria-label={es ? 'Modo de solicitud' : 'Request mode'}>
        <Link to="/solicitud/archivo" className={`quote-mode-tab${intent === 'file' ? ' is-active' : ''}`} aria-current={intent === 'file' ? 'page' : undefined}>
          <span aria-hidden="true">📄</span> {es ? 'Formulario directo (Modelo o archivo)' : 'Direct form (Model or file)'}
        </Link>
        <Link to="/solicitud/ayuda-diseno" className={`quote-mode-tab${intent === 'design' ? ' is-active' : ''}`} aria-current={intent === 'design' ? 'page' : undefined}>
          <span aria-hidden="true">🤖</span> {es ? 'Con asistente IA (Ayuda de diseño)' : 'With AI assistant (Design help)'}
        </Link>
      </nav>
    </div>}
    <header><span className="quote-eyebrow">{es ? 'TU PROYECTO · VÉRTICE CR' : 'YOUR PROJECT · VÉRTICE CR'}</span><h1 id="quote-title">{submitted ? (es ? 'Solicitud recibida.' : 'Request received.') : heading}</h1>
      <p>{submitted ? (es ? 'Conservá tu referencia y seguí la respuesta del taller desde tu cuenta.' : 'Keep your reference and follow the workshop response from your account.') : intent === 'file' ? (es ? 'Adjuntá el archivo, fotos o enlaces que ayuden a entender la pieza. El taller recibe una solicitud sin precio automático.' : 'Attach the model, photos or links that help explain the part. The workshop receives a request, not an automatic price.') : intent === 'design' ? (es ? 'Contá qué pieza querés cotizar y para qué sirve; no necesitás saber las medidas. La IA ordena el resumen. El taller revisa los datos y prepara la cotización. Los adjuntos llegan al taller, pero la IA no analiza imágenes ni mide archivos 3D.' : 'Describe the part you want quoted and what it does; you do not need exact dimensions. AI organizes the request. The workshop reviews it and prepares the quote. Attachments reach the workshop, but AI does not inspect images or measure 3D files.') : (es ? 'Elegí el camino que se parece a tu proyecto. Siempre podés adjuntar referencias para explicar lo que necesitás.' : 'Choose the path that fits your project. You can always attach references to show what you need.')}</p></header>

    {!intent && <nav className="quote-intents" aria-label={es ? 'Tipo de cotización' : 'Quote type'}>
      <Link className="quote-intent" to="/solicitud/archivo"><span className="quote-intent__index">{es ? 'MODELO O PIEZA' : 'MODEL OR PART'}</span><h2>{es ? 'Ya tengo una pieza o referencia' : 'I have a part or reference'}</h2><p>{es ? 'Adjuntá un STL/OBJ, imágenes o enlaces y describí qué necesitas.' : 'Attach an STL/OBJ, images or links and describe what you need.'}</p><strong>{es ? 'Preparar solicitud' : 'Prepare request'} <span aria-hidden="true">↗</span></strong></Link>
      <Link className="quote-intent" to="/solicitud/ayuda-diseno"><span className="quote-intent__index">{es ? 'IDEA O PROYECTO' : 'IDEA OR PROJECT'}</span><h2>{es ? 'Quiero ayuda para definirla' : 'Help me define it'}</h2><p>{es ? 'Conversá con el asistente y revisá el resumen antes de enviarlo.' : 'Talk to the assistant and review the summary before submitting.'}</p><strong>{es ? 'Organizar mi idea' : 'Organize my idea'} <span aria-hidden="true">↗</span></strong></Link>
    </nav>}

    {intent && <div className={`quote-intake-layout${intent === 'file' ? ' quote-intake-layout--file' : ''}`}>
      {submitted ? <aside className="quote-intake-brief"><span className="quote-eyebrow">{es ? 'SIGUIENTE PASO' : 'NEXT STEP'}</span><h2>{es ? 'Tu proyecto ya está en el taller.' : 'Your project is with the workshop.'}</h2><p>{es ? 'El taller revisará el alcance y te enviará una oferta por correo. La aprobación y el pago DEMO se hacen desde tu cuenta; no necesitás responder el correo para aprobar.' : 'The workshop will review the scope and email an offer. Approve and pay in DEMO mode from your account, not by replying to the email.'}</p><ul><li>{es ? 'Revisión del taller' : 'Workshop review'}</li><li>{es ? 'Oferta por correo y en tu cuenta' : 'Offer by email and in your account'}</li><li>{es ? 'Tu aprobación → pago DEMO → seguimiento' : 'Your approval → DEMO payment → tracking'}</li></ul></aside> : intent === 'design' ? <AssistantPanel mode="quote" id="quote-assistant" embedded onDraftChange={applyAssistantDraft} draftReady={assistantDraftReady} draftContext={{ values: draft, editedFields: editedFieldNames }} onReviewDraft={reviewSummary} />
        : <aside className="quote-intake-brief"><span className="quote-eyebrow">{es ? 'REFERENCIAS TÉCNICAS' : 'TECHNICAL REFERENCES'}</span><h2>{es ? 'Mostrá la pieza desde varios ángulos.' : 'Show the part from useful angles.'}</h2><p>{es ? 'Podés adjuntar fotos, STL u OBJ y compartir un enlace HTTPS. La imagen ayuda al taller a entender la intención; no se usa para fingir mediciones.' : 'Attach photos, STL or OBJ files, or share an HTTPS link. Images help the workshop understand the intent; they are not treated as measurements.'}</p><ul><li>{es ? 'Hasta 5 archivos, máximo 5 MB cada uno' : 'Up to 5 files, 5 MB each'}</li><li>{es ? 'PNG, JPG, WebP, GIF, STL u OBJ' : 'PNG, JPG, WebP, GIF, STL or OBJ'}</li><li>{es ? 'No se calcula un precio al enviar' : 'No price is calculated on submission'}</li></ul></aside>}

      <form className="quote-intake-form" onSubmit={submit}>
        {!submitted && <div className="quote-intake-form__heading"><div className="quote-intake-form__meta"><span className="quote-eyebrow">{es ? 'RESUMEN DE SOLICITUD' : 'REQUEST SUMMARY'}</span><span className={`quote-intake-form__state${assistantDraftReady ? ' is-ready' : ''}`}>{intent === 'design' ? assistantDraftReady ? assistantDraftSource === 'local-fallback' ? (es ? 'BORRADOR LOCAL · REVISÁ LOS DATOS' : 'LOCAL DRAFT · REVIEW DETAILS') : (es ? 'RESUMEN IA · LISTO PARA REVISAR' : 'AI SUMMARY · READY TO REVIEW') : (es ? 'ESPERANDO RESUMEN DE IA' : 'WAITING FOR AI SUMMARY') : (es ? 'DATOS PARA REVISIÓN DEL TALLER' : 'DETAILS FOR WORKSHOP REVIEW')}</span></div><h2 ref={summaryHeading} tabIndex="-1">{intent === 'design' ? assistantDraftReady ? assistantDraftSource === 'local-fallback' ? (es ? 'Revisá el borrador de tus datos.' : 'Review the draft from your details.') : (es ? 'Revisá lo que organizó la IA.' : 'Review what AI organized.') : (es ? 'Tu idea se convierte en solicitud acá.' : 'Your idea becomes a request here.') : (es ? 'Revisá lo que va a recibir el taller.' : 'Review what the workshop will receive.')}</h2><p>{intent === 'design' ? assistantDraftReady ? assistantDraftSource === 'local-fallback' ? (es ? 'Organizamos un resumen con los detalles de tu conversación. Revisá cada campo antes de enviar al taller.' : 'We organized a summary with details from your conversation. Review each field before sending to the workshop.') : (es ? 'La IA separó lo que contaste y dejó vacío lo que no especificaste. Corregí lo necesario y agregá referencias.' : 'AI organized your details and left unspecified items blank. Correct anything needed and add references.') : (es ? 'Conversá con el asistente. Para preparar el resumen, combinará tus mensajes con los datos visibles de este formulario. Nada se envía sin que lo revisés.' : 'Talk to the assistant. To prepare a summary, it combines your messages with the visible form data. Nothing is sent until you review it.') : (es ? 'No hace falta saberlo todo ahora. Lo que no conozcas puede quedar sin definir.' : 'You do not need every detail now. Unknowns can remain unspecified.')}</p></div>}
        {submitted ? <div className="quote-intake-success" role="status"><span>✓</span><div><h3>{es ? 'Solicitud enviada al taller' : 'Request sent to the workshop'}</h3><p>{es ? `Referencia ${submitted.id.slice(0, 18)}… Tu solicitud fue recibida por el taller. No se generó un precio automático; el taller la revisará para enviarte la cotización formal.` : `Reference ${submitted.id.slice(0, 18)}… Your request was received. No price was created automatically; the workshop will review it to send a formal quote.`}</p><Link to="/cuenta">{es ? 'Ver mis solicitudes' : 'View my requests'} ↗</Link></div></div> : <>
          <label>{es ? '¿Qué querés fabricar?' : 'What do you want to make?'}<textarea rows="4" maxLength="2000" required value={draft.description} onChange={event => updateDraft('description', event.target.value)} placeholder={es ? 'Ej.: necesito cotizar solo el brazo robótico de una banda transportadora.' : 'Example: I need a quote for only the robotic arm on a conveyor belt.'} /></label>
          <label>{es ? '¿Para qué la vas a usar?' : 'What will you use it for?'}<input maxLength="500" value={draft.intendedUse} onChange={event => updateDraft('intendedUse', event.target.value)} placeholder={es ? 'Uso previsto (si ya lo sabés)' : 'Intended use (if known)'} /></label>
          <div className="quote-intake-form__grid">{intent === 'file' ? <div className="quote-intake-dimensions"><label htmlFor="quote-intake-dimensions">{es ? 'Medidas aproximadas (si las sabés)' : 'Approximate dimensions (if known)'}</label><div><input id="quote-intake-dimensions" maxLength="180" aria-invalid={invalidDimensions || undefined} aria-describedby={invalidDimensions ? 'quote-dimensions-error' : quoteDimensions.exceedsK1C ? 'quote-dimensions-warning' : 'quote-dimensions-help'} value={draft.dimensions} onChange={event => updateDraft('dimensions', event.target.value)} placeholder={es ? 'Ej.: 15 × 8 × 4' : 'e.g. 15 × 8 × 4'} /><label className="quote-intake-dimensions__unit-label" htmlFor="quote-intake-dimensions-unit">{es ? 'Unidad' : 'Unit'}</label><select id="quote-intake-dimensions-unit" aria-label={es ? 'Unidad de medida' : 'Measurement unit'} value={draft.dimensionsUnit} onChange={event => updateDraft('dimensionsUnit', event.target.value)}><option value="mm">mm</option><option value="cm">cm</option><option value="in">in</option></select></div><small id={invalidDimensions ? 'quote-dimensions-error' : 'quote-dimensions-help'} className={invalidDimensions ? 'quote-intake-error' : undefined} role={invalidDimensions ? 'alert' : undefined}>{invalidDimensions ? (es ? 'Solo medidas legibles, mayores que cero y con unidad. Ej.: 15 × 8 × 4 cm.' : 'Use readable measurements above zero and include a unit. Example: 15 × 8 × 4 cm.') : (es ? 'Podés dejarlo vacío. Si escribís solo números, se usa la unidad seleccionada; también podés indicar otra unidad en el texto.' : 'You can leave this blank. For numbers only, the selected unit applies; you may also include units in the text.')}</small>{invalidDimensions && <button type="button" className="quote-intake-clear-dimensions" onClick={() => updateDraft('dimensions', '')}>{es ? 'Dejar medidas sin definir (vacío)' : 'Leave dimensions unspecified (empty)'}</button>}{!invalidDimensions && quoteDimensions.exceedsK1C && <small id="quote-dimensions-warning" className="quote-intake-dimensions__warning" role="note">{es ? 'Puede exceder el volumen de una impresión en la Creality K1C (220 × 220 × 250 mm); el taller evaluará orientación o división en piezas.' : 'May exceed the Creality K1C single-print envelope (220 × 220 × 250 mm); the workshop will assess orientation or splitting it into parts.'}</small>}</div> : <label>{es ? 'Medidas aproximadas (si las sabés)' : 'Approximate dimensions (if known)'}<input id="quote-intake-dimensions" maxLength="200" aria-invalid={invalidDimensions || undefined} aria-describedby={invalidDimensions ? 'quote-dimensions-error' : quoteDimensions.exceedsK1C ? 'quote-dimensions-warning' : 'quote-dimensions-help'} value={draft.dimensions} onChange={event => updateDraft('dimensions', event.target.value)} placeholder={es ? 'Ej.: largo 15 cm, ancho 8 cm' : 'e.g. length 15 cm, width 8 cm'} /><small id={invalidDimensions ? 'quote-dimensions-error' : 'quote-dimensions-help'} className={invalidDimensions ? 'quote-intake-error' : undefined} role={invalidDimensions ? 'alert' : undefined}>{invalidDimensions ? (es ? 'Solo medidas legibles, mayores que cero y con unidad. Ej.: largo 15 cm, ancho 8 cm.' : 'Use readable measurements above zero and include a unit. Example: length 15 cm, width 8 cm.') : (es ? 'Podés dejarlo vacío. Si lo completás, indicá las unidades.' : 'You can leave this blank. If entered, include units.')}</small>{invalidDimensions && <button type="button" className="quote-intake-clear-dimensions" onClick={() => updateDraft('dimensions', '')}>{es ? 'Dejar medidas sin definir (vacío)' : 'Leave dimensions unspecified (empty)'}</button>}{!invalidDimensions && quoteDimensions.exceedsK1C && <small id="quote-dimensions-warning" className="quote-intake-dimensions__warning" role="note">{es ? 'Puede exceder el volumen de una impresión en la Creality K1C (220 × 220 × 250 mm); el taller evaluará orientación o división en piezas.' : 'May exceed the Creality K1C single-print envelope (220 × 220 × 250 mm); the workshop will assess orientation or splitting it into parts.'}</small>}</label>}
            <label>{es ? 'Material deseado' : 'Preferred material'}<select value={draft.material} onChange={event => updateDraft('material', event.target.value)}><option value="">{es ? 'Aún no definido' : 'Not decided'}</option>{FDM_MATERIALS.map(material => <option key={material}>{material}</option>)}</select></label>
            <label>{es ? 'Cantidad' : 'Quantity'}<input type="number" min="1" max="100" step="1" value={draft.quantity} onChange={event => updateDraft('quantity', Number(event.target.value))} /></label>
            <label className="quote-intake-check"><input type="checkbox" checked={draft.needsDesign} onChange={event => updateDraft('needsDesign', event.target.checked)} />{es ? 'Necesito ayuda con el diseño' : 'I need design help'}</label></div>
          <label>{es ? 'Enlace de referencia (opcional)' : 'Reference link (optional)'}<input type="url" value={draft.referenceUrl} onChange={event => updateDraft('referenceUrl', event.target.value)} placeholder="https://" /></label>
          <label className="quote-intake-upload">{es ? 'Fotos o archivos 3D' : 'Photos or 3D files'}<input type="file" accept="image/png,image/jpeg,image/webp,image/gif,.stl,.obj" multiple onChange={selectFiles} /><small>{es ? 'Hasta 5 archivos · 5 MB máximo cada uno' : 'Up to 5 files · 5 MB maximum each'}</small></label>
          {files.length > 0 && <ul className="quote-intake-files" aria-label={es ? 'Archivos seleccionados' : 'Selected files'}>{files.map((file, index) => <li key={`${file.name}-${index}`}><span>{file.name}</span><small>{(file.size / 1024 / 1024).toFixed(1)} MB</small><button type="button" onClick={() => { setFiles(current => { const next = current.filter((_, itemIndex) => itemIndex !== index); persistDraft(draft, next, assistantDraftReady); return next; }); idempotencyKey.current = ''; }}>{es ? 'Quitar' : 'Remove'}</button></li>)}</ul>}
          {restoredNotice && <p className="quote-intake-restored" role="status">{restoredNotice}</p>}
          <p className="quote-intake-notice">{es ? 'Algunos usos (por ejemplo, contacto corporal, médico o estructural) requieren evaluación del taller. El asistente no certifica seguridad ni calcula precio.' : 'Some uses (such as body contact, medical or structural) need workshop evaluation. The assistant does not certify safety or calculate a price.'}</p>
          {error && <p className="quote-intake-error" role="alert">{error}{!authenticatedCustomer && <Link to="/login" state={{ from: location.pathname }}>{es ? ' Iniciar sesión ↗' : ' Sign in ↗'}</Link>}</p>}
          {intent === 'design' && needsAssistantDraft && <p className="quote-intake-assistant-note" role="status">{es ? 'Primero pedile al asistente que prepare el resumen. Combinará lo que escribiste en el chat y en este formulario; no se enviará hasta que revisés el borrador.' : 'First ask the assistant to prepare the summary. It will combine your chat and form entries; nothing is sent until you review the draft.'}</p>}
          {authenticatedCustomer ? <button className="v-button v-button--primary quote-intake-submit" type="submit" disabled={busy || needsAssistantDraft}>{busy ? (es ? 'Enviando solicitud…' : 'Sending request…') : needsAssistantDraft ? (es ? 'Esperando el resumen de la IA…' : 'Waiting for the AI summary…') : (es ? 'Revisé el resumen · Enviar al taller' : 'I reviewed the summary · Send to workshop')} <span aria-hidden="true">↗</span></button> : auth?.user?.role === 'admin' ? <p className="quote-intake-auth-note">{es ? 'Estás en una cuenta Admin. Gestioná solicitudes desde Administración; el envío corresponde a una cuenta de cliente.' : 'You are signed in as Admin. Manage requests from Administration; submitting requires a customer account.'}<Link to="/admin/solicitudes"> {es ? 'Abrir solicitudes' : 'Open requests'} ↗</Link></p> : needsAssistantDraft ? <p className="quote-intake-auth-note">{es ? 'Cuando el asistente prepare el borrador, podrás iniciar sesión para enviarlo.' : 'Once the assistant prepares the draft, you can sign in to submit it.'}</p> : <><Link className="v-button v-button--primary quote-intake-submit" to="/login" state={{ from: location.pathname }}>{es ? 'Iniciar sesión para enviar' : 'Sign in to submit'} ↗</Link><small className="quote-intake-auth-note">{es ? 'Tu resumen se conserva al iniciar sesión. Los adjuntos deben seleccionarse de nuevo al volver.' : 'Your summary is preserved when signing in. Reselect attachments when you return.'}</small></>}
        </>}
      </form>
    </div>}
  </section>;
}
