import {defineCommand, defineParts, defineProps, WebuumElement} from './index.js'

customElements.define('x-test', class extends WebuumElement {
  declare $foo: HTMLElement | null

  static parts = {
    $foo: null,
  }

  static props = {
    $buu: 'test',
  }

  connectedCallback() {
    console.dir(this.$foo)
  }
})

customElements.define('x-hello', class extends HTMLElement {
  declare $foo: HTMLElement | null
  declare $fuu: HTMLElement | null
  declare $buu: string

  constructor() {
    super()
    this.attachShadow({ mode: "open" });

    defineCommand(this)

    defineParts(this, {
      $foo: 'maja',
    })

    defineParts(this.shadowRoot, {
      $fuu: 'maja',
    })

    defineProps(this, {
      $buu: 'test',
    })
  }


  connectedCallback() {
    this.shadowRoot.innerHTML = `<div part="maja"><slot></slot></div>`

    this.$buu = 'test2'

    console.log(this.$foo, this.$fuu)
  }
})
