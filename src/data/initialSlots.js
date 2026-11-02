/**
 * 30 Parking Slots Configuration for SmartPark
 * Arranged in 3 rows (A, B, C) of 10 bays each.
 * Categories: 'standard', 'accessible', 'reserved'
 * Status: 'available', 'occupied', 'maintenance'
 */

export const INITIAL_SLOTS = [
  // ROW A (Closest to North Main Entrance)
  { id: 'A01', row: 'A', number: 1, type: 'accessible', distance: 10, status: 'available', vehicle: null },
  { id: 'A02', row: 'A', number: 2, type: 'accessible', distance: 14, status: 'available', vehicle: null },
  { id: 'A03', row: 'A', number: 3, type: 'reserved',   distance: 18, status: 'available', vehicle: null },
  { id: 'A04', row: 'A', number: 4, type: 'standard',   distance: 22, status: 'available', vehicle: null },
  { id: 'A05', row: 'A', number: 5, type: 'standard',   distance: 26, status: 'available', vehicle: null },
  { id: 'A06', row: 'A', number: 6, type: 'standard',   distance: 30, status: 'available', vehicle: null },
  { id: 'A07', row: 'A', number: 7, type: 'standard',   distance: 34, status: 'available', vehicle: null },
  { id: 'A08', row: 'A', number: 8, type: 'standard',   distance: 38, status: 'available', vehicle: null },
  { id: 'A09', row: 'A', number: 9, type: 'standard',   distance: 42, status: 'available', vehicle: null },
  { id: 'A10', row: 'A', number: 10, type: 'standard',  distance: 46, status: 'available', vehicle: null },

  // ROW B (Central Bay)
  { id: 'B01', row: 'B', number: 1, type: 'accessible', distance: 20, status: 'available', vehicle: null },
  { id: 'B02', row: 'B', number: 2, type: 'reserved',   distance: 24, status: 'available', vehicle: null },
  { id: 'B03', row: 'B', number: 3, type: 'standard',   distance: 28, status: 'available', vehicle: null },
  { id: 'B04', row: 'B', number: 4, type: 'standard',   distance: 32, status: 'available', vehicle: null },
  { id: 'B05', row: 'B', number: 5, type: 'standard',   distance: 36, status: 'available', vehicle: null },
  { id: 'B06', row: 'B', number: 6, type: 'standard',   distance: 40, status: 'available', vehicle: null },
  { id: 'B07', row: 'B', number: 7, type: 'standard',   distance: 44, status: 'available', vehicle: null },
  { id: 'B08', row: 'B', number: 8, type: 'standard',   distance: 48, status: 'available', vehicle: null },
  { id: 'B09', row: 'B', number: 9, type: 'standard',   distance: 52, status: 'available', vehicle: null },
  { id: 'B10', row: 'B', number: 10, type: 'standard',  distance: 56, status: 'available', vehicle: null },

  // ROW C (South Bay - Near East Exit Lane)
  { id: 'C01', row: 'C', number: 1, type: 'reserved',   distance: 32, status: 'available', vehicle: null },
  { id: 'C02', row: 'C', number: 2, type: 'standard',   distance: 36, status: 'available', vehicle: null },
  { id: 'C03', row: 'C', number: 3, type: 'standard',   distance: 40, status: 'available', vehicle: null },
  { id: 'C04', row: 'C', number: 4, type: 'standard',   distance: 44, status: 'available', vehicle: null },
  { id: 'C05', row: 'C', number: 5, type: 'standard',   distance: 48, status: 'available', vehicle: null },
  { id: 'C06', row: 'C', number: 6, type: 'standard',   distance: 52, status: 'available', vehicle: null },
  { id: 'C07', row: 'C', number: 7, type: 'standard',   distance: 56, status: 'available', vehicle: null },
  { id: 'C08', row: 'C', number: 8, type: 'standard',   distance: 60, status: 'available', vehicle: null },
  { id: 'C09', row: 'C', number: 9, type: 'standard',   distance: 64, status: 'available', vehicle: null },
  { id: 'C10', row: 'C', number: 10, type: 'standard',  distance: 68, status: 'available', vehicle: null },
];
