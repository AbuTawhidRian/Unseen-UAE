'use client';

import React, { useState } from 'react';
import RegionSelectorPanel, { EMIRATES_DATA } from '@/components/map/RegionSelectorPanel';
import CardGeneratorPanel from '@/components/map/CardGeneratorPanel';
import UaeHeroAnimations from '@/components/landing/UaeHeroAnimations';
import { Compass, Sparkles, MapPin, Layers } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useMapStore } from '@/store/useMapStore';

export default function Home() {
  const { selectedRegions, selectedSpots = [] } = useMapStore();
  const [mobileTab, setMobileTab] = useState<'card' | 'regions'>('card');

  // Count visited emirates
  const visitedEmirates = EMIRATES_DATA.filter(e =>
    e.regions.some(r => selectedRegions.includes(r.id))
  ).length;

  return (
    <div className="min-h-screen bg-[#fafbfc] text-gray-900 selection:bg-emerald-500 selection:text-white">
      {/* Minimalist Glass Header */}
      <motion.header 
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-black/[0.05] transition-all"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 h-16 flex items-center justify-between">
          {/* Logo & Emblem */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-gray-900">Unseen UAE</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100/80">
                  🇦🇪 Map
                </span>
              </div>
            </div>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-wide uppercase text-gray-500">
            <Link href="/" className="text-emerald-700 font-bold transition-colors">Explorer</Link>
            <Link href="/explore" className="hover:text-gray-900 transition-colors">Hidden Gems</Link>
          </nav>

          {/* Right Header Status Pill */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100/80 border border-gray-200/60 text-xs font-semibold text-gray-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{visitedEmirates}/7 Emirates</span>
              <span className="text-gray-400">&middot;</span>
              <span className="text-gray-500 font-medium">{selectedRegions.length}/20 Regions</span>
              {selectedSpots.length > 0 && (
                <>
                  <span className="text-gray-400">&middot;</span>
                  <span className="text-amber-700 font-bold">{selectedSpots.length} Spots</span>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section (Minimalist & Living UAE Atmosphere) */}
      <section className="relative w-full pt-14 pb-16 md:pt-20 md:pb-24 overflow-hidden bg-gradient-to-b from-white via-[#f7f9fa] to-[#fafbfc] border-b border-gray-100">
        {/* Living UAE Animations: Soaring Falcon, Floating Landmark Badges, Golden Sparkles & Horizon Skyline */}
        <UaeHeroAnimations />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center relative z-10">
          {/* Tag with subtle animated flag accent */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/80 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-5 shadow-xs backdrop-blur-xs"
          >
            <motion.span
              animate={{ rotate: [0, 12, -12, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              🇦🇪
            </motion.span>
            <span>Interactive UAE Travel Map & Explorer Card</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.12] mb-4"
          >
            How much of the{' '}
            <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
              UAE
            </span>{' '}
            have you explored?
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-500 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-7 font-normal"
          >
            From the silent red dunes of Al Dhafra to the dramatic peaks of Jebel Jais. Mark every region and iconic tourist place you’ve visited and export your personalized high-res card.
          </motion.p>

          {/* Stats Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center flex-wrap gap-4 sm:gap-8 text-xs font-semibold text-gray-600 bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-gray-200/70 shadow-xs"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-900">7</span> Emirates
            </div>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-900">20</span> Iconic Regions
            </div>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-amber-600">32+</span> Tourist Places
            </div>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-emerald-600">Free</span> High-Res Export
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main App Workspace */}
      <main id="workspace" className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-12">
        {/* Mobile View Switcher (Only visible on screens < lg) */}
        <div className="lg:hidden mb-6 flex justify-center sticky top-20 z-40">
          <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-md border border-gray-200/80 flex gap-1 w-full max-w-md">
            <button
              type="button"
              onClick={() => setMobileTab('card')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                mobileTab === 'card'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explorer Card ({visitedEmirates}/7)</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileTab('regions')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                mobileTab === 'regions'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Places & Spots ({selectedRegions.length + selectedSpots.length})</span>
            </button>
          </div>
        </div>

        {/* Workspace Columns */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Panel: Region Selector */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`w-full lg:w-[340px] xl:w-[380px] shrink-0 lg:sticky lg:top-24 max-h-[calc(100vh-7rem)] overflow-y-auto hidden-scrollbar ${
              mobileTab === 'regions' ? 'block' : 'hidden lg:block'
            }`}
          >
            <RegionSelectorPanel />
          </motion.div>

          {/* Right Panel: Map Preview & Customizer */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`w-full flex-1 ${
              mobileTab === 'card' ? 'block' : 'hidden lg:block'
            }`}
          >
            <CardGeneratorPanel />
          </motion.div>
        </div>
      </main>

      {/* Minimalist Footer */}
      <footer className="mt-20 border-t border-gray-200/60 bg-white/60 py-10 px-4 sm:px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-gray-800">Unseen UAE</span>
            <span>&middot;</span>
            <span>Discover every corner of the Emirates</span>
          </div>
          <p>© 2026 Unseen UAE. Free & Open Explorer Card.</p>
        </div>
      </footer>
    </div>
  );
}
