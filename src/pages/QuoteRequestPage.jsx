import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { usePreferences } from '../hooks/usePreferences.js';
import { automationAction, automationError } from '../services/automationService.js';
import { FDM_MATERIALS } from '../utils/quotePricing.js';
import { formatCRC } from '../utils/money.js';
import { AssistantPanel } from '../features/chatbot/AssistantPanel.jsx';
import './quotes.css';

export function QuoteRequestPage() {
  const location = useLocation();
  const intent = location.pathname.endsWith('/archivo') ? 'file' : location.pathname.endsWith('/ayuda-diseno') ? 'design' : null;
  const auth = useAuth();
  const { language } = usePreferences();
  const es = language === 'es';
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState({ profileId: 'organizador', material: 'PLA', quantity: 1, sizeScale: 1, needsDesign: false, description: '' });
  const [quote, setQuote] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [assistant, setAssistant] = useState(false);
  const trigger = useRef(null);
  useEffect(() => {
    const abort = new AbortController();
    automationAction('/quotes/profiles', {}, { signal: abort.signal }).then(data => setProfiles(data.profiles)).catch(failure => {
      if (failure.name !== 'AbortError') setError(es ? 'No pudimos cargar las referencias. Revisá la conexión.' : 'Could not load reference models. Check your connection.');
    });
    return () => abort.abort();
  }, [es]);
  const profile = profiles.find(item => item.id === form.profileId);
  const update = (name, value) => { setForm(current => ({ ...current, [name]: value })); setQuote(null); setError(''); };
  async function calculate(event) {
    event.preventDefault(); setBusy(true); setError('');
    try { const data = await automationAction('/quotes/preview', form); setQuote(data.quote); }
    catch (failure) { setError(automationError(failure.code)); }
    finally { setBusy(false); }
  }
  return <section className="quote-page" aria-labelledby="quote-title" aria-busy={busy}>
    <header><span className="quote-eyebrow">{es ? 'Cotización de piezas personalizadas' : 'Custom part quotes'}</span><h1 id="quote-title">{es ? '¿En qué punto estás?' : 'Where are you starting?'}</h1>
      <p>{es ? 'Elegí el camino que se parece a tu proyecto. El taller revisa cada encargo antes de confirmar precio y fabricación.' : 'Choose the path that fits your project. The workshop reviews each request before confirming price and production.'}</p></header>
    <nav className="quote-intents" aria-label={es ? 'Tipo de cotización' : 'Quote type'}>
      <Link className={`quote-intent${intent === 'file' ? ' is-active' : ''}`} aria-current={intent === 'file' ? 'page' : undefined} to="/solicitud/archivo">
        <span className="quote-intent__index">01 / ARCHIVO</span><h2>{es ? 'Ya tengo la pieza' : 'I have the part'}</h2>
        <p>{es ? 'Tenés el modelo listo y querés pedir una revisión técnica para cotizarlo.' : 'Your model is ready and you want a technical review for a quote.'}</p><strong>{es ? 'Ver ruta de archivo' : 'View file route'} <span aria-hidden="true">↗</span></strong>
      </Link>
      <Link className={`quote-intent${intent === 'design' ? ' is-active' : ''}`} aria-current={intent === 'design' ? 'page' : undefined} to="/solicitud/ayuda-diseno">
        <span className="quote-intent__index">02 / DISEÑO</span><h2>{es ? 'Quiero ayuda para crearla' : 'Help me design it'}</h2>
        <p>{es ? 'Conversá con el asistente para aclarar uso, dimensiones y material antes de pedir la revisión del taller.' : 'Talk with the assistant to clarify use, dimensions and material before workshop review.'}</p><strong>{es ? 'Abrir asistente de cotización' : 'Open quote assistant'} <span aria-hidden="true">↗</span></strong>
      </Link>
    </nav>
    {intent === 'file' && <section className="quote-route-note" aria-live="polite"><span className="quote-eyebrow">{es ? 'Recepción de archivos' : 'File intake'}</span><h2>{es ? 'La carga segura aún no está conectada.' : 'Secure upload is not connected yet.'}</h2><p>{es ? 'No selecciones ni envíes archivos aquí todavía: la app aún no los almacena ni los entrega al taller. Este paso requiere almacenamiento privado y acceso protegido desde Admin. Mientras tanto, podés probar el estimador de referencia DEMO abajo.' : 'Do not select or send files here yet: the app does not store or deliver them to the workshop. This requires private storage and protected Admin access. You can try the DEMO reference estimator below.'}</p></section>}
    {intent === 'design' && <section className="quote-route-note quote-route-note--design"><span className="quote-eyebrow">{es ? 'Asistencia para diseñar' : 'Design assistance'}</span><h2>{es ? 'Contale qué querés resolver.' : 'Tell us what you want to make.'}</h2><p>{es ? 'El asistente puede orientar materiales y perfiles de referencia. Las estimaciones son DEMO; al terminar, el taller debe revisar y confirmar la cotización.' : 'The assistant can guide material and reference profiles. Estimates are DEMO; the workshop must review and confirm the quote.'}</p><button type="button" ref={trigger} className="v-button v-button--primary" aria-expanded={assistant} aria-controls="quote-assistant" onClick={() => setAssistant(true)}>{es ? 'Conversar con el asistente' : 'Talk to the assistant'} <span aria-hidden="true">↗</span></button></section>}
    <details className="quote-demo-disclosure">
      <summary>{es ? 'Probar el estimador de referencia DEMO' : 'Try the DEMO reference estimator'}</summary>
    <div className="quote-layout"><form className="quote-form" onSubmit={calculate}>
      <h2>{es ? '1. Definí la pieza' : '1. Define your model'}</h2>
      <label>{es ? 'Referencia para la simulación' : 'Simulation reference'}<select required disabled={busy || !profiles.length} value={form.profileId} onChange={event => update('profileId', event.target.value)}>{profiles.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      {profile && <div className="quote-reference"><img src={profile.image} alt={profile.name} /><div><strong>{profile.name}</strong><span>{profile.weightGrams} g · {profile.printHours} h</span><small>{es ? 'Análogo DEMO · no corresponde a un STL medido ni confirma stock.' : 'DEMO analogue · not a measured STL or proof of stock.'}</small></div></div>}
      <div className="quote-form-grid"><label>{es ? 'Material' : 'Material'}<select value={form.material} onChange={event => update('material', event.target.value)} disabled={busy}>{FDM_MATERIALS.map(item => <option key={item}>{item}</option>)}</select></label>
        <label>{es ? 'Cantidad' : 'Quantity'}<input required type="number" min="1" max="100" step="1" value={form.quantity} onChange={event => update('quantity', Number(event.target.value))} disabled={busy} /></label>
        <label>{es ? 'Escala respecto a la referencia' : 'Scale relative to reference'}<select value={form.sizeScale} onChange={event => update('sizeScale', Number(event.target.value))} disabled={busy}><option value="0.5">50%</option><option value="1">100%</option><option value="1.5">150%</option><option value="2">200%</option></select></label>
      </div>
      <label className="quote-checkbox"><input type="checkbox" checked={form.needsDesign} onChange={event => update('needsDesign', event.target.checked)} disabled={busy} />{es ? 'Necesito diseño (0,75 h DEMO por pedido)' : 'I need design (0.75 DEMO hours per order)'}</label>
      <label>{es ? '¿Para qué la necesitás?' : 'What will you use it for?'}<textarea required minLength={3} maxLength={2000} rows={3} value={form.description} onChange={event => update('description', event.target.value)} disabled={busy} /></label>
      <p className="quote-help">{es ? 'No admite aplicaciones médicas, alimentarias o críticas. Este cálculo usa un modelo análogo: no mide un archivo, no se envía al taller y no autoriza fabricación ni pagos.' : 'Medical, food-contact and safety-critical uses are excluded. This calculation uses an analogue: it does not measure a file, go to the workshop or authorize production or payment.'}</p>
      <button className="v-button v-button--primary" type="submit" disabled={busy || !profiles.length}>{busy ? (es ? 'Calculando…' : 'Calculating…') : (es ? 'Ver simulación DEMO' : 'See DEMO estimate')}</button>
    </form><aside className="quote-result" aria-live="polite"><span className="quote-eyebrow">{es ? '2. Tu cálculo' : '2. Your calculation'}</span>
      {!quote ? <><h2>{es ? 'Todo a la vista.' : 'All costs, visible.'}</h2><p>{es ? 'Material, desgaste, energía, trabajo y diseño. Nada de montos inventados por un chatbot: el motor aplica una fórmula reproducible.' : 'Material, wear, energy, labor and design. A reproducible formula calculates the amount, not a chatbot.'}</p></>
        : <><h2>{formatCRC(quote.breakdown.amountCrc)}</h2><span className="quote-demo">DEMO · {es ? 'simulación' : 'simulation'}</span><dl>{[['Material', 'materialCrc'], [es ? 'Desgaste' : 'Wear', 'wearCrc'], [es ? 'Electricidad' : 'Electricity', 'electricityCrc'], [es ? 'Postprocesado' : 'Post-processing', 'postProcessCrc'], [es ? 'Diseño' : 'Design', 'designCrc']].map(([label, field]) => <div key={field}><dt>{label}</dt><dd>{formatCRC(quote.breakdown[field])}</dd></div>)}</dl>
          <p>{es ? 'Recargo sobre costo' : 'Markup'} {quote.breakdown.markupPercent}% · {es ? 'Válida hasta' : 'Valid until'} {quote.validUntil}</p><p className="quote-help">{quote.notes}</p>
          <p className="quote-workshop-review">{es ? 'Simulación local solamente. No se guarda como solicitud ni se manda por correo.' : 'Local simulation only. It is not saved as a request or sent by email.'}</p>
        </>}
      {error && <p role="alert">{error}</p>}
      {intent !== 'design' && <button type="button" ref={trigger} className="quote-assistant-link" aria-expanded={assistant} aria-controls="quote-assistant" onClick={() => setAssistant(value => !value)}>{es ? '¿Querés ayuda para definir la pieza? Abrir asistente' : 'Need help defining the part? Open assistant'} ✦</button>}
    </aside></div>
    </details>
    <AssistantPanel key={auth?.user?.id || 'guest'} mode="quote" id="quote-assistant" open={assistant} onClose={() => setAssistant(false)} triggerRef={trigger} />
  </section>;
}
