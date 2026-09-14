// The vocabulary every sorting algorithm speaks. An algorithm never touches
// the array directly during a run — it only *describes* what it wants to
// happen, one Step at a time. Something else (a reducer in the playback
// hook, in a later milestone) is responsible for actually applying it.
// `line` is optional source-line metadata (1-indexed) used only by
// CodeView to highlight which line of the algorithm's source produced
// this step — it has no effect on sorting logic. Set by the yield sites
// themselves; not present on Steps from an algorithm that hasn't been
// annotated yet.
export type Step =
  | { type: "compare"; indices: [number, number]; line?: number }
  | { type: "swap"; indices: [number, number]; line?: number }
  | { type: "overwrite"; index: number; value: number; line?: number }
  | { type: "done"; line?: number };

// Every sorting algorithm has this exact shape: give it an array, get back
// a generator that yields Steps lazily. Nothing that *consumes* a
// SortAlgorithm (a picker, a player, a race view) ever needs to know which
// algorithm it's holding — they all satisfy this one contract.
export type SortAlgorithm = (array: number[]) => Generator<Step, void, unknown>;
