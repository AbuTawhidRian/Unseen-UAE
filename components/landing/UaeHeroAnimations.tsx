'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mountain, Landmark, Sunset, Waves } from 'lucide-react';

// Floating landmark chips placed around the hero
const FLOATING_BADGES = [
  {
    id: 'burj-khalifa',
    label: 'Burj Khalifa',
    sub: '828m Sky Icon',
    icon: '✨',
    color: 'from-amber-500/10 to-orange-500/10 border-amber-200/60 text-amber-900',
    dotColor: 'bg-amber-500',
    desktopPos: 'top-10 right-[6%] xl:right-[12%]',
    delay: 0,
    duration: 5.5,
    yOffset: [0, -12, 0],
    rotateOffset: [0, 1.5, 0],
  },
  {
    id: 'jebel-jais',
    label: 'Jebel Jais',
    sub: '1,934m UAE Peak',
    icon: '⛰️',
    color: 'from-blue-500/10 to-indigo-500/10 border-blue-200/60 text-blue-900',
    dotColor: 'bg-blue-500',
    desktopPos: 'top-12 left-[6%] xl:left-[12%]',
    delay: 1.2,
    duration: 6,
    yOffset: [0, -14, 0],
    rotateOffset: [0, -1.8, 0],
  },
  {
    id: 'liwa-dunes',
    label: 'Liwa Oasis & Dunes',
    sub: 'Empty Quarter 300m',
    icon: '🐪',
    color: 'from-amber-600/10 to-yellow-500/10 border-amber-200/70 text-amber-950',
    dotColor: 'bg-amber-600',
    desktopPos: 'bottom-20 left-[8%] xl:left-[15%]',
    delay: 0.6,
    duration: 5.2,
    yOffset: [0, 10, 0],
    rotateOffset: [0, 1.2, 0],
  },
  {
    id: 'sheikh-zayed',
    label: 'Sheikh Zayed Mosque',
    sub: 'Abu Dhabi Marvel',
    icon: '🕌',
    color: 'from-emerald-600/10 to-teal-500/10 border-emerald-200/60 text-emerald-950',
    dotColor: 'bg-emerald-600',
    desktopPos: 'bottom-24 right-[8%] xl:right-[15%]',
    delay: 1.8,
    duration: 6.4,
    yOffset: [0, 12, 0],
    rotateOffset: [0, -1.5, 0],
  },
];

// Golden desert shimmer particles drifting gently
const PARTICLES = [
  { id: 1, left: '15%', top: '30%', size: 4, duration: 6, delay: 0 },
  { id: 2, left: '25%', top: '65%', size: 5, duration: 7.5, delay: 1 },
  { id: 3, left: '42%', top: '20%', size: 3, duration: 5, delay: 2 },
  { id: 4, left: '60%', top: '75%', size: 6, duration: 8, delay: 0.5 },
  { id: 5, left: '78%', top: '25%', size: 4, duration: 6.5, delay: 1.5 },
  { id: 6, left: '88%', top: '55%', size: 5, duration: 7, delay: 2.2 },
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
        initial={{ x: '-10vw', y: '12%', opacity: 0 }}
        animate={{
          x: ['-5vw', '105vw'],
          y: ['14%', '8%', '16%', '10%'],
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
            className={`absolute ${b.desktopPos} pointer-events-auto cursor-pointer group`}
          >
            <div
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/90 backdrop-blur-md border shadow-xs transition-all duration-300 group-hover:shadow-md group-hover:scale-105 group-hover:bg-white ${b.color}`}
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

      {/* 5. UAE Skyline & Rolling Dunes Horizon at bottom of hero */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-0">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="w-full h-16 sm:h-20 md:h-24 text-gray-200/40"
          fill="none"
        >
          {/* Back Dune Line with subtle animated wind dash */}
          <motion.path
            d="M0,80 C320,110 520,40 820,75 C1100,105 1300,50 1440,70 L1440,120 L0,120 Z"
            fill="url(#dune-grad-back)"
            initial={{ opacity: 0.5 }}
            animate={{
              d: [
                'M0,80 C320,110 520,40 820,75 C1100,105 1300,50 1440,70 L1440,120 L0,120 Z',
                'M0,75 C340,95 500,50 840,65 C1120,95 1280,60 1440,75 L1440,120 L0,120 Z',
                'M0,80 C320,110 520,40 820,75 C1100,105 1300,50 1440,70 L1440,120 L0,120 Z',
              ],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Minimalist UAE Skyline Silhouette (Burj Khalifa, Mosque Minarets, Burj Al Arab, Dunes) */}
          <g className="text-gray-300/60" fill="currentColor">
            {/* Abu Dhabi Grand Mosque Domes & Minaret (Far Left) */}
            <path d="M120,80 L122,50 L125,50 L127,80 Z" />
            <path d="M123.5,45 A3,3 0 0,1 123.5,49 A3,3 0 0,1 123.5,45 Z" />
            <path d="M130,80 Q145,60 160,80 Z" />
            <path d="M145,58 L145,55" stroke="currentColor" strokeWidth="1" />

            {/* Dubai Skyline Center - Burj Khalifa (Iconic spire) */}
            {/* Central Spire */}
            <path d="M718,80 L719,22 L721,22 L722,80 Z" />
            <path d="M719.5,12 L720.5,12 L720.5,22 L719.5,22 Z" />
            <path d="M715,80 L717,45 L723,45 L725,80 Z" opacity="0.8" />
            <path d="M710,80 L714,60 L726,60 L730,80 Z" opacity="0.6" />

            {/* Dubai Frame / Tower nearby */}
            <path d="M685,80 L685,52 L697,52 L697,80 Z" opacity="0.5" />
            <path d="M750,80 L750,48 L758,48 L758,80 Z" opacity="0.5" />

            {/* Burj Al Arab Sail (Far Right) */}
            <path d="M1280,80 C1280,55 1295,45 1308,45 L1308,80 Z" opacity="0.7" />
            <path d="M1308,42 L1308,80 L1310,80 L1310,42 Z" />
          </g>

          {/* Front Golden Dune Wave */}
          <motion.path
            d="M0,95 C240,75 480,110 720,90 C960,70 1200,105 1440,92 L1440,120 L0,120 Z"
            fill="url(#dune-grad-front)"
            initial={{ opacity: 0.7 }}
            animate={{
              d: [
                'M0,95 C240,75 480,110 720,90 C960,70 1200,105 1440,92 L1440,120 L0,120 Z',
                'M0,90 C260,85 460,100 740,95 C980,80 1180,95 1440,88 L1440,120 L0,120 Z',
                'M0,95 C240,75 480,110 720,90 C960,70 1200,105 1440,92 L1440,120 L0,120 Z',
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <defs>
            <linearGradient id="dune-grad-back" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="dune-grad-front" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f1f5f9" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.95" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
