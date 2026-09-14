import type { SortAlgorithm } from "../algorithms/types";
import { useAlgorithmPlayer } from "../hooks/useAlgorithmPlayer";
import { ArrayView } from "../visualizers/ArrayView";
import { CodeView } from "./CodeView";
import { Controls } from "./Controls";

type SortingVisualizerProps = {
  initialArray: number[];
  algorithmFn: SortAlgorithm;
  source: string;
};

// Deliberately kept dumb about *which* algorithm it's running — App.tsx
// mounts this with `key={selectedId}`, so React fully remounts (and thus
// re-initializes useAlgorithmPlayer's state/generator from scratch) any
// time the selected algorithm changes, rather than this component having
// to manually detect the change and reset itself.
export function SortingVisualizer({
  initialArray,
  algorithmFn,
  source,
}: SortingVisualizerProps) {
  const player = useAlgorithmPlayer(initialArray, algorithmFn);

  return (
    <>
      <ArrayView values={player.array} highlight={player.highlight} />
      <Controls
        isPlaying={player.isPlaying}
        isDone={player.isDone}
        stepIndex={player.stepIndex}
        totalSteps={player.totalSteps}
        speed={player.speed}
        onPlay={player.play}
        onPause={player.pause}
        onStepForward={player.stepForward}
        onStepBack={player.stepBack}
        onReset={player.reset}
        onSpeedChange={player.setSpeed}
      />
      <CodeView source={source} currentLine={player.currentLine} />
    </>
  );
}
