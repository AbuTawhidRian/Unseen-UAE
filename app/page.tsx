'use client';

import RegionSelectorPanel from '@/components/map/RegionSelectorPanel';
import CardGeneratorPanel from '@/components/map/CardGeneratorPanel';
import { Compass } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50"
      >
        <div className="flex items-center gap-2">
          <Compass className="w-8 h-8 text-emerald-600" />
          <span className="text-xl font-black tracking-tight">Unseen UAE</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-emerald-600 transition-colors">My Map</Link>
          <Link href="/explore" className="hover:text-emerald-600 transition-colors">Travel Spots</Link>
          <Link href="/explore" className="hover:text-emerald-600 transition-colors">Emirate Profiles</Link>
          <Link href="/explore" className="hover:text-emerald-600 transition-colors">Top Travelers</Link>
          <Link href="/explore" className="hover:text-emerald-600 transition-colors">Hidden Gems</Link>
        </nav>
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors">
            English
          </button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center bg-gray-900 overflow-hidden">
        {/* Placeholder for nature background image */}
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1546412414-e1885259563a?q=80&w=2000&auto=format&fit=crop")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-emerald-400 font-semibold mb-4 tracking-widest text-sm uppercase"
          >
            Explore the 7 Emirates
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight"
          >
            How much of the UAE have you explored?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto"
          >
            From the deep dunes of Al Dhafra to the rocky mountains of Hatta. Track your journey and share your explorer card.
          </motion.p>
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}
            className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg shadow-xl"
          >
            Start Selecting Regions ↓
          </motion.button>
        </div>
      </section>

      {/* Main App Workspace (Split View) */}
      <main className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Panel: Selector */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full lg:w-1/3 shrink-0 lg:sticky lg:top-24 max-h-[calc(100vh-8rem)] overflow-y-auto hidden-scrollbar"
        >
          <RegionSelectorPanel />
        </motion.div>

        {/* Right Panel: Map Preview & Generator */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="w-full lg:w-2/3"
        >
          <CardGeneratorPanel />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-[#f0fdf4] mt-24 py-12 px-6 md:px-12 border-t border-emerald-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <Compass className="w-6 h-6 text-emerald-600" />
            <span className="font-bold text-gray-700">Unseen UAE</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Made by AI Architecture</p>
        </div>
      </footer>
    </div>
  );
}
