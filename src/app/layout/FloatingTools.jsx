import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, IconButton, Panel, Switch } from '../../components/ui/index.js';
import { usePreferences } from '../../hooks/usePreferences.js';

export function FloatingTools({ active, onActiveChange }) {
  const location = useLocation();
  const preferences = usePreferences();
  const { copy } = preferences;
  const [message, setMessage] = useState('');
  const [chatFeedback, setChatFeedback] = useState(null);
  const [scrolling, setScrolling] = useState(false);
  const [speechStatus, setSpeechStatus] = useState('idle');
  const speechRun = useRef(0);
  const chatTrigger = useRef(null);
  const readingTrigger = useRef(null);
  const messageField = useRef(null);

  useEffect(() => {
    const resetStatus = window.setTimeout(() => setSpeechStatus('idle'), 0);
    return () => {
      window.clearTimeout(resetStatus);
      speechRun.current += 1;
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [location.pathname]);

  const stopPageSpeech = () => {
    speechRun.current += 1;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setSpeechStatus('idle');
  };

  const speakText = text => {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setSpeechStatus('unavailable');
      return;
    }
    const normalizedText = text?.replace(/\s+/g, ' ').trim();
    if (!normalizedText) {
      setSpeechStatus('empty');
      return;
    }

    const run = ++speechRun.current;
    window.speechSynthesis.cancel();
    const utterance = new window.SpeechSynthesisUtterance(normalizedText);
    utterance.lang = preferences.language === 'en' ? 'en-US' : 'es-CR';
    utterance.onend = () => { if (speechRun.current === run) setSpeechStatus('finished'); };
    utterance.onerror = event => {
      if (speechRun.current === run && event.error !== 'canceled' && event.error !== 'interrupted') setSpeechStatus('error');
    };
    setSpeechStatus('speaking');
    window.speechSynthesis.speak(utterance);
  };

  const readPageAloud = () => {
    const main = document.querySelector('#main-content');
    const readablePage = main?.cloneNode(true);
    readablePage?.querySelectorAll('[hidden], [aria-hidden="true"], script, style').forEach(node => node.remove());
    speakText(readablePage?.innerText || readablePage?.textContent || '');
  };

  const readSelectionAloud = () => {
    const selectedText = window.getSelection()?.toString() || '';
    if (!selectedText.trim()) {
      setSpeechStatus('selectionRequired');
      return;
    }
    speakText(selectedText);
  };

  useEffect(() => {
    let timer;
    const onScroll = () => {
      setScrolling(true);
      clearTimeout(timer);
      timer = setTimeout(() => setScrolling(false), 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(timer); };
  }, []);

  return (
    <>
      <div className="floating-tools" role="group" aria-label={copy.tools} data-scrolling={scrolling && !active} data-panel-open={Boolean(active)}>
        <IconButton
          ref={chatTrigger}
          className="chat-trigger"
          variant="floating-button"
          label={copy.openChat}
          aria-expanded={active === 'chat'}
          aria-controls="chat-panel"
          onClick={() => onActiveChange(active === 'chat' ? null : 'chat')}
        >✦</IconButton>
        <IconButton
          ref={readingTrigger}
          variant="floating-button"
          label={copy.openReading}
          aria-expanded={active === 'reading'}
          aria-controls="accessibility-panel"
          onClick={() => onActiveChange(active === 'reading' ? null : 'reading')}
        >♿</IconButton>
      </div>

      <Panel
        id="chat-panel"
        className="chat-panel"
        open={active === 'chat'}
        title={<span className="chat-panel-title"><img src="/favicon-32.png" alt="" /><span><strong>{copy.chat}</strong><small>{copy.chatSubtitle}</small></span></span>}
        closeLabel={copy.close}
        onClose={() => onActiveChange(null)}
        triggerRef={chatTrigger}
        initialFocusRef={messageField}
      >
        <div className="chat-thread">
          <div className="chat-welcome">
            <span className="chat-eyebrow">{copy.chatLabel}</span>
            <h3>{copy.chatIntro}</h3>
            <p>{copy.chatContext}</p>
          </div>

          {!chatFeedback && <div className="chat-demo-note">
            <p>{copy.chatDemo}</p>
            <Link to="/solicitud" onClick={() => onActiveChange(null)}>{copy.quoteFile}<span aria-hidden="true"> ↗</span></Link>
          </div>}

          <div className="chat-suggestions" role="group" aria-label={copy.topics}>
            <span className="chat-suggestions-label">{copy.chatStartWith}</span>
            {['chooseMaterial', 'reviewFiles', 'process'].map(key => (
              <button
                type="button"
                key={key}
                onClick={() => {
                  setMessage(copy[key]);
                  setChatFeedback(null);
                  messageField.current?.focus();
                }}
              >
                {copy[key]}
              </button>
            ))}
          </div>

          {chatFeedback && <p role="status" className="chat-feedback">
            {copy[chatFeedback]}
            {chatFeedback === 'chatUnavailable' && <> <Link to="/solicitud" onClick={() => onActiveChange(null)}>{copy.quoteFile}</Link></>}
          </p>}
        </div>

        <form className="chat-composer" onSubmit={event => {
          event.preventDefault();
          setChatFeedback(message.trim() ? 'chatUnavailable' : 'messageRequired');
        }}>
          <label htmlFor="chat-message">{copy.message}</label>
          <div className="chat-compose">
            <input
              ref={messageField}
              className="v-input"
              id="chat-message"
              value={message}
              placeholder={copy.messagePlaceholder}
              onChange={event => { setMessage(event.target.value); setChatFeedback(null); }}
            />
            <IconButton type="submit" label={copy.send}>↑</IconButton>
          </div>
          <small>{copy.chatInputHint}</small>
        </form>
      </Panel>

      <Panel
        id="accessibility-panel"
        className="accessibility-panel"
        open={active === 'reading'}
        title={copy.readingTitle}
        closeLabel={copy.close}
        onClose={() => onActiveChange(null)}
        triggerRef={readingTrigger}
      >
        <p className="a11y-intro">{copy.readingIntro}</p>

        <div className="a11y-speech" role="group" aria-label={copy.pageSpeech}>
          <Button variant="secondary" onClick={readSelectionAloud}>{copy.readSelection}</Button>
          <Button variant="ghost" onClick={readPageAloud}>{copy.readPage}</Button>
          {speechStatus === 'speaking' && <Button variant="ghost" onClick={stopPageSpeech}>{copy.stopReading}</Button>}
          <p className="a11y-speech-note">{copy.selectionHint}</p>
          <p className="a11y-speech-note">{copy.screenReaderNote}</p>
          <p className="a11y-speech-status" role="status" aria-live="polite">
            {speechStatus === 'speaking' ? copy.readingStarted
              : speechStatus === 'finished' ? copy.readingFinished
                : speechStatus === 'unavailable' ? copy.readingUnavailable
                    : speechStatus === 'empty' ? copy.readingEmpty
                      : speechStatus === 'selectionRequired' ? copy.selectionRequired
                    : speechStatus === 'error' ? copy.readingError : ''}
          </p>
        </div>

        <div className="a11y-size">
          <h3>{copy.textSize}</h3>
          <div className="a11y-control-buttons" role="group" aria-label={copy.textSize}>
            {[[1, 'normal', 'A'], [1.5, 'large', 'A+'], [2, 'xlarge', 'A++']].map(([scale, key, text]) => (
              <button
                type="button"
                key={scale}
                aria-label={copy[key]}
                aria-pressed={preferences.textScale === scale}
                onClick={() => preferences.setTextScale(scale)}
              >
                <span>{text}</span>
                <small>{scale * 100}%</small>
              </button>
            ))}
          </div>
        </div>

        <div className="a11y-toggles">
          <div className="a11y-control">
            <span>{copy.contrast}<small id="contrast-help">{copy.contrastHint}</small></span>
            <Switch label={copy.contrast} aria-describedby="contrast-help" checked={preferences.contrast} onChange={preferences.setContrast} />
          </div>
          <div className="a11y-control">
            <span>{copy.motion}<small id="motion-help">{copy.motionHint}</small></span>
            <Switch label={copy.motion} aria-describedby="motion-help" checked={preferences.reducedMotion} onChange={preferences.setReducedMotion} />
          </div>
        </div>

        <Button className="a11y-reset" variant="ghost" fullWidth onClick={preferences.resetReading}>
          {copy.reset}
        </Button>
      </Panel>
    </>
  );
}
