import React from 'react';

interface CompassLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'classic' | 'subtitled';
}

export const GrowNovaCompassLogo: React.FC<CompassLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  variant = 'classic',
}) => {
  const pixelSize = size === 'sm' ? 26 : size === 'lg' ? 40 : 32;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* 8-pointed faceted compass star emblem matching reference image */}
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-300 hover:rotate-12"
      >
        {/* North Ray */}
        <polygon points="50,4 50,50 43,44" fill="#0B2340" />
        <polygon points="50,4 50,50 57,44" fill="#102B4E" />

        {/* South Ray */}
        <polygon points="50,96 50,50 57,56" fill="#0B2340" />
        <polygon points="50,96 50,50 43,56" fill="#102B4E" />

        {/* East Ray */}
        <polygon points="96,50 50,50 56,43" fill="#0B2340" />
        <polygon points="96,50 50,50 56,57" fill="#102B4E" />

        {/* West Ray */}
        <polygon points="4,50 50,50 44,57" fill="#0B2340" />
        <polygon points="4,50 50,50 44,43" fill="#102B4E" />

        {/* North-East Ray */}
        <polygon points="82,18 50,50 55,39" fill="#0B2340" />
        <polygon points="82,18 50,50 61,45" fill="#1D4172" />

        {/* South-East Ray */}
        <polygon points="82,82 50,50 61,55" fill="#0B2340" />
        <polygon points="82,82 50,50 55,61" fill="#1D4172" />

        {/* South-West Ray */}
        <polygon points="18,82 50,50 39,55" fill="#1D4172" />
        <polygon points="18,82 50,50 45,61" fill="#0B2340" />

        {/* North-West Ray */}
        <polygon points="18,18 50,50 39,45" fill="#1D4172" />
        <polygon points="18,18 50,50 45,39" fill="#0B2340" />

        {/* Center compass jewel */}
        <circle cx="50" cy="50" r="3.5" fill="#C69A43" />
      </svg>

      {showText && (
        variant === 'subtitled' ? (
          <div className="flex flex-col text-left leading-none">
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-[18px] sm:text-[20px] font-semibold text-[#102B4E] tracking-tight">
                GrowNova
              </span>
              <span className="font-sans text-[14px] sm:text-[15px] font-bold text-[#102B4E]/80">
                OS
              </span>
            </div>
            <span className="text-[8px] font-bold tracking-[0.16em] text-[#C69A43] mt-0.5 uppercase">
              Business Operating System
            </span>
          </div>
        ) : (
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-[20px] sm:text-[22px] font-semibold text-[#102B4E] tracking-tight">
              GrowNova
            </span>
            <span className="font-sans text-[16px] sm:text-[17px] font-semibold text-[#102B4E]/85">
              OS
            </span>
          </div>
        )
      )}
    </div>
  );
};
