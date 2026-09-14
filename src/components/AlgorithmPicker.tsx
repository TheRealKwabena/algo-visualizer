import type { AlgorithmEntry } from "../algorithms/sorting";
import "./AlgorithmPicker.css";

type AlgorithmPickerProps = {
  algorithms: AlgorithmEntry[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function AlgorithmPicker({
  algorithms,
  selectedId,
  onSelect,
}: AlgorithmPickerProps) {
  return (
    <select
      className="algorithm-picker"
      value={selectedId}
      onChange={(event) => onSelect(event.target.value)}
    >
      {algorithms.map((algorithm) => (
        <option key={algorithm.id} value={algorithm.id}>
          {algorithm.label}
        </option>
      ))}
    </select>
  );
}
