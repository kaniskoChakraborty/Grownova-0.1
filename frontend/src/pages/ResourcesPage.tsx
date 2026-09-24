import { MarketingLayout } from '../layouts/MarketingLayout';
import {
  BookOpen,
  ArrowRight,
  GraduationCap,
  FileSpreadsheet,
  Coins,
  Receipt,
  Boxes,
  Users2,
  Cpu,
  BarChart,
  Landmark,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export const ResourcesPage = () => {

  const guides = [
    {
      title: 'GST & Compliance',
      desc: 'The complete MSME handbook to GSTR-1, GSTR-3B, input tax credit, and audit defense.',
      icon: Receipt,
      readTime: '8 min read',
      badge: 'Statutory',
    },
    {
      title: 'MSME Finance',
      desc: 'Understanding collateral-free CGTMSE loans, working capital limits, and credit scoring.',
      icon: Coins,
      readTime: '12 min read',
      badge: 'Funding',
    },
    {
      title: 'Cash Flow Management',
      desc: 'Formulas to shorten your cash conversion cycle from 75 days to 32 days.',
      icon: FileSpreadsheet,
      readTime: '6 min read',
      badge: 'Treasury',
    },
    {
      title: 'Inventory Management',
      desc: 'How to calculate Economic Order Quantity (EOQ) and eliminate dead stock losses.',
      icon: Boxes,
      readTime: '10 min read',
      badge: 'Operations',
    },
    {
      title: 'Payroll & Labour Laws',
      desc: 'Step-by-step guidance on EPF, ESIC, professional tax and statutory wage ceilings.',
      icon: Users2,
      readTime: '7 min read',
      badge: 'HR & People',
    },
    {
      title: 'Business Operations',
      desc: 'Standard Operating Procedures (SOPs) for delegating responsibility without losing control.',
      icon: Cpu,
      readTime: '9 min read',
      badge: 'Management',
    },
  ];

  const intelligenceCards = [
    {
      title: 'MSME Growth Index 2026',
      desc: 'Regional trends across Tier-2 and Tier-3 manufacturing corridors in Gujarat, Maharashtra & Tamil Nadu.',
      metric: '↑ 24% YoY',
      icon: BarChart,
    },
    {
      title: 'Raw Material Inflation Trends',
      desc: 'Quarterly price tracker for domestic steel, polymer, cotton, and copper benchmarks.',
      metric: 'Updated Weekly',
      icon: Coins,
    },
    {
      title: 'Working Capital Benchmarks',
      desc: 'Average debtor days and inventory turnover ratios across 14 core Indian industry sectors.',
      metric: '52 Days Avg',
      icon: FileSpreadsheet,
    },
    {
      title: 'Government Subsidies & Schemes',
      desc: 'New PLI announcements, ZED certification benefits, and MSME Samadhaan delayed payment rules.',
      metric: 'Govt Portal Sync',
      icon: Landmark,
    },
  ];

  const academyModules = [
    { num: '01', title: 'Getting Started with GrowNova', desc: 'System onboarding, migrating your Tally/Excel ledgers, and setting up GST.' },
    { num: '02', title: 'Setting Up Your Business Hierarchy', desc: 'User roles, permission boundaries, multiple branches, and warehouse nodes.' },
    { num: '03', title: 'Mastering Real-Time Inventory', desc: 'Barcoding, batch expiry management, and automatic purchase order triggers.' },
    { num: '04', title: 'Understanding Finances & Cash Flow', desc: 'Reading real-time P&L, balance sheets, and automated bank reconciliation.' },
    { num: '05', title: 'Using Axiom for Predictive Growth', desc: 'Conversational queries, cash runway forecasts, and margin leak detection.' },
  ];

  const articles = [
    {
      category: 'Editorial',
      title: 'Why Indian MSMEs Outgrow Traditional Accounting and Need an Operating System',
      date: 'September 2026',
      readTime: '5 min read',
      author: 'GrowNova Research Team',
      snippet: 'Accounting software records what happened yesterday. An operating system empowers you to make profitable decisions for tomorrow.',
    },
    {
      category: 'Compliance',
      title: 'Navigating Section 43B(h): Practical Playbook for 45-Day MSME Payment Deadlines',
      date: 'September 2026',
      readTime: '8 min read',
      author: 'CA Rajesh Verma, Advisor',
      snippet: 'Clear contractual frameworks and automated e-invoicing workflows to avoid disallowed business deductions.',
    },
    {
      category: 'Intelligence',
      title: 'How Axiom AI Predicts Supplier Price Spikes Before They Impact Gross Margins',
      date: 'August 2026',
      readTime: '6 min read',
      author: 'Engineering & Data Systems',
      snippet: 'Combining macroeconomic commodity feeds with company purchasing history for automated procurement advice.',
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
            <BookOpen className="w-3.5 h-3.5 text-[#B57716]" />
            <span className="text-xs uppercase tracking-[0.22em] font-extrabold text-[#A86E14]">
              KNOWLEDGE & INTELLIGENCE
            </span>
          </div>

          <h1 className="font-serif text-[42px] sm:text-[56px] md:text-[68px] leading-[1.08] font-medium text-[#0B1E36] mb-6">
            Understand your business
            <span className="block radiant-gold-text">better.</span>
          </h1>

          <p className="text-[17px] sm:text-[19px] text-[#334155] font-medium leading-relaxed max-w-2xl mx-auto mb-10">
            Practical knowledge for running, managing and growing an Indian business.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#guides"
              className="group rounded-full px-8 py-4 text-base font-bold text-white gold-glow-btn flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <span>Explore GrowNova Guides</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#academy"
              className="rounded-full px-7 py-4 text-base font-bold text-[#0B1E36] luminous-glass-pill transition-all active:scale-95 cursor-pointer"
            >
              GrowNova Academy ↓
            </a>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 2. GROWNOVA GUIDES */}
        {/* ============================================================== */}
        <section id="guides" className="mb-28 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#0B1E36]/10 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.24em] font-extrabold text-[#B57716]">
                FIELD-TESTED PLAYBOOKS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#0B1E36] font-semibold mt-1">
                GrowNova Guides
              </h2>
            </div>
            <span className="text-xs text-[#475569] font-medium">6 Comprehensive Manuals</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide, idx) => {
              const Icon = guide.icon;
              return (
                <div
                  key={idx}
                  className="vision-card-glass rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl transition-all group cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#B57716] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0B1E36] bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {guide.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#0B1E36] mb-2 group-hover:text-[#B57716] transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#475569] font-medium leading-relaxed">
                      {guide.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-5 mt-4 border-t border-[#0B1E36]/5 text-xs text-[#64748B]">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {guide.readTime}
                    </span>
                    <span className="font-bold text-[#B57716] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Read Guide <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 3. BUSINESS INTELLIGENCE SECTION */}
        {/* ============================================================== */}
        <section className="mb-28">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.24em] font-extrabold text-[#B57716]">
              REAL-TIME MARKET INTELLIGENCE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#0B1E36] font-semibold mt-2">
              Business Intelligence & Industry Trends
            </h2>
            <p className="text-sm text-[#475569] font-medium mt-2">
              Aggregated insights from hundreds of Indian commercial hubs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {intelligenceCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="vision-card-glass rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
                        <Icon className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {card.metric}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#0B1E36] mb-1.5">{card.title}</h4>
                    <p className="text-xs text-[#475569] font-medium leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. GROWNOVA ACADEMY (FEATURE CONTAINER) */}
        {/* ============================================================== */}
        <section id="academy" className="mb-28 scroll-mt-24">
          <div className="vision-glass-container rounded-[32px] p-8 sm:p-12 border border-white shadow-2xl relative overflow-hidden bg-gradient-to-br from-white/90 via-white/70 to-white/90">
            <div className="max-w-3xl mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-[#B57716] text-xs font-bold mb-3 border border-amber-300">
                <GraduationCap className="w-4 h-4" />
                <span>GROWNOVA ACADEMY</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#0B1E36] font-semibold leading-tight">
                Learn the operating system behind your business.
              </h2>
              <p className="text-sm sm:text-base text-[#475569] font-medium mt-3">
                Master modern business operations through structured, practical 10-minute video masterclasses designed for founders and core team members.
              </p>
            </div>

            <div className="space-y-3">
              {academyModules.map((mod, i) => (
                <div
                  key={i}
                  className="bg-white/80 hover:bg-white p-4 sm:p-5 rounded-2xl border border-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:scale-[1.01] cursor-pointer group"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <span className="font-mono text-base font-bold text-[#B57716] bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                      {mod.num}
                    </span>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-[#0B1E36] group-hover:text-[#B57716] transition-colors">
                        {mod.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#475569] font-medium">
                        {mod.desc}
                      </p>
                    </div>
                  </div>

                  <span className="self-end sm:self-center text-xs font-bold text-[#0B1E36] bg-slate-100 group-hover:bg-[#0B1E36] group-hover:text-white px-4 py-2 rounded-full transition-colors flex items-center gap-1.5 flex-shrink-0">
                    <span>Watch Lesson</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 5. LATEST FROM GROWNOVA (EDITORIAL ARTICLES GRID) */}
        {/* ============================================================== */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-[#0B1E36]/10">
            <div>
              <span className="text-xs uppercase tracking-[0.24em] font-extrabold text-[#B57716]">
                PERSPECTIVES & THOUGHT LEADERSHIP
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#0B1E36] font-semibold mt-1">
                Latest from GrowNova
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((art, idx) => (
              <div
                key={idx}
                className="vision-card-glass rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl transition-all cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#64748B] mb-3">
                    <span className="font-extrabold uppercase tracking-wider text-[#B57716] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {art.category}
                    </span>
                    <span>{art.readTime}</span>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0B1E36] mb-3 group-hover:text-[#B57716] transition-colors leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#475569] font-medium leading-relaxed mb-4">
                    {art.snippet}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#0B1E36]/5 flex items-center justify-between text-xs text-[#64748B]">
                  <span className="font-medium">{art.author}</span>
                  <span className="font-semibold text-[#0B1E36] group-hover:translate-x-1 transition-transform">
                    Read →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </MarketingLayout>
  );
};
