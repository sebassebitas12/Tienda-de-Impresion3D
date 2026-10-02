export function sessionActor(header, data, now = Date.now()) {
  const token = String(header || '').replace(/^Bearer\s+/i, '');
  if (!token.startsWith('sim.v1.')) return null;
  try {
    const payload = JSON.parse(atob(token.slice(7).replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.kind !== 'SIMULATED_JWT' || !Number.isFinite(payload.exp) || payload.exp * 1000 <= now) return null;
    return data.users?.find(user => String(user.id) === String(payload.sub) && user.role === payload.role && user.status === 'ACTIVE') || null;
  } catch { return null; }
}
