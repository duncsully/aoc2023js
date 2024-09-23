import { describe, expect, it } from 'vitest'
import { day08_1, day08_2 } from './day08'

describe('day08_1', () => {
  it('solves the example', () => {
    expect(day08_1(example)).toBe('6')
  })
})

describe('day08_2', () => {
  it('solves the example', () => {
    expect(day08_2(example2)).toBe('6')
  })
})

const example = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`

const example2 = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`
