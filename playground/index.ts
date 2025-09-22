import {
    defineCommand, defineCommandObserver,
    defineParts,
    definePartsObserver,
    defineProps,
    WebuumElement
} from '../index.js'

customElements.define('x-test', class extends WebuumElement {
  declare $foo: HTMLElement | null

  static parts = {
    $foo: null,
  }

  static props = {
    $buu: 'test',
  }

  static dispatches = ['test']

  connectedCallback() {
    console.log('part', this.$foo)
  }

  $fooConnectedCallback(element: HTMLElement) {
    console.log('connected', element)
  }

  $fooDisconnectedCallback(element: HTMLElement) {
    console.log('disconnected', element)
  }
})

customElements.define('x-hello', class extends HTMLDivElement {
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

  $fooConnectedCallback(element: HTMLElement) {
    console.log('foo connected', element)
  }

  $fuuConnectedCallback(element: HTMLElement) {
    console.log('fuu connected', element)
  }
}, { extends: 'div' })
