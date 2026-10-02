import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { automationAction, automationError } from '../../services/automationService.js';
import { formatCRC } from '../../utils/money.js';
import { ReferencePicker } from '../customRequests/ReferencePicker.jsx';
import '../../pages/quotes.css';

export function AutomaticQuote({ request, onSaved, language }) {
  const auth = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [profileId, setProfileId] = useState(request.profileId || request.quotePricing?.profileId || '');
  const [state, setState] = useState({ busy: false, error: '' });
  const [loading, setLoading] = useState(true);
  const es = language === 'es';
  useEffect(() => {
    const controller = new AbortController();
    automationAction('/quotes/profiles', {}, { signal: controller.signal }).then(result => setProfiles(result.profiles))
      .catch(error => { if (error.name !== 'AbortError') setState({ busy: false, error: 'No pudimos cargar las referencias.' }); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
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
    <p>{es ? 'Elegí una referencia para generar una estimación DEMO con peso, tiempo y costos simulados. Revisá el desglose antes de enviarlo al cliente.' : 'Choose a reference for a DEMO estimate with simulated weight, time and costs. Review the breakdown before sending it to the customer.'}</p>
    <ReferencePicker profiles={profiles} value={profileId} onChange={setProfileId} disabled={state.busy} loading={loading} language={language} allowAutomatic />
    <div className="admin-auto-quote__controls"><button type="button" className="v-button v-button--primary" disabled={state.busy || loading} onClick={calculate}>{state.busy ? (es ? 'Calculando…' : 'Calculating…') : (es ? 'Calcular y guardar DEMO' : 'Calculate and save DEMO')}</button></div>
    {quote?.mode === 'DEMO' && <p>{quote.inputs.weightGrams} g · {quote.inputs.printHours} h / {es ? 'pieza' : 'piece'} · {quote.inputs.material} · {es ? 'Vence' : 'Expires'} {request.quoteValidUntil?.slice(0, 10)}<br />{es ? 'Cambio' : 'Exchange'}: {quote.provenance.exchange} · {es ? 'Electricidad' : 'Electricity'}: {quote.provenance.electricity}</p>}
    {state.error && <p role="alert">{state.error}</p>}
  </section>;
}
