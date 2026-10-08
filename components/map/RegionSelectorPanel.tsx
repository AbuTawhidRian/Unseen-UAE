import React, { useState, useMemo } from 'react';
import { useMapStore } from '@/store/useMapStore';
import { Search, Trash2, CheckCircle2, Sparkles, MapPin, Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TOURIST_SPOTS, TOTAL_TOURIST_SPOTS, TouristSpot } from '@/data/touristSpots';

export const EMIRATES_DATA = [
  {
    id: 'abu-dhabi',
    name: 'Abu Dhabi',
    regions: [
      { id: 'ad-city', name: 'Abu Dhabi City' },
      { id: 'al-ain', name: 'Al Ain' },
      { id: 'al-dhafra', name: 'Al Dhafra (Liwa)' },
    ]
  },
  {
    id: 'dubai',
    name: 'Dubai',
    regions: [
      { id: 'dxb-city', name: 'Dubai City' },
      { id: 'hatta', name: 'Hatta' },
      { id: 'marmoom', name: 'Al Marmoom' },
    ]
  },
  {
    id: 'sharjah',
    name: 'Sharjah',
    regions: [
      { id: 'shj-city', name: 'Sharjah City' },
      { id: 'khorfakkan', name: 'Khorfakkan' },
      { id: 'kalba', name: 'Kalba' },
      { id: 'dibba', name: 'Dibba Al-Hisn' },
      { id: 'dhaid', name: 'Al Dhaid' },
    ]
  },
  {
    id: 'rak',
    name: 'Ras Al Khaimah',
    regions: [
      { id: 'rak-city', name: 'RAK City' },
      { id: 'jebel-jais', name: 'Jebel Jais' },
    ]
  },
  {
    id: 'fujairah',
    name: 'Fujairah',
    regions: [
      { id: 'fuj-city', name: 'Fujairah City' },
      { id: 'dibba-fuj', name: 'Dibba Al-Fujairah' },
      { id: 'wadi-wurayah', name: 'Wadi Wurayah' },
    ]
  },
  {
    id: 'ajman',
    name: 'Ajman',
    regions: [
      { id: 'ajman-city', name: 'Ajman City' },
      { id: 'masfout', name: 'Masfout' },
    ]
  },
  {
    id: 'uaq',
    name: 'Umm Al Quwain',
    regions: [
      { id: 'uaq-city', name: 'UAQ City' },
      { id: 'al-sinniyah', name: 'Al Sinniyah Island' },
    ]
  }
];

const TOTAL_REGIONS = EMIRATES_DATA.reduce((acc, emirate) => acc + emirate.regions.length, 0);
const ALL_REGION_IDS = EMIRATES_DATA.flatMap(e => e.regions.map(r => r.id));
const ALL_SPOT_IDS = TOURIST_SPOTS.map(s => s.id);
const SPOT_CATEGORIES = ['All', 'Landmark', 'Culture', 'Nature', 'Adventure', 'Beach', 'Theme Park'] as const;

export default function RegionSelectorPanel() {
  const { 
    selectedRegions, 
    selectedSpots = [], 
    toggleRegion, 
    toggleSpot, 
    clearAll, 
    selectAll, 
    selectAllSpots, 
    clearSpots, 
    themeColor,
    setLabelMode,
  } = useMapStore();

  const [activeTab, setActiveTab] = useState<'regions' | 'spots'>('regions');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleTabChange = (tab: 'regions' | 'spots') => {
    setActiveTab(tab);
    setLabelMode(tab);
  };

  // Filtered Regions
  const filteredEmirates = useMemo(() => {
    if (!search.trim()) return EMIRATES_DATA;
    return EMIRATES_DATA.map(emirate => ({
      ...emirate,
      regions: emirate.regions.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
    })).filter(e => e.regions.length > 0);
  }, [search]);

  // Filtered Tourist Spots
  const filteredSpots = useMemo(() => {
    return TOURIST_SPOTS.filter(spot => {
      const matchesSearch = !search.trim() || 
        spot.name.toLowerCase().includes(search.toLowerCase()) || 
        spot.emirateName.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || spot.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  // Group spots by emirate
  const spotsByEmirate = useMemo(() => {
    const groups: Record<string, TouristSpot[]> = {};
    filteredSpots.forEach(spot => {
      if (!groups[spot.emirateName]) groups[spot.emirateName] = [];
      groups[spot.emirateName].push(spot);
    });
    return groups;
  }, [filteredSpots]);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200/80 overflow-hidden flex flex-col h-full transition-all">
      {/* Top Header & Tab Switcher */}
      <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-b from-gray-50/80 to-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-extrabold text-gray-900 text-base tracking-tight">Destinations & Places</h2>
            <p className="text-[11px] font-medium text-gray-400">Select regions and tourist spots visited</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 font-bold text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {activeTab === 'regions' 
                ? `${selectedRegions.length} / ${TOTAL_REGIONS}` 
                : `${selectedSpots.length} / ${TOTAL_TOURIST_SPOTS}`}
            </span>
          </div>
        </div>

        {/* Tab Switcher: Regions vs Tourist Spots */}
        <div className="flex p-1 bg-gray-100/90 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => handleTabChange('regions')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'regions'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>20 Regions ({selectedRegions.length})</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('spots')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'spots'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-amber-500" />
            <span>Tourist Spots ({selectedSpots.length})</span>
          </button>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="p-4 border-b border-gray-100 space-y-3 bg-white">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder={activeTab === 'regions' ? "Search Abu Dhabi, Hatta, Al Ain..." : "Search Burj Khalifa, Mosque, Louvre..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50/80 border border-gray-200 rounded-xl py-2 pl-9 pr-8 text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs px-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filters (Only for Tourist Spots - Responsive wrapping so all chips are visible) */}
        {activeTab === 'spots' && (
          <div className="flex flex-wrap gap-1.5 pt-0.5 text-[11px] font-semibold">
            {SPOT_CATEGORIES.map(category => {
              const isSelected = selectedCategory === category;
              const count = category === 'All' 
                ? TOURIST_SPOTS.length 
                : TOURIST_SPOTS.filter(s => s.category === category).length;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-all active:scale-95 border",
                    isSelected
                      ? "bg-gray-900 text-white border-gray-900 shadow-xs font-bold"
                      : "bg-gray-50 text-gray-600 border-gray-200/80 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300"
                  )}
                >
                  <span>{category}</span>
                  <span className={cn(
                    "text-[10px] px-1 py-0.2 rounded-md font-bold",
                    isSelected ? "bg-white/20 text-white" : "text-gray-400 bg-gray-200/60"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Global Quick Actions */}
        <div className="flex gap-2">
          {activeTab === 'regions' ? (
            <>
              <button 
                type="button"
                onClick={() => selectAll(ALL_REGION_IDS)}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-all border border-gray-200/80 active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Select All Regions</span>
              </button>
              <button 
                type="button"
                onClick={clearAll}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg transition-all border border-gray-200/80 active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </>
          ) : (
            <>
              <button 
                type="button"
                onClick={() => selectAllSpots(ALL_SPOT_IDS, TOURIST_SPOTS.map(s => s.regionId))}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-all border border-gray-200/80 active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                <span>Select All Spots</span>
              </button>
              <button 
                type="button"
                onClick={clearSpots}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg transition-all border border-gray-200/80 active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Spots</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main List Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 hidden-scrollbar">
        {activeTab === 'regions' ? (
          /* ── Regions Tab Content ────────────────────────────── */
          filteredEmirates.map(emirate => {
            const emirateSelectedCount = emirate.regions.filter(r => selectedRegions.includes(r.id)).length;
            const isAllEmirateSelected = emirateSelectedCount === emirate.regions.length;
            const emiratePercent = Math.round((emirateSelectedCount / emirate.regions.length) * 100);

            return (
              <div key={emirate.id} className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => {
                      const allIds = emirate.regions.map(r => r.id);
                      if (isAllEmirateSelected) {
                        allIds.forEach(id => {
                          if (selectedRegions.includes(id)) toggleRegion(id);
                        });
                      } else {
                        allIds.forEach(id => {
                          if (!selectedRegions.includes(id)) toggleRegion(id);
                        });
                      }
                    }}
                    className="group flex items-center gap-2 text-left"
                    title="Click to toggle entire emirate"
                  >
                    <span className="text-xs font-bold text-gray-800 uppercase tracking-wider group-hover:text-emerald-700 transition-colors">
                      {emirate.name}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                      {emirateSelectedCount}/{emirate.regions.length}
                    </span>
                  </button>

                  <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${emiratePercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {emirate.regions.map(region => {
                    const isSelected = selectedRegions.includes(region.id);
                    return (
                      <button
                        key={region.id}
                        type="button"
                        onClick={() => toggleRegion(region.id)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 border",
                          isSelected 
                            ? "text-white shadow-xs font-semibold border-transparent" 
                            : "bg-white text-gray-600 border-gray-200/70 hover:border-gray-300 hover:bg-gray-50"
                        )}
                        style={isSelected ? { backgroundColor: themeColor } : {}}
                      >
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full transition-colors",
                          isSelected ? "bg-white" : "bg-gray-300"
                        )} />
                        <span>{region.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          /* ── Tourist Spots Tab Content ──────────────────────── */
          Object.entries(spotsByEmirate).map(([emirateName, spots]) => {
            const visitedCount = spots.filter(s => selectedSpots.includes(s.id)).length;
            const percent = Math.round((visitedCount / spots.length) * 100);

            return (
              <div key={emirateName} className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    {emirateName}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500 bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 rounded-full">
                    {visitedCount} / {spots.length} visited
                  </span>
                </div>

                <div className="space-y-1.5">
                  {spots.map(spot => {
                    const isSelected = selectedSpots.includes(spot.id);

                    return (
                      <button
                        key={spot.id}
                        type="button"
                        onClick={() => toggleSpot(spot.id, spot.regionId)}
                        className={cn(
                          "w-full text-left flex items-center justify-between p-2.5 rounded-2xl transition-all border active:scale-[0.99]",
                          isSelected
                            ? "bg-amber-50/80 border-amber-300 text-amber-950 shadow-xs"
                            : "bg-white border-gray-200/70 hover:border-gray-300 hover:bg-gray-50/80 text-gray-700"
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <div className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs transition-colors",
                            isSelected ? "bg-amber-500 text-white" : "border border-gray-300 bg-white"
                          )}>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                          <span className="text-xs font-semibold truncate leading-tight">
                            {spot.name}
                          </span>
                        </div>
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0",
                          isSelected 
                            ? "bg-amber-200/60 text-amber-900" 
                            : "bg-gray-100 text-gray-500"
                        )}>
                          {spot.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}

        {((activeTab === 'regions' && filteredEmirates.length === 0) || 
          (activeTab === 'spots' && Object.keys(spotsByEmirate).length === 0)) && (
          <div className="text-center py-8 text-gray-400 text-xs">
            No destinations found matching "{search}"
          </div>
        )}
      </div>
    </div>
  );
}
