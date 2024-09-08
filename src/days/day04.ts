import { splitLines } from '../utils'

/**
 * This one seemed like it'd be really easy, just some simple parsing and Set operations.
 * One little gotcha was I didn't handle all cases of extra whitespace, leading to empty
 * strings getting counted in the sets. This was easily remedied with some regex.
 */
export function day04_1(input: string) {
  const lines = splitLines(input)

  const totalPoints = lines.reduce((points, line) => {
    const [, numbers] = line.split(/:\s+/)
    const [winningNumbersString, ticketNumbersString] =
      numbers.split(/\s+\|\s+/)
    const winningNumbers = new Set(winningNumbersString.split(/\s+/))
    const ticketNumbers = new Set(ticketNumbersString.split(/\s+/))

    const totalMatches = winningNumbers.intersection(ticketNumbers).size
    if (totalMatches) {
      const power = totalMatches - 1
      return points + 2 ** power
    }
    return points
  }, 0)

  return totalPoints
}

/**
 * Huh, OK now things are getting interesting. At first I thought I'd need a tree structure
 * of some sort but eventually I realized due to the cascading nature of card wins and their
 * predictable order, I could just work backwards from the last card to the first, caching
 * the number of cards each card wins, since a card can only win cards that come after it.
 */
export function day04_2(input: string) {
  const lines = splitLines(input)

  let totalCards = 0
  // As we figure out how many copies a card wins, we can look that up for previous cards
  const cachedCopiesAmounts = [] as number[]

  for (let lineIndex = lines.length - 1; lineIndex >= 0; lineIndex--) {
    const line = lines[lineIndex]
    const [, numbers] = line.split(/:\s+/)
    const [winningNumbersString, ticketNumbersString] =
      numbers.split(/\s+\|\s+/)
    const winningNumbers = new Set(winningNumbersString.split(/\s+/))
    const ticketNumbers = new Set(ticketNumbersString.split(/\s+/))

    const copiesWon = winningNumbers.intersection(ticketNumbers).size

    // Count the original card
    let totalCardsAdded = 1
    // For the last cards we know they won't win any other cards (i.e.
    // this loop won't run)
    for (let j = lineIndex + 1; j <= lineIndex + copiesWon; j++) {
      totalCardsAdded += cachedCopiesAmounts[j]
    }
    cachedCopiesAmounts[lineIndex] = totalCardsAdded

    totalCards += totalCardsAdded
  }

  return totalCards
}
