import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FloatingTools } from '../src/app/layout/FloatingTools.jsx';
import { PreferencesProvider } from '../src/app/providers/PreferencesProvider.jsx';

function renderReadingPanel() {
  return render(
    <MemoryRouter>
      <PreferencesProvider>
        <main id="main-content"><h1>Inicio</h1><p>Contenido de la página para escuchar.</p></main>
        <FloatingTools active="reading" onActiveChange={() => {}} />
      </PreferencesProvider>
    </MemoryRouter>,
  );
}

function renderChatPanel() {
  return render(
    <MemoryRouter>
      <PreferencesProvider>
        <FloatingTools active="chat" onActiveChange={() => {}} />
      </PreferencesProvider>
    </MemoryRouter>,
  );
}

describe('Preferencias de lectura', () => {
  const initialWidth = window.innerWidth;
  let speechMock;
  let utteranceMock;
  let selectionDescriptor;

  beforeEach(() => {
    selectionDescriptor = Object.getOwnPropertyDescriptor(window, 'getSelection');
    speechMock = { cancel: jest.fn(), speak: jest.fn() };
    utteranceMock = jest.fn(function SpeechUtterance(text) { this.text = text; });
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: speechMock });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: utteranceMock });
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    document.documentElement.style.removeProperty('--a11y-font-scale');
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: initialWidth });
    delete window.speechSynthesis;
    delete window.SpeechSynthesisUtterance;
    if (selectionDescriptor) Object.defineProperty(window, 'getSelection', selectionDescriptor);
    else delete window.getSelection;
  });

  it.each([
    ['Tamaño normal, 100%', '1'],
    ['Texto grande, 150%', '1.5'],
    ['Texto muy grande, 200%', '2'],
  ])('aplica y persiste %s a toda la interfaz', async (label, scale) => {
    renderReadingPanel();

    fireEvent.click(screen.getByRole('button', { name: label }));

    await waitFor(() => {
      expect(document.documentElement.style.getPropertyValue('--a11y-font-scale')).toBe(scale);
      expect(localStorage.getItem('vertice-text-scale')).toBe(scale);
    });
  });

  it('aumenta gradualmente la escala general en un viewport de monitor', async () => {
    renderReadingPanel();
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1920 });
    fireEvent(window, new Event('resize'));

    await waitFor(() => {
      expect(document.documentElement.style.getPropertyValue('--a11y-font-scale')).toBe('1.1');
    });
  });

  it('lee el contenido principal con el idioma actual y permite detenerlo', () => {
    renderReadingPanel();

    fireEvent.click(screen.getByRole('button', { name: 'Leer página completa' }));

    expect(utteranceMock).toHaveBeenCalledWith(expect.stringContaining('Contenido de la página para escuchar.'));
    expect(speechMock.speak).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toHaveTextContent('Lectura en curso.');
    fireEvent.click(screen.getByRole('button', { name: 'Detener lectura' }));
    expect(speechMock.cancel).toHaveBeenCalled();
  });

  it('lee únicamente el texto seleccionado cuando se solicita', () => {
    renderReadingPanel();
    Object.defineProperty(window, 'getSelection', { configurable: true, value: () => ({ toString: () => 'Solo este fragmento.' }) });

    fireEvent.click(screen.getByRole('button', { name: 'Leer selección' }));

    expect(utteranceMock).toHaveBeenCalledWith('Solo este fragmento.');
    expect(speechMock.speak).toHaveBeenCalledTimes(1);
  });

  it('no inicia lectura si aún no hay una selección y explica qué hacer', () => {
    renderReadingPanel();
    Object.defineProperty(window, 'getSelection', { configurable: true, value: () => ({ toString: () => '' }) });

    fireEvent.click(screen.getByRole('button', { name: 'Leer selección' }));

    expect(speechMock.speak).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent('Primero seleccioná el texto que querés escuchar.');
  });
});

describe('Asistencia del taller', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('explica que la respuesta automática es demo y ofrece iniciar una solicitud', () => {
    renderChatPanel();

    expect(screen.getByText(/respuesta automática todavía no está conectada/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cotizar archivo/i })).toHaveAttribute('href', '/solicitud');
    expect(screen.getByRole('group', { name: 'Temas para empezar' })).toBeInTheDocument();
  });

  it('usa un tema sugerido para completar el campo y no simula una respuesta', () => {
    renderChatPanel();

    fireEvent.click(screen.getByRole('button', { name: 'Elegir material' }));
    expect(screen.getByRole('textbox', { name: 'Escribí tu mensaje' })).toHaveValue('Elegir material');

    fireEvent.click(screen.getByRole('button', { name: 'Enviar pregunta' }));
    expect(screen.getByRole('status')).toHaveTextContent(/asistencia automática no está disponible/i);
    expect(screen.getByRole('link', { name: /cotizar archivo/i })).toHaveAttribute('href', '/solicitud');
  });
});
