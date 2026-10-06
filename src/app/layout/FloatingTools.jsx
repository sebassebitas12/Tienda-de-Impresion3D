import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AssistantPanel } from '../../features/chatbot/AssistantPanel.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { Button, IconButton, Panel, Switch } from '../../components/ui/index.js';
import { usePreferences } from '../../hooks/usePreferences.js';

export function FloatingTools({ active, onActiveChange }) {
  const auth = useAuth();
  const location = useLocation();
  const preferences = usePreferences();
  const { copy } = preferences;
  const hasEmbeddedQuoteAssistant = location.pathname === '/solicitud/ayuda-diseno';
  const [scrolling, setScrolling] = useState(false);
  const [speechStatus, setSpeechStatus] = useState('idle');
  const speechRun = useRef(0);
  const chatTrigger = useRef(null);
  const readingTrigger = useRef(null);
  const activeHoverTarget = useRef(null);
  const hoverDebounceTimer = useRef(null);
  const { readOnHover, setReadOnHover } = preferences;

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
    if (activeHoverTarget.current) {
      activeHoverTarget.current.classList.remove('a11y-reading-highlight');
      activeHoverTarget.current = null;
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setSpeechStatus('idle');
  };

  const speakText = useCallback(text => {
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
  }, [preferences.language]);

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
    if (!readOnHover) {
      if (activeHoverTarget.current) {
        activeHoverTarget.current.classList.remove('a11y-reading-highlight');
        activeHoverTarget.current = null;
      }
      return;
    }

    const clearHighlight = () => {
      if (activeHoverTarget.current) {
        activeHoverTarget.current.classList.remove('a11y-reading-highlight');
        activeHoverTarget.current = null;
      }
    };

    const getReadableTarget = element => {
      if (!element || element.nodeType !== 1) return null;
      if (element.closest('.floating-tools, #accessibility-panel, #chat-panel')) return null;

      const semantic = element.closest('button, a, input, select, textarea, label, [role="button"], [role="link"], [role="tab"], [role="switch"], h1, h2, h3, h4, h5, h6, p, li, blockquote, dt, dd, th, td');
      if (semantic) {
        if (semantic.closest('.floating-tools, #accessibility-panel, #chat-panel')) return null;
        return semantic;
      }

      if (element.children.length === 0 && element.textContent?.trim()) {
        return element;
      }
      return null;
    };

    const processElementSpeech = target => {
      const readable = getReadableTarget(target);
      if (!readable) return;
      if (readable === activeHoverTarget.current) return;

      window.clearTimeout(hoverDebounceTimer.current);
      hoverDebounceTimer.current = window.setTimeout(() => {
        clearHighlight();

        const ariaLabel = readable.getAttribute('aria-label');
        const alt = readable.getAttribute('alt');
        const title = readable.getAttribute('title');
        const placeholder = readable.getAttribute('placeholder');
        let text = ariaLabel || alt || title || placeholder || readable.innerText || readable.textContent || '';
        text = text.replace(/\s+/g, ' ').trim();

        if (!text || text.length < 2) return;
        if (text.length > 280) text = text.slice(0, 280) + '...';

        readable.classList.add('a11y-reading-highlight');
        activeHoverTarget.current = readable;
        speakText(text);
      }, 130);
    };

    const onPointerOver = e => {
      processElementSpeech(e.target);
    };

    const onFocusIn = e => {
      processElementSpeech(e.target);
    };

    const onPointerOut = e => {
      if (activeHoverTarget.current && !activeHoverTarget.current.contains(e.relatedTarget)) {
        window.clearTimeout(hoverDebounceTimer.current);
        clearHighlight();
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      }
    };

    document.addEventListener('pointerover', onPointerOver, { passive: true });
    document.addEventListener('focusin', onFocusIn, { passive: true });
    document.addEventListener('pointerout', onPointerOut, { passive: true });

    return () => {
      window.clearTimeout(hoverDebounceTimer.current);
      clearHighlight();
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('pointerout', onPointerOut);
    };
  }, [readOnHover, speakText]);

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
        {!hasEmbeddedQuoteAssistant && <IconButton
          ref={chatTrigger}
          className="chat-trigger"
          variant="floating-button"
          label={copy.openChat}
          aria-expanded={active === 'chat'}
          aria-controls="chat-panel"
          onClick={() => onActiveChange(active === 'chat' ? null : 'chat')}
        >✦</IconButton>}
        <IconButton
          ref={readingTrigger}
          variant="floating-button"
          label={copy.openReading}
          aria-expanded={active === 'reading'}
          aria-controls="accessibility-panel"
          onClick={() => onActiveChange(active === 'reading' ? null : 'reading')}
        >♿</IconButton>
      </div>

      <AssistantPanel key={auth?.user?.id || 'guest'} mode="general" open={active === 'chat' && !hasEmbeddedQuoteAssistant} onClose={() => onActiveChange(null)} triggerRef={chatTrigger} />

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
          <div className="a11y-control a11y-control--speech">
            <span>
              {copy.readOnHover}
              <small id="hover-read-help">{copy.readOnHoverHint}</small>
            </span>
            <Switch
              label={copy.readOnHover}
              aria-describedby="hover-read-help"
              checked={readOnHover}
              onChange={next => {
                setReadOnHover(next);
                if (next) {
                  speakText(copy.readOnHoverActiveHint);
                } else {
                  stopPageSpeech();
                }
              }}
            />
          </div>

          <div className="a11y-speech-actions">
            <Button variant="secondary" onClick={readSelectionAloud}>{copy.readSelection}</Button>
            <Button variant="ghost" onClick={readPageAloud}>{copy.readPage}</Button>
            {speechStatus === 'speaking' && <Button variant="ghost" onClick={stopPageSpeech}>{copy.stopReading}</Button>}
          </div>

          <p className="a11y-speech-note">{readOnHover ? copy.readOnHoverActiveHint : copy.selectionHint}</p>
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
          <div className="a11y-size-top">
            <label htmlFor="a11y-font-scale-slider">{copy.textSize}</label>
            <span className="a11y-size-badge" aria-live="polite">
              {Math.round(preferences.textScale * 100)}%
            </span>
          </div>
          <div className="a11y-slider-wrap">
            <span className="a11y-slider-bound" aria-hidden="true">A</span>
            <input
              id="a11y-font-scale-slider"
              className="a11y-range-slider"
              type="range"
              min="1"
              max="2"
              step="0.1"
              value={preferences.textScale}
              aria-label={copy.textSize}
              aria-valuemin={100}
              aria-valuemax={200}
              aria-valuenow={Math.round(preferences.textScale * 100)}
              aria-valuetext={`${Math.round(preferences.textScale * 100)}%`}
              onChange={e => preferences.setTextScale(parseFloat(e.target.value))}
            />
            <span className="a11y-slider-bound a11y-slider-bound--max" aria-hidden="true">A++</span>
          </div>

          <div className="a11y-scale-ticks" role="group" aria-label={copy.textSize}>
            {[[1, 'normal', '100%'], [1.5, 'large', '150%'], [2, 'xlarge', '200%']].map(([scale, key, text]) => (
              <button
                type="button"
                key={scale}
                aria-label={copy[key]}
                aria-pressed={Math.abs(preferences.textScale - scale) < 0.04}
                onClick={() => preferences.setTextScale(scale)}
                className="a11y-tick-button"
              >
                <span>{text}</span>
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
