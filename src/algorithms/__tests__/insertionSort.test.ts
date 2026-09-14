import { describe, expect, it } from "vitest";
import { insertionSort } from "../sorting/insertionSort";
import { applyAllSteps, collectSteps } from "./testUtils";

const fixtures: Array<[string, number[]]> = [
  ["empty array", []],
  ["single element", [1]],
  ["already sorted", [1, 2, 3, 4]],
  ["reverse sorted", [4, 3, 2, 1]],
  ["duplicates", [2, 2, 1, 1]],
  ["random", [5, 2, 8, 1, 9, 3, 7, 4, 6]],
];

describe("insertionSort", () => {
  it.each(fixtures)("sorts correctly: %s", (_label, input) => {
    const steps = collectSteps(insertionSort(input));
    const result = applyAllSteps(input, steps);
    const expected = [...input].sort((a, b) => a - b);
    expect(result).toEqual(expected);
  });

  it("ends with a done step", () => {
    const steps = collectSteps(insertionSort([3, 1, 2]));
    expect(steps.at(-1)).toEqual({ type: "done" });
  });
});
