import { create } from "zustand";

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface Ride {
  id: number;
  name: string;
  price: string;
}

interface RideStore {
  pickup: Coordinate | null;
  destination: Coordinate | null;
  selectedRide: Ride | null;
  setPickup: (pickup: Coordinate) => void;
  setDestination: (destination: Coordinate) => void;
  setRide: (ride: Ride) => void;
}

export const useRideStore = create<RideStore>((set) => ({
  pickup: null,
  destination: null,
  selectedRide: null,
  setPickup: (pickup) => set({ pickup }),
  setDestination: (destination) => set({ destination }),
  setRide: (ride) => set({ selectedRide: ride }),
}));
