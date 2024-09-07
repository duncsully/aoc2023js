import { splitLines } from '../utils'

/**
 * A good start. This was fairly elegant to implement in JS.
 */
export function day01_1(input: string) {
  const lines = splitLines(input)

  const total = lines.reduce((acc, row) => {
    const num = getNumber(row)

    return acc + num
  }, 0)
  return total
}

/**
 * Oof...OK, this wasn't so bad, still got it right on the first try. I remember coming up with
 * a solution previously in another language and just had to implement it in JS. I remembered a gotcha
 * was that a number spelled in words could lie within a string of characters that started off as another
 * potential number. So if I threw away the entire word candidate when it no longer could be a number,
 * I'd miss a valid word number. e.g. "fone", "threight", "seveight" start "four", "three", and "seven"
 * respectively, but switch to "one", "eight", and "eight" respectively. So to keep it general I kept
 * popping off the first character of the candidate until it was a valid word number again (or empty,
 * which always is) before proceeding. This could probably be optimized with n-gram models or something.
 *
 * It irked me a little to have highly repetitive code in getFirstNumber and getLastNumber, but I ultimately
 * decided against attempting to generalize the logic.
 */
export function day01_2(input: string) {
  const lines = splitLines(input)

  const total = lines.reduce((acc, row) => {
    const num = getNumberIncludingWords(row)

    return acc + num
  }, 0)
  return total
}

/**
 * Given a string, find the first and last digits, combining them to make a two digit number
 */
function getNumber(line: string) {
  const chars = line.split('')
  const first = chars.find(Number)!
  const last = chars.findLast(Number)!
  return parseInt(first + last, 10)
}

/**
 * Given a string, find the first and last digits either as numerals or as words and combine
 * them to make a two digit number
 * @param line
 * @returns
 */
function getNumberIncludingWords(line: string) {
  const chars = line.split('')
  const first = getFirstNumber(chars)
  const last = getLastNumber(chars)
  return parseInt(first + last, 10)
}

/**
 * Parse the first digit either in numeral form or as a word from a character array
 */
function getFirstNumber(chars: string[]) {
  let candidate = ''
  for (const char of chars) {
    if (Number(char)) {
      candidate = ''
      return char
    }
    candidate += char
    const index = digitWords.indexOf(candidate)
    if (index !== -1) {
      return (index + 1).toString()
    }
    while (!digitWords.some((word) => word.startsWith(candidate))) {
      candidate = candidate.slice(1)
    }
  }
  throw new Error('No number found')
}

/**
 * Parse the last digit either in numeral form or as a word from a character array
 * @param chars
 * @returns
 */
function getLastNumber(chars: string[]) {
  let candidate = ''
  for (let i = chars.length - 1; i >= 0; i--) {
    const char = chars[i]
    if (Number(char)) {
      candidate = ''
      return char
    }
    candidate = char + candidate
    const index = digitWords.indexOf(candidate)
    if (index !== -1) {
      return (index + 1).toString()
    }
    while (!digitWords.some((word) => word.endsWith(candidate))) {
      candidate = candidate.slice(0, -1)
    }
  }
  throw new Error('No number found')
}

const digitWords = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
]
