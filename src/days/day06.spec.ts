import { describe, expect, it } from 'vitest'
import { day06_1, day06_2 } from './day06'

describe('day06_1', () => {
  it('solves the example', () => {
    expect(day06_1(example)).toBe('288')
  })
})

describe('day06_2', () => {
  it('solves the example', () => {
    expect(day06_2(example)).toBe('71503')
  })
})

const example = `Time:      7  15   30
Distance:  9  40  200`
