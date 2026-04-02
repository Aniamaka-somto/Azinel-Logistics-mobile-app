export interface CityArea {
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface City {
  id: string;
  name: string;
  state: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  areas: CityArea[];
}

export const CITIES: City[] = [
  {
    id: "lagos",
    name: "Lagos",
    state: "Lagos",
    coordinates: { latitude: 6.5244, longitude: 3.3792 },
    areas: [
      {
        name: "Victoria Island",
        coordinates: { latitude: 6.4281, longitude: 3.4219 },
      },
      { name: "Ikeja", coordinates: { latitude: 6.6018, longitude: 3.3515 } },
      { name: "Lekki", coordinates: { latitude: 6.4698, longitude: 3.5852 } },
      {
        name: "Surulere",
        coordinates: { latitude: 6.4969, longitude: 3.3481 },
      },
      { name: "Yaba", coordinates: { latitude: 6.5095, longitude: 3.3742 } },
      { name: "Ajah", coordinates: { latitude: 6.4667, longitude: 3.5833 } },
    ],
  },
  {
    id: "abuja",
    name: "Abuja",
    state: "FCT",
    coordinates: { latitude: 9.0765, longitude: 7.3986 },
    areas: [
      { name: "Wuse 2", coordinates: { latitude: 9.0833, longitude: 7.4833 } },
      { name: "Garki", coordinates: { latitude: 9.0333, longitude: 7.4833 } },
      { name: "Maitama", coordinates: { latitude: 9.0833, longitude: 7.4833 } },
      {
        name: "Gwarinpa",
        coordinates: { latitude: 9.1167, longitude: 7.4167 },
      },
      { name: "Jabi", coordinates: { latitude: 9.0667, longitude: 7.4333 } },
      { name: "Asokoro", coordinates: { latitude: 9.05, longitude: 7.5167 } },
    ],
  },
  {
    id: "benin",
    name: "Benin City",
    state: "Edo",
    coordinates: { latitude: 6.335, longitude: 5.6037 },
    areas: [
      { name: "Ring Road", coordinates: { latitude: 6.34, longitude: 5.63 } },
      { name: "GRA", coordinates: { latitude: 6.35, longitude: 5.615 } },
      { name: "Ugbowo", coordinates: { latitude: 6.374, longitude: 5.633 } },
      {
        name: "Sapele Road",
        coordinates: { latitude: 6.328, longitude: 5.618 },
      },
      {
        name: "Oba Market",
        coordinates: { latitude: 6.336, longitude: 5.624 },
      },
      { name: "New Benin", coordinates: { latitude: 6.342, longitude: 5.627 } },
    ],
  },
  {
    id: "ph",
    name: "Port Harcourt",
    state: "Rivers",
    coordinates: { latitude: 4.8156, longitude: 7.0498 },
    areas: [
      {
        name: "GRA Phase 1",
        coordinates: { latitude: 4.8167, longitude: 7.05 },
      },
      {
        name: "GRA Phase 2",
        coordinates: { latitude: 4.8333, longitude: 7.0333 },
      },
      { name: "Rumuola", coordinates: { latitude: 4.85, longitude: 7.0167 } },
      {
        name: "Trans Amadi",
        coordinates: { latitude: 4.8333, longitude: 7.0 },
      },
      { name: "Diobu", coordinates: { latitude: 4.8167, longitude: 7.0333 } },
      { name: "Eleme", coordinates: { latitude: 4.7833, longitude: 7.1167 } },
    ],
  },
  {
    id: "ibadan",
    name: "Ibadan",
    state: "Oyo",
    coordinates: { latitude: 7.3775, longitude: 3.947 },
    areas: [
      { name: "Bodija", coordinates: { latitude: 7.4167, longitude: 3.9 } },
      { name: "Dugbe", coordinates: { latitude: 7.3833, longitude: 3.9 } },
      { name: "Agodi GRA", coordinates: { latitude: 7.4, longitude: 3.9167 } },
      {
        name: "Challenge",
        coordinates: { latitude: 7.3667, longitude: 3.8833 },
      },
      {
        name: "Ring Road",
        coordinates: { latitude: 7.3833, longitude: 3.9167 },
      },
    ],
  },
];
