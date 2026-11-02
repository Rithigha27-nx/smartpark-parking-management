import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { INITIAL_SLOTS } from '../data/initialSlots';
import { DEMO_VEHICLES, DEMO_WAITING_QUEUE, DEMO_TRANSACTIONS } from '../data/demoData';
import { MinHeap } from '../dsa/MinHeap';
import { CircularQueue } from '../dsa/CircularQueue';
import { HashTable } from '../dsa/HashTable';
import { MergeSort } from '../dsa/MergeSort';
import { calculateParkingFee, DEFAULT_RATES } from '../utils/feeCalculator';
import { getDurationMinutes, normalizePlate, formatCurrency } from '../utils/formatters';

const ParkingContext = createContext(null);

const STORAGE_KEYS = {
  SLOTS: 'smartpark_v3_slots',
  QUEUE: 'smartpark_v3_queue',
  TRANSACTIONS: 'smartpark_v3_transactions',
  SETTINGS: 'smartpark_v3_settings',
  NOTIFICATIONS: 'smartpark_v3_notifications',
};

const DEFAULT_SETTINGS = {
  facilityName: 'Vellore Central Parking Facility',
  facilityCode: 'VLR-PARK-01',
  facilityLocation: 'Vellore, Tamil Nadu, India',
  operatorName: 'Demo Operator',
  operatorRole: 'Parking Administrator',
  shift: 'General Operations Shift',
  capacity: 30,
  queueCapacity: 15,
  rates: DEFAULT_RATES,
};

export function ParkingProvider({ children }) {
  // System Settings
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // 30 Parking Slots
  const [slots, setSlots] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SLOTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Initialize with demo data pre-assigned to make the system realistic on first run
    const baseSlots = JSON.parse(JSON.stringify(INITIAL_SLOTS));
    DEMO_VEHICLES.forEach((veh) => {
      const slot = baseSlots.find((s) => s.id === veh.slotId);
      if (slot) {
        slot.status = 'occupied';
        slot.vehicle = { ...veh };
      }
    });
    return baseSlots;
  });

  // Waiting Queue (Array representing circular queue state for React reactivity)
  const [waitingQueueItems, setWaitingQueueItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUEUE);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEMO_WAITING_QUEUE;
  });

  // Transactions History
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEMO_TRANSACTIONS;
  });

  // Notifications / Activity Alerts
  const [notifications, setNotifications] = useState([]);
  const [recentActivities, setRecentActivities] = useState([
    {
      id: 'act-1',
      type: 'ENTRY',
      title: 'Vehicle Allocated',
      description: 'DEMO-PARK-12 assigned to Slot B08 (Distance: 48m)',
      timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    },
    {
      id: 'act-2',
      type: 'EXIT',
      title: 'Vehicle Exited',
      description: 'DEMO-EXIT-01 cleared Slot A02. Fee ₹80 collected via UPI.',
      timestamp: new Date(Date.now() - 40 * 60000).toISOString(),
    },
    {
      id: 'act-3',
      type: 'QUEUE',
      title: 'Vehicle Enqueued',
      description: 'DEMO-QUEUE-01 joined Waiting Queue at Pos #1',
      timestamp: new Date(Date.now() - 18 * 60000).toISOString(),
    },
  ]);

  // Persist state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(slots));
    } catch (e) {
      console.error('Error saving slots to localStorage', e);
    }
  }, [slots]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(waitingQueueItems));
    } catch (e) {
      console.error('Error saving queue to localStorage', e);
    }
  }, [waitingQueueItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error('Error saving transactions to localStorage', e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings to localStorage', e);
    }
  }, [settings]);

  // -------------------------------------------------------------
  // DSA Data Structure Synchronizations
  // -------------------------------------------------------------

  // 1. Build and synchronize Hash Table with currently parked vehicles
  const vehicleHashTable = useMemo(() => {
    const table = new HashTable(31);
    slots.forEach((s) => {
      if (s.status === 'occupied' && s.vehicle) {
        table.insert(s.vehicle.registrationNumber, {
          ...s.vehicle,
          slotId: s.id,
          slotType: s.type,
          slotDistance: s.distance,
        });
      }
    });
    return table;
  }, [slots]);

  // 2. Build Min-Heaps for available slots categorized by slot type
  const { accessibleHeap, reservedHeap, standardHeap, allAvailableHeap } = useMemo(() => {
    const accH = new MinHeap();
    const resH = new MinHeap();
    const stdH = new MinHeap();
    const allH = new MinHeap();

    slots.forEach((s) => {
      if (s.status === 'available') {
        allH.insertSlot(s);
        if (s.type === 'accessible') accH.insertSlot(s);
        else if (s.type === 'reserved') resH.insertSlot(s);
        else stdH.insertSlot(s);
      }
    });

    return {
      accessibleHeap: accH,
      reservedHeap: resH,
      standardHeap: stdH,
      allAvailableHeap: allH,
    };
  }, [slots]);

  // 3. Build Circular Queue instance
  const circularQueueInstance = useMemo(() => {
    const cq = new CircularQueue(settings.queueCapacity || 15);
    cq.fromArray(waitingQueueItems);
    return cq;
  }, [waitingQueueItems, settings.queueCapacity]);

  // Helper to add activity log
  const logActivity = useCallback((type, title, description) => {
    const newAct = {
      id: 'act-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      type,
      title,
      description,
      timestamp: new Date().toISOString(),
    };
    setRecentActivities((prev) => [newAct, ...prev.slice(0, 19)]);
  }, []);

  // Helper to push alert banner notification
  const addNotification = useCallback((message, type = 'info', duration = 6000) => {
    const id = 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const newNotif = { id, message, type };
    setNotifications((prev) => [...prev, newNotif]);

    if (duration > 0) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // -------------------------------------------------------------
  // CORE OPERATIONS (Allocation, Exit, Queueing)
  // -------------------------------------------------------------

  /**
   * Allocate slot to a new arriving vehicle using Min-Heap priority
   */
  const allocateVehicle = useCallback(
    ({
      registrationNumber,
      vehicleType,
      driverName = '',
      contactNumber = '',
      isAccessible = false,
      isReserved = false,
      customEntryTime = null,
      fromQueue = false,
    }) => {
      const plate = normalizePlate(registrationNumber);
      if (!plate) {
        return { success: false, error: 'Valid vehicle registration number is required.' };
      }

      // Check if vehicle already parked
      if (vehicleHashTable.has(plate)) {
        const existing = vehicleHashTable.search(plate).value;
        return {
          success: false,
          error: `Vehicle ${plate} is already parked in Slot ${existing.slotId}.`,
        };
      }

      // Check if vehicle already in waiting queue
      const inQueue = !fromQueue && waitingQueueItems.some(
        (v) => normalizePlate(v.registrationNumber) === plate
      );
      if (inQueue) {
        return {
          success: false,
          error: `Vehicle ${plate} is currently waiting in the queue.`,
        };
      }

      // Select nearest suitable slot based on Min-Heap
      let selectedSlot = null;

      if (isAccessible) {
        // Priority 1: Nearest Accessible slot
        selectedSlot = accessibleHeap.peekMin();
        // Fallback: If no accessible slot, allocate nearest standard slot
        if (!selectedSlot) {
          selectedSlot = standardHeap.peekMin();
        }
      } else if (isReserved) {
        // Priority 1: Nearest Reserved slot
        selectedSlot = reservedHeap.peekMin();
        // Fallback: If no reserved slot, allocate nearest standard slot
        if (!selectedSlot) {
          selectedSlot = standardHeap.peekMin();
        }
      } else {
        // Standard vehicle: Nearest standard slot
        selectedSlot = standardHeap.peekMin();
      }

      // If no slot found
      if (!selectedSlot) {
        return {
          success: false,
          noSlotAvailable: true,
          error: 'No compatible parking slot is currently available.',
          suggestQueue: true,
        };
      }

      // Commit assignment to slot
      const entryTime = customEntryTime || new Date().toISOString();
      const vehiclePayload = {
        registrationNumber: plate,
        vehicleType,
        driverName: driverName.trim(),
        contactNumber: contactNumber.trim(),
        isAccessible: Boolean(isAccessible),
        isReserved: Boolean(isReserved),
        slotId: selectedSlot.id,
        entryTime,
        status: 'PARKED',
      };

      setSlots((prevSlots) =>
        prevSlots.map((s) =>
          s.id === selectedSlot.id
            ? { ...s, status: 'occupied', vehicle: vehiclePayload }
            : s
        )
      );

      logActivity(
        'ENTRY',
        `Vehicle Entry: ${plate}`,
        `${plate} (${vehicleType}) allocated to Slot ${selectedSlot.id} (Min-distance: ${selectedSlot.distance}m)`
      );

      addNotification(
        `Success: Vehicle ${plate} allocated to Slot ${selectedSlot.id} (${selectedSlot.distance}m from gate).`,
        'success'
      );

      return {
        success: true,
        slot: selectedSlot,
        vehicle: vehiclePayload,
      };
    },
    [vehicleHashTable, waitingQueueItems, accessibleHeap, reservedHeap, standardHeap, logActivity, addNotification]
  );

  /**
   * Add a vehicle to the Waiting Queue
   */
  const addToWaitingQueue = useCallback(
    ({
      registrationNumber,
      vehicleType,
      driverName = '',
      contactNumber = '',
      isAccessible = false,
      isReserved = false,
    }) => {
      const plate = normalizePlate(registrationNumber);
      if (!plate) {
        return { success: false, error: 'Valid registration number is required.' };
      }

      if (vehicleHashTable.has(plate)) {
        return { success: false, error: `Vehicle ${plate} is already actively parked.` };
      }

      if (waitingQueueItems.some((v) => normalizePlate(v.registrationNumber) === plate)) {
        return { success: false, error: `Vehicle ${plate} is already in the waiting queue.` };
      }

      if (waitingQueueItems.length >= settings.queueCapacity) {
        return {
          success: false,
          error: `Waiting queue is at maximum capacity (${settings.queueCapacity}). Please try again shortly.`,
        };
      }

      const newQueueItem = {
        registrationNumber: plate,
        vehicleType,
        driverName: driverName.trim(),
        contactNumber: contactNumber.trim(),
        isAccessible: Boolean(isAccessible),
        isReserved: Boolean(isReserved),
        enqueuedAt: new Date().toISOString(),
      };

      const updatedQueue = [...waitingQueueItems, newQueueItem];
      setWaitingQueueItems(updatedQueue);

      logActivity(
        'QUEUE',
        `Vehicle Queued: ${plate}`,
        `${plate} (${vehicleType}) added to Waiting Queue at position #${updatedQueue.length}`
      );

      addNotification(
        `Vehicle ${plate} added to Waiting Queue at position #${updatedQueue.length}.`,
        'info'
      );

      return {
        success: true,
        position: updatedQueue.length,
        item: newQueueItem,
      };
    },
    [vehicleHashTable, waitingQueueItems, settings.queueCapacity, logActivity, addNotification]
  );

  /**
   * Remove / Cancel waiting request
   */
  const removeFromWaitingQueue = useCallback(
    (registrationNumber) => {
      const plate = normalizePlate(registrationNumber);
      const existing = waitingQueueItems.find(
        (v) => normalizePlate(v.registrationNumber) === plate
      );

      if (!existing) {
        return { success: false, error: 'Vehicle not found in waiting queue.' };
      }

      const updated = waitingQueueItems.filter(
        (v) => normalizePlate(v.registrationNumber) !== plate
      );
      setWaitingQueueItems(updated);

      logActivity('QUEUE', `Queue Cancelled: ${plate}`, `Waiting request for ${plate} cancelled.`);
      addNotification(`Waiting request for ${plate} removed from queue.`, 'info');

      return { success: true };
    },
    [waitingQueueItems, logActivity, addNotification]
  );

  /**
   * Process Vehicle Exit
   */
  const processExit = useCallback(
    (registrationNumber, paymentMethod = 'UPI', customExitTime = null) => {
      const plate = normalizePlate(registrationNumber);
      if (!plate) {
        return { success: false, error: 'Please enter a valid registration number.' };
      }

      const searchResult = vehicleHashTable.search(plate);
      if (!searchResult || !searchResult.found) {
        return {
          success: false,
          error: `No active parked vehicle found with registration number ${plate}.`,
        };
      }

      const vehicle = searchResult.value;
      const slotId = vehicle.slotId;
      const exitTime = customExitTime || new Date().toISOString();
      const durationMinutes = getDurationMinutes(vehicle.entryTime, exitTime);
      const feeBreakdown = calculateParkingFee(vehicle.vehicleType, durationMinutes, settings.rates);

      // Create Transaction record
      const txnId = `TXN-VLR-${Date.now().toString().slice(-4)}`;
      const transactionRecord = {
        id: txnId,
        registrationNumber: plate,
        vehicleType: vehicle.vehicleType,
        driverName: vehicle.driverName,
        contactNumber: vehicle.contactNumber,
        slotId: slotId,
        entryTime: vehicle.entryTime,
        exitTime: exitTime,
        durationMinutes: durationMinutes,
        fee: feeBreakdown.totalFee,
        paymentMethod: paymentMethod,
        operator: settings.operatorName,
      };

      // Add to transactions
      setTransactions((prev) => [transactionRecord, ...prev]);

      // Release slot and immediately inspect waiting queue for compatibility
      let waitingVehicleAllocated = null;

      const targetSlot = slots.find((s) => s.id === slotId);
      const slotType = targetSlot ? targetSlot.type : 'standard';

      let matchedQueueIndex = -1;
      for (let i = 0; i < waitingQueueItems.length; i++) {
        const item = waitingQueueItems[i];
        if (slotType === 'accessible') {
          if (item.isAccessible) {
            matchedQueueIndex = i;
            break;
          }
        } else if (slotType === 'reserved') {
          if (item.isReserved) {
            matchedQueueIndex = i;
            break;
          }
        } else {
          matchedQueueIndex = i;
          break;
        }
      }

      if (matchedQueueIndex === -1 && slotType === 'standard' && waitingQueueItems.length > 0) {
        matchedQueueIndex = 0;
      }

      if (matchedQueueIndex !== -1) {
        const candidate = waitingQueueItems[matchedQueueIndex];
        const remainingQueue = waitingQueueItems.filter((_, idx) => idx !== matchedQueueIndex);
        setWaitingQueueItems(remainingQueue);

        const queuedVehiclePayload = {
          registrationNumber: candidate.registrationNumber,
          vehicleType: candidate.vehicleType,
          driverName: candidate.driverName,
          contactNumber: candidate.contactNumber,
          isAccessible: candidate.isAccessible,
          isReserved: candidate.isReserved,
          slotId: slotId,
          entryTime: exitTime,
          status: 'PARKED',
        };

        waitingVehicleAllocated = queuedVehiclePayload;

        setSlots((prev) =>
          prev.map((s) =>
            s.id === slotId
              ? { ...s, status: 'occupied', vehicle: queuedVehiclePayload }
              : s
          )
        );

        logActivity(
          'QUEUE',
          `Auto-Allocation from Queue`,
          `Waiting vehicle ${candidate.registrationNumber} automatically allocated to freed Slot ${slotId}!`
        );

        addNotification(
          `Freed Slot ${slotId} automatically allocated to waiting vehicle ${candidate.registrationNumber}!`,
          'success',
          8000
        );
      } else {
        setSlots((prev) =>
          prev.map((s) =>
            s.id === slotId
              ? { ...s, status: 'available', vehicle: null }
              : s
          )
        );
      }

      logActivity(
        'EXIT',
        `Vehicle Exit: ${plate}`,
        `${plate} exited from Slot ${slotId}. Duration: ${durationMinutes} mins. Fee: ${formatCurrency(feeBreakdown.totalFee)} (${paymentMethod}).`
      );

      addNotification(
        `Vehicle ${plate} successfully checked out. Fee: ${formatCurrency(feeBreakdown.totalFee)}.`,
        'success'
      );

      return {
        success: true,
        transaction: transactionRecord,
        feeBreakdown,
        slotId,
        autoAllocatedVehicle: waitingVehicleAllocated,
      };
    },
    [vehicleHashTable, slots, waitingQueueItems, settings, logActivity, addNotification]
  );

  /**
   * Toggle slot maintenance mode
   */
  const toggleSlotMaintenance = useCallback(
    (slotId) => {
      const target = slots.find((s) => s.id === slotId);
      if (!target) return { success: false, error: 'Slot not found' };

      if (target.status === 'occupied') {
        return { success: false, error: 'Cannot put an occupied slot out of service. Please checkout the vehicle first.' };
      }

      const nextStatus = target.status === 'maintenance' ? 'available' : 'maintenance';
      setSlots((prev) =>
        prev.map((s) => (s.id === slotId ? { ...s, status: nextStatus } : s))
      );

      logActivity(
        'MAINTENANCE',
        `Slot ${slotId} Status Changed`,
        `Slot ${slotId} changed from ${target.status} to ${nextStatus}.`
      );

      addNotification(`Slot ${slotId} is now ${nextStatus.toUpperCase()}.`, 'info');
      return { success: true, status: nextStatus };
    },
    [slots, logActivity, addNotification]
  );

  /**
   * Reset all data to fresh empty state
   */
  const resetToEmpty = useCallback(() => {
    const emptySlots = JSON.parse(JSON.stringify(INITIAL_SLOTS));
    setSlots(emptySlots);
    setWaitingQueueItems([]);
    setTransactions([]);
    setRecentActivities([]);
    addNotification('System reset to blank initial state.', 'info');
  }, [addNotification]);

  /**
   * Reset data to realistic demo operational state
   */
  const loadDemoData = useCallback(() => {
    const baseSlots = JSON.parse(JSON.stringify(INITIAL_SLOTS));
    DEMO_VEHICLES.forEach((veh) => {
      const slot = baseSlots.find((s) => s.id === veh.slotId);
      if (slot) {
        slot.status = 'occupied';
        slot.vehicle = { ...veh };
      }
    });
    setSlots(baseSlots);
    setWaitingQueueItems(DEMO_WAITING_QUEUE);
    setTransactions(DEMO_TRANSACTIONS);
    addNotification('Vellore Central operational demo dataset successfully loaded.', 'success');
  }, [addNotification]);

  // -------------------------------------------------------------
  // CALCULATED METRICS & SUMMARY STATISTICS
  // -------------------------------------------------------------
  const summaryMetrics = useMemo(() => {
    const totalSlots = slots.length;
    const occupiedSlots = slots.filter((s) => s.status === 'occupied').length;
    const availableSlots = slots.filter((s) => s.status === 'available').length;
    const maintenanceSlots = slots.filter((s) => s.status === 'maintenance').length;
    const waitingVehicles = waitingQueueItems.length;

    // Today's entries = current occupied + transactions today
    const todayTxns = transactions.filter((t) => {
      const txnDate = new Date(t.exitTime).toDateString();
      const today = new Date().toDateString();
      return txnDate === today;
    });

    const todaysExits = todayTxns.length;
    const todaysRevenue = todayTxns.reduce((sum, t) => sum + (t.fee || 0), 0);
    const todaysEntries = occupiedSlots + todaysExits;

    const occupancyRate = totalSlots > 0 ? (occupiedSlots / totalSlots) * 100 : 0;

    return {
      totalSlots,
      occupiedSlots,
      availableSlots,
      maintenanceSlots,
      waitingVehicles,
      todaysEntries,
      todaysExits,
      todaysRevenue,
      occupancyRate: Number(occupancyRate.toFixed(1)),
    };
  }, [slots, waitingQueueItems, transactions]);

  // Context value bundle
  const value = {
    // State
    settings,
    setSettings,
    slots,
    waitingQueueItems,
    transactions,
    notifications,
    recentActivities,
    summaryMetrics,

    // DSA instances & helpers
    vehicleHashTable,
    accessibleHeap,
    reservedHeap,
    standardHeap,
    allAvailableHeap,
    circularQueueInstance,

    // Operations
    allocateVehicle,
    processExit,
    addToWaitingQueue,
    removeFromWaitingQueue,
    toggleSlotMaintenance,
    addNotification,
    removeNotification,
    resetToEmpty,
    loadDemoData,
  };

  return <ParkingContext.Provider value={value}>{children}</ParkingContext.Provider>;
}

export function useParking() {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
}
