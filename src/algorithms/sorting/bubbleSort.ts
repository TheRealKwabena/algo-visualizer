import type { SortAlgorithm, Step } from "../types";

// TODO (Milestone 1 — you write this):
// Implement bubble sort as a generator function. Instead of returning a
// sorted array, this function *yields* a Step each time something
// interesting happens, then pauses until the caller asks for the next one.
//
// Bubble sort's classic shape (fill in the real logic, this is just the
// skeleton):
//
//   for each pass through the array:
//     for each adjacent pair (i, i+1) not yet settled:
//       yield a 'compare' step for (i, i+1)
//       if array[i] > array[i+1]:
//         actually swap them in your local copy
//         yield a 'swap' step for (i, i+1)
//   yield a 'done' step at the very end
//
// Things to think about:
// - You're given `array` but shouldn't mutate the caller's array directly —
//   work on a copy.
// - A `Step` only carries *indices*, not values (see types.ts) — the
//   caller is responsible for actually applying the swap to whatever
//   array *it's* tracking. But your generator still needs to track the
//   current state of *its own* copy correctly, so subsequent comparisons
//   are against the right values.
// - Bubble sort's optimization: after pass k, the last k elements are
//   guaranteed sorted — you don't need to compare into them again.
export const bubbleSort: SortAlgorithm = function* (array: number[]): Generator<Step, void, unknown> {
  // your implementation here
};
