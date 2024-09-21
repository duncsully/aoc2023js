/**
 * Oh boy... This feels like the first "real" AoC challenge where there is a lot to possibly go wrong.
 * Looking at the data, it seems like the maps will always follow sequentially, so I don't actually
 * need to generate the maps until I need them. I can just generate them as I go.
 *
 * OK, that wasn't so bad actually. I got it on my first attempt. I realized that I could just store the
 * start and end values, and then apply the difference between the source and destination for that range.
 * Then it was as simple as searching the arrays for the right range or defaulting to a difference of 0.
 * I just had to repeat this for each map, and then it was as simple as using Math.min to find the lowest value.
 *
 * I ended up just settling for a find on each iteration. A potential optimization would be to sort the
 * maps by start value and then use a binary search to find the correct range for each transformation.
 * But I don't know if that would be a huge difference (or even a positive difference) for this size of input.
 */
export function day05_1(input: string): string {
  const [seedsString, ...mapsStrings] = input.split('\n\n')
  let [, ...seeds] = seedsString.split(' ').map(Number)

  const locations = mapSeedsToLocations(seeds, mapsStrings)
  const lowestLocationValue = Math.min(...locations)

  return lowestLocationValue.toString()
}

function mapSeedsToLocations(seeds: number[], mapsStrings: string[]): number[] {
  let toMapValues = [...seeds]

  mapsStrings.forEach((mapString) => {
    const [, ...lines] = mapString.split('\n')
    const transforms = lines.map((line) => {
      const [destination, source, range] = line.split(' ').map(Number)
      return {
        start: source,
        end: source + range,
        difference: destination - source,
      } as const
    })

    toMapValues = toMapValues.map((value) => {
      const { difference } = transforms.find(
        ({ start, end }) => start <= value && value < end
      ) ?? { difference: 0 }
      return value + difference
    })
  })

  return toMapValues
}

/**
 * Ugh, not gonna lie, this one did me in for a while. At first I thought I could just do mostly
 * the same thing except I'd generate all of the seeds up front and pass them into the common utility
 * function. That worked for the example but my browser choked on the real input of course. In hindsight
 * I shouldn't have expected the millions to billions of seeds to process.
 *
 * I knew I needed to optimize my approach but couldn't quite figure out how. Eventually I figured that after
 * all the mappings were applied, ultimately there would be a final delta value relative to the seed value.
 * I figured I could find all of the sub-ranges of seeds with the same delta and then simply find the
 * lowest start + delta = location value from all the sub-ranges. It took a lot of trial and error to
 * get the logic right. I even decided to add a unit test at this point to validate my solutions worked for
 * the example each step along the way. Honestly, I got sick of this one and probably didn't clean up the
 * code or comments as much as I should have.
 */

export function day05_2(input: string): string {
  const [seedsString, ...mapsStrings] = input.split('\n\n')
  let [, ...seeds] = seedsString.split(' ').map(Number)
  const seedRanges: [number, number][] = []
  for (let i = 0; i < seeds.length; i += 2) {
    seedRanges.push([seeds[i], seeds[i] + seeds[i + 1]])
  }
  const transformsList = makeTransforms(mapsStrings)
  const lowestLocations = getLowestLocationsForSubRanges(
    seedRanges,
    transformsList
  )
  const lowestLocation = Math.min(...lowestLocations)

  return lowestLocation.toString()
}

type Transform = {
  start: number
  end: number
  delta: number
}

function makeTransforms(mapsStrings: string[]): Transform[][] {
  return mapsStrings.map((mapString) => {
    const [, ...lines] = mapString.split('\n')
    return lines.map((line) => {
      const [destination, source, range] = line.split(' ').map(Number)
      return {
        start: source,
        end: source + range,
        delta: destination - source,
      } as const
    })
    //.sort((a, b) => a.start - b.start)
  })
}

/**
 * Given an array of transforms arrays (a pipeline), find each seed sub-range that has the same delta,
 * picking the lowest possible location value for each sub-range.
 * @param transformsList
 * @returns
 */
function getLowestLocationsForSubRanges(
  seedRanges: [number, number][],
  transformsList: Transform[][]
): number[] {
  let currentSeedRange = 0
  let subStart = seedRanges[currentSeedRange][0]
  const locations = []
  while (subStart !== undefined) {
    // The range of the current seed sub-range, which by
    // default is the remaining range of the original input seed range
    let subRange = seedRanges[currentSeedRange][1] - subStart
    let totalDelta = 0
    let value = subStart
    transformsList.forEach((transforms) => {
      const match = transforms.find(
        (transform) => transform.start <= value && value < transform.end
      )
      if (match) {
        // If we have 10-20 -> 30-40, but value is 15, then the effective range is 5.
        // Take the smallest range. Then we sum the delta with the total delta.
        // Finally set set the value for the next mapping.
        subRange = Math.min(subRange, match.end - value)
        totalDelta += match.delta
        value += match.delta
      } else {
        // No match, find the next start value and set the range to that, no delta
        const next = transforms.find(({ start }) => start > value)
        if (next) {
          subRange = Math.min(subRange, next.start - value)
        }
      }
    })
    // i.e. the lowest possible location value for this seed sub-range
    locations.push(subStart + totalDelta)

    const subEnd = subStart + subRange
    // If the sub-range end is still within the current seed range, set the next sub start to
    // the current sub end to continue
    if (subEnd < seedRanges[currentSeedRange][1]) {
      subStart = subEnd
      // Otherwise, move to the next seed range and set the next sub start to the start of that range
    } else {
      currentSeedRange++
      subStart = seedRanges[currentSeedRange]?.[0]
    }
  }

  return locations
}
