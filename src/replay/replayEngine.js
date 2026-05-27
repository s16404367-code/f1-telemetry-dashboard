import { OpenF1 } from '../api/openf1.js';

export class ReplayEngine {
  constructor({ ui, openf1 = OpenF1 }) {
    this.ui = ui;
    this.openf1 = openf1;
    this.sessionId = null;
    this.timeline = [];
    this.duration = 0;
    this.playHandle = null;
    this.playbackRate = 1;
    this.currentTime = 0;
    this.isPlaying = false;
    this.worker = new Worker(new URL('./worker.interp.js', import.meta.url), { type: 'module' });
    this.worker.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'frame') {
        const frame = e.data.payload;
        if (frame) {
          this.ui.updateLive({ locations: { drivers: frame.drivers } });
        }
      }
    });
    this.ui.onPlay = this.play.bind(this);
    this.ui.onPause = this.pause.bind(this);
    this.ui.onScrub = this.seekPercent.bind(this);
    this.ui.onSpeedChange = this.setSpeed.bind(this);
  }

  async loadSession(sessionId) {
    this.sessionId = sessionId;
    const [intervals, locations, laps, stints, weather] = await Promise.all([
      this.openf1.intervals(sessionId).catch(e => { console.warn('intervals fail', e); return null; }),
      this.openf1.location(sessionId).catch(e => { console.warn('location fail', e); return null; }),
      this.openf1.laps(sessionId).catch(e => { console.warn('laps fail', e); return null; }),
      this.openf1.stints(sessionId).catch(e => { console.warn('stints fail', e); return null; }),
      this.openf1.weather(sessionId).catch(e => { console.warn('weather fail', e); return null; })
    ]);
    if (Array.isArray(intervals) && intervals.length) {
      this.timeline = intervals.map((it) => ({ t: it.timestamp ?? it.t ?? 0, drivers: it.drivers ?? it.positions ?? [] }));
      this.duration = this.timeline[this.timeline.length - 1]?.t ?? this.timeline.length;
    } else if (locations && Array.isArray(locations.frames)) {
      this.timeline = locations.frames.map(f => ({ t: f.t ?? f.timestamp ?? 0, drivers: f.drivers ?? f.data ?? [] }));
      this.duration = this.timeline[this.timeline.length - 1]?.t ?? this.timeline.length;
    } else if (Array.isArray(laps) && laps.length) {
      this.timeline = laps.map(l => ({ t: l.timestamp ?? l.t ?? 0, drivers: l.drivers ?? [] }));
      this.duration = this.timeline[this.timeline.length - 1]?.t ?? this.timeline.length;
    } else {
      throw new Error('No timeline data available for session');
    }
    this.currentTime = 0;
    this.updateUIForTime(0);
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    const step = (now) => {
      if (!this.isPlaying) return;
      this.currentTime += 1000 * this.playbackRate;
      if (this.currentTime > this.duration) {
        this.currentTime = this.duration;
        this.pause();
      }
      this.updateUIForTime(this.currentTime);
      this.playHandle = setTimeout(() => step(), 1000 / 30);
    };
    step();
  }

  pause() {
    this.isPlaying = false;
    if (this.playHandle) {
      clearTimeout(this.playHandle);
      this.playHandle = null;
    }
  }

  setSpeed(rate) {
    this.playbackRate = rate;
  }

  seekPercent(percent) {
    const p = Math.max(0, Math.min(100, percent));
    this.currentTime = (p / 100) * this.duration;
    this.updateUIForTime(this.currentTime);
  }

  updateUIForTime(ms) {
    if (!this.timeline || !this.timeline.length) return;
    // send frames to worker for interpolation
    this.worker.postMessage({ type: 'interp', payload: { frames: this.timeline, t: ms } });
  }
}
