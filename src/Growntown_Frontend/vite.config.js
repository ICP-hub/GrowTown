import { fileURLToPath, URL } from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import environment from 'vite-plugin-environment';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the correct path
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export default defineConfig({
  base: '/',
  publicDir: 'public',  // Ensuring static files are served correctly
  build: {
    emptyOutDir: true,
    rollupOptions: {
      external: id => /node_modules/.test(id),
    },
  },
  optimizeDeps: {
    exclude: ['chunk-LH5267NO'],  // Exclude specific dependency
    include: ['react', 'react-dom', '@vitejs/plugin-react'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4943',
        changeOrigin: true,
      },
    },
    watch: {
      usePolling: false,
    },
  },
  plugins: [
    react(),
    environment('all', { prefix: 'CANISTER_' }),
    environment('all', { prefix: 'DFX_' }),
  ],
  resolve: {
    alias: [
      {
        find: 'declarations',
        replacement: fileURLToPath(new URL('../declarations', import.meta.url)),
      },
      {
        find: '@dfinity/identity/lib/cjs/buffer',
        replacement: 'buffer/',
      },
    ],
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
});

