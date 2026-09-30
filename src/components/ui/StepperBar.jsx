import './ui.css';

export function StepperBar({ steps, current = 0, label = 'Progreso' }) {
  return (
    <nav aria-label={label} className="v-stepper">
      <ol>{steps.map((step, index) => (
        <li key={step.id ?? step} aria-current={index === current ? 'step' : undefined} data-complete={index < current}>
          <span aria-hidden="true">{index < current ? '✓' : index + 1}</span>{step.label ?? step}
        </li>
      ))}</ol>
    </nav>
  );
}
