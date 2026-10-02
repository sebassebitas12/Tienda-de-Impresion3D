import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { usePreferences } from '../hooks/usePreferences.js';
import { automationAction, automationError } from '../services/automationService.js';
import { FDM_MATERIALS } from '../utils/quotePricing.js';
import { formatCRC } from '../utils/money.js';
import { AssistantPanel } from '../features/chatbot/AssistantPanel.jsx';
import { ReferencePicker } from '../features/customRequests/ReferencePicker.jsx';
import './quotes.css';

export function QuoteRequestPage() {
  const location = useLocation();
  const intent = location.pathname.endsWith('/archivo') ? 'file' : location.pathname.endsWith('/ayuda-diseno') ? 'design' : null;
  const auth = useAuth();
  const { language } = usePreferences();
  const es = language === 'es';
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState({ profileId: '', material: 'PLA', quantity: 1, sizeScale: 1, needsDesign: true, description: '' });
  const [quote, setQuote] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  useEffect(() => {
    if (intent !== 'design') return;
    const abort = new AbortController();
    automationAction('/quotes/profiles', {}, { signal: abort.signal }).then(data => setProfiles(data.profiles)).catch(failure => {
      if (failure.name !== 'AbortError') setError(es ? 'No pudimos cargar las referencias. Revisá la conexión.' : 'Could not load reference models. Check your connection.');
    }).finally(() => { if (!abort.signal.aborted) setLoadingProfiles(false); });
    return () => abort.abort();
  }, [es, intent]);
  const profile = profiles.find(item => item.id === form.profileId);
  const update = (name, value) => { setForm(current => ({ ...current, [name]: value })); setQuote(null); setError(''); };
  async function calculate(event) {
    event.preventDefault(); setBusy(true); setError('');
    try { const data = await automationAction('/quotes/preview', form); setQuote(data.quote); }
    catch (failure) { setError(automationError(failure.code)); }
    finally { setBusy(false); }
  }
  return <section className="quote-page" aria-labelledby="quote-title" aria-busy={busy}>
    {intent && <Link className="quote-back" to="/solicitud">← {es ? 'Cambiar tipo de proyecto' : 'Change project type'}</Link>}
    <header><span className="quote-eyebrow">{es ? 'Tu proyecto · Vértice CR' : 'Your project · Vértice CR'}</span><h1 id="quote-title">{intent === 'file' ? (es ? 'Cotizar un modelo existente.' : 'Quote an existing model.') : intent === 'design' ? (es ? 'Démosle forma a tu idea.' : 'Let’s shape your idea.') : (es ? '¿En qué punto estás?' : 'Where are you starting?')}</h1>
      <p>{intent === 'file' ? (es ? 'Ya tenés la pieza diseñada. El siguiente paso es revisar el modelo, su uso y cómo querés fabricarlo.' : 'Your part is already designed. Next, the workshop needs to review the model, its use and your manufacturing requirements.') : intent === 'design' ? (es ? 'Empezá con una conversación. El asistente te ayuda a definir la pieza; el taller confirma la viabilidad y el precio final.' : 'Start with a conversation. The assistant helps define your part; the workshop confirms feasibility and final pricing.') : (es ? 'Elegí el camino que se parece a tu proyecto. El taller revisa cada encargo antes de confirmar precio y fabricación.' : 'Choose the path that fits your project. The workshop reviews each request before confirming price and production.')}</p></header>
    {!intent && <nav className="quote-intents" aria-label={es ? 'Tipo de cotización' : 'Quote type'}>
      <Link className={`quote-intent${intent === 'file' ? ' is-active' : ''}`} aria-current={intent === 'file' ? 'page' : undefined} to="/solicitud/archivo">
        <span className="quote-intent__index">01 / ARCHIVO</span><h2>{es ? 'Ya tengo la pieza' : 'I have the part'}</h2>
        <p>{es ? 'Tenés el modelo listo y querés pedir una revisión técnica para cotizarlo.' : 'Your model is ready and you want a technical review for a quote.'}</p><strong>{es ? 'Ver ruta de archivo' : 'View file route'} <span aria-hidden="true">↗</span></strong>
      </Link>
      <Link className={`quote-intent${intent === 'design' ? ' is-active' : ''}`} aria-current={intent === 'design' ? 'page' : undefined} to="/solicitud/ayuda-diseno">
        <span className="quote-intent__index">02 / DISEÑO</span><h2>{es ? 'Quiero ayuda para crearla' : 'Help me design it'}</h2>
        <p>{es ? 'Conversá con el asistente para aclarar uso, dimensiones y material antes de pedir la revisión del taller.' : 'Talk with the assistant to clarify use, dimensions and material before workshop review.'}</p><strong>{es ? 'Abrir asistente de cotización' : 'Open quote assistant'} <span aria-hidden="true">↗</span></strong>
      </Link>
    </nav>}
    {intent === 'file' && <div className="quote-file-layout"><section className="quote-file-guide"><span className="quote-eyebrow">STL / OBJ</span><h2>{es ? 'Lo que necesita el taller' : 'What the workshop needs'}</h2><ul><li>{es ? 'Tu modelo en STL u OBJ.' : 'Your STL or OBJ model.'}</li><li>{es ? 'Dimensiones y unidades del modelo.' : 'Model dimensions and units.'}</li><li>{es ? 'Uso de la pieza y cantidad que necesitás.' : 'Intended use and quantity.'}</li><li>{es ? 'Material deseado, si ya lo tenés definido.' : 'Preferred material, if you know it.'}</li></ul><p>{es ? 'La revisión de tu archivo determina la cotización. Un modelo parecido no reemplaza esa revisión.' : 'Your file review determines the quote. A similar model cannot replace that review.'}</p></section><section className="quote-route-note"><h2>{es ? 'Recepción de archivos pendiente.' : 'File intake is pending.'}</h2><p>{es ? 'La recepción de archivos desde esta página todavía no está disponible. No podemos cotizar tu modelo hasta completar su recepción y revisión.' : 'File submission from this page is not available yet. We cannot quote your model until its intake and review are available.'}</p></section></div>}
    {intent === 'design' && <div className="quote-design-layout"><AssistantPanel key={auth?.user?.id || 'guest'} mode="quote" id="quote-assistant" embedded />
    <details className="quote-demo-disclosure" open>
      <summary>{es ? 'Explorar referencias y simular costos' : 'Explore references and demo costs'}<small>{es ? 'Opcional · valores DEMO' : 'Optional · DEMO values'}</small></summary>
    <div className="quote-layout"><form className="quote-form" onSubmit={calculate}>
      <ReferencePicker profiles={profiles} value={form.profileId} onChange={value => update('profileId', value)} disabled={busy} loading={loadingProfiles} language={language} />
      {profile && <p className="quote-help">{es ? 'El cálculo usará' : 'The estimate will use'}: <strong>{profile.name}</strong>.</p>}
      <div className="quote-form-grid"><label>{es ? 'Material' : 'Material'}<select value={form.material} onChange={event => update('material', event.target.value)} disabled={busy}>{FDM_MATERIALS.map(item => <option key={item}>{item}</option>)}</select></label>
        <label>{es ? 'Cantidad' : 'Quantity'}<input required type="number" min="1" max="100" step="1" value={form.quantity} onChange={event => update('quantity', Number(event.target.value))} disabled={busy} /></label>
        <label>{es ? 'Escala respecto a la referencia' : 'Scale relative to reference'}<select value={form.sizeScale} onChange={event => update('sizeScale', Number(event.target.value))} disabled={busy}><option value="0.5">50%</option><option value="1">100%</option><option value="1.5">150%</option><option value="2">200%</option></select></label>
      </div>
      <label className="quote-checkbox"><input type="checkbox" checked={form.needsDesign} onChange={event => update('needsDesign', event.target.checked)} disabled={busy} />{es ? 'Incluir diseño en la simulación' : 'Include design in the simulation'}</label>
      <label>{es ? '¿Para qué la necesitás?' : 'What will you use it for?'}<textarea required minLength={3} maxLength={2000} rows={3} value={form.description} onChange={event => update('description', event.target.value)} disabled={busy} /></label>
      <p className="quote-help">{es ? 'No admite aplicaciones médicas, alimentarias o críticas. Este cálculo usa un modelo análogo: no mide un archivo, no se envía al taller y no autoriza fabricación ni pagos.' : 'Medical, food-contact and safety-critical uses are excluded. This calculation uses an analogue: it does not measure a file, go to the workshop or authorize production or payment.'}</p>
      <button className="v-button v-button--primary" type="submit" disabled={busy || !profile}>{busy ? (es ? 'Calculando…' : 'Calculating…') : (es ? 'Ver simulación DEMO' : 'See DEMO estimate')}</button>
    </form><aside className="quote-result" aria-live="polite"><span className="quote-eyebrow">{es ? 'Estimación DEMO' : 'DEMO estimate'}</span>
      {!quote ? <><h2>{es ? 'Tu desglose, aquí.' : 'Your breakdown, here.'}</h2><p>{es ? 'Elegí una referencia y completá los datos para simular material, desgaste, energía, trabajo y diseño.' : 'Choose a reference and enter the details to simulate material, wear, energy, labor and design costs.'}</p></>
        : <><h2>{formatCRC(quote.breakdown.amountCrc)}</h2><span className="quote-demo">DEMO · {es ? 'simulación' : 'simulation'}</span><dl>{[['Material', 'materialCrc'], [es ? 'Desgaste' : 'Wear', 'wearCrc'], [es ? 'Electricidad' : 'Electricity', 'electricityCrc'], [es ? 'Postprocesado' : 'Post-processing', 'postProcessCrc'], [es ? 'Diseño' : 'Design', 'designCrc']].map(([label, field]) => <div key={field}><dt>{label}</dt><dd>{formatCRC(quote.breakdown[field])}</dd></div>)}</dl>
          <p>{es ? 'Recargo sobre costo' : 'Markup'} {quote.breakdown.markupPercent}% · {es ? 'Válida hasta' : 'Valid until'} {quote.validUntil}</p><p className="quote-help">{quote.notes}</p>
          <p className="quote-workshop-review">{es ? 'Simulación local solamente. No se guarda como solicitud ni se manda por correo.' : 'Local simulation only. It is not saved as a request or sent by email.'}</p>
        </>}
      {error && <p role="alert">{error}</p>}
    </aside></div>
    </details></div>}
  </section>;
}
