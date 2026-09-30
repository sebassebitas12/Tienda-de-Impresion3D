import { useId } from 'react';
import { SectionKicker } from './SectionKicker.jsx';
import './ui.css';

export function SectionBlock({ title, subtitle, kicker, number, children, className = '', ...props }) {
  const titleId = useId();
  return (
    <section {...props} className={'v-section ' + className} aria-labelledby={titleId}>
      <div className="v-section-inner">
        <header className="v-section-heading">
          <div>{kicker && <SectionKicker number={number}>{kicker}</SectionKicker>}<h2 id={titleId}>{title}</h2></div>
          {subtitle && <p>{subtitle}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
