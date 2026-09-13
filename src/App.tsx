import { ArrayView } from "./visualizers/ArrayView";
import "./App.css";

// Milestone 0: just prove ArrayView can turn numbers into bars.
// No algorithm, no state, no interactivity yet — that comes later.
const initialArray = [5, 2, 8, 1, 9, 3, 7, 4, 6];

function App() {
  return (
    <div className="app">
      <h1>Algorithm Visualizer</h1>
      <ArrayView values={initialArray} />
    </div>
  );
}

export default App;
