import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      // React Native primitives are stubbed as DOM elements so the components'
      // own logic can be tested without a native runtime. This exercises our
      // code, not React Native's renderer.
      'react-native': fileURLToPath(new URL('./test/react-native-stub.tsx', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
  },
});
