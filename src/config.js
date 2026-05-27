export const CONFIG = {
  OPENF1_BASE: 'https://api.openf1.org', // change to your backend URL if self-hosting
  POLL_INTERVAL_MS: 3000,
  RETRY_BASE_MS: 800,
  MAX_RETRIES: 4,
  UI: {
    brandColor: '#8C0D0D',
    defaultCircuit: 'monaco'
  },
  WS: {
    ENABLE: true,
    URL: null // if null, wsClient will derive from OPENF1_BASE (ws:// or wss://)
  }
};
