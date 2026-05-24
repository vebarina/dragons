import { describe, it, expect } from 'vitest'
import { decodeText } from './decrypt'

describe('decodeText', () => {
  it('decodes base64 when method is 1', () => {
    expect(decodeText('SGVsbG8=', 1)).toBe('Hello')
  })

  it('decodes rot13 when method is 2', () => {
    expect(decodeText('Uryyb', 2)).toBe('Hello')
  })

  it('rot13 is its own inverse', () => {
    const text = 'Hello World 123!'
    expect(decodeText(decodeText(text, 2), 2)).toBe(text)
  })

  it('rot13 handles uppercase and lowercase independently', () => {
    expect(decodeText('NOPqrs', 2)).toBe('ABCdef')
  })

  it('rot13 leaves non-alpha characters unchanged', () => {
    expect(decodeText('Uryyb, Jbeyq!', 2)).toBe('Hello, World!')
  })
})
