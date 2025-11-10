// Pequeño wrapper sobre localStorage con claves namespaced
const NS = "kr";

function get(key, fallback) {
  try {
    const raw = localStorage.getItem(`${NS}:${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function set(key, value) {
  localStorage.setItem(`${NS}:${key}`, JSON.stringify(value));
}
function upd(key, updater, fallback) {
  const current = get(key, fallback);
  const next = updater(current ?? fallback);
  set(key, next);
  return next;
}
export default { get, set, upd };

