import { supportsCommand, supportsInterest, supportsIs } from 'webuum/supports'

if (!supportsIs()) {
  // @ts-expect-error no types
  await import('@webreflection/custom-elements-builtin')
}

if (!supportsCommand) {
  const { apply } = await import('invokers-polyfill/fn')

  apply()
}

if (!supportsInterest && document.querySelector('[interestfor]')) {
  // @ts-expect-error no types
  import('interestfor/src/interestfor.js')
}
