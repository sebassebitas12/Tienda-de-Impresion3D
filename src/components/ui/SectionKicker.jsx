import { MonoLabel } from './MonoLabel.jsx';

export function SectionKicker({ number, children, className = '', ...props }) {
  return <MonoLabel {...props} className={'v-section-kicker ' + className}>{number && <>{number} / </>}{children}</MonoLabel>;
}
