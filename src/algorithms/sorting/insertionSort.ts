import type { SortAlgorithm, Step } from "../types";


// NOTE: the `line` numbers below are self-referential metadata for
// CodeView's current-line highlighting (see types.ts). They must match
// the actual line each yield sits on in THIS file — if you reformat or
// add/remove lines above a yield, update its `line` value to match.
export const insertionSort: SortAlgorithm = function* (
  array: number[],
): Generator<Step, void, unknown> {
  // your implementation here


  let copy = [...array];

  for (let i = 1; i < copy.length; i++) {
    const value = copy[i];
    let j = i - 1;
    while (j >= 0 && copy[j] > value) {
      yield {type: 'compare', indices: [j, j + 1], line: 20};
      copy[j + 1] = copy[j];
      yield {type: 'overwrite', index: j + 1, value: copy[j], line: 22};
      j--;
    }
    copy[j + 1] = value;
    yield {type: 'overwrite', index: j + 1, value: value, line: 26};
  }
  yield {type: 'done', line: 28};
};
