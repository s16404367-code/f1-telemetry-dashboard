import { TimingTower } from './timingTower.js';
import { TrackMap } from './trackMap.js';
import { DriverPanel } from './driverPanel.js';

export class UI {
  constructor({ root, onSelectSession, onModeChange }) {
    this.root = root;
    this.onSelectSession = onSelectSession;
    this.onModeChange = onModeChange;
    this.timing = new TimingTower({ containerId: 'timingTower', onDriverSelect: this.onDriverSelect.bind(this) });
    this.track = new TrackMap({ containerId: 'trackMap', onDriverSelect: this.onDriverSelect.bind(this) });
    this.driverPanel = new DriverPanel({ containerId: 'driverPanel' });
    this.replayControlsEl = null;
  }

  renderInitial() {
    this.timing.render();
    this.track.render();
    this.driverPanel.render();
    this.renderReplayControls();
  }

  renderReplayControls() {
    const el = document.getElementById('replayControls');
    el.innerHTML = '';
    const scrub = document.createElement('input');
    scrub.type = 'range';
    scrub.className = 'scrubber';
    scrub.min = 0;
    scrub.max = 100;
    scrub.value = 0;
    scrub.addEventListener('input', (e) => {
      const val = Number(e.target.value);
      this.onScrub && this.onScrub(val);
    });

    const speed = document.createElement('div');
    speed.className = 'speed-controls';
    ['0.25','0.5','1','2','4'].forEach(s => {
      const b = document.createElement('button');
      b.textContent = s + 'x';
      b.addEventListener('click', () => this.onSpeedChange && this.onSpeedChange(Number(s)));
      speed.appendChild(b);
    });

    const play = document.createElement('button');
    play.textContent = 'Play';
    play.addEventListener('click', () => this.onPlay && this.onPlay());

    const pause = document.createElement('button');
    pause.textContent = 'Pause';
    pause.addEventListener('click', () => this.onPause && this.onPause());

    el.appendChild(play);
    el.appendChild(pause);
    el.appendChild(scrub);
    el.appendChild(speed);
    this.replayControlsEl = el;
  }

  setStatus(text) {
    const sb = document.getElementById('statusBar');
    if (sb) sb.textContent = text;
  }

  updateLive(payload) {
    this.timing.update(payload);
    this.track.update(payload);
    this.driverPanel.update(payload);
  }

  onModeChange(mode) {
    if (this.onModeChange) this.onModeChange(mode);
  }

  onDriverSelect(driverId) {
    this.driverPanel.focusDriver(driverId);
    this.track.highlightDriver(driverId);
    this.timing.highlightDriver(driverId);
  }
}
