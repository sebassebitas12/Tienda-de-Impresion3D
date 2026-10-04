import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FloatingTools } from '../src/app/layout/FloatingTools.jsx';
import { PreferencesProvider } from '../src/app/providers/PreferencesProvider.jsx';
import { automationAction } from '../src/services/automationService.js';

jest.mock('../src/services/automationService.js', () => ({
  automationAction: jest.fn(),
  automationError: code => ({
    ASSISTANT_UNAVAILABLE: 'n8n no responde.',
    ASSISTANT_TIMEOUT: 'n8n tardó demasiado.',
    ASSISTANT_INVALID_RESPONSE: 'n8n devolvió una respuesta inválida.',
  }[code] || 'No se pudo responder.'),
}));

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

  it('muestra herramientas por contexto sin prometer que la IA está conectada', () => {
    renderChatPanel();

    expect(screen.getByText(/No cambio pedidos ni envío correos por mi cuenta/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Qué material me conviene/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar pregunta' })).toBeDisabled();
  });

  it('consulta un tema sugerido y distingue la guía local del proveedor IA', async () => {
    automationAction.mockResolvedValue({ reply: 'Compará PLA y PETG para este uso.', source: 'DEMO_RULES', links: [{ label: 'Cotizar', path: '/solicitud' }] });
    renderChatPanel();

    fireEvent.click(screen.getByRole('button', { name: /Qué material me conviene/ }));
    expect(await screen.findByText('Compará PLA y PETG para este uso.')).toBeInTheDocument();
    expect(screen.getByText(/Guía local · proveedor IA no conectado/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Cotizar/ })).toHaveAttribute('href', '/solicitud');
    expect(automationAction).toHaveBeenCalledWith('/assistants/chat', expect.objectContaining({ mode: 'general', message: '¿Qué material me conviene?' }), expect.any(Object));
  });

  it('envía el mensaje con Enter y reserva Shift+Enter para continuar escribiendo', async () => {
    automationAction.mockClear();
    automationAction.mockResolvedValue({ reply: 'Respuesta del asistente.', source: 'DEMO_RULES' });
    renderChatPanel();
    const input = document.getElementById('chat-panel-message');

    fireEvent.change(input, { target: { value: 'Hola desde el teclado' } });
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: false });

    expect(await screen.findByText('Respuesta del asistente.')).toBeInTheDocument();
    expect(automationAction).toHaveBeenCalledTimes(1);
    expect(automationAction).toHaveBeenCalledWith('/assistants/chat', expect.objectContaining({ message: 'Hola desde el teclado' }), expect.any(Object));

    fireEvent.change(input, { target: { value: 'Una segunda línea' } });
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });

    expect(input).toHaveValue('Una segunda línea');
    expect(automationAction).toHaveBeenCalledTimes(1);
  });

  it('expone el estado de carga mientras espera a n8n', async () => {
    let resolveAction;
    automationAction.mockReturnValueOnce(new Promise(resolve => { resolveAction = resolve; }));
    renderChatPanel();
    const input = document.getElementById('chat-panel-message');
    fireEvent.change(input, { target: { value: 'Consulta lenta' } });
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: false });

    expect(screen.getByRole('status')).toHaveTextContent('Consultando las herramientas');
    await act(async () => resolveAction({ reply: 'Respuesta lista.' }));
    expect(await screen.findByText('Respuesta lista.')).toBeInTheDocument();
  });

  it.each([
    ['caída de n8n', 'ASSISTANT_UNAVAILABLE', 'n8n no responde.'],
    ['timeout', 'ASSISTANT_TIMEOUT', 'n8n tardó demasiado.'],
    ['respuesta inválida', 'ASSISTANT_INVALID_RESPONSE', 'n8n devolvió una respuesta inválida.'],
  ])('presenta error accesible para %s', async (_label, code, message) => {
    automationAction.mockRejectedValueOnce(Object.assign(new Error(code), { code }));
    renderChatPanel();
    const input = document.getElementById('chat-panel-message');
    fireEvent.change(input, { target: { value: 'Consulta de prueba' } });
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: false });

    expect(await screen.findByRole('alert')).toHaveTextContent(message);
  });
});
