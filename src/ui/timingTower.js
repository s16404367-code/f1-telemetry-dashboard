import { el } from '../utils/dom.js';
import { safeForEach } from '../utils/math.js';

export class TimingTower {
  constructor({ containerId, onDriverSelect }) {
    this.container = document.getElementById(containerId);
    this.onDriverSelect = onDriverSelect;
    this.state = { rows: [] };
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';
    const header = el('div', { class: 'timing-header' }, [
      el('h3', {}, 'Timing Tower'),
      el('small', {}, 'Live gaps and order')
    ]);
    this.list = el('div', { class: 'timing-list' });
    this.container.appendChild(header);
    this.container.appendChild(this.list);
  }

  highlightDriver(driverId) {
    safeForEach(this.list.children, (row) => {
      if (!row.dataset) return;
      row.classList.toggle('highlight', row.dataset.driver === String(driverId));
    });
  }

  update(payload) {
    const rows = this.buildRows(payload);
    this.renderRows(rows);
  }

  buildRows(payload) {
    const locs = payload.locations || {};
    const drivers = Array.isArray(locs.drivers) ? locs.drivers : (Array.isArray(locs) ? locs : []);
    const normalized = [];
    if (Array.isArray(drivers)) {
      drivers.forEach(d => {
        try {
          normalized.push({
            id: d.driverId ?? d.id ?? d.number ?? d.code ?? 'unknown',
            name: d.name ?? d.driverName ?? d.code ?? 'Unknown',
            position: d.position ?? d.pos ?? null,
            gap: d.gap ?? d.timeToLeader ?? null,
            lastLap: d.lastLap ?? null,
            bestLap: d.bestLap ?? null,
            tyre: d.tyreCompound ?? d.tyre ?? null,
            team: d.team ?? d.constructor ?? null,
            pit: d.inPit ?? false
          });
        } catch (e) {
          console.warn('timing buildRows item error', e);
        }
      });
    }
    normalized.sort((a,b) => {
      const pa = a.position ?? 999;
      const pb = b.position ?? 999;
      return pa - pb;
    });
    return normalized;
  }

  renderRows(rows) {
    this.list.innerHTML = '';
    rows.forEach(r => {
      const row = el('div', { class: 'timing-row', 'data-driver': r.id });
      const left = el('div', {}, [
        el('span', { class: 'driver-dot', style: `background:${this.teamColor(r.team)}` }),
        el('span', { style: 'margin-left:8px' }, `${r.position ?? '-'} ${r.name}`)
      ]);
      const right = el('div', {}, [
        el('span', {}, r.gap ?? '-'),
        el('button', { onClick: () => this.onDriverSelect && this.onDriverSelect(r.id) }, 'Focus')
      ]);
      row.appendChild(left);
      row.appendChild(right);
      this.list.appendChild(row);
    });
  }

  teamColor(team) {
    if (!team) return '#888';
    const t = String(team).toLowerCase();
    if (t.includes('ferrari')) return '#DC0000';
    if (t.includes('mercedes')) return '#00D2BE';
    if (t.includes('red bull')) return '#0600ef';
    if (t.includes('mclaren')) return '#FF8700';
    return '#888';
  }
}
