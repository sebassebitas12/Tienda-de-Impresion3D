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
  const [confirming, setConfirming] = useState(false);
  const es = language === 'es';
  useEffect(() => {
    const controller = new AbortController();
    automationAction('/quotes/profiles', {}, { signal: controller.signal }).then(result => setProfiles(result.profiles))
      .catch(error => { if (error.name !== 'AbortError') setState({ busy: false, error: 'No pudimos cargar las referencias.' }); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);
  async function saveEstimate() {
    if (state.busy) return;
    setConfirming(false);
    setState({ busy: true, error: '' });
    try {
      await automationAction('/admin/actions/auto-quote', { requestId: request.id, expectedStatus: request.status,
        expectedVersion: request.quoteVersion || 0, ...(profileId ? { profileId } : {}) }, { token: auth?.token });
      setState({ busy: false, error: '' });
      onSaved();
    } catch (error) { setState({ busy: false, error: automationError(error.code) }); }
  }
  const quote = request.quotePricing;
  return <section className="admin-auto-quote" aria-labelledby="auto-quote-title">
    <header><div><span className="admin-eyebrow">{es ? 'CÁLCULO AUTOMATIZADO · PERFIL ANÁLOGO' : 'AUTOMATED ESTIMATE · ANALOG PROFILE'}</span><h2 id="auto-quote-title">{es ? 'Prepará una estimación para revisar.' : 'Prepare an estimate to review.'}</h2></div>
      {quote?.mode === 'DEMO' && <strong>{formatCRC(request.quotedPrice)}</strong>}</header>
    <p>{es ? 'Peso, tiempo y costos se aproximan desde una pieza de referencia; no son mediciones del archivo ni tarifas verificadas del taller. Revisá alcance y supuestos antes de enviar.' : 'Weight, time and costs are approximated from a reference part; they are not file measurements or verified workshop rates. Review scope and assumptions before sending.'}</p>
    <ReferencePicker profiles={profiles} value={profileId} onChange={setProfileId} disabled={state.busy} loading={loading} language={language} allowAutomatic />
    <div className="admin-auto-quote__controls"><button type="button" className="v-button v-button--primary" disabled={state.busy || loading} onClick={() => { setState(current => ({ ...current, error: '' })); setConfirming(true); }}>{state.busy ? (es ? 'Guardando…' : 'Saving…') : (es ? 'Calcular cotización' : 'Calculate quote')}</button></div>
    {confirming && <div className="admin-quote-send__summary" role="group" aria-label={es ? 'Confirmar cálculo automatizado' : 'Confirm automated estimate'}>
      <p>{es ? 'Se guardará una estimación y la solicitud quedará lista para revisar y enviar. No se enviará ningún correo todavía. ¿Continuar?' : 'An estimate will be saved and the request will be ready for review and email. No email will be sent yet. Continue?'}</p>
      <div className="admin-next-action__buttons"><button type="button" className="v-button v-button--ghost" onClick={() => setConfirming(false)}>{es ? 'Cancelar' : 'Cancel'}</button><button type="button" className="v-button v-button--primary" onClick={saveEstimate}>{es ? 'Guardar estimación' : 'Save estimate'}</button></div>
    </div>}
    {quote?.mode === 'DEMO' && <p>{quote.inputs.weightGrams} g · {quote.inputs.printHours} h / {es ? 'pieza' : 'piece'} · {quote.inputs.material} · {es ? 'Vigencia hasta' : 'Valid until'} {request.quoteValidUntil?.slice(0, 10)}<br />{es ? 'Tasa de cambio' : 'Exchange rate'}: {quote.provenance.exchange} · {es ? 'Tarifa eléctrica' : 'Electric tariff'}: {quote.provenance.electricity}</p>}
    {state.error && <p role="alert">{state.error}</p>}
  </section>;
}
