import { useState } from 'react';
import { MarketingLayout } from '../layouts/MarketingLayout';
import {
  Layers,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Sparkles,
  Bot,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  FileCheck2,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProductPage = () => {
  const navigate = useNavigate();
  const [activeLayer, setActiveLayer] = useState<'run' | 'manage' | 'compliant' | 'grow'>('run');

  const layers = [
    {
      id: 'run',
      name: 'RUN',
      tagline: 'Day-to-day operations in one flow',
      icon: Zap,
      color: 'from-amber-500/20 to-amber-600/10',
      badgeColor: 'bg-amber-100 text-[#B57716] border-amber-300',
      features: [
        { title: 'Sales & Invoicing', desc: 'Generate GST-compliant invoices in under 15 seconds on mobile or web.' },
        { title: 'CRM & Leads', desc: 'Track customer relationships, quotations, and lead follow-ups effortlessly.' },
        { title: 'Smart Inventory', desc: 'Real-time stock tracking with low-inventory alerts and batch management.' },
        { title: 'Orders & Dispatch', desc: 'Complete order fulfillment tracking from booking to payment realization.' },
        { title: 'Operational Tasks', desc: 'Assign and monitor team tasks with automated escalations and SLAs.' },
      ],
    },
    {
      id: 'manage',
      name: 'MANAGE',
      tagline: 'Financial control and team governance',
      icon: DollarSign,
      color: 'from-sky-500/20 to-sky-600/10',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
      features: [
        { title: 'Double-Entry Accounting', desc: 'Automated ledger posting, balance sheets, and real-time cash flow.' },
        { title: 'Treasury & Finance', desc: 'Bank reconciliation, payment gateway integration, and credit control.' },
        { title: 'Payroll & HR', desc: '1-click payroll processing with automated PF, ESI, and PT deductions.' },
        { title: 'Customer Portals', desc: 'Dedicated client payment links, ledgers, and statement sharing.' },
        { title: 'Executive Analytics', desc: 'P&L, gross margins, and customer acquisition metrics in real time.' },
      ],
    },
    {
      id: 'compliant',
      name: 'STAY COMPLIANT',
      tagline: '100% Indian statutory peace of mind',
      icon: ShieldCheck,
      color: 'from-emerald-500/20 to-emerald-600/10',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      features: [
        { title: 'Direct GST Filing', desc: 'GSTR-1, GSTR-3B auto-computation and direct portal upload.' },
        { title: 'TDS & E-TDS', desc: 'Section-wise TDS deduction, challan generation, and Form 26Q tracking.' },
        { title: 'EPF & ESIC', desc: 'ECR file generation, return filings, and automated compliance calendars.' },
        { title: 'Statutory Deadlines', desc: 'Proactive alerts for advance tax, ROC filings, and audit readiness.' },
        { title: 'Audit Trail', desc: 'Tamper-evident logs adhering to Ministry of Corporate Affairs (MCA) norms.' },
      ],
    },
    {
      id: 'grow',
      name: 'GROW',
      tagline: 'Predictive intelligence for MSMEs',
      icon: TrendingUp,
      color: 'from-purple-500/20 to-purple-600/10',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      features: [
        { title: 'Axiom AI Forecasting', desc: 'Predict cash shortfalls 30 days in advance with high accuracy.' },
        { title: 'Customer Retention AI', desc: 'Identify dormant buyers and trigger smart WhatsApp re-engagement.' },
        { title: 'Demand Planning', desc: 'Forecast festival and seasonal inventory surges with historical models.' },
        { title: 'Vendor Optimization', desc: 'Compare supplier price trends and optimize procurement margins.' },
        { title: 'Expansion Benchmarks', desc: 'Compare your operational ratios against regional industry peers.' },
      ],
    },
  ];

  return (
    <MarketingLayout showNav={true}>
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-8 md:py-16">
        
        {/* ============================================================== */}
        {/* 1. PRODUCT PAGE HERO */}
        {/* ============================================================== */}
        <section className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#C2831E]/30 shadow-xs mb-6">
            <Layers className="w-3.5 h-3.5 text-[#B57716]" />
            <span className="text-xs uppercase tracking-[0.22em] font-extrabold text-[#A86E14]">
              GROWNOVA PRODUCT ARCHITECTURE
            </span>
          </div>

          <h1 className="font-serif text-[42px] sm:text-[56px] md:text-[68px] leading-[1.08] font-medium text-[#0B1E36] mb-6">
            One operating system.
            <span className="block radiant-gold-text">Every part of your business.</span>
          </h1>

          <p className="text-[17px] sm:text-[19px] text-[#334155] font-medium leading-relaxed max-w-2xl mx-auto mb-10">
            GrowNova brings sales, finance, inventory, people, compliance and everyday
            operations into one intelligent workspace — built for Indian businesses.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/pricing')}
              className="group rounded-full px-8 py-4 text-base font-bold text-white gold-glow-btn flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <span>Start with GrowNova</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href="#layers"
              className="rounded-full px-7 py-4 text-base font-bold text-[#0B1E36] luminous-glass-pill transition-all active:scale-95 cursor-pointer"
            >
              Explore 4 OS Layers ↓
            </a>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 2. VISIONOS PRODUCT PREVIEW BANNER */}
        {/* ============================================================== */}
        <div className="relative mb-28">
          <div className="vision-glass-container rounded-[32px] p-6 sm:p-10 shadow-2xl border border-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#E4A333]/20 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 flex flex-col justify-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B57716] mb-2">Integrated Business Core</span>
                <h3 className="font-serif text-3xl sm:text-4xl text-[#0B1E36] font-semibold mb-4 leading-tight">
                  Seamless data flow from billing to GST filing.
                </h3>
                <p className="text-sm sm:text-base text-[#475569] leading-relaxed mb-6 font-medium">
                  When a sales invoice is created, inventory deducts immediately, accounts receivable updates, GST ledger balances adjust, and Axiom monitors the payment timeline. Zero manual reconciliation.
                </p>

                <div className="flex flex-col gap-3">
                  {[
                    '100% automated GST and TDS reconciliation',
                    'Real-time vernacular mobile invoicing on WhatsApp',
                    'Zero latency bank integration via Open Banking APIs'
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-sm font-semibold text-[#0B1E36]">
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Simulated Mock Screen */}
              <div className="lg:col-span-7 bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-white/90 shadow-xl">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#0B1E36]/10">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    <span className="ml-2 text-xs font-bold text-[#0B1E36]">GrowNova OS Unified Dashboard</span>
                  </div>
                  <span className="text-[11px] bg-[#F4EAD4] text-[#B57716] px-2.5 py-0.5 rounded-full font-bold">Live Enterprise Sync</span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-white/80 p-3 rounded-xl border border-white shadow-xs">
                    <span className="text-[11px] text-[#475569] font-medium block">Daily Turnover</span>
                    <span className="text-base sm:text-lg font-bold text-[#0B1E36]">₹1,84,500</span>
                    <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">↑ 18.2% vs avg</span>
                  </div>
                  <div className="bg-white/80 p-3 rounded-xl border border-white shadow-xs">
                    <span className="text-[11px] text-[#475569] font-medium block">GST Due (Oct 20)</span>
                    <span className="text-base sm:text-lg font-bold text-[#0B1E36]">₹42,180</span>
                    <span className="text-[10px] text-amber-700 font-bold block mt-0.5">Auto-calculated</span>
                  </div>
                  <div className="bg-white/80 p-3 rounded-xl border border-white shadow-xs">
                    <span className="text-[11px] text-[#475569] font-medium block">Active Orders</span>
                    <span className="text-base sm:text-lg font-bold text-[#0B1E36]">38 Dispatches</span>
                    <span className="text-[10px] text-sky-600 font-bold block mt-0.5">All on track</span>
                  </div>
                </div>

                <div className="bg-white/90 p-4 rounded-xl border border-white shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-[#B57716]">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#0B1E36] block">E-Way Bill #984218-MH Generated</span>
                      <span className="text-[11px] text-[#475569]">Consignment en route to Bhiwandi logistics hub</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. FOUR PRODUCT LAYERS (RUN, MANAGE, COMPLY, GROW) */}
        {/* ============================================================== */}
        <section id="layers" className="mb-28 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.24em] font-extrabold text-[#B57716]">
              COMPREHENSIVE OS CAPABILITIES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#0B1E36] font-semibold mt-2">
              Four dedicated layers. Infinite power.
            </h2>
          </div>

          {/* Interactive Layer Tabs */}
          <div className="flex justify-center mb-10 overflow-x-auto pb-2">
            <div className="nav-island-glass p-1.5 rounded-full flex gap-2">
              {layers.map((layer) => {
                const Icon = layer.icon;
                const isActive = activeLayer === layer.id;
                return (
                  <button
                    key={layer.id}
                    onClick={() => setActiveLayer(layer.id as any)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0B1E36] text-white shadow-md'
                        : 'text-[#0B1E36]/80 hover:bg-white/60 hover:text-[#0B1E36]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{layer.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Layer Content Grid */}
          {(() => {
            const current = layers.find((l) => l.id === activeLayer)!;
            return (
              <div className="vision-glass-container rounded-3xl p-8 sm:p-10 border border-white shadow-xl animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#0B1E36]/10 gap-3">
                  <div>
                    <span className={`text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border ${current.badgeColor}`}>
                      {current.name} LAYER
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif text-[#0B1E36] font-semibold mt-2">
                      {current.tagline}
                    </h3>
                  </div>
                  <button 
                    onClick={() => navigate('/solutions')}
                    className="self-start sm:self-center text-xs font-bold text-[#B57716] hover:text-[#0B1E36] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    See real workflow demo <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {current.features.map((feat, i) => (
                    <div
                      key={i}
                      className="vision-card-glass rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg transition-all"
                    >
                      <div>
                        <div className="w-8 h-8 rounded-xl bg-white shadow-2xs flex items-center justify-center text-[#B57716] font-bold text-sm mb-3 border border-[#0B1E36]/5">
                          0{i + 1}
                        </div>
                        <h4 className="text-base font-bold text-[#0B1E36] mb-2">{feat.title}</h4>
                        <p className="text-xs sm:text-sm text-[#475569] font-medium leading-relaxed">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </section>

        {/* ============================================================== */}
        {/* 4. AXIOM AI SECTION (CONVERSATIONAL INTELLIGENCE LAYER) */}
        {/* ============================================================== */}
        <section className="mb-28">
          <div className="vision-glass-container rounded-[36px] p-8 sm:p-12 border border-white shadow-2xl relative overflow-hidden bg-gradient-to-b from-white/80 via-white/60 to-white/80">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#B57716] text-xs font-bold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>INTELLIGENCE REDEFINED</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#0B1E36] font-semibold mb-4">
                Your business has a new intelligence layer.
              </h2>
              <p className="text-base sm:text-lg text-[#475569] font-medium max-w-xl mx-auto">
                Meet Axiom: the AI brain connected directly to your sales ledgers, inventory counts, and statutory accounts.
              </p>
            </div>

            {/* Conversational VisionOS Chat Interface */}
            <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-2xl rounded-2xl p-6 sm:p-8 border border-white shadow-2xl">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#0B1E36]/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C2831E] to-[#E4A333] flex items-center justify-center text-white shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#0B1E36] block leading-tight">Axiom Intelligence</span>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Real-time Enterprise Ledger Access
                    </span>
                  </div>
                </div>
                <span className="text-xs bg-slate-100 text-[#0B1E36] font-bold px-2.5 py-1 rounded-md">
                  Axiom 3.5 Core
                </span>
              </div>

              {/* Chat Thread */}
              <div className="flex flex-col gap-4 mb-6">
                {/* User Message */}
                <div className="self-end bg-[#0B1E36] text-white px-5 py-3 rounded-2xl rounded-tr-xs text-sm max-w-md shadow-md">
                  <span className="font-semibold">"What needs my attention today?"</span>
                </div>

                {/* Axiom Response */}
                <div className="self-start bg-white border border-slate-200 text-[#0B1E36] p-5 rounded-2xl rounded-tl-xs text-sm max-w-lg shadow-sm">
                  <div className="flex items-center gap-1.5 font-bold text-amber-700 text-xs mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Axiom Priority Briefing:</span>
                  </div>

                  <p className="font-semibold text-sm mb-3">
                    Good morning, Ravi. 3 things need your attention before noon:
                  </p>

                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#0B1E36] block">₹3.42L in outstanding payments</span>
                        <span className="text-[#475569]">Metro Traders (₹1.8L) & Apex Logistics (₹1.62L) past 45-day credit terms.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-sky-50/70 border border-sky-200 text-xs">
                      <Clock className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#0B1E36] block">2 purchase requests awaiting approval</span>
                        <span className="text-[#475569]">Raw material po-402 (Steel coil) submitted by Factory Manager Sunil.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-rose-50/70 border border-rose-200 text-xs">
                      <FileCheck2 className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#0B1E36] block">GST filing deadline approaching</span>
                        <span className="text-[#475569]">GSTR-3B draft is ready for review. ₹42,180 net liability payable.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Input Bar */}
              <div className="flex items-center gap-2 p-1.5 rounded-full bg-slate-100/90 border border-slate-200">
                <input
                  type="text"
                  placeholder="Ask Axiom in English or Hindi (e.g., 'aaj ka bank balance')..."
                  className="w-full bg-transparent px-4 py-2 text-xs font-medium text-[#0B1E36] focus:outline-none placeholder:text-gray-400"
                  readOnly
                  value="What is our cash flow projection for next month?"
                />
                <button className="w-8 h-8 rounded-full bg-[#0B1E36] text-white flex items-center justify-center flex-shrink-0 shadow-xs cursor-pointer">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 5. FINAL PRODUCT CTA */}
        {/* ============================================================== */}
        <section className="text-center py-12">
          <div className="vision-glass-container rounded-3xl p-10 sm:p-16 max-w-3xl mx-auto shadow-xl">
            <h2 className="font-serif text-3xl sm:text-5xl text-[#0B1E36] font-semibold mb-4">
              Everything important.
              <span className="block radiant-gold-text">One glance.</span>
            </h2>
            <p className="text-base text-[#475569] font-medium mb-8 max-w-md mx-auto">
              Empower your business with the clarity and speed of an Apple-grade OS.
            </p>
            <button
              onClick={() => navigate('/pricing')}
              className="rounded-full px-9 py-4 text-base font-bold text-white gold-glow-btn inline-flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <span>Explore GrowNova</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

      </div>
    </MarketingLayout>
  );
};
