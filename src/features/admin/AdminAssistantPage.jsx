import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { usePreferences } from '../../hooks/usePreferences.js';
import { automationAction, automationError } from '../../services/automationService.js';
import { AssistantFormattedText } from '../chatbot/AssistantFormattedText.jsx';
import './admin.css';
import './admin-assistant.css';

const prompts = {
  es: [
    { label: 'Prioridades', detail: 'Solicitudes y pedidos que requieren atención', message: '¿Qué necesita atención hoy? Resume solicitudes y pedidos por separado.' },
    { label: 'Preparar cotización', detail: 'Guía por el flujo, sin cambiar registros', message: 'Quiero preparar una cotización. Guíame por los pasos de Admin sin cambiar ningún dato.' },
    { label: 'Calidad del catálogo', detail: 'Fichas incompletas o por revisar', message: 'Revisa la calidad del catálogo y dime qué fichas están incompletas.' },
  ],
  en: [
    { label: 'Priorities', detail: 'Requests and orders that need attention', message: 'What needs attention today? Summarize requests and orders separately.' },
    { label: 'Prepare a quote', detail: 'Walk through the flow without changing records', message: 'I want to prepare a quote. Guide me through Admin without changing any data.' },
    { label: 'Catalog quality', detail: 'Incomplete or review-needed records', message: 'Review catalog quality and tell me which records are incomplete.' },
  ],
};

export function AdminAssistantPage() {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = usePreferences();
  const es = language !== 'en';
  const input = useRef(null);
  const log = useRef(null);
  const abort = useRef(null);
  const [message, setMessage] = useState('');
  const [thread, setThread] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sessionRejected, setSessionRejected] = useState(false);

  useEffect(() => () => abort.current?.abort(), []);
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [thread, busy]);

  async function send(value = message) {
    const text = value.trim();
    if (!text || busy) return;
    setMessage(''); setError(''); setSessionRejected(false); setBusy(true);
    const history = thread.map(turn => ({ role: turn.role, content: turn.content })).slice(-10);
    setThread(current => [...current, { role: 'user', content: text }]);
    abort.current = new AbortController();
    try {
      const result = await automationAction('/assistants/chat', { mode: 'admin', message: text, history, language }, { token: auth?.token, signal: abort.current.signal });
      setThread(current => [...current, { role: 'assistant', content: result.reply, links: result.links || [] }]);
    } catch (failure) {
      if (failure.name !== 'AbortError') {
        if (failure.code === 'ROLE_REQUIRED') {
          setSessionRejected(true);
          setError(automationError(failure.code, language));
        } else setError(automationError(failure.code, language));
      }
    } finally { setBusy(false); }
  }

  async function reauthenticate() {
    try {
      await auth.logout();
      navigate('/login', { replace: true, state: { from: location.pathname, reason: 'admin-session-rejected' } });
    } catch {
      setError(es ? 'No pudimos cerrar la sesión local. Volvé a intentarlo desde el menú de Administración.' : 'Could not clear the local session. Try again from the Admin menu.');
    }
  }

  const topics = prompts[es ? 'es' : 'en'];
  return <section className="admin-copilot" aria-labelledby="admin-copilot-title">
    <header className="admin-copilot__header">
      <div><span className="admin-eyebrow">ADMINISTRACIÓN / ASISTENCIA OPERATIVA</span>
        <h1 id="admin-copilot-title">{es ? 'Copiloto del taller' : 'Workshop copilot'}</h1>
        <p>{es ? 'Consulta el estado del taller y recibe orientación para navegar Admin. No modifica registros ni aprueba cotizaciones.' : 'Review workshop status and get help navigating Admin. It cannot edit records or approve quotes.'}</p>
      </div>
      <Link className="admin-copilot__return" to="/admin">{es ? 'Volver al resumen' : 'Back to overview'} <span aria-hidden="true">↗</span></Link>
    </header>

    <div className="admin-copilot__console">
      <section className="admin-copilot__conversation" aria-label={es ? 'Conversación con el copiloto Admin' : 'Admin copilot conversation'}>
        <div className="admin-copilot__conversation-head"><span><i aria-hidden="true" /> {es ? 'COPILOTO ADMIN · CONSULTA PROTEGIDA' : 'ADMIN COPILOT · PROTECTED QUERY'}</span><small>{es ? 'SOLO LECTURA' : 'READ ONLY'}</small></div>
        <div ref={log} className="admin-copilot__thread" role="log" aria-live="polite" aria-label={es ? 'Conversación' : 'Conversation'}>
          {!thread.length && <div className="admin-copilot__welcome">
            <span className="admin-copilot__index">VÉRTICE / ADMIN</span>
            <h2>{es ? '¿Qué necesitas resolver?' : 'What do you need to work through?'}</h2>
            <p>{es ? 'Consulta el estado del taller o elegí un punto de partida. Las acciones siguen bajo tu control.' : 'Check workshop status or choose a starting point. Actions stay under your control.'}</p>
            <div className="admin-copilot__prompts" role="region" aria-label={es ? 'Consultas sugeridas' : 'Suggested queries'}>
              {topics.map(topic => <button key={topic.label} type="button" onClick={() => send(topic.message)} disabled={busy}>
                <span className="admin-copilot__prompt-copy"><strong>{topic.label}</strong><small>{topic.detail}</small></span><b aria-hidden="true">↗</b>
              </button>)}
            </div>
          </div>}
          {thread.map((turn, index) => <article key={`${turn.role}-${index}`} className={`admin-copilot__turn admin-copilot__turn--${turn.role}`}>
            <span>{turn.role === 'user' ? (es ? 'VOS' : 'YOU') : (es ? 'COPILOTO ADMIN' : 'ADMIN COPILOT')}</span>
            {turn.role === 'assistant' ? <AssistantFormattedText content={turn.content} /> : <p>{turn.content}</p>}
            {(turn.links || []).map(link => <Link key={`${link.path}-${link.label}`} to={link.path}>{link.label} ↗</Link>)}
          </article>)}
          {busy && <p className="admin-copilot__status" role="status">{es ? 'Consultando información del taller…' : 'Checking workshop information…'}</p>}
        </div>
        {error && <div className="admin-copilot__error" role="alert"><p>{error}</p>{sessionRejected && <button type="button" className="admin-action-secondary" onClick={reauthenticate}>{es ? 'Cerrar sesión y volver a iniciar sesión' : 'Sign out and sign in again'}</button>}</div>}
        <form className="admin-copilot__composer" onSubmit={event => { event.preventDefault(); send(); }}>
          <label htmlFor="admin-copilot-input">{es ? 'Pregunta sobre el taller' : 'Ask about the workshop'}</label>
          <div><textarea id="admin-copilot-input" ref={input} rows="2" maxLength="2000" value={message} onChange={event => setMessage(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(); } }} disabled={busy} placeholder={es ? 'Ej.: ¿Qué solicitudes esperan una cotización?' : 'e.g. Which requests are waiting for a quote?'} />
            <button className="admin-action-primary" type="submit" disabled={busy || !message.trim()}>{busy ? '…' : (es ? 'Consultar' : 'Ask')} <span aria-hidden="true">↗</span></button></div>
          <small>{es ? 'Enter envía · Shift+Enter agrega una línea · No se realizan cambios desde el chat.' : 'Enter sends · Shift+Enter adds a line · The chat makes no changes.'}</small>
        </form>
      </section>
    </div>
    <p className="admin-copilot__scope"><span>{es ? 'ALCANCE' : 'SCOPE'}</span>{es ? 'Consulta pedidos y solicitudes, revisa calidad del catálogo y explica dónde continuar. No cambia estados, aprueba cotizaciones ni envía correos.' : 'Look up orders and requests, review catalog quality, and explain where to continue. It cannot change statuses, approve quotes, or send email.'}</p>
  </section>;
}
