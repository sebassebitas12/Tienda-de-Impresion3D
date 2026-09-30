import { useEffect, useRef } from 'react';
import './ui.css';

export function RevealOnScroll({ as: Tag = 'div', children, className = '', ...props }) {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!element || media.matches || document.documentElement.dataset.motion === 'reduced' || !window.IntersectionObserver) return;
    element.dataset.reveal = 'pending';
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        element.dataset.reveal = 'visible';
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    const show = () => { if (media.matches) { element.dataset.reveal = 'visible'; observer.disconnect(); } };
    media.addEventListener('change', show);
    observer.observe(element);
    return () => { observer.disconnect(); media.removeEventListener('change', show); delete element.dataset.reveal; };
  }, []);
  return <Tag {...props} ref={ref} className={'v-reveal ' + className}>{children}</Tag>;
}
