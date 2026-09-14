import type { SortAlgorithm, Step } from "../types";

// TODO: implement selection sort as a step-yielding generator, matching
// the same SortAlgorithm contract bubbleSort/insertionSort use.
//
// Selection sort's shape: for each position i (left to right), scan the
// *rest* of the array (i+1..end) to find the index of the minimum value,
// then swap it into position i — one swap per position, no matter how
// far the minimum has to travel.
//
// Same rules as before:
// - Work on a copy of `array`, don't mutate the parameter.
// - yield a 'compare' step for each comparison made while scanning for
//   the minimum.
// - yield a 'swap' step once per position (even if the minimum is
//   already in place — up to you whether you skip the swap step in that
//   case; either is defensible, think about which is more honest to what
//   "selection sort" actually does on that input).
// - yield a final 'done' step.
//
// Worth noticing once animated: selection sort's pattern looks very
// different from bubble/insertion — long scans, then one decisive jump,
// rather than many small local swaps.
//
// NOTE: the `line` numbers below are self-referential metadata for
// CodeView's current-line highlighting (see types.ts). They must match
// the actual line each yield sits on in THIS file — if you reformat or
// add/remove lines above a yield, update its `line` value to match.
export const selectionSort: SortAlgorithm = function* (
  array: number[],
): Generator<Step, void, unknown> {
  // your implementation here

  let copy = [...array];

  for (let i = 0; i < copy.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < copy.length; j++) {
      yield {type: 'compare', indices: [minIndex, j], line: 39};
      if (copy[j] < copy[minIndex]) {  // if the current element is less than the minimum, update the minimum index
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      yield {type: 'swap', indices: [i, minIndex], line: 45};
      [copy[i], copy[minIndex]] = [copy[minIndex], copy[i]];
    }
  }
  yield {type: 'done', line: 49};
};
