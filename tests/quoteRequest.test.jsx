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

  it('ofrece una acción visible para pedir al asistente que prepare el resumen', async () => {
    automationAction
      .mockResolvedValueOnce({ reply: 'Entendí la idea. ¿Qué largo aproximado tendría el brazo?', links: [] })
      .mockResolvedValueOnce({ reply: 'Preparé el borrador para revisar; no se envió.', links: [], requestDraft: {
        description: 'Brazo robótico para simulación de banda transportadora', intendedUse: 'Simulación', dimensions: '', material: '', quantity: 1, needsDesign: true,
      } });
    renderPage('/solicitud/ayuda-diseno');
    const composer = screen.getByLabelText(/tu idea o tu siguiente pregunta/i);
    fireEvent.change(composer, { target: { value: 'Quiero cotizar solo el brazo de una banda transportadora para una simulación.' } });
    fireEvent.keyDown(composer, { key: 'Enter', code: 'Enter', charCode: 13 });
    await screen.findByText(/¿qué largo aproximado tendría el brazo/i);
    fireEvent.click(screen.getByRole('button', { name: /preparar resumen para revisar/i }));
    expect(await screen.findByDisplayValue('Brazo robótico para simulación de banda transportadora')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /revisar el resumen y adjuntar referencias/i })).toBeInTheDocument();
    expect(automationAction).toHaveBeenCalledTimes(2);
    expect(automationAction.mock.calls[1][1].message).toMatch(/prepará el resumen/i);
    expect(submitQuoteIntake).not.toHaveBeenCalled();
  });

  it('incluye los datos actuales del formulario y permite revisar un borrador local si n8n omite requestDraft', async () => {
    const customer = { user: { id: 'customer-1', name: 'Cliente', email: 'customer@vertice.test', role: 'customer', status: 'ACTIVE' }, token: 'session-token' };
    const draft = {
      description: 'Brazo robótico para una simulación de banda transportadora',
      intendedUse: 'Simulación académica de una banda', dimensions: 'Largo 15 cm; ancho 3 cm',
      dimensionsUnit: 'cm', material: 'PETG', quantity: 1, needsDesign: true, referenceUrl: '',
    };
    localStorage.setItem('vertice.quote.draft', JSON.stringify({ draft, assistantDraftReady: false,
      manuallyEditedFields: ['description', 'intendedUse', 'dimensions', 'material', 'needsDesign'], savedAt: Date.now() }));
    automationAction.mockResolvedValue({ reply: 'Puedo ayudarte a revisar esos datos.', links: [], requestDraft: null });
    renderPage('/solicitud/ayuda-diseno', customer);
    await waitFor(() => expect(screen.queryByText(/Cuando el asistente prepare el borrador/i)).not.toBeInTheDocument());

    const composer = screen.getByLabelText(/tu idea o tu siguiente pregunta/i);
    fireEvent.change(composer, { target: { value: 'Prepará el resumen para revisar.' } });
    fireEvent.keyDown(composer, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(await screen.findByText(/borrador con tus mensajes y los datos del formulario/i)).toBeInTheDocument();
    expect(screen.getByText(/BORRADOR LOCAL · REVISÁ LOS DATOS/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/¿qué querés fabricar/i)).toHaveValue(draft.description);
    expect(screen.getByLabelText(/¿para qué la vas a usar/i)).toHaveValue(draft.intendedUse);
    expect(screen.getByRole('button', { name: /revisé el resumen.*enviar al taller/i })).toBeEnabled();
    expect(automationAction).toHaveBeenCalledWith('/assistants/chat', expect.objectContaining({
      mode: 'quote', prepareDraft: true,
      draftContext: expect.objectContaining({ values: expect.objectContaining({ description: draft.description, material: 'PETG' }) }),
    }), expect.objectContaining({ token: 'session-token' }));
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

  it('permite alternar entre formulario directo y asistente con el selector de modo', () => {
    renderPage('/solicitud/ayuda-diseno');
    const directTab = screen.getByRole('link', { name: /formulario directo \(modelo o archivo\)/i });
    expect(directTab).toHaveAttribute('href', '/solicitud/archivo');
    const assistantTab = screen.getByRole('link', { name: /con asistente ia \(ayuda de diseño\)/i });
    expect(assistantTab).toHaveAttribute('href', '/solicitud/ayuda-diseno');
    expect(assistantTab).toHaveAttribute('aria-current', 'page');
  });

  it('valida medidas inválidas al pulsar enviar y ofrece limpiarlas con un botón', async () => {
    renderPage('/solicitud/archivo', { user: { id: 'c1', name: 'Cliente', email: 'c@test.com', role: 'customer', status: 'ACTIVE' }, token: 'token' });
    fireEvent.change(screen.getByLabelText(/¿qué querés fabricar/i), { target: { value: 'Soporte para celular' } });
    const dimInput = screen.getByLabelText(/medidas aproximadas/i);
    fireEvent.change(dimInput, { target: { value: 'EWQEWQ' } });

    // Error visible en pantalla
    expect(screen.getByRole('alert')).toHaveTextContent(/solo medidas legibles/i);

    // Al hacer click en enviar, no se queda muerto: muestra el mensaje de error y enfoca el campo
    const submitBtn = await screen.findByRole('button', { name: /revisé el resumen · enviar al taller/i });
    fireEvent.click(submitBtn);
    expect(dimInput).toHaveFocus();

    // Botón de limpiar medidas sin definir
    const clearBtn = screen.getByRole('button', { name: /dejar medidas sin definir/i });
    fireEvent.click(clearBtn);
    expect(dimInput).toHaveValue('');
    expect(screen.queryByText(/solo medidas legibles/i)).not.toBeInTheDocument();
  });

  it('permite al asistente en chat editar y actualizar campos previamente tocados por el usuario', async () => {
    automationAction
      .mockResolvedValueOnce({
        reply: 'Listo: cambié la cantidad a 5 y el material a PETG.',
        links: [],
        requestDraft: {
          description: 'Brazo robótico de prueba',
          intendedUse: 'Simulación',
          dimensions: '15 × 8 cm',
          material: 'PETG',
          quantity: 5,
          needsDesign: false,
        },
      });

    renderPage('/solicitud/ayuda-diseno', { user: { id: 'c1', name: 'Cliente', email: 'c@test.com', role: 'customer', status: 'ACTIVE' }, token: 'token' });

    // Usuario escribió manualmente primero en el formulario
    const descField = screen.getByLabelText(/¿qué querés fabricar/i);
    fireEvent.change(descField, { target: { value: 'QWEQWEW' } });
    const qtyField = screen.getByLabelText(/cantidad/i);
    fireEvent.change(qtyField, { target: { value: '3' } });

    // Usuario le dice al bot que lo corrija
    const composer = screen.getByLabelText(/tu idea o tu siguiente pregunta/i);
    fireEvent.change(composer, { target: { value: 'Cambiá la cantidad a 5, el material a PETG y la descripción a Brazo robótico de prueba' } });
    fireEvent.keyDown(composer, { key: 'Enter', code: 'Enter', charCode: 13 });

    // Los campos del formulario deben haberse actualizado con lo que indicó el bot
    expect(await screen.findByDisplayValue('Brazo robótico de prueba')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
    expect(screen.getByLabelText(/material deseado/i)).toHaveValue('PETG');
    expect(screen.getByDisplayValue('15 × 8 cm')).toBeInTheDocument();
  });
});
