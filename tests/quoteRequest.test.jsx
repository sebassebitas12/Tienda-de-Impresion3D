import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../src/app/providers/AuthProvider.jsx';
import { PreferencesProvider } from '../src/app/providers/PreferencesProvider.jsx';
import { QuoteRequestPage } from '../src/pages/QuoteRequestPage.jsx';
import { automationAction } from '../src/services/automationService.js';

jest.mock('../src/services/automationService.js', () => ({
  automationAction: jest.fn(),
  automationError: jest.fn(() => 'Servicio no disponible'),
}));

function renderPage(path) {
  return render(<MemoryRouter initialEntries={[path]}><AuthProvider adapter={{ restoreSession: async () => null }}>
    <PreferencesProvider><QuoteRequestPage /></PreferencesProvider>
  </AuthProvider></MemoryRouter>);
}

describe('dos recorridos de cotización', () => {
  afterEach(() => { cleanup(); localStorage.clear(); jest.clearAllMocks(); });

  it('presenta las dos intenciones sin mezclar la entrada con una calculadora', () => {
    automationAction.mockResolvedValue({ profiles: [] });
    renderPage('/solicitud');
    expect(screen.getByRole('link', { name: /ya tengo la pieza/i })).toHaveAttribute('href', '/solicitud/archivo');
    expect(screen.getByRole('link', { name: /quiero ayuda para crearla/i })).toHaveAttribute('href', '/solicitud/ayuda-diseno');
    expect(screen.queryByRole('button', { name: /ver simulación/i })).not.toBeInTheDocument();
    expect(automationAction).not.toHaveBeenCalled();
  });

  it('no finge recibir STL/OBJ mientras el servicio de archivos no existe', () => {
    automationAction.mockResolvedValue({ profiles: [] });
    renderPage('/solicitud/archivo');
    expect(screen.getByRole('link', { name: /cambiar tipo de proyecto/i })).toHaveAttribute('href', '/solicitud');
    expect(screen.getByText(/recepción de archivos desde esta página todavía no está disponible/i)).toBeInTheDocument();
    expect(screen.queryByText(/simular costos/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/archivo/i)).not.toBeInTheDocument();
  });

  it('integra la conversación de diseño en la página y permite conversar sin sesión', async () => {
    automationAction.mockImplementation(path => path === '/quotes/profiles'
      ? Promise.resolve({ profiles: [] })
      : Promise.resolve({ reply: 'Te ayudo a definir la pieza.', links: [], source: 'DEMO_RULES' }));
    renderPage('/solicitud/ayuda-diseno');
    await waitFor(() => expect(automationAction).toHaveBeenCalledWith('/quotes/profiles', {}, expect.any(Object)));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(await screen.findByRole('button', { name: /¿qué datos necesitás/i }));
    expect(await screen.findByText('Te ayudo a definir la pieza.')).toBeInTheDocument();
    expect(automationAction).toHaveBeenCalledWith('/assistants/chat', expect.objectContaining({ mode: 'quote' }), expect.objectContaining({ token: null }));
    expect(screen.queryByText(/iniciá sesión para usar este asistente/i)).not.toBeInTheDocument();
  });
  it('permite buscar referencias visuales y elegir una sin preseleccionar una pieza ajena', async () => {
    automationAction.mockResolvedValue({ profiles: [
      { id: 'engranaje', name: 'Engranaje de prototipo', image: '/gear.png', weightGrams: 20, printHours: 1 },
      { id: 'soporte', name: 'Soporte modular', image: '/stand.png', weightGrams: 80, printHours: 3 },
    ] });
    renderPage('/solicitud/ayuda-diseno');
    await screen.findByRole('button', { name: /engranaje de prototipo/i });
    expect(screen.getByRole('button', { name: /ver simulación demo/i })).toBeDisabled();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'engranaje' } });
    expect(screen.queryByRole('button', { name: /soporte modular/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /engranaje de prototipo/i }));
    expect(screen.getByRole('button', { name: /engranaje de prototipo/i })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /ver simulación demo/i })).toBeEnabled();
    fireEvent.click(screen.getByRole('button', { name: 'Quitar' }));
    expect(screen.getByRole('button', { name: /ver simulación demo/i })).toBeDisabled();
  });
});
