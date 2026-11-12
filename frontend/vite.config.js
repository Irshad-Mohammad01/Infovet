import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // lucide-react is a barrel export. Pre-bundling it keeps the dev server
    // from serving a module request per icon.
    include: ['lucide-react'],
  },
  server: {
    // In development the API is proxied, so the browser only ever talks to
    // :5173. Same-origin requests mean no CORS preflight and no API base URL to
    // configure locally. In production set VITE_API_URL instead (see .env.example).
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/inquiries': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Split rarely-changing vendor code from app code so it stays cached
        // across deploys, and keep the icon set out of the react chunk.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          icons: ['lucide-react'],
        },
      },
    },
  },
});
