import { matchesFacet, selectedValues } from './facetFilters.js';

const PHASES = {
  workshop: new Set(['PENDING_QUOTE', 'IN_REVIEW', 'CHANGES_REQUESTED']),
  customer: new Set(['QUOTED', 'AWAITING_APPROVAL']),
  production: new Set(['APPROVED', 'PAID']),
  closed: new Set(['REJECTED', 'EXPIRED', 'CANCELLED']),
};

export const REQUEST_PHASES = ['workshop', 'customer', 'production', 'closed'];

export function getRequestPhase(status) {
  return REQUEST_PHASES.find(phase => PHASES[phase].has(status)) || 'legacy';
}

export function buildAdminRequests({ customPrintRequests = [], users = [] } = {}) {
  const usersById = new Map(users.map(user => [String(user.id), user]));
  const submittedDate = value => {
    const parsed = Date.parse(value || '');
    return Number.isFinite(parsed) ? parsed : 0;
  };
  return [...customPrintRequests]
    .map(request => ({
      ...request,
      phase: getRequestPhase(request.status),
      customerName: usersById.get(String(request.userId))?.name || null,
      customerEmail: usersById.get(String(request.userId))?.email || null,
      reviewStartedByName: usersById.get(String(request.reviewStartedBy))?.name || null,
    }))
    .sort((a, b) => submittedDate(b.submittedAt) - submittedDate(a.submittedAt));
}

export function summarizeRequestPhases(requests = []) {
  return REQUEST_PHASES.reduce((counts, phase) => {
    counts[phase] = requests.filter(request => request.phase === phase).length;
    return counts;
  }, {});
}

export function filterAdminRequests(requests = [], phase = 'all', search = '') {
  const query = search.trim().toLocaleLowerCase();
  return requests.filter(request => {
    const phaseMatches = selectedValues(phase).length === 0 ? request.phase !== 'legacy' : matchesFacet(request.phase, phase);
    const searchable = [request.id, request.customerName, request.fileName, request.description, request.material, request.status]
      .filter(Boolean).join(' ').toLocaleLowerCase();
    return phaseMatches && (!query || searchable.includes(query));
  });
}
