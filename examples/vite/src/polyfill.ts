import { supportsCommand, supportsInterest, supportsIs } from 'webuum/supports'

if (!supportsCommand) {
  const { apply } = await import('invokers-polyfill/fn')

  apply()
}

if (!supportsInterest && document.querySelector('[interestfor]')) {
  import('interestfor/src/interestfor.js')
}
