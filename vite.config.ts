import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from '@sentry/vite-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ...(process.env.VITE_SENTRY_AUTH_TOKEN
      ? [
        sentryVitePlugin({
          org: process.env.VITE_SENTRY_ORG || '',
          project: process.env.VITE_SENTRY_PROJECT || '',
          authToken: process.env.VITE_SENTRY_AUTH_TOKEN,
          telemetry: false,
          sourcemaps: {
            assets: './dist/**',
            ignore: ['node_modules/**'],
          },
          release: {
            name: process.env.VITE_RELEASE_VERSION,
            deploy: {
              env: process.env.NODE_ENV,
            },
          },
        }),
      ]
      : []),
  ],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'sentry-vendor': ['@sentry/react'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
