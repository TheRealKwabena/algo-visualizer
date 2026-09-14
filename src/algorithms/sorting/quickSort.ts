import type { SortAlgorithm, Step } from "../types";

// TODO: implement quick sort as a step-yielding generator.
//
// Quick sort's shape: pick a pivot, partition the range so everything
// smaller than the pivot ends up left of it and everything larger ends
// up right of it (via swaps), then recursively sort the two partitions.
//
// Same structural approach as mergeSort — a private recursive helper
// taking the shared working copy plus a (lo, hi) index range, so
// indices stay absolute (positions in the real array) instead of
// relative to a sliced sub-array:
//
//   function* sortRange(copy: number[], lo: number, hi: number): Generator<Step, void, unknown> {
//     if (hi - lo <= 1) return;
//     const pivotIndex = yield* partition(copy, lo, hi);  // partition, then delegate — see below
//     yield* sortRange(copy, lo, pivotIndex);
//     yield* sortRange(copy, pivotIndex + 1, hi);
//   }
//
// One wrinkle worth noticing: `partition` needs to both yield Steps
// AND return a value (the pivot's final index) back to its caller —
// generators can do this (a `return value;` inside a generator becomes
// the `.value` on the final `{done: true}` result), and `yield*` used
// as an EXPRESSION (not just a statement) evaluates to whatever that
// nested generator returned. That's the `const pivotIndex = yield* ...`
// line above — try a tiny standalone example of this pattern if it's
// not clicking (a generator that yields a couple of numbers then
// `return`s a final one; delegate to it with `const x = yield* gen()`
// and log `x`).
//
// Rules, same as always:
// - yield 'compare' when checking an element against the pivot.
// - yield 'swap' for each actual swap during partitioning (this one
//   IS a real swap — two elements genuinely trade positions).
// - yield a final 'done' step (once, at the top level).
export const quickSort: SortAlgorithm = function* (
  array: number[],
): Generator<Step, void, unknown> {
  // your implementation here
};
