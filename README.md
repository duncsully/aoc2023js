[Advent of Code](https://adventofcode.com/) is a yearly event during December where you solve programming puzzles. This repo contains a super rudimentary website that accepts inputs to the puzzles and provides answers via my solutions implemented with JavaScript.

## Repo Structure

This repo was bootstrapped with a Vite+TS+Lit template. I chose Lit because it's a decent balance of being lightweight while also offering enough conveniences, though the site is simple enough that vanilla JS probably would have sufficed.

The main app code is located in aoc-app.ts, which sets up a web component that is loaded into index.html. It handles all of the app state and logic for loading puzzle solutions. The solutions themselves are added by day to the src/days folder, which are then used to generate the dropdown options in the UI. i.e. Options will be added as I implement solutions to each day and part.

## Running the App

To run the app, you'll need to have a relatively current version of Node.js installed. Then, you can run the following commands:

```bash
npm install
npm run dev
```
