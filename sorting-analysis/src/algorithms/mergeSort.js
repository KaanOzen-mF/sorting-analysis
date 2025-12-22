/**
 * Merge Sort Algorithm
 * Theoretical Time Complexity: O(n log n)
 * Theoretical Space Complexity: O(n)
 */
export const mergeSort = async (
  arr,
  left = 0,
  right = arr.length - 1,
  onSwap = null,
  ms = 0
) => {
  if (left >= right) return;

  const mid = Math.floor(left + (right - left) / 2);

  // Divide
  await mergeSort(arr, left, mid, onSwap, ms);
  await mergeSort(arr, mid + 1, right, onSwap, ms);

  // Merge
  await merge(arr, left, mid, right, onSwap, ms);

  return arr;
};

async function merge(arr, left, mid, right, onSwap, ms) {
  const n1 = mid - left + 1;
  const n2 = right - mid;

  const L = new Array(n1);
  const R = new Array(n2);

  for (let i = 0; i < n1; i++) L[i] = arr[left + i];
  for (let j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

  let i = 0,
    j = 0,
    k = left;

  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) {
      arr[k] = L[i];
      i++;
    } else {
      arr[k] = R[j];
      j++;
    }

    if (onSwap) {
      onSwap([...arr], [k]); // Mark the current position
      await new Promise((resolve) => setTimeout(resolve, ms));
    }
    k++;
  }

  while (i < n1) {
    arr[k] = L[i];
    if (onSwap) {
      onSwap([...arr], [k]);
      await new Promise((resolve) => setTimeout(resolve, ms));
    }
    i++;
    k++;
  }

  while (j < n2) {
    arr[k] = R[j];
    if (onSwap) {
      onSwap([...arr], [k]);
      await new Promise((resolve) => setTimeout(resolve, ms));
    }
    j++;
    k++;
  }
}
