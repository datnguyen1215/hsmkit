// generate config file for library building

import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'hsm',
      fileName: format => `hsm.${format}`,
      formats: ['es', 'cjs']
    },
    sourcemap: true,
    minify: false,
  }
});
