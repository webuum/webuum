import { defineElement } from 'webuum'
import { defineIntersectionObserver } from 'webuum/observers'

/**
 * @template {CustomElementConstructor} T
 * @param {T} Element
 * @returns {T}
 */
export const WebuumLazyElement = Element =>
/**
 * @property {AbortController | undefined} $controller
 */
  class extends Element {
    constructor() {
      super()

      defineElement(this)
    }

    connectedCallback() {
      defineIntersectionObserver(this, { threshold: 0.1 })

      if (!this.$lazy) this.lazyCallback?.()
    }

    disconnectedCallback() {
      this.$controller?.abort()
    }

    intersectCallback(entry) {
      if (!entry.isIntersecting || !this.$lazy) return

      this.lazyCallback?.()
      this.$lazy = false
    }
  }
