import { describe, expect, it } from 'vitest'
import { day09_1, day09_2 } from './day09'

describe('day09_1', () => {
  it('solves the example', () => {
    expect(day09_1(example)).toEqual('114')
  })
})

describe('day09_2', () => {
  it('solves the example', () => {
    expect(day09_2(example)).toEqual('2')
  })
})

const example = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`
