# Algorithm Visualizer

A sorting algorithm visualizer, built to learn data structures & algorithms
by implementing them — not just to have a finished app. Each algorithm is
written as a generator function that yields `Step`s (compare/swap/overwrite),
which a playback engine replays as an animation. See
[`src/algorithms/types.ts`](src/algorithms/types.ts) for the core contract.

## Stack

React + TypeScript, scaffolded with Vite. Vitest for algorithm unit tests.

## Running locally

```sh
npm install
npm run dev      # start the dev server
npm test         # run algorithm correctness tests
```

## Build log

Each feature ships as its own issue → branch → PR, tracked on this repo.

- **Milestone 0** — app shell + hardcoded array rendered as static bars.
