import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const domSetup = fileURLToPath(new URL('./tests/setup/dom.setup.js', import.meta.url))

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.js'],
    setupFiles: [domSetup],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['index.js', 'src/**/*.js'],
      exclude: ['dist/**', 'types/**', 'examples/**', 'playground/**'],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
})
