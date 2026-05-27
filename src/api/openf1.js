import { CONFIG } from '../config.js';
import { safeFetch } from '../utils/fetcher.js';

const BASE = CONFIG.OPENF1_BASE.replace(/\/$/, '');

function buildUrl(path) {
  if (!path) throw new Error('openf1.buildUrl requires path');
  return `${BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}

export const OpenF1 = {
  async sessions(season) {
    const url = buildUrl(`/sessions${season ? `?season=${season}` : ''}`);
    return safeFetch(url);
  },

  async drivers() {
    return safeFetch(buildUrl('/drivers'));
  },

  async location(sessionId, opts = {}) {
    const q = opts.latest ? '?latest=true' : '';
    return safeFetch(buildUrl(`/location/${encodeURIComponent(sessionId)}${q}`));
  },

  async intervals(sessionId, opts = {}) {
    const q = opts.latest ? '?latest=true' : '';
    return safeFetch(buildUrl(`/intervals/${encodeURIComponent(sessionId)}${q}`));
  },

  async laps(sessionId) {
    return safeFetch(buildUrl(`/laps/${encodeURIComponent(sessionId)}`));
  },

  async stints(sessionId) {
    return safeFetch(buildUrl(`/stints/${encodeURIComponent(sessionId)}`));
  },

  async weather(sessionId) {
    return safeFetch(buildUrl(`/weather/${encodeURIComponent(sessionId)}`));
  },

  async raceControl(sessionId) {
    return safeFetch(buildUrl(`/race_control/${encodeURIComponent(sessionId)}`));
  },

  async teamRadio(sessionId) {
    return safeFetch(buildUrl(`/team_radio/${encodeURIComponent(sessionId)}`));
  }
};
