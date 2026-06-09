import { supportsInterest } from 'webuum/supports'
import 'webuum/polyfill'

if (!supportsInterest) {
  // @ts-expect-error no types
  import('interestfor/src/interestfor.js')
}
