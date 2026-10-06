import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Panel } from '../../components/ui/index.js';
import { useAuth } from '../../hooks/useAuth.js';
import { usePreferences } from '../../hooks/usePreferences.js';
import { automationAction, automationError } from '../../services/automationService.js';
import { extractQuoteDraft, getExplicitlyClearedQuoteFields, prepareExplicitQuoteDraft } from '../../utils/quoteConversation.js';
import { AssistantFormattedText } from './AssistantFormattedText.jsx';
import './assistant.css';

const TOPICS = {
  general: ['¿Qué material me conviene?', '¿Cómo hago un pedido?', 'Busco un organizador'],
  quote: ['Quiero cotizar solo el brazo robótico de una banda transportadora para una simulación. Ayudame a definir qué falta.'],
};
const TOPICS_EN = {
  general: ['Which material should I use?', 'How do I place an order?', 'Find a desk organizer'],
  quote: ['I want to quote only the robotic arm on a conveyor belt for a simulation. Help me define what is missing.'],
};
const QUOTE_THREAD_STORAGE_KEY = 'vertice.quote.thread';

function restoreQuoteThread(mode, embedded) {
  if (mode !== 'quote' || !embedded) return [];
  try {
    const stored = JSON.parse(sessionStorage.getItem(QUOTE_THREAD_STORAGE_KEY) || '[]');
    if (!Array.isArray(stored)) return [];
    return stored.filter(turn => (turn?.role === 'user' || turn?.role === 'assistant')
      && typeof turn.content === 'string').slice(-20).map(turn => ({ role: turn.role, content: turn.content.slice(0, 5000) }));
  } catch {
    return [];
  }
}

function createLocalQuoteFallback(explicitDraftIntent, draftContext, clearedFields = []) {
  const formValues = draftContext?.values && typeof draftContext.values === 'object' ? draftContext.values : {};
  const edited = new Set(draftContext?.editedFields || []);
  const incoming = explicitDraftIntent?.draft || {};
  const draft = { ...formValues, ...incoming };
  for (const field of edited) {
    if (incoming[field] === undefined || incoming[field] === null || incoming[field] === '') {
      draft[field] = formValues[field];
    }
  }
  for (const field of clearedFields) draft[field] = '';
  if (typeof draft.description !== 'string' || draft.description.trim().length < 3) return null;
  return draft;
}

export function AssistantPanel({ mode = 'general', open, onClose, triggerRef, id = 'chat-panel', embedded = false, onDraftChange, draftReady = false, draftContext, onReviewDraft }) {
  const auth = useAuth();
  const { language, copy } = usePreferences();
  const es = language === 'es';
  const input = useRef(null);
  const abort = useRef(null);
  const log = useRef(null);
  const [draft, setDraft] = useState('');
  const [thread, setThread] = useState(() => restoreQuoteThread(mode, embedded));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [failedTurn, setFailedTurn] = useState(null);
  const sending = useRef(false);
  useEffect(() => () => abort.current?.abort(), []);
  useEffect(() => {
    if (mode !== 'quote' || !embedded) return;
    try {
      if (thread.length) sessionStorage.setItem(QUOTE_THREAD_STORAGE_KEY, JSON.stringify(thread.slice(-20).map(({ role, content }) => ({ role, content }))));
      else sessionStorage.removeItem(QUOTE_THREAD_STORAGE_KEY);
    } catch {
      // The request summary remains the durable source if tab storage is unavailable.
    }
  }, [embedded, mode, thread]);
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [thread, busy]);
  const allowed = mode === 'general' || mode === 'quote';
  const title = mode === 'quote' ? (es ? 'Asistente de cotización' : 'Quote assistant') : (es ? 'Asistente Vértice' : 'Vértice assistant');

  async function send(text = draft, retry = null) {
    if (sending.current || busy || !text.trim() || !allowed) return;
    sending.current = true;
    const message = text.trim();
    setDraft(''); setError(''); setBusy(true);
    const history = retry?.history || thread.map(item => ({ role: item.role, content: item.content })).slice(-10);
    const conversation = [...thread, { role: 'user', content: message }];
    const capturedDraft = mode === 'quote' ? extractQuoteDraft(conversation) : null;
    if (capturedDraft) onDraftChange?.(capturedDraft, { ready: false, source: 'message-preview' });
    const explicitDraftIntent = mode === 'quote' ? prepareExplicitQuoteDraft(conversation, language) : null;
    const prepareDraft = Boolean(explicitDraftIntent) || (mode === 'quote' && draftReady);
    const clearFields = getExplicitlyClearedQuoteFields(message);
    const recoverDraftLocally = () => {
      if (!prepareDraft) return false;
      const localDraft = createLocalQuoteFallback(explicitDraftIntent, draftContext, clearFields);
      if (!localDraft) return false;
      const notice = language === 'en'
        ? 'Done: I prepared a review draft with your messages and form details. Check every field on the right before sending; nothing was submitted.'
        : 'Listo: armé un borrador con tus mensajes y los datos del formulario. Revisá cada campo a la derecha antes de enviarlo; no se mandó nada.';
      onDraftChange?.(localDraft, { ready: true, source: 'local-fallback', clearFields });
      setThread(current => [...current, { role: 'assistant', content: notice, source: 'LOCAL_DRAFT_FALLBACK' }]);
      setError('');
      setFailedTurn(null);
      return true;
    };
    if (!retry) setThread(current => [...current, { role: 'user', content: message }]);
    abort.current = new AbortController();
    try {
      const result = await automationAction('/assistants/chat', {
        mode, message, history, language,
        ...(prepareDraft ? { prepareDraft: true, draftContext } : {}),
      }, { token: auth?.token, signal: abort.current.signal });
      if (typeof result?.reply !== 'string' || !result.reply.trim()) throw Object.assign(new Error('Invalid assistant response'), { code: 'ASSISTANT_INVALID_RESPONSE' });
      if (mode === 'quote' && explicitDraftIntent && !result.requestDraft) {
        if (!recoverDraftLocally()) {
          setError(language === 'en'
            ? 'The assistant replied but did not return a structured request summary. Retry; nothing has been submitted.'
            : 'La IA respondió, pero no devolvió el resumen estructurado. Reintentá; no se envió nada.');
          setFailedTurn({ message, history });
        }
        return;
      }
      setFailedTurn(null);
      setThread(current => [...current, { role: 'assistant', content: result.reply, links: result.links || [], source: result.source }]);
      if (mode === 'quote' && result.requestDraft) onDraftChange?.(result.requestDraft, {
        ready: true,
        source: 'ai',
        clearFields,
      });
    } catch (failure) {
      if (failure.name !== 'AbortError') {
        if (recoverDraftLocally()) {
          // The customer can review their own data while the AI provider is unavailable.
        } else if (mode === 'quote' && failure.code === 'ASSISTANT_ITERATION_LIMIT' && capturedDraft) {
          setThread(current => [...current, { role: 'assistant', content: language === 'en'
            ? 'n8n could not finish this reply. I kept a local preview of the details you wrote, but the AI has not prepared the request. Retry before sending; nothing was submitted.'
            : 'n8n no pudo completar la respuesta. Conservé una previsualización local de tus datos, pero la IA no preparó la solicitud. Reintentá antes de enviarla; no se mandó nada.' }]);
          setError(automationError(failure.code, language));
          setFailedTurn({ message, history });
        } else {
          setError(automationError(failure.code, language));
          setFailedTurn({ message, history });
        }
      }
    } finally { setBusy(false); sending.current = false; }
  }

  const composerFields = <>
    <label htmlFor={`${id}-message`}>{embedded ? (es ? 'Tu idea o tu siguiente pregunta' : 'Your idea or next question') : copy.message}</label><div><textarea id={`${id}-message`} ref={input} maxLength={2000} rows={embedded ? 3 : 1}
      value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => {
        if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(); }
      }} disabled={busy || !allowed} placeholder={embedded ? (es ? 'Ej.: cotizar solo el brazo robótico de una banda transportadora…' : 'Example: quote only the robotic arm on a conveyor belt…') : copy.messagePlaceholder} />
    <button type={embedded ? 'button' : 'submit'} onClick={embedded ? () => send() : undefined} className="v-button v-button--primary" disabled={busy || !allowed || !draft.trim()} aria-label={copy.send}>↑</button></div>
    <small>{es ? (mode === 'quote' ? 'Enter envía · Shift+Enter agrega una línea · Revisá el resumen antes de enviarlo.' : 'Enter envía · Shift+Enter agrega una línea · El asistente no modifica datos ni envía correos.') : (mode === 'quote' ? 'Enter sends · Shift+Enter adds a line · Review the summary before submitting.' : 'Enter sends · Shift+Enter adds a line · The assistant does not change records or send email.')}</small>
  </>;

  const content = <>
    <div ref={log} className="assistant-thread" role="log" aria-label={es ? 'Conversación' : 'Conversation'} aria-live="polite">
      <div className="assistant-intro"><span>{mode === 'quote' ? 'COTIZACIÓN' : 'TP'}</span>
        <h3>{embedded ? (es ? 'Contame tu idea.' : 'Tell me your idea.') : es ? '¿Qué querés fabricar?' : 'How can I help?'}</h3>
        <p>{embedded ? (es ? 'Contame qué pieza querés —por ejemplo, solo el brazo de una banda— y para qué sirve. Si faltan datos, te pregunto; no necesitás conocer las medidas. Cuando estés listo, prepará el resumen para revisarlo. No se envía ni se cotiza hasta que vos lo confirmés.' : 'Tell me which part you need—for example, only the arm on a conveyor—and what it does. I will ask if details are missing; you do not need exact dimensions. When ready, prepare the summary to review. Nothing is submitted or quoted until you confirm.') : (es ? 'Consulto herramientas del sistema. No cambio pedidos ni envío correos por mi cuenta.' : 'I use system tools. I do not change orders or send emails on my own.')}</p></div>
      {!allowed ? <p><Link to="/login" onClick={onClose}>{es ? 'Iniciá sesión para usar este asistente' : 'Sign in to use this assistant'}</Link></p>
        : !thread.length && <div className="assistant-topics">{(es ? TOPICS : TOPICS_EN)[mode].map(topic => <button key={topic} type="button" onClick={() => send(topic)}>{topic}<span aria-hidden="true">↗</span></button>)}</div>}
      {thread.map((item, index) => <div key={index} className={`assistant-message assistant-message--${item.role}${item.source === 'LOCAL_DRAFT_FALLBACK' ? ' assistant-message--fallback' : ''}`}>
        <span className="assistant-speaker">{item.role === 'user' ? (es ? 'Vos' : 'You') : title}</span>
        {item.role === 'assistant' ? <AssistantFormattedText content={item.content} /> : <p>{item.content}</p>}
        {item.source === 'DEMO_RULES' && <small>{es ? 'Guía local · proveedor IA no conectado' : 'Local guide · AI provider disconnected'}</small>}
        {item.source === 'WORKSHOP_GUIDE' && <small>{es ? 'Guía controlada del taller · sin temperaturas ni precios inferidos' : 'Workshop-controlled guide · no inferred temperatures or prices'}</small>}
        {item.source === 'LOCAL_DRAFT_FALLBACK' && <small>{es ? 'Borrador local de recuperación · revisá los campos antes de enviar' : 'Local recovery draft · review every field before submitting'}</small>}
        {item.links?.map(link => <Link key={link.path} to={link.path} onClick={onClose}>{link.label} ↗</Link>)}
      </div>)}
      {busy && <p role="status">{es ? 'Consultando las herramientas…' : 'Checking tools…'}</p>}
    </div>
    {embedded && mode === 'quote' && draftReady && <button type="button" className="assistant-review-draft" onClick={onReviewDraft}>{es ? 'Revisar el resumen y adjuntar referencias' : 'Review summary and add references'} <span aria-hidden="true">↘</span></button>}
    {embedded && mode === 'quote' && thread.some(item => item.role === 'user') && !draftReady && <button type="button" className="assistant-review-draft" disabled={busy} onClick={() => send(es ? 'Prepará el resumen de la solicitud con lo que te conté para revisarlo.' : 'Prepare the request summary from what I told you so I can review it.')}>{es ? 'Preparar resumen para revisar' : 'Prepare summary to review'} <span aria-hidden="true">↘</span></button>}
    {error && <div className="assistant-error" role="alert"><p>{error}</p>{failedTurn && <button type="button" className="v-button v-button--secondary" disabled={busy} onClick={() => send(failedTurn.message, failedTurn)}>{es ? 'Reintentar esta respuesta' : 'Retry this reply'}</button>}</div>}
    {embedded ? <div className="assistant-composer">{composerFields}</div>
      : <form className="assistant-composer" onSubmit={event => { event.preventDefault(); send(); }}>{composerFields}</form>}
  </>;
  if (embedded) return <section id={id} className="quote-design-chat" aria-label={title}>{content}</section>;
  return <Panel id={id} className={`chat-panel assistant-panel assistant-panel--${mode}`} open={open} onClose={onClose}
    triggerRef={triggerRef} initialFocusRef={input} title={title} closeLabel={copy.close}>{content}</Panel>;
}
