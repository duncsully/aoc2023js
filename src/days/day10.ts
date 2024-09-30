import { splitLines } from '../utils'

/**
 * This is one of those funny ones where it seemed intuitive enough reading the problem,
 * but then it ends up trickier to actually implement. Because the pipes are two-sided,
 * I have to be concerned with the direction I'm coming from to determine the next cell.
 * I decided to use a bearing to keep track of the direction I'm going and use various
 * utilities to determine the next bearing and coordinates.
 */
export function day10_1(input: string): string {
  const lines = splitLines(input)

  const start: [number, number] = [NaN, NaN]
  lines.find((line, y) => {
    const x = line.indexOf('S')
    if (x !== -1) {
      start[0] = x
      start[1] = y
      return true
    }
  })

  let currentBearing = Bearing.North
  let coordinates: [number, number] = [NaN, NaN]

  for (let i = 0; i < 4; i++) {
    const tryBearing = i as Bearing
    const neighbor = getNewCoordinates(start, tryBearing)
    const newBearing = getNewBearing(
      tryBearing,
      getPipeAtCoordinates(lines, neighbor)
    )
    if (isNaN(newBearing)) continue

    currentBearing = newBearing
    coordinates = neighbor
    break
  }

  let i = 1
  while (coordinates[0] !== start[0] || coordinates[1] !== start[1]) {
    coordinates = getNewCoordinates(coordinates, currentBearing)
    const pipeSymbol = getPipeAtCoordinates(lines, coordinates)
    currentBearing = getNewBearing(currentBearing, pipeSymbol)

    i++
  }

  const half = Math.floor(i / 2)

  return half.toString()
}

if (import.meta.vitest) {
  const example = `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`
  const { it, expect } = import.meta.vitest
  it('solves the example', () => {
    expect(day10_1(example)).toBe('8')
  })
}

/**
 * Oy vey... I struggled with this one for a while. I had the polygon but didn't really know
 * how to get the internal points in a reliable way, so I had to look up hints, which pointed
 * toward the shoelace formula and Pick's theorem, which honestly I was unfamiliar with. Then
 * it was almost surprisingly trivial to implement.
 */
export function day10_2(input: string): string {
  const lines = splitLines(input)

  const start: [number, number] = [NaN, NaN]
  lines.find((line, y) => {
    const x = line.indexOf('S')
    if (x !== -1) {
      start[0] = x
      start[1] = y
      return true
    }
  })

  let currentBearing = Bearing.North
  let coordinates: [number, number] = [NaN, NaN]

  // Find the first connected pipe from the start
  for (let i = 0; i < 4; i++) {
    const tryBearing = i as Bearing
    const neighbor = getNewCoordinates(start, tryBearing)
    const newBearing = getNewBearing(
      tryBearing,
      getPipeAtCoordinates(lines, neighbor)
    )
    if (isNaN(newBearing)) continue

    currentBearing = newBearing
    coordinates = neighbor
    break
  }

  // Vertices of the polygon (i.e. don't count the straight pipes)
  const vertices = [start]
  let boundaryPoints = 1
  // Walk the polygon until we're back at the start
  while (coordinates[0] !== start[0] || coordinates[1] !== start[1]) {
    boundaryPoints++
    const currentPipeSymbol = getPipeAtCoordinates(lines, coordinates)
    if (!['-', '|'].includes(currentPipeSymbol)) {
      vertices.push(coordinates)
    }
    coordinates = getNewCoordinates(coordinates, currentBearing)
    const pipeSymbol = getPipeAtCoordinates(lines, coordinates)
    currentBearing = getNewBearing(currentBearing, pipeSymbol)
  }

  // shoelace formula
  const area =
    vertices.reduce((acc, [x1, y1], i) => {
      const [x2, y2] = vertices[(i + 1) % vertices.length]
      return acc + x1 * y2 - x2 * y1
    }, 0) / 2

  // Pick's theorem
  const internalPoints = area - boundaryPoints / 2 + 1

  return internalPoints.toString()
}

if (import.meta.vitest) {
  const areaExample = `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`

  const { it, expect } = import.meta.vitest
  it('solves a part 2 example', () => {
    expect(day10_2(areaExample)).toBe('10')
  })
}

function getPipeAtCoordinates(lines: string[], [x, y]: [number, number]): Pipe {
  return lines[y]?.[x] as Pipe
}

enum Bearing {
  North = 0,
  East = 1,
  South = 2,
  West = 3,
}

type Pipe = '7' | 'F' | 'J' | 'L' | '|' | '-'
const bearingAdjustmentMaps = {
  [Bearing.North]: {
    '7': -1,
    '|': 0,
    F: 1,
  },
  [Bearing.East]: {
    J: -1,
    '-': 0,
    '7': 1,
  },
  [Bearing.South]: {
    L: -1,
    '|': 0,
    J: 1,
  },
  [Bearing.West]: {
    F: -1,
    '-': 0,
    L: 1,
  },
} as Record<Bearing, Record<Pipe, number>>

const getNewBearing = (bearing: Bearing, pipe: Pipe): Bearing => {
  const bearingAdjustments = bearingAdjustmentMaps[bearing]
  if (bearingAdjustments[pipe] === undefined) {
    return NaN
  }
  return (bearing + bearingAdjustments[pipe] + 4) % 4
}

const bearingTranslations = {
  [Bearing.North]: [0, -1],
  [Bearing.East]: [1, 0],
  [Bearing.South]: [0, 1],
  [Bearing.West]: [-1, 0],
} as const

const getNewCoordinates = (
  [x, y]: [number, number],
  bearing: Bearing
): [number, number] => {
  const [dx, dy] = bearingTranslations[bearing]
  return [x + dx, y + dy]
}
