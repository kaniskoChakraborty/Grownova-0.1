interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  light?: boolean;
}

export const GrowNovaLogo = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  light = false,
}: LogoProps) => {
  const navyColor = light ? '#FFFFFF' : '#102B4E';
  const goldColor = '#B88932';

  // Dimension scaling
  const scale = size === 'sm' ? 0.78 : size === 'lg' ? 1.35 : 1;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Monogram Icon */}
      <div 
        className="relative flex-shrink-0 flex items-center justify-center transition-transform hover:scale-105 duration-300"
        style={{ width: `${38 * scale}px`, height: `${36 * scale}px` }}
      >
        <svg
          viewBox="0 0 52 46"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Main G arc */}
          <path
            d="M26 10.5C21.5 5.5 13.5 6 8.5 11C3.5 16 3 24 7.5 30C12 36 21 38 27 34C30.5 31.5 32.5 28 33 24H21"
            stroke={navyColor}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Intersecting N stroke */}
          <path
            d="M24.5 38V18L37.5 38V17"
            stroke={navyColor}
            strokeWidth="4.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Golden Gear / Blossom Motif in notch */}
          <g transform="translate(24, 7) scale(0.85)">
            {/* Outer golden gear flower */}
            <circle cx="9" cy="8" r="4.8" fill="none" stroke={goldColor} strokeWidth="1.6" strokeDasharray="1.5 1.5" />
            <circle cx="9" cy="8" r="2.2" fill={goldColor} />
            
            {/* Small second gear */}
            <circle cx="15" cy="5" r="3" fill="none" stroke={goldColor} strokeWidth="1.2" strokeDasharray="1.2 1.2" />
            
            {/* Ascending dynamic flourish swoop */}
            <path
              d="M-2 15 C 3 13, 8 10, 16 3"
              stroke={goldColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Sprout star */}
            <path
              d="M16.5 1.5L17.2 3.2L19 3.5L17.5 4.8L18 6.5L16.5 5.5L15 6.5L15.5 4.8L14 3.5L15.8 3.2Z"
              fill={goldColor}
            />
          </g>
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col justify-center">
        <div 
          className="font-extrabold tracking-[0.03em] leading-none text-[#102B4E] transition-colors"
          style={{ 
            fontSize: `${20 * scale}px`,
            color: navyColor,
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" 
          }}
        >
          GROWNOVA
        </div>
        {showSubtitle && (
          <div 
            className="flex items-center gap-1 font-semibold uppercase tracking-[0.16em] text-[#B88932] mt-0.5"
            style={{ fontSize: `${7.5 * scale}px` }}
          >
            <span className="w-2.5 h-[1px] bg-[#B88932]/70 inline-block"></span>
            <span>BUSINESS OPERATING SYSTEM</span>
            <span className="w-2.5 h-[1px] bg-[#B88932]/70 inline-block"></span>
          </div>
        )}
      </div>
    </div>
  );
};
