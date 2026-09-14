import { useEffect, useReducer, useRef } from "react";
import type { SortAlgorithm, Step } from "../algorithms/types";

export type Highlight = {
  compared?: [number, number];
  swapped?: [number, number];
};

export type PlayerState = {
  array: number[];
  highlight: Highlight;
  // Every Step yielded so far, in order. Buffering these (rather than
  // discarding each after applying it) is what makes stepBack/scrub
  // possible later without re-running the algorithm.
  steps: Step[];
  // How many of `steps` have been applied to `array` so far. Not
  // necessarily steps.length — you can be "3 steps behind" if the user
  // stepped back.
  stepIndex: number;
  isPlaying: boolean;
  isDone: boolean;
  speed: number; // ms delay between steps during play()
};

// TODO: design your action union. Some actions to consider:
// - one that pulls+applies a brand new step from the generator
// - one that moves stepIndex forward by replaying an already-buffered step
//   (distinct from pulling a new one — matters if the user steps back then
//   forward again without wanting to skip re-pulling from the generator)
// - one that moves stepIndex backward
// - play/pause/reset/setSpeed
type PlayerAction = never; // replace with your real union

// The single place a Step is allowed to change array/highlight state.
// compare -> array unchanged, just record which indices are being looked at
// swap    -> swap the two indices in the array
// overwrite -> set one index to a value
// done    -> no array change; caller marks isDone separately
//
// TODO: implement this.
function applyStep(
  array: number[],
  step: Step,
): { array: number[]; highlight: Highlight } {
  throw new Error("not implemented");
}

// TODO: implement the reducer. Handle each PlayerAction case, using
// applyStep wherever a Step needs to be turned into new array/highlight
// state. Remember reducers must be pure — no side effects (no calling
// generator.next() in here; that happens outside, see below).
function reducer(state: PlayerState, action: PlayerAction): PlayerState {
  throw new Error("not implemented");
}

export function useAlgorithmPlayer(
  initialArray: number[],
  algorithmFn: SortAlgorithm,
) {
  // TODO: useReducer, seeded from initialArray (steps: [], stepIndex: 0,
  // isPlaying: false, isDone: false, speed: some default like 400).

  // The live generator instance lives in a ref, NOT in reducer state.
  // Why: generators are stateful/imperative under the hood, and calling
  // `.next()` is a side effect that mutates the generator's internal
  // position — that's fundamentally not what React state is for. A ref
  // survives re-renders without triggering them and without needing to be
  // "pure," which is exactly the right fit here.
  const generatorRef = useRef<Generator<Step, void, unknown> | null>(null);
  // TODO: initialize generatorRef.current = algorithmFn(initialArray)
  // (e.g. lazily on first render, and again inside reset()).

  // TODO: pullNextStep() — calls generatorRef.current.next(); if it's not
  // done, dispatch an action that appends the yielded step to `steps` and
  // applies it via applyStep.

  // TODO: stepForward() — if stepIndex === steps.length (nothing buffered
  // ahead), call pullNextStep(). Otherwise, just replay steps[stepIndex]
  // via applyStep and advance stepIndex — no need to touch the generator.

  // TODO: stepBack() — if stepIndex > 0, decrement stepIndex and recompute
  // array/highlight by replaying steps[0..stepIndex-1] from initialArray
  // (simplest correct approach — don't try to "undo" a swap).

  // TODO: a useEffect that runs the play loop: while state.isPlaying, call
  // stepForward() every state.speed ms (setInterval or repeated setTimeout),
  // and clear it on cleanup (unmount, isPlaying flips false, or speed
  // changes). This is the classic gotcha: if you set up the interval once
  // and it closes over the `speed` value from that render, changing speed
  // mid-play via setSpeed() won't actually change the interval's pace
  // unless this effect re-runs when `speed` changes (put `speed` in the
  // effect's dependency array) or you read the current speed via a ref.

  // TODO: play(), pause(), reset(), setSpeed(ms) — thin dispatchers.

  return {
    // array: state.array,
    // highlight: state.highlight,
    // isPlaying: state.isPlaying,
    // isDone: state.isDone,
    // stepIndex: state.stepIndex,
    // totalSteps: state.steps.length,
    // play, pause, stepForward, stepBack, reset, setSpeed,
  };
}
