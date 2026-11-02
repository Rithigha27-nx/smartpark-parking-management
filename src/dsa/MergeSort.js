/**
 * Custom Merge Sort Implementation for SmartPark Records & Reports
 * Stable divide-and-conquer sorting algorithm.
 * University DSA Specification:
 * - mergeSort(array, compareFn)
 * - merge(left, right, compareFn)
 * - Time Complexity: O(N log N) in best, average, and worst cases
 * - Space Complexity: O(N) auxiliary space
 * - Tracks comparison and operation counts for algorithmic analysis
 */

export class MergeSort {
  /**
   * Sort an array using Merge Sort
   * @param {Array} array
   * @param {Function} compareFn - comparison function returning negative, 0, or positive
   * @returns {{ sorted: Array, comparisons: number, executionTimeMs: number }}
   */
  static sortWithMetrics(array, compareFn = (a, b) => (a < b ? -1 : a > b ? 1 : 0)) {
    let comparisons = 0;
    const startTime = performance.now();

    function merge(left, right) {
      const result = [];
      let leftIndex = 0;
      let rightIndex = 0;

      while (leftIndex < left.length && rightIndex < right.length) {
        comparisons++;
        if (compareFn(left[leftIndex], right[rightIndex]) <= 0) {
          result.push(left[leftIndex]);
          leftIndex++;
        } else {
          result.push(right[rightIndex]);
          rightIndex++;
        }
      }

      // Append remaining elements
      return result
        .concat(left.slice(leftIndex))
        .concat(right.slice(rightIndex));
    }

    function recursiveSort(arr) {
      if (arr.length <= 1) {
        return arr;
      }

      const middle = Math.floor(arr.length / 2);
      const left = arr.slice(0, middle);
      const right = arr.slice(middle);

      return merge(recursiveSort(left), recursiveSort(right));
    }

    const sorted = recursiveSort([...array]);
    const endTime = performance.now();

    return {
      sorted,
      comparisons,
      executionTimeMs: Number((endTime - startTime).toFixed(3)),
    };
  }

  /**
   * Pure merge sort returning array directly
   */
  static sort(array, compareFn) {
    return MergeSort.sortWithMetrics(array, compareFn).sorted;
  }
}
