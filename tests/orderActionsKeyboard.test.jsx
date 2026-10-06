import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { OrderActions } from '../src/features/admin/OrderActions.jsx';
import { useAuth } from '../src/hooks/useAuth.js';
import { automationAction } from '../src/services/automationService.js';

jest.mock('../src/hooks/useAuth.js', () => ({ useAuth: jest.fn() }));
jest.mock('../src/services/automationService.js', () => ({ automationAction: jest.fn(), automationError: code => code || 'Error' }));

const admin = { user: { id: 'admin-1', role: 'admin' }, token: 'sim-admin' };
function renderActions(order) {
  useAuth.mockReturnValue(admin);
  return render(<OrderActions order={order} onSaved={jest.fn()} language="es" />);
}

describe('acciones de pedidos Admin', () => {
  afterEach(() => { cleanup(); jest.clearAllMocks(); });

  it('Escape cancela el avance y devuelve el foco al botón que lo abrió', () => {
    renderActions({ id: 'ord-1', status: 'CONFIRMED', paymentStatus: 'PAID', paymentMode: 'DEMO' });
    const trigger = screen.getByRole('button', { name: 'Iniciar producción' });
    fireEvent.click(trigger);
    expect(screen.getByRole('button', { name: 'Confirmar cambio' })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('button', { name: 'Confirmar cambio' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Iniciar producción' })).toHaveFocus();
  });

  it('no permite adelantar un pedido pendiente antes de la revisión del pago', () => {
    renderActions({ id: 'ord-2', status: 'PENDING', paymentStatus: 'UNPAID' });
    expect(screen.getByText(/Pago pendiente: el cliente continúa desde el carrito/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Confirmar pedido' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar pedido' })).toBeInTheDocument();
    expect(screen.queryByText(/SINPE|transferencia bancaria/i)).not.toBeInTheDocument();
  });

  it('permite revisar un comprobante SINPE y confirmar solo con acción administrativa', async () => {
    const onSaved = jest.fn();
    automationAction.mockResolvedValueOnce({ order: { status: 'CONFIRMED', paymentStatus: 'PAID' } });
    useAuth.mockReturnValue(admin);
    render(<OrderActions order={{ id: 'ord-proof', status: 'PENDING', paymentStatus: 'UNPAID', paymentProof: {
      status: 'SUBMITTED', referenceNumber: 'SINPE-1234', sinpePhone: '8888-8888', proofNotes: 'Pago de prueba',
      proofFileName: 'comprobante.png', imageDataUrl: 'data:image/png;base64,abc', submittedAt: '2026-10-05T12:00:00Z',
    } }} onSaved={onSaved} language="es" />);
    expect(screen.getByText('SINPE-1234')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Comprobante adjunto por el cliente' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar pago verificado' }));
    await waitFor(() => expect(automationAction).toHaveBeenCalledWith('/admin/actions/verify-payment', {
      orderId: 'ord-proof', decision: 'CONFIRM', expectedProofSubmittedAt: '2026-10-05T12:00:00Z',
    }, { token: admin.token }));
    await waitFor(() => expect(onSaved).toHaveBeenCalled());
  });

  it('exige un motivo antes de devolver el comprobante al cliente', async () => {
    automationAction.mockResolvedValueOnce({ order: { status: 'PENDING' } });
    useAuth.mockReturnValue(admin);
    renderActions({ id: 'ord-proof', status: 'PENDING', paymentProof: { status: 'SUBMITTED', referenceNumber: 'SINPE-1234', sinpePhone: '8888-8888' } });
    fireEvent.click(screen.getByRole('button', { name: 'Rechazar comprobante' }));
    const submit = screen.getByRole('button', { name: 'Enviar observación' });
    expect(submit).toBeDisabled();
    fireEvent.change(screen.getByLabelText('Motivo para el cliente'), { target: { value: 'Referencia no coincide' } });
    fireEvent.click(submit);
    await waitFor(() => expect(automationAction).toHaveBeenCalledWith('/admin/actions/verify-payment', {
      orderId: 'ord-proof', decision: 'REJECT', notes: 'Referencia no coincide', expectedProofSubmittedAt: null,
    }, { token: admin.token }));
  });

  it('guarda la etapa en el historial y no expone acciones de comprobante bancario', async () => {
    automationAction.mockResolvedValueOnce({ order: { status: 'IN_PRODUCTION' } });
    const onSaved = jest.fn();
    useAuth.mockReturnValue(admin);
    render(<OrderActions order={{ id: 'ord-3', status: 'CONFIRMED', paymentStatus: 'PAID', paymentMode: 'DEMO', updatedAt: '2026-10-05T12:00:00Z' }} onSaved={onSaved} language="es" />);
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar producción' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar cambio' }));
    expect(automationAction).toHaveBeenCalledWith('/admin/actions/order-transition', {
      orderId: 'ord-3', expectedStatus: 'CONFIRMED', expectedUpdatedAt: '2026-10-05T12:00:00Z', nextStatus: 'IN_PRODUCTION', reason: '',
    }, { token: admin.token });
    await waitFor(() => expect(onSaved).toHaveBeenCalled());
    expect(screen.queryByRole('button', { name: /comprobante|SINPE/i })).not.toBeInTheDocument();
  });
});
