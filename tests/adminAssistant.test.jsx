import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from '../src/app/providers/AuthProvider.jsx';
import { PreferencesProvider } from '../src/app/providers/PreferencesProvider.jsx';
import { AdminAssistantPage } from '../src/features/admin/AdminAssistantPage.jsx';
import { LoginPage } from '../src/pages/LoginPage.jsx';
import { automationAction } from '../src/services/automationService.js';

jest.mock('../src/services/automationService.js', () => ({
  automationAction: jest.fn(), automationError: jest.fn(code => code === 'ROLE_REQUIRED' ? 'El Copiloto Admin es independiente; la API rechazó la sesión.' : 'Error de conexión'),
}));

const adminSession = { user: { id: 'admin-1', name: 'Admin', email: 'admin@example.test', role: 'admin', status: 'ACTIVE' }, token: 'simulated-admin' };

function RouteInfo() {
  const location = useLocation();
  return <output data-testid="route-info">{location.pathname}|{location.state?.reason || ''}</output>;
}

function renderPage(adapter = {}) {
  return render(<MemoryRouter initialEntries={['/admin/asistente']}><AuthProvider adapter={{ restoreSession: async () => adminSession, ...adapter }}>
    <PreferencesProvider><Routes>
      <Route path="/admin/asistente" element={<AdminAssistantPage />} />
      <Route path="/login" element={<><LoginPage /><RouteInfo /></>} />
    </Routes></PreferencesProvider>
  </AuthProvider></MemoryRouter>);
}

describe('Copiloto Admin independiente del chatbot público', () => {
  afterEach(() => { cleanup(); jest.clearAllMocks(); localStorage.clear(); });

  it('se presenta como espacio de trabajo Admin de ancho completo, no como panel Home ni chat lateral', async () => {
    renderPage();
    expect(await screen.findByRole('heading', { name: 'Copiloto del taller' })).toBeInTheDocument();
    expect(document.querySelector('.assistant-panel')).not.toBeInTheDocument();
    expect(document.querySelector('.admin-copilot__conversation')).toBeInTheDocument();
    expect(document.querySelector('.admin-copilot__console').firstElementChild).toHaveClass('admin-copilot__conversation');
    expect(document.querySelector('.admin-copilot__guide')).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Consultas sugeridas' })).toBeInTheDocument();
    expect(screen.getByText(/CAMBIOS CON CONFIRMACIÓN/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Agregar una pieza/i })).toBeInTheDocument();
  });

  it('mantiene el espacio Admin si la API rechaza la sesión y solo sale al pedir reautenticación', async () => {
    automationAction.mockRejectedValue({ code: 'ROLE_REQUIRED' });
    const logout = jest.fn().mockResolvedValue(undefined);
    renderPage({ logout });
    fireEvent.click(await screen.findByRole('button', { name: /Prioridades/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/El Copiloto Admin es independiente/);
    expect(await screen.findByRole('heading', { name: 'Copiloto del taller' })).toBeInTheDocument();
    expect(logout).not.toHaveBeenCalled();
    expect(automationAction).toHaveBeenCalledWith('/assistants/chat', expect.objectContaining({ mode: 'admin' }), expect.objectContaining({ token: 'simulated-admin' }));

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión y volver a iniciar sesión' }));
    expect(await screen.findByTestId('route-info')).toHaveTextContent('/login|admin-session-rejected');
    expect(logout).toHaveBeenCalledTimes(1);
  });
});
