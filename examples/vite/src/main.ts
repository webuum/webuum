import { WebuumElement } from 'webuum'
import { supportsAnchor } from './utils.js'

customElements.define('x-popover', class extends WebuumElement {
        declare $placement: string
        declare $autoUpdate: object | boolean
        declare $source: HTMLElement
        declare $cleanup: Function

        $open = false

        static values = {
            $placement: null,
            $autoUpdate: null,
        }

        connectedCallback() {
            this.addEventListener('toggle', (event) => {
                this.$open = event.newState === 'open'
                if (this.$source?.ariaExpanded) this.$source.ariaExpanded = this.$open.toString()
            })
        }

        async showPopover({ source }: HTMLElement) {
            if (this.$autoUpdate || !supportsAnchor) {
                const { autoUpdatePopover } = await import('./popover/index.js')

                this.$cleanup = await autoUpdatePopover(source, this, this.$placement, this.$autoUpdate)
            }

            this.$source = source

            super.showPopover({ source })
        }

        togglePopover({ source }: HTMLElement) {
            !this.$open
                ? this.showPopover({ source })
                : this.hidePopover()
        }

        hidePopover() {
            this.$cleanup?.()

            super.hidePopover()
        }
    },
)