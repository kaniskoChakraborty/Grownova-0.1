import React from 'react';
import { ArrowRight, Play, CheckCircle2, MessageSquare, Receipt, TrendingUp } from 'lucide-react';

interface HeroLeftProps {
  onStartClick?: () => void;
  onExploreClick?: () => void;
}

export const HeroLeft: React.FC<HeroLeftProps> = ({
  onStartClick,
  onExploreClick,
}) => {
  return (
    <div className="relative w-full max-w-[620px] z-20 flex flex-col justify-center select-none py-1 lg:py-2">
      
      {/* Eyebrow: Floating Glass Pill with Pulsing Status Beacon */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 hover:bg-white/90 backdrop-blur-md border border-white/95 shadow-2xs mb-3.5 w-fit transition-all hover:scale-[1.02]">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C69A43] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C69A43]" />
        </span>
        <span className="text-[10.5px] sm:text-[11px] uppercase tracking-[0.2em] font-extrabold text-[#C69A43]">
          BUILT FOR INDIAN SMALL BUSINESSES & MSMES
        </span>
      </div>

      {/* Main Headline: Unboxed, Expansive Editorial Typography */}
      <h1 className="font-serif text-[38px] sm:text-[48px] md:text-[54px] lg:text-[60px] leading-[1.05] tracking-tight font-medium mb-3.5">
        <span className="text-[#0B2340] block font-semibold drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
          Stop chasing payments.
        </span>
        <span className="text-[#102B4E] block font-semibold drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
          Run your entire business in
        </span>
        <span className="radiant-gold-text block font-semibold drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
          one calm place.
        </span>
      </h1>

      {/* Relatable, Empathetic Founder Subtitle */}
      <p className="text-[13.5px] sm:text-[15px] text-[#475569] font-normal leading-[1.65] mb-5 sm:mb-6 max-w-[530px]">
        No more chasing udhari over awkward phone calls, missing paper challans, or Tally month-end panic with your CA. GrowNova brings 15-second GST billing, automatic WhatsApp payment reminders, multi-godown stock, and daily cash flow into one simple workspace.
      </p>

      {/* High-Intent Conversion CTAs */}
      <div className="flex flex-wrap items-center gap-3 mb-5 sm:mb-6">
        {/* Primary CTA with Liquid Shimmer */}
        <button
          onClick={onStartClick}
          className="group relative rounded-full px-6 sm:px-7 py-3 text-[14px] font-bold text-white gold-glow-btn flex items-center gap-2 transition-all duration-300 active:scale-95 focus:outline-none overflow-hidden cursor-pointer shadow-md hover:shadow-lg"
        >
          <span className="absolute inset-0 w-1/2 h-full bg-white/35 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-700 pointer-events-none" />
          <span>Get Started Free — In 5 Mins</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 stroke-[2.5]" />
        </button>

        {/* Secondary CTA: Frosted Glass Pill */}
        <button
          onClick={onExploreClick}
          className="group rounded-full px-5 sm:px-6 py-3 text-[14px] font-bold text-[#102B4E] bg-white/70 hover:bg-white/95 backdrop-blur-xl border border-white/95 shadow-2xs hover:shadow-sm flex items-center gap-2 transition-all duration-300 active:scale-95 focus:outline-none cursor-pointer"
        >
          <span>See How It Works</span>
          <div className="w-5 h-5 rounded-full bg-[#102B4E]/10 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
            <Play className="w-2.5 h-2.5 fill-[#102B4E] text-[#102B4E] ml-0.5" />
          </div>
        </button>
      </div>

      {/* Tangible Problem-Solver Tiles (Frosted Glass Crystal Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-white/70 max-w-[560px]">
        
        {/* Feature 1: Udhari Collection */}
        <div className="glass-crystal-card rounded-2xl p-2.5 flex items-start gap-2.5 cursor-default hover:bg-white/80 transition-all">
          <div className="w-7 h-7 rounded-lg bg-amber-100/90 border border-[#C69A43]/40 flex items-center justify-center flex-shrink-0 shadow-2xs mt-0.5">
            <MessageSquare className="w-3.5 h-3.5 text-[#C69A43] stroke-[2.5]" />
          </div>
          <div className="flex flex-col text-left min-w-0">
            <span className="text-[11.5px] font-extrabold text-[#102B4E] leading-tight">
              Auto Udhari Recovery
            </span>
            <span className="text-[10px] font-medium text-[#65758B] leading-tight mt-0.5">
              Polite WhatsApp reminders with UPI links
            </span>
          </div>
        </div>

        {/* Feature 2: 15-Sec GST Billing */}
        <div className="glass-crystal-card rounded-2xl p-2.5 flex items-start gap-2.5 cursor-default hover:bg-white/80 transition-all">
          <div className="w-7 h-7 rounded-lg bg-emerald-100/90 border border-emerald-300/80 flex items-center justify-center flex-shrink-0 shadow-2xs mt-0.5">
            <Receipt className="w-3.5 h-3.5 text-[#15803D] stroke-[2.5]" />
          </div>
          <div className="flex flex-col text-left min-w-0">
            <span className="text-[11.5px] font-extrabold text-[#102B4E] leading-tight">
              15-Sec GST Invoicing
            </span>
            <span className="text-[10px] font-medium text-[#65758B] leading-tight mt-0.5">
              E-Way bills & GSTR-1 with zero error
            </span>
          </div>
        </div>

        {/* Feature 3: 9 PM Daily Briefing */}
        <div className="glass-crystal-card rounded-2xl p-2.5 flex items-start gap-2.5 cursor-default hover:bg-white/80 transition-all">
          <div className="w-7 h-7 rounded-lg bg-sky-100/90 border border-sky-300/80 flex items-center justify-center flex-shrink-0 shadow-2xs mt-0.5">
            <TrendingUp className="w-3.5 h-3.5 text-sky-700 stroke-[2.5]" />
          </div>
          <div className="flex flex-col text-left min-w-0">
            <span className="text-[11.5px] font-extrabold text-[#102B4E] leading-tight">
              9 PM Profit Briefing
            </span>
            <span className="text-[10px] font-medium text-[#65758B] leading-tight mt-0.5">
              Today's cash collected on your phone
            </span>
          </div>
        </div>

      </div>

      {/* Relatable Trust Micro-Dock */}
      <div className="mt-3.5 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-[#55677D]">
        <span className="flex items-center gap-1 text-[#15803D]">
          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>1-Click Tally & Excel Import</span>
        </span>
        <span className="text-[#102B4E]/30">•</span>
        <span>No Credit Card Required</span>
        <span className="text-[#102B4E]/30">•</span>
        <span>Hindi & Vernacular Ready</span>
      </div>

    </div>
  );
};



