import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../src/app/providers/AuthProvider.jsx';
import { PreferencesProvider } from '../src/app/providers/PreferencesProvider.jsx';
import { QuoteRequestPage } from '../src/pages/QuoteRequestPage.jsx';
import { automationAction, submitQuoteIntake } from '../src/services/automationService.js';

jest.mock('../src/services/automationService.js', () => ({
  automationAction: jest.fn(), submitQuoteIntake: jest.fn(), automationError: jest.fn(() => 'Servicio no disponible'),
}));

function renderPage(path, session = null) {
  return render(<MemoryRouter initialEntries={[path]}><AuthProvider adapter={{ restoreSession: async () => session }}>
    <PreferencesProvider><QuoteRequestPage /></PreferencesProvider>
  </AuthProvider></MemoryRouter>);
}

describe('intake de solicitudes personalizadas', () => {
  afterEach(() => { cleanup(); localStorage.clear(); jest.clearAllMocks(); });

  it('presenta la ruta de modelo/referencias y la de ayuda para definir la idea', () => {
    renderPage('/solicitud');
    expect(screen.getByRole('link', { name: /ya tengo una pieza o referencia/i })).toHaveAttribute('href', '/solicitud/archivo');
    expect(screen.getByRole('link', { name: /quiero ayuda para definirla/i })).toHaveAttribute('href', '/solicitud/ayuda-diseno');
    expect(screen.queryByRole('button', { name: /simulación demo/i })).not.toBeInTheDocument();
    expect(automationAction).not.toHaveBeenCalled();
  });

  it('permite elegir referencias de imagen/modelo en el flujo de archivo', () => {
    renderPage('/solicitud/archivo');
    expect(screen.getByText(/adjuntar fotos, STL u OBJ/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fotos o archivos 3D/i)).toHaveAttribute('multiple');
    fireEvent.change(screen.getByLabelText(/¿qué querés fabricar/i), { target: { value: 'Soporte de pared para una maceta' } });
    const file = new File(['preview'], 'pieza.stl', { type: 'model/stl' });
    fireEvent.change(screen.getByLabelText(/fotos o archivos 3D/i), { target: { files: [file] } });
    expect(screen.getByText('pieza.stl')).toBeInTheDocument();
    expect(screen.queryByText(/simular costos/i)).not.toBeInTheDocument();
  });

  it('usa el chat quote independiente para llenar un borrador revisable sin cotizar', async () => {
    automationAction.mockResolvedValue({ reply: 'Organicé tu solicitud; revisá las medidas antes de enviarla.', links: [], source: 'N8N', requestDraft: {
      description: 'Pieza de contacto corporal flexible', intendedUse: 'Juguete personal', dimensions: 'Largo 15 cm, ancho 3 cm', material: 'TPU', quantity: 1, needsDesign: true,
    } });
    renderPage('/solicitud/ayuda-diseno');
    fireEvent.change(screen.getByLabelText(/tu idea o tu siguiente pregunta/i), { target: { value: 'Quiero una pieza TPU, una unidad, largo 15 cm y ancho 3 cm' } });
    fireEvent.submit(screen.getByLabelText(/tu idea o tu siguiente pregunta/i).closest('form'));
    expect(await screen.findByDisplayValue('Pieza de contacto corporal flexible')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Largo 15 cm, ancho 3 cm')).toBeInTheDocument();
    const reviewButton = screen.getByRole('button', { name: /revisar el resumen y adjuntar referencias/i });
    fireEvent.click(reviewButton);
    expect(screen.getByRole('heading', { name: /revisá lo que va a recibir el taller/i })).toHaveFocus();
    expect(screen.getByRole('link', { name: /iniciar sesión/i })).toBeInTheDocument();
    expect(screen.queryByText(/cotización.*crc/i)).not.toBeInTheDocument();
    expect(automationAction).toHaveBeenCalledWith('/assistants/chat', expect.objectContaining({ mode: 'quote' }), expect.objectContaining({ token: null }));
  });

  it('al pedir preparar la solicitud, organiza la conversación sin una ronda más del Agent', async () => {
    automationAction
      .mockResolvedValueOnce({ reply: '¿Preferís rígido o flexible TPU?', links: [] })
      .mockResolvedValueOnce({ reply: 'Anoto una unidad en TPU flexible y tamaño promedio.', links: [] });
    renderPage('/solicitud/ayuda-diseno');
    const composer = screen.getByLabelText(/tu idea o tu siguiente pregunta/i);
    const send = async message => {
      fireEvent.change(composer, { target: { value: message } });
      fireEvent.submit(composer.closest('form'));
    };

    await send('Quiero hacerme un dildo de juguete');
    await screen.findByText('¿Preferís rígido o flexible TPU?');
    await send('Una unidad, material flexible y tamaño promedio');
    await screen.findByText('Anoto una unidad en TPU flexible y tamaño promedio.');
    await send('Quiero que me hagas el pedido');

    expect(await screen.findByDisplayValue('Un dildo de juguete')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Uso personal; contacto corporal')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /revisar el resumen y adjuntar referencias/i })).toBeInTheDocument();
    expect(await screen.findByText(/no se envió nada/i)).toBeInTheDocument();
    expect(automationAction).toHaveBeenCalledTimes(2);
    expect(submitQuoteIntake).not.toHaveBeenCalled();

    await send('Largo de 15 y ancho de 3');
    expect(await screen.findByDisplayValue('Largo 15; ancho 3 (unidad por confirmar)')).toBeInTheDocument();
    expect(automationAction).toHaveBeenCalledTimes(2);
    expect(submitQuoteIntake).not.toHaveBeenCalled();
  });

  it('conserva las medidas y la ficha si n8n agota iteraciones en medio del intake', async () => {
    automationAction.mockRejectedValue({ code: 'ASSISTANT_ITERATION_LIMIT' });
    renderPage('/solicitud/ayuda-diseno');
    const composer = screen.getByLabelText(/tu idea o tu siguiente pregunta/i);
    const send = async message => {
      await act(async () => {
        fireEvent.change(composer, { target: { value: message } });
        fireEvent.submit(composer.closest('form'));
      });
    };

    await send('Quiero fabricar una base para celular.');
    await screen.findByText(/n8n no pudo completar esta respuesta/i);
    expect(screen.getByLabelText(/¿qué querés fabricar/i)).toHaveValue('Una base para celular');
    await send('Una unidad, PETG, largo 15 cm y ancho 3 cm.');
    expect(await screen.findByDisplayValue('Largo 15 cm; ancho 3 cm')).toBeInTheDocument();
    expect(screen.getByLabelText(/cantidad/i)).toHaveValue(1);
    expect(screen.getByLabelText(/material deseado/i)).toHaveValue('PETG');
    expect(screen.getByRole('button', { name: /revisar el resumen y adjuntar referencias/i })).toBeInTheDocument();
    expect(submitQuoteIntake).not.toHaveBeenCalled();
  });

  it('limpia una interpretación previa del bot y no confunde “prepará el resumen para revisarlo” con el uso', async () => {
    automationAction.mockResolvedValueOnce({ reply: 'Voy a ordenar la solicitud.', links: [], requestDraft: {
      description: 'Organizador de cables', intendedUse: 'revisarlo', quantity: 1,
    } });
    renderPage('/solicitud/ayuda-diseno');
    const composer = screen.getByLabelText(/tu idea o tu siguiente pregunta/i);
    fireEvent.change(composer, { target: { value: 'Quiero un organizador de cables, una unidad, aproximadamente 15 cm de largo por 3 cm de ancho.' } });
    fireEvent.submit(composer.closest('form'));
    await screen.findByText('Voy a ordenar la solicitud.');
    expect(screen.getByDisplayValue('revisarlo')).toBeInTheDocument();

    fireEvent.change(composer, { target: { value: 'Prepará el resumen para revisarlo, por favor.' } });
    fireEvent.submit(composer.closest('form'));

    await waitFor(() => expect(screen.getByLabelText(/¿para qué la vas a usar/i)).toHaveValue(''));
    expect(screen.getByLabelText(/qué querés fabricar/i)).toHaveValue('Un organizador de cables, una unidad, aproximadamente 15 cm de largo por 3 cm de ancho');
    expect(screen.getByLabelText(/medidas aproximadas/i)).toHaveValue('Largo 15 cm; ancho 3 cm');
    expect(automationAction).toHaveBeenCalledTimes(1);
    expect(submitQuoteIntake).not.toHaveBeenCalled();
  });

  it('envía el turno del cliente al presionar Enter, sin enviar el formulario por accidente', async () => {
    automationAction.mockResolvedValue({ reply: 'Lo organicé en el resumen.', links: [], requestDraft: { description: 'Una maceta pequeña', quantity: 1 } });
    renderPage('/solicitud/ayuda-diseno');
    const composer = screen.getByLabelText(/tu idea o tu siguiente pregunta/i);
    fireEvent.change(composer, { target: { value: 'Quiero una maceta pequeña' } });
    fireEvent.keyDown(composer, { key: 'Enter', code: 'Enter', charCode: 13 });
    await waitFor(() => expect(automationAction).toHaveBeenCalledTimes(1));
    expect(automationAction).toHaveBeenCalledWith('/assistants/chat', expect.objectContaining({ mode: 'quote', message: 'Quiero una maceta pequeña' }), expect.anything());
    expect(submitQuoteIntake).not.toHaveBeenCalled();
    expect(await screen.findByText('Lo organicé en el resumen.')).toBeInTheDocument();
  });

  it('envía una solicitud con adjuntos al endpoint de intake sin precio', async () => {
    submitQuoteIntake.mockResolvedValue({ request: { id: 'rq-test', status: 'PENDING_QUOTE' } });
    renderPage('/solicitud/archivo', { user: { id: 'customer-1', name: 'Cliente', email: 'customer@vertice.test', role: 'customer', status: 'ACTIVE' }, token: 'session-token' });
    fireEvent.change(screen.getByLabelText(/¿qué querés fabricar/i), { target: { value: 'Soporte personalizado para teléfono' } });
    const file = new File(['png-data'], 'referencia.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText(/fotos o archivos 3D/i), { target: { files: [file] } });
    await waitFor(() => expect(screen.queryByText(/Necesitás iniciar sesión/i)).not.toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /revisé el resumen.*enviar al taller/i }));
    await waitFor(() => expect(submitQuoteIntake).toHaveBeenCalledWith(expect.objectContaining({ description: 'Soporte personalizado para teléfono', sourceType: 'FILE_UPLOAD' }), [file], { token: 'session-token' }));
    expect(await screen.findByText(/Solicitud enviada al taller/i)).toBeInTheDocument();
    expect(screen.getByText(/No se generó un precio/i)).toBeInTheDocument();
  });
});
