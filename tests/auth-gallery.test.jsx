import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test } from '@jest/globals';
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
  cleanup();
  localStorage.clear();
});

describe('collage de producto en autenticación', () => {
  test('presenta las seis piezas en controles accesibles', () => {
    renderLogin();

    expect(screen.getByRole('region', { name: 'Productos impresos' })).toBeVisible();
    expect(screen.getAllByRole('button', { name: /Soporte Modular|Engranaje Helicoidal|Dragón de Colección|Brazo de Chasis|Maqueta Arquitectónica|Pieza Flexible/ })).toHaveLength(6);
    expect(screen.getByRole('button', { name: /Soporte Modular de Carga/ })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('Pasá el cursor, enfocá o seleccioná una pieza para ver su material.')).toBeVisible();
    expect(screen.queryByText('Soporte Modular de Carga', { selector: '.auth-collage-caption span' })).not.toBeInTheDocument();
  });

  test('al pasar el puntero y elegir una pieza, la destaca y actualiza su leyenda', async () => {
    const user = userEvent.setup();
    renderLogin();

    const dragon = screen.getByRole('button', { name: /Dragón de Colección/ });
    await user.hover(dragon);
    expect(dragon).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('Dragón de Colección')).toBeVisible();
    await user.unhover(dragon);
    expect(screen.getByText(/Pasá el cursor/)).toBeVisible();

    await user.click(dragon);
    expect(dragon).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Dragón de Colección')).toBeVisible();
  });

  test('las piezas se pueden destacar recorriendo con teclado', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    const gear = screen.getByRole('button', { name: /Engranaje Helicoidal/ });
    expect(gear).toHaveFocus();
    expect(gear).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Engranaje Helicoidal 60T')).toBeVisible();
  });
});
