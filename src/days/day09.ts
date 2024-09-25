import { splitLines } from '../utils'

/**
 * With how long today's explanation was I was worried how this would go, but it
 * ended up being fairly elegant.
 */
export function day09_1(input: string, extrapolateLeft = false): string {
  const lines = splitLines(input)

  const total = lines.reduce((acc, line) => {
    let lastDifferences = line.split(' ').map(Number)

    const endIndex = extrapolateLeft ? 0 : -1
    const lastNumbers = [lastDifferences.at(endIndex)!]

    // Keep going until the last history is all 0s
    while (lastDifferences.some(Boolean)) {
      lastDifferences = Array.from(
        { length: lastDifferences.length - 1 },
        (_, i) => lastDifferences[i + 1] - lastDifferences[i]
      )
      lastNumbers.push(lastDifferences.at(endIndex)!)
    }
    const multiplier = extrapolateLeft ? -1 : 1
    const sum = lastNumbers.reduceRight((acc, n) => acc * multiplier + n, 0)

    return acc + sum
  }, 0)

  return total.toString()
}

/**
 * This feels like the first part 2 where there is about the same amount of work.
 * It required only a few small adjustments to the first part. Another problem
 * where JS shines.
 */
export function day09_2(input: string): string {
  return day09_1(input, true)
}
