/**
 * Heap Sort Algorithm
 * Theoretical Complexity: O(n log n)
 */
export const heapSort = async (
  arr,
  left = 0,
  right = arr.length - 1,
  onSwap = null,
  ms = 0
) => {
  let n = right - left + 1;
  let offset = left;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(arr, n, i, offset, onSwap, ms);
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Move current root (largest element) to the end
    [arr[offset], arr[offset + i]] = [arr[offset + i], arr[offset]];

    if (onSwap) {
      onSwap([...arr], [offset, offset + i]);
      await new Promise((resolve) => setTimeout(resolve, ms));
    }

    // Run heapify on the remaining heap
    await heapify(arr, i, 0, offset, onSwap, ms);
  }
  return arr;
};

async function heapify(arr, n, i, offset, onSwap, ms) {
  let largest = i;
  let l = 2 * i + 1;
  let r = 2 * i + 2;

  if (l < n && arr[offset + l] > arr[offset + largest]) largest = l;
  if (r < n && arr[offset + r] > arr[offset + largest]) largest = r;

  if (largest !== i) {
    [arr[offset + i], arr[offset + largest]] = [
      arr[offset + largest],
      arr[offset + i],
    ];

    if (onSwap) {
      onSwap([...arr], [offset + i, offset + largest]);
      await new Promise((resolve) => setTimeout(resolve, ms));
    }

    await heapify(arr, n, largest, offset, onSwap, ms);
  }
}
