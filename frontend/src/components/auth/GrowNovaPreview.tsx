import {
  Home,
  Users,
  FileText,
  UserCheck,
  Shield,
  Search,
  ChevronDown,
  BarChart3,
  ShoppingCart,
  Wallet,
  Users2,
  FileSpreadsheet,
  UserPlus,
  Receipt,
  CalendarDays,
  Check
} from 'lucide-react';
import { GrowNovaLogo } from '../GrowNovaLogo';

export const GrowNovaPreview = () => {
  return (
    <div 
      className="w-full rounded-2xl md:rounded-[26px] p-3 sm:p-4 shadow-[0_20px_45px_-10px_rgba(11,30,54,0.2),inset_0_1.5px_2px_rgba(255,255,255,0.95),inset_0_-1.5px_2px_rgba(255,255,255,0.4)] border border-white/85 select-none text-[#102B4E] transition-all"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.4) 100%)',
        backdropFilter: 'blur(28px) saturate(175%)',
        WebkitBackdropFilter: 'blur(28px) saturate(175%)',
      }}
    >
      {/* 1. Dashboard Top Header Bar */}
      <div className="flex items-center justify-between gap-1 pb-2 border-b border-[#102B4E]/10">
        {/* Left: Mini GrowNova Logo */}
        <div className="flex-shrink-0">
          <GrowNovaLogo size="sm" showSubtitle={false} />
        </div>

        {/* Center: Module Navigation Pills */}
        <div className="hidden sm:flex items-center gap-0.5 bg-white/65 p-0.5 rounded-full border border-white/80 shadow-2xs">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F8EEDD] text-[#102B4E] border border-[#DEB877]/40 shadow-2xs">
            <Home className="w-2.5 h-2.5 text-[#B88932]" />
            <span>Home</span>
          </div>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium text-[#475569]">
            <Users className="w-2.5 h-2.5" />
            <span>CRM</span>
          </div>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium text-[#475569]">
            <FileText className="w-2.5 h-2.5" />
            <span>Accounting</span>
          </div>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium text-[#475569]">
            <UserCheck className="w-2.5 h-2.5" />
            <span>HR</span>
          </div>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium text-[#475569]">
            <Shield className="w-2.5 h-2.5" />
            <span>Reports</span>
          </div>
        </div>

        {/* Right: Search & Profile */}
        <div className="flex items-center gap-1.5">
          <div className="hidden xs:flex items-center gap-1 bg-white/65 border border-white/80 rounded-full px-2 py-0.5 text-[9.5px] text-[#55677D] shadow-2xs">
            <Search className="w-2.5 h-2.5 text-[#55677D]" />
            <span>Search or ask...</span>
            <span className="text-[8px] bg-white/90 px-1 rounded text-[#55677D] border border-white font-mono">⌘K</span>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-1 pl-1 pr-1.5 py-0.5 rounded-full bg-white/65 border border-white/80 shadow-2xs">
            <img
              src="/ravi_avatar_hq.jpg"
              alt="Ravi"
              className="w-4 h-4 rounded-full object-cover ring-1 ring-white"
            />
            <div className="flex flex-col text-left leading-none">
              <span className="text-[9.5px] font-bold text-[#102B4E]">Ravi</span>
              <span className="text-[7.5px] text-[#64748B]">Owner</span>
            </div>
            <ChevronDown className="w-2 h-2 text-[#64748B]" />
          </div>
        </div>
      </div>

      {/* 2. Greeting & 4 KPI Cards */}
      <div className="grid grid-cols-12 gap-2 py-2 items-stretch">
        {/* Greeting Column */}
        <div className="col-span-12 sm:col-span-3 flex flex-col justify-center leading-tight">
          <span className="text-[9px] font-semibold text-[#64748B]">Mon, 5 September 2025</span>
          <div className="font-serif mt-0.5">
            <span className="text-[13px] font-semibold text-[#0B1E36] block">Good morning,</span>
            <span className="text-[14px] font-bold text-[#B0782D] block">Ravi</span>
          </div>
          <div className="w-4 h-[1.5px] bg-[#B0782D] rounded-full my-0.5"></div>
          <span className="text-[8.5px] text-[#64748B]">
            Your business.<br />In better hands.
          </span>
        </div>

        {/* 4 KPI Cards */}
        <div className="col-span-12 sm:col-span-9 grid grid-cols-4 gap-1.5">
          {/* KPI 1 */}
          <div className="bg-white/75 rounded-xl p-1.5 border border-white/90 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-md bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-2.5 h-2.5 text-[#B47E28]" />
              </div>
              <span className="text-[8.5px] font-medium text-[#64748B] truncate">Total Sales</span>
            </div>
            <div className="mt-1">
              <div className="text-[11px] font-extrabold text-[#0B1E36] leading-none">₹ 12,48,000</div>
              <div className="text-[7.5px] font-semibold text-[#16A34A] mt-0.5">↑ 12% <span className="font-normal text-[#64748B]">vs last month</span></div>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="bg-white/75 rounded-xl p-1.5 border border-white/90 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-md bg-[#FFEDD5] border border-[#FED7AA] flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="w-2.5 h-2.5 text-[#C2410C]" />
              </div>
              <span className="text-[8.5px] font-medium text-[#64748B] truncate">Total Orders</span>
            </div>
            <div className="mt-1">
              <div className="text-[11px] font-extrabold text-[#0B1E36] leading-none">246</div>
              <div className="text-[7.5px] font-semibold text-[#16A34A] mt-0.5">↑ 8% <span className="font-normal text-[#64748B]">vs last month</span></div>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="bg-white/75 rounded-xl p-1.5 border border-white/90 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-md bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center flex-shrink-0">
                <Wallet className="w-2.5 h-2.5 text-[#92400E]" />
              </div>
              <span className="text-[8.5px] font-medium text-[#64748B] truncate">Outstanding</span>
            </div>
            <div className="mt-1">
              <div className="text-[11px] font-extrabold text-[#0B1E36] leading-none">₹ 3,42,000</div>
              <div className="text-[7.5px] font-semibold text-[#DC2626] mt-0.5">↑ 5% <span className="font-normal text-[#64748B]">vs last month</span></div>
            </div>
          </div>

          {/* KPI 4 */}
          <div className="bg-white/75 rounded-xl p-1.5 border border-white/90 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-md bg-[#FEF9C3] border border-[#FEF08A] flex items-center justify-center flex-shrink-0">
                <Users2 className="w-2.5 h-2.5 text-[#A16207]" />
              </div>
              <span className="text-[7.5px] font-medium text-[#64748B] whitespace-nowrap">Active Customers</span>
            </div>
            <div className="mt-1">
              <div className="text-[11px] font-extrabold text-[#0B1E36] leading-none">186</div>
              <div className="text-[7.5px] font-semibold text-[#16A34A] mt-0.5">↑ 14% <span className="font-normal text-[#64748B]">vs last month</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Split Section: Sales Overview & Quick Actions + Tasks */}
      <div className="grid grid-cols-12 gap-2 mt-0.5">
        {/* Left: Sales Overview Card */}
        <div className="col-span-12 sm:col-span-7 bg-white/75 rounded-xl p-2.5 border border-white/90 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#0B1E36]">Sales Overview</span>
            <div className="flex items-center gap-1 bg-white/80 px-1.5 py-0.5 rounded-full text-[8.5px] text-[#0B1E36] border border-white/90">
              <span>This Month</span>
              <ChevronDown className="w-2 h-2 text-[#64748B]" />
            </div>
          </div>

          <div className="flex items-baseline justify-between my-1">
            <div className="flex items-baseline gap-1">
              <span className="text-[16px] font-extrabold text-[#0B1E36]">₹ 12.48L</span>
              <span className="text-[8.5px] font-bold text-[#16A34A]">↑ 12% vs last month</span>
            </div>
            <div className="text-right text-[7.5px] text-[#64748B] font-medium">
              Steady growth. Stronger tomorrow.
            </div>
          </div>

          {/* Mini Spline SVG Line Chart */}
          <div className="relative w-full h-[65px] select-none">
            <svg viewBox="0 0 300 70" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="previewSalesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 10 58 C 40 50, 60 48, 80 48 C 110 48, 130 38, 150 35 C 170 32, 190 40, 210 38 C 240 32, 260 22, 290 18 L 290 65 L 10 65 Z"
                fill="url(#previewSalesGrad)"
              />
              <path
                d="M 10 58 C 40 50, 60 48, 80 48 C 110 48, 130 38, 150 35 C 170 32, 190 40, 210 38 C 240 32, 260 22, 290 18"
                fill="none"
                stroke="#1E3A8A"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Active data point on 15 Sep */}
              <circle cx="150" cy="35" r="3" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
              {/* Tooltip Tag */}
              <g transform="translate(130, 16)">
                <rect width="40" height="13" rx="3" fill="#0B1E36" />
                <text x="20" y="9.5" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">
                  ₹ 2,48,000
                </text>
              </g>
            </svg>
            <div className="flex justify-between text-[7.5px] font-semibold text-[#64748B] pt-0.5">
              <span>1 Sep</span>
              <span>7 Sep</span>
              <span className="text-[#102B4E]">15 Sep</span>
              <span>23 Sep</span>
              <span>30 Sep</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Actions & Things to Do */}
        <div className="col-span-12 sm:col-span-5 flex flex-col gap-1.5">
          {/* Quick Actions (2x2 grid with top icon) */}
          <div className="bg-white/75 rounded-xl p-2 border border-white/90 shadow-2xs">
            <span className="text-[9.5px] font-bold text-[#0B1E36] block mb-1">Quick Actions</span>
            <div className="grid grid-cols-2 gap-1 text-[8.5px] font-bold text-[#1B2A4A]">
              <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-gradient-to-b from-[#FFFDF9] to-[#FEF3C7]/80 border border-[#FDE68A]/70 text-center">
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#B47E28] mb-0.5" />
                <span className="truncate">Create Invoice</span>
              </div>
              <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-gradient-to-b from-[#F8FAFC] to-[#E0F2FE]/80 border border-[#BAE6FD]/70 text-center">
                <UserPlus className="w-3.5 h-3.5 text-[#0284C7] mb-0.5" />
                <span className="truncate">Add Customer</span>
              </div>
              <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-gradient-to-b from-[#FAF5FF] to-[#F3E8FF]/80 border border-[#E9D5FF]/70 text-center">
                <Receipt className="w-3.5 h-3.5 text-[#7C3AED] mb-0.5" />
                <span className="truncate">Record Expense</span>
              </div>
              <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-gradient-to-b from-[#F0FDF4] to-[#DCFCE7]/80 border border-[#BBF7D0]/70 text-center">
                <CalendarDays className="w-3.5 h-3.5 text-[#059669] mb-0.5" />
                <span className="truncate">Approve Leave</span>
              </div>
            </div>
          </div>

          {/* Things to Do */}
          <div className="bg-white/75 rounded-xl p-2 border border-white/90 shadow-2xs">
            <span className="text-[9.5px] font-bold text-[#0B1E36] block mb-1">Things to Do</span>
            <div className="space-y-1 text-[8.5px]">
              <div className="flex items-center justify-between gap-1 text-[#0B1E36]">
                <div className="flex items-center gap-1.5 truncate">
                  <div className="w-3 h-3 rounded-[3px] bg-[#2563EB] flex items-center justify-center flex-shrink-0">
                    <Check className="w-2 h-2 text-white stroke-[3]" />
                  </div>
                  <span className="truncate font-semibold">Approve purchase request</span>
                </div>
                <span className="text-[8px] text-[#EF4444] font-bold">Today</span>
              </div>
              <div className="flex items-center justify-between gap-1 text-[#0B1E36]">
                <div className="flex items-center gap-1.5 truncate">
                  <div className="w-3 h-3 rounded-[3px] bg-[#2563EB] flex items-center justify-center flex-shrink-0">
                    <Check className="w-2 h-2 text-white stroke-[3]" />
                  </div>
                  <span className="truncate font-semibold">Review pending quotations</span>
                </div>
                <span className="text-[8px] text-[#EF4444] font-bold">Today</span>
              </div>
              <div className="flex items-center justify-between gap-1 text-[#0B1E36]">
                <div className="flex items-center gap-1.5 truncate">
                  <div className="w-3 h-3 rounded-[3px] border border-slate-300 flex-shrink-0 bg-transparent" />
                  <span className="truncate font-medium">Check outstanding payments</span>
                </div>
                <span className="text-[8px] text-[#D97706] font-bold">Tomorrow</span>
              </div>
              <div className="flex items-center justify-between gap-1 text-[#0B1E36]">
                <div className="flex items-center gap-1.5 truncate">
                  <div className="w-3 h-3 rounded-[3px] border border-slate-300 flex-shrink-0 bg-transparent" />
                  <span className="truncate font-medium">Review monthly expenses</span>
                </div>
                <span className="text-[8px] text-[#64748B] font-medium">In 2 days</span>
              </div>
              <div className="flex items-center justify-between gap-1 text-[#0B1E36]">
                <div className="flex items-center gap-1.5 truncate">
                  <div className="w-3 h-3 rounded-[3px] border border-slate-300 flex-shrink-0 bg-transparent" />
                  <span className="truncate font-medium">Plan Diwali campaign</span>
                </div>
                <span className="text-[8px] text-[#64748B] font-medium">In 3 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
