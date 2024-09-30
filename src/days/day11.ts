import { splitLines } from '../utils'

/**
 * OK so this is just a bunch of distances between points in a grid with the
 * tricky bit being that I need to "expand" the grid in some cases, but I think
 * I have an idea. I'll just track which rows and columns need to be counted
 * twice and then add those to the distance calculation when two points lie on
 * opposite sides of them.
 *
 * Yeah this wasn't so bad.
 */
export function day11_1(input: string, expansion = 2): string {
  const lines = splitLines(input)
  const doubleRows = lines.reduce((acc, line, i) => {
    if (!line.includes('#')) acc.push(i)
    return acc
  }, [] as number[])

  const doubleCols = lines[0].split('').reduce((acc, _, i) => {
    if (lines.every((line) => line[i] !== '#')) acc.push(i)
    return acc
  }, [] as number[])

  const galaxyCoords = lines.reduce((acc, line, y) => {
    let x = line.indexOf('#')
    while (x !== -1) {
      acc.push([x, y])
      x = line.indexOf('#', x + 1)
    }
    return acc
  }, [] as [number, number][])

  let distanceSum = 0
  // Iterate over every pair
  for (let i = 0; i < galaxyCoords.length; i++) {
    const [x1, y1] = galaxyCoords[i]
    for (let j = i + 1; j < galaxyCoords.length; j++) {
      const [x2, y2] = galaxyCoords[j]

      const doubleRowsBetween = doubleRows.filter(
        (row) => y1 < row !== y2 < row
      ).length
      const doubleColsBetween = doubleCols.filter(
        (col) => x1 < col !== x2 < col
      ).length

      const expansionMultiplier = expansion - 1

      const distance =
        Math.abs(x1 - x2) +
        Math.abs(y1 - y2) +
        doubleRowsBetween * expansionMultiplier +
        doubleColsBetween * expansionMultiplier
      distanceSum += distance
    }
  }

  return distanceSum.toString()
}

if (import.meta.vitest) {
  const example = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`

  const { describe, it, expect } = import.meta.vitest
  describe('day11_1', () => {
    it('solves the example', () => {
      expect(day11_1(example)).toBe('374')
    })
  })
}

/**
 * Ha, preoptimization to the rescue again (things you can only ever say during
 * AoC and not in production code...). I can just reuse my last solution with a
 * slight tweak. That was the easiest second part in a while.
 */
export function day11_2(input: string): string {
  return day11_1(input, 1_000_000)
}
