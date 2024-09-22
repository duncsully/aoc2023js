import { splitLines } from '../utils'

/**
 * This was a breath of fresh air after the last challenge. Anticipating what might lie ahead,
 * I decided to optimize the solution more than necessary (later extracted to a helper to reuse
 * for part 2).
 */
export function day06_1(input: string): string {
  const [timeLine, distanceLine] = splitLines(input)
  const times = timeLine.split(/\s+/).slice(1).map(Number)
  const distances = distanceLine.split(/\s+/).slice(1).map(Number)

  const product = times.reduce((acc, time, i) => {
    const distanceToBeat = distances[i]

    return acc * getWinningDistancesCount(time, distanceToBeat)
  }, 1)

  return product.toString()
}

/**
 * Yep, kinda figured this would be another optimization one. I was very pleased to see that
 * my previous solution worked just fine for this one. I extracted the logic into a helper
 * and then it was just a matter of parsing the input slightly differently.
 */
export function day06_2(input: string): string {
  const [timeLine, distanceLine] = splitLines(input)
  // Times when I like JavaScript
  const time = +timeLine.split(/\s+/).slice(1).join('')
  const distance = +distanceLine.split(/\s+/).slice(1).join('')

  return getWinningDistancesCount(time, distance).toString()
}

function getWinningDistancesCount(time: number, distanceToBeat: number) {
  // 0 will always result in 0, not worth checking.
  // Since we're essentially calculating areas of rectangles, we only need to check
  // up to half the time value. And then since areas increase, we can assume that
  // the remaining combinations will be even better, so we just have to count how
  // many weren't winning combinations and double that amount to subtract from the
  // total time (plus 1 to account for the 0 index).
  for (let i = 1; i < time / 2; i++) {
    const distance = i * (time - i)
    if (distance > distanceToBeat) {
      return time + 1 - i * 2
    }
  }
  return 0
}

/*
0 * 7 = 0
1 * 6 = 6
2 * 5 = 10
3 * 4 = 12
4 * 3 = 12
5 * 2 = 10
6 * 1 = 6
7 * 0 = 0
*/
