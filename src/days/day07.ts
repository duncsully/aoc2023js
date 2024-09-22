import { splitLines } from '../utils'

/**
 * Alright, not too bad. Again I'm a little concerned this is going to become another performance
 * sensitive day, but this wasn't too difficult to at least somewhat optimize.
 */
export function day07_1(input: string, withJokers = false): string {
  const lines = splitLines(input)

  const hands = lines.map((line) => {
    const [handString, bidString] = line.split(' ')
    const hand = handString
      .split('')
      .map((card) =>
        withJokers
          ? cardValuesWithJokers[card as Card]
          : cardValues[card as Card]
      )
    const bid = +bidString
    return { hand, bid }
  })

  hands.sort(
    (a, b) =>
      rankHand(a.hand) - rankHand(b.hand) ||
      compareSameRankedHands(a.hand, b.hand)
  )

  const winningAmount = hands.reduce((acc, { bid }, i) => {
    return acc + bid * (i + 1)
  }, 0)

  return winningAmount.toString()
}

/**
 * Hmm, interesting. The majority of the logic doesn't change, I actually
 * ended up just adding an additional parameter to the original solution
 * to alter behavior with jokers. This also simplified the hand ranking
 * function when I sorted the card count arrays in order to figure out what
 * to add the jokers to. The one major bug I ran into was for a hand of all
 * jokers, which I had to create a special case for.
 */
export function day07_2(input: string): string {
  return day07_1(input, true)
}

function countCards(hand: number[]): number[] {
  const countsObj = hand.reduce((acc, card) => {
    acc[card] ??= 0
    acc[card]++
    return acc
  }, {} as Record<number, number>)
  const jokerCount = countsObj[0] ?? 0
  // Special case if all cards are jokers
  if (jokerCount === 5) return [5]
  delete countsObj[0]
  const counts = Object.values(countsObj).sort((a, b) => b - a)
  counts[0] += jokerCount
  return counts
}

function rankHand(hand: number[]): number {
  const cardCounts = countCards(hand)

  // Five of a kind
  if (cardCounts[0] === 5) return 7
  // Four of a kind
  if (cardCounts[0] === 4) return 6
  // Full house
  if (cardCounts[0] === 3 && cardCounts[1] === 2) return 5
  // Three of a kind
  if (cardCounts[0] === 3) return 4
  // Two pair (only need to check for the second pair by process of elimination)
  if (cardCounts[1] === 2) return 3
  // One pair
  if (cardCounts[0] === 2) return 2
  // High card
  return 1
}

function compareSameRankedHands(
  hand1: number[],
  hand2: number[],
  i = 0
): number {
  // All cards are the same, so the hands are equal
  if (i === hand1.length) return 0
  return hand1[i] - hand2[i] || compareSameRankedHands(hand1, hand2, i + 1)
}

const cardValues = {
  A: 13,
  K: 12,
  Q: 11,
  J: 10,
  T: 9,
  '9': 8,
  '8': 7,
  '7': 6,
  '6': 5,
  '5': 4,
  '4': 3,
  '3': 2,
  '2': 1,
} as const

const cardValuesWithJokers = {
  ...cardValues,
  J: 0,
}

type Card = keyof typeof cardValues
