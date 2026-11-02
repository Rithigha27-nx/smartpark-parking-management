/**
 * Custom Min-Heap Implementation for SmartPark Slot Allocation
 * Prioritizes available parking slots based on minimum walking/driving distance from facility entrance.
 * University DSA Specification:
 * - insertSlot()
 * - extractMin()
 * - peekMin()
 * - heapifyUp()
 * - heapifyDown()
 */

export class MinHeap {
  constructor(compareFn = (a, b) => a.distance - b.distance) {
    this.heap = [];
    this.compare = compareFn;
  }

  // Get index helpers
  getParentIndex(i) {
    return Math.floor((i - 1) / 2);
  }

  getLeftChildIndex(i) {
    return 2 * i + 1;
  }

  getRightChildIndex(i) {
    return 2 * i + 2;
  }

  hasParent(i) {
    return this.getParentIndex(i) >= 0;
  }

  hasLeftChild(i) {
    return this.getLeftChildIndex(i) < this.heap.length;
  }

  hasRightChild(i) {
    return this.getRightChildIndex(i) < this.heap.length;
  }

  parent(i) {
    return this.heap[this.getParentIndex(i)];
  }

  leftChild(i) {
    return this.heap[this.getLeftChildIndex(i)];
  }

  rightChild(i) {
    return this.heap[this.getRightChildIndex(i)];
  }

  swap(i, j) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  /**
   * Insert a slot into the Min-Heap
   * Time Complexity: O(log N)
   */
  insertSlot(slot) {
    if (!slot) return;
    this.heap.push(slot);
    this.heapifyUp(this.heap.length - 1);
  }

  /**
   * Peek at the minimum distance slot without removing it
   * Time Complexity: O(1)
   */
  peekMin() {
    if (this.heap.length === 0) return null;
    return this.heap[0];
  }

  /**
   * Extract and remove the minimum distance slot
   * Time Complexity: O(log N)
   */
  extractMin() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);
    return min;
  }

  /**
   * Restore heap invariant moving upwards
   */
  heapifyUp(startIndex) {
    let index = startIndex;
    while (this.hasParent(index) && this.compare(this.heap[index], this.parent(index)) < 0) {
      const parentIdx = this.getParentIndex(index);
      this.swap(index, parentIdx);
      index = parentIdx;
    }
  }

  /**
   * Restore heap invariant moving downwards
   */
  heapifyDown(startIndex) {
    let index = startIndex;
    while (this.hasLeftChild(index)) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      if (
        this.hasRightChild(index) &&
        this.compare(this.rightChild(index), this.leftChild(index)) < 0
      ) {
        smallerChildIndex = this.getRightChildIndex(index);
      }

      if (this.compare(this.heap[index], this.heap[smallerChildIndex]) <= 0) {
        break;
      } else {
        this.swap(index, smallerChildIndex);
      }
      index = smallerChildIndex;
    }
  }

  /**
   * Remove a specific slot by ID (e.g., when manually occupied or put out of service)
   */
  removeById(slotId) {
    const index = this.heap.findIndex((s) => s.id === slotId);
    if (index === -1) return false;

    if (index === this.heap.length - 1) {
      this.heap.pop();
      return true;
    }

    this.heap[index] = this.heap.pop();
    this.heapifyDown(index);
    this.heapifyUp(index);
    return true;
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  toArray() {
    return [...this.heap];
  }

  /**
   * Rebuild the heap from an array of slots
   */
  buildHeap(slotsArray) {
    this.heap = [...slotsArray];
    for (let i = Math.floor(this.heap.length / 2); i >= 0; i--) {
      this.heapifyDown(i);
    }
  }
}
