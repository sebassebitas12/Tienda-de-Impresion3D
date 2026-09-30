import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, IconButton, Panel, Switch } from '../../components/ui/index.js';
import { usePreferences } from '../../hooks/usePreferences.js';

const ArrowUpRight = () => (
  <svg className="chat-row-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.35" aria-hidden="true">
    <path d="M4 12 12 4M6 4h6v6" />
  </svg>
);

export function FloatingTools({ active, onActiveChange }) {
  const preferences = usePreferences();
  const { copy } = preferences;
  const [message, setMessage] = useState('');
  const [chatFeedback, setChatFeedback] = useState(null);
  const [scrolling, setScrolling] = useState(false);
  const chatTrigger = useRef(null);
  const readingTrigger = useRef(null);
  const messageField = useRef(null);

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
      <div className="floating-tools" aria-label={copy.tools} data-scrolling={scrolling && !active} data-panel-open={Boolean(active)}>
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
        title={<span className="chat-panel-title"><img src="/favicon-32.png" alt="" />{copy.chat}</span>}
        closeLabel={copy.close}
        onClose={() => onActiveChange(null)}
        triggerRef={chatTrigger}
        initialFocusRef={messageField}
      >
        <div className="chat-thread">
          <div className="chat-message">
            <span className="chat-message-mark" aria-hidden="true"><img src="/favicon-32.png" alt="" /></span>
            <div className="chat-bubble">
              <p className="chat-intro">{copy.chatIntro}</p>
              <p>{copy.chatContext}</p>
            </div>
          </div>

          <div className="chat-suggestions" role="group" aria-label={copy.topics}>
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
                <span>{copy[key]}</span><ArrowUpRight />
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
          <small>{copy.advisory}</small>
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

        <div className="a11y-size">
          <h3>{copy.textSize}</h3>
          <div className="a11y-control-buttons" role="group" aria-label={copy.textSize}>
            {[[1, 'normal', 'A'], [1.125, 'large', 'A+'], [1.25, 'xlarge', 'A++']].map(([scale, key, text]) => (
              <button
                type="button"
                key={scale}
                aria-label={copy[key]}
                aria-pressed={preferences.textScale === scale}
                onClick={() => preferences.setTextScale(scale)}
              >{text}</button>
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
