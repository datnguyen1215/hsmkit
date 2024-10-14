import { defineConfig } from 'vite';
import { terser } from 'rollup-plugin-terser';
import dts from 'vite-plugin-dts';

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
  },
  plugins: [
    dts({
      outputDir: 'dist/types'
    })
  ]
});
