self.addEventListener('message', (e) => {
  const { type, payload } = e.data;
  if (type === 'interp') {
    const { frames, t } = payload;
    // frames: [{t, drivers:[{id,x,y,...}]}]
    // find surrounding frames
    if (!frames || frames.length === 0) {
      self.postMessage({ type: 'frame', payload: null });
      return;
    }
    let i = 0;
    while (i < frames.length && frames[i].t < t) i++;
    const a = frames[Math.max(0, i - 1)];
    const b = frames[Math.min(frames.length - 1, i)];
    if (!a || !b) {
      self.postMessage({ type: 'frame', payload: (a || b) });
      return;
    }
    const dt = b.t - a.t || 1;
    const alpha = (t - a.t) / dt;
    const drivers = [];
    const mapB = new Map();
    (b.drivers || []).forEach(d => mapB.set(d.id ?? d.driverId ?? d.code, d));
    (a.drivers || []).forEach(ad => {
      const id = ad.id ?? ad.driverId ?? ad.code;
      const bd = mapB.get(id);
      if (bd && ad.x !== undefined && ad.y !== undefined && bd.x !== undefined && bd.y !== undefined) {
        const x = ad.x + (bd.x - ad.x) * alpha;
        const y = ad.y + (bd.y - ad.y) * alpha;
        drivers.push({ id, x, y, name: ad.name ?? bd.name, team: ad.team ?? bd.team });
      } else {
        // fallback to a or b
        const src = bd || ad;
        drivers.push({ id, x: src.x ?? null, y: src.y ?? null, name: src.name, team: src.team });
      }
    });
    self.postMessage({ type: 'frame', payload: { t, drivers } });
  }
});
