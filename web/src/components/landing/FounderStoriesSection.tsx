import React from 'react';
import { Star, CheckCircle, MapPin, Quote } from 'lucide-react';

export const FounderStoriesSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Rajesh Somani',
      role: 'Managing Partner',
      company: 'Somani Synthetic Fabrics',
      location: 'Ring Road Market, Surat',
      sector: 'Textile Wholesale & Manufacturing',
      turnover: '₹45 Lakhs/month',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      quote: 'In the textile market, if you become too aggressive demanding payment, you lose the customer. If you stay silent, your money is stuck for 3 months. GrowNova\'s polite WhatsApp payment reminders with UPI QR codes changed the game completely. Buyers pay in 2 minutes without anyone getting offended.',
      stat: '₹14.2 Lakhs',
      statLabel: 'Recovered in First 30 Days'
    },
    {
      name: 'Manish & Ankit Kulkarni',
      role: 'Founders & Directors',
      company: 'Kulkarni Precision Auto Ancillaries',
      location: 'MIDC Bhosari, Pune',
      sector: 'Automotive Component Manufacturing',
      turnover: '28 Factory Staff',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      quote: 'We used to dread the 19th of every month. Missing purchase bills, disputed challans, and panic calls from our CA asking why the books didn\'t match GSTN. Now our CA logs in directly through the CA portal on the 5th. Filing takes under 10 minutes, and we haven\'t paid a single rupee in late fees.',
      stat: '0 Penalties',
      statLabel: '100% On-Time GST Filing'
    },
    {
      name: 'Sunita & Amit Gupta',
      role: 'Proprietors',
      company: 'Gupta Health & FMCG Distribution',
      location: 'Transport Nagar, Lucknow',
      sector: 'Pharma & FMCG Distribution',
      turnover: '4 Godowns • 1,800 SKUs',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      quote: 'Before GrowNova, salesmen wrote orders on paper not knowing if stock was actually in the warehouse. We had frequent stockouts and expired batch returns. Now stock is live in real-time across all 4 godowns. Orders are invoiced in 15 seconds, and trucks dispatch before noon.',
      stat: '15-Second',
      statLabel: 'Instant GST Invoicing'
    }
  ];

  return (
    <section className="relative z-20 w-full py-16 sm:py-24 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill-container text-xs font-extrabold text-[#C69A43] uppercase tracking-wider mb-3">
          <Star className="w-3.5 h-3.5 text-[#C69A43] fill-[#C69A43]" />
          <span>REAL VOICES FROM INDIAN BUSINESS HUBS</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[#102B4E] tracking-tight mb-4">
          Trusted by over 12,000+ founders <br />
          <span className="radiant-gold-text">who refuse to run on chaos.</span>
        </h2>
        <p className="text-sm sm:text-base text-[#52647C] leading-relaxed max-w-2xl mx-auto">
          From the textile hubs of Surat to auto-clusters in Pune and distribution lanes in Lucknow, hear how real business owners found daily peace of mind with GrowNova.
        </p>
      </div>

      {/* Testimonials 3-Card Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, idx) => (
          <div 
            key={idx}
            className="glass-bento-card p-6 sm:p-7 flex flex-col justify-between rounded-3xl relative overflow-hidden group hover:scale-[1.01] transition-all"
          >
            <div>
              {/* Rating stars & Quote icon */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote className="w-5 h-5 text-[#C69A43]/40" />
              </div>

              {/* Founder Quote */}
              <p className="text-xs sm:text-[13px] text-[#384C62] leading-relaxed italic mb-6">
                "{t.quote}"
              </p>
            </div>

            <div>
              {/* Verified Impact Stat Badge */}
              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 mb-5 flex items-center justify-between">
                <div>
                  <div className="text-base font-extrabold text-[#102B4E]">{t.stat}</div>
                  <div className="text-[10px] text-[#65758B] font-medium">{t.statLabel}</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-[#15803D] text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle className="w-2.5 h-2.5" />
                  Verified
                </span>
              </div>

              {/* Founder Profile Details */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img 
                  src={t.avatar} 
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-2xs" 
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#102B4E] leading-tight truncate">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-[#C69A43] font-semibold truncate">
                    {t.role}, {t.company}
                  </p>
                  <p className="text-[10px] text-[#65758B] flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" />
                    <span>{t.location}</span>
                  </p>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
