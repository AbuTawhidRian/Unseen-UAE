'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'card' | 'minimal';
  showSubtitle?: boolean;
  subtitle?: string;
  className?: string;
}

export default function Logo({
  size = 'md',
  variant = 'default',
  showSubtitle = true,
  subtitle,
  className = '',
}: LogoProps) {
  // Dimension tokens based on size
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-13 h-13',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
  };

  const badgeSizes = {
    sm: 'text-[9px] px-1 py-0.2',
    md: 'text-[10px] px-1.5 py-0.5',
    lg: 'text-xs px-2 py-0.5',
  };

  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* ── Official UAE Flag & 7-Emirates Star Emblem ── */}
      <div
        className={`${iconSizes[size]} relative rounded-2xl overflow-hidden shrink-0 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md border border-black/10 bg-white`}
      >
        <svg
          viewBox="0 0 48 48"
          className="w-full h-full"
          fill="none"
        >
          <defs>
            {/* Rounded shield clip path */}
            <clipPath id="uae-flag-shape">
              <rect x="0" y="0" width="48" height="48" rx="11" />
            </clipPath>

            {/* UAE Flag Colors with subtle luxury gradients */}
            <linearGradient id="uae-green" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00A843" />
              <stop offset="100%" stopColor="#008332" />
            </linearGradient>

            <linearGradient id="uae-red" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F5333F" />
              <stop offset="100%" stopColor="#D81E29" />
            </linearGradient>

            <linearGradient id="uae-black" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#090D16" />
            </linearGradient>

            <linearGradient id="gold-star-metal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF5A0" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#C26A00" />
            </linearGradient>

            <filter id="star-depth" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="1.2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* ══════════════════════════════════════════════════════════════════════
              AUTHENTIC UAE NATIONAL FLAG COMPOSITION
              - Left Hoist: Vibrant Red Vertical Bar (#EF3340)
              - Top Stripe: Emerald Green Horizontal Bar (#009639)
              - Center Stripe: Brilliant White Horizontal Bar (#FFFFFF)
              - Bottom Stripe: Deep Midnight Black Horizontal Bar (#000000)
              ══════════════════════════════════════════════════════════════════════ */}
          <g clipPath="url(#uae-flag-shape)">
            {/* Top Green Stripe */}
            <rect x="13" y="0" width="35" height="16" fill="url(#uae-green)" />

            {/* Center White Stripe */}
            <rect x="13" y="16" width="35" height="16" fill="#FFFFFF" />
            {/* Subtle separator outline for the white stripe */}
            <rect x="13" y="16" width="35" height="16" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="0.8" />

            {/* Bottom Black Stripe */}
            <rect x="13" y="32" width="35" height="16" fill="url(#uae-black)" />

            {/* Left Vertical Red Hoist Stripe */}
            <rect x="0" y="0" width="13" height="48" fill="url(#uae-red)" />

            {/* Diagonal sheen highlight across flag */}
            <polygon points="0,0 24,0 8,48 0,48" fill="rgba(255,255,255,0.12)" />

            {/* ══════════════════════════════════════════════════════════════════
                GOLDEN 7-POINT FEDERATION EXPLORER STAR & COMPASS CREST
                7 star points symbolizing the 7 United Emirates:
                Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, RAK, Fujairah
                ══════════════════════════════════════════════════════════════════ */}
            <g className="transition-transform duration-500 origin-center group-hover:rotate-12">
              {/* Outer Golden Compass Ring */}
              <circle
                cx="24"
                cy="24"
                r="14.5"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeDasharray="2 2"
                opacity="0.85"
                filter="url(#star-depth)"
              />
              <circle
                cx="24"
                cy="24"
                r="11"
                stroke="#FDE68A"
                strokeWidth="0.8"
                opacity="0.75"
              />

              {/* 7-Pointed Golden Federation Star */}
              <polygon
                points="24,12 26.26,19.32 33.38,16.52 29.07,22.84 35.7,26.67 28.07,27.24 29.21,34.81 24,29.2 18.79,34.81 19.93,27.24 12.3,26.67 18.93,22.84 14.62,16.52 21.74,19.32"
                fill="url(#gold-star-metal)"
                stroke="#FFFFFF"
                strokeWidth="0.7"
                filter="url(#star-depth)"
              />

              {/* Emerald Vision Core with Center Focal Light */}
              <circle cx="24" cy="24" r="3.6" fill="#009639" stroke="#FDE68A" strokeWidth="0.8" />
              <circle cx="24" cy="24" r="1.4" fill="#FFFFFF" />
            </g>

            {/* Subtle inner bevel border */}
            <rect
              x="0.75"
              y="0.75"
              width="46.5"
              height="46.5"
              rx="10.25"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.5"
              fill="none"
            />
          </g>

          {/* Exterior border rim */}
          <rect
            x="0.5"
            y="0.5"
            width="47"
            height="47"
            rx="10.5"
            stroke="rgba(0,0,0,0.15)"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>

      {/* ── Wordmark Typography ── */}
      <div className="flex flex-col items-start justify-center text-left leading-none">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-tight ${textSizes[size]} text-gray-900 leading-none`}
          >
            Unseen
          </span>
          <span
            className={`font-extrabold tracking-wider uppercase rounded-md bg-emerald-700 text-white shadow-xs leading-none ${badgeSizes[size]}`}
          >
            UAE
          </span>
        </div>

        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-1 leading-none">
            {/* UAE Flag 4-color micro-bar */}
            <div className="flex h-1.5 w-5 rounded-full overflow-hidden shrink-0 border border-black/10">
              <div className="w-1.5 bg-[#EF3340]" />
              <div className="flex-1 bg-[#009639]" />
              <div className="flex-1 bg-white" />
              <div className="flex-1 bg-black" />
            </div>
            <span
              className={`font-bold tracking-[0.14em] uppercase text-gray-400 leading-none ${
                size === 'lg' ? 'text-[11px]' : size === 'sm' ? 'text-[8px]' : 'text-[9px]'
              }`}
            >
              {subtitle || 'unseenuae.com'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
