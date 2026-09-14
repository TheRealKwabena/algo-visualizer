import type { SortAlgorithm } from "../types";
import { bubbleSort } from "./bubbleSort";
import { insertionSort } from "./insertionSort";
import { mergeSort } from "./mergeSort";
import { quickSort } from "./quickSort";
import { selectionSort } from "./selectionSort";

export type AlgorithmEntry = {
  id: string;
  label: string;
  run: SortAlgorithm;
};

// The registry: adding a new algorithm means adding one entry here, and
// nothing else — AlgorithmPicker and App never branch on which algorithms
// exist.
export const sortingAlgorithms: AlgorithmEntry[] = [
  { id: "bubble", label: "Bubble Sort", run: bubbleSort },
  { id: "insertion", label: "Insertion Sort", run: insertionSort },
  { id: "selection", label: "Selection Sort", run: selectionSort },
  { id: "merge", label: "Merge Sort", run: mergeSort },
  { id: "quick", label: "Quick Sort", run: quickSort },
];
