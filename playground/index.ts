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

    partMutationCallback(name: keyof typeof Test['parts'], removedElement: HTMLElement, addedElement: HTMLElement) {
        if (name === '$foo' && addedElement) {
            console.log('connected', addedElement)
        }

        if (name === '$foo' && removedElement) {
            console.log('disconnected', removedElement)
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

  partMutationCallback(name: keyof typeof this.$shadowParts, removedElement: HTMLElement, addedElement: HTMLElement) {
    if (name === '$fuu' && addedElement) {
        console.log('connected', addedElement)
    }

    if (name === '$fuu' && removedElement) {
        console.log('disconnected', removedElement)
    }
  }
}, { extends: 'div' })
