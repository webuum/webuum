import { describe, expect, test, vi } from 'vitest'
import {
  WebuumElement,
  defineCommandObserver,
  defineHostObserver,
  definePartsObserver,
  initializeController,
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
  test('defineHostObserver calls callback immediately and on mutation', async () => {
    const host = document.createElement('div')
    const callback = vi.fn()

    defineHostObserver(host, callback, ['arg'])
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenNthCalledWith(1, 'arg')

    host.append(document.createElement('span'))
    await waitForMutationObserver()

    expect(callback).toHaveBeenCalledTimes(2)
    expect(callback.mock.calls[1][0]).toBe('arg')
    expect(callback.mock.calls[1][1]).toBeInstanceOf(MutationRecord)
  })

  test('definePartsObserver reacts to added and removed parts', async () => {
    const host = document.createElement('x-parts-observer')
    host.partConnectedCallback = vi.fn()
    host.partDisconnectedCallback = vi.fn()

    definePartsObserver(host, { $foo: null })

    const part = document.createElement('div')
    part.setAttribute('data-x-parts-observer-part', 'foo')
    host.append(part)
    await waitForMutationObserver()

    expect(host.partConnectedCallback).toHaveBeenCalledWith('$foo', part)

    host.removeChild(part)
    await waitForMutationObserver()

    expect(host.partDisconnectedCallback).toHaveBeenCalledWith('$foo', part)
  })

  test('defineCommandObserver links command element to host', async () => {
    const host = document.createElement('div')
    defineCommandObserver(host)

    const button = document.createElement('button')
    button.setAttribute('command', '--run')
    button.command = '--run'

    host.append(button)
    await waitForMutationObserver()

    expect(button.commandForElement).toBe(host)
  })
})

describe('initializeController', () => {
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
    initializeController(host)

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
  test('constructor auto-initializes controller and allows subclass callbacks', async () => {
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
