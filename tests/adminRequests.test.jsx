import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PreferencesProvider } from '../src/app/providers/PreferencesProvider.jsx';
import { AdminRequestDetailPage, AdminRequestsPage } from '../src/features/admin/AdminRequests.jsx';
import { getAdminRequestsData } from '../src/services/adminOverviewService.js';
import { formatCRC } from '../src/utils/money.js';
import { buildAdminRequests, filterAdminRequests, getRequestPhase, summarizeRequestPhases } from '../src/utils/adminRequests.js';

jest.mock('../src/services/adminOverviewService.js', () => ({ getAdminRequestsData: jest.fn() }));

const rows = [
  { id: 'r1', userId: 'u1', status: 'IN_REVIEW', sourceType: 'FILE', fileName: 'soporte.stl', material: 'PETG', quantity: 4, submittedAt: '2026-09-05T10:00:00Z' },
  { id: 'r2', userId: 'u2', status: 'QUOTED', sourceType: 'DESIGN_HELP', description: 'Pieza universitaria', material: 'PLA', quantity: 2, quotedPrice: 38000, currency: 'CRC', submittedAt: '2026-09-04T10:00:00Z' },
  { id: 'r3', userId: 'u1', status: 'SUBMITTED', submittedAt: '2026-09-03T10:00:00Z' },
];
const users = [{ id: 'u1', name: 'Ana Rodríguez' }, { id: 'u2', name: 'Carlos Mora' }];

function renderRoute(path, component) {
  return render(<MemoryRouter initialEntries={[path]}><PreferencesProvider><Routes>
    <Route path="/admin/solicitudes" element={<AdminRequestsPage />} />
    <Route path="/admin/solicitudes/:id" element={component} />
  </Routes></PreferencesProvider></MemoryRouter>);
}

describe('solicitudes administrativas', () => {
  afterEach(() => { cleanup(); jest.clearAllMocks(); localStorage.clear(); });

  it('agrupa estados oficiales, mantiene SUBMITTED separado y permite filtrar por búsqueda', () => {
    const requests = buildAdminRequests({ customPrintRequests: rows, users });
    expect(getRequestPhase('SUBMITTED')).toBe('legacy');
    expect(summarizeRequestPhases(requests)).toEqual({ workshop: 1, customer: 1, production: 0, closed: 0 });
    expect(filterAdminRequests(requests, 'all')).toHaveLength(2);
    expect(filterAdminRequests(requests, 'all', 'soporte')).toHaveLength(1);
    expect(filterAdminRequests(requests, 'legacy')).toHaveLength(1);
  });

  it('filtra el conjunto real desde la leyenda del gráfico y expone el legado aparte', async () => {
    getAdminRequestsData.mockResolvedValue({ customPrintRequests: rows, users });
    renderRoute('/admin/solicitudes', <AdminRequestsPage />);

    const legend = await screen.findByRole('group', { name: 'Mapa de solicitudes' });
    fireEvent.click(within(legend).getByRole('button', { name: /Espera del cliente/ }));

    expect(await screen.findByText('Pieza universitaria')).toBeInTheDocument();
    expect(screen.queryByText('soporte.stl')).not.toBeInTheDocument();
    expect(screen.getByText(/1 Por aclarar/)).toBeInTheDocument();
  });

  it('no presenta un importe para PENDING_QUOTE aunque el dato contenga un campo heredado', async () => {
    getAdminRequestsData.mockResolvedValue({
      customPrintRequests: [{ ...rows[0], status: 'PENDING_QUOTE', quotedPrice: 99999, currency: 'CRC' }], users,
    });
    renderRoute('/admin/solicitudes/r1', <AdminRequestDetailPage />);

    await screen.findByRole('heading', { name: 'soporte.stl' });
    expect(screen.getByText('Todavía no hay una cotización final registrada.')).toBeInTheDocument();
    expect(screen.queryByText('₡99 999')).not.toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Flujo de cotización' })).toBeInTheDocument();
  });

  it('presenta una cotización CRC real en una solicitud cotizada', async () => {
    getAdminRequestsData.mockResolvedValue({ customPrintRequests: [rows[1]], users });
    renderRoute('/admin/solicitudes/r2', <AdminRequestDetailPage />);

    await screen.findByRole('heading', { name: 'Pieza universitaria' });
    const amount = document.querySelector('.admin-quote-panel__amount');
    expect(amount).toBeInTheDocument();
    expect(amount.textContent).toBe(formatCRC(38000));
  });

});
