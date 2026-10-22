import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  MessageSquare, 
  Receipt, 
  Package, 
  Moon, 
  PhoneOff, 
  FileSpreadsheet, 
  HelpCircle, 
  TrendingDown,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const ChaosVsCalmSection: React.FC<{ onCtaClick?: () => void }> = ({ onCtaClick }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'udhari' | 'gst' | 'stock' | 'profit'>('all');

  const painPoints = [
    {
      id: 'udhari',
      title: 'Udhari & Payment Collection',
      tag: 'Cashflow Lifeline',
      chaos: {
        headline: '20 Awkward Phone Calls Every Morning',
        desc: 'Wasting 2 hours every morning asking "Bhaiya payment kab bhej rahe ho?", hearing "Kal pakka transfer karenge", while your own supplier cheques are bouncing.',
        stat: 'Average 45+ days delay in market receivables',
        icon: PhoneOff,
      },
      calm: {
        headline: 'Automated, Polite WhatsApp UPI Collection',
        desc: 'GrowNova sends courteous, branded payment reminders on WhatsApp with 1-tap UPI and Net Banking links. Parties pay with a click on their phone.',
        stat: '74% collected within 48 hours without awkward calls',
        icon: MessageSquare,
      }
    },
    {
      id: 'gst',
      title: 'GST & CA Reconciliation',
      tag: 'Statutory Compliance',
      chaos: {
        headline: '11 PM Month-End Panic with Your CA',
        desc: 'Scrambling on the 19th through dusty box files and crumpled paper receipts, terrified of GST mismatches, 18% interest, and cancellation notices.',
        stat: '₹12,000+ lost annually in delayed 2B Input Tax Credit',
        icon: FileSpreadsheet,
      },
      calm: {
        headline: '15-Second Invoicing & Direct GSTN Bridge',
        desc: 'Auto-generates compliant E-Way bills and e-invoices. Your CA gets their own 1-click read-only portal to download matched GSTR-1 & 3B in 2 minutes.',
        stat: '100% ITC reconciled • Zero penalty notices',
        icon: Receipt,
      }
    },
    {
      id: 'stock',
      title: 'Godown & Multi-Location Stock',
      tag: 'Inventory Accuracy',
      chaos: {
        headline: 'Asking 3 Staff Members, Getting 3 Different Answers',
        desc: 'Calling the warehouse boy: "Maal bacha hai kya?". You commit to a ₹80,000 customer order only to find the boxes are damaged or already sold yesterday.',
        stat: '15% revenue lost to preventable stockouts & expiry',
        icon: HelpCircle,
      },
      calm: {
        headline: 'Live Multi-Godown Sync & Expiry Alerts',
        desc: 'Every bill created at your sales counter instantly updates stock in your warehouse. Get WhatsApp alerts 30 days before batch expiries.',
        stat: 'Real-time SKU count across 10+ godowns & counters',
        icon: Package,
      }
    },
    {
      id: 'profit',
      title: 'Daily Net Profit & Peace of Mind',
      tag: 'Founder Clarity',
      chaos: {
        headline: 'Working 14 Hours and Still Guessing Real Profit',
        desc: 'You count the cash drawer at night, but you have no clue what your real net margin is after deducting staff advances, electricity, supplier dues, and GST.',
        stat: 'Discovering losses 3 months later when CA files returns',
        icon: TrendingDown,
      },
      calm: {
        headline: '9:00 PM WhatsApp Founder Briefing',
        desc: 'Before you pull the shutters down, receive a calm 3-point summary on your WhatsApp: Today\'s sales, cash collected in bank, net profit in pocket, and tomorrow\'s dues.',
        stat: 'Complete clarity every single night before dinner',
        icon: Moon,
      }
    }
  ];

  const filteredPoints = activeTab === 'all' 
    ? painPoints 
    : painPoints.filter(p => p.id === activeTab);

  return (
    <section className="relative z-20 w-full py-16 sm:py-24 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill-container text-xs font-extrabold text-[#C69A43] uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#C69A43]" />
          <span>THE EVERYDAY REALITY OF RUNNING AN INDIAN BUSINESS</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[#102B4E] tracking-tight mb-4">
          You started a business to build wealth. <br />
          <span className="radiant-gold-text">Not to spend your life firefighting.</span>
        </h2>
        <p className="text-sm sm:text-base text-[#52647C] leading-relaxed max-w-2xl mx-auto">
          Every day in a growing business is a battle between mental chaos and calm control. See how GrowNova transforms the 4 biggest daily headaches into automated peace of mind.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#102B4E] text-white shadow-sm'
                : 'bg-white/70 hover:bg-white text-[#52647C] border border-white/90'
            }`}
          >
            All 4 Challenges
          </button>
          {painPoints.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === item.id
                  ? 'bg-[#C69A43] text-white shadow-sm'
                  : 'bg-white/70 hover:bg-white text-[#52647C] border border-white/90'
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="space-y-6">
        {filteredPoints.map((item) => {
          const ChaosIcon = item.chaos.icon;
          const CalmIcon = item.calm.icon;

          return (
            <div 
              key={item.id}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 rounded-3xl p-2 sm:p-3 bg-gradient-to-b from-white/40 to-white/10 backdrop-blur-xl border border-white/80 shadow-xs"
            >
              
              {/* CHAOS CARD (The Painful Old Way) */}
              <div className="rounded-2xl p-6 sm:p-7 bg-gradient-to-br from-rose-50/70 via-white/70 to-rose-50/40 border border-rose-200/60 shadow-2xs flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 px-3.5 py-1 bg-rose-100/90 border-b border-l border-rose-200 text-rose-800 text-[10.5px] font-extrabold uppercase tracking-wider rounded-bl-xl flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  <span>The Old Way (Without GrowNova)</span>
                </div>

                <div>
                  <div className="flex items-center gap-2.5 mb-3 pt-2">
                    <div className="w-9 h-9 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center flex-shrink-0 text-rose-700">
                      <ChaosIcon className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <span className="text-xs font-bold text-rose-700/80 uppercase tracking-wide">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#102B4E] mb-2 leading-snug">
                    {item.chaos.headline}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#52647C] leading-relaxed mb-5">
                    {item.chaos.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-rose-200/50 flex items-center gap-2 text-xs font-semibold text-rose-700">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse flex-shrink-0" />
                  <span>{item.chaos.stat}</span>
                </div>
              </div>

              {/* CALM CARD (The GrowNova Way) */}
              <div className="rounded-2xl p-6 sm:p-7 bg-gradient-to-br from-amber-50/60 via-white/80 to-emerald-50/40 border border-amber-200/70 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 px-3.5 py-1 bg-gradient-to-r from-amber-100 to-emerald-100 border-b border-l border-amber-300/80 text-[#15803D] text-[10.5px] font-extrabold uppercase tracking-wider rounded-bl-xl flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-[#15803D]" />
                  <span>The GrowNova Way</span>
                </div>

                <div>
                  <div className="flex items-center gap-2.5 mb-3 pt-2">
                    <div className="w-9 h-9 rounded-xl bg-[#C69A43]/15 border border-[#C69A43]/30 flex items-center justify-center flex-shrink-0 text-[#C69A43]">
                      <CalmIcon className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <span className="text-xs font-bold text-[#C69A43] uppercase tracking-wide">
                      Instant Automated Relief
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#102B4E] mb-2 leading-snug">
                    {item.calm.headline}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#384C62] leading-relaxed mb-5">
                    {item.calm.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs font-semibold text-[#15803D]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse flex-shrink-0" />
                    <span>{item.calm.stat}</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#C69A43] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Live in OS →
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Bottom Bridge CTA */}
      <div className="mt-8 text-center">
        <button
          onClick={onCtaClick}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-[#102B4E] bg-white/80 hover:bg-white backdrop-blur-md border border-white shadow-2xs hover:shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
        >
          <span>See How 12,000+ Indian Businesses Switched from Chaos to Calm</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#C69A43]" />
        </button>
      </div>

    </section>
  );
};
