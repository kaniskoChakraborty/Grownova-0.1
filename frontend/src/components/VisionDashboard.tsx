import { useState } from 'react';
import { GrowNovaLogo } from './GrowNovaLogo';
import {
  Home,
  Users,
  FileText,
  UserCheck,
  Shield,
  Search,
  Bell,
  ChevronDown,
  BarChart3,
  ShoppingCart,
  Wallet,
  Users2,
  Maximize2,
  FileSpreadsheet,
  UserPlus,
  Receipt,
  CalendarDays,
  Check,
  ArrowRight,
  Zap
} from 'lucide-react';

interface VisionDashboardProps {
  onActionClick?: (actionName: string) => void;
}

export const VisionDashboard = ({
  onActionClick,
}: VisionDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'Home' | 'CRM' | 'Accounting' | 'HR' | 'Reports'>('Home');
  const [timeframe, setTimeframe] = useState('This Month');
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; val: string; date: string } | null>(null);

  // Things to Do checklist state matching the reference image exactly
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Approve purchase request', due: 'Today', dueColor: 'text-[#EF4444]', completed: true },
    { id: 2, text: 'Review pending quotations', due: 'Today', dueColor: 'text-[#EF4444]', completed: true },
    { id: 3, text: 'Check outstanding payments', due: 'Tomorrow', dueColor: 'text-[#D97706]', completed: false },
    { id: 4, text: 'Review monthly expenses', due: 'In 2 days', dueColor: 'text-[#64748B]', completed: false },
    { id: 5, text: 'Plan Diwali campaign', due: 'In 3 days', dueColor: 'text-[#64748B]', completed: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Sales Chart Data Points (smooth wave spline)
  const chartPoints = [
    { date: '1 Sep', val: '₹ 1,10,000', x: 25, y: 142 },
    { date: '7 Sep', val: '₹ 1,60,000', x: 125, y: 135 },
    { date: '15 Sep', val: '₹ 2,48,000', x: 235, y: 102, isDefault: true },
    { date: '23 Sep', val: '₹ 2,85,000', x: 345, y: 88 },
    { date: '30 Sep', val: '₹ 3,65,000', x: 450, y: 64 },
  ];

  const activeTooltip = hoveredPoint || chartPoints[2];

  return (
    <div className="relative w-full max-w-[890px] transition-transform duration-500 group select-none">
      {/* Ambient VisionOS Golden Rim Glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-white/50 via-white/20 to-[#C2831E]/25 rounded-[44px] blur-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

      {/* 3D Glass Dashboard Main Slab with Authentic Apple VisionOS Liquid Translucency */}
      <div 
        className="relative rounded-[30px] sm:rounded-[34px] p-4 sm:p-5 md:p-5.5 shadow-[0_32px_70px_-15px_rgba(11,30,54,0.22),0_10px_24px_-6px_rgba(194,131,30,0.12),inset_0_2px_3px_0_rgba(255,255,255,0.95),inset_0_-2px_3px_0_rgba(255,255,255,0.4)] border border-white/80 overflow-hidden transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.58) 0%, rgba(255, 255, 255, 0.38) 100%)',
          backdropFilter: 'blur(28px) saturate(175%)',
          WebkitBackdropFilter: 'blur(28px) saturate(175%)',
        }}
      >
        {/* Specular Diagonal Light Sheen */}
        <div className="absolute -inset-full w-[250%] h-[250%] glass-shine opacity-40 pointer-events-none transform -rotate-12 translate-x-12 -translate-y-24"></div>
        {/* Top Rim Specular Highlight Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-95 pointer-events-none"></div>
        {/* Bottom Rim Highlight */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none"></div>

        {/* ========================================================== */}
        {/* 1. TOP HEADER BAR                                          */}
        {/* ========================================================== */}
        <div className="relative flex items-center justify-between gap-1.5 sm:gap-2 pb-3 border-b border-[#102B4E]/10">
          {/* Left: GrowNova Logo */}
          <div className="flex-shrink-0">
            <GrowNovaLogo size="sm" showSubtitle={true} />
          </div>

          {/* Center: Navigation Tabs Capsule Pill */}
          <div className="hidden md:flex items-center gap-0.5 bg-white/60 backdrop-blur-md p-0.5 rounded-full border border-white/85 shadow-2xs">
            <button
              onClick={() => setActiveTab('Home')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'Home'
                  ? 'bg-[#F8EEDD] text-[#102B4E] shadow-2xs border border-[#DEB877]/50'
                  : 'text-[#475569] hover:text-[#102B4E] hover:bg-white/40'
              }`}
            >
              <Home className="w-3 h-3 text-[#B88932]" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab('CRM')}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer ${
                activeTab === 'CRM'
                  ? 'bg-[#F8EEDD] text-[#102B4E] shadow-2xs border border-[#DEB877]/50'
                  : 'text-[#475569] hover:text-[#102B4E] hover:bg-white/40'
              }`}
            >
              <Users className="w-3 h-3 text-[#475569]" />
              <span>CRM</span>
            </button>

            <button
              onClick={() => setActiveTab('Accounting')}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer ${
                activeTab === 'Accounting'
                  ? 'bg-[#F8EEDD] text-[#102B4E] shadow-2xs border border-[#DEB877]/50'
                  : 'text-[#475569] hover:text-[#102B4E] hover:bg-white/40'
              }`}
            >
              <FileText className="w-3 h-3 text-[#475569]" />
              <span>Accounting</span>
            </button>

            <button
              onClick={() => setActiveTab('HR')}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer ${
                activeTab === 'HR'
                  ? 'bg-[#F8EEDD] text-[#102B4E] shadow-2xs border border-[#DEB877]/50'
                  : 'text-[#475569] hover:text-[#102B4E] hover:bg-white/40'
              }`}
            >
              <UserCheck className="w-3 h-3 text-[#475569]" />
              <span>HR</span>
            </button>

            <button
              onClick={() => setActiveTab('Reports')}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer ${
                activeTab === 'Reports'
                  ? 'bg-[#F8EEDD] text-[#102B4E] shadow-2xs border border-[#DEB877]/50'
                  : 'text-[#475569] hover:text-[#102B4E] hover:bg-white/40'
              }`}
            >
              <Shield className="w-3 h-3 text-[#475569]" />
              <span>Reports</span>
            </button>
          </div>

          {/* Right Header Actions: Search, Notification, Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Search Pill Input */}
            <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-md border border-white/85 rounded-full px-2.5 py-1 text-xs text-[#55677D] hover:bg-white/80 transition-colors cursor-pointer shadow-2xs">
              <Search className="w-3 h-3 text-[#55677D]" />
              <span className="hidden sm:inline text-[11px] text-[#55677D]">Search or ask...</span>
              <span className="text-[9px] bg-white/85 px-1 py-0.5 rounded text-[#55677D] border border-white/90 font-mono font-semibold">⌘ K</span>
            </div>

            {/* Notification Bell with red dot */}
            <div className="relative p-1.5 rounded-full bg-white/60 hover:bg-white/85 border border-white/85 transition-colors cursor-pointer shadow-2xs">
              <Bell className="w-3.5 h-3.5 text-[#102B4E]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full ring-1.5 ring-white"></span>
            </div>

            {/* User Profile Chip */}
            <div className="flex items-center gap-1.5 pl-1 pr-2 py-0.5 rounded-full bg-white/60 hover:bg-white/85 border border-white/85 transition-colors cursor-pointer shadow-2xs">
              <img
                src="/ravi_avatar_hq.jpg"
                alt="Ravi"
                className="w-5 h-5 rounded-full object-cover ring-1 ring-white shadow-2xs"
              />
              <div className="flex flex-col text-left leading-none">
                <span className="text-[11px] font-bold text-[#102B4E]">Ravi</span>
                <span className="text-[8.5px] text-[#64748B] font-medium">Owner</span>
              </div>
              <ChevronDown className="w-3 h-3 text-[#64748B]" />
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* 2. DASHBOARD GREETING & 4 KPI CARDS ROW                    */}
        {/* ========================================================== */}
        <div className="flex flex-col lg:flex-row items-stretch gap-3 py-3">
          {/* Greeting Column */}
          <div className="w-full lg:w-[145px] flex-shrink-0 flex flex-col justify-center">
            <span className="text-[10px] font-semibold text-[#64748B] tracking-normal mb-0.5">
              Mon, 5 September 2025
            </span>
            <div className="font-serif leading-[1.12]">
              <span className="text-[20px] font-semibold text-[#0B1E36] block">
                Good morning,
              </span>
              <span className="text-[22px] font-bold text-[#B0782D] block">
                Ravi
              </span>
            </div>
            {/* Amber horizontal underline accent bar under Ravi */}
            <div className="w-5 h-[2px] bg-[#B0782D] rounded-full mt-1 mb-1.5"></div>
            <div className="text-[10px] font-medium text-[#64748B] leading-tight">
              <span>Your business.</span>
              <br />
              <span>In better hands.</span>
            </div>
          </div>

          {/* 4 KPI Cards in Horizontal Row */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* KPI 1: Total Sales */}
            <div className="rounded-2xl p-2.5 flex flex-col justify-between bg-white/75 hover:bg-white/90 backdrop-blur-md border border-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all duration-200 hover:scale-[1.02]">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <BarChart3 className="w-3.5 h-3.5 text-[#B47E28]" />
                </div>
                <span className="text-[10.5px] font-medium text-[#64748B] whitespace-nowrap">Total Sales</span>
              </div>
              <div className="mt-1.5">
                <div className="text-[15.5px] font-extrabold text-[#0B1E36] tracking-tight leading-tight">
                  ₹ 12,48,000
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[9.5px] font-bold text-[#16A34A] flex items-center gap-0.5">
                    ↑ 12% <span className="font-normal text-[#64748B] text-[8.5px]">vs last month</span>
                  </span>
                  <svg className="w-8 h-3 text-[#16A34A] overflow-visible" viewBox="0 0 32 12" fill="none">
                    <path d="M1 10 C 9 8, 14 5, 21 7 C 26 8, 29 4, 31 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* KPI 2: Total Orders */}
            <div className="rounded-2xl p-2.5 flex flex-col justify-between bg-white/75 hover:bg-white/90 backdrop-blur-md border border-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all duration-200 hover:scale-[1.02]">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-[#FFEDD5] border border-[#FED7AA] flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <ShoppingCart className="w-3.5 h-3.5 text-[#C2410C]" />
                </div>
                <span className="text-[10.5px] font-medium text-[#64748B] whitespace-nowrap">Total Orders</span>
              </div>
              <div className="mt-1.5">
                <div className="text-[15.5px] font-extrabold text-[#0B1E36] tracking-tight leading-tight">
                  246
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[9.5px] font-bold text-[#16A34A] flex items-center gap-0.5">
                    ↑ 8% <span className="font-normal text-[#64748B] text-[8.5px]">vs last month</span>
                  </span>
                  <svg className="w-8 h-3 text-[#D97706] overflow-visible" viewBox="0 0 32 12" fill="none">
                    <path d="M1 10 C 8 9, 15 6, 21 8 C 26 9, 29 5, 31 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* KPI 3: Outstanding */}
            <div className="rounded-2xl p-2.5 flex flex-col justify-between bg-white/75 hover:bg-white/90 backdrop-blur-md border border-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all duration-200 hover:scale-[1.02]">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <Wallet className="w-3.5 h-3.5 text-[#92400E]" />
                </div>
                <span className="text-[10.5px] font-medium text-[#64748B] whitespace-nowrap">Outstanding</span>
              </div>
              <div className="mt-1.5">
                <div className="text-[15.5px] font-extrabold text-[#0B1E36] tracking-tight leading-tight">
                  ₹ 3,42,000
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[9.5px] font-bold text-[#DC2626] flex items-center gap-0.5">
                    ↑ 5% <span className="font-normal text-[#64748B] text-[8.5px]">vs last month</span>
                  </span>
                  <svg className="w-8 h-3 text-[#DC2626] overflow-visible" viewBox="0 0 32 12" fill="none">
                    <path d="M1 10 C 8 8, 16 11, 22 6 C 26 4, 29 4, 31 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* KPI 4: Active Customers */}
            <div className="rounded-2xl p-2.5 flex flex-col justify-between bg-white/75 hover:bg-white/90 backdrop-blur-md border border-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all duration-200 hover:scale-[1.02]">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-[#FEF9C3] border border-[#FEF08A] flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <Users2 className="w-3.5 h-3.5 text-[#A16207]" />
                </div>
                <span className="text-[10.5px] font-medium text-[#64748B] whitespace-nowrap">Active Customers</span>
              </div>
              <div className="mt-1.5">
                <div className="text-[15.5px] font-extrabold text-[#0B1E36] tracking-tight leading-tight">
                  186
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[9.5px] font-bold text-[#16A34A] flex items-center gap-0.5">
                    ↑ 14% <span className="font-normal text-[#64748B] text-[8.5px]">vs last month</span>
                  </span>
                  <svg className="w-8 h-3 text-[#16A34A] overflow-visible" viewBox="0 0 32 12" fill="none">
                    <path d="M1 10 C 9 9, 16 7, 22 5 C 26 4, 29 3, 31 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* 3. MAIN DASHBOARD BODY: SALES OVERVIEW + RIGHT COLUMN      */}
        {/* ========================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mt-0.5">
          {/* Left Column (~58%): Sales Overview Card */}
          <div className="lg:col-span-7 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between bg-white/75 hover:bg-white/85 backdrop-blur-md border border-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
            {/* Header: Title & Timeframe */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#B88932]" />
                <span className="text-[13px] font-bold text-[#0B1E36]">Sales Overview</span>
              </div>
              <div className="flex items-center gap-1.5">
                {/* Timeframe Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsTimeframeOpen(!isTimeframeOpen)}
                    className="flex items-center gap-1 bg-white/80 hover:bg-white border border-white rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold text-[#0B1E36] transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>{timeframe}</span>
                    <ChevronDown className="w-3 h-3 text-[#64748B]" />
                  </button>
                  {isTimeframeOpen && (
                    <div className="absolute right-0 top-full mt-1 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/90 py-1 w-32 z-30 text-[11px] font-medium">
                      {['This Month', 'Last Month', 'Q3 FY25', 'This Year'].map(t => (
                        <div
                          key={t}
                          onClick={() => {
                            setTimeframe(t);
                            setIsTimeframeOpen(false);
                          }}
                          className="px-3 py-1.5 hover:bg-[#F8EEDD] cursor-pointer text-[#102B4E]"
                        >
                          {t}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button className="w-6 h-6 rounded-lg bg-white/80 hover:bg-white border border-white flex items-center justify-center text-[#64748B] transition-colors cursor-pointer shadow-2xs">
                  <Maximize2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="flex items-baseline justify-between mt-1 mb-2">
              <div>
                <span className="text-[24px] sm:text-[26px] font-extrabold text-[#0B1E36] tracking-tight">
                  ₹ 12.48L
                </span>
                <span className="ml-2 text-[11px] font-bold text-[#16A34A]">
                  ↑ 12% <span className="font-normal text-[#64748B] text-[10px]">vs last month</span>
                </span>
              </div>
              <div className="text-right hidden sm:block">
                <span className="text-[10.5px] font-medium text-[#64748B] block leading-tight">
                  Steady growth.
                </span>
                <span className="text-[10.5px] font-medium text-[#64748B] block leading-tight">
                  Stronger tomorrow.
                </span>
              </div>
            </div>

            {/* Razor-Sharp SVG Area Wave Chart */}
            <div className="relative w-full h-[155px] mt-1 select-none">
              {/* Y-Axis Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between text-[9px] font-medium text-[#64748B]/70 pointer-events-none pr-2">
                <div className="flex items-center"><span className="w-6">20L</span><div className="w-full h-[1px] bg-[#102B4E]/8 ml-1"></div></div>
                <div className="flex items-center"><span className="w-6">15L</span><div className="w-full h-[1px] bg-[#102B4E]/8 ml-1"></div></div>
                <div className="flex items-center"><span className="w-6">10L</span><div className="w-full h-[1px] bg-[#102B4E]/8 ml-1"></div></div>
                <div className="flex items-center"><span className="w-6">5L</span><div className="w-full h-[1px] bg-[#102B4E]/8 ml-1"></div></div>
                <div className="flex items-center"><span className="w-6">0</span><div className="w-full h-[1px] bg-[#102B4E]/8 ml-1"></div></div>
              </div>

              {/* Chart Graphic */}
              <svg
                viewBox="0 0 480 170"
                className="w-full h-full overflow-visible pl-7 pb-4"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="vectorSalesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
                    <stop offset="65%" stopColor="#2563EB" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Filled Spline Area */}
                <path
                  d="M 25 142 
                     C 60 142, 90 135, 125 135 
                     C 160 135, 195 102, 235 102 
                     C 275 102, 310 88, 345 88 
                     C 385 88, 415 64, 450 64 
                     L 450 160 L 25 160 Z"
                  fill="url(#vectorSalesGradient)"
                />

                {/* Sapphire Navy Spline Curve */}
                <path
                  d="M 25 142 
                     C 60 142, 90 135, 125 135 
                     C 160 135, 195 102, 235 102 
                     C 275 102, 310 88, 345 88 
                     C 385 88, 415 64, 450 64"
                  fill="none"
                  stroke="#1E3A8A"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Interactive Anchor points */}
                {chartPoints.map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPoint?.date === pt.date || pt.isDefault ? 5 : 3.5}
                    fill={hoveredPoint?.date === pt.date || pt.isDefault ? '#2563EB' : '#FFFFFF'}
                    stroke={hoveredPoint?.date === pt.date || pt.isDefault ? '#FFFFFF' : '#1E3A8A'}
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}

                {/* Active Tooltip Tag pointing down to 15 Sep node */}
                {activeTooltip && (
                  <g transform={`translate(${activeTooltip.x - 42}, ${activeTooltip.y - 40})`}>
                    <line x1="42" y1="32" x2="42" y2="40" stroke="#1E3A8A" strokeWidth="1.5" strokeDasharray="2 2" />
                    <rect width="84" height="26" rx="6" fill="#0B1E36" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
                    <text x="42" y="17" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                      {activeTooltip.val}
                    </text>
                  </g>
                )}
              </svg>

              {/* X-Axis Date Labels */}
              <div className="flex justify-between text-[10px] font-semibold text-[#64748B] pl-8 pr-2 pt-1">
                <span>1 Sep</span>
                <span>7 Sep</span>
                <span className="text-[#102B4E] font-bold">15 Sep</span>
                <span>23 Sep</span>
                <span>30 Sep</span>
              </div>
            </div>
          </div>

          {/* Right Column (~42%): Quick Actions + Things to Do */}
          <div className="lg:col-span-5 flex flex-col gap-2.5">
            {/* Quick Actions Panel */}
            <div className="rounded-2xl p-3 bg-white/75 hover:bg-white/85 backdrop-blur-md border border-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-1.5 mb-2">
                <Zap className="w-3.5 h-3.5 text-[#B88932] fill-[#B88932]" />
                <span className="text-[12.5px] font-bold text-[#0B1E36]">Quick Actions</span>
              </div>

              {/* 2x2 Grid of Quick Actions */}
              <div className="grid grid-cols-2 gap-2 text-[10.5px] font-bold text-[#1B2A4A]">
                {/* 1. Create Invoice */}
                <button
                  onClick={() => onActionClick?.('Create Invoice')}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-b from-[#FFFDF9] to-[#FEF3C7]/80 hover:bg-amber-100/90 border border-[#FDE68A]/80 transition-all hover:scale-[1.02] shadow-2xs text-center cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#B47E28] mb-1" />
                  <span className="truncate">Create Invoice</span>
                </button>

                {/* 2. Add Customer */}
                <button
                  onClick={() => onActionClick?.('Add Customer')}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-b from-[#F8FAFC] to-[#E0F2FE]/80 hover:bg-sky-100/90 border border-[#BAE6FD]/80 transition-all hover:scale-[1.02] shadow-2xs text-center cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-[#0284C7] mb-1" />
                  <span className="truncate">Add Customer</span>
                </button>

                {/* 3. Record Expense */}
                <button
                  onClick={() => onActionClick?.('Record Expense')}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-b from-[#FAF5FF] to-[#F3E8FF]/80 hover:bg-purple-100/90 border border-[#E9D5FF]/80 transition-all hover:scale-[1.02] shadow-2xs text-center cursor-pointer"
                >
                  <Receipt className="w-4 h-4 text-[#7C3AED] mb-1" />
                  <span className="truncate">Record Expense</span>
                </button>

                {/* 4. Approve Leave */}
                <button
                  onClick={() => onActionClick?.('Approve Leave')}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-b from-[#F0FDF4] to-[#DCFCE7]/80 hover:bg-emerald-100/90 border border-[#BBF7D0]/80 transition-all hover:scale-[1.02] shadow-2xs text-center cursor-pointer"
                >
                  <CalendarDays className="w-4 h-4 text-[#059669] mb-1" />
                  <span className="truncate">Approve Leave</span>
                </button>
              </div>
            </div>

            {/* Things to Do Panel */}
            <div className="rounded-2xl p-3 bg-white/75 hover:bg-white/85 backdrop-blur-md border border-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12.5px] font-bold text-[#0B1E36]">Things to Do</span>
                <button className="w-5 h-5 rounded-full bg-white/80 border border-white flex items-center justify-center text-[#64748B] hover:text-[#0B1E36] transition-colors cursor-pointer shadow-2xs">
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Tasks List */}
              <div className="space-y-1.5 text-[10.5px] font-medium">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="flex items-center justify-between gap-2 p-0.5 rounded-lg hover:bg-white/50 transition-colors cursor-pointer text-[#0B1E36]"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {task.completed ? (
                        <div className="w-3.5 h-3.5 rounded-[4px] bg-[#2563EB] flex items-center justify-center flex-shrink-0 shadow-2xs">
                          <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-[4px] border-[1.5px] border-slate-300 flex-shrink-0 bg-transparent" />
                      )}
                      <span className="truncate text-[#0B1E36] font-medium">
                        {task.text}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold flex-shrink-0 ${task.dueColor}`}>
                      {task.due}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
