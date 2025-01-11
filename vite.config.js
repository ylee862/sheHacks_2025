import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: process.env.PORT || 5000,
    host: '0.0.0.0',
  }
});