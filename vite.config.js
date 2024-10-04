import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'hsm',
      fileName: format => `hsm.${format}`,
      formats: ['es', 'cjs']
    },
    sourcemap: true,
    minify: false
  }
});
