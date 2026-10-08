import { create } from 'zustand';

interface MapState {
  selectedRegions: string[];
  themeColor: string;
  userName: string;
  userPhoto: string | null;
  toggleRegion: (regionId: string) => void;
  setThemeColor: (color: string) => void;
  setUserName: (name: string) => void;
  setUserPhoto: (photoUrl: string) => void;
  clearAll: () => void;
  selectAll: (regionIds: string[]) => void;
}

export const useMapStore = create<MapState>((set) => ({
  selectedRegions: [],
  themeColor: '#10b981', // emerald-500
  userName: '',
  userPhoto: null,
  
  toggleRegion: (regionId) => set((state) => ({
    selectedRegions: state.selectedRegions.includes(regionId)
      ? state.selectedRegions.filter((id) => id !== regionId)
      : [...state.selectedRegions, regionId]
  })),
  
  setThemeColor: (color) => set({ themeColor: color }),
  setUserName: (name) => set({ userName: name }),
  setUserPhoto: (photoUrl) => set({ userPhoto: photoUrl }),
  clearAll: () => set({ selectedRegions: [] }),
  selectAll: (regionIds) => set({ selectedRegions: regionIds }),
}));
