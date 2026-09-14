import { describe, expect, it } from "vitest";
import { mergeSort } from "../sorting/mergeSort";
import { applyAllSteps, collectSteps } from "./testUtils";

const fixtures: Array<[string, number[]]> = [
  ["empty array", []],
  ["single element", [1]],
  ["already sorted", [1, 2, 3, 4]],
  ["reverse sorted", [4, 3, 2, 1]],
  ["duplicates", [2, 2, 1, 1]],
  ["random", [5, 2, 8, 1, 9, 3, 7, 4, 6]],
];

describe("mergeSort", () => {
  it.each(fixtures)("sorts correctly: %s", (_label, input) => {
    const steps = collectSteps(mergeSort(input));
    const result = applyAllSteps(input, steps);
    const expected = [...input].sort((a, b) => a - b);
    expect(result).toEqual(expected);
  });

  it("ends with a done step", () => {
    const steps = collectSteps(mergeSort([3, 1, 2]));
    expect(steps.at(-1)).toMatchObject({ type: "done" });
  });

  it("yields exactly one done step, at the top level (not once per recursive call)", () => {
    const steps = collectSteps(mergeSort([5, 2, 8, 1, 9, 3, 7, 4, 6]));
    const doneSteps = steps.filter((step) => step.type === "done");
    expect(doneSteps).toHaveLength(1);
  });
});
