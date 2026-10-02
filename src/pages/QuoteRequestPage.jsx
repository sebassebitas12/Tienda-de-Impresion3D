import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { usePreferences } from '../hooks/usePreferences.js';
import { automationAction, automationError } from '../services/automationService.js';
import { FDM_MATERIALS } from '../utils/quotePricing.js';
import { formatCRC } from '../utils/money.js';
import { AssistantPanel } from '../features/chatbot/AssistantPanel.jsx';
import './quotes.css';

export function QuoteRequestPage() {
  const auth = useAuth();
  const { language } = usePreferences();
  const es = language === 'es';
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState({ profileId: 'organizador', material: 'PLA', quantity: 1, sizeScale: 1, needsDesign: false, description: '' });
  const [quote, setQuote] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [assistant, setAssistant] = useState(false);
  const trigger = useRef(null);
  const key = useRef(crypto.randomUUID());
  useEffect(() => {
    const abort = new AbortController();
    automationAction('/quotes/profiles', {}, { signal: abort.signal }).then(data => setProfiles(data.profiles)).catch(failure => {
      if (failure.name !== 'AbortError') setError(es ? 'No pudimos cargar las referencias. Revisá la conexión.' : 'Could not load reference models. Check your connection.');
    });
    return () => abort.abort();
  }, [es]);
  const profile = profiles.find(item => item.id === form.profileId);
  const update = (name, value) => { setForm(current => ({ ...current, [name]: value })); setQuote(null); setResult(null); setError(''); key.current = crypto.randomUUID(); };
  async function calculate(event) {
    event.preventDefault(); setBusy(true); setError('');
    try { const data = await automationAction('/quotes/preview', form); setQuote(data.quote); }
    catch (failure) { setError(automationError(failure.code)); }
    finally { setBusy(false); }
  }
  async function save(sendEmail) {
    setBusy(true); setError('');
    try {
      const data = await automationAction('/quotes/create', { ...form, idempotencyKey: key.current, sendEmail }, { token: auth?.token });
      setResult(data);
      if (data.email?.code) setError(automationError(data.email.code));
    } catch (failure) { setError(automationError(failure.code)); }
    finally { setBusy(false); }
  }
  return <section className="quote-page" aria-labelledby="quote-title" aria-busy={busy}>
    <header><span className="quote-eyebrow">{es ? 'Tu próximo proyecto' : 'Your next project'}</span><h1 id="quote-title">{es ? 'Cotizá, sin vueltas.' : 'Get a quote, simply.'}</h1>
      <p>{es ? 'Elegí una referencia y obtené un cálculo automático con su desglose. Por ahora trabajamos con perfiles y costos simulados.' : 'Choose a reference for an automatic, itemized calculation. Profiles and workshop costs are currently simulated.'}</p></header>
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
      <p className="quote-help">{es ? 'No admite aplicaciones médicas, alimentarias o críticas. La simulación no autoriza fabricación ni pagos reales.' : 'Medical, food-contact and safety-critical uses are excluded. Simulation does not authorize production or real payments.'}</p>
      <button className="v-button v-button--primary" type="submit" disabled={busy || !profiles.length}>{busy ? (es ? 'Procesando…' : 'Processing…') : (es ? 'Calcular cotización DEMO' : 'Calculate DEMO quote')}</button>
    </form><aside className="quote-result" aria-live="polite"><span className="quote-eyebrow">{es ? '2. Tu cálculo' : '2. Your calculation'}</span>
      {!quote ? <><h2>{es ? 'Todo a la vista.' : 'All costs, visible.'}</h2><p>{es ? 'Material, desgaste, energía, trabajo y diseño. Nada de montos inventados por un chatbot: el motor aplica una fórmula reproducible.' : 'Material, wear, energy, labor and design. A reproducible formula calculates the amount, not a chatbot.'}</p></>
        : <><h2>{formatCRC(quote.breakdown.amountCrc)}</h2><span className="quote-demo">DEMO · {es ? 'simulación' : 'simulation'}</span><dl>{[['Material', 'materialCrc'], [es ? 'Desgaste' : 'Wear', 'wearCrc'], [es ? 'Electricidad' : 'Electricity', 'electricityCrc'], [es ? 'Postprocesado' : 'Post-processing', 'postProcessCrc'], [es ? 'Diseño' : 'Design', 'designCrc']].map(([label, field]) => <div key={field}><dt>{label}</dt><dd>{formatCRC(quote.breakdown[field])}</dd></div>)}</dl>
          <p>{es ? 'Recargo sobre costo' : 'Markup'} {quote.breakdown.markupPercent}% · {es ? 'Válida hasta' : 'Valid until'} {quote.validUntil}</p><p className="quote-help">{quote.notes}</p>
          {result ? <div role="status"><strong>{es ? 'Cotización guardada' : 'Quote saved'} · {result.request.id}</strong><p>{result.email?.delivered ? (es ? 'Correo aceptado por Gmail, con copia al taller.' : 'Gmail accepted your email, with a workshop copy.') : (es ? 'Disponible en tu cuenta. No se confirmó ningún correo.' : 'Available in your account. No email delivery confirmed.')}</p><Link to="/cuenta">{es ? 'Ver y aprobar mi cotización' : 'View and approve my quote'} ↗</Link></div>
            : auth?.user?.role === 'customer' ? <div className="quote-buttons"><button type="button" className="v-button v-button--primary" disabled={busy} onClick={() => save(true)}>{es ? 'Guardar y enviar por correo' : 'Save and email'}</button><button type="button" className="v-button v-button--ghost" disabled={busy} onClick={() => save(false)}>{es ? 'Solo guardar en mi cuenta' : 'Save to my account only'}</button></div>
              : <Link className="v-button v-button--secondary" to={auth?.user?.role === 'admin' ? '/admin/solicitudes' : '/login'}>{es ? (auth?.user ? 'Cotizar desde Admin' : 'Iniciar sesión para guardar') : 'Sign in to save'}</Link>}
        </>}
      {error && <p role="alert">{error}</p>}
      <button type="button" ref={trigger} className="quote-assistant-link" aria-expanded={assistant} aria-controls="quote-assistant" onClick={() => setAssistant(value => !value)}>{es ? '¿Necesitás orientación? Asistente de cotización' : 'Need help? Quote assistant'} ✦</button>
    </aside></div>
    <AssistantPanel key={auth?.user?.id || 'guest'} mode="quote" id="quote-assistant" open={assistant} onClose={() => setAssistant(false)} triggerRef={trigger} />
  </section>;
}
