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
  afterEach(() => { cleanup(); localStorage.clear(); sessionStorage.clear(); jest.clearAllMocks(); });

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
    fireEvent.keyDown(screen.getByLabelText(/tu idea o tu siguiente pregunta/i), { key: 'Enter' });
    expect(await screen.findByDisplayValue('Pieza de contacto corporal flexible')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Largo 15 cm, ancho 3 cm')).toBeInTheDocument();
    const reviewButton = screen.getByRole('button', { name: /revisar el resumen y adjuntar referencias/i });
    expect(screen.getByLabelText(/tu idea o tu siguiente pregunta/i).closest('.assistant-composer').tagName).toBe('DIV');
    fireEvent.click(reviewButton);
    expect(screen.getByRole('heading', { name: /revisá lo que organizó la ia/i })).toHaveFocus();
    expect(screen.getByRole('link', { name: /iniciar sesión/i })).toBeInTheDocument();
    expect(screen.queryByText(/cotización.*crc/i)).not.toBeInTheDocument();
    expect(automationAction).toHaveBeenCalledWith('/assistants/chat', expect.objectContaining({ mode: 'quote' }), expect.objectContaining({ token: null }));
  });

  it('al pedir preparar la solicitud, obtiene del agente un resumen estructurado revisable', async () => {
    automationAction
      .mockResolvedValueOnce({ reply: '¿Preferís rígido o flexible TPU?', links: [] })
      .mockResolvedValueOnce({ reply: 'Anoto una unidad en TPU flexible y tamaño promedio.', links: [] })
      .mockResolvedValueOnce({ reply: 'Listo: armé un borrador con lo que ya me contaste. No se envió nada.', links: [], requestDraft: {
        description: 'Dildo de juguete', intendedUse: 'Uso personal; contacto corporal', dimensions: 'Tamaño promedio (sin medidas numéricas)', material: 'TPU', quantity: 1, needsDesign: false,
      } })
      .mockResolvedValueOnce({ reply: 'Actualicé el resumen con las medidas; la unidad queda pendiente de confirmar.', links: [], requestDraft: {
        description: 'Dildo de juguete', intendedUse: 'Uso personal; contacto corporal', dimensions: 'Largo 15; ancho 3 (unidad por confirmar)', material: 'TPU', quantity: 1, needsDesign: false,
      } });
    renderPage('/solicitud/ayuda-diseno');
    const composer = screen.getByLabelText(/tu idea o tu siguiente pregunta/i);
    const send = async message => {
      fireEvent.change(composer, { target: { value: message } });
      fireEvent.keyDown(composer, { key: 'Enter', code: 'Enter', charCode: 13 });
    };

    await send('Quiero hacerme un dildo de juguete');
    await screen.findByText('¿Preferís rígido o flexible TPU?');
    await send('Una unidad, material flexible y tamaño promedio');
    await screen.findByText('Anoto una unidad en TPU flexible y tamaño promedio.');
    await send('Quiero que me hagas el pedido');

    expect(await screen.findByDisplayValue('Dildo de juguete')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Uso personal; contacto corporal')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /revisar el resumen y adjuntar referencias/i })).toBeInTheDocument();
    expect(await screen.findByText(/no se envió nada/i)).toBeInTheDocument();
    expect(automationAction).toHaveBeenCalledTimes(3);
    expect(submitQuoteIntake).not.toHaveBeenCalled();

    await send('Largo de 15 y ancho de 3');
    expect(await screen.findByDisplayValue('Largo 15; ancho 3 (unidad por confirmar)')).toBeInTheDocument();
    expect(automationAction).toHaveBeenCalledTimes(4);
    expect(submitQuoteIntake).not.toHaveBeenCalled();
  });

  it('conserva las medidas y la ficha si n8n agota iteraciones en medio del intake', async () => {
    automationAction.mockRejectedValue({ code: 'ASSISTANT_ITERATION_LIMIT' });
    renderPage('/solicitud/ayuda-diseno');
    const composer = screen.getByLabelText(/tu idea o tu siguiente pregunta/i);
    const send = async message => {
      await act(async () => {
        fireEvent.change(composer, { target: { value: message } });
        fireEvent.keyDown(composer, { key: 'Enter', code: 'Enter', charCode: 13 });
      });
    };

    await send('Quiero fabricar una base para celular.');
    await screen.findByText(/n8n no pudo completar la respuesta/i);
    expect(screen.getByLabelText(/¿qué querés fabricar/i)).toHaveValue('Base para celular');
    await send('Una unidad, PETG, largo 15 cm y ancho 3 cm.');
    expect(await screen.findByDisplayValue('Largo 15 cm; ancho 3 cm')).toBeInTheDocument();
    expect(screen.getByLabelText(/cantidad/i)).toHaveValue(1);
    expect(screen.getByLabelText(/material deseado/i)).toHaveValue('PETG');
    expect(screen.queryByRole('button', { name: /revisar el resumen y adjuntar referencias/i })).not.toBeInTheDocument();
    expect(submitQuoteIntake).not.toHaveBeenCalled();
  });

  it('limpia una interpretación previa del bot y no confunde “prepará el resumen para revisarlo” con el uso', async () => {
    automationAction
      .mockResolvedValueOnce({ reply: 'Voy a ordenar la solicitud.', links: [], requestDraft: {
        description: 'Organizador de cables', intendedUse: 'revisarlo', quantity: 1,
      } })
      .mockResolvedValueOnce({ reply: 'Preparé el resumen estructurado.', links: [], requestDraft: {
        description: 'Organizador de cables, una unidad, aproximadamente 15 cm de largo por 3 cm de ancho',
        intendedUse: '', dimensions: 'Largo 15 cm; ancho 3 cm', material: '', quantity: 1, needsDesign: false,
      } });
    renderPage('/solicitud/ayuda-diseno');
    const composer = screen.getByLabelText(/tu idea o tu siguiente pregunta/i);
    fireEvent.change(composer, { target: { value: 'Quiero un organizador de cables, una unidad, aproximadamente 15 cm de largo por 3 cm de ancho.' } });
    fireEvent.keyDown(composer, { key: 'Enter', code: 'Enter', charCode: 13 });
    await screen.findByText('Voy a ordenar la solicitud.');
    expect(screen.getByDisplayValue('revisarlo')).toBeInTheDocument();

    fireEvent.change(composer, { target: { value: 'Prepará el resumen para revisarlo, por favor.' } });
    fireEvent.keyDown(composer, { key: 'Enter', code: 'Enter', charCode: 13 });

    await waitFor(() => expect(screen.getByLabelText(/¿para qué la vas a usar/i)).toHaveValue(''));
    expect(screen.getByLabelText(/qué querés fabricar/i)).toHaveValue('Organizador de cables, una unidad, aproximadamente 15 cm de largo por 3 cm de ancho');
    expect(screen.getByLabelText(/medidas aproximadas/i)).toHaveValue('Largo 15 cm; ancho 3 cm');
    expect(automationAction).toHaveBeenCalledTimes(2);
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
    fireEvent.change(screen.getByLabelText(/medidas aproximadas/i), { target: { value: '15 × 3 × 2' } });
    fireEvent.change(screen.getByLabelText(/unidad de medida/i), { target: { value: 'cm' } });
    const file = new File(['png-data'], 'referencia.png', { type: 'image/png' });
    const model = new File(['solid vertice'], 'pieza.stl', { type: 'model/stl' });
    fireEvent.change(screen.getByLabelText(/fotos o archivos 3D/i), { target: { files: [file, model] } });
    fireEvent.click(await screen.findByRole('button', { name: /revisé el resumen.*enviar al taller/i }));
    await waitFor(() => expect(submitQuoteIntake).toHaveBeenCalledWith(expect.objectContaining({ description: 'Soporte personalizado para teléfono', dimensions: '15 × 3 × 2 cm', sourceType: 'FILE_UPLOAD' }), [file, model], { token: 'session-token' }));
    expect(await screen.findByText(/Solicitud enviada al taller/i)).toBeInTheDocument();
    expect(screen.getByText(/No se generó un precio/i)).toBeInTheDocument();
  });

  it('recupera una respuesta inválida sin duplicar el turno del cliente', async () => {
    automationAction.mockResolvedValueOnce({ reply: null }).mockResolvedValueOnce({ reply: 'Podemos preparar ese soporte.', links: [] });
    renderPage('/solicitud/ayuda-diseno');
    const composer = screen.getByLabelText(/tu idea o tu siguiente pregunta/i);
    fireEvent.change(composer, { target: { value: 'Busco soporte escritorio' } });
    fireEvent.keyDown(composer, { key: 'Enter' });
    const retry = await screen.findByRole('button', { name: /reintentar esta respuesta/i });
    expect(screen.getByRole('alert')).toHaveTextContent('Servicio no disponible');
    fireEvent.click(retry);
    expect(await screen.findByText('Podemos preparar ese soporte.')).toBeInTheDocument();
    expect(screen.getAllByText('Busco soporte escritorio')).toHaveLength(1);
    expect(automationAction.mock.calls[1][1]).toMatchObject({ message: 'Busco soporte escritorio', history: [] });
    expect(submitQuoteIntake).not.toHaveBeenCalled();
  });

  it('dirige al visitante a login para enviar conservando la ruta', async () => {
    automationAction.mockResolvedValueOnce({ reply: 'Organicé el resumen para revisar.', links: [], requestDraft: {
      description: 'Pieza para escritorio', intendedUse: '', dimensions: '', material: '', quantity: 1, needsDesign: false,
    } });
    renderPage('/solicitud/ayuda-diseno');
    const composer = screen.getByLabelText(/tu idea o tu siguiente pregunta/i);
    fireEvent.change(composer, { target: { value: 'Quiero una pieza para escritorio.' } });
    fireEvent.keyDown(composer, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(await screen.findByRole('link', { name: /iniciar sesión para enviar/i })).toHaveAttribute('href', '/login');
    expect(screen.queryByRole('button', { name: /revisé el resumen.*enviar al taller/i })).not.toBeInTheDocument();
    expect(screen.getByText(/tu resumen se conserva/i)).toBeInTheDocument();
  });

  it('tras enviar cierra la conversación y explica correo, aprobación y pago en cuenta', async () => {
    automationAction.mockResolvedValueOnce({ reply: 'Organicé el resumen de tu solicitud.', links: [], requestDraft: {
      description: 'Soporte personalizado', intendedUse: '', dimensions: '', material: '', quantity: 1, needsDesign: false,
    } });
    submitQuoteIntake.mockResolvedValueOnce({ request: { id: 'rq-flow', status: 'PENDING_QUOTE' } });
    renderPage('/solicitud/ayuda-diseno', { user: { id: 'c1', name: 'Cliente', email: 'customer@vertice.test', role: 'customer', status: 'ACTIVE' }, token: 'customer-token' });
    const composer = screen.getByLabelText(/tu idea o tu siguiente pregunta/i);
    fireEvent.change(composer, { target: { value: 'Quiero cotizar un soporte personalizado.' } });
    fireEvent.click(screen.getByRole('button', { name: /enviar pregunta/i }));
    await waitFor(() => expect(automationAction).toHaveBeenCalledTimes(1));
    await screen.findByText(/Organicé el resumen de tu solicitud/);
    fireEvent.click(await screen.findByRole('button', { name: /revisé el resumen.*enviar al taller/i }));
    expect(await screen.findByText('Tu proyecto ya está en el taller.')).toBeInTheDocument();
    expect(screen.queryByLabelText(/tu idea o tu siguiente pregunta/i)).not.toBeInTheDocument();
    expect(screen.getByText(/no necesitás responder el correo para aprobar/i)).toBeInTheDocument();
  });
});
