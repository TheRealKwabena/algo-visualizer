import type { Highlight } from "../hooks/useAlgorithmPlayer";
import "./ArrayView.css";

type ArrayViewProps = {
  values: number[];
  highlight?: Highlight;
};

export function ArrayView({ values, highlight }: ArrayViewProps) {
  const max = Math.max(...values);

  return (
    <div className="array-view">
      {values.map((value, index) => {
        const isCompared = highlight?.compared?.includes(index) ?? false;
        const isSwapped = highlight?.swapped?.includes(index) ?? false;
        const className = [
          "bar",
          isCompared && "bar--compared",
          isSwapped && "bar--swapped",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div
            className={className}
            key={index}
            style={{ height: `${(value / max) * 100}%` }}
          >
            {value}
          </div>
        );
      })}
    </div>
  );
}
