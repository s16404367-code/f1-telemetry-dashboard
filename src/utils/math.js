export function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
export function lerp(a, b, t) { return a + (b - a) * t; }
export function safeForEach(arr, fn) {
  if (!arr || !Array.isArray(arr)) return;
  for (let i = 0; i < arr.length; i++) {
    try { fn(arr[i], i); } catch (e) { console.warn('safeForEach item error', e); }
  }
}
