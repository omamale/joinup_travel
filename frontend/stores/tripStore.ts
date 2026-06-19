import { create } from 'zustand';
import { Trip, TripFilters } from '@joinup/types';

interface TripStore {
  filters: TripFilters;
  setFilters: (filters: Partial<TripFilters>) => void;
  resetFilters: () => void;
  selectedTrip: Trip | null;
  setSelectedTrip: (trip: Trip | null) => void;
}

const defaultFilters: TripFilters = {
  page: 1,
  limit: 12,
};

export const useTripStore = create<TripStore>((set) => ({
  filters: defaultFilters,

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters, page: filters.page ?? 1 },
    })),

  resetFilters: () => set({ filters: defaultFilters }),

  selectedTrip: null,
  setSelectedTrip: (trip) => set({ selectedTrip: trip }),
}));
