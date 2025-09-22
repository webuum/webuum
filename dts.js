import { createBundle } from 'dts-buddy'

await createBundle({
  project: 'tsconfig.json',
  output: 'types/index.d.ts',
  modules: {
    'webuum': 'index.js',
    'webuum/supports': 'src/supports.js',
    'webuum/utils': 'src/utils.js',
  },
})
