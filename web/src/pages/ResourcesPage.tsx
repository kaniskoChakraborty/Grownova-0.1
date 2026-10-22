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
      metric: 'Benchmark Data',
      icon: Landmark,
    },
    {
      title: 'GST Regulatory Radar',
      desc: 'Real-time notifications of GST Council circulars, e-Invoicing thresholds, and judicial rulings.',
      metric: 'Direct Portal Sync',
      icon: Receipt,
    },
  ];

  const academyModules = [
    {
      num: '01',
      title: 'Double-Entry Accounting for Non-Accountants',
      desc: 'Understand debits, credits, and trial balance without getting lost in jargon.',
    },
    {
      num: '02',
      title: 'Zero-Error GST Reconciliation',
      desc: 'Step-by-step GSTR-2B matching to maximize Input Tax Credit (ITC) recovery.',
    },
    {
      num: '03',
      title: 'Inventory Valuation: FIFO vs Weighted Average',
      desc: 'Which inventory accounting method saves you the most working capital tax.',
    },
    {
      num: '04',
      title: 'Axiom AI Masterclass: Automating WhatsApp Orders',
      desc: 'How to turn unformatted voice and text inquiries directly into sales orders.',
    },
  ];

  const articles = [
    {
      category: 'Founder Advisory',
      title: 'Why Indian MSMEs are ditching legacy ERPs for browser-based OS architecture',
      snippet: 'Monolithic desktop software created data silos and endless manual entry. How modern visionOS spatial workflows restore speed.',
      author: 'By GrowNova Product Team',
      readTime: '4 min',
    },
    {
      category: 'Tax & Compliance',
      title: 'The MSME 45-Day Payment Rule (Section 43B-h): What you must do right now',
      snippet: 'Non-payment to registered MSMEs within 45 days triggers tax disallowances. How to audit your accounts payable ledger in 5 minutes.',
      author: 'By CA Narendra Mehta',
      readTime: '6 min',
    },
    {
      category: 'Supply Chain',
      title: 'From Bhiwandi to Surat: Building a resilient regional logistics chain',
      snippet: 'How small manufacturers cut transit breakage by 18% using barcode vehicle challans and driver WhatsApp dispatching.',
      author: 'By Operations Desk',
      readTime: '5 min',
    },
  ];

  return (
    <MarketingLayout showNav={true}>
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-8 md:py-16 select-none">
        
        {/* 1. HERO SECTION */}
        <section className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#C69A43]/30 shadow-xs mb-6">
            <BookOpen className="w-3.5 h-3.5 text-[#C69A43]" />
            <span className="text-xs uppercase tracking-[0.22em] font-extrabold text-[#C69A43]">
              KNOWLEDGE & INTELLIGENCE
            </span>
          </div>

          <h1 className="font-serif text-[42px] sm:text-[56px] md:text-[68px] leading-[1.08] font-medium text-[#0B2340] mb-6">
            Everything you need to
            <span className="block radiant-gold-text">run a sharper business.</span>
          </h1>

          <p className="text-[17px] sm:text-[19px] text-[#55677D] font-medium leading-relaxed max-w-2xl mx-auto mb-10">
            Handbooks, compliance playbooks, statutory calculators, and industry intelligence designed for Indian founders and managers.
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
              className="rounded-full px-7 py-4 text-base font-bold text-[#102B4E] luminous-glass-pill transition-all active:scale-95 cursor-pointer"
            >
              GrowNova Academy ↓
            </a>
          </div>
        </section>

        {/* 2. GROWNOVA GUIDES */}
        <section id="guides" className="mb-28 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#102B4E]/10 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.24em] font-extrabold text-[#C69A43]">
                FIELD-TESTED PLAYBOOKS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#0B2340] font-semibold mt-1">
                GrowNova Guides
              </h2>
            </div>
            <span className="text-xs text-[#55677D] font-medium">6 Comprehensive Manuals</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide, idx) => {
              const Icon = guide.icon;
              return (
                <div
                  key={idx}
                  className="gn-card-secondary rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl transition-all group cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#C69A43] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#102B4E] bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {guide.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#0B2340] mb-2 group-hover:text-[#C69A43] transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#55677D] font-medium leading-relaxed">
                      {guide.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-5 mt-4 border-t border-[#102B4E]/5 text-xs text-[#65758B]">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {guide.readTime}
                    </span>
                    <span className="font-bold text-[#C69A43] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Read Guide <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. BUSINESS INTELLIGENCE SECTION */}
        <section className="mb-28">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.24em] font-extrabold text-[#C69A43]">
              REAL-TIME MARKET INTELLIGENCE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#0B2340] font-semibold mt-2">
              Business Intelligence & Industry Trends
            </h2>
            <p className="text-sm text-[#55677D] font-medium mt-2">
              Aggregated insights from hundreds of Indian commercial hubs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {intelligenceCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="gn-card-secondary rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg transition-all"
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

                    <h4 className="text-sm font-bold text-[#0B2340] mb-1.5">{card.title}</h4>
                    <p className="text-xs text-[#55677D] font-medium leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. GROWNOVA ACADEMY (FEATURE CONTAINER) */}
        <section id="academy" className="mb-28 scroll-mt-24">
          <div className="gn-panel rounded-[32px] p-8 sm:p-12 border border-white shadow-2xl relative overflow-hidden bg-white/80">
            <div className="max-w-3xl mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-[#C69A43] text-xs font-bold mb-3 border border-[#C69A43]/30">
                <GraduationCap className="w-4 h-4" />
                <span>GROWNOVA ACADEMY</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#0B2340] font-semibold leading-tight">
                Learn the operating system behind your business.
              </h2>
              <p className="text-sm sm:text-base text-[#55677D] font-medium mt-3">
                Master modern business operations through structured, practical 10-minute video masterclasses designed for founders and core team members.
              </p>
            </div>

            <div className="space-y-3">
              {academyModules.map((mod, i) => (
                <div
                  key={i}
                  className="bg-white/85 hover:bg-white p-4 sm:p-5 rounded-2xl border border-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:scale-[1.01] cursor-pointer group"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <span className="font-mono text-base font-bold text-[#C69A43] bg-amber-50 px-3 py-1.5 rounded-xl border border-[#C69A43]/20">
                      {mod.num}
                    </span>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-[#0B2340] group-hover:text-[#C69A43] transition-colors">
                        {mod.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#55677D] font-medium">
                        {mod.desc}
                      </p>
                    </div>
                  </div>

                  <span className="self-end sm:self-center text-xs font-bold text-[#102B4E] bg-slate-100 group-hover:bg-[#102B4E] group-hover:text-white px-4 py-2 rounded-full transition-colors flex items-center gap-1.5 flex-shrink-0">
                    <span>Watch Lesson</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. LATEST FROM GROWNOVA */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-[#102B4E]/10">
            <div>
              <span className="text-xs uppercase tracking-[0.24em] font-extrabold text-[#C69A43]">
                PERSPECTIVES & THOUGHT LEADERSHIP
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#0B2340] font-semibold mt-1">
                Latest from GrowNova
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((art, idx) => (
              <div
                key={idx}
                className="gn-card-secondary rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl transition-all cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#65758B] mb-3">
                    <span className="font-extrabold uppercase tracking-wider text-[#C69A43] bg-amber-50 px-2 py-0.5 rounded border border-[#C69A43]/20">
                      {art.category}
                    </span>
                    <span>{art.readTime}</span>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0B2340] mb-3 group-hover:text-[#C69A43] transition-colors leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#55677D] font-medium leading-relaxed mb-4">
                    {art.snippet}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#102B4E]/5 flex items-center justify-between text-xs text-[#65758B]">
                  <span className="font-medium">{art.author}</span>
                  <span className="font-semibold text-[#102B4E] group-hover:translate-x-1 transition-transform">
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

export default ResourcesPage;
