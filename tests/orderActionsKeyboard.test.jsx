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

  it('no permite adelantar un pedido pendiente sin que el cliente registre el pago DEMO', () => {
    renderActions({ id: 'ord-2', status: 'PENDING', paymentStatus: 'UNPAID' });
    expect(screen.getByText(/Pago DEMO pendiente: el cliente lo registra desde su cuenta/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Confirmar pedido' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar pedido' })).toBeInTheDocument();
    expect(screen.queryByText(/SINPE|transferencia bancaria/i)).not.toBeInTheDocument();
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
