import { describe, expect, it } from "vitest";
import { bubbleSort } from "../sorting/bubbleSort";
import { applyAllSteps, collectSteps } from "./testUtils";

const fixtures: Array<[string, number[]]> = [
  ["empty array", []],
  ["single element", [1]],
  ["already sorted", [1, 2, 3, 4]],
  ["reverse sorted", [4, 3, 2, 1]],
  ["duplicates", [2, 2, 1, 1]],
  ["random", [5, 2, 8, 1, 9, 3, 7, 4, 6]],
];

describe("bubbleSort", () => {
  it.each(fixtures)("sorts correctly: %s", (_label, input) => {
    const steps = collectSteps(bubbleSort(input));
    const result = applyAllSteps(input, steps);
    const expected = [...input].sort((a, b) => a - b);
    expect(result).toEqual(expected);
  });

  it("ends with a done step", () => {
    const steps = collectSteps(bubbleSort([3, 1, 2]));
    // toMatchObject, not toEqual: a done step may also carry an optional
    // `line` field (see types.ts) that this test doesn't care about.
    expect(steps.at(-1)).toMatchObject({ type: "done" });
  });
});
