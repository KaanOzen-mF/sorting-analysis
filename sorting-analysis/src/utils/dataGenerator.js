/**
 * Random Data Generators for Sorting Analysis
 */

// Randomly ordered data
export const generateRandomArray = (size) => {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * size * 10)
  );
};

// Reverse ordered data
export const generateReverseArray = (size) => {
  return Array.from({ length: size }, (_, i) => size - i);
};

// Partially sorted data
export const generatePartiallySortedArray = (size) => {
  const arr = Array.from({ length: size }, (_, i) => i);
  const swapCount = Math.floor(size * 0.1); // 10% change rate

  for (let i = 0; i < swapCount; i++) {
    const idx1 = Math.floor(Math.random() * size);
    const idx2 = Math.floor(Math.random() * size);
    [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
  }
  return arr;
};

/**
 * Get dataset based on type and size
 */
export const getDataset = (type, size) => {
  switch (type) {
    case "random":
      return generateRandomArray(size);
    case "reverse":
      return generateReverseArray(size);
    case "partiallySorted":
      return generatePartiallySortedArray(size);
    default:
      return generateRandomArray(size);
  }
};
