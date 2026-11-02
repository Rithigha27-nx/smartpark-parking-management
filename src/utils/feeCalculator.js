/**
 * Parking Fee Calculator for SmartPark
 * Localized for Indian Rupee (INR) rates:
 * - Bike: ₹10 / hr
 * - Car:  ₹20 / hr
 * - SUV:  ₹30 / hr
 * Charge by started hour, with a minimum charge of one hour.
 */

export const DEFAULT_RATES = {
  currency: 'INR',
  currencySymbol: '₹',
  gracePeriodMinutes: 15,
  hourlyRates: {
    Bike: 10,
    Car: 20,
    SUV: 30,
  },
  minimumFee: 10,
  overtimeSurchargePerHour: 0,
};

/**
 * Calculates fee based on vehicle type, duration, and rate configuration
 */
export function calculateParkingFee(vehicleType = 'Car', durationMinutes = 0, rates = DEFAULT_RATES) {
  const hourlyRate = rates.hourlyRates[vehicleType] || rates.hourlyRates.Car;
  // Grace period check
  if (durationMinutes <= rates.gracePeriodMinutes) {
    return {
      durationMinutes,
      billableHours: 0,
      hourlyRate,
      baseFee: 0,
      totalFee: 0,
      isGracePeriod: true,
    };
  }

  // Billable hours: ceiling to next full hour (commercial parking standard, minimum 1 hour)
  const billableHours = Math.max(1, Math.ceil(durationMinutes / 60));
  let calculatedFee = billableHours * hourlyRate;

  // Minimum fee application
  if (calculatedFee < rates.minimumFee) {
    calculatedFee = rates.minimumFee;
  }

  return {
    durationMinutes,
    billableHours,
    hourlyRate,
    baseFee: calculatedFee,
    totalFee: Math.round(calculatedFee),
    isGracePeriod: false,
  };
}
