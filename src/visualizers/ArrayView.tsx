import "./ArrayView.css";

type ArrayViewProps = {
  values: number[];
};

// TODO (Milestone 0 — you write this):
// Render one bar per entry in `values`. Map each number to a div's height
// (or width, if you'd rather go horizontal) so bigger numbers look taller.
//
// Hints, not answers:
// - You'll want to `.map()` over `values` with index, and give each
//   rendered element a `key`.
// - Height in px/% needs *some* number to scale against — think about
//   what "100% tall" should mean relative to the values you're given.
// - Keep this component dumb: it only knows about `values` right now.
//   No algorithm knowledge, no highlighting yet — that's a later milestone.
export function ArrayView({ values }: ArrayViewProps) {
  return <div className="array-view">{/* your bars go here */}</div>;
}
