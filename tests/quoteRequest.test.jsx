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

  it('presenta las dos intenciones y deja el estimador identificado como DEMO', async () => {
    automationAction.mockResolvedValue({ profiles: [] });
    renderPage('/solicitud');
    expect(screen.getByRole('link', { name: /ya tengo la pieza/i })).toHaveAttribute('href', '/solicitud/archivo');
    expect(screen.getByRole('link', { name: /quiero ayuda para crearla/i })).toHaveAttribute('href', '/solicitud/ayuda-diseno');
    expect(screen.getByText('Probar el estimador de referencia DEMO')).toBeInTheDocument();
    await waitFor(() => expect(automationAction).toHaveBeenCalledWith('/quotes/profiles', {}, expect.any(Object)));
  });

  it('no finge recibir STL/OBJ mientras el servicio de archivos no existe', () => {
    automationAction.mockResolvedValue({ profiles: [] });
    renderPage('/solicitud/archivo');
    expect(screen.getByRole('heading', { name: 'La carga segura aún no está conectada.' })).toBeInTheDocument();
    expect(screen.queryByLabelText(/archivo/i)).not.toBeInTheDocument();
  });

  it('permite que una persona sin sesión abra el bot de ayuda para diseñar', async () => {
    automationAction.mockImplementation(path => path === '/quotes/profiles'
      ? Promise.resolve({ profiles: [] })
      : Promise.resolve({ reply: 'Te ayudo a definir la pieza.', links: [], source: 'DEMO_RULES' }));
    renderPage('/solicitud/ayuda-diseno');
    await waitFor(() => expect(automationAction).toHaveBeenCalledWith('/quotes/profiles', {}, expect.any(Object)));
    fireEvent.click(screen.getByRole('button', { name: /conversar con el asistente/i }));
    fireEvent.click(await screen.findByRole('button', { name: /¿qué datos necesitás/i }));
    expect(await screen.findByText('Te ayudo a definir la pieza.')).toBeInTheDocument();
    expect(automationAction).toHaveBeenCalledWith('/assistants/chat', expect.objectContaining({ mode: 'quote' }), expect.objectContaining({ token: null }));
    expect(screen.queryByText(/iniciá sesión para usar este asistente/i)).not.toBeInTheDocument();
  });
});
