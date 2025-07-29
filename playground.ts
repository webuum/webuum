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
  declare $buu: string

  constructor() {
    super()

    defineCommand(this)

    defineParts(this, {
      $foo: null,
    })

    defineProps(this, {
      $buu: 'test',
    })
  }


  connectedCallback() {
    console.dir(this)

    this.$buu = 'test2'

    console.log(this.$foo, this.$buu)
  }
})
