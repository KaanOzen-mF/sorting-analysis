import { useState, useEffect } from "react";
import { getDataset } from "../utils/dataGenerator";
import { measurePerformance } from "../utils/performanceTracker";
import { quickSort } from "../algorithms/quickSort";
import { heapSort } from "../algorithms/heapSort";
import { mergeSort } from "../algorithms/mergeSort";
import { shellSort } from "../algorithms/shellSort";
import { radixSort } from "../algorithms/radixSort";

export const useSorting = (initialSize, initialType) => {
  const [array, setArray] = useState([]);
  const [size, setSize] = useState(initialSize);
  const [type, setType] = useState(initialType);
  const [history, setHistory] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [activeIndices, setActiveIndices] = useState([]);
  const [selectedAlgo, setSelectedAlgo] = useState("quick");

  const algorithms = {
    quick: { fn: quickSort, name: "Quick Sort" },
    heap: { fn: heapSort, name: "Heap Sort" },
    merge: { fn: mergeSort, name: "Merge Sort" },
    shell: { fn: shellSort, name: "Shell Sort" },
    radix: { fn: radixSort, name: "Radix Sort" },
  };

  const handleGenerate = () => {
    const newArray = getDataset(type, size);
    setArray(newArray);
    setActiveIndices([]);
  };

  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAlgo, size, type]);

  const runAnalysis = async () => {
    if (!array || array.length === 0) return;
    setIsSorting(true);
    const current = algorithms[selectedAlgo];

    try {
      if (size <= 200) {
        await current.fn(
          [...array],
          0,
          array.length - 1,
          (tempArray, indices) => {
            setArray(tempArray);
            setActiveIndices(indices);
          },
          30
        );
      }
      const data = await measurePerformance(current.fn, array);
      setHistory((prev) => [
        ...prev,
        { ...data, size, type, algorithm: current.name },
      ]);
      setArray(data.sortedArray);
      setActiveIndices([]);
    } catch (error) {
      console.error("Sorting error:", error);
    } finally {
      setIsSorting(false);
    }
  };

  return {
    array,
    setArray,
    size,
    setSize,
    type,
    setType,
    history,
    isSorting,
    activeIndices,
    selectedAlgo,
    setSelectedAlgo,
    handleGenerate,
    runAnalysis,
  };
};
