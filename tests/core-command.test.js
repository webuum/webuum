import { describe, expect, test, vi } from 'vitest'
import { defineCommand } from '../index.js'

const createCommandEvent = (command, source) => {
  const event = new Event('command', { bubbles: true, cancelable: true })

  Object.defineProperties(event, {
    command: { value: command },
    source: { value: source },
  })

  return event
}

describe('defineCommand', () => {
  test('dispatches kebab command to camelCase method and typecasts source value', () => {
    const host = document.createElement('div')
    host.addText = vi.fn()

    defineCommand(host)

    const source = document.createElement('button')
    source.value = '42'
    const event = createCommandEvent('--add-text', source)

    host.dispatchEvent(event)

    expect(host.addText).toHaveBeenCalledTimes(1)
    expect(host.addText).toHaveBeenCalledWith(event)
    expect(source.$value).toBe(42)
  })

  test('always calls preventDefault', () => {
    const host = document.createElement('div')
    host.run = vi.fn()
    defineCommand(host)

    const source = document.createElement('button')
    source.value = 'true'
    const event = createCommandEvent('--run', source)
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

    host.dispatchEvent(event)

    expect(preventDefaultSpy).toHaveBeenCalledTimes(1)
  })

  test('does not fail when method is missing', () => {
    const host = document.createElement('div')
    defineCommand(host)

    const source = document.createElement('button')
    source.value = 'null'
    const event = createCommandEvent('--missing-method', source)

    expect(() => host.dispatchEvent(event)).not.toThrow()
    expect(source.$value).toBeNull()
  })

  test('supports custom replacer', () => {
    const host = document.createElement('div')
    host.do_work = vi.fn()
    defineCommand(host, part => `_${part[1]}`)

    const source = document.createElement('button')
    source.value = '"x"'
    const event = createCommandEvent('--do-work', source)

    host.dispatchEvent(event)

    expect(host.do_work).toHaveBeenCalledTimes(1)
  })
})
