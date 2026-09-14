import { useState } from "react";
import { sortingAlgorithms } from "./algorithms/sorting";
import { AlgorithmPicker } from "./components/AlgorithmPicker";
import { SortingVisualizer } from "./components/SortingVisualizer";
import "./App.css";

const initialArray = [5, 2, 8, 1, 9, 3, 7, 4, 6];

function App() {
  const [selectedId, setSelectedId] = useState(sortingAlgorithms[0].id);
  const selected = sortingAlgorithms.find(
    (algorithm) => algorithm.id === selectedId,
  )!;

  return (
    <div className="app">
      <h1>Algorithm Visualizer</h1>
      <AlgorithmPicker
        algorithms={sortingAlgorithms}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <SortingVisualizer
        key={selectedId}
        initialArray={initialArray}
        algorithmFn={selected.run}
      />
    </div>
  );
}

export default App;
