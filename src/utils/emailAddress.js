const RESERVED_EMAIL_DOMAINS = new Set(['example.com', 'example.net', 'example.org', 'invalid', 'localhost', 'test']);

export function isDeliverableEmail(value) {
  const email = String(value || '').trim();
  const parts = email.split('@');
  if (parts.length !== 2 || !/^[^\s@]+$/.test(parts[0]) || !/^[^\s@]+\.[^\s@]+$/.test(parts[1])) return false;
  const domain = parts[1].toLowerCase();
  return !RESERVED_EMAIL_DOMAINS.has(domain) && ![...RESERVED_EMAIL_DOMAINS].some(reserved => domain.endsWith(`.${reserved}`));
}
