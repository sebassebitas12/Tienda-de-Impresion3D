export function readPreference(key, fallback) {
  try { return window.localStorage.getItem(key) ?? fallback; }
  catch { return fallback; }
}

export function writePreference(key, value) {
  try { window.localStorage.setItem(key, String(value)); }
  catch { /* Preferences still work in memory when browser storage is unavailable. */ }
}
