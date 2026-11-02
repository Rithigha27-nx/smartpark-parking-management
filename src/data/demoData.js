/**
 * Sample operational dataset for SmartPark
 * Vellore Central Parking Facility (VLR-PARK-01)
 * Registration identifiers are synthetic and visibly marked as sample data; contact details are omitted.
 */

export function getSampleRegistrationFromLegacy(value) {
  const match = /^DEMO-(PARK|QUEUE|EXIT)-(\d{2})$/.exec(value || '');
  if (!match) return null;

  const [, category, number] = match;
  const group = { PARK: 1000, QUEUE: 3000, EXIT: 2000 }[category];
  return `SAMPLE-TN23AB${group + Number(number)}`;
}

export function getSampleDriverFromLegacy(value) {
  const match = /^Demo Driver (\d{2})$/.exec(value || '');
  if (!match) return null;

  const number = Number(match[1]);
  if (number === 17) return 'Lavanya Natarajan';
  if (number === 18) return 'Gokul Prasad';
  if (number === 19) return 'Queue Visitor 03';
  return `Driver ${match[1]}`;
}

export const SAMPLE_VEHICLES = [
  {
    registrationNumber: "SAMPLE-TN23AB1001",
    vehicleType: "Car",
    driverName: "Driver 01",
    contactNumber: "",
    isAccessible: true,
    isReserved: false,
    slotId: "A01",
    entryTime: new Date(Date.now() - 110 * 60000).toISOString(),
    status: "PARKED",
  },
  {
    registrationNumber: "SAMPLE-TN23AB1002",
    vehicleType: "SUV",
    driverName: "Driver 02",
    contactNumber: "",
    isAccessible: false,
    isReserved: true,
    slotId: "A03",
    entryTime: new Date(Date.now() - 95 * 60000).toISOString(),
    status: "PARKED",
  },
  {
    registrationNumber: "SAMPLE-TN23AB1003",
    vehicleType: "Car",
    driverName: "Driver 03",
    contactNumber: "",
    isAccessible: false,
    isReserved: false,
    slotId: "A04",
    entryTime: new Date(Date.now() - 140 * 60000).toISOString(),
    status: "PARKED",
  },
  {
    registrationNumber: "SAMPLE-TN23AB1004",
    vehicleType: "Car",
    driverName: "Driver 04",
    contactNumber: "",
    isAccessible: false,
    isReserved: false,
    slotId: "A05",
    entryTime: new Date(Date.now() - 45 * 60000).toISOString(),
    status: "PARKED",
  },
  {
    registrationNumber: "SAMPLE-TN23AB1005",
    vehicleType: "Bike",
    driverName: "Driver 05",
    contactNumber: "",
    isAccessible: false,
    isReserved: false,
    slotId: "A06",
    entryTime: new Date(Date.now() - 30 * 60000).toISOString(),
    status: "PARKED",
  },
  {
    registrationNumber: "SAMPLE-TN23AB1006",
    vehicleType: "SUV",
    driverName: "Driver 06",
    contactNumber: "",
    isAccessible: false,
    isReserved: false,
    slotId: "A08",
    entryTime: new Date(Date.now() - 180 * 60000).toISOString(),
    status: "PARKED",
  },
  {
    registrationNumber: "SAMPLE-TN23AB1007",
    vehicleType: "Car",
    driverName: "Driver 07",
    contactNumber: "",
    isAccessible: true,
    isReserved: false,
    slotId: "B01",
    entryTime: new Date(Date.now() - 80 * 60000).toISOString(),
    status: "PARKED",
  },
  {
    registrationNumber: "SAMPLE-TN23AB1008",
    vehicleType: "Car",
    driverName: "Driver 08",
    contactNumber: "",
    isAccessible: false,
    isReserved: true,
    slotId: "B02",
    entryTime: new Date(Date.now() - 210 * 60000).toISOString(),
    status: "PARKED",
  },
  {
    registrationNumber: "SAMPLE-TN23AB1009",
    vehicleType: "Car",
    driverName: "Driver 09",
    contactNumber: "",
    isAccessible: false,
    isReserved: false,
    slotId: "B04",
    entryTime: new Date(Date.now() - 65 * 60000).toISOString(),
    status: "PARKED",
  },
  {
    registrationNumber: "SAMPLE-TN23AB1010",
    vehicleType: "SUV",
    driverName: "Driver 10",
    contactNumber: "",
    isAccessible: false,
    isReserved: false,
    slotId: "B05",
    entryTime: new Date(Date.now() - 125 * 60000).toISOString(),
    status: "PARKED",
  },
  {
    registrationNumber: "SAMPLE-TN23AB1011",
    vehicleType: "Car",
    driverName: "Driver 11",
    contactNumber: "",
    isAccessible: false,
    isReserved: false,
    slotId: "B07",
    entryTime: new Date(Date.now() - 50 * 60000).toISOString(),
    status: "PARKED",
  },
  {
    registrationNumber: "SAMPLE-TN23AB1012",
    vehicleType: "Bike",
    driverName: "Driver 12",
    contactNumber: "",
    isAccessible: false,
    isReserved: false,
    slotId: "B08",
    entryTime: new Date(Date.now() - 25 * 60000).toISOString(),
    status: "PARKED",
  },
  {
    registrationNumber: "SAMPLE-TN23AB1013",
    vehicleType: "SUV",
    driverName: "Driver 13",
    contactNumber: "",
    isAccessible: false,
    isReserved: true,
    slotId: "C01",
    entryTime: new Date(Date.now() - 160 * 60000).toISOString(),
    status: "PARKED",
  },
  {
    registrationNumber: "SAMPLE-TN23AB1014",
    vehicleType: "Car",
    driverName: "Driver 14",
    contactNumber: "",
    isAccessible: false,
    isReserved: false,
    slotId: "C03",
    entryTime: new Date(Date.now() - 75 * 60000).toISOString(),
    status: "PARKED",
  },
  {
    registrationNumber: "SAMPLE-TN23AB1015",
    vehicleType: "Car",
    driverName: "Driver 15",
    contactNumber: "",
    isAccessible: false,
    isReserved: false,
    slotId: "C06",
    entryTime: new Date(Date.now() - 190 * 60000).toISOString(),
    status: "PARKED",
  },
  {
    registrationNumber: "SAMPLE-TN23AB1016",
    vehicleType: "SUV",
    driverName: "Driver 16",
    contactNumber: "",
    isAccessible: false,
    isReserved: false,
    slotId: "C09",
    entryTime: new Date(Date.now() - 35 * 60000).toISOString(),
    status: "PARKED",
  },
  {
    registrationNumber: "SAMPLE-TN23AB1017",
    vehicleType: "Car",
    driverName: "Driver 17",
    contactNumber: "",
    isAccessible: false,
    isReserved: false,
    slotId: "B03",
    entryTime: new Date(Date.now() - 55 * 60000).toISOString(),
    status: "PARKED",
  },
];

export const SAMPLE_WAITING_QUEUE = [
  {
    registrationNumber: "SAMPLE-TN23AB3001",
    vehicleType: "Car",
    driverName: "Lavanya Natarajan",
    contactNumber: "",
    isAccessible: false,
    isReserved: false,
    enqueuedAt: new Date(Date.now() - 18 * 60000).toISOString(),
  },
  {
    registrationNumber: "SAMPLE-TN23AB3002",
    vehicleType: "SUV",
    driverName: "Gokul Prasad",
    contactNumber: "",
    isAccessible: true,
    isReserved: false,
    enqueuedAt: new Date(Date.now() - 12 * 60000).toISOString(),
  },
];

export const SAMPLE_TRANSACTIONS = [
  {
    id: "TXN-VLR-101",
    registrationNumber: "SAMPLE-TN23AB2001",
    vehicleType: "Car",
    slotId: "A02",
    entryTime: new Date(Date.now() - 260 * 60000).toISOString(),
    exitTime: new Date(Date.now() - 40 * 60000).toISOString(),
    durationMinutes: 220,
    fee: 80, // 4 hours * ₹20
    paymentMethod: "UPI",
    operator: "Arjun Kumar",
  },
  {
    id: "TXN-VLR-102",
    registrationNumber: "SAMPLE-TN23AB2002",
    vehicleType: "SUV",
    slotId: "B03",
    entryTime: new Date(Date.now() - 300 * 60000).toISOString(),
    exitTime: new Date(Date.now() - 90 * 60000).toISOString(),
    durationMinutes: 210,
    fee: 120, // 4 hours * ₹30
    paymentMethod: "Credit Card",
    operator: "Arjun Kumar",
  },
  {
    id: "TXN-VLR-103",
    registrationNumber: "SAMPLE-TN23AB2003",
    vehicleType: "Bike",
    slotId: "A07",
    entryTime: new Date(Date.now() - 150 * 60000).toISOString(),
    exitTime: new Date(Date.now() - 60 * 60000).toISOString(),
    durationMinutes: 90,
    fee: 20, // 2 hours * ₹10
    paymentMethod: "Cash",
    operator: "Arjun Kumar",
  },
  {
    id: "TXN-VLR-104",
    registrationNumber: "SAMPLE-TN23AB2004",
    vehicleType: "Car",
    slotId: "C02",
    entryTime: new Date(Date.now() - 420 * 60000).toISOString(),
    exitTime: new Date(Date.now() - 180 * 60000).toISOString(),
    durationMinutes: 240,
    fee: 80, // 4 hours * ₹20
    paymentMethod: "UPI",
    operator: "Arjun Kumar",
  },
  {
    id: "TXN-VLR-105",
    registrationNumber: "SAMPLE-TN23AB2005",
    vehicleType: "SUV",
    slotId: "B06",
    entryTime: new Date(Date.now() - 360 * 60000).toISOString(),
    exitTime: new Date(Date.now() - 120 * 60000).toISOString(),
    durationMinutes: 240,
    fee: 120, // 4 hours * ₹30
    paymentMethod: "Debit Card",
    operator: "Arjun Kumar",
  },
  {
    id: "TXN-VLR-106",
    registrationNumber: "SAMPLE-TN23AB2006",
    vehicleType: "Car",
    slotId: "C05",
    entryTime: new Date(Date.now() - 200 * 60000).toISOString(),
    exitTime: new Date(Date.now() - 100 * 60000).toISOString(),
    durationMinutes: 100,
    fee: 40, // 2 hours * ₹20
    paymentMethod: "UPI",
    operator: "Arjun Kumar",
  },
  {
    id: "TXN-VLR-107",
    registrationNumber: "SAMPLE-TN23AB2007",
    vehicleType: "Bike",
    slotId: "C07",
    entryTime: new Date(Date.now() - 180 * 60000).toISOString(),
    exitTime: new Date(Date.now() - 110 * 60000).toISOString(),
    durationMinutes: 70,
    fee: 20, // 2 hours * ₹10
    paymentMethod: "Cash",
    operator: "Arjun Kumar",
  },
  {
    id: "TXN-VLR-108",
    registrationNumber: "SAMPLE-TN23AB2008",
    vehicleType: "Car",
    slotId: "B03",
    entryTime: new Date(Date.now() - 12 * 60000).toISOString(),
    exitTime: new Date(Date.now() - 8 * 60000).toISOString(),
    durationMinutes: 4,
    fee: 0,
    paymentMethod: "UPI",
    operator: "Arjun Kumar",
  },
];
