import { useEffect, useRef } from "react";
import "./CodeView.css";

type CodeViewProps = {
  source: string;
  currentLine: number | null;
};

export function CodeView({ source, currentLine }: CodeViewProps) {
  const lines = source.split("\n");
  const currentLineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    currentLineRef.current?.scrollIntoView({ block: "center" });
  }, [currentLine]);

  return (
    <pre className="code-view">
      <code>
        {lines.map((lineText, index) => {
          const lineNumber = index + 1;
          const isCurrent = lineNumber === currentLine;
          return (
            <div
              key={lineNumber}
              ref={isCurrent ? currentLineRef : null}
              className={
                isCurrent ? "code-view__line code-view__line--current" : "code-view__line"
              }
            >
              <span className="code-view__line-number">{lineNumber}</span>
              <span className="code-view__line-text">{lineText}</span>
            </div>
          );
        })}
      </code>
    </pre>
  );
}
