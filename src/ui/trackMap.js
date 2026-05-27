import { el } from '../utils/dom.js';
import { safeForEach, lerp, clamp } from '../utils/math.js';

export class TrackMap {
  constructor({ containerId, onDriverSelect }) {
    this.container = document.getElementById(containerId);
    this.onDriverSelect = onDriverSelect;
    this.svgRoot = null;
    this.driverElements = new Map();
    this.trackName = 'monaco';
    this.scale = 1;
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';
    const wrapper = el('div', { class: 'track-wrapper' });
    const svgContainer = el('div', { class: 'track-svg-container' });
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'track-svg');
    svg.setAttribute('viewBox', '0 0 2000 1000');
    svgContainer.appendChild(svg);
    wrapper.appendChild(svgContainer);
    this.container.appendChild(wrapper);
    this.svgRoot = svg;
    this.loadTrack(this.trackName);
  }

  async loadTrack(name) {
    this.trackName = name;
    try {
      const res = await fetch(`assets/tracks/${name}.svg`);
      if (!res.ok) throw new Error('Track not found');
      const text = await res.text();
      this.svgRoot.innerHTML = text;
      const path = this.svgRoot.querySelector('.track');
      if (path) path.setAttribute('id', 'trackPath');
      let layer = this.svgRoot.querySelector('#driverLayer');
      if (!layer) {
        layer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        layer.setAttribute('id', 'driverLayer');
        this.svgRoot.appendChild(layer);
      }
    } catch (err) {
      console.error('loadTrack error', err);
      this.svgRoot.innerHTML = '<text x="50" y="50" fill="#fff">Track load error</text>';
    }
  }

  update(payload) {
    const locations = payload.locations || {};
    const drivers = Array.isArray(locations.drivers) ? locations.drivers : (Array.isArray(locations) ? locations : []);
    const positions = [];
    if (Array.isArray(drivers)) {
      drivers.forEach(d => {
        try {
          const pos = d.positionOnTrack ?? (d.trackPosition ? { x: d.trackPosition.x, y: d.trackPosition.y } : (d.x !== undefined && d.y !== undefined ? { x: d.x, y: d.y } : null));
          positions.push({
            id: d.driverId ?? d.id ?? d.number ?? d.code,
            name: d.name ?? d.driverName ?? 'Unknown',
            x: pos ? Number(pos.x) : null,
            y: pos ? Number(pos.y) : null,
            team: d.team ?? d.constructor ?? null,
            gap: d.gap ?? null,
            tyre: d.tyreCompound ?? d.tyre ?? null
          });
        } catch (e) {
          console.warn('track update item error', e);
        }
      });
    }
    this.renderDrivers(positions);
  }

  renderDrivers(list) {
    const layer = this.svgRoot.querySelector('#driverLayer');
    if (!layer) return;
    while (layer.firstChild) layer.removeChild(layer.firstChild);
    list.forEach(d => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('data-driver', d.id);
      const cx = this.normalizeX(d.x);
      const cy = this.normalizeY(d.y);
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', cx);
      circle.setAttribute('cy', cy);
      circle.setAttribute('r', 8);
      circle.setAttribute('fill', this.teamColor(d.team));
      circle.setAttribute('stroke', '#000');
      circle.setAttribute('stroke-width', '1.5');
      circle.style.transition = 'cx 0.2s linear, cy 0.2s linear';
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', cx + 12);
      label.setAttribute('y', cy + 4);
      label.setAttribute('fill', '#fff');
      label.setAttribute('font-size', '14');
      label.textContent = d.name;
      g.appendChild(circle);
      g.appendChild(label);
      g.addEventListener('click', () => this.onDriverSelect && this.onDriverSelect(d.id));
      layer.appendChild(g);
      this.driverElements.set(d.id, { g, circle, label });
    });
  }

  normalizeX(x) {
    if (x == null || isNaN(x)) return 100;
    return Math.round(lerp(100, 1900, this.clamp01((x + 1) / 2)));
  }

  normalizeY(y) {
    if (y == null || isNaN(y)) return 500;
    return Math.round(lerp(100, 900, this.clamp01((y + 1) / 2)));
  }

  clamp01(v){ return Math.max(0, Math.min(1, v)); }

  highlightDriver(driverId) {
    this.driverElements.forEach((v, k) => {
      v.circle.setAttribute('r', k === driverId ? 12 : 8);
      v.circle.setAttribute('stroke-width', k === driverId ? '3' : '1.5');
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
