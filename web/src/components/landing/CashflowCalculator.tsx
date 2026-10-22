import React, { useState } from 'react';
import { Calculator, ArrowRight, Clock, ShieldCheck, Sparkles } from 'lucide-react';

export const CashflowCalculator: React.FC<{ onCtaClick?: () => void }> = ({ onCtaClick }) => {
  const [turnoverLakhs, setTurnoverLakhs] = useState<number>(25); // ₹25 Lakhs
  const [delayDays, setDelayDays] = useState<number>(45); // 45 days

  // Calculations
  const monthlyTurnover = turnoverLakhs * 100000;
  // Trapped capital = (monthly / 30) * delayDays
  const trappedCapital = Math.round((monthlyTurnover / 30) * delayDays);
  const trappedLakhs = (trappedCapital / 100000).toFixed(1);

  // GrowNova recovery speedup (average 55% reduction in delay)
  const daysSaved = Math.round(delayDays * 0.55);
  const capitalUnlockedLakhs = ((trappedCapital * 0.55) / 100000).toFixed(1);
  const hoursSavedPerMonth = Math.round((delayDays / 45) * 28);

  return (
    <section className="relative z-20 w-full py-16 sm:py-24 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill-container text-xs font-extrabold text-[#C69A43] uppercase tracking-wider mb-3">
          <Calculator className="w-3.5 h-3.5 text-[#C69A43]" />
          <span>INTERACTIVE CASHFLOW & RELIEF ESTIMATOR</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[#102B4E] tracking-tight mb-4">
          How much cash is currently <br />
          <span className="radiant-gold-text">trapped in your market udhari?</span>
        </h2>
        <p className="text-sm sm:text-base text-[#52647C] leading-relaxed max-w-2xl mx-auto">
          Every delayed payment is an interest-free loan you are giving your customers. Drag the sliders below to see how much working capital GrowNova can return to your bank in 30 days.
        </p>
      </div>

      {/* Main Glass Calculator Bento */}
      <div className="glass-bento-card p-6 sm:p-10 md:p-12 rounded-3xl max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Sliders Input Column (Col 6) */}
          <div className="lg:col-span-6 space-y-7">
            
            {/* Slider 1: Monthly Turnover */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-bold text-[#102B4E]">
                  Your Approximate Monthly Sales
                </label>
                <span className="px-3 py-1 rounded-full bg-amber-100/80 text-[#C69A43] font-extrabold text-sm border border-[#C69A43]/30">
                  ₹{turnoverLakhs} Lakhs / mo
                </span>
              </div>
              <input 
                type="range"
                min="5"
                max="150"
                step="5"
                value={turnoverLakhs}
                onChange={(e) => setTurnoverLakhs(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#C69A43]"
              />
              <div className="flex justify-between text-[11px] text-[#65758B] mt-1 font-medium">
                <span>₹5 Lakhs (Small)</span>
                <span>₹50 Lakhs (Growing)</span>
                <span>₹1.5 Crore+ (Scale)</span>
              </div>
            </div>

            {/* Slider 2: Average Payment Delay */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-bold text-[#102B4E]">
                  Average Delay to Get Paid (Udhari Period)
                </label>
                <span className="px-3 py-1 rounded-full bg-rose-100/80 text-rose-700 font-extrabold text-sm border border-rose-300/60">
                  {delayDays} Days
                </span>
              </div>
              <input 
                type="range"
                min="15"
                max="90"
                step="5"
                value={delayDays}
                onChange={(e) => setDelayDays(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#102B4E]"
              />
              <div className="flex justify-between text-[11px] text-[#65758B] mt-1 font-medium">
                <span>15 Days (Fast)</span>
                <span>45 Days (Typical Indian SME)</span>
                <span>90 Days (Severe Delay)</span>
              </div>
            </div>

            {/* Live Insight Box */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-[#102B4E] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-[#C69A43]">
                <Sparkles className="w-4 h-4" />
                <span>The Hidden Cost of Delayed Receivables</span>
              </div>
              <p className="text-[#52647C] leading-relaxed">
                Right now, approximately <span className="font-extrabold text-rose-700">₹{trappedLakhs} Lakhs</span> of your money is idling in customers' pockets instead of funding bulk supplier discounts or earning bank interest.
              </p>
            </div>

          </div>

          {/* Results Projection Column (Col 6) */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#102B4E] to-[#1A3F6C] text-white p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
            
            <div className="border-b border-white/15 pb-4">
              <span className="text-[11px] font-extrabold text-amber-300 uppercase tracking-widest block mb-1">
                PROJECTED 30-DAY GROWNOVA RECOVERY
              </span>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-white">
                ₹{capitalUnlockedLakhs} Lakhs
              </div>
              <p className="text-xs text-white/75 mt-1">
                Estimated liquid working capital returned ~{daysSaved} days faster via automated WhatsApp UPI payment links.
              </p>
            </div>

            {/* Micro Benefit Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Time Saved</span>
                </div>
                <div className="text-lg font-bold text-white">
                  ~{hoursSavedPerMonth} Hours / mo
                </div>
                <div className="text-[10px] text-white/70">
                  No awkward phone follow-ups
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>GST Penalties</span>
                </div>
                <div className="text-lg font-bold text-emerald-300">
                  ₹0 Guaranteed
                </div>
                <div className="text-[10px] text-white/70">
                  100% 2B matched on time
                </div>
              </div>
            </div>

            {/* Direct Action Button */}
            <button
              onClick={onCtaClick}
              className="w-full py-3.5 px-6 rounded-full font-bold text-[#102B4E] bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 hover:brightness-105 shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer text-xs sm:text-sm"
            >
              <span>Reclaim Your ₹{capitalUnlockedLakhs} Lakhs Capital Now</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="text-center text-[10.5px] text-white/60">
              *Based on empirical data from 12,000+ Indian distributors & wholesalers using GrowNova OS.
            </div>

          </div>

        </div>
      </div>

    </section>
  );
};
