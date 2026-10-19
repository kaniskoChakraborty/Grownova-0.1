import React from 'react';
import { ArrowRight, Play, BarChart2, Zap, ShieldCheck } from 'lucide-react';

interface HeroLeftProps {
  onStartClick?: () => void;
  onExploreClick?: () => void;
}

export const HeroLeft: React.FC<HeroLeftProps> = ({
  onStartClick,
  onExploreClick,
}) => {
  return (
    <div className="flex flex-col justify-center max-w-[580px] z-20 py-4 lg:py-6 relative select-none">
      
      {/* Short gold horizontal accent line */}
      <div className="w-8 h-[2.5px] bg-[#C69A43] rounded-full mb-4" />

      {/* Eyebrow: Elegant tracked typography */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11.5px] sm:text-[12.5px] uppercase tracking-[0.22em] font-extrabold text-[#C69A43]">
          BUSINESS OPERATING SYSTEM
        </span>
      </div>

      {/* Main Headline: Editorial Serif Typography */}
      <h1 className="font-serif text-[46px] sm:text-[58px] md:text-[66px] lg:text-[72px] leading-[1.04] tracking-tight font-medium mb-6">
        <span className="text-[#0B2340] block font-semibold drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
          Your business.
        </span>
        <span className="text-[#102B4E] block font-semibold drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
          One operating
        </span>
        <span className="radiant-gold-text block font-semibold drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
          system.
        </span>
      </h1>

      {/* Descriptive Paragraph */}
      <p className="text-[15.5px] sm:text-[17px] text-[#55677D] font-normal leading-[1.65] mb-8 md:mb-10 max-w-[520px]">
        GrowNova brings sales, inventory, finance, people, compliance and everyday
        operations into one calm, intelligent workspace — engineered specifically for small businesses in India.
      </p>

      {/* CTA Buttons Row */}
      <div className="flex flex-wrap items-center gap-4 mb-10 md:mb-12">
        {/* Primary CTA */}
        <button
          onClick={onStartClick}
          className="group relative rounded-full px-8 md:px-9 py-4 text-[15px] md:text-[16px] font-bold text-white gold-glow-btn flex items-center gap-2.5 transition-all duration-300 active:scale-95 focus:outline-none overflow-hidden cursor-pointer"
        >
          <span className="absolute inset-0 w-1/2 h-full bg-white/30 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-700 pointer-events-none" />
          <span>Start with GrowNova</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 stroke-[2.5]" />
        </button>

        {/* Secondary CTA */}
        <button
          onClick={onExploreClick}
          className="group rounded-full px-7 md:px-8 py-4 text-[15px] md:text-[16px] font-bold text-[#102B4E] luminous-glass-pill flex items-center gap-3 transition-all duration-300 active:scale-95 focus:outline-none cursor-pointer"
        >
          <span>Explore the OS</span>
          <div className="w-5 h-5 rounded-full bg-[#102B4E]/10 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
            <Play className="w-2.5 h-2.5 fill-[#102B4E] text-[#102B4E] ml-0.5" />
          </div>
        </button>
      </div>

      {/* Feature Micro-Badges Horizontal Row */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
        {/* Badge 1 */}
        <div className="luminous-badge rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
          <div className="w-8 h-8 rounded-xl bg-amber-100/90 border border-[#C69A43]/40 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <BarChart2 className="w-4 h-4 text-[#C69A43] stroke-[2.5]" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[12.5px] font-extrabold text-[#102B4E] leading-tight">
              All-in-one
            </span>
            <span className="text-[11px] font-medium text-[#65758B] leading-tight">
              business platform
            </span>
          </div>
        </div>

        {/* Badge 2 */}
        <div className="luminous-badge rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
          <div className="w-8 h-8 rounded-xl bg-sky-100/90 border border-sky-300/80 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Zap className="w-4 h-4 text-sky-700 stroke-[2.5]" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[12.5px] font-extrabold text-[#102B4E] leading-tight">
              AI-powered
            </span>
            <span className="text-[11px] font-medium text-[#65758B] leading-tight">
              decisions (Axiom)
            </span>
          </div>
        </div>

        {/* Badge 3 */}
        <div className="luminous-badge rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
          <div className="w-8 h-8 rounded-xl bg-emerald-100/90 border border-emerald-300/80 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#15803D] stroke-[2.5]" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[12.5px] font-extrabold text-[#102B4E] leading-tight">
              Built for India
            </span>
            <span className="text-[11px] font-medium text-[#65758B] leading-tight">
              compliance ready
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
