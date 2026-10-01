import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest, afterEach, describe, expect, test } from '@jest/globals';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AppProviders } from '../src/app/providers/AppProviders.jsx';
import { AuthLayout } from '../src/app/layout/AuthLayout.jsx';
import { LoginPage } from '../src/pages/LoginPage.jsx';

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <AppProviders authAdapter={{ restoreSession: async () => null }}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Routes>
      </AppProviders>
    </MemoryRouter>
  );
}

afterEach(() => {
  jest.useRealTimers();
  localStorage.clear();
});

describe('galería de producto en autenticación', () => {
  test('muestra piezas reales con texto alternativo y navegación manual', async () => {
    const user = userEvent.setup();
    renderLogin();

    expect(screen.getByRole('region', { name: 'Productos impresos' })).toBeVisible();
    expect(screen.getByRole('img', { name: 'Soporte modular de carga en PETG' })).toBeVisible();
    expect(screen.getByText('Soporte Modular de Carga')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Mostrar producto siguiente' }));
    expect(screen.getByRole('img', { name: 'Engranaje helicoidal de precisión en nylon' })).toBeVisible();
    expect(screen.getByRole('group', { name: 'Pieza 2 de 4' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Mostrar producto anterior' }));
    expect(screen.getByRole('img', { name: 'Soporte modular de carga en PETG' })).toBeVisible();
  });

  test('rota automáticamente y se detiene al recibir foco de teclado', async () => {
    jest.useFakeTimers();
    renderLogin();

    await act(async () => { jest.advanceTimersByTime(6400); });
    expect(screen.getByRole('img', { name: 'Engranaje helicoidal de precisión en nylon' })).toBeVisible();

    act(() => { screen.getByRole('button', { name: 'Pausar cambio automático' }).focus(); });
    expect(screen.getByRole('button', { name: 'Reanudar cambio automático' })).toHaveFocus();

    await act(async () => { jest.advanceTimersByTime(12800); });
    expect(screen.getByRole('img', { name: 'Engranaje helicoidal de precisión en nylon' })).toBeVisible();
  });

  test('el control detiene la rotación al activarlo con puntero', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderLogin();

    await user.click(screen.getByRole('button', { name: 'Pausar cambio automático' }));
    expect(screen.getByRole('button', { name: 'Reanudar cambio automático' })).toBeVisible();
    await act(async () => { jest.advanceTimersByTime(12800); });
    expect(screen.getByRole('img', { name: 'Soporte modular de carga en PETG' })).toBeVisible();
  });

  test('respeta la preferencia local de movimiento reducido y deja navegación manual', async () => {
    jest.useFakeTimers();
    localStorage.setItem('vertice-no-motion', 'true');
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderLogin();

    expect(screen.queryByRole('button', { name: 'Pausar cambio automático' })).not.toBeInTheDocument();
    await act(async () => { jest.advanceTimersByTime(12800); });
    expect(screen.getByRole('img', { name: 'Soporte modular de carga en PETG' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Mostrar producto siguiente' }));
    expect(screen.getByRole('img', { name: 'Engranaje helicoidal de precisión en nylon' })).toBeVisible();
  });
});
