import { describe, expect, test, vi } from 'vitest'
import {
  WebuumElement,
  defineObserver,
  defineElement,
} from '../index.js'

let customElementCounter = 0

const nextTag = prefix => `${prefix}-${Date.now()}-${customElementCounter++}`

const waitForMutationObserver = async () => {
  await Promise.resolve()
  await new Promise(resolve => setTimeout(resolve, 0))
}

const createCommandEvent = (command, source) => {
  const event = new Event('command', { bubbles: true, cancelable: true })

  Object.defineProperties(event, {
    command: { value: command },
    source: { value: source },
  })

  return event
}

describe('observers', () => {
  test('defineObserver reacts to added and removed parts', async () => {
    const host = document.createElement('x-parts-observer')
    host.partConnectedCallback = vi.fn()
    host.partDisconnectedCallback = vi.fn()

    defineObserver(host, { $foo: null })

    const part = document.createElement('div')
    part.setAttribute('data-x-parts-observer-part', 'foo')
    host.append(part)
    await waitForMutationObserver()

    expect(host.partConnectedCallback).toHaveBeenCalledWith('$foo', part)

    host.removeChild(part)
    await waitForMutationObserver()

    expect(host.partDisconnectedCallback).toHaveBeenCalledWith('$foo', part)
  })

  test('defineObserver ignores parts of a nested same-name component', async () => {
    const host = document.createElement('x-nested-observer')
    host.partConnectedCallback = vi.fn()

    defineObserver(host, { $foo: null })

    const inner = document.createElement('x-nested-observer')
    const innerPart = document.createElement('div')
    innerPart.setAttribute('data-x-nested-observer-part', 'foo')
    inner.append(innerPart)
    host.append(inner)
    await waitForMutationObserver()

    expect(host.partConnectedCallback).not.toHaveBeenCalled()
  })

  test('defineObserver links command element to host', async () => {
    const host = document.createElement('div')
    defineObserver(host)

    const button = document.createElement('button')
    button.setAttribute('command', '--run')
    button.command = '--run'

    host.append(button)
    await waitForMutationObserver()

    expect(button.commandForElement).toBe(host)
  })
})

describe('defineElement', () => {
  test('wires command, parts, props and observers based on constructor statics', async () => {
    const tag = nextTag('x-init')

    class InitElement extends HTMLElement {
      static parts = {
        $foo: null,
      }

      static props = {
        $count: 5,
      }

      constructor() {
        super()
        this.run = vi.fn()
        this.partConnectedCallback = vi.fn()
      }
    }

    customElements.define(tag, InitElement)

    const host = document.createElement(tag)
    defineElement(host)

    expect(host.$count).toBe(5)
    host.dataset.count = '7'
    expect(host.$count).toBe(7)

    const part = document.createElement('div')
    part.setAttribute(`data-${tag}-part`, 'foo')
    host.append(part)
    await waitForMutationObserver()
    expect(host.partConnectedCallback).toHaveBeenCalledWith('$foo', part)

    const button = document.createElement('button')
    button.setAttribute('command', '--run')
    button.command = '--run'
    host.append(button)
    await waitForMutationObserver()
    expect(button.commandForElement).toBe(host)

    const source = document.createElement('button')
    source.value = '9'
    const event = createCommandEvent('--run', source)
    host.dispatchEvent(event)

    expect(host.run).toHaveBeenCalledTimes(1)
    expect(source.$value).toBe(9)
  })
})

describe('WebuumElement', () => {
  test('constructor auto-defines element and allows subclass callbacks', async () => {
    const tag = nextTag('x-webuum-element')

    class TestElement extends WebuumElement {
      static parts = {
        $foo: null,
      }

      static props = {
        $enabled: true,
      }

      constructor() {
        super()
        this.run = vi.fn()
        this.partConnectedCallback = vi.fn()
        this.partDisconnectedCallback = vi.fn()
      }
    }

    customElements.define(tag, TestElement)

    const host = document.createElement(tag)
    expect(host.$enabled).toBe(true)

    const part = document.createElement('div')
    part.setAttribute(`data-${tag}-part`, 'foo')
    host.append(part)
    await waitForMutationObserver()
    expect(host.partConnectedCallback).toHaveBeenCalledWith('$foo', part)

    host.removeChild(part)
    await waitForMutationObserver()
    expect(host.partDisconnectedCallback).toHaveBeenCalledWith('$foo', part)

    const source = document.createElement('button')
    source.value = 'true'
    const event = createCommandEvent('--run', source)
    host.dispatchEvent(event)

    expect(host.run).toHaveBeenCalledTimes(1)
    expect(source.$value).toBe(true)
  })
})
