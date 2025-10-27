import {
    defineCommand, defineCommandObserver,
    defineParts,
    definePartsObserver,
    defineProps,
    WebuumElement
} from '../index.js'

customElements.define('x-test', class Test extends WebuumElement {
  declare $foo: HTMLElement | null

  static parts = {
    $foo: null,
  }

  static props = {
    $buu: 'test',
  }

  static dispatches = ['test']

    partConnectedCallback(name: keyof typeof Test['parts'], element: HTMLElement) {
        if (name === '$foo') {
            console.log('connected', element)
        }
    }

    partDisconnectedCallback(name: keyof typeof Test['parts'], element: HTMLElement) {
        if (name === '$foo') {
            console.log('disconnected', element)
        }
    }

    connectedCallback() {
        console.log('part', this.$foo)
    }
})

customElements.define('x-hello', class Hello extends HTMLDivElement {
  declare $foo: HTMLElement | null
  declare $fuu: HTMLElement | null
  declare $buu: string

  declare $parts: Record<string, string | null>
  declare $shadowParts: Record<string, string | null>

  constructor() {
    super()
    this.attachShadow({ mode: "open" });

    defineCommand(this)
    defineCommandObserver(this.shadowRoot)

    this.$parts = defineParts(this, {
      $foo: 'maja',
    })

    this.$shadowParts = defineParts(this.shadowRoot, {
      $fuu: 'maja',
    })

    definePartsObserver(this, this.$parts)
    definePartsObserver(this.shadowRoot, this.$shadowParts)

    defineProps(this, {
      $buu: 'test',
    })

    // defineDispatch(this)
  }


  connectedCallback() {
    this.shadowRoot.innerHTML = `<div><div part="maja"><slot></slot><button command="--test">Test</button></div></div>`

    this.$buu = 'test2'

      this.addEventListener('x-hello:muhehe', (e) => {
          console.log(e)
      })
  }

  test() {
      console.log('test')
  }

  partConnectedCallback(name: keyof typeof this.$shadowParts, element: HTMLElement) {
    if (name === '$fuu') {
        console.log('connected', element)
    }
  }

  partDisconnectedCallback(name: keyof typeof this.$shadowParts, element: HTMLElement) {
    if (name === '$fuu') {
      console.log('disconnected', element)
    }
  }
}, { extends: 'div' })
