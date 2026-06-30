import { describe, expect, test, vi } from 'vitest'
import {
  WebuumElement,
  defineSignal,
} from '../index.js'

let customElementCounter = 0

const nextTag = prefix => `${prefix}-${Date.now()}-${customElementCounter++}`

describe('defineSignal', () => {
  test('exposes a usable abort signal and controller', () => {
    const host = document.createElement('div')
    defineSignal(host)

    const { $signal } = host

    expect($signal).toBeInstanceOf(AbortSignal)
    expect($signal.aborted).toBe(false)
    expect(host.$controller).toBeInstanceOf(AbortController)
    expect(host.$controller.signal).toBe($signal)
  })

  test('returns the same signal until it is aborted', () => {
    const host = document.createElement('div')
    defineSignal(host)

    expect(host.$signal).toBe(host.$signal)
  })

  test('recreates the controller after abort so listeners survive reconnection', () => {
    const host = document.createElement('div')
    defineSignal(host)

    const first = host.$signal
    host.$controller.abort()

    expect(first.aborted).toBe(true)

    const second = host.$signal

    expect(second).not.toBe(first)
    expect(second.aborted).toBe(false)
  })
})

describe('WebuumElement signal lifecycle', () => {
  test('aborts the signal on disconnect and removes listeners', () => {
    const tag = nextTag('x-signal')

    class SignalElement extends WebuumElement {
      constructor() {
        super()
        this.handler = vi.fn()
      }

      connectedCallback() {
        this.addEventListener('ping', this.handler, { signal: this.$signal })
      }
    }

    customElements.define(tag, SignalElement)

    const host = document.createElement(tag)
    document.body.append(host)

    host.dispatchEvent(new Event('ping'))
    expect(host.handler).toHaveBeenCalledTimes(1)

    const aborted = host.$signal
    host.remove()

    expect(aborted.aborted).toBe(true)

    host.dispatchEvent(new Event('ping'))
    expect(host.handler).toHaveBeenCalledTimes(1)
  })

  test('re-arms the signal on reconnection without duplicating listeners', () => {
    const tag = nextTag('x-signal-reconnect')

    class SignalElement extends WebuumElement {
      constructor() {
        super()
        this.handler = vi.fn()
      }

      connectedCallback() {
        this.addEventListener('ping', this.handler, { signal: this.$signal })
      }
    }

    customElements.define(tag, SignalElement)

    const host = document.createElement(tag)
    document.body.append(host)
    host.remove()
    document.body.append(host)

    host.dispatchEvent(new Event('ping'))

    expect(host.handler).toHaveBeenCalledTimes(1)
  })
})
