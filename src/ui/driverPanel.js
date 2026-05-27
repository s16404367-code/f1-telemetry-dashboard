import { el } from '../utils/dom.js';

export class DriverPanel {
  constructor({ containerId }) {
    this.container = document.getElementById(containerId);
    this.focused = null;
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';
    const header = el('h3', {}, 'Driver Focus');
    this.content = el('div', { class: 'driver-content' }, 'Select a driver to view details');
    this.container.appendChild(header);
    this.container.appendChild(this.content);
  }

  focusDriver(driverId) {
    this.focused = driverId;
    this.content.innerHTML = `<div>Loading driver ${driverId}...</div>`;
  }

  update(payload) {
    if (!this.focused) return;
    const locs = payload.locations || {};
    const drivers = Array.isArray(locs.drivers) ? locs.drivers : (Array.isArray(locs) ? locs : []);
    const d = drivers.find(x => (x.driverId ?? x.id ?? x.number ?? x.code) == this.focused);
    if (!d) {
      this.content.innerHTML = `<div>No data for ${this.focused}</div>`;
      return;
    }
    const html = `
      <div><strong>${d.name ?? d.driverName ?? 'Unknown'}</strong> (#${d.number ?? '-'})</div>
      <div>Team: ${d.team ?? d.constructor ?? '-'}</div>
      <div>Position: ${d.position ?? '-'}</div>
      <div>Gap to leader: ${d.gap ?? '-'}</div>
      <div>Gap to ahead: ${d.gapToAhead ?? '-'}</div>
      <div>Tyre: ${d.tyreCompound ?? d.tyre ?? '-'}</div>
      <div>Tyre age: ${d.tyreAge ?? '-'}</div>
      <div>Pit: ${d.inPit ? 'Yes' : 'No'}</div>
      <div>Current lap: ${d.currentLap ?? '-'}</div>
      <div>Last lap: ${d.lastLap ?? '-'}</div>
      <div>Best lap: ${d.bestLap ?? '-'}</div>
    `;
    this.content.innerHTML = html;
  }
}
