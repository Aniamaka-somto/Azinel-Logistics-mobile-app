// services/api.ts
// ---------------------------------------------------------
// All functions are mocked. When backend is ready:
// 1. Replace BASE_URL with your real API
// 2. Uncomment the fetch calls
// 3. Remove the mock returns
// ---------------------------------------------------------

const BASE_URL = "https://your-api.com/api/v1"; // swap when ready

// -- Types --------------------------------------------------

export interface RideBookingPayload {
  pickup: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
  rideType: string;
  price: number;
}

export interface IntercityBookingPayload {
  originCity: string;
  destinationCity: string;
  originArea: { name: string; latitude: number; longitude: number };
  destinationArea: { name: string; latitude: number; longitude: number };
  departureDate: string;
  departureTime: string;
  vehicleClass: "sedan" | "suv";
  passengers: number;
}

export interface LogisticsBookingPayload {
  pickup: { address: string; latitude: number; longitude: number };
  delivery: { address: string; latitude: number; longitude: number };
  item: {
    category: string;
    weight: number;
    description: string;
  };
  receiver: {
    name: string;
    phone: string;
  };
}

export interface BookingResponse {
  bookingId: string;
  status: "pending" | "confirmed" | "cancelled";
  estimatedPrice: number;
  estimatedArrival?: string;
}

// -- Helpers ------------------------------------------------

// Uncomment when backend is ready:
// async function post<T>(endpoint: string, body: unknown): Promise<T> {
//   const res = await fetch(`${BASE_URL}${endpoint}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body),
//   });
//   if (!res.ok) throw new Error(await res.text());
//   return res.json();
// }

function mockDelay<T>(data: T, ms = 1200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

// -- Ride ---------------------------------------------------

export async function confirmRideBooking(
  payload: RideBookingPayload,
): Promise<BookingResponse> {
  console.log("[API] confirmRideBooking →", payload);
  // return post<BookingResponse>("/bookings/ride", payload);
  return mockDelay({
    bookingId: "RIDE-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    status: "confirmed",
    estimatedPrice: payload.price,
    estimatedArrival: "4 mins",
  });
}

// -- Intercity ----------------------------------------------

export async function confirmIntercityBooking(
  payload: IntercityBookingPayload,
): Promise<BookingResponse> {
  console.log("[API] confirmIntercityBooking →", payload);
  // return post<BookingResponse>("/bookings/intercity", payload);
  return mockDelay({
    bookingId: "IC-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    status: "confirmed",
    estimatedPrice: payload.vehicleClass === "suv" ? 45000 : 28000,
  });
}

export async function getIntercityPriceEstimate(
  payload: Pick<
    IntercityBookingPayload,
    "originCity" | "destinationCity" | "vehicleClass"
  >,
): Promise<{ price: number }> {
  console.log("[API] getIntercityPriceEstimate →", payload);
  // return post<{ price: number }>("/bookings/intercity/estimate", payload);
  const base = payload.vehicleClass === "suv" ? 45000 : 28000;
  return mockDelay({ price: base });
}

// -- Logistics ----------------------------------------------

export async function confirmLogisticsBooking(
  payload: LogisticsBookingPayload,
): Promise<BookingResponse> {
  console.log("[API] confirmLogisticsBooking →", payload);
  // return post<BookingResponse>("/bookings/logistics", payload);
  return mockDelay({
    bookingId: "LOG-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    status: "confirmed",
    estimatedPrice: payload.item.weight ? payload.item.weight * 500 : 3000,
  });
}

export async function getLogisticsPriceEstimate(
  payload: Pick<LogisticsBookingPayload, "pickup" | "delivery" | "item">,
): Promise<{ price: number }> {
  console.log("[API] getLogisticsPriceEstimate →", payload);
  // return post<{ price: number }>("/bookings/logistics/estimate", payload);
  const base = payload.item.weight ? payload.item.weight * 500 : 3000;
  return mockDelay({ price: base });
}
// -- Place Search -------------------------------------------

export interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

// When backend ready, hit your /places/search?q= endpoint
// or swap to Google Places Autocomplete API directly
export async function searchPlaces(query: string): Promise<PlaceResult[]> {
  console.log("[API] searchPlaces →", query);

  // return post<PlaceResult[]>(`/places/search?q=${encodeURIComponent(query)}`, {});

  // Mock data — covers common Nigerian cities/areas
  const MOCK_PLACES: PlaceResult[] = [
    // Lagos
    {
      placeId: "lag-vi",
      name: "Victoria Island",
      address: "Victoria Island, Lagos",
      coordinates: { latitude: 6.4281, longitude: 3.4219 },
    },
    {
      placeId: "lag-ikeja",
      name: "Ikeja",
      address: "Ikeja, Lagos",
      coordinates: { latitude: 6.6018, longitude: 3.3515 },
    },
    {
      placeId: "lag-lekki",
      name: "Lekki",
      address: "Lekki, Lagos",
      coordinates: { latitude: 6.4698, longitude: 3.5852 },
    },
    {
      placeId: "lag-surulere",
      name: "Surulere",
      address: "Surulere, Lagos",
      coordinates: { latitude: 6.4969, longitude: 3.3481 },
    },
    {
      placeId: "lag-yaba",
      name: "Yaba",
      address: "Yaba, Lagos",
      coordinates: { latitude: 6.5095, longitude: 3.3742 },
    },
    {
      placeId: "lag-ajah",
      name: "Ajah",
      address: "Ajah, Lagos",
      coordinates: { latitude: 6.4667, longitude: 3.5833 },
    },
    {
      placeId: "lag-ikorodu",
      name: "Ikorodu",
      address: "Ikorodu, Lagos",
      coordinates: { latitude: 6.6194, longitude: 3.5106 },
    },
    {
      placeId: "lag-mainland",
      name: "Lagos Mainland",
      address: "Lagos Mainland, Lagos",
      coordinates: { latitude: 6.5244, longitude: 3.3792 },
    },
    {
      placeId: "lag-island",
      name: "Lagos Island",
      address: "Lagos Island, Lagos",
      coordinates: { latitude: 6.4541, longitude: 3.3947 },
    },
    {
      placeId: "lag-oshodi",
      name: "Oshodi",
      address: "Oshodi, Lagos",
      coordinates: { latitude: 6.5567, longitude: 3.349 },
    },

    // Abuja
    {
      placeId: "abj-wuse",
      name: "Wuse 2",
      address: "Wuse 2, Abuja",
      coordinates: { latitude: 9.0833, longitude: 7.4833 },
    },
    {
      placeId: "abj-garki",
      name: "Garki",
      address: "Garki, Abuja",
      coordinates: { latitude: 9.0333, longitude: 7.4833 },
    },
    {
      placeId: "abj-maitama",
      name: "Maitama",
      address: "Maitama, Abuja",
      coordinates: { latitude: 9.0833, longitude: 7.4833 },
    },
    {
      placeId: "abj-gwarinpa",
      name: "Gwarinpa",
      address: "Gwarinpa, Abuja",
      coordinates: { latitude: 9.1167, longitude: 7.4167 },
    },
    {
      placeId: "abj-jabi",
      name: "Jabi",
      address: "Jabi, Abuja",
      coordinates: { latitude: 9.0667, longitude: 7.4333 },
    },
    {
      placeId: "abj-asokoro",
      name: "Asokoro",
      address: "Asokoro, Abuja",
      coordinates: { latitude: 9.05, longitude: 7.5167 },
    },
    {
      placeId: "abj-kubwa",
      name: "Kubwa",
      address: "Kubwa, Abuja",
      coordinates: { latitude: 9.15, longitude: 7.3167 },
    },

    // Benin City
    {
      placeId: "ben-ringroad",
      name: "Ring Road",
      address: "Ring Road, Benin City",
      coordinates: { latitude: 6.34, longitude: 5.63 },
    },
    {
      placeId: "ben-gra",
      name: "GRA Benin",
      address: "GRA, Benin City",
      coordinates: { latitude: 6.35, longitude: 5.615 },
    },
    {
      placeId: "ben-ugbowo",
      name: "Ugbowo",
      address: "Ugbowo, Benin City",
      coordinates: { latitude: 6.374, longitude: 5.633 },
    },
    {
      placeId: "ben-sapele",
      name: "Sapele Road",
      address: "Sapele Road, Benin City",
      coordinates: { latitude: 6.328, longitude: 5.618 },
    },
    {
      placeId: "ben-oba",
      name: "Oba Market",
      address: "Oba Market, Benin City",
      coordinates: { latitude: 6.336, longitude: 5.624 },
    },

    // Port Harcourt
    {
      placeId: "ph-gra1",
      name: "GRA Phase 1",
      address: "GRA Phase 1, Port Harcourt",
      coordinates: { latitude: 4.8167, longitude: 7.05 },
    },
    {
      placeId: "ph-gra2",
      name: "GRA Phase 2",
      address: "GRA Phase 2, Port Harcourt",
      coordinates: { latitude: 4.8333, longitude: 7.0333 },
    },
    {
      placeId: "ph-rumuola",
      name: "Rumuola",
      address: "Rumuola, Port Harcourt",
      coordinates: { latitude: 4.85, longitude: 7.0167 },
    },
    {
      placeId: "ph-transamadi",
      name: "Trans Amadi",
      address: "Trans Amadi, Port Harcourt",
      coordinates: { latitude: 4.8333, longitude: 7.0 },
    },
    {
      placeId: "ph-diobu",
      name: "Diobu",
      address: "Diobu, Port Harcourt",
      coordinates: { latitude: 4.8167, longitude: 7.0333 },
    },

    // Ibadan
    {
      placeId: "ib-bodija",
      name: "Bodija",
      address: "Bodija, Ibadan",
      coordinates: { latitude: 7.4167, longitude: 3.9 },
    },
    {
      placeId: "ib-dugbe",
      name: "Dugbe",
      address: "Dugbe, Ibadan",
      coordinates: { latitude: 7.3833, longitude: 3.9 },
    },
    {
      placeId: "ib-agodi",
      name: "Agodi GRA",
      address: "Agodi GRA, Ibadan",
      coordinates: { latitude: 7.4, longitude: 3.9167 },
    },

    // Enugu
    {
      placeId: "en-gra",
      name: "GRA Enugu",
      address: "GRA, Enugu",
      coordinates: { latitude: 6.4584, longitude: 7.5464 },
    },
    {
      placeId: "en-independence",
      name: "Independence Layout",
      address: "Independence Layout, Enugu",
      coordinates: { latitude: 6.45, longitude: 7.5167 },
    },
    {
      placeId: "en-newheaven",
      name: "New Haven",
      address: "New Haven, Enugu",
      coordinates: { latitude: 6.4667, longitude: 7.5333 },
    },

    // Kano
    {
      placeId: "kn-nassarawa",
      name: "Nassarawa",
      address: "Nassarawa, Kano",
      coordinates: { latitude: 12.0, longitude: 8.5167 },
    },
    {
      placeId: "kn-fagge",
      name: "Fagge",
      address: "Fagge, Kano",
      coordinates: { latitude: 12.0, longitude: 8.5 },
    },
    {
      placeId: "kn-sabon",
      name: "Sabon Gari",
      address: "Sabon Gari, Kano",
      coordinates: { latitude: 12.0167, longitude: 8.5333 },
    },
  ];

  if (!query.trim()) return [];

  const q = query.toLowerCase();
  return mockDelay(
    MOCK_PLACES.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q),
    ).slice(0, 6), // max 6 results like Google Places
    300,
  ); // fast response feels real
}
