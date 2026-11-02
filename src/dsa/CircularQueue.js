/**
 * Custom Circular Queue Implementation for SmartPark Waiting Vehicles
 * Fixed-capacity circular buffer with FIFO ordering and compatibility-aware selection.
 * University DSA Specification:
 * - enqueue()
 * - dequeue()
 * - peek()
 * - isEmpty()
 * - isFull()
 * - dequeueFirstEligible(predicate): Preserves relative FIFO order among remaining vehicles
 */

export class CircularQueue {
  constructor(capacity = 15) {
    this.capacity = capacity;
    this.queue = new Array(capacity).fill(null);
    this.front = 0;
    this.rear = -1;
    this.count = 0;
  }

  /**
   * Check if queue is full
   * Time Complexity: O(1)
   */
  isFull() {
    return this.count === this.capacity;
  }

  /**
   * Check if queue is empty
   * Time Complexity: O(1)
   */
  isEmpty() {
    return this.count === 0;
  }

  /**
   * Add vehicle to waiting queue
   * Time Complexity: O(1)
   */
  enqueue(vehicle) {
    if (this.isFull()) {
      return { success: false, message: "Waiting queue is at maximum capacity (" + this.capacity + ")" };
    }

    this.rear = (this.rear + 1) % this.capacity;
    this.queue[this.rear] = {
      ...vehicle,
      enqueuedAt: vehicle.enqueuedAt || new Date().toISOString(),
      queuePosition: this.count + 1,
    };
    this.count++;
    return { success: true, position: this.count };
  }

  /**
   * Remove and return the front vehicle
   * Time Complexity: O(1)
   */
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }

    const item = this.queue[this.front];
    this.queue[this.front] = null;
    this.front = (this.front + 1) % this.capacity;
    this.count--;
    return item;
  }

  /**
   * Inspect the front vehicle without removing
   * Time Complexity: O(1)
   */
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.queue[this.front];
  }

  /**
   * Return size of queue
   */
  getSize() {
    return this.count;
  }

  /**
   * Get all queued items in exact FIFO sequence
   */
  toArray() {
    const result = [];
    if (this.isEmpty()) return result;

    for (let i = 0; i < this.count; i++) {
      const idx = (this.front + i) % this.capacity;
      result.push({
        ...this.queue[idx],
        currentQueuePosition: i + 1,
      });
    }
    return result;
  }

  /**
   * Find and dequeue the earliest vehicle matching eligibility criteria (e.g. vehicle type or handicap permit)
   * while preserving the exact FIFO arrival order of all other waiting vehicles!
   * Algorithmic technique: Circular FIFO rotation / simulation.
   */
  dequeueFirstEligible(predicate) {
    if (this.isEmpty()) return null;

    let targetIndex = -1;
    let foundItem = null;

    // Scan in circular order
    for (let i = 0; i < this.count; i++) {
      const idx = (this.front + i) % this.capacity;
      if (predicate(this.queue[idx])) {
        targetIndex = idx;
        foundItem = this.queue[idx];
        break;
      }
    }

    if (!foundItem) return null;

    // Reconstruct queue preserving relative order without the matched element
    const remaining = [];
    for (let i = 0; i < this.count; i++) {
      const idx = (this.front + i) % this.capacity;
      if (idx !== targetIndex) {
        remaining.push(this.queue[idx]);
      }
    }

    // Reset buffer with remaining elements
    this.queue = new Array(this.capacity).fill(null);
    for (let i = 0; i < remaining.length; i++) {
      this.queue[i] = remaining[i];
    }
    this.front = 0;
    this.rear = remaining.length - 1;
    this.count = remaining.length;

    return foundItem;
  }

  /**
   * Remove a vehicle by registration number (cancellation)
   */
  removeByRegNumber(regNumber) {
    if (this.isEmpty()) return false;
    const target = this.dequeueFirstEligible(
      (v) => v.registrationNumber.toUpperCase() === regNumber.toUpperCase()
    );
    return target !== null;
  }

  /**
   * Reinitialize with array of items (e.g., from localStorage)
   */
  fromArray(items) {
    this.queue = new Array(this.capacity).fill(null);
    this.front = 0;
    this.rear = -1;
    this.count = 0;

    if (!items || !Array.isArray(items)) return;

    items.slice(0, this.capacity).forEach((item) => {
      this.enqueue(item);
    });
  }
}
