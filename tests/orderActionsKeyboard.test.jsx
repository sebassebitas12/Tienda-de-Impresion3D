import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
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

describe('teclado en confirmaciones inline de pedidos Admin', () => {
  afterEach(() => { cleanup(); jest.clearAllMocks(); });

  it('Escape cancela el avance y devuelve el foco al botón que lo abrió', () => {
    renderActions({ id: 'ord-1', status: 'CONFIRMED' });
    const trigger = screen.getByRole('button', { name: 'Iniciar producción' });
    fireEvent.click(trigger);
    expect(screen.getByRole('button', { name: 'Confirmar cambio' })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('button', { name: 'Confirmar cambio' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Iniciar producción' })).toHaveFocus();
  });

  it('Escape cierra el formulario para observar un comprobante y devuelve el foco al disparador', () => {
    renderActions({ id: 'ord-2', status: 'PENDING', paymentProof: { status: 'SUBMITTED', submittedAt: '2026-10-04T10:00:00Z' } });
    const trigger = screen.getByRole('button', { name: /Observar \/ Rechazar comprobante/i });
    fireEvent.click(trigger);
    expect(screen.getByLabelText(/Motivo de rechazo del comprobante/i)).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByLabelText(/Motivo de rechazo del comprobante/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Observar \/ Rechazar comprobante/i })).toHaveFocus();
  });

  it('exige confirmación manual antes de registrar un comprobante como verificado', async () => {
    renderActions({ id: 'ord-3', status: 'PENDING', paymentProof: { status: 'SUBMITTED', submittedAt: '2026-10-04T10:00:00Z' } });
    const trigger = screen.getByRole('button', { name: 'Confirmar pago y pedido' });
    fireEvent.click(trigger);

    expect(screen.getByText(/no consulta el banco/i)).toBeInTheDocument();
    expect(automationAction).not.toHaveBeenCalled();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByRole('button', { name: 'Confirmar pago y pedido' })).toHaveFocus();
    expect(automationAction).not.toHaveBeenCalled();

    automationAction.mockResolvedValueOnce({});
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar pago y pedido' }));
    fireEvent.click(screen.getByRole('button', { name: 'Registrar verificación' }));

    expect(automationAction).toHaveBeenCalledWith('/admin/actions/verify-payment', expect.objectContaining({ orderId: 'ord-3', decision: 'CONFIRM' }), { token: admin.token });
  });
});
