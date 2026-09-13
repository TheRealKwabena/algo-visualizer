import type { Step } from "../types";

// Test-only helper: replays a stream of Steps against a copy of the input
// array and returns the final result. This lets us test "is the algorithm
// logic correct" without any React/DOM/animation involved. The *real*
// version of this idea (applied incrementally, one step at a time, for
// animation) is what you'll build as `applyStep` in useAlgorithmPlayer
// in the next milestone — this is a simpler, batch version just for tests.
export function applyAllSteps(initial: number[], steps: Step[]): number[] {
  const array = [...initial];
  for (const step of steps) {
    switch (step.type) {
      case "compare":
        break;
      case "swap": {
        const [i, j] = step.indices;
        [array[i], array[j]] = [array[j], array[i]];
        break;
      }
      case "overwrite":
        array[step.index] = step.value;
        break;
      case "done":
        break;
    }
  }
  return array;
}

export function collectSteps(generator: Generator<Step, void, unknown>): Step[] {
  return [...generator];
}
