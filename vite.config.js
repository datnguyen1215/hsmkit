import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/hsmjs.js',
      name: 'hsmjs',
      fileName: () => `hsmjs.js`,
      formats: ['cjs']
    },
    sourcemap: true,
    minify: false
  }
});
