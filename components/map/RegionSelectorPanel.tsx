'use client';

import React, { useState, useMemo } from 'react';
import { useMapStore } from '@/store/useMapStore';
import { Search, Trash2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export default function RegionSelectorPanel() {
  const { selectedRegions, toggleRegion, clearAll, selectAll, themeColor } = useMapStore();
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    if (!search.trim()) return EMIRATES_DATA;
    return EMIRATES_DATA.map(emirate => ({
      ...emirate,
      regions: emirate.regions.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
    })).filter(e => e.regions.length > 0);
  }, [search]);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      {/* Header & Score */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h2 className="font-bold text-gray-800 text-lg">Your Regions</h2>
        <div className="bg-emerald-100 text-emerald-800 font-bold px-4 py-1.5 rounded-full text-sm">
          {selectedRegions.length} / {TOTAL_REGIONS}
        </div>
      </div>

      <div className="p-4 border-b border-gray-100 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search regions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Global Controls */}
        <div className="flex gap-2">
          <button 
            onClick={() => selectAll(ALL_REGION_IDS)}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors border border-gray-200"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Select All
          </button>
          <button 
            onClick={clearAll}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold bg-gray-50 hover:bg-red-50 text-red-600 rounded-lg transition-colors border border-gray-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* Lists */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {filteredData.map(emirate => (
          <div key={emirate.id}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{emirate.name}</h3>
              <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 rounded-md">
                {emirate.regions.filter(r => selectedRegions.includes(r.id)).length}/{emirate.regions.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {emirate.regions.map(region => {
                const isSelected = selectedRegions.includes(region.id);
                return (
                  <button
                    key={region.id}
                    onClick={() => toggleRegion(region.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-all border shadow-sm",
                      isSelected 
                        ? "text-white border-transparent" 
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    )}
                    style={isSelected ? { backgroundColor: themeColor } : {}}
                  >
                    {region.name}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
        {filteredData.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No regions found matching "{search}"
          </div>
        )}
      </div>
    </div>
  );
}
