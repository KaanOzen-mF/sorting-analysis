/**
 * Quick Sort algorithm
 * @param {Array} arr - Array to be sorted
 * @param {Function} onSwap - Callback for animation
 * @param {Number} ms - Animation speed
 */
export const quickSort = async (
  arr,
  left = 0,
  right = arr.length - 1,
  onSwap = null,
  ms = 10
) => {
  if (left >= right) return;

  const pivotIndex = await partition(arr, left, right, onSwap, ms);

  // Recursive calls
  await Promise.all([
    quickSort(arr, left, pivotIndex - 1, onSwap, ms),
    quickSort(arr, pivotIndex + 1, right, onSwap, ms),
  ]);

  return arr;
};

const partition = async (arr, left, right, onSwap, ms) => {
  const pivotValue = arr[right];
  let partitionIndex = left;

  for (let i = left; i < right; i++) {
    // Comparison
    if (arr[i] < pivotValue) {
      [arr[i], arr[partitionIndex]] = [arr[partitionIndex], arr[i]];

      if (onSwap) {
        onSwap([...arr], [i, partitionIndex]); // Send array and changed indices for visualization
        await new Promise((resolve) => setTimeout(resolve, ms));
      }
      partitionIndex++;
    }
  }

  // Place pivot in the correct position
  [arr[partitionIndex], arr[right]] = [arr[right], arr[partitionIndex]];
  if (onSwap) {
    onSwap([...arr], [partitionIndex, right]);
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  return partitionIndex;
};
