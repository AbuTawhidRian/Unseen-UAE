'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Floating landmark chips placed around the hero
const FLOATING_BADGES = [
  {
    id: 'burj-khalifa',
    label: 'Burj Khalifa',
    sub: '828m World’s Tallest',
    icon: '✨',
    color: 'from-amber-500/10 to-orange-500/10 border-amber-200/60 text-amber-900',
    dotColor: 'bg-amber-500',
    desktopPos: 'top-8 right-[5%] xl:right-[10%]',
    delay: 0,
    duration: 5.5,
    yOffset: [0, -12, 0],
    rotateOffset: [0, 1.5, 0],
  },
  {
    id: 'burj-al-arab',
    label: 'Burj Al Arab',
    sub: 'Iconic 7-Star Sail',
    icon: '⛵',
    color: 'from-teal-500/10 to-cyan-500/10 border-teal-200/60 text-teal-900',
    dotColor: 'bg-teal-500',
    desktopPos: 'top-10 left-[5%] xl:left-[10%]',
    delay: 1.2,
    duration: 6,
    yOffset: [0, -14, 0],
    rotateOffset: [0, -1.8, 0],
  },
  {
    id: 'museum-of-future',
    label: 'Museum of the Future',
    sub: 'Futuristic Torus Ring',
    icon: '🏛️',
    color: 'from-emerald-600/10 to-teal-500/10 border-emerald-200/60 text-emerald-950',
    dotColor: 'bg-emerald-600',
    desktopPos: 'bottom-20 right-[7%] xl:right-[13%]',
    delay: 1.8,
    duration: 6.4,
    yOffset: [0, 12, 0],
    rotateOffset: [0, -1.5, 0],
  },
  {
    id: 'sheikh-zayed',
    label: 'Sheikh Zayed Mosque',
    sub: 'Abu Dhabi Grand Wonder',
    icon: '🕌',
    color: 'from-blue-600/10 to-indigo-500/10 border-blue-200/60 text-blue-950',
    dotColor: 'bg-blue-600',
    desktopPos: 'bottom-16 left-[7%] xl:left-[13%]',
    delay: 0.6,
    duration: 5.2,
    yOffset: [0, 10, 0],
    rotateOffset: [0, 1.2, 0],
  },
];

// Golden desert shimmer particles drifting gently
const PARTICLES = [
  { id: 1, left: '12%', top: '25%', size: 4, duration: 6, delay: 0 },
  { id: 2, left: '22%', top: '60%', size: 5, duration: 7.5, delay: 1 },
  { id: 3, left: '40%', top: '18%', size: 3, duration: 5, delay: 2 },
  { id: 4, left: '62%', top: '70%', size: 6, duration: 8, delay: 0.5 },
  { id: 5, left: '80%', top: '22%', size: 4, duration: 6.5, delay: 1.5 },
  { id: 6, left: '90%', top: '50%', size: 5, duration: 7, delay: 2.2 },
];

export default function UaeHeroAnimations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none -z-0">
      {/* 1. UAE Flag Ambient Gradient Aura (Soft luxury blur) */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[340px] opacity-40 blur-3xl pointer-events-none">
        <div className="w-full h-full bg-gradient-to-r from-emerald-400/30 via-amber-200/40 to-red-400/25 rounded-full" />
      </div>

      {/* 2. Soaring Desert Falcon (Arabian Peregrine Falcon gliding across the sky) */}
      <motion.div
        initial={{ x: '-10vw', y: '10%', opacity: 0 }}
        animate={{
          x: ['-5vw', '105vw'],
          y: ['12%', '7%', '14%', '9%'],
          opacity: [0, 0.85, 0.9, 0.85, 0],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
          repeatDelay: 4,
        }}
        className="absolute top-0 left-0 z-10 flex items-center gap-1.5"
      >
        <svg
          viewBox="0 0 64 32"
          className="w-12 h-6 text-gray-700/60 drop-shadow-xs"
          fill="currentColor"
        >
          {/* Stylized falcon in flight */}
          <path d="M32 14 C26 7, 14 0, 0 6 C8 12, 20 15, 30 17 C26 21, 24 28, 28 32 C31 27, 33 22, 34 17 C44 15, 56 12, 64 6 C50 0, 38 7, 32 14 Z" />
        </svg>
      </motion.div>

      {/* 3. Golden Desert Sparkle Dust (Warm Arabian shimmer) */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 shadow-sm"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -25, 0],
            x: [0, 10, -8, 0],
            opacity: [0.2, 0.85, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* 4. Desktop Floating UAE Landmark Badges */}
      <div className="hidden lg:block">
        {FLOATING_BADGES.map((b) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: b.yOffset,
              rotate: b.rotateOffset,
            }}
            transition={{
              opacity: { duration: 0.6, delay: b.delay },
              scale: { duration: 0.6, delay: b.delay },
              y: {
                duration: b.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: b.delay,
              },
              rotate: {
                duration: b.duration * 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: b.delay,
              },
            }}
            className={`absolute ${b.desktopPos} pointer-events-auto cursor-pointer group z-20`}
          >
            <div
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md border shadow-xs transition-all duration-300 group-hover:shadow-md group-hover:scale-105 group-hover:bg-white ${b.color}`}
            >
              <span className="text-base select-none">{b.icon}</span>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-[12px] leading-tight tracking-tight text-gray-900 group-hover:text-emerald-800 transition-colors">
                  {b.label}
                </span>
                <span className="text-[10px] font-semibold text-gray-600 leading-tight">
                  {b.sub}
                </span>
              </div>
              <span className={`w-1.5 h-1.5 rounded-full ${b.dotColor} animate-pulse shrink-0`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* 5. PROMINENT ICONIC UAE ARCHITECTURAL SKYLINE & DUNES HORIZON */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-0">
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          className="w-full h-28 sm:h-36 md:h-44 lg:h-52 text-slate-700"
          fill="none"
        >
          {/* Back Dune Line with subtle animated wind wave */}
          <motion.path
            d="M0,125 C320,155 520,85 820,120 C1100,150 1300,95 1440,115 L1440,200 L0,200 Z"
            fill="url(#dune-grad-back)"
            initial={{ opacity: 0.5 }}
            animate={{
              d: [
                'M0,125 C320,155 520,85 820,120 C1100,150 1300,95 1440,115 L1440,200 L0,200 Z',
                'M0,120 C340,140 500,95 840,110 C1120,140 1280,105 1440,120 L1440,200 L0,200 Z',
                'M0,125 C320,155 520,85 820,120 C1100,150 1300,95 1440,115 L1440,200 L0,200 Z',
              ],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* ══════════════════════════════════════════════════════════════════════════
              ICONIC UAE STRUCTURES SILHOUETTE (Burj Al Arab, Burj Khalifa, Museum of the Future)
              ══════════════════════════════════════════════════════════════════════════ */}
          <g className="text-slate-400/80">
            {/* ── 1. BURJ AL ARAB (Iconic 7-Star Sail & Cantilevered Helipad) ── */}
            <g className="transition-opacity hover:opacity-100 cursor-pointer" id="burj-al-arab-svg">
              {/* Triangular base foundation */}
              <polygon points="310,170 365,170 345,164" fill="currentColor" opacity="0.6" />

              {/* Iconic billowing front sail curve */}
              <path
                d="M335,170 C302,130 305,78 340,48 L343,48 C310,78 307,130 338,170 Z"
                fill="currentColor"
                opacity="0.9"
              />

              {/* Rear curved exoskeleton arch & mast */}
              <path
                d="M340,48 C375,85 372,135 362,170 L358,170 C367,135 370,85 338,48 Z"
                fill="currentColor"
                opacity="0.75"
              />

              {/* Internal structural horizontal deck lines & criss-cross ties */}
              <line x1="316" y1="142" x2="363" y2="142" stroke="currentColor" strokeWidth="1" opacity="0.5" />
              <line x1="313" y1="116" x2="366" y2="116" stroke="currentColor" strokeWidth="1" opacity="0.5" />
              <line x1="318" y1="90"  x2="358" y2="90"  stroke="currentColor" strokeWidth="1" opacity="0.5" />
              <line x1="327" y1="68"  x2="348" y2="68"  stroke="currentColor" strokeWidth="1" opacity="0.5" />

              {/* Cantilevered circular helipad sticking out to the left near top */}
              <line x1="334" y1="70" x2="295" y2="67" stroke="currentColor" strokeWidth="2" opacity="0.9" />
              <ellipse cx="295" cy="67" rx="15" ry="4.5" fill="currentColor" opacity="0.9" />
              <ellipse cx="295" cy="67" rx="11" ry="3" fill="#38bdf8" opacity="0.8" />

              {/* Sky View Restaurant cantilever sticking out to the right */}
              <polygon points="348,66 372,66 368,72 346,72" fill="currentColor" opacity="0.85" />

              {/* Summit needle mast */}
              <line x1="340" y1="48" x2="340" y2="32" stroke="currentColor" strokeWidth="2" opacity="0.9" />
              {/* Helipad / mast beacon twinkle */}
              <motion.circle
                cx="340"
                cy="32"
                r="2.5"
                fill="#38bdf8"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.4, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </g>

            {/* ── 2. BURJ KHALIFA (Bottom-to-Top Ascending Light Show & Stepped Spire) ── */}
            <g className="transition-opacity hover:opacity-100 cursor-pointer" id="burj-khalifa-svg">
              {/* Broad Y-shaped podium base (Ground level y = 170) */}
              <polygon points="680,170 760,170 752,150 688,150" fill="currentColor" opacity="0.5" />

              {/* Tier 1 Setback (Level 1) */}
              <polygon points="692,150 748,150 744,122 696,122" fill="currentColor" opacity="0.65" />
              <line x1="720" y1="150" x2="720" y2="122" stroke="#ffffff" strokeWidth="0.75" opacity="0.6" />

              {/* Tier 2 Setback (Level 2) */}
              <polygon points="700,122 740,122 737,94 703,94" fill="currentColor" opacity="0.75" />
              <line x1="720" y1="122" x2="720" y2="94" stroke="#ffffff" strokeWidth="0.75" opacity="0.6" />

              {/* Tier 3 Setback (Level 3 - Asymmetrical stepped tiers) */}
              <polygon points="706,94 734,94 731,68 709,68" fill="currentColor" opacity="0.85" />

              {/* Tier 4 Setback (Level 4 - Upper pinnacle body) */}
              <polygon points="712,68 728,68 726,44 714,44" fill="currentColor" opacity="0.9" />

              {/* Spire Base & Steel Pipe Needle */}
              <polygon points="715,44 725,44 723,24 717,24" fill="currentColor" opacity="0.95" />
              <line x1="720" y1="24" x2="720" y2="8" stroke="currentColor" strokeWidth="2.5" opacity="1" />

              {/* Architectural vertical mullions */}
              <line x1="717" y1="68" x2="717" y2="44" stroke="#ffffff" strokeWidth="0.6" opacity="0.5" />
              <line x1="723" y1="68" x2="723" y2="44" stroke="#ffffff" strokeWidth="0.6" opacity="0.5" />

              {/* ──────────────────────────────────────────────────────────
                  BURJ KHALIFA BOTTOM-TO-TOP ANIMATION
                  (Signature ascending laser beam & climbing LED light show)
                  ────────────────────────────────────────────────────────── */}

              {/* 1. Ascending Neon Spine Path (Bottom to Top) */}
              <line
                x1="720"
                y1="170"
                x2="720"
                y2="8"
                stroke="url(#khalifa-spine-laser)"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.8"
              />

              {/* 2. Primary Ascending Laser Beam (Shoots Bottom to Top, Ground to Spire) */}
              <motion.circle
                cx="720"
                r="4.5"
                fill="#38bdf8"
                filter="url(#khalifa-glow)"
                animate={{
                  cy: [170, 145, 118, 88, 58, 24, 8],
                  opacity: [0, 1, 1, 1, 1, 1, 0],
                  scale: [0.8, 1.2, 1.4, 1.6, 1.8, 2, 0.4],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />

              {/* Trailing Tail Beam */}
              <motion.line
                x1="720"
                x2="720"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#khalifa-glow)"
                animate={{
                  y1: [170, 150, 125, 95, 65, 30, 8],
                  y2: [155, 135, 108, 78, 48, 16, 8],
                  opacity: [0, 0.9, 0.95, 0.9, 0.8, 0.4, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />

              {/* 3. Secondary Warm Gold Pulse (Shoots Bottom to Top with offset) */}
              <motion.circle
                cx="720"
                r="3.5"
                fill="#f59e0b"
                filter="url(#khalifa-glow)"
                animate={{
                  cy: [170, 145, 118, 88, 58, 24, 8],
                  opacity: [0, 0.9, 1, 1, 0.9, 1, 0],
                  scale: [0.8, 1.1, 1.3, 1.4, 1.6, 1.8, 0.3],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: 1.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />

              {/* 4. Sequential Floor Lighting Flashes as Beam Climbs Bottom to Top */}
              {/* Level 1 Floor Flash */}
              <motion.line
                x1="694"
                y1="150"
                x2="746"
                y2="150"
                stroke="#38bdf8"
                strokeWidth="2"
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, times: [0, 0.15, 0.3] }}
              />
              {/* Level 2 Floor Flash */}
              <motion.line
                x1="701"
                y1="122"
                x2="739"
                y2="122"
                stroke="#38bdf8"
                strokeWidth="2"
                animate={{ opacity: [0, 0, 0.85, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, times: [0, 0.25, 0.45, 0.6] }}
              />
              {/* Level 3 Floor Flash */}
              <motion.line
                x1="707"
                y1="94"
                x2="733"
                y2="94"
                stroke="#38bdf8"
                strokeWidth="2"
                animate={{ opacity: [0, 0, 0.9, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, times: [0, 0.4, 0.6, 0.75] }}
              />
              {/* Level 4 Floor Flash */}
              <motion.line
                x1="713"
                y1="68"
                x2="727"
                y2="68"
                stroke="#38bdf8"
                strokeWidth="2"
                animate={{ opacity: [0, 0, 0.95, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, times: [0, 0.55, 0.75, 0.9] }}
              />

              {/* 5. Explosive Starburst Beacon at Top Needle Summit (828m Spire Tip) */}
              <motion.circle
                cx="720"
                cy="8"
                r="7"
                fill="#38bdf8"
                filter="url(#khalifa-glow)"
                animate={{
                  opacity: [0, 0, 0, 0.2, 1, 0],
                  scale: [0.2, 0.2, 0.2, 0.5, 3.2, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  times: [0, 0.7, 0.82, 0.9, 0.96, 1],
                  ease: 'easeOut',
                }}
              />
              {/* Summit center white flash point */}
              <motion.circle
                cx="720"
                cy="8"
                r="3"
                fill="#ffffff"
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scale: [0.9, 1.4, 0.9],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </g>

            {/* ── 3. MUSEUM OF THE FUTURE (Iconic Torus Ring with Arabic Calligraphy & Central Void) ── */}
            <g className="transition-opacity hover:opacity-100 cursor-pointer" id="museum-of-future-svg">
              {/* Podium green hill base */}
              <path d="M1005,170 Q1065,160 1125,170 Z" fill="currentColor" opacity="0.5" />

              {/* Outer Oblong Torus Shell */}
              <path
                d="M1012,160 C988,120 1018,80 1065,80 C1112,80 1142,120 1118,160 C1095,168 1035,168 1012,160 Z"
                fill="currentColor"
                opacity="0.85"
              />

              {/* Central Hollow Void / Oval Hole (The Signature Architecture of the Museum) */}
              <path
                d="M1035,140 C1025,118 1040,100 1065,100 C1090,100 1105,118 1095,140 C1082,148 1048,148 1035,140 Z"
                fill="#f8fafc"
                opacity="0.95"
              />

              {/* Inner glowing energy pulse through the void hole */}
              <motion.ellipse
                cx="1065"
                cy="120"
                rx="24"
                ry="14"
                fill="url(#future-glow)"
                animate={{
                  opacity: [0.3, 0.85, 0.3],
                  scale: [0.95, 1.08, 0.95],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Laser-cut Arabic Calligraphy Windows across the curved shell */}
              <g stroke="#ffffff" strokeWidth="1.2" opacity="0.75" strokeLinecap="round">
                {/* Upper curve calligraphy strokes */}
                <path d="M1035,90 Q1045,86 1055,87" />
                <path d="M1070,87 Q1082,86 1095,90" />
                {/* Left curve calligraphy strokes */}
                <path d="M1016,116 Q1020,109 1024,120" />
                <path d="M1018,134 Q1022,128 1026,136" />
                {/* Right curve calligraphy strokes */}
                <path d="M1114,116 Q1110,109 1106,120" />
                <path d="M1112,134 Q1108,128 1104,136" />
                {/* Bottom curve calligraphy strokes */}
                <path d="M1048,156 Q1065,158 1082,156" />
              </g>
            </g>

            {/* ── Additional Complementary Landmarks (Sheikh Zayed Mosque & Dubai Frame) ── */}
            {/* Abu Dhabi Sheikh Zayed Grand Mosque (Far Left) */}
            <g opacity="0.55">
              <path d="M115,170 L117,105 L121,105 L123,170 Z" fill="currentColor" />
              <path d="M119,97 A3.5,3.5 0 0,1 119,104 A3.5,3.5 0 0,1 119,97 Z" fill="currentColor" />
              <path d="M125,170 Q145,130 165,170 Z" fill="currentColor" />
              <path d="M167,170 L169,105 L173,105 L175,170 Z" fill="currentColor" />
              <path d="M171,97 A3.5,3.5 0 0,1 171,104 A3.5,3.5 0 0,1 171,97 Z" fill="currentColor" />
            </g>

            {/* Dubai Frame (Mid-Left between Mosque and Burj Al Arab) */}
            <g opacity="0.45">
              <rect x="225" y="100" width="28" height="70" fill="none" stroke="currentColor" strokeWidth="4" />
            </g>

            {/* Distant Jebel Jais Ridge Mountains (Far Right) */}
            <path
              d="M1240,170 L1280,120 L1315,142 L1365,110 L1410,148 L1440,130 L1440,200 L1240,200 Z"
              fill="currentColor"
              opacity="0.3"
            />
          </g>

          {/* Front Golden Dune Wave */}
          <motion.path
            d="M0,145 C240,120 480,162 720,135 C960,110 1200,150 1440,136 L1440,200 L0,200 Z"
            fill="url(#dune-grad-front)"
            initial={{ opacity: 0.7 }}
            animate={{
              d: [
                'M0,145 C240,120 480,162 720,135 C960,110 1200,150 1440,136 L1440,200 L0,200 Z',
                'M0,140 C260,130 460,150 740,140 C980,120 1180,140 1440,132 L1440,200 L0,200 Z',
                'M0,145 C240,120 480,162 720,135 C960,110 1200,150 1440,136 L1440,200 L0,200 Z',
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <defs>
            <linearGradient id="khalifa-spine-laser" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
              <stop offset="40%" stopColor="#06b6d4" stopOpacity="0.5" />
              <stop offset="80%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>

            <filter id="khalifa-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="dune-grad-back" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.75" />
            </linearGradient>

            <linearGradient id="dune-grad-front" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f1f5f9" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.98" />
            </linearGradient>

            <radialGradient id="future-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
