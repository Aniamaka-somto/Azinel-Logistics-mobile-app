import { create } from "zustand";

export type VehicleClass = "sedan" | "suv";

// Replace the existing CityArea interface with this:
export interface CityArea {
  name: string; // e.g. "Victoria Island, Lagos"
  placeId: string; // backend/Google Places ID — empty string for now
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface IntercityBooking {
  originCity: string | null;
  destinationCity: string | null;
  originArea: CityArea | null;
  destinationArea: CityArea | null;
  departureDate: string | null;
  departureTime: string | null;
  vehicleClass: VehicleClass | null;
  passengers: number;
  estimatedPrice: number | null;
}

interface IntercityStore extends IntercityBooking {
  setOriginCity: (city: string) => void;
  setDestinationCity: (city: string) => void;
  setOriginArea: (area: CityArea) => void;
  setDestinationArea: (area: CityArea) => void;
  setDepartureDate: (date: string) => void;
  setDepartureTime: (time: string) => void;
  setVehicleClass: (cls: VehicleClass) => void;
  setPassengers: (count: number) => void;
  setEstimatedPrice: (price: number) => void;
  reset: () => void;
}

const initialState: IntercityBooking = {
  originCity: null,
  destinationCity: null,
  originArea: null,
  destinationArea: null,
  departureDate: null,
  departureTime: null,
  vehicleClass: null,
  passengers: 1,
  estimatedPrice: null,
};

export const useIntercityStore = create<IntercityStore>((set) => ({
  ...initialState,
  setOriginCity: (originCity) => set({ originCity }),
  setDestinationCity: (destinationCity) => set({ destinationCity }),
  setOriginArea: (originArea) => set({ originArea }),
  setDestinationArea: (destinationArea) => set({ destinationArea }),
  setDepartureDate: (departureDate) => set({ departureDate }),
  setDepartureTime: (departureTime) => set({ departureTime }),
  setVehicleClass: (vehicleClass) => set({ vehicleClass }),
  setPassengers: (passengers) => set({ passengers }),
  setEstimatedPrice: (estimatedPrice) => set({ estimatedPrice }),
  reset: () => set(initialState),
}));
