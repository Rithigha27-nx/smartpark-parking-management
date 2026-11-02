/**
 * Custom Hash Table Implementation for SmartPark Vehicle Lookup
 * Uses Separate Chaining with custom Singly Linked List nodes for collision resolution.
 * University DSA Specification:
 * - hashFunction(key)
 * - insert(key, value)
 * - search(key)
 * - delete(key)
 */

class HashNode {
  constructor(key, value, next = null) {
    this.key = key;
    this.value = value;
    this.next = next;
  }
}

export class HashTable {
  constructor(size = 31) {
    this.size = size;
    this.buckets = new Array(size).fill(null);
    this.count = 0;
    this.collisionCount = 0;
  }

  /**
   * Polynomial rolling hash function
   * Time Complexity: O(L) where L is length of key string
   */
  hashFunction(key) {
    if (!key) return 0;
    const str = String(key).trim().toUpperCase();
    let hash = 0;
    const prime = 31;

    for (let i = 0; i < str.length; i++) {
      hash = (hash * prime + str.charCodeAt(i)) % this.size;
    }
    return Math.abs(hash);
  }

  /**
   * Insert or update a vehicle record by registration number
   * Time Complexity: Average O(1), Worst O(N)
   */
  insert(key, value) {
    if (!key) return false;
    const normalizedKey = String(key).trim().toUpperCase();
    const index = this.hashFunction(normalizedKey);

    let current = this.buckets[index];

    // If bucket empty, insert as head
    if (!current) {
      this.buckets[index] = new HashNode(normalizedKey, value);
      this.count++;
      return true;
    }

    // Bucket not empty -> traverse chain (Collision occurred or updating existing key)
    let isCollision = true;
    while (current) {
      if (current.key === normalizedKey) {
        // Key already exists: update in place
        current.value = value;
        return true;
      }
      if (!current.next) break;
      current = current.next;
    }

    // Append new node to end of linked list chain
    current.next = new HashNode(normalizedKey, value);
    this.count++;
    this.collisionCount++;
    return true;
  }

  /**
   * Search for vehicle by registration number
   * Time Complexity: Average O(1), Worst O(N)
   */
  search(key) {
    if (!key) return null;
    const normalizedKey = String(key).trim().toUpperCase();
    const index = this.hashFunction(normalizedKey);

    let current = this.buckets[index];
    let steps = 0;

    while (current) {
      steps++;
      if (current.key === normalizedKey) {
        return {
          found: true,
          value: current.value,
          bucketIndex: index,
          probeSteps: steps,
        };
      }
      current = current.next;
    }

    return {
      found: false,
      value: null,
      bucketIndex: index,
      probeSteps: steps,
    };
  }

  /**
   * Delete vehicle from hash table
   * Time Complexity: Average O(1), Worst O(N)
   */
  delete(key) {
    if (!key) return false;
    const normalizedKey = String(key).trim().toUpperCase();
    const index = this.hashFunction(normalizedKey);

    let current = this.buckets[index];
    let prev = null;

    while (current) {
      if (current.key === normalizedKey) {
        if (!prev) {
          // Remove head
          this.buckets[index] = current.next;
        } else {
          // Unlink node
          prev.next = current.next;
        }
        this.count--;
        return true;
      }
      prev = current;
      current = current.next;
    }

    return false;
  }

  has(key) {
    const res = this.search(key);
    return res && res.found;
  }

  /**
   * Retrieve all entries
   */
  getAll() {
    const items = [];
    for (let i = 0; i < this.size; i++) {
      let current = this.buckets[i];
      while (current) {
        items.push({ key: current.key, value: current.value, bucket: i });
        current = current.next;
      }
    }
    return items;
  }

  /**
   * Diagnostic statistics for reports and performance comparison
   */
  getStats() {
    let populatedBuckets = 0;
    let maxChainLength = 0;
    const distribution = [];

    for (let i = 0; i < this.size; i++) {
      let chainLen = 0;
      let current = this.buckets[i];
      while (current) {
        chainLen++;
        current = current.next;
      }
      if (chainLen > 0) populatedBuckets++;
      if (chainLen > maxChainLength) maxChainLength = chainLen;
      distribution.push({ bucket: i, chainLength: chainLen });
    }

    const loadFactor = this.count / this.size;

    return {
      tableSize: this.size,
      totalElements: this.count,
      loadFactor: Number(loadFactor.toFixed(3)),
      populatedBuckets,
      emptyBuckets: this.size - populatedBuckets,
      maxChainLength,
      collisions: this.collisionCount,
      distribution,
    };
  }
}
