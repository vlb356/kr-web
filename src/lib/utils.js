export const saveLS = (k, v) => localStorage.setItem(k, JSON.stringify(v));
export const readLS = (k, def = null) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : def;
  } catch {
    return def;
  }
};
