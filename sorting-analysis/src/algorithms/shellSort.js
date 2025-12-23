/**
 * Shell Sort Algorithm
 * Theoretical Time Complexity: Varies based on the gap sequence (Typically O(n^2) or O(n log^2 n))
 * Space Complexity: O(1)
 */
export const shellSort = async (
  arr,
  left = 0,
  right = arr.length - 1,
  onSwap = null,
  ms = 0
) => {
  let n = right - left + 1;
  let offset = left;

  // Knuth gap sequence or standard n/2 sequence can be used
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      let temp = arr[offset + i];
      let j = i;

      while (j >= gap && arr[offset + j - gap] > temp) {
        arr[offset + j] = arr[offset + j - gap];

        if (onSwap) {
          onSwap([...arr], [offset + j, offset + j - gap]);
          await new Promise((resolve) => setTimeout(resolve, ms));
        }
        j -= gap;
      }
      arr[offset + j] = temp;

      if (onSwap) {
        onSwap([...arr], [offset + j]);
        await new Promise((resolve) => setTimeout(resolve, ms));
      }
    }
  }
  return arr;
};
