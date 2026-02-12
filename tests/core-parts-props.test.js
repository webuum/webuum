import { describe, expect, test } from 'vitest'
import { defineParts, defineProps } from '../index.js'

describe('defineParts', () => {
  test('creates getter returning null, element, or element array based on matches', () => {
    const host = document.createElement('x-parts-getter')
    const parts = defineParts(host, { $foo: null })

    expect(parts).toEqual({ $foo: null })
    expect(host.$foo).toBeNull()

    const first = document.createElement('div')
    first.setAttribute('data-x-parts-getter-part', 'foo')
    host.append(first)
    expect(host.$foo).toBe(first)

    const second = document.createElement('div')
    second.setAttribute('data-x-parts-getter-part', 'foo')
    host.append(second)

    expect(host.$foo).toEqual([first, second])
  })

  test('supports custom selector in parts map', () => {
    const host = document.createElement('x-parts-custom')
    defineParts(host, { $foo: 'maja' })

    const part = document.createElement('div')
    part.setAttribute('data-x-parts-custom-part', 'maja')
    host.append(part)

    expect(host.$foo).toBe(part)
  })
})

describe('defineProps', () => {
  test('returns defaults and typecasts dataset-backed values', () => {
    const host = document.createElement('x-props-default')
    const props = defineProps(host, {
      $count: 10,
      $enabled: true,
    })

    expect(props).toEqual({
      $count: 10,
      $enabled: true,
    })
    expect(host.$count).toBe(10)
    expect(host.$enabled).toBe(true)

    host.dataset.count = '42'
    host.dataset.enabled = 'false'

    expect(host.$count).toBe(42)
    expect(host.$enabled).toBe(false)
  })

  test('setter writes to dataset and getter reads typed value', () => {
    const host = document.createElement('x-props-setter')
    defineProps(host, { $payload: null })

    host.$payload = '{"ok":true}'

    expect(host.dataset.payload).toBe('{"ok":true}')
    expect(host.$payload).toEqual({ ok: true })
  })
})
