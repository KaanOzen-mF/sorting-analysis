/**
 * Radix Sort Algorithm
 * Theoretical Time Complexity: O(nk)
 * Theoretical Space Complexity: O(n + k)
 */
export const radixSort = async (
  arr,
  left = 0,
  right = arr.length - 1,
  onSwap = null,
  ms = 0
) => {
  // Radix sort typically operates on the entire array,
  // but we take the relevant range to fit the structure of your project.
  let targetArr = arr.slice(left, right + 1);
  const max = Math.max(...targetArr);

  // Run Counting Sort for each digit (1, 10, 100...)
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    await countingSortForRadix(arr, left, right, exp, onSwap, ms);
  }
  return arr;
};

async function countingSortForRadix(arr, left, right, exp, onSwap, ms) {
  let n = right - left + 1;
  let output = new Array(n);
  let count = new Array(10).fill(0);

  // Calculate frequency of digits at the current place value
  for (let i = 0; i < n; i++) {
    let index = Math.floor(arr[left + i] / exp) % 10;
    count[index]++;
  }

  // Calculate cumulative counts (position determination)
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  // Build the output array (go from end to start to maintain stability)
  for (let i = n - 1; i >= 0; i--) {
    let index = Math.floor(arr[left + i] / exp) % 10;
    output[count[index] - 1] = arr[left + i];
    count[index]--;
  }

  // Update the original array and visualize
  for (let i = 0; i < n; i++) {
    arr[left + i] = output[i];
    if (onSwap) {
      onSwap([...arr], [left + i]);
      await new Promise((resolve) => setTimeout(resolve, ms));
    }
  }
}
