export function day01_1(input: string) {
  const rows = input.split('\n').filter((row) => row.length > 0)

  const total = rows.reduce((acc, row) => {
    const num = getNumber(row)

    return acc + num
  }, 0)
  return total
}

export function day01_2(input: string) {
  const rows = input.split('\n').filter((row) => row.length > 0)

  const total = rows.reduce((acc, row) => {
    const num = getNumberIncludingWords(row)

    return acc + num
  }, 0)
  return total
}

function getNumber(row: string) {
  const chars = row.split('')
  const first = chars.find(Number)!
  const last = chars.findLast(Number)!
  return parseInt(first + last, 10)
}

function getNumberIncludingWords(row: string) {
  const chars = row.split('')
  const first = getFirstNumber(chars)
  const last = getLastNumber(chars)
  return parseInt(first + last, 10)
}

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
