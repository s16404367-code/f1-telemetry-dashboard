import { CONFIG } from '../config.js';

export class WSClient {
  constructor({ onMessage, onOpen, onClose, onError }) {
    this.onMessage = onMessage;
    this.onOpen = onOpen;
    this.onClose = onClose;
    this.onError = onError;
    this.socket = null;
    this.reconnectDelay = 1000;
    this.maxDelay = 30000;
    this.shouldReconnect = true;
  }

  deriveUrl() {
    if (CONFIG.WS.URL) return CONFIG.WS.URL;
    const base = CONFIG.OPENF1_BASE.replace(/^https?:\/\//, '');
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
    return `${protocol}://${base.replace(/\/$/, '')}/ws`;
  }

  connect() {
    if (!CONFIG.WS.ENABLE) return;
    const url = this.deriveUrl();
    try {
      this.socket = new WebSocket(url);
      this.socket.addEventListener('open', (e) => {
        this.reconnectDelay = 1000;
        this.onOpen && this.onOpen(e);
      });
      this.socket.addEventListener('message', (evt) => {
        try {
          const data = JSON.parse(evt.data);
          // Normalize message shape: { type, sessionId, payload }
          const msg = {
            type: data.type || 'unknown',
            sessionId: data.sessionId || data.sid || null,
            payload: data.payload || data.data || data
          };
          this.onMessage && this.onMessage(msg);
        } catch (err) {
          console.warn('ws parse error', err);
        }
      });
      this.socket.addEventListener('close', (e) => {
        this.onClose && this.onClose(e);
        if (this.shouldReconnect) this.scheduleReconnect();
      });
      this.socket.addEventListener('error', (e) => {
        this.onError && this.onError(e);
        // socket will close and trigger reconnect
      });
    } catch (err) {
      console.error('WS connect error', err);
      this.scheduleReconnect();
    }
  }

  scheduleReconnect() {
    setTimeout(() => {
      this.reconnectDelay = Math.min(this.reconnectDelay * 1.8, this.maxDelay);
      this.connect();
    }, this.reconnectDelay + Math.random() * 500);
  }

  close() {
    this.shouldReconnect = false;
    if (this.socket) this.socket.close();
  }
}
