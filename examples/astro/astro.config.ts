import {defineConfig} from "astro/config";

export default defineConfig({
  vite: {
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext'
      }
    },
    build: {
      target: 'esnext'
    },
  }
})