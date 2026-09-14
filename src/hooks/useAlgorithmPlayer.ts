import { useEffect, useReducer, useRef } from "react";
import type { SortAlgorithm, Step } from "../algorithms/types";

export type Highlight = {
  compared?: [number, number];
  swapped?: [number, number];
};

export type PlayerState = {
  // Kept around (never mutated after init) so RESET and STEP_BACK — both
  // of which need to rebuild state from scratch — have something to
  // rebuild from. The reducer has no other way to reach it, since it's a
  // module-level function with no closure over the hook's `initialArray`.
  initialArray: number[];
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
  // Source line (see Step['line'] in types.ts) of the most recently
  // applied step, for CodeView's current-line highlighting. null before
  // any step has been applied, or if the running algorithm hasn't been
  // annotated with line numbers.
  currentLine: number | null;
};

// TODO: design your action union. Some actions to consider:
// - one that pulls+applies a brand new step from the generator
// - one that moves stepIndex forward by replaying an already-buffered step
//   (distinct from pulling a new one — matters if the user steps back then
//   forward again without wanting to skip re-pulling from the generator)
// - one that moves stepIndex backward
// - play/pause/reset/setSpeed
type PlayerAction = | {type: "PULL_NEXT_STEP" ; step: Step} |  {type: "STEP_FORWARD"}  | {type: "STEP_BACK"} | {type: "PLAY"} | {type: "PAUSE"} | {type: "RESET"} | {type: "SET_SPEED"; speed: number}; // replace with your real union

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
): { array: number[]; highlight: Highlight; line: number | null } {
  const line = step.line ?? null;
  switch(step.type) {
    case 'compare':

      return {array, highlight: {compared: step.indices}, line}
    case 'swap':
      const copy = [...array];
      [copy[step.indices[0]], copy[step.indices[1]]] = [copy[step.indices[1]], copy[step.indices[0]]];
      return {array: copy,  highlight: {swapped: step.indices}, line}
    case 'overwrite':
      {
        const copy = [...array];
        copy[step.index] = step.value;
        return {array: copy, highlight: {}, line}

      }
    case 'done':
      return {array, highlight: {}, line}
  }
}

// Replays a sequence of Steps from scratch, starting at `initialArray`.
// Used by STEP_BACK (replay everything up to, but not including, the step
// you're backing away from) and RESET (replay zero steps — i.e. just
// return the untouched initial array). This is the "replay is easier than
// undo" idea: rather than inventing an inverse for swap/overwrite, we just
// recompute forward from the start every time we need an earlier state.
function replaySteps(
  initialArray: number[],
  steps: Step[],
): { array: number[]; highlight: Highlight; line: number | null } {
  let array = initialArray;
  let highlight: Highlight = {};
  let line: number | null = null;
  for (const step of steps) {
    ({ array, highlight, line } = applyStep(array, step));
  }
  return { array, highlight, line };
}

function reducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case "PULL_NEXT_STEP": {
      const { array, highlight, line } = applyStep(state.array, action.step);
      const isDone = action.step.type === "done";
      return {
        ...state,
        array,
        highlight,
        currentLine: line,
        isDone,
        // Only ever turn playback OFF here (when the algorithm reports
        // it's done). Never turn it on — that's PLAY's job alone.
        // Otherwise a single manual "Step" click while paused would look
        // like it started auto-playing.
        isPlaying: isDone ? false : state.isPlaying,
        steps: [...state.steps, action.step],
        stepIndex: state.stepIndex + 1,
      };
    }
    case "STEP_FORWARD": {
      // Replaying a step that's already sitting in the buffer (from an
      // earlier stepBack) — no need to touch the generator at all.
      const stepToReplay = state.steps[state.stepIndex];
      const { array, highlight, line } = applyStep(state.array, stepToReplay);
      return {
        ...state,
        array,
        highlight,
        currentLine: line,
        stepIndex: state.stepIndex + 1,
        isDone: stepToReplay.type === "done",
      };
    }
    case "STEP_BACK": {
      const newStepIndex = state.stepIndex - 1;
      const { array, highlight, line } = replaySteps(
        state.initialArray,
        state.steps.slice(0, newStepIndex),
      );
      return {
        ...state,
        array,
        highlight,
        currentLine: line,
        stepIndex: newStepIndex,
        isDone: false,
        isPlaying: false,
      };
    }
    case "PLAY":
      return {
        ...state,
        isPlaying: true,
      };
    case "PAUSE":
      return {
        ...state,
        isPlaying: false,
      };
    case "RESET":
      return {
        ...state,
        array: state.initialArray,
        highlight: {},
        currentLine: null,
        steps: [],
        stepIndex: 0,
        isPlaying: false,
        isDone: false,
        // Deliberately NOT resetting speed — that's a playback preference
        // the user set, not part of "where is the algorithm in its run."
      };
    case "SET_SPEED":
      return {
        ...state,
        speed: action.speed,
      };
    default:
      return state;
  }
}

function initPlayerState(initialArray: number[]): PlayerState {
  return {
    initialArray,
    array: initialArray,
    highlight: {},
    steps: [],
    stepIndex: 0,
    isPlaying: false,
    isDone: false,
    speed: 400,
    currentLine: null,
  };
}

export function useAlgorithmPlayer(
  initialArray: number[],
  algorithmFn: SortAlgorithm,
) {
  const [state, dispatch] = useReducer(reducer, initialArray, initPlayerState);

  // The live generator instance lives in a ref, NOT in reducer state.
  // Why: generators are stateful/imperative under the hood, and calling
  // `.next()` is a side effect that mutates the generator's internal
  // position — that's fundamentally not what React state is for. A ref
  // survives re-renders without triggering them and without needing to be
  // "pure," which is exactly the right fit here.
  const generatorRef = useRef<Generator<Step, void, unknown> | null>(null);
  if (generatorRef.current === null) {
    generatorRef.current = algorithmFn(initialArray);
  }

  function pullNextStep() {
    const generator = generatorRef.current;
    if (!generator) return;
    // NOTE: this `done` is the *JS generator protocol's* done flag (true
    // only once the generator function has actually returned, one call
    // AFTER it yields our own Step's `{ type: "done" }` sentinel) — not
    // the same thing as our Step union's `done` case. The two are easy to
    // conflate but answer different questions: "has the generator got any
    // more values at all" vs. "does this particular Step mean the sort
    // finished."
    const result = generator.next();
    if (!result.done) {
      dispatch({ type: "PULL_NEXT_STEP", step: result.value });
    }
  }

  function stepForward() {
    if (state.stepIndex < state.steps.length) {
      dispatch({ type: "STEP_FORWARD" });
    } else {
      pullNextStep();
    }
  }

  function stepBack() {
    if (state.stepIndex > 0) {
      dispatch({ type: "STEP_BACK" });
    }
  }

  function play() {
    dispatch({ type: "PLAY" });
  }

  function pause() {
    dispatch({ type: "PAUSE" });
  }

  function reset() {
    generatorRef.current = algorithmFn(initialArray);
    dispatch({ type: "RESET" });
  }

  function setSpeed(speed: number) {
    dispatch({ type: "SET_SPEED", speed });
  }

  // The play loop. While isPlaying, fire stepForward() every `speed` ms.
  //
  // This effect intentionally lists state.stepIndex/steps.length/speed as
  // dependencies, so it tears down and recreates the interval on every
  // single step. That sounds wasteful, but it's what sidesteps the classic
  // stale-closure gotcha: if this effect only depended on [isPlaying] and
  // set up ONE long-lived interval, the interval's callback would forever
  // see the `state` object from the render where the interval was created
  // — so it'd keep making its "pull a new step vs. replay a buffered one"
  // decision using stale, frozen stepIndex/steps values, and setSpeed()
  // wouldn't change its pace either, since the callback closed over the
  // original `speed`. Re-running this effect on every relevant state
  // change means the interval callback below always closes over the
  // CURRENT state. (An alternative fix, common in larger apps: keep a
  // ref that's always updated to the latest state, and read from the ref
  // inside a single long-lived interval instead of depending on state at
  // all — avoids the teardown/recreate cost, at the price of a bit more
  // indirection.)
  useEffect(() => {
    if (!state.isPlaying) return;
    const id = setInterval(stepForward, state.speed);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isPlaying, state.speed, state.stepIndex, state.steps.length]);

  return {
    array: state.array,
    highlight: state.highlight,
    isPlaying: state.isPlaying,
    isDone: state.isDone,
    stepIndex: state.stepIndex,
    totalSteps: state.steps.length,
    speed: state.speed,
    currentLine: state.currentLine,
    play,
    pause,
    stepForward,
    stepBack,
    reset,
    setSpeed,
  };
}
