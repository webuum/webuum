import { describe, expect, test } from 'vitest'
import { supportsCommand, supportsInterest, supportsIs } from '../src/supports.js'

describe('supports', () => {
  test('exports support flags as booleans', () => {
    expect(typeof supportsCommand).toBe('boolean')
    expect(typeof supportsInterest).toBe('boolean')
  })

  test('supportsIs returns a boolean for a unique name', () => {
    const name = `is-supports-${Date.now()}`
    const result = supportsIs(name)

    expect(typeof result).toBe('boolean')
  })
})
