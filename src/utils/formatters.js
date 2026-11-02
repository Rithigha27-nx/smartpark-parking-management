/**
 * Formatting helpers for SmartPark
 * Localized specifically for India (Vellore, Tamil Nadu)
 * Currency: INR (₹)
 * Timezone: Asia/Kolkata (IST)
 */

export function formatCurrency(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDateTime(isoString) {
  if (!isoString) return '--';
  const d = new Date(isoString);
  // DD MMM YYYY, hh:mm AM/PM (e.g. 30 Oct 2026, 10:30 AM)
  const datePart = d.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const timePart = d.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return `${datePart}, ${timePart}`;
}

export function formatTimeOnly(isoString) {
  if (!isoString) return '--';
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDateOnly(isoString) {
  if (!isoString) return '--';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDuration(minutes) {
  if (!minutes || minutes < 0) return '0m';
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hrs === 0) return `${mins}m`;
  return `${hrs}h ${mins}m`;
}

export function getDurationMinutes(startTimeIso, endTimeIso = new Date().toISOString()) {
  if (!startTimeIso) return 0;
  const start = new Date(startTimeIso).getTime();
  const end = new Date(endTimeIso).getTime();
  const diffMinutes = Math.max(0, Math.floor((end - start) / 60000));
  return diffMinutes;
}

/**
 * Normalizes a vehicle identifier by removing separators and uppercasing it.
 * Legacy sample prefixes are ignored so existing browser records remain searchable.
 */
export function normalizePlate(plate) {
  const normalized = (plate || '').toUpperCase().trim().replace(/[^A-Z0-9]/g, '');
  return normalized.replace(/^SAMPLE(?=[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$)/, '');
}

/**
 * Formats standard Indian registration numbers for clear display when possible.
 */
export function formatPlateDisplay(plate) {
  const norm = normalizePlate(plate);
  const match = norm.match(/^([A-Z]{2})(\d{2})([A-Z]{1,2})(\d{4})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
  }
  return norm;
}

export function formatOperatorName(name) {
  return name === 'Demo Operator' ? 'Arjun Kumar' : name;
}
