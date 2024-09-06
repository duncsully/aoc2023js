enum PART_ONE_MAXES {
  red = 12,
  green = 13,
  blue = 14,
}

export function day02_1(input: string) {
  const rows = input.split('\n').filter((row) => row.length > 0)

  const total = rows.reduce((acc, row) => {
    const [idPart, rest] = row.split(': ')
    const [, id] = idPart.split(' ')
    const cubeParts = rest.split(/[,;]\s/)

    const gameIsPossible = cubeParts.every((cubePart) => {
      const [stringAmount, color] = cubePart.split(' ')
      const amount = parseInt(stringAmount, 10)
      return amount <= PART_ONE_MAXES[color as keyof typeof PART_ONE_MAXES]
    })

    if (gameIsPossible) {
      return acc + parseInt(id, 10)
    }

    return acc
  }, 0)

  return total
}

export function day02_2(input: string) {
  const rows = input.split('\n').filter((row) => row.length > 0)

  const sum = rows.reduce((acc, row) => {
    // Ignore the game ID portion
    const [, rest] = row.split(': ')
    const cubeParts = rest.split(/[,;]\s/)

    return acc + getCubeSetPower(cubeParts)
  }, 0)

  return sum
}

function getCubeSetPower(cubeParts: string[]) {
  const colorMinAmounts = {
    red: 0,
    green: 0,
    blue: 0,
  } as Record<string, number>

  cubeParts.forEach((cubePart) => {
    const [stringAmount, color] = cubePart.split(' ')
    const amount = parseInt(stringAmount, 10)
    colorMinAmounts[color] = Math.max(amount, colorMinAmounts[color])
  })

  return Object.values(colorMinAmounts).reduce((acc, amount) => acc * amount, 1)
}
