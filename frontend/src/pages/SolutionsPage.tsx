import { useState } from 'react';
import { MarketingLayout } from '../layouts/MarketingLayout';
import {
  Users,
  Briefcase,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  Factory,
  Wrench,
  Truck,
  Building2,
  CalendarCheck,
  Eye,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SolutionsPage = () => {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState<'owner' | 'manager' | 'employee'>('owner');

  const industries = [
    {
      name: 'Retail & Wholesale',
      icon: ShoppingBag,
      desc: 'Barcode POS, multi-branch inventory, rapid billing, and customer credit ledger tracking.',
    },
    {
      name: 'Manufacturing',
      icon: Factory,
      desc: 'Bill of Materials (BOM), production batch tracking, raw material procurement, and scrap control.',
    },
    {
      name: 'Services & Contracting',
      icon: Wrench,
      desc: 'Client quotation tracking, milestone billing, field technician logging, and GST service invoices.',
    },
    {
      name: 'Distribution & Logistics',
      icon: Truck,
      desc: 'Vehicle load optimization, e-Way bills, driver challans, and distributor pricing matrices.',
    },
    {
      name: 'Professional Firms',
      icon: Building2,
      desc: 'Time billing, retainer tracking, client trust ledgers, and automated statutory tax filings.',
    },
  ];

  return (
    <MarketingLayout showNav={true}>
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-8 md:py-16">
        
        {/* ============================================================== */}
        {/* 1. HERO SECTION */}
        {/* ============================================================== */}
        <section className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#C2831E]/30 shadow-xs mb-6">
            <Users className="w-3.5 h-3.5 text-[#B57716]" />
            <span className="text-xs uppercase tracking-[0.22em] font-extrabold text-[#A86E14]">
              TAILORED OPERATING SOLUTIONS
            </span>
          </div>

          <h1 className="font-serif text-[42px] sm:text-[56px] md:text-[68px] leading-[1.08] font-medium text-[#0B1E36] mb-6">
            Built around how your business
            <span className="block radiant-gold-text">actually works.</span>
          </h1>

          <p className="text-[17px] sm:text-[19px] text-[#334155] font-medium leading-relaxed max-w-2xl mx-auto mb-10">
            One operating system, designed for the people who keep a business moving.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/pricing')}
              className="group rounded-full px-8 py-4 text-base font-bold text-white gold-glow-btn flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <span>See GrowNova in action</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href="#roles"
              className="rounded-full px-7 py-4 text-base font-bold text-[#0B1E36] luminous-glass-pill transition-all active:scale-95 cursor-pointer"
            >
              Explore Roles ↓
            </a>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 2. SPATIAL ROLE SECTIONS (OWNER, MANAGER, EMPLOYEE) */}
        {/* ============================================================== */}
        <section id="roles" className="mb-28 scroll-mt-24">
          {/* Role Filter Tabs */}
          <div className="flex justify-center mb-12">
            <div className="nav-island-glass p-1.5 rounded-full flex gap-2">
              <button
                onClick={() => setActiveRole('owner')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeRole === 'owner'
                    ? 'bg-[#0B1E36] text-white shadow-md'
                    : 'text-[#0B1E36]/80 hover:bg-white/60'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>OWNER</span>
              </button>

              <button
                onClick={() => setActiveRole('manager')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeRole === 'manager'
                    ? 'bg-[#0B1E36] text-white shadow-md'
                    : 'text-[#0B1E36]/80 hover:bg-white/60'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>MANAGER</span>
              </button>

              <button
                onClick={() => setActiveRole('employee')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeRole === 'employee'
                    ? 'bg-[#0B1E36] text-white shadow-md'
                    : 'text-[#0B1E36]/80 hover:bg-white/60'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>EMPLOYEE</span>
              </button>
            </div>
          </div>

          {/* 1. OWNER CARD */}
          {activeRole === 'owner' && (
            <div className="vision-glass-container rounded-[32px] p-8 sm:p-12 border border-white shadow-2xl animate-in fade-in duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6">
                  <span className="text-xs uppercase tracking-widest font-extrabold text-[#B57716] bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300 inline-block mb-3">
                    FOR BUSINESS PROMOTERS & FOUNDERS
                  </span>
                  <h2 className="font-serif text-3xl sm:text-5xl text-[#0B1E36] font-semibold mb-4 leading-tight">
                    See the business.
                    <span className="block text-[#B57716]">Understand the numbers.</span>
                    Make decisions.
                  </h2>
                  <p className="text-sm sm:text-base text-[#475569] font-medium leading-relaxed mb-8">
                    Gain total executive clarity without waiting for end-of-month accountant spreadsheets. Your true financial health, live on your phone.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { title: 'Executive Dashboard', desc: 'Consolidated view of revenue, profitability, and bank balances.' },
                      { title: 'Cash-Flow Visibility', desc: 'Real-time inflows vs outflows with 30-day liquidity alerts.' },
                      { title: 'Business Insights', desc: 'Identify top customers, highest-margin products, and idle capital.' },
                      { title: '1-Tap Approvals', desc: 'Approve purchase orders, expenses, and discounts from anywhere.' },
                      { title: 'AI Recommendations', desc: 'Axiom surfaces actionable opportunities to plug profit leaks.' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 bg-white/70 p-3.5 rounded-xl border border-white">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-[#0B1E36] block">{item.title}</span>
                          <span className="text-[11px] text-[#475569] leading-tight block">{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-6 bg-white/80 backdrop-blur-2xl rounded-2xl p-6 border border-white shadow-xl">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#0B1E36]/10">
                    <span className="text-xs font-bold text-[#0B1E36] flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-[#B57716]" />
                      Founder Executive Snapshot
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">Live</span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-xs font-medium text-[#475569]">Net Monthly Cash Position</span>
                        <span className="text-base font-bold text-[#0B1E36]">₹48,20,500</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#B57716] h-full w-[72%]"></div>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold block mt-1">Healthy buffer: 42 days operating expenses covered</span>
                    </div>

                    <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs">
                      <span className="font-bold text-[#0B1E36] block mb-0.5">Axiom Founder Advisory</span>
                      <span className="text-[#475569]">"Recovering ₹1.8L from Metro Traders will increase your Q3 working capital reserve by 14%."</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. MANAGER CARD */}
          {activeRole === 'manager' && (
            <div className="vision-glass-container rounded-[32px] p-8 sm:p-12 border border-white shadow-2xl animate-in fade-in duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6">
                  <span className="text-xs uppercase tracking-widest font-extrabold text-sky-800 bg-sky-100 px-3 py-1 rounded-full border border-sky-300 inline-block mb-3">
                    FOR OPERATIONS & DEPARTMENT HEADS
                  </span>
                  <h2 className="font-serif text-3xl sm:text-5xl text-[#0B1E36] font-semibold mb-4 leading-tight">
                    Keep teams, operations
                    <span className="block text-sky-700">and targets moving.</span>
                  </h2>
                  <p className="text-sm sm:text-base text-[#475569] font-medium leading-relaxed mb-8">
                    Supercharge your floor managers, sales leads, and inventory supervisors with automated workflows and zero miscommunication.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { title: 'Team Management', desc: 'Track sales targets, quotas, and field staff activities.' },
                      { title: 'Task Dispatch', desc: 'Automate recurring work orders and quality check milestones.' },
                      { title: 'Inventory Control', desc: 'Stock inward/outward with threshold reorder triggers.' },
                      { title: 'Sales Pipeline', desc: 'Monitor quotation conversions and lead response latency.' },
                      { title: 'Workflow Approvals', desc: 'Approve vendor quotes and expense bills in seconds.' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 bg-white/70 p-3.5 rounded-xl border border-white">
                        <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-[#0B1E36] block">{item.title}</span>
                          <span className="text-[11px] text-[#475569] leading-tight block">{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-6 bg-white/80 backdrop-blur-2xl rounded-2xl p-6 border border-white shadow-xl">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#0B1E36]/10">
                    <span className="text-xs font-bold text-[#0B1E36] flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-sky-600" />
                      Operations Hub
                    </span>
                    <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-md">8 Teams Active</span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                      <div>
                        <span className="text-xs font-bold text-[#0B1E36] block">Warehouse Dispatch Queue</span>
                        <span className="text-[11px] text-[#475569]">32 orders picked, 6 pending transport challan</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">94% On Time</span>
                    </div>

                    <div className="p-3 bg-sky-50/80 rounded-xl border border-sky-200 text-xs">
                      <span className="font-bold text-[#0B1E36] block mb-0.5">Automated Stock Alert</span>
                      <span className="text-[#475569]">"Copper Wire 1.5mm reached minimum reorder point. Auto-drafted PO sent to Sunil."</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. EMPLOYEE CARD */}
          {activeRole === 'employee' && (
            <div className="vision-glass-container rounded-[32px] p-8 sm:p-12 border border-white shadow-2xl animate-in fade-in duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6">
                  <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 inline-block mb-3">
                    FOR EVERY TEAM MEMBER
                  </span>
                  <h2 className="font-serif text-3xl sm:text-5xl text-[#0B1E36] font-semibold mb-4 leading-tight">
                    Everything you need for your day.
                    <span className="block text-emerald-700">Nothing you don't.</span>
                  </h2>
                  <p className="text-sm sm:text-base text-[#475569] font-medium leading-relaxed mb-8">
                    A clean, vernacular mobile app for every employee. Clock in, see your day's tasks, file expenses, and apply for leave in seconds.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { title: 'My Day View', desc: 'Prioritized checklist of tasks, deliveries, and client meetings.' },
                      { title: '1-Tap Attendance', desc: 'Geo-verified biometric and selfie punch-in without paperwork.' },
                      { title: 'Task Workspace', desc: 'Upload delivery proofs, photos, and customer signatures.' },
                      { title: 'Instant Leave', desc: 'Apply for planned leave and view approved balances.' },
                      { title: 'Digital Payslips', desc: 'Download monthly salary slips with tax breakdown directly.' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 bg-white/70 p-3.5 rounded-xl border border-white">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-[#0B1E36] block">{item.title}</span>
                          <span className="text-[11px] text-[#475569] leading-tight block">{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-6 bg-white/80 backdrop-blur-2xl rounded-2xl p-6 border border-white shadow-xl">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#0B1E36]/10">
                    <span className="text-xs font-bold text-[#0B1E36] flex items-center gap-1.5">
                      <CalendarCheck className="w-4 h-4 text-emerald-600" />
                      Employee Daily Portal
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">Punched In: 09:12 AM</span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-xs font-bold text-[#0B1E36] block mb-1">Assigned Tasks for Today</span>
                      <div className="space-y-1 text-xs text-[#475569]">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="accent-emerald-600" />
                          <span className="line-through">Morning delivery dispatch to Kalbadevi</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="accent-emerald-600" />
                          <span>Collect payment receipt from National Metal Corp</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold text-[#0B1E36] block">Salary Slip September 2026</span>
                        <span className="text-[#475569]">Credited to HDFC Bank ****4091</span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-white px-2.5 py-1 rounded shadow-2xs">Download PDF</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ============================================================== */}
        {/* 3. INDUSTRY SOLUTIONS SECTION */}
        {/* ============================================================== */}
        <section className="mb-28">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.24em] font-extrabold text-[#B57716]">
              VERTICAL SPECIALIZATION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#0B1E36] font-semibold mt-2">
              One OS. Different businesses.
            </h2>
            <p className="text-sm sm:text-base text-[#475569] font-medium mt-2">
              Pre-configured business logic engineered specifically for core Indian commercial sectors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((ind, idx) => {
              const Icon = ind.icon;
              return (
                <div
                  key={idx}
                  className="vision-card-glass rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl transition-all"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-100/90 text-[#B57716] flex items-center justify-center mb-4 shadow-2xs">
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0B1E36] mb-2">{ind.name}</h3>
                    <p className="text-xs sm:text-sm text-[#475569] font-medium leading-relaxed">{ind.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. FINAL CTA */}
        {/* ============================================================== */}
        <section className="text-center py-12">
          <div className="vision-glass-container rounded-3xl p-10 sm:p-16 max-w-3xl mx-auto shadow-xl">
            <h2 className="font-serif text-3xl sm:text-5xl text-[#0B1E36] font-semibold mb-4">
              Different roles.
              <span className="block radiant-gold-text">One source of truth.</span>
            </h2>
            <p className="text-base text-[#475569] font-medium mb-8 max-w-md mx-auto">
              Bring your entire organization into single-screen harmony today.
            </p>
            <button
              onClick={() => navigate('/pricing')}
              className="rounded-full px-9 py-4 text-base font-bold text-white gold-glow-btn inline-flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <span>See GrowNova in action</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

      </div>
    </MarketingLayout>
  );
};
