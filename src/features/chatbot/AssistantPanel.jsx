import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Panel } from '../../components/ui/index.js';
import { useAuth } from '../../hooks/useAuth.js';
import { usePreferences } from '../../hooks/usePreferences.js';
import { automationAction, automationError } from '../../services/automationService.js';
import './assistant.css';

const TOPICS = {
  general: ['¿Qué material me conviene?', '¿Cómo hago un pedido?', 'Busco un organizador'],
  admin: ['¿Qué necesita atención hoy?', '¿Cómo envío una cotización?', 'Revisá la calidad del catálogo'],
  quote: ['¿Qué datos necesitás?', 'Mostrame las piezas de referencia', 'Estimá un organizador en PETG, cantidad 2'],
};
const TOPICS_EN = {
  general: ['Which material should I use?', 'How do I place an order?', 'Find a desk organizer'],
  admin: ['What needs attention today?', 'How do I send a quote?', 'Check catalog quality'],
  quote: ['What information do you need?', 'Show reference models', 'Estimate two PETG organizers'],
};

export function AssistantPanel({ mode = 'general', open, onClose, triggerRef, id = 'chat-panel' }) {
  const auth = useAuth();
  const { language, copy } = usePreferences();
  const es = language === 'es';
  const input = useRef(null);
  const abort = useRef(null);
  const log = useRef(null);
  const [draft, setDraft] = useState('');
  const [thread, setThread] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => () => abort.current?.abort(), []);
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [thread, busy]);
  const allowed = mode === 'general' || (mode === 'admin' ? auth?.user?.role === 'admin' : Boolean(auth?.user));
  const title = mode === 'admin' ? (es ? 'Copiloto del taller' : 'Workshop copilot')
    : mode === 'quote' ? (es ? 'Asistente de cotización' : 'Quote assistant') : (es ? 'Asistente Vértice' : 'Vértice assistant');

  async function send(text = draft) {
    if (busy || !text.trim() || !allowed) return;
    const message = text.trim();
    setDraft(''); setError(''); setBusy(true);
    const history = thread.map(item => ({ role: item.role, content: item.content })).slice(-10);
    setThread(current => [...current, { role: 'user', content: message }]);
    abort.current = new AbortController();
    try {
      const result = await automationAction('/assistants/chat', { mode, message, history, language }, { token: auth?.token, signal: abort.current.signal });
      setThread(current => [...current, { role: 'assistant', content: result.reply, links: result.links || [], source: result.source }]);
    } catch (failure) {
      if (failure.name !== 'AbortError') setError(es ? automationError(failure.code) : 'Could not answer. Check your connection and try again.');
    } finally { setBusy(false); }
  }

  return <Panel id={id} className={`chat-panel assistant-panel assistant-panel--${mode}`} open={open} onClose={onClose}
    triggerRef={triggerRef} initialFocusRef={input} title={title} closeLabel={copy.close}>
    <div ref={log} className="assistant-thread" role="log" aria-label={es ? 'Conversación' : 'Conversation'} aria-live="polite">
      <div className="assistant-intro"><span>{mode === 'admin' ? 'ADMIN' : mode === 'quote' ? 'COTIZACIÓN' : 'TP'}</span>
        <h3>{es ? (mode === 'admin' ? 'Un taller, sin perderte entre pantallas.' : mode === 'quote' ? 'De tu idea a un cálculo claro.' : '¿Qué querés fabricar?') : 'How can I help?'}</h3>
        <p>{es ? 'Consulto herramientas del sistema. No cambio pedidos ni envío correos por mi cuenta.' : 'I use system tools. I do not change orders or send emails on my own.'}</p></div>
      {!allowed ? <p><Link to="/login" onClick={onClose}>{es ? 'Iniciá sesión para usar este asistente' : 'Sign in to use this assistant'}</Link></p>
        : !thread.length && <div className="assistant-topics">{(es ? TOPICS : TOPICS_EN)[mode].map(topic => <button key={topic} type="button" onClick={() => send(topic)}>{topic}<span aria-hidden="true">↗</span></button>)}</div>}
      {thread.map((item, index) => <div key={index} className={`assistant-message assistant-message--${item.role}`}>
        <span className="assistant-speaker">{item.role === 'user' ? (es ? 'Vos' : 'You') : title}</span><p>{item.content}</p>
        {item.source === 'DEMO_RULES' && <small>{es ? 'Guía local · proveedor IA no conectado' : 'Local guide · AI provider disconnected'}</small>}
        {item.links?.map(link => <Link key={link.path} to={link.path} onClick={onClose}>{link.label} ↗</Link>)}
      </div>)}
      {busy && <p role="status">{es ? 'Consultando las herramientas…' : 'Checking tools…'}</p>}
    </div>
    {error && <p className="assistant-error" role="alert">{error}</p>}
    <form className="assistant-composer" onSubmit={event => { event.preventDefault(); send(); }}>
      <label htmlFor={`${id}-message`}>{copy.message}</label><div><input id={`${id}-message`} ref={input} maxLength={2000}
        value={draft} onChange={event => setDraft(event.target.value)} disabled={busy || !allowed} placeholder={copy.messagePlaceholder} />
      <button type="submit" className="v-button v-button--primary" disabled={busy || !allowed || !draft.trim()} aria-label={copy.send}>↑</button></div>
      <small>{es ? 'Los cálculos DEMO son simulaciones, no mediciones del archivo.' : 'DEMO calculations are simulations, not file measurements.'}</small>
    </form>
  </Panel>;
}
