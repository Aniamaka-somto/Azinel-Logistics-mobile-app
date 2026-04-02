import { create } from "zustand";

export type ItemCategory =
  | "document"
  | "small_parcel"
  | "large_parcel"
  | "fragile"
  | "electronics";

export interface LocationPoint {
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  } | null;
}

export interface LogisticsBooking {
  pickup: LocationPoint;
  delivery: LocationPoint;
  item: {
    category: ItemCategory | null;
    weight: number | null;
    description: string;
  };
  receiver: {
    name: string;
    phone: string;
  };
  estimatedPrice: number | null;
}

interface LogisticsStore extends LogisticsBooking {
  setPickup: (pickup: LocationPoint) => void;
  setDelivery: (delivery: LocationPoint) => void;
  setItemCategory: (category: ItemCategory) => void;
  setItemWeight: (weight: number) => void;
  setItemDescription: (description: string) => void;
  setReceiver: (receiver: { name: string; phone: string }) => void;
  setEstimatedPrice: (price: number) => void;
  reset: () => void;
}

const initialState: LogisticsBooking = {
  pickup: { address: "", coordinates: null },
  delivery: { address: "", coordinates: null },
  item: { category: null, weight: null, description: "" },
  receiver: { name: "", phone: "" },
  estimatedPrice: null,
};

export const useLogisticsStore = create<LogisticsStore>((set) => ({
  ...initialState,
  setPickup: (pickup) => set({ pickup }),
  setDelivery: (delivery) => set({ delivery }),
  setItemCategory: (category) =>
    set((s) => ({ item: { ...s.item, category } })),
  setItemWeight: (weight) => set((s) => ({ item: { ...s.item, weight } })),
  setItemDescription: (description) =>
    set((s) => ({ item: { ...s.item, description } })),
  setReceiver: (receiver) => set({ receiver }),
  setEstimatedPrice: (estimatedPrice) => set({ estimatedPrice }),
  reset: () => set(initialState),
}));
