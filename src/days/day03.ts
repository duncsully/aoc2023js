import { splitLines } from '../utils'

/**
 * Gotta be honest, this one was a bit of a mess and already the first one I got wrong on my first try.
 *
 * I knew I wanted to parse the grid into some form of data structures to store the numbers and symbols
 * and then iterate over them afterward so I didn't get into a mess of trying to efficiently loop over
 * the grid while also checking for adjacent symbols.
 *
 * At first I wanted to solve it by iterating over the symbolCoords, but a number could be adjacent
 * to multiple symbols. So then I wanted to store a map of all adjacent spots to a number, but then
 * I realized that numbers could appear multiple times, so I wasn't counting them correctly. And then
 * needing to add all adjacent cells got a bit clunky, especially since a number being the last item
 * in a line became a special case.
 */
export function day03_1(input: string) {
  const lines = splitLines(input)
  const grid = lines.map((line) => line.split(''))
  const symbolCoords = [] as string[]
  // Parts numbers can duplicate, so store them in an array
  const allPartsNumbers = [] as { partNumber: number; coords: string[] }[]

  grid.forEach((line, lineIndex) => {
    let numberString = ''
    line.forEach((cell, cellIndex) => {
      if (!isNaN(+cell)) {
        numberString += cell
      } else {
        if (numberString) {
          const partNumber = +numberString
          const coords = [] as string[]
          Array.from({ length: numberString.length + 2 }).forEach((_, i) => {
            // Set each top adjacent cell to the number
            coords.push(coordinatesToString(lineIndex - 1, cellIndex - i))

            // Set each bottom adjacent cell to the number
            coords.push(coordinatesToString(lineIndex + 1, cellIndex - i))
          })
          // Set the left adjacent cell to the number
          coords.push(
            coordinatesToString(lineIndex, cellIndex - numberString.length - 1)
          )

          // Set the right adjacent cell to the number
          coords.push(coordinatesToString(lineIndex, cellIndex))

          numberString = ''
          allPartsNumbers.push({ partNumber, coords })
        }
        if (cell !== '.') {
          symbolCoords.push(coordinatesToString(lineIndex, cellIndex))
        }
      }
    })
    // Check if the number is at the end of the line
    if (numberString) {
      const partNumber = +numberString
      const coords = [] as string[]
      Array.from({ length: numberString.length + 1 }).forEach((_, i) => {
        // Set each top adjacent cell to the number
        coords.push(coordinatesToString(lineIndex - 1, line.length - i - 1))

        // Set each bottom adjacent cell to the number
        coords.push(coordinatesToString(lineIndex + 1, line.length - i - 1))
      })
      // Set the left adjacent cell to the number
      coords.push(
        coordinatesToString(lineIndex, line.length - numberString.length - 1)
      )

      allPartsNumbers.push({ partNumber, coords })
    }
  })

  const total = allPartsNumbers.reduce((acc, { partNumber, coords }) => {
    const isPartNumberAdjacentToSymbol = coords.some((coord) =>
      symbolCoords.includes(coord)
    )
    if (!isPartNumberAdjacentToSymbol) {
      console.log('partNumber not adjacent to symbol', partNumber)
    }
    return acc + (isPartNumberAdjacentToSymbol ? partNumber : 0)
  }, 0)

  return total
}

/**
 * This one was definitely easier but still took me a few tries. I only had a single character
 * to check for, which simplified looping logic for the most part. I wasn't sure if it was possible for
 * three or more numbers to be adjacent to a gear and didn't want to count those, so I wanted to check
 * every adjacent cell and track an array of adjacent numbers. The one hangup was making sure
 * I didn't add the same number twice. My first attempt checked that the cell to the left wasn't in the
 * numberCoords array, but that didn't account for a number that started on the left and continued to
 * the right (top or bottom). I realized I could just check if the cell to the left was a number and
 * assume that the number was already added.
 */
export function day03_2(input: string) {
  const lines = splitLines(input)
  const grid = lines.map((line) => line.split(''))

  const total = grid.reduce((acc, line, lineIndex) => {
    return (
      acc +
      line.reduce((lineAcc, cell, cellIndex) => {
        if (cell === '*') {
          const numberCoords = [] as [number, number][]
          for (let i = lineIndex - 1; i <= lineIndex + 1; i++) {
            for (let j = cellIndex - 1; j <= cellIndex + 1; j++) {
              if (
                !isNaN(+grid[i]?.[j]) &&
                // Don't double count the number if it's already added from a previous coord
                (j < cellIndex || isNaN(+grid[i]?.[j - 1]))
              ) {
                numberCoords.push([i, j])
              }
            }
          }
          if (numberCoords.length === 2) {
            const [firstNumberCoords, secondNumberCoords] = numberCoords
            const firstNumber = getNumberAtCoords(grid, ...firstNumberCoords)
            const secondNumber = getNumberAtCoords(grid, ...secondNumberCoords)
            return (lineAcc += firstNumber * secondNumber)
          }
        }
        return lineAcc
      }, 0)
    )
  }, 0)

  return total
}

/**
 * Converts coordinates to a string for easier comparison (gee wouldn't it be nice if JS had tuples
 * or easier complex numbers?)
 */
function coordinatesToString(line: number, cell: number) {
  return `${line},${cell}`
}

/**
 * Assuming a horizontal number, gets the number constructed of all digits connected to the given coordinates
 */
function getNumberAtCoords(grid: string[][], line: number, cell: number) {
  let numberString = grid[line][cell]
  // Check right
  let nextCell = cell + 1
  while (!isNaN(+grid[line][nextCell])) {
    numberString += grid[line][nextCell]
    nextCell++
  }
  // Check left
  nextCell = cell - 1
  while (!isNaN(+grid[line][nextCell])) {
    numberString = grid[line][nextCell] + numberString
    nextCell--
  }
  return +numberString
}
