import { describe, expect, test, vi } from 'vitest'
import {
  commandMutationCallback,
  findSelectors,
  getLocalName,
  getPartSelector,
  partsMutationCallback,
  typecast,
} from '../src/utils.js'

describe('typecast', () => {
  test('casts numbers', () => {
    expect(typecast('42')).toBe(42)
    expect(typecast('3.14')).toBe(3.14)
  })

  test('casts booleans and null', () => {
    expect(typecast('true')).toBe(true)
    expect(typecast('false')).toBe(false)
    expect(typecast('null')).toBeNull()
  })

  test('casts json objects and arrays', () => {
    expect(typecast('{"a":1}')).toEqual({ a: 1 })
    expect(typecast('[1,2,3]')).toEqual([1, 2, 3])
  })

  test('falls back to original value for invalid json', () => {
    expect(typecast('{"a":}')).toBe('{"a":}')
  })

  test('keeps plain strings', () => {
    expect(typecast('hello')).toBe('hello')
  })
})

describe('getLocalName', () => {
  test('prefers is attribute when present', () => {
    const host = document.createElement('div')
    host.setAttribute('is', 'x-box')

    expect(getLocalName(host)).toBe('x-box')
  })

  test('falls back to localName', () => {
    const host = document.createElement('x-box')

    expect(getLocalName(host)).toBe('x-box')
  })
})

describe('getPartSelector', () => {
  test('builds selector with localName prefix', () => {
    expect(getPartSelector('$foo', null, 'x-box')).toBe('[data-x-box-part~="foo"]')
  })

  test('builds selector without localName prefix', () => {
    expect(getPartSelector('$foo', null, '')).toBe('[part~="foo"]')
  })
})

describe('findSelectors', () => {
  test('ignores text nodes', () => {
    const text = document.createTextNode('text')

    expect(findSelectors(text, '[data-test]')).toEqual([])
  })

  test('finds matching descendants', () => {
    const host = document.createElement('div')
    host.innerHTML = `
      <span data-test="a"></span>
      <span data-test="b"></span>
    `

    expect(findSelectors(host, '[data-test]')).toHaveLength(2)
  })

  test('filters descendants from nested hosts when host filtering is active', () => {
    const host = document.createElement('x-filter-host')
    host.host = host

    host.innerHTML = `
      <span data-test="a"></span>
      <x-filter-host>
        <span data-test="b"></span>
      </x-filter-host>
    `

    const matches = findSelectors(host, '[data-test]', host)

    expect(matches).toHaveLength(1)
    expect(matches[0].getAttribute('data-test')).toBe('a')
  })
})

describe('partsMutationCallback', () => {
  test('calls part callbacks for added and removed nodes including descendants', () => {
    const host = document.createElement('x-parts-host')
    host.partConnectedCallback = vi.fn()
    host.partDisconnectedCallback = vi.fn()

    const wrapper = document.createElement('div')
    const part = document.createElement('div')
    part.setAttribute('data-x-parts-host-part', 'foo')
    wrapper.append(part)

    partsMutationCallback(host, { $foo: null }, { addedNodes: [wrapper] })
    expect(host.partConnectedCallback).toHaveBeenCalledWith('$foo', part)

    partsMutationCallback(host, { $foo: null }, { removedNodes: [wrapper] })
    expect(host.partDisconnectedCallback).toHaveBeenCalledWith('$foo', part)
  })
})

describe('commandMutationCallback', () => {
  test('links command elements to host and does not override existing commandForElement', () => {
    const host = document.createElement('div')
    const button = document.createElement('button')
    button.setAttribute('command', '--run')
    button.command = '--run'

    const keepTarget = document.createElement('div')
    const keepButton = document.createElement('button')
    keepButton.setAttribute('command', '--keep')
    keepButton.command = '--keep'
    keepButton.commandForElement = keepTarget

    const plain = document.createElement('button')

    commandMutationCallback(host, { addedNodes: [button, keepButton, plain] })

    expect(button.commandForElement).toBe(host)
    expect(keepButton.commandForElement).toBe(keepTarget)
    expect(plain.commandForElement).toBeUndefined()
  })
})
