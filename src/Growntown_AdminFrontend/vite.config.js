import { fileURLToPath, URL } from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import environment from 'vite-plugin-environment';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

export default defineConfig({
  build: {
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  publicDir: 'public', 
  server: {
    port: 3001,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
  ],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(
          new URL("../declarations", import.meta.url)
        ),
      },
      {
        find: '@dfinity/identity/lib/cjs/buffer',
        replacement: 'buffer/',
      },
      {
        find: 'stream',
        replacement: 'stream-browserify',
      },
      {
        find: 'crypto',
        replacement: 'crypto-browserify',
      },
      {
        find: 'vm',
        replacement: 'vm-browserify',
      },
      {
        find: 'process',
        replacement: 'process/browser',
      },
      {
        find: 'util',
        replacement: 'util/',
      },
    ],
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
});
