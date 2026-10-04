import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { AssistantFormattedText } from '../src/features/chatbot/AssistantFormattedText.jsx';

describe('formato de respuestas del asistente', () => {
  it('presenta párrafos, énfasis y viñetas sin mostrar marcadores Markdown', () => {
    const content = ['Para una pieza:', '', '- **PLA**: uso de interior.', '- **PETG**: pieza funcional.', '', 'No calculo precio.'].join('\n');
    const { container } = render(<AssistantFormattedText content={content} />);
    expect(screen.getByText('PLA')).toBeInTheDocument();
    expect(screen.getByText('PETG')).toBeInTheDocument();
    expect(screen.getByText('No calculo precio.')).toBeInTheDocument();
    expect(container.querySelectorAll('li')).toHaveLength(2);
    expect(container.textContent).not.toContain('**');
  });
});
