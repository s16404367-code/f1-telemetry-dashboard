import { CONFIG } from '../config.js';

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

export async function safeFetch(url, opts = {}, retries = 0) {
  const max = CONFIG.MAX_RETRIES;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(url, { ...opts, cache: 'no-store', signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) {
      const text = await res.text().catch(()=>null);
      const err = new Error(`HTTP ${res.status} ${res.statusText}`);
      err.status = res.status;
      err.body = text;
      throw err;
    }
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await res.json();
    } else {
      return await res.text();
    }
  } catch (err) {
    if (retries < max) {
      const backoff = CONFIG.RETRY_BASE_MS * Math.pow(2, retries);
      await sleep(backoff + Math.random() * 200);
      return safeFetch(url, opts, retries + 1);
    }
    console.error('safeFetch failed', url, err);
    throw err;
  }
}
