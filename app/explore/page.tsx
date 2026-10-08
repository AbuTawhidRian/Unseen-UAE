import React from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';

const SPOTS = [
  { id: 1, title: 'Jebel Jais Mountains', location: 'Ras Al Khaimah', type: 'Nature', img: 'https://images.unsplash.com/photo-1546412414-e1885259563a?q=80&w=800&auto=format&fit=crop' },
  { id: 2, title: 'Al Fahidi Historical', location: 'Dubai', type: 'Culture', img: 'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?q=80&w=800&auto=format&fit=crop' },
  { id: 3, title: 'Louvre Abu Dhabi', location: 'Abu Dhabi', type: 'Art', img: 'https://images.unsplash.com/photo-1541846429532-a5214c818816?q=80&w=800&auto=format&fit=crop' },
  { id: 4, title: 'Hatta Dam', location: 'Dubai', type: 'Adventure', img: 'https://images.unsplash.com/photo-1621532453664-90a618f3fc45?q=80&w=800&auto=format&fit=crop' },
  { id: 5, title: 'Wadi Shees', location: 'Sharjah', type: 'Nature', img: 'https://images.unsplash.com/photo-1634641473210-9c2f6d2f3b9c?q=80&w=800&auto=format&fit=crop' },
  { id: 6, title: 'Snoopy Island', location: 'Fujairah', type: 'Beach', img: 'https://images.unsplash.com/photo-1590422749906-8d59186694ea?q=80&w=800&auto=format&fit=crop' },
];

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold">Back to Map</span>
        </Link>
        <span className="text-xl font-black tracking-tight">Explore UAE</span>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Curated Destinations
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Discover the hidden gems and iconic landmarks across all 7 emirates.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['All', 'Nature', 'Culture', 'Art', 'Adventure', 'Beach'].map(cat => (
            <button key={cat} className="px-6 py-2 rounded-full border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-colors">
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SPOTS.map(spot => (
            <div key={spot.id} className="group rounded-3xl overflow-hidden bg-white shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={spot.img} 
                  alt={spot.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-emerald-700 shadow-sm">
                  {spot.type}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{spot.title}</h3>
                <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  {spot.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
