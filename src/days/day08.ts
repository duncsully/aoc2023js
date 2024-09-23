import { splitLines } from '../utils'

/**
 * I'm still reeling from day 5 I guess. This one felt pretty straightforward and
 * elegant to do in JS, so I'm worried how bad part 2 will be.
 */
export function day08_1(input: string): string {
  const [turns, ...mapStrings] = splitLines(input)
  const map = buildMap(mapStrings)

  let node = 'AAA'
  let steps = 0
  while (node !== 'ZZZ') {
    const turn = turns[steps % turns.length] as 'L' | 'R'
    node = map[node][turn]
    steps++
  }

  return steps.toString()
}

/**
 * Seems easy enough to adjust from the first problem at first glance...
 * Gah, I should've known this would be another optimization one. OK, so
 * my gut suspicion is that each node ends up in a cycle (thankfully with only
 * one node ending in Z each after some testing) so I need to count the number
 * of steps to get to a Z ending for each starting node and then find the least
 * common multiple of those steps. Alright, that wasn't so bad.
 */
export function day08_2(input: string): string {
  const [turns, ...mapStrings] = splitLines(input)
  const map = buildMap(mapStrings)

  let nodes = Object.keys(map).filter((key) => key.endsWith('A'))
  let steps = 0

  /**
   * Tracks how many steps for a given starting node (of matching index) to reach
   * a node ending in Z. NaN indicates it hasn't reached one yet.
   */
  const stepsToReachZList = nodes.map(() => NaN)

  while (stepsToReachZList.some(isNaN)) {
    const turn = turns[steps % turns.length] as 'L' | 'R'
    // Technically wouldn't need to keep mapping ones that have reached a Z-ending node
    // but it's easier to just do them all anyway.
    nodes = nodes.map((node) => map[node][turn])
    steps++

    stepsToReachZList.forEach((stepsToReachZ, i) => {
      if (nodes[i].endsWith('Z') && isNaN(stepsToReachZ)) {
        stepsToReachZList[i] = steps
      }
    })
  }

  return leastCommonMultiple(stepsToReachZList).toString()
}

function buildMap(mapStrings: string[]) {
  return mapStrings.reduce((acc, mapString) => {
    const [from, to] = mapString.split(' = ')
    const [leftString, rightString] = to.split(', ')
    const left = leftString.slice(1)
    const right = rightString.slice(0, -1)
    acc[from] = { L: left, R: right }
    return acc
  }, {} as Record<string, { L: string; R: string }>)
}

function greatestCommonDivisor(a: number, b: number): number {
  return !b ? a : greatestCommonDivisor(b, a % b)
}

function leastCommonMultiple(numbers: number[]): number {
  return numbers.reduce(
    (acc, number) => (acc * number) / greatestCommonDivisor(acc, number)
  )
}
