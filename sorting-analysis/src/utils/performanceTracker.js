/**
 * Time and memory performance tracker for sorting algorithms.
 * Measures execution time and memory usage of the provided sorting function.
 */

import { quickSort } from "../algorithms/quickSort";

export const measurePerformance = async (sortFunction, array) => {
  // Create a copy of the original array to avoid modifying it (Important for analyzing In-place vs Additional memory)
  const arrayCopy = [...array];

  // Get start values
  const startTime = performance.now();

  // Memory measurement (if supported), trigger garbage collection if possible
  const startMemory = performance.memory
    ? performance.memory.usedJSHeapSize
    : 0;

  // Run the algorithm
  await quickSort(arrayCopy, 0, arrayCopy.length - 1, null, 0);

  // Get end values
  const endTime = performance.now();
  const endMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;

  return {
    time: parseFloat((endTime - startTime).toFixed(4)), // time in ms
    memory: Math.max(0, endMemory - startMemory), // additional memory usage in bytes
    sortedArray: arrayCopy,
  };
};
