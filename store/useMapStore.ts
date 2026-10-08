import { create } from 'zustand';

export type LabelMode = 'regions' | 'spots' | 'emirates' | 'both' | 'all';

interface MapState {
  selectedRegions: string[];
  selectedSpots: string[];
  labelMode: LabelMode;
  themeColor: string;
  userName: string;
  userPhoto: string | null;
  toggleRegion: (regionId: string) => void;
  toggleSpot: (spotId: string, parentRegionId?: string) => void;
  setLabelMode: (mode: LabelMode) => void;
  setThemeColor: (color: string) => void;
  setUserName: (name: string) => void;
  setUserPhoto: (photoUrl: string) => void;
  clearAll: () => void;
  selectAll: (regionIds: string[]) => void;
  selectAllSpots: (spotIds: string[], autoSelectRegions?: string[]) => void;
  clearSpots: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  selectedRegions: [],
  selectedSpots: [],
  labelMode: 'regions',
  themeColor: '#009639', // UAE Green
  userName: '',
  userPhoto: null,
  
  toggleRegion: (regionId) => set((state) => ({
    selectedRegions: state.selectedRegions.includes(regionId)
      ? state.selectedRegions.filter((id) => id !== regionId)
      : [...state.selectedRegions, regionId]
  })),

  toggleSpot: (spotId, parentRegionId) => set((state) => {
    const isSelected = state.selectedSpots.includes(spotId);
    const newSpots = isSelected
      ? state.selectedSpots.filter((id) => id !== spotId)
      : [...state.selectedSpots, spotId];
    
    let newRegions = state.selectedRegions;
    if (!isSelected && parentRegionId && !newRegions.includes(parentRegionId)) {
      newRegions = [...newRegions, parentRegionId];
    }

    return {
      selectedSpots: newSpots,
      selectedRegions: newRegions,
    };
  }),
  
  setLabelMode: (mode) => set({ labelMode: mode }),
  setThemeColor: (color) => set({ themeColor: color }),
  setUserName: (name) => set({ userName: name }),
  setUserPhoto: (photoUrl) => set({ userPhoto: photoUrl }),
  clearAll: () => set({ selectedRegions: [], selectedSpots: [] }),
  selectAll: (regionIds) => set({ selectedRegions: regionIds }),
  selectAllSpots: (spotIds, autoSelectRegions = []) => set((state) => ({
    selectedSpots: spotIds,
    selectedRegions: Array.from(new Set([...state.selectedRegions, ...autoSelectRegions])),
  })),
  clearSpots: () => set({ selectedSpots: [] }),
}));
