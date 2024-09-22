import { describe, it, expect } from 'vitest'
import { day07_1, day07_2 } from './day07'

describe('day07_1', () => {
  it('solves the example', () => {
    expect(day07_1(example)).toBe('6440')
  })
})

describe('day07_2', () => {
  it('solves the example', () => {
    expect(day07_2(example)).toBe('5905')
  })
})

const example = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`
