import type { SortAlgorithm, Step } from "../types";

// TODO: implement insertion sort as a step-yielding generator, matching
// the same SortAlgorithm contract bubbleSort uses.
//
// Insertion sort's shape: starting from index 1, take each element and
// walk it backward through the already-sorted prefix (indices 0..i-1),
// shifting larger elements right, until it lands in its correct spot.
//
// Same rules as bubbleSort:
// - Work on a copy of `array`, don't mutate the parameter.
// - yield a 'compare' step for each comparison.
// - yield a 'swap' step for each actual swap.
// - yield a final 'done' step.
//
// Worth noticing once you've built it and can see it animate: insertion
// sort does a lot fewer comparisons than bubble sort on a *nearly sorted*
// array — bubble sort doesn't know to stop early like that.
export const insertionSort: SortAlgorithm = function* (
  array: number[],
): Generator<Step, void, unknown> {
  // your implementation here
};
