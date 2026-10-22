import React, { useState } from 'react';
import { 
  Sun, 
  Zap, 
  Smartphone, 
  Moon, 
  ArrowRight,
  Clock
} from 'lucide-react';

export const DayInYourBusiness: React.FC<{ onCtaClick?: () => void }> = ({ onCtaClick }) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      time: '09:00 AM',
      icon: Sun,
      title: 'Morning Readiness & Cash Check',
      shortDesc: 'Start your morning without anxiety or 5 phone calls',
      story: 'Before you finish your morning tea, glance at your phone. You see all 18 staff members punched in via biometric, ₹3.8L clean opening balance across HDFC & ICICI, and 4 wholesale orders ready for dispatch.',
      uiMock: {
        badge: 'MORNING TELEMETRY',
        title: 'Daily Business Wakeup Snapshot',
        items: [
          { label: 'Bank Working Capital', val: '₹3,84,200 (Synced 2 mins ago)', status: 'positive' },
          { label: 'Staff Attendance', val: '18 / 18 on duty (0 late)', status: 'positive' },
          { label: 'Today\'s Dispatch Queue', val: '4 Orders (Ahmedabad, Pune, Surat)', status: 'neutral' },
          { label: 'Pending Udhari to Collect', val: '₹1.85L (Scheduled for 11 AM)', status: 'action' }
        ]
      }
    },
    {
      time: '02:00 PM',
      icon: Zap,
      title: 'Peak Rush: 15-Sec Invoicing & E-Way Bills',
      shortDesc: 'No more slow billing desks or customers waiting in line',
      story: 'A distributor walks in needing 140 cartons with immediate interstate E-Way delivery. Your counter staff types the GSTIN, items auto-fill, E-Way is generated in 12 seconds, and the client receives the digital invoice with dynamic UPI QR code on WhatsApp.',
      uiMock: {
        badge: 'FAST BILLING DESK',
        title: 'GST E-Invoice #INV-2025-0892',
        items: [
          { label: 'Buyer GSTIN', val: '27AABCU9603R1ZM (Auto-verified)', status: 'positive' },
          { label: 'Items & HSN Code', val: '140 Cartons (HSN 8471) • Auto Tax Match', status: 'neutral' },
          { label: 'E-Way Portal Status', val: '✓ Direct GSTN Bridge (12.4s)', status: 'positive' },
          { label: 'Payment Method', val: 'Dynamic UPI QR Code Generated', status: 'action' }
        ]
      }
    },
    {
      time: '05:30 PM',
      icon: Smartphone,
      title: 'Polite Automated Udhari Recovery',
      shortDesc: 'Recover market cash without a single sour conversation',
      story: 'While you focus on sales, GrowNova automatically sends polite, branded WhatsApp statements with direct UPI payment links to parties with overdue payments. Clients click, enter UPI PIN, and your bank ledger updates in real-time.',
      uiMock: {
        badge: 'WHATSAPP RECOVERY ENGINE',
        title: 'Automated Payment Sweep (Today)',
        items: [
          { label: 'Reminders Sent', val: '14 Friendly WhatsApp Statements', status: 'neutral' },
          { label: 'Instant UPI Collected', val: '₹1,42,800 Received across 9 parties', status: 'positive' },
          { label: 'Tally / Bank Sync', val: '✓ Ledgers auto-reconciled', status: 'positive' },
          { label: 'Uncollected Balance', val: '1 Party requested 2 days extension', status: 'action' }
        ]
      }
    },
    {
      time: '09:00 PM',
      icon: Moon,
      title: 'Shutters Down: The 9 PM Founder Briefing',
      shortDesc: 'Go home in total peace. No more counting ceiling fans.',
      story: 'You pull the shutters down and get into your car. Your phone buzzes with your 9:00 PM Founder Briefing on WhatsApp: Exact sales made, actual cash deposited, real net profit earned today, and tomorrow morning\'s priorities.',
      uiMock: {
        badge: 'WHATSAPP FOUNDER BRIEFING',
        title: 'Daily Business Closing Memo • 9:00 PM',
        items: [
          { label: 'Gross Sales Today', val: '₹2,18,450 (18 Invoices)', status: 'positive' },
          { label: 'Cash & UPI In Bank', val: '₹1,94,200', status: 'positive' },
          { label: 'Estimated Net Margin', val: '₹34,800 (15.9% Net)', status: 'positive' },
          { label: 'Tomorrow\'s Due', val: 'Raw Material Supplier ₹42,000', status: 'action' }
        ]
      }
    }
  ];

  const current = steps[activeStep];

  return (
    <section className="relative z-20 w-full py-16 sm:py-24 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill-container text-xs font-extrabold text-[#C69A43] uppercase tracking-wider mb-3">
          <Clock className="w-3.5 h-3.5 text-[#C69A43]" />
          <span>A DAY IN YOUR BUSINESS WITH GROWNOVA</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[#102B4E] tracking-tight mb-4">
          Experience what a truly <br />
          <span className="radiant-gold-text">calm business day feels like.</span>
        </h2>
        <p className="text-sm sm:text-base text-[#52647C] leading-relaxed max-w-2xl mx-auto">
          From your first cup of morning tea to pulling the shutters down at night, see how GrowNova puts your business on effortless autopilot.
        </p>
      </div>

      {/* Interactive Time Selector Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {steps.map((s, idx) => {
          const StepIcon = s.icon;
          const isSelected = activeStep === idx;
          return (
            <button
              key={s.time}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-2xl text-left transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-white/90 shadow-md border-2 border-[#C69A43] scale-[1.02]'
                  : 'bg-white/60 hover:bg-white/80 border border-white/80 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-[#C69A43] text-white' : 'bg-slate-100 text-[#52647C]'
                }`}>
                  {s.time}
                </span>
                <StepIcon className={`w-4 h-4 ${isSelected ? 'text-[#C69A43]' : 'text-[#65758B]'}`} />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#102B4E] leading-snug line-clamp-1">
                {s.title}
              </h4>
              <p className="text-[11px] text-[#65758B] mt-1 line-clamp-1">
                {s.shortDesc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Detailed Narrative Card with Dynamic Interactive Preview */}
      <div className="glass-bento-card p-6 sm:p-10 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Story & Founder Perspective (Col 7) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-extrabold text-[#C69A43] tracking-widest uppercase">
                PHASE {activeStep + 1} OF 4
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-[#102B4E]">{current.time}</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#102B4E] mb-4">
              {current.title}
            </h3>

            <p className="text-sm sm:text-base text-[#384C62] leading-relaxed mb-6 font-normal">
              {current.story}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/80">
            <button
              onClick={onCtaClick}
              className="px-6 py-2.5 rounded-full text-xs font-bold text-white gold-glow-btn shadow-md hover:shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Test This in Live Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-[#102B4E] bg-white/70 hover:bg-white border border-white shadow-2xs transition-all cursor-pointer"
            >
              <span>Next Phase ({steps[(activeStep + 1) % steps.length].time}) →</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Telemetry Mock Preview (Col 5) */}
        <div className="lg:col-span-5 bg-white/85 backdrop-blur-md rounded-2xl p-5 border border-white shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100/80 text-[#C69A43]">
              {current.uiMock.badge}
            </span>
            <span className="text-[11px] font-semibold text-[#15803D] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] animate-pulse" />
              Live Sync
            </span>
          </div>

          <h5 className="text-xs font-bold text-[#102B4E]">
            {current.uiMock.title}
          </h5>

          <div className="space-y-2">
            {current.uiMock.items.map((item, i) => (
              <div 
                key={i}
                className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-between gap-3 text-xs"
              >
                <span className="text-[#65758B] font-medium">{item.label}</span>
                <span className={`font-bold text-right ${
                  item.status === 'positive' 
                    ? 'text-[#15803D]' 
                    : item.status === 'action'
                    ? 'text-[#C69A43]'
                    : 'text-[#102B4E]'
                }`}>
                  {item.val}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-[#65758B]">
            <span>Synced to GrowNova Mobile & Cloud</span>
            <span className="font-semibold text-[#102B4E]">Auto-Saved</span>
          </div>
        </div>

      </div>

    </section>
  );
};
