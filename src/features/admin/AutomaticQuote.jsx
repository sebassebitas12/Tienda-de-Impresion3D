import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { automationAction, automationError } from '../../services/automationService.js';
import { formatCRC } from '../../utils/money.js';
import '../../pages/quotes.css';

export function AutomaticQuote({ request, onSaved, language }) {
  const auth = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [profileId, setProfileId] = useState(request.profileId || request.quotePricing?.profileId || '');
  const [state, setState] = useState({ busy: false, error: '' });
  const es = language === 'es';
  useEffect(() => {
    const controller = new AbortController();
    automationAction('/quotes/profiles', {}, { signal: controller.signal }).then(result => setProfiles(result.profiles))
      .catch(() => { /* The calculation endpoint reports connection failures on action. */ });
    return () => controller.abort();
  }, []);
  async function calculate() {
    setState({ busy: true, error: '' });
    try {
      await automationAction('/admin/actions/auto-quote', { requestId: request.id, expectedStatus: request.status,
        expectedVersion: request.quoteVersion || 0, ...(profileId ? { profileId } : {}) }, { token: auth?.token });
      onSaved();
    } catch (error) { setState({ busy: false, error: automationError(error.code) }); }
  }
  const quote = request.quotePricing;
  return <section className="admin-auto-quote" aria-labelledby="auto-quote-title">
    <header><div><span className="admin-eyebrow">{es ? 'Automatización · DEMO' : 'Automation · DEMO'}</span><h2 id="auto-quote-title">{es ? 'Una referencia. Un cálculo completo.' : 'One reference. A complete calculation.'}</h2></div>
      {quote?.mode === 'DEMO' && <strong>{formatCRC(request.quotedPrice)}</strong>}</header>
    <p>{es ? 'Peso, tiempo y costos simulados según un modelo análogo. Se guardan desglose, tarifas y vigencia; no se inventa un laminado real.' : 'Weight, time and costs simulated from an analogue. Breakdown, rates and expiry are saved; this is not a real slice.'}</p>
    <div className="admin-auto-quote__controls"><label>{es ? 'Pieza de referencia (opcional si la descripción coincide)' : 'Reference model (optional when description matches)'}
      <select value={profileId} onChange={event => setProfileId(event.target.value)} disabled={state.busy}><option value="">{es ? 'Detectar por descripción' : 'Match description'}</option>{profiles.map(profile => <option value={profile.id} key={profile.id}>{profile.name}</option>)}</select></label>
      <button type="button" className="v-button v-button--primary" disabled={state.busy} onClick={calculate}>{state.busy ? (es ? 'Calculando…' : 'Calculating…') : (es ? 'Calcular y guardar DEMO' : 'Calculate and save DEMO')}</button></div>
    {quote?.mode === 'DEMO' && <p>{quote.inputs.weightGrams} g · {quote.inputs.printHours} h / {es ? 'pieza' : 'piece'} · {quote.inputs.material} · {es ? 'Vence' : 'Expires'} {request.quoteValidUntil?.slice(0, 10)}<br />{es ? 'Cambio' : 'Exchange'}: {quote.provenance.exchange} · {es ? 'Electricidad' : 'Electricity'}: {quote.provenance.electricity}</p>}
    {state.error && <p role="alert">{state.error}</p>}
  </section>;
}
