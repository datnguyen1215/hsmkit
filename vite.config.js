import { defineConfig } from 'vite';
import { terser } from 'rollup-plugin-terser';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/hsmjs.js',
      name: 'hsmjs',
      fileName: format => `hsmjs.${format}.js`,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      plugins: [terser()]
    },
    sourcemap: false,
    minify: 'terser'
  }
});
