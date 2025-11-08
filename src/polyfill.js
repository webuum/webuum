import { supportsCommand, supportsIs } from './supports.js'

if (!supportsIs()) {
  await import('@webreflection/custom-elements-builtin')
}

if (!supportsCommand) {
  const { apply } = await import('invokers-polyfill/fn')

  apply()
}
