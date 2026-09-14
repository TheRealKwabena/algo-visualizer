import { bubbleSort } from "./algorithms/sorting/bubbleSort";
import { algorithmSource } from "./algorithms/sorting/source";
import { CodeView } from "./components/CodeView";
import { Controls } from "./components/Controls";
import { useAlgorithmPlayer } from "./hooks/useAlgorithmPlayer";
import { ArrayView } from "./visualizers/ArrayView";
import "./App.css";

const initialArray = [5, 2, 8, 1, 9, 3, 7, 4, 6];

function App() {
  const player = useAlgorithmPlayer(initialArray, bubbleSort);

  return (
    <div className="app">
      <h1>Algorithm Visualizer</h1>
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
      <CodeView source={algorithmSource.bubble} currentLine={player.currentLine} />
    </div>
  );
}

export default App;
