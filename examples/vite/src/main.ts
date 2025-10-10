import { WebuumElement } from 'webuum'
import { supportsAnchor } from './utils.ts'
import type { Placement } from '@floating-ui/utils'
import './polyfill.ts'

// @ts-expect-error - source not supported in types yet
customElements.define('x-popover', class extends WebuumElement {
  declare $placement: Placement
  declare $autoUpdate: object | boolean
  declare $source: HTMLElement
  declare $cleanup: () => void

  $open = false

  static values = {
    $placement: null,
    $autoUpdate: null,
  }

  connectedCallback() {
    this.addEventListener('toggle', (event) => {
      // @ts-expect-error - newState not supported in types yet
      this.$open = event.newState === 'open'
      if (this.$source?.ariaExpanded) this.$source.ariaExpanded = this.$open.toString()
    })
  }

  // @ts-expect-error - source not supported in types yet
  async showPopover({ source }: HTMLElement) {
    if (this.$autoUpdate || !supportsAnchor) {
      const { autoUpdatePopover } = await import('./popover/index.ts')

      this.$cleanup = await autoUpdatePopover(source, this as unknown as HTMLElement, this.$placement, this.$autoUpdate)
    }

    this.$source = source

    // @ts-expect-error - source not supported in types yet
    super.showPopover({ source })
  }

  // @ts-expect-error - source not supported in types yet
  togglePopover({ source }: HTMLElement) {
    if (this.$open) {
      this.hidePopover()
    }
    else {
      // @ts-expect-error - source not supported in types yet
      this.showPopover({ source })
    }
  }

  hidePopover() {
    this.$cleanup?.()

    super.hidePopover()
  }
},
)
