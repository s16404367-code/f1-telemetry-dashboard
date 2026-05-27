import { OpenF1 } from './api/openf1.js';
import { WSClient } from './api/wsClient.js';
import { UI } from './ui/ui.js';
import { ReplayEngine } from './replay/replayEngine.js';
import { CONFIG } from './config.js';

export class App {
  constructor(opts = {}) {
    this.root = opts.root;
    this.endpoints = opts.endpoints || { base: CONFIG.OPENF1_BASE };
    this.ui = new UI({ root: this.root, onSelectSession: this.onSelectSession.bind(this), onModeChange: this.onModeChange.bind(this) });
    this.replay = new ReplayEngine({ ui: this.ui, openf1: OpenF1 });
    this.mode = 'live';
    this.currentSessionId = null;
    this.pollHandle = null;
    this.ws = null;
  }

  start() {
    this.ui.renderInitial();
    this.ui.setStatus('Ready');
    this.attachControls();
  }

  attachControls() {
    const connectBtn = document.getElementById('connectBtn');
    const modeSelect = document.getElementById('modeSelect');
    const wsToggle = document.getElementById('wsToggle');

    connectBtn.addEventListener('click', async () => {
      const sessionInput = document.getElementById('sessionSelect').value.trim();
      if (!sessionInput) {
        this.ui.setStatus('Enter a session id or choose a session from the list');
        return;
      }
      this.currentSessionId = sessionInput;
      if (this.mode === 'live') await this.startLive(sessionInput, wsToggle.checked);
      else await this.startHistorical(sessionInput);
    });

    modeSelect.addEventListener('change', (e) => {
      this.mode = e.target.value;
      this.ui.onModeChange(this.mode);
    });
  }

  async startLive(sessionId, useWS) {
    this.stopPolling();
    this.closeWS();
    this.ui.setStatus('Connecting to live session ' + sessionId);
    if (useWS && CONFIG.WS.ENABLE) {
      this.ws = new WSClient({
        onOpen: () => this.ui.setStatus('WebSocket connected'),
        onClose: () => this.ui.setStatus('WebSocket disconnected, falling back to polling'),
        onError: (e) => console.warn('WS error', e),
        onMessage: (msg) => {
          if (msg && msg.payload) {
            // If payload contains location/intervals, pass to UI
            if (msg.type === 'location' || msg.type === 'intervals') {
              this.ui.updateLive({ locations: msg.payload.drivers ? { drivers: msg.payload.drivers } : msg.payload, intervals: msg.payload });
            } else {
              // generic update
              this.ui.updateLive({ locations: msg.payload.drivers ? { drivers: msg.payload.drivers } : msg.payload });
            }
          }
        }
      });
      this.ws.connect();
    }
    await this.pollLive(sessionId);
    this.pollHandle = setInterval(() => this.pollLive(sessionId).catch(e => {
      console.warn('pollLive error', e);
      this.ui.setStatus('Live poll error');
    }), CONFIG.POLL_INTERVAL_MS);
  }

  closeWS() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  stopPolling() {
    if (this.pollHandle) {
      clearInterval(this.pollHandle);
      this.pollHandle = null;
    }
  }

  async pollLive(sessionId) {
    try {
      const [locations, intervals, laps, stints, weather, rc, radio] = await Promise.allSettled([
        OpenF1.location(sessionId, { latest: true }),
        OpenF1.intervals(sessionId, { latest: true }),
        OpenF1.laps(sessionId),
        OpenF1.stints(sessionId),
        OpenF1.weather(sessionId),
        OpenF1.raceControl(sessionId),
        OpenF1.teamRadio(sessionId)
      ]);
      const payload = {
        locations: locations.status === 'fulfilled' ? locations.value : null,
        intervals: intervals.status === 'fulfilled' ? intervals.value : null,
        laps: laps.status === 'fulfilled' ? laps.value : null,
        stints: stints.status === 'fulfilled' ? stints.value : null,
        weather: weather.status === 'fulfilled' ? weather.value : null,
        raceControl: rc.status === 'fulfilled' ? rc.value : null,
        teamRadio: radio.status === 'fulfilled' ? radio.value : null,
        timestamp: Date.now()
      };
      this.ui.updateLive(payload);
    } catch (err) {
      console.error('pollLive top error', err);
      this.ui.setStatus('Live update failed');
    }
  }

  async startHistorical(sessionId) {
    this.stopPolling();
    this.closeWS();
    this.ui.setStatus('Loading historical session ' + sessionId);
    try {
      await this.replay.loadSession(sessionId);
      this.ui.setStatus('Historical session loaded');
    } catch (err) {
      console.error('startHistorical error', err);
      this.ui.setStatus('Failed to load historical session');
    }
  }

  onSelectSession(sessionId) {
    document.getElementById('sessionSelect').value = sessionId;
  }

  onModeChange(mode) {
    this.mode = mode;
    if (mode === 'live') {
      this.ui.setStatus('Switched to Live mode');
    } else {
      this.ui.setStatus('Switched to Historical mode');
    }
  }
}
