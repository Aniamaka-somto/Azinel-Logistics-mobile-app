// services/api.ts
// Connected to Azinel backend

import AsyncStorage from "@react-native-async-storage/async-storage";

export const BASE_URL = "http://192.168.18.10:5000/api/v1";
// ↑ Change this to your Railway URL when deployed.
// For local dev use: "http://192.168.x.x:5000/api/v1"  ← your machine's local IP, not localhost

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface User {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  role: "USER" | "DRIVER";
  avatar?: string;
  rating: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RideBookingPayload {
  pickup: { latitude: number; longitude: number; address?: string };
  destination: { latitude: number; longitude: number; address?: string };
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
  item: { category: string; weight: number; description: string };
  receiver: { name: string; phone: string };
}

export interface BookingResponse {
  bookingId: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  estimatedPrice: number;
  estimatedArrival?: string;
  driverId?: string;
  driver?: {
    id: string;
    user: { fullName: string; phone: string; avatar?: string };
    vehicle?: {
      make: string;
      model: string;
      plateNumber: string;
      color: string;
    };
    rating: number;
    currentLat?: number;
    currentLng?: number;
  };
}

export interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
  coordinates: { latitude: number; longitude: number };
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem("token");
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const text = await res.text();
  let json: { success?: boolean; message?: string; data?: T } | null = null;

  if (text.length > 0) {
    try {
      json = JSON.parse(text) as {
        success?: boolean;
        message?: string;
        data?: T;
      };
    } catch {
      throw new Error(
        `Invalid response (${res.status}). Is BASE_URL correct? ${text.slice(0, 80)}…`,
      );
    }
  }

  if (!res.ok) {
    throw new Error(json?.message || `Request failed (${res.status})`);
  }

  if (json?.success !== true || json.data === undefined) {
    throw new Error(json?.message || "Unexpected response shape from server");
  }

  return json.data as T;
}

function get<T>(endpoint: string) {
  return request<T>(endpoint, { method: "GET" });
}

function post<T>(endpoint: string, body: unknown) {
  return request<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

function patch<T>(endpoint: string, body?: unknown) {
  return request<T>(endpoint, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
}

// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────

export async function registerUser(data: {
  fullName: string;
  phone: string;
  password: string;
  email?: string;
  role?: "USER" | "DRIVER";
}): Promise<AuthResponse> {
  const result = await post<AuthResponse>("/auth/register", data);
  await AsyncStorage.setItem("token", result.token);
  await AsyncStorage.setItem("user", JSON.stringify(result.user));
  return result;
}

export async function loginUser(data: {
  phone: string;
  password: string;
}): Promise<AuthResponse> {
  const result = await post<AuthResponse>("/auth/login", data);
  await AsyncStorage.setItem("token", result.token);
  await AsyncStorage.setItem("user", JSON.stringify(result.user));
  return result;
}

export async function logoutUser(): Promise<void> {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("user");
}

export async function getMe(): Promise<User> {
  return get<User>("/auth/me");
}

export async function getStoredUser(): Promise<User | null> {
  const raw = await AsyncStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

// ─────────────────────────────────────────────
// BOOKINGS — RIDE
// ─────────────────────────────────────────────

export async function confirmRideBooking(
  payload: RideBookingPayload,
): Promise<BookingResponse> {
  const result = await post<any>("/bookings", {
    type: "RIDE",
    pickupLat: payload.pickup.latitude,
    pickupLng: payload.pickup.longitude,
    pickupAddress: payload.pickup.address,
    destLat: payload.destination.latitude,
    destLng: payload.destination.longitude,
    destAddress: payload.destination.address,
    rideType: payload.rideType,
    estimatedPrice: payload.price,
  });

  return {
    bookingId: result.id,
    status: result.status.toLowerCase(),
    estimatedPrice: result.estimatedPrice,
    estimatedArrival: "4 mins",
  };
}

// ─────────────────────────────────────────────
// BOOKINGS — INTERCITY
// ─────────────────────────────────────────────

export async function confirmIntercityBooking(
  payload: IntercityBookingPayload,
): Promise<BookingResponse> {
  const price = payload.vehicleClass === "suv" ? 45000 : 28000;

  const result = await post<any>("/bookings", {
    type: "INTERCITY",
    originCity: payload.originCity,
    originArea: payload.originArea.name,
    originAreaLat: payload.originArea.latitude,
    originAreaLng: payload.originArea.longitude,
    destCity: payload.destinationCity,
    destArea: payload.destinationArea.name,
    destAreaLat: payload.destinationArea.latitude,
    destAreaLng: payload.destinationArea.longitude,
    departureDate: payload.departureDate,
    departureTime: payload.departureTime,
    vehicleClass: payload.vehicleClass.toUpperCase(),
    passengers: payload.passengers,
    estimatedPrice: price,
  });

  return {
    bookingId: result.id,
    status: result.status.toLowerCase(),
    estimatedPrice: result.estimatedPrice,
  };
}

export async function getIntercityPriceEstimate(
  payload: Pick<
    IntercityBookingPayload,
    "originCity" | "destinationCity" | "vehicleClass"
  >,
): Promise<{ price: number }> {
  // Price logic lives on frontend for now — no extra API call needed
  const base = payload.vehicleClass === "suv" ? 45000 : 28000;
  return { price: base };
}

// ─────────────────────────────────────────────
// BOOKINGS — LOGISTICS
// ─────────────────────────────────────────────

export async function confirmLogisticsBooking(
  payload: LogisticsBookingPayload,
): Promise<BookingResponse> {
  const result = await post<any>("/bookings", {
    type: "LOGISTICS",
    pickupLat: payload.pickup.latitude,
    pickupLng: payload.pickup.longitude,
    pickupAddress: payload.pickup.address,
    destLat: payload.delivery.latitude,
    destLng: payload.delivery.longitude,
    destAddress: payload.delivery.address,
    itemCategory: payload.item.category.toUpperCase().replace(" ", "_"),
    itemWeight: payload.item.weight,
    itemDescription: payload.item.description,
    receiverName: payload.receiver.name,
    receiverPhone: payload.receiver.phone,
    estimatedPrice: payload.item.weight ? payload.item.weight * 500 : 3000,
  });

  return {
    bookingId: result.id,
    status: result.status.toLowerCase(),
    estimatedPrice: result.estimatedPrice,
  };
}

export async function getLogisticsPriceEstimate(
  payload: Pick<LogisticsBookingPayload, "pickup" | "delivery" | "item">,
): Promise<{ price: number }> {
  const base = payload.item.weight ? payload.item.weight * 500 : 3000;
  return { price: base };
}

// ─────────────────────────────────────────────
// BOOKINGS — GENERAL
// ─────────────────────────────────────────────

export async function getMyBookings(): Promise<any[]> {
  return get<any[]>("/bookings/my");
}

export async function getBookingById(id: string): Promise<any> {
  return get<any>(`/bookings/${id}`);
}

export async function cancelBooking(id: string): Promise<void> {
  await patch(`/bookings/${id}/cancel`);
}

export async function getActiveRide(): Promise<BookingResponse | null> {
  const result = await get<any>("/rides/active");
  if (!result) return null;

  return {
    bookingId: result.id,
    status: result.status.toLowerCase(),
    estimatedPrice: result.estimatedPrice,
    driverId: result.driverId,
    driver: result.driver,
  };
}

// ─────────────────────────────────────────────
// PLACES
// ─────────────────────────────────────────────

export async function searchPlaces(query: string): Promise<PlaceResult[]> {
  if (!query.trim()) return [];
  try {
    const results = await get<any[]>(
      `/places/search?query=${encodeURIComponent(query)}`,
    );
    return results.map((p: any) => ({
      placeId: p.placeId,
      name: p.mainText ?? p.description,
      address: p.description,
      coordinates: { latitude: 0, longitude: 0 },
    }));
  } catch {
    return [];
  }
}

export async function getPlaceCoordinates(
  placeId: string,
): Promise<{ latitude: number; longitude: number; address: string }> {
  const result = await get<any>(`/places/details/${placeId}`);
  return {
    latitude: result.lat,
    longitude: result.lng,
    address: result.address,
  };
}

// ─────────────────────────────────────────────
// DRIVER
// ─────────────────────────────────────────────

export async function getDriverProfile(): Promise<any> {
  return get("/driver/profile");
}

export async function setDriverStatus(
  status: "ONLINE" | "OFFLINE" | "ON_TRIP",
): Promise<void> {
  await patch("/driver/status", { status });
}

export async function updateDriverLocation(
  latitude: number,
  longitude: number,
  bookingId?: string,
): Promise<void> {
  await patch("/driver/location", { latitude, longitude, bookingId });
}

export async function getDriverEarnings(): Promise<{
  totalEarnings: number;
  earnings: any[];
}> {
  return get("/driver/earnings");
}

export async function getDriverRides(): Promise<any[]> {
  return get("/driver/rides");
}

export async function getAvailableBookings(): Promise<any[]> {
  return get("/bookings/driver/available");
}

export async function acceptBooking(bookingId: string): Promise<any> {
  return patch(`/bookings/${bookingId}/accept`);
}

export async function completeBooking(bookingId: string): Promise<void> {
  await patch(`/bookings/${bookingId}/complete`);
}

export async function getDriverActiveRide(): Promise<any | null> {
  return get("/rides/driver/active");
}

export async function saveVehicle(data: {
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  color: string;
  class: "SEDAN" | "SUV";
}): Promise<any> {
  return post("/driver/vehicle", data);
}

export async function uploadDriverDocs(formData: FormData): Promise<any> {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/driver/docs`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // Don't set Content-Type — let fetch set it with the boundary for multipart
    },
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Upload failed");
  return json.data;
}

export async function rateRide(
  bookingId: string,
  rating: number,
): Promise<void> {
  await post(`/rides/${bookingId}/rate`, { rating });
}
