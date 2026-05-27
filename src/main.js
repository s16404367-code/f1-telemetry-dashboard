import { App } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = new App({
    root: document.getElementById('app'),
    endpoints: {
      base: 'https://api.openf1.org' // default public OpenF1; change in src/config.js for custom backend
    }
  });
  app.start();
});
