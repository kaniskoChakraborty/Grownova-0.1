import React from 'react';
import { RefreshCw, Smartphone, Globe, Headphones, ShieldCheck, ArrowRight } from 'lucide-react';

export const MigrationGuaranteeSection: React.FC<{ onCtaClick?: () => void }> = ({ onCtaClick }) => {
  const guarantees = [
    {
      icon: RefreshCw,
      title: '1-Click Tally & Excel Migration',
      desc: 'Don\'t re-type a single record. Import all your customer ledgers, opening stock, and historical invoices from Tally Prime / ERP 9 or Excel in under 5 minutes.',
      highlight: 'Zero Data Loss'
    },
    {
      icon: Smartphone,
      title: 'Runs on Any Phone or Counter PC',
      desc: 'No expensive servers or IT setup. Runs smoothly on basic Android phones, iPads, laptops, and thermal billing printers. Even works on spotty 4G connections.',
      highlight: 'No Special Hardware'
    },
    {
      icon: Globe,
      title: 'Hindi & Regional Language Ready',
      desc: 'Staff who aren\'t comfortable with English can easily use GrowNova in Hindi and major regional languages. Quick to learn in 15 minutes without any training course.',
      highlight: 'Zero Staff Resistance'
    },
    {
      icon: Headphones,
      title: 'Human Support on Call & WhatsApp',
      desc: 'When you need help with a complex GST invoice or E-Way problem, chat with real business specialists who speak your language, not automated chatbots.',
      highlight: 'Dedicated Account Manager'
    }
  ];

  return (
    <section className="relative z-20 w-full py-16 sm:py-20 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto">
      
      <div className="glass-bento-card p-8 sm:p-12 md:p-14 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-200/30 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-xs font-extrabold text-[#15803D] uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
            <span>THE 100% PEACE-OF-MIND SWITCH GUARANTEE</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[#102B4E] tracking-tight mb-4">
            Worried about leaving your old system? <br />
            <span className="radiant-gold-text">We make the switch completely effortless.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#52647C] leading-relaxed max-w-2xl mx-auto">
            You don't have to pause your business or retrain your team. We assist you every step of the way with guaranteed zero downtime.
          </p>
        </div>

        {/* 4 Trust Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {guarantees.map((g, i) => {
            const Icon = g.icon;
            return (
              <div 
                key={i}
                className="p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/90 shadow-2xs flex flex-col justify-between hover:bg-white/90 transition-all"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-amber-100/80 border border-[#C69A43]/30 flex items-center justify-center text-[#C69A43] mb-3 shadow-2xs">
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <h4 className="text-sm font-bold text-[#102B4E] mb-2 leading-snug">
                    {g.title}
                  </h4>
                  <p className="text-xs text-[#52647C] leading-relaxed mb-4">
                    {g.desc}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 text-[11px] font-extrabold text-[#15803D] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                  <span>{g.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Callout Action Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-200/20 to-emerald-500/10 border border-amber-300/60 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#102B4E]">
              Schedule a Free 15-Minute Personalized Migration Call
            </h4>
            <p className="text-xs sm:text-sm text-[#52647C] mt-1">
              Our SME specialists will show you your own data running on GrowNova OS in real time.
            </p>
          </div>
          <button
            onClick={onCtaClick}
            className="px-6 py-3 rounded-full text-xs font-bold text-white gold-glow-btn shadow-md hover:shadow-lg flex items-center gap-2 flex-shrink-0 cursor-pointer"
          >
            <span>Book Free 1-on-1 Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </section>
  );
};
