import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PreferencesProvider } from '../src/app/providers/PreferencesProvider.jsx';
import { AdminActivityPage } from '../src/features/admin/AdminActivity.jsx';
import { getAdminActivity } from '../src/services/adminActivityService.js';

jest.mock('../src/services/adminActivityService.js', () => ({ getAdminActivity: jest.fn() }));

function renderActivity(path = '/admin/actividad') {
  return render(<MemoryRouter initialEntries={[path]}><PreferencesProvider><Routes>
    <Route path="/admin/actividad" element={<AdminActivityPage />} />
  </Routes></PreferencesProvider></MemoryRouter>);
}

describe('historial administrativo', () => {
  afterEach(() => { cleanup(); jest.clearAllMocks(); localStorage.clear(); });

  it('muestra una línea de tiempo real y enlace al detalle relacionado', async () => {
    getAdminActivity.mockResolvedValue([{
      id: 'event-1', entity: 'customPrintRequest', entityId: 'r1', action: 'REQUEST_REVIEW_STARTED',
      fromStatus: 'PENDING_QUOTE', toStatus: 'IN_REVIEW', actorName: 'Sebastián Flores', occurredAt: '2026-09-30T10:00:00Z',
    }]);
    renderActivity();

    expect(await screen.findByRole('heading', { name: 'Se inició la revisión técnica' })).toBeInTheDocument();
    expect(screen.getByText(/Sebastián Flores/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Abrir solicitud' })).toHaveAttribute('href', '/admin/solicitudes/r1');
  });

  it('presenta un vacío honesto cuando el log no tiene eventos', async () => {
    getAdminActivity.mockResolvedValue([]);
    renderActivity();

    expect(await screen.findByText('Todavía no hay actividad registrada.')).toBeInTheDocument();
    expect(screen.queryByRole('list', { name: 'Actividad del taller' })).not.toBeInTheDocument();
  });

  it('envía al servicio el filtro de solicitud de la URL', async () => {
    getAdminActivity.mockResolvedValue([]);
    renderActivity('/admin/actividad?solicitud=r1');

    expect(await screen.findByRole('heading', { name: 'Solicitud r1' })).toBeInTheDocument();
    expect(getAdminActivity).toHaveBeenCalledWith(expect.objectContaining({ requestId: 'r1' }));
    expect(screen.getByRole('link', { name: /Ver toda la actividad/ })).toHaveAttribute('href', '/admin/actividad');
  });
});
