import { describe, expect, it } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import { jest } from '@jest/globals';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../src/app/providers/contexts.js';
import { PreferencesProvider } from '../src/app/providers/PreferencesProvider.jsx';
import { AboutPage } from '../src/pages/AboutPage.jsx';
import { ContactPage } from '../src/pages/ContactPage.jsx';

function renderPage(Page, user = null) {
  return render(<MemoryRouter><AuthContext.Provider value={{ user }}><PreferencesProvider><Page /></PreferencesProvider></AuthContext.Provider></MemoryRouter>);
}

describe('páginas institucionales', () => {
  it('presenta qué hace el taller y permite continuar a catálogo o solicitud', () => {
    renderPage(AboutPage);
    expect(screen.getByRole('heading', { level: 1, name: /ideas tomen forma/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /explorar catálogo/i })).toHaveAttribute('href', '/catalogo');
    expect(screen.getByRole('link', { name: /contar mi proyecto/i })).toHaveAttribute('href', '/solicitud');
  });

  it('presenta rutas reales para pieza, idea y seguimiento del cliente nuevo', () => {
    renderPage(ContactPage);
    expect(screen.getByRole('heading', { level: 1, name: /contanos qué necesitás fabricar/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /enviar para revisión/i })).toHaveAttribute('href', '/solicitud/archivo');
    expect(screen.getByRole('link', { name: /organizar mi idea/i })).toHaveAttribute('href', '/solicitud/ayuda-diseno');
    expect(screen.getByRole('link', { name: /ir a mi cuenta/i })).toHaveAttribute('href', '/login');
    expect(screen.getByText(/la cotización depende de la revisión del taller/i)).toBeInTheDocument();
    expect(screen.getByText(/revisamos el archivo y los datos enviados/i)).toBeInTheDocument();
    expect(screen.queryByText(/el equipo revisa/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sebasseb2109@gmail.com/i)).not.toBeInTheDocument();
  });

  it('dirige cliente y administrador a su espacio correspondiente', () => {
    const { unmount } = renderPage(ContactPage, { id: 'c1', role: 'customer' });
    expect(screen.getByRole('link', { name: /ir a mi cuenta/i })).toHaveAttribute('href', '/cuenta');
    unmount();
    renderPage(ContactPage, { id: 'a1', role: 'admin' });
    expect(screen.getByRole('link', { name: /ir a administración/i })).toHaveAttribute('href', '/admin');
  });

  it('abre el asistente general desde el enrutador de contacto', () => {
    const openGeneralAssistant = jest.fn();
    render(<MemoryRouter initialEntries={['/contacto']}><AuthContext.Provider value={{ user: null }}><PreferencesProvider>
      <Routes><Route element={<Outlet context={{ openGeneralAssistant }} />}><Route path="/contacto" element={<ContactPage />} /></Route></Routes>
    </PreferencesProvider></AuthContext.Provider></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: /consultar al asistente/i }));
    expect(openGeneralAssistant).toHaveBeenCalledTimes(1);
  });

  it('explica que la cotización se revisa antes de mostrar un monto', () => {
    renderPage(ContactPage);
    fireEvent.click(screen.getByText('¿Recibo un precio al enviar?'));
    expect(screen.getByText(/no automáticamente. primero se registra una solicitud/i)).toBeInTheDocument();
  });

  it('presenta canales directos oficiales (WhatsApp, teléfono, correo) y permite enviar mensaje directo', () => {
    renderPage(ContactPage);
    const whatsappLink = screen.getByRole('link', { name: /abrir whatsapp/i });
    expect(whatsappLink).toHaveAttribute('href', expect.stringContaining('https://wa.me/50688888888'));
    expect(screen.getByRole('link', { name: /llamar al taller/i })).toHaveAttribute('href', 'tel:+50625500000');
    expect(screen.getByRole('link', { name: /enviar correo/i })).toHaveAttribute('href', 'mailto:taller@verticecr.com');
    expect(screen.getByText('+506 8888-8888')).toBeInTheDocument();
    expect(screen.getByText('+506 2550-0000')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/nombre completo/i), { target: { value: 'Carlos Quesada' } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'carlos@ejemplo.cr' } });
    fireEvent.change(screen.getByLabelText(/mensaje o descripción/i), { target: { value: 'Quisiera consultar por fabricación de 20 piezas en PETG.' } });
    fireEvent.click(screen.getByRole('button', { name: /enviar mensaje al taller/i }));

    expect(screen.getByRole('status')).toHaveTextContent(/mensaje recibido en el taller/i);
  });
});
