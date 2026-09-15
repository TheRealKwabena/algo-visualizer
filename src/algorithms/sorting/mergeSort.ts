import type { SortAlgorithm, Step } from "../types";

// TODO: implement merge sort as a step-yielding generator.
//
// Merge sort's shape: split the range in half, recursively sort each
// half, then merge the two sorted halves back together.
//
// Structural hint — DON'T slice the array into new sub-arrays. Your
// Steps carry indices like [j, j+1] that the player interprets as
// positions in the ORIGINAL array, so a sliced sub-array's index 0
// wouldn't mean anything to it. Instead, write a private recursive
// helper that takes the shared working copy plus a (lo, hi) index
// range, e.g.:
//
//   function* sortRange(copy: number[], lo: number, hi: number): Generator<Step, void, unknown> {
//     if (hi - lo <= 1) return;  // 0 or 1 elements — already sorted
//     const mid = Math.floor((lo + hi) / 2);
//     yield* sortRange(copy, lo, mid);   // delegate — see the yield* note below
//     yield* sortRange(copy, mid, hi);
//     yield* merge(copy, lo, mid, hi);   // merge the two now-sorted halves
//   }
//
// Then your exported `mergeSort` just does:
//
//   export const mergeSort: SortAlgorithm = function* (array) {
//     const copy = [...array];
//     yield* sortRange(copy, 0, copy.length);
//     yield { type: 'done' };
//   };
//
// The yield* delegation: `yield* sortRange(...)` re-yields everything
// the recursive call yields, in order, as if it were written inline —
// that's what turns "many nested recursive calls" into "one flat Step
// stream" from the caller's point of view. Try the same non-sorting
// example the assistant showed you (flattening nested arrays with
// yield*) if this doesn't click yet.
//
// The merge step itself: you'll need a temp buffer (or copy the two
// halves out before overwriting) to compare elements from the left and
// right halves and write the smaller one into the next position — this
// is fundamentally an OVERWRITE, not a swap (same reasoning as
// insertionSort's shift: one slot receives a known value, nothing is
// being exchanged). yield {type: 'overwrite', index, value} for each
// write-back into the range.
//
// Rules, same as always:
// - yield 'compare' for each comparison between the two halves during
//   merge.
// - yield 'overwrite' for each write-back during merge.
// - yield a final 'done' step (once, at the top level — not per
//   recursive call).
export const mergeSort: SortAlgorithm = function* (
  array: number[],
): Generator<Step, void, unknown> {
  // your implementation here\\

  let copy = [...array]

  yield* sortRange(copy, 0, copy.length - 1)

  yield {type: 'done'}
};



function* sortRange(copy: number[], lo: number, hi: number) : Generator<Step, void, unknown> {
  if (lo >= hi) {
    return;
  }

  /// idea is to split the array into 2 until we have single items

  const mid = Math.floor((hi + lo) / 2)
  yield* sortRange(copy, lo, mid)
  yield* sortRange(copy, mid + 1, hi)
  yield* merge(copy, lo, mid, hi)

}


function* merge(copy: number[], lo: number, mid: number, hi: number): Generator<Step, void, unknown> {
  //[3, 1,4,  2, 6]

  // mid = 2 lo = 0, hi = 4
  //[3, 1, 4] [ 2, 6]

  //

  const left = copy.slice(lo, mid + 1)
  const right = copy.slice(mid + 1, hi + 1)


  let i = 0
  let j = 0

  let k = lo



  while (i < left.length && j < right.length) {
    yield {type : 'compare', indices:[lo + i, mid + 1 + j]}
    if (left[i] <= right[j]) {
      copy[k] = left[i]
      yield {type: 'overwrite', index: k, value: left[i]}
      k++
      i++


    } else {
      copy[k] = right[j]
      yield {type: 'overwrite', index: k, value: right[j]}
      k+= 1
      j+= 1

    }
  }

  while (i < left.length) {
    copy[k] = left[i]
    yield {type: 'overwrite', index: k, value: left[i]}
    k++
    i++
  }


  while (j < right.length) {
    copy[k] = right[j]
    yield {type: 'overwrite', index: k, value: right[j]}
    k++
    j++
  }

 
}