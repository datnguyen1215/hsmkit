import { defineConfig } from 'vite';
import { terser } from 'rollup-plugin-terser';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/index.js',
      name: 'hsmkit',
      fileName: format => `hsmkit.${format}.js`,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      plugins: [terser()]
    },
    sourcemap: false,
    minify: 'terser'
  }
});
