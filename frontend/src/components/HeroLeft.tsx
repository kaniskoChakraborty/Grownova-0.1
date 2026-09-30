import { ArrowRight, Play, BarChart2, Zap, ShieldCheck } from 'lucide-react';

interface HeroLeftProps {
  onStartClick?: () => void;
  onExploreClick?: () => void;
}

export const HeroLeft = ({
  onStartClick,
  onExploreClick,
}: HeroLeftProps) => {
  return (
    <div className="flex flex-col justify-center max-w-[580px] z-20 py-4 lg:py-6 relative">
      
      {/* Eyebrow: Elegant tracked typography aligned with headline */}
      <div className="flex items-center gap-2 mb-4 select-none">
        <span className="text-[11.5px] sm:text-[12.5px] uppercase tracking-[0.24em] font-extrabold text-[#A86E14]">
          AN OPERATING SYSTEM FOR INDIAN BUSINESSES
        </span>
      </div>

      {/* Main Headline: Bold High-Contrast Editorial Typography */}
      <h1 className="font-serif text-[48px] sm:text-[60px] md:text-[68px] lg:text-[74px] xl:text-[78px] leading-[1.03] tracking-[-0.02em] font-medium mb-6 select-none">
        <span className="text-[#0B1E36] block font-semibold drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
          Your business.
        </span>
        <span className="radiant-gold-text block font-semibold drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
          One operating
        </span>
        <span className="radiant-gold-text block font-semibold drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
          system.
        </span>
      </h1>

      {/* Descriptive Paragraph: High Contrast Deep Slate Navy */}
      <p className="text-[16px] sm:text-[17.5px] lg:text-[18.5px] text-[#132A46] font-medium leading-[1.65] mb-8 md:mb-10 max-w-[520px] drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
        GrowNova brings sales, inventory, finance, people, compliance and everyday
        operations into one intelligent workspace — built for Indian businesses.
      </p>

      {/* CTA Buttons Row: Radiant Gold Glow + Luminous Glass */}
      <div className="flex flex-wrap items-center gap-4 mb-10 md:mb-12">
        {/* Primary CTA */}
        <button
          onClick={onStartClick}
          className="group relative rounded-full px-8 md:px-9 py-4 text-[15.5px] md:text-[16px] font-bold text-white gold-glow-btn flex items-center gap-2.5 transition-all duration-300 active:scale-95 focus:outline-none overflow-hidden"
        >
          {/* Specular gleam animation */}
          <span className="absolute inset-0 w-1/2 h-full bg-white/30 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-700 pointer-events-none"></span>
          <span>Start with GrowNova</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 stroke-[2.5]" />
        </button>

        {/* Secondary CTA */}
        <button
          onClick={onExploreClick}
          className="group rounded-full px-7 md:px-8 py-4 text-[15.5px] md:text-[16px] font-bold text-[#0B1E36] luminous-glass-pill flex items-center gap-3 transition-all duration-300 active:scale-95 focus:outline-none"
        >
          <span>Explore the OS</span>
          <div className="w-5 h-5 rounded-full bg-[#0B1E36]/10 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
            <Play className="w-2.5 h-2.5 fill-[#0B1E36] text-[#0B1E36] ml-0.5" />
          </div>
        </button>
      </div>

      {/* Feature Micro-Badges Horizontal Row: Luminous Glass Cards */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
        {/* Badge 1 */}
        <div className="luminous-badge rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
          <div className="w-8 h-8 rounded-xl bg-amber-100/90 border border-amber-300/80 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <BarChart2 className="w-4 h-4 text-[#B57716] stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-extrabold text-[#0B1E36] leading-tight">
              All-in-one
            </span>
            <span className="text-[11.5px] font-medium text-[#475569] leading-tight">
              business platform
            </span>
          </div>
        </div>

        {/* Badge 2 */}
        <div className="luminous-badge rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
          <div className="w-8 h-8 rounded-xl bg-sky-100/90 border border-sky-300/80 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Zap className="w-4 h-4 text-sky-700 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-extrabold text-[#0B1E36] leading-tight">
              AI-powered
            </span>
            <span className="text-[11.5px] font-medium text-[#475569] leading-tight">
              decisions (Axiom)
            </span>
          </div>
        </div>

        {/* Badge 3 */}
        <div className="luminous-badge rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
          <div className="w-8 h-8 rounded-xl bg-emerald-100/90 border border-emerald-300/80 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-extrabold text-[#0B1E36] leading-tight">
              Built for India
            </span>
            <span className="text-[11.5px] font-medium text-[#475569] leading-tight">
              compliance ready
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
