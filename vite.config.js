import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Multi-page Vite config — each HTML file is an entry point.
// Static assets (images, _headers, _redirects, robots.txt, favicon.svg) live in /public
// and are copied verbatim to dist/ at build time.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
    rollupOptions: {
      input: {
        main:     resolve(__dirname, 'index.html'),
        signin:   resolve(__dirname, 'signin.html'),
        privacy:   resolve(__dirname, 'privacy.html'),
        careers:   resolve(__dirname, 'careers.html'),
        manifesto: resolve(__dirname, 'manifesto.html'),
        notfound:  resolve(__dirname, '404.html'),
      },
    },
  },
});
