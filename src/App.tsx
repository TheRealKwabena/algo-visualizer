import { bubbleSort } from "./algorithms/sorting/bubbleSort";
import { useAlgorithmPlayer } from "./hooks/useAlgorithmPlayer";
import { ArrayView } from "./visualizers/ArrayView";
import "./App.css";

// Milestone 2: temporary wiring to exercise useAlgorithmPlayer while you
// build it. This gets replaced by real Controls UI in the next milestone.
const initialArray = [5, 2, 8, 1, 9, 3, 7, 4, 6];

function App() {
  const player = useAlgorithmPlayer(initialArray, bubbleSort);

  return (
    <div className="app">
      <h1>Algorithm Visualizer</h1>
      <ArrayView values={player.array ?? initialArray} />
      <button type="button" onClick={() => player.stepForward?.()}>
        Step
      </button>
    </div>
  );
}

export default App;
