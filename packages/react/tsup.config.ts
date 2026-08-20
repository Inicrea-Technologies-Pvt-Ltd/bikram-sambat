import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: 'es2020',
  external: ['react', 'react-dom', '@inicrea/bikram-sambat-core'],
  // The "use client" directive is added by scripts/add-use-client.mjs after
  // the build: a banner here is stripped during bundling.
  outExtension: ({ format }) => ({ js: format === 'cjs' ? '.cjs' : '.js' }),
});
