import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/hsm.js',
      name: 'hsm',
      fileName: () => `hsm.js`,
      formats: ['cjs']
    },
    sourcemap: true,
    minify: false
  }
});
