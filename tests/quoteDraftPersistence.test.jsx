import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PreferencesProvider } from '../src/app/providers/PreferencesProvider.jsx';
import { QuoteRequestPage } from '../src/pages/QuoteRequestPage.jsx';
import { LoginPage } from '../src/pages/LoginPage.jsx';
import { submitQuoteIntake } from '../src/services/automationService.js';

let mockAuth = {
  user: null,
  token: null,
  isAuthenticated: false,
  login: jest.fn(),
};

jest.mock('../src/hooks/useAuth.js', () => ({
  useAuth: () => mockAuth,
}));

jest.mock('../src/services/automationService.js', () => ({
  submitQuoteIntake: jest.fn(),
  automationError: () => 'Error al enviar solicitud',
}));

describe('E01: Preservación de borrador de cotización durante login/registro', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    jest.clearAllMocks();
    mockAuth = { user: null, token: null, isAuthenticated: false, login: jest.fn() };
  });

  afterEach(cleanup);

  it('guarda el borrador en storage y lo restaura al volver de login con aviso de adjuntos', async () => {
    // 1. Visitor enters quote form
    const { unmount } = render(
      <PreferencesProvider>
        <MemoryRouter initialEntries={['/solicitud/archivo']}>
          <Routes>
            <Route path="/solicitud/archivo" element={<QuoteRequestPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      </PreferencesProvider>
    );

    // 2. Visitor types description, intended use and selects a file
    const desc = screen.getByLabelText('¿Qué querés fabricar?');
    await userEvent.type(desc, 'Engranaje de repuesto para máquina CNC');
    const use = screen.getByLabelText('¿Para qué la vas a usar?');
    await userEvent.type(use, 'Sustituir piñón desgastado en eje X');

    const file = new File(['mock content'], 'pinon-cnc.stl', { type: 'model/stl' });
    const fileInput = screen.getByLabelText(/Fotos o archivos 3D/i);
    await userEvent.upload(fileInput, file);

    expect(screen.getByText('pinon-cnc.stl')).toBeInTheDocument();

    // Verify it was persisted to sessionStorage
    const savedRaw = sessionStorage.getItem('vertice.quote.draft');
    expect(savedRaw).toBeTruthy();
    const saved = JSON.parse(savedRaw);
    expect(saved.draft.description).toBe('Engranaje de repuesto para máquina CNC');
    expect(saved.draft.intendedUse).toBe('Sustituir piñón desgastado en eje X');
    expect(saved.unpersistedFileNames).toContain('pinon-cnc.stl');

    // 3. User navigates away / unmounts (simulating going to login)
    unmount();

    // 4. User logs in and returns to /solicitud/archivo
    mockAuth = {
      user: { id: 'u2', name: 'Ana', email: 'ana@example.com', role: 'customer', status: 'ACTIVE' },
      token: 'sim.v1.mock',
      isAuthenticated: true,
      login: jest.fn(),
    };

    render(
      <PreferencesProvider>
        <MemoryRouter initialEntries={['/solicitud/archivo']}>
          <Routes>
            <Route path="/solicitud/archivo" element={<QuoteRequestPage />} />
          </Routes>
        </MemoryRouter>
      </PreferencesProvider>
    );

    // 5. Fields are restored
    expect(screen.getByLabelText('¿Qué querés fabricar?')).toHaveValue('Engranaje de repuesto para máquina CNC');
    expect(screen.getByLabelText('¿Para qué la vas a usar?')).toHaveValue('Sustituir piñón desgastado en eje X');

    // 6. Alert informs user about attachments needing to be re-selected due to browser security
    expect(screen.getByRole('status')).toHaveTextContent(/Por seguridad del navegador, los archivos adjuntos \(pinon-cnc\.stl\) deben seleccionarse nuevamente/i);
  });

  it('al enviar la solicitud exitosamente limpia el borrador del storage', async () => {
    mockAuth = {
      user: { id: 'u2', name: 'Ana', email: 'ana@example.com', role: 'customer', status: 'ACTIVE' },
      token: 'sim.v1.mock',
      isAuthenticated: true,
      login: jest.fn(),
    };

    sessionStorage.setItem('vertice.quote.draft', JSON.stringify({
      draft: { description: 'Pieza de prueba', intendedUse: 'Test', dimensions: '', dimensionsUnit: 'cm', material: '', quantity: 1, needsDesign: false, referenceUrl: '' },
      assistantDraftReady: false,
      manuallyEditedFields: ['description'],
      unpersistedFileNames: [],
    }));

    submitQuoteIntake.mockResolvedValue({
      request: { id: 'rq-test-123', status: 'PENDING_QUOTE' },
    });

    render(
      <PreferencesProvider>
        <MemoryRouter initialEntries={['/solicitud/archivo']}>
          <Routes>
            <Route path="/solicitud/archivo" element={<QuoteRequestPage />} />
          </Routes>
        </MemoryRouter>
      </PreferencesProvider>
    );

    expect(screen.getByLabelText('¿Qué querés fabricar?')).toHaveValue('Pieza de prueba');

    fireEvent.click(screen.getByRole('button', { name: /Revisé el resumen · Enviar al taller/i }));

    await waitFor(() => {
      expect(submitQuoteIntake).toHaveBeenCalled();
    });

    expect(await screen.findByText(/Solicitud enviada al taller/i)).toBeInTheDocument();
    expect(sessionStorage.getItem('vertice.quote.draft')).toBeNull();
  });
});
