import 'dotenv/config';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  const { env } = process;

  return {
    plugins: [react()],
    build: {
      outDir: '../backend/build/dist',
      emptyOutDir: true,
    },
    server: {
      port: env.VITE_FRONTEND_PORT,
      proxy: {
        '^/(login|cadastro|api)': {
          target: [env.VITE_BACKEND_URL, env.VITE_BACKEND_PORT].join(':'),
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
});