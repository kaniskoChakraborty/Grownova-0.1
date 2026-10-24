import React from 'react';

/**
 * Grahak Brand Emblem & Contemporary Desi Art Motifs
 * Palette:
 * Warm Ivory: #F8F5F1
 * Deep Navy: #102B4E
 * Dark Navy: #0B2340
 * Muted Gold: #C69A43
 * Warm Gold: #D5AD66
 */

export const GrahakLogo: React.FC<{ className?: string; size?: number }> = ({ 
  className = '', 
  size = 48 
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div 
        className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#102B4E] to-[#0B2340] border border-[#C69A43]/50 shadow-md p-2.5 transition-transform hover:scale-105"
        style={{ width: size, height: size }}
      >
        {/* Subtle auspicious circular gold ring */}
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full text-[#D5AD66]" 
          fill="none" 
          stroke="currentColor"
        >
          {/* Ornate Desi Arch / Kalash Silhouette */}
          <path
            d="M 50 12 C 55 22 72 26 72 45 C 72 65 60 76 50 78 C 40 76 28 65 28 45 C 28 26 45 22 50 12 Z"
            fill="url(#goldGradient)"
            stroke="#C69A43"
            strokeWidth="2.5"
          />
          {/* Flame / Diya Core */}
          <circle cx="50" cy="42" r="7" fill="#F8F5F1" />
          <path d="M 50 24 Q 53 32 50 36 Q 47 32 50 24 Z" fill="#D5AD66" />
          {/* Base Pedestal */}
          <path
            d="M 32 78 L 68 78 L 64 88 L 36 88 Z"
            fill="#C69A43"
            stroke="#D5AD66"
            strokeWidth="1.5"
          />
          {/* Micro dots */}
          <circle cx="50" cy="83" r="2.5" fill="#102B4E" />
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D5AD66" />
              <stop offset="100%" stopColor="#C69A43" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5">
          <span className="font-serif text-2xl font-bold tracking-tight text-[#102B4E] leading-none">
            Grahak
          </span>
          <span className="text-[10px] font-bold text-[#C69A43] tracking-wider uppercase font-sans">
            ग्राहक
          </span>
        </div>
        <span className="text-[10px] text-[#65758B] font-medium tracking-wide">
          Aapke Dukaan Ka Digital Saathi
        </span>
      </div>
    </div>
  );
};

/**
 * Traditional Indian Toran & Marigold Garland Arch
 */
export const DesiToranArch: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full overflow-hidden select-none pointer-events-none ${className}`}>
      <svg 
        viewBox="0 0 1200 44" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-9 sm:h-11"
        preserveAspectRatio="none"
      >
        {/* Main Golden Hanging Thread */}
        <path 
          d="M0,8 Q150,22 300,8 Q450,22 600,8 Q750,22 900,8 Q1050,22 1200,8" 
          stroke="#C69A43" 
          strokeWidth="2.5" 
          strokeDasharray="4 2"
        />
        {/* Mango Leaves and Marigolds repetitive pattern */}
        {[75, 225, 375, 525, 675, 825, 975, 1125].map((cx, idx) => (
          <g key={idx}>
            {/* Mango Leaf Motif */}
            <path 
              d={`M ${cx - 14} 14 Q ${cx} 38 ${cx} 42 Q ${cx} 38 ${cx + 14} 14 Z`} 
              fill="#2E7D32" 
              opacity="0.85" 
            />
            {/* Orange Marigold Flower (Genda Phool) */}
            <circle cx={cx} cy="15" r="7.5" fill="#E65100" />
            <circle cx={cx} cy="15" r="4.5" fill="#FFB300" />
            {/* Tiny Golden Hanging Bell */}
            <path 
              d={`M ${cx - 3.5} 32 L ${cx + 3.5} 32 L ${cx} 38 Z`} 
              fill="#C69A43" 
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

/**
 * Contemporary Desi Art Shopkeeper & Customer Illustration
 * Clean, respectful, non-cartoonish Indian shopkeeper illustration
 */
export const ShopkeeperIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Background Indian Architectural Jharokha Arch */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#C69A43]/15 via-[#F8F5F1] to-white rounded-3xl border border-[#C69A43]/30 shadow-inner -z-10" />
      
      <svg
        viewBox="0 0 540 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[480px] h-auto drop-shadow-md"
      >
        {/* Top Ornate Jharokha Arch Frame */}
        <path
          d="M 50 370 L 50 140 C 50 70, 160 30, 270 30 C 380 30, 490 70, 490 140 L 490 370 Z"
          fill="#FFFDF9"
          stroke="#C69A43"
          strokeWidth="2.5"
          strokeDasharray="6 3"
        />

        {/* Auspicious Shubh Labh Crest */}
        <circle cx="270" cy="55" r="18" fill="#102B4E" />
        <text 
          x="270" 
          y="61" 
          textAnchor="middle" 
          fill="#D5AD66" 
          fontSize="14" 
          fontWeight="bold"
          fontFamily="serif"
        >
          卐
        </text>

        {/* Counter Wooden Table */}
        <rect x="70" y="270" width="400" height="90" rx="10" fill="#102B4E" />
        <rect x="80" y="276" width="380" height="8" rx="4" fill="#C69A43" />
        {/* Traditional Brass Scales (Tarazoo) */}
        <path d="M 270 170 L 270 270" stroke="#C69A43" strokeWidth="4" strokeLinecap="round" />
        <path d="M 230 190 L 310 190" stroke="#D5AD66" strokeWidth="3" strokeLinecap="round" />
        {/* Left pan */}
        <path d="M 230 190 L 210 230 L 250 230 Z" fill="#D5AD66" opacity="0.8" />
        {/* Right pan with goods */}
        <path d="M 310 190 L 290 230 L 330 230 Z" fill="#D5AD66" opacity="0.8" />

        {/* Shopkeeper (Left side - Welcoming posture with Kurta & Vest) */}
        <g id="shopkeeper">
          {/* Head & Nehru Cap */}
          <circle cx="160" cy="140" r="26" fill="#D4A373" />
          <path d="M 134 135 C 134 110 186 110 186 135 Z" fill="#102B4E" />
          {/* Mustache & Smile */}
          <path d="M 152 148 Q 160 154 168 148" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
          {/* Torso in Traditional Kurta & Nehru Jacket */}
          <path d="M 125 170 C 135 160 185 160 195 170 L 205 270 L 115 270 Z" fill="#F8F5F1" stroke="#102B4E" strokeWidth="2" />
          {/* Golden Embroidered Vest */}
          <path d="M 135 170 L 145 260 L 175 260 L 185 170 Z" fill="#C69A43" opacity="0.9" />
          {/* Folded Hands in Namaste */}
          <ellipse cx="160" cy="205" rx="14" ry="10" fill="#D4A373" />
          <path d="M 154 198 L 160 188 L 166 198 Z" fill="#D4A373" stroke="#102B4E" strokeWidth="1" />
        </g>

        {/* Customer (Right side - Modern Smartphone in hand, scanning Grahak QR) */}
        <g id="customer">
          {/* Head */}
          <circle cx="380" cy="145" r="24" fill="#E0AC82" />
          {/* Hair */}
          <path d="M 358 140 C 358 118 402 118 402 140 Z" fill="#1C1917" />
          {/* Torso */}
          <path d="M 350 175 C 360 165 400 165 410 175 L 420 270 L 340 270 Z" fill="#2E5077" />
          {/* Hand holding Smartphone */}
          <rect x="330" y="210" width="22" height="38" rx="4" fill="#0B2340" stroke="#C69A43" strokeWidth="1.5" />
          <circle cx="341" cy="242" r="2" fill="#D5AD66" />
          {/* Digital UPI beam */}
          <path d="M 325 220 L 285 240" stroke="#15803D" strokeWidth="2" strokeDasharray="3 2" />
        </g>

        {/* Counter Ledger Book & QR Stand */}
        <g id="counter-items">
          {/* Bahi-Khata (Red Traditional Ledger) */}
          <rect x="95" y="250" width="45" height="20" rx="3" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="1.5" />
          <line x1="95" y1="260" x2="140" y2="260" stroke="#FDE047" strokeWidth="1.5" />
          {/* Grahak Digital QR Stand */}
          <rect x="255" y="240" width="30" height="30" rx="4" fill="white" stroke="#C69A43" strokeWidth="2" />
          <rect x="261" y="246" width="18" height="18" fill="#102B4E" />
          <rect x="265" y="250" width="10" height="10" fill="white" />
        </g>

        {/* Folk-Art Floral Corner Motifs */}
        <circle cx="65" cy="355" r="6" fill="#C69A43" />
        <circle cx="475" cy="355" r="6" fill="#C69A43" />
      </svg>
    </div>
  );
};

/**
 * Traditional Rangoli / Folk Art Frame Border
 */
export const FolkArtBorder: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`relative p-5 sm:p-7 rounded-3xl bg-[#F8F5F1] border-2 border-[#C69A43]/40 shadow-xl overflow-hidden ${className}`}>
      {/* Decorative corner motifs */}
      <div className="absolute top-2 left-2 text-[#C69A43]/70 font-serif text-sm select-none pointer-events-none">
        ✦
      </div>
      <div className="absolute top-2 right-2 text-[#C69A43]/70 font-serif text-sm select-none pointer-events-none">
        ✦
      </div>
      <div className="absolute bottom-2 left-2 text-[#C69A43]/70 font-serif text-sm select-none pointer-events-none">
        ✦
      </div>
      <div className="absolute bottom-2 right-2 text-[#C69A43]/70 font-serif text-sm select-none pointer-events-none">
        ✦
      </div>
      {children}
    </div>
  );
};
