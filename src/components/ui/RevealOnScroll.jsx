import { useEffect, useRef } from 'react';
import './ui.css';

export function RevealOnScroll({
  as: Tag = 'div',
  children,
  className = '',
  delay = 0,
  style,
  ...props
}) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reduced = media.matches || document.documentElement.dataset.motion === 'reduced';

    if (reduced || !window.IntersectionObserver) {
      element.dataset.reveal = 'visible';
      return undefined;
    }

    element.dataset.reveal = 'pending';

    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        element.dataset.reveal = 'visible';
        observer.disconnect();
      }
    }, { threshold: 0.12 });

    const show = event => {
      if (event.matches) {
        element.dataset.reveal = 'visible';
        observer.disconnect();
      }
    };

    media.addEventListener('change', show);
    observer.observe(element);

    return () => {
      observer.disconnect();
      media.removeEventListener('change', show);
      delete element.dataset.reveal;
    };
  }, []);

  const mergedStyle = {
    ...style,
    '--reveal-delay': Math.max(0, Number(delay) || 0) + 'ms',
  };

  return (
    <Tag {...props} ref={ref} style={mergedStyle} className={'v-reveal ' + className}>
      {children}
    </Tag>
  );
}
