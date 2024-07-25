import { createListener } from '../src/utils'

import { describe, it, expect } from 'vitest'

describe('create: resource', () => {
  it('listener function', () => {
    const listener = createListener()
    let data = 0
    const input = 4
    listener.on('data', (value: number) => { 
      data = value
    })
    listener.emit('data', input)
    expect(data).toEqual(input)
  })
})