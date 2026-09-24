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
  Zap,
  CheckSquare,
  ArrowRight,
  UserPlus,
  Receipt,
  Calendar,
  Check,
  MoreHorizontal
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

  // Things to Do checklist state
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Approve purchase request', due: 'Today', dueColor: 'text-rose-500 bg-rose-50/80', completed: true },
    { id: 2, text: 'Review pending quotations', due: 'Today', dueColor: 'text-rose-500 bg-rose-50/80', completed: true },
    { id: 3, text: 'Check outstanding payments', due: 'Tomorrow', dueColor: 'text-amber-600 bg-amber-50/80', completed: false },
    { id: 4, text: 'Review monthly expenses', due: 'In 2 days', dueColor: 'text-gray-500 bg-gray-100/70', completed: false },
    { id: 5, text: 'Plan Diwali campaign', due: 'In 3 days', dueColor: 'text-gray-500 bg-gray-100/70', completed: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Sales Chart Data Points (smooth curve)
  const chartPoints = [
    { date: '1 Sep', val: '₹ 1,10,000', x: 20, y: 155 },
    { date: '4 Sep', val: '₹ 1,75,000', x: 70, y: 135 },
    { date: '7 Sep', val: '₹ 1,60,000', x: 125, y: 145 },
    { date: '11 Sep', val: '₹ 2,15,000', x: 180, y: 120 },
    { date: '15 Sep', val: '₹ 2,48,000', x: 235, y: 105, isDefault: true },
    { date: '19 Sep', val: '₹ 2,30,000', x: 290, y: 115 },
    { date: '23 Sep', val: '₹ 2,85,000', x: 345, y: 92 },
    { date: '27 Sep', val: '₹ 3,10,000', x: 400, y: 82 },
    { date: '30 Sep', val: '₹ 3,65,000', x: 450, y: 68 },
  ];

  // Default active tooltip point is 15 Sep as in reference image
  const activeTooltip = hoveredPoint || chartPoints[4];

  return (
    <div className="relative w-full max-w-[820px] transition-transform duration-500 group select-none">
      {/* 3D Glass Dashboard Main Slab */}
      <div className="relative vision-glass-container rounded-[26px] md:rounded-[30px] p-4 sm:p-5 md:p-6 shadow-2xl border border-white/80 overflow-hidden backdrop-blur-2xl">
        
        {/* Specular Diagonal Light Sheen */}
        <div className="absolute -inset-full w-[250%] h-[250%] glass-shine opacity-60 pointer-events-none transform -rotate-12 translate-x-12 -translate-y-24"></div>
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90 pointer-events-none"></div>

        {/* ========================================================== */}
        {/* 1. TOP HEADER BAR (SINGLE CLEAN HORIZONTAL ROW) */}
        {/* ========================================================== */}
        <div className="relative flex items-center justify-between gap-2 pb-3.5 border-b border-[#102B4E]/10">
          
          {/* Left: GrowNova Logo */}
          <div className="flex-shrink-0">
            <GrowNovaLogo size="sm" showSubtitle={true} />
          </div>

          {/* Center-Left: Navigation Tabs Pill */}
          <div className="hidden md:flex items-center gap-0.5 bg-white/45 backdrop-blur-md p-1 rounded-full border border-white/70 shadow-2xs">
            <button
              onClick={() => setActiveTab('Home')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-semibold transition-all duration-200 ${
                activeTab === 'Home'
                  ? 'bg-[#F4EAD4]/90 text-[#102B4E] shadow-2xs border border-[#B88932]/30'
                  : 'text-[#102B4E]/70 hover:text-[#102B4E] hover:bg-white/40'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-[#B88932]" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab('CRM')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-medium transition-all duration-200 ${
                activeTab === 'CRM'
                  ? 'bg-[#F4EAD4]/90 text-[#102B4E] shadow-2xs'
                  : 'text-[#102B4E]/70 hover:text-[#102B4E] hover:bg-white/40'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#102B4E]/70" />
              <span>CRM</span>
            </button>

            <button
              onClick={() => setActiveTab('Accounting')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-medium transition-all duration-200 ${
                activeTab === 'Accounting'
                  ? 'bg-[#F4EAD4]/90 text-[#102B4E] shadow-2xs'
                  : 'text-[#102B4E]/70 hover:text-[#102B4E] hover:bg-white/40'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#102B4E]/70" />
              <span>Accounting</span>
            </button>

            <button
              onClick={() => setActiveTab('HR')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-medium transition-all duration-200 ${
                activeTab === 'HR'
                  ? 'bg-[#F4EAD4]/90 text-[#102B4E] shadow-2xs'
                  : 'text-[#102B4E]/70 hover:text-[#102B4E] hover:bg-white/40'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-[#102B4E]/70" />
              <span>HR</span>
            </button>

            <button
              onClick={() => setActiveTab('Reports')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-medium transition-all duration-200 ${
                activeTab === 'Reports'
                  ? 'bg-[#F4EAD4]/90 text-[#102B4E] shadow-2xs'
                  : 'text-[#102B4E]/70 hover:text-[#102B4E] hover:bg-white/40'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-[#102B4E]/70" />
              <span>Reports</span>
            </button>
          </div>

          {/* Right Header Actions: Search, Notification, Profile */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Search Pill Input */}
            <div className="flex items-center gap-1.5 bg-white/50 backdrop-blur-sm border border-white/70 rounded-full px-2.5 py-1 text-xs text-[#102B4E]/70 hover:bg-white/70 transition-colors cursor-pointer shadow-2xs">
              <Search className="w-3.5 h-3.5 text-[#102B4E]/60" />
              <span className="hidden sm:inline text-[11.5px] pr-1.5 text-[#102B4E]/70">Search or ask...</span>
              <span className="text-[10px] bg-white/70 px-1 py-0.2 rounded text-[#102B4E]/60 border border-white/80 font-mono font-medium">⌘ K</span>
            </div>

            {/* Notification Bell */}
            <div className="relative p-1.5 rounded-full bg-white/45 hover:bg-white/70 border border-white/70 transition-colors cursor-pointer">
              <Bell className="w-3.5 h-3.5 text-[#102B4E]" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-rose-500 rounded-full ring-1 ring-white"></span>
            </div>

            {/* User Profile Chip */}
            <div className="flex items-center gap-1.5 pl-1 pr-2 py-0.5 rounded-full bg-white/45 hover:bg-white/70 border border-white/70 transition-colors cursor-pointer">
              <img
                src="/ravi_avatar_hq.jpg"
                alt="Ravi"
                className="w-6 h-6 rounded-full object-cover ring-1 ring-white shadow-2xs"
              />
              <div className="flex flex-col text-left leading-none">
                <span className="text-[11.5px] font-bold text-[#102B4E]">Ravi</span>
                <span className="text-[9.5px] text-[#55677D]">Owner</span>
              </div>
              <ChevronDown className="w-3 h-3 text-[#102B4E]/60 ml-0.5" />
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* 2. DASHBOARD GREETING & KPI ROW */}
        {/* ========================================================== */}
        <div className="flex flex-col lg:flex-row items-stretch gap-3 py-3">
          
          {/* Greeting Column */}
          <div className="w-full lg:w-[155px] flex-shrink-0 flex flex-col justify-center">
            <span className="text-[11px] font-bold text-[#475569] tracking-wide mb-0.5">
              Mon, 5 September 2025
            </span>
            <div className="font-serif leading-[1.12]">
              <span className="text-[20px] font-semibold text-[#0B1E36] block">
                Good morning,
              </span>
              <span className="text-[22px] font-bold radiant-gold-text block">
                Ravi
              </span>
            </div>
            <div className="text-[11px] font-medium text-[#475569] mt-1 leading-tight">
              <span>Your business.</span>
              <br />
              <span>In better hands.</span>
            </div>
          </div>

          {/* 4 KPI Cards in Horizontal Row */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* KPI 1: Total Sales */}
            <div className="vision-card-glass rounded-2xl p-2.5 flex flex-col justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-amber-100/70 border border-amber-200/60 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-3.5 h-3.5 text-[#B88932]" />
                </div>
                <span className="text-[11px] font-medium text-[#55677D] whitespace-nowrap">Total Sales</span>
              </div>
              <div className="mt-1">
                <div className="text-[15px] font-bold text-[#102B4E] leading-tight">
                  ₹ 12,48,000
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[9.5px] font-semibold text-emerald-600 flex items-center gap-0.5">
                    ↑ 12% <span className="font-normal text-gray-400 text-[8.5px]">vs last month</span>
                  </span>
                  <svg className="w-7 h-2.5 text-emerald-500 overflow-visible" viewBox="0 0 32 12" fill="none">
                    <path d="M1 10L9 8L17 5L24 7L31 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* KPI 2: Total Orders */}
            <div className="vision-card-glass rounded-2xl p-2.5 flex flex-col justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-orange-100/70 border border-orange-200/60 flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <span className="text-[11px] font-medium text-[#55677D] whitespace-nowrap">Total Orders</span>
              </div>
              <div className="mt-1">
                <div className="text-[15px] font-bold text-[#102B4E] leading-tight">
                  246
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[9.5px] font-semibold text-emerald-600 flex items-center gap-0.5">
                    ↑ 8% <span className="font-normal text-gray-400 text-[8.5px]">vs last month</span>
                  </span>
                  <svg className="w-7 h-2.5 text-amber-500 overflow-visible" viewBox="0 0 32 12" fill="none">
                    <path d="M1 11L8 9L16 6L23 8L31 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* KPI 3: Outstanding */}
            <div className="vision-card-glass rounded-2xl p-2.5 flex flex-col justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-amber-200/50 border border-amber-300/50 flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-3.5 h-3.5 text-[#B88932]" />
                </div>
                <span className="text-[11px] font-medium text-[#55677D] whitespace-nowrap">Outstanding</span>
              </div>
              <div className="mt-1">
                <div className="text-[15px] font-bold text-[#102B4E] leading-tight">
                  ₹ 3,42,000
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[9.5px] font-semibold text-rose-500 flex items-center gap-0.5">
                    ↑ 5% <span className="font-normal text-gray-400 text-[8.5px]">vs last month</span>
                  </span>
                  <svg className="w-7 h-2.5 text-rose-500 overflow-visible" viewBox="0 0 32 12" fill="none">
                    <path d="M1 10L10 8L18 9L25 5L31 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* KPI 4: Active Customers */}
            <div className="vision-card-glass rounded-2xl p-2.5 flex flex-col justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-orange-100/60 border border-orange-200/50 flex items-center justify-center flex-shrink-0">
                  <Users2 className="w-3.5 h-3.5 text-amber-700" />
                </div>
                <span className="text-[11px] font-medium text-[#55677D] whitespace-nowrap">Active Customers</span>
              </div>
              <div className="mt-1">
                <div className="text-[15px] font-bold text-[#102B4E] leading-tight">
                  186
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[9.5px] font-semibold text-emerald-600 flex items-center gap-0.5">
                    ↑ 14% <span className="font-normal text-gray-400 text-[8.5px]">vs last month</span>
                  </span>
                  <svg className="w-7 h-2.5 text-emerald-500 overflow-visible" viewBox="0 0 32 12" fill="none">
                    <path d="M1 11L9 9L17 7L24 5L31 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* 3. MAIN DASHBOARD BODY: SALES OVERVIEW + QUICK ACTIONS / TASKS */}
        {/* ========================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 mt-1">
          
          {/* Left Column (~65% width): Sales Overview Panel */}
          <div className="lg:col-span-7 vision-card-glass rounded-2xl p-4 flex flex-col justify-between">
            
            {/* Header: Title & Timeframe Selector */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#B88932]" />
                <span className="text-[13.5px] font-bold text-[#102B4E]">Sales Overview</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Timeframe Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsTimeframeOpen(!isTimeframeOpen)}
                    className="flex items-center gap-1.5 bg-white/60 hover:bg-white/80 border border-white/80 rounded-full px-2.5 py-1 text-[11px] font-medium text-[#102B4E] transition-colors shadow-2xs"
                  >
                    <span>{timeframe}</span>
                    <ChevronDown className="w-3 h-3 text-[#102B4E]/60" />
                  </button>
                  {isTimeframeOpen && (
                    <div className="absolute right-0 top-full mt-1 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/80 py-1 w-28 z-30 text-[11px]">
                      {['This Month', 'Last Month', 'Q3 FY25', 'This Year'].map(t => (
                        <div
                          key={t}
                          onClick={() => {
                            setTimeframe(t);
                            setIsTimeframeOpen(false);
                          }}
                          className="px-3 py-1.5 hover:bg-[#F4EAD4]/50 cursor-pointer text-[#102B4E]"
                        >
                          {t}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Maximize Button */}
                <button className="p-1 rounded-lg bg-white/50 hover:bg-white/80 border border-white/70 text-[#102B4E]/70 transition-colors">
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="flex items-baseline justify-between mt-1 mb-2">
              <div>
                <span className="text-[24px] sm:text-[26px] font-extrabold text-[#102B4E] tracking-tight">
                  ₹ 12.48L
                </span>
                <span className="ml-2 text-[11px] font-semibold text-emerald-600">
                  ↑ 12% <span className="font-normal text-[#55677D] text-[10px]">vs last month</span>
                </span>
              </div>
              <div className="text-right hidden sm:block">
                <span className="text-[11px] font-medium text-[#55677D] block leading-tight">
                  Steady growth.
                </span>
                <span className="text-[11px] font-medium text-[#55677D] block leading-tight">
                  Stronger tomorrow.
                </span>
              </div>
            </div>

            {/* Main Interactive SVG Chart */}
            <div className="relative w-full h-[155px] mt-1 select-none">
              
              {/* Y-Axis Grid & Labels */}
              <div className="absolute inset-0 flex flex-col justify-between text-[9px] text-[#55677D]/70 pointer-events-none pr-2">
                <div className="flex items-center">
                  <span className="w-6">20L</span>
                  <div className="w-full h-[1px] bg-[#102B4E]/8 ml-1"></div>
                </div>
                <div className="flex items-center">
                  <span className="w-6">15L</span>
                  <div className="w-full h-[1px] bg-[#102B4E]/8 ml-1"></div>
                </div>
                <div className="flex items-center">
                  <span className="w-6">10L</span>
                  <div className="w-full h-[1px] bg-[#102B4E]/8 ml-1"></div>
                </div>
                <div className="flex items-center">
                  <span className="w-6">5L</span>
                  <div className="w-full h-[1px] bg-[#102B4E]/8 ml-1"></div>
                </div>
                <div className="flex items-center">
                  <span className="w-6">0</span>
                  <div className="w-full h-[1px] bg-[#102B4E]/8 ml-1"></div>
                </div>
              </div>

              {/* Chart SVG Graphic */}
              <svg
                viewBox="0 0 480 170"
                className="w-full h-full overflow-visible pl-7 pb-4"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Subtle Navy-to-transparent area gradient */}
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#102B4E" stopOpacity="0.22" />
                    <stop offset="40%" stopColor="#102B4E" stopOpacity="0.10" />
                    <stop offset="100%" stopColor="#102B4E" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Filled Area */}
                <path
                  d="M 20 155 
                     C 50 145, 60 135, 70 135 
                     C 90 135, 110 145, 125 145 
                     C 150 145, 160 120, 180 120 
                     C 200 120, 220 105, 235 105 
                     C 260 105, 275 118, 290 115 
                     C 315 110, 330 92, 345 92 
                     C 370 92, 385 82, 400 82 
                     C 420 82, 435 68, 450 68 
                     L 450 160 L 20 160 Z"
                  fill="url(#salesGradient)"
                />

                {/* Navy Main Spline Curve */}
                <path
                  d="M 20 155 
                     C 50 145, 60 135, 70 135 
                     C 90 135, 110 145, 125 145 
                     C 150 145, 160 120, 180 120 
                     C 200 120, 220 105, 235 105 
                     C 260 105, 275 118, 290 115 
                     C 315 110, 330 92, 345 92 
                     C 370 92, 385 82, 400 82 
                     C 420 82, 435 68, 450 68"
                  fill="none"
                  stroke="#102B4E"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Interactive Anchor points */}
                {chartPoints.map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r={activeTooltip.x === pt.x ? 5 : 3}
                    className="cursor-pointer transition-all duration-200"
                    fill={activeTooltip.x === pt.x ? '#2563EB' : 'white'}
                    stroke={activeTooltip.x === pt.x ? '#FFFFFF' : '#102B4E'}
                    strokeWidth={activeTooltip.x === pt.x ? 2.5 : 1.5}
                    onMouseEnter={() => setHoveredPoint(pt)}
                  />
                ))}

                {/* Dashed Guideline to Selected Point */}
                <line
                  x1={activeTooltip.x}
                  y1={activeTooltip.y}
                  x2={activeTooltip.x}
                  y2="160"
                  stroke="#102B4E"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                  opacity="0.45"
                />
              </svg>

              {/* Tooltip Overlay Badge (₹ 2,48,000 on 15 Sep) */}
              <div
                className="absolute z-20 pointer-events-none transition-all duration-200"
                style={{
                  left: `calc(${(activeTooltip.x / 480) * 100}% + 14px)`,
                  top: `calc(${(activeTooltip.y / 170) * 100}% - 34px)`,
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="bg-[#0B1E36] text-white px-2.5 py-1 rounded-md text-[11px] font-bold shadow-xl flex items-center gap-1 border border-white/30 whitespace-nowrap">
                  <span>{activeTooltip.val}</span>
                </div>
              </div>

              {/* X-Axis Dates */}
              <div className="absolute bottom-0 left-7 right-3 flex justify-between text-[9.5px] text-[#475569] font-semibold pt-1">
                <span>1 Sep</span>
                <span>7 Sep</span>
                <span>15 Sep</span>
                <span>23 Sep</span>
                <span>30 Sep</span>
              </div>
            </div>
          </div>

          {/* Right Column (~35% width): Stacked Quick Actions & Things to Do */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            
            {/* Quick Actions Card */}
            <div className="vision-card-glass rounded-2xl p-3.5">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#C2831E] fill-[#C2831E]" />
                  <span className="text-[13px] font-extrabold text-[#0B1E36]">Quick Actions</span>
                </div>
                <MoreHorizontal className="w-3.5 h-3.5 text-gray-400" />
              </div>

              {/* 2x2 Grid of Actions */}
              <div className="grid grid-cols-2 gap-2">
                {/* 1. Create Invoice */}
                <button
                  onClick={() => onActionClick?.('Create Invoice')}
                  className="p-2.5 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/90 hover:from-amber-100 hover:to-amber-200/90 border border-amber-300/80 shadow-2xs flex flex-col items-center justify-center text-center transition-all duration-200 hover:scale-[1.02] active:scale-95 group focus:outline-none"
                >
                  <FileText className="w-4 h-4 text-[#B57716] mb-1 group-hover:scale-110 transition-transform stroke-[2.2]" />
                  <span className="text-[11.5px] font-extrabold text-[#0B1E36] leading-tight">Create Invoice</span>
                </button>

                {/* 2. Add Customer */}
                <button
                  onClick={() => onActionClick?.('Add Customer')}
                  className="p-2.5 rounded-xl bg-gradient-to-br from-sky-50 to-sky-100/90 hover:from-sky-100 hover:to-sky-200/90 border border-sky-300/80 shadow-2xs flex flex-col items-center justify-center text-center transition-all duration-200 hover:scale-[1.02] active:scale-95 group focus:outline-none"
                >
                  <UserPlus className="w-4 h-4 text-sky-700 mb-1 group-hover:scale-110 transition-transform stroke-[2.2]" />
                  <span className="text-[11.5px] font-extrabold text-[#0B1E36] leading-tight">Add Customer</span>
                </button>

                {/* 3. Record Expense */}
                <button
                  onClick={() => onActionClick?.('Record Expense')}
                  className="p-2.5 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/90 hover:from-purple-100 hover:to-purple-200/90 border border-purple-300/80 shadow-2xs flex flex-col items-center justify-center text-center transition-all duration-200 hover:scale-[1.02] active:scale-95 group focus:outline-none"
                >
                  <Receipt className="w-4 h-4 text-purple-700 mb-1 group-hover:scale-110 transition-transform stroke-[2.2]" />
                  <span className="text-[11.5px] font-extrabold text-[#0B1E36] leading-tight">Record Expense</span>
                </button>

                {/* 4. Approve Leave */}
                <button
                  onClick={() => onActionClick?.('Approve Leave')}
                  className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/90 hover:from-emerald-100 hover:to-emerald-200/90 border border-emerald-300/80 shadow-2xs flex flex-col items-center justify-center text-center transition-all duration-200 hover:scale-[1.02] active:scale-95 group focus:outline-none"
                >
                  <Calendar className="w-4 h-4 text-emerald-700 mb-1 group-hover:scale-110 transition-transform stroke-[2.2]" />
                  <span className="text-[11.5px] font-extrabold text-[#0B1E36] leading-tight">Approve Leave</span>
                </button>
              </div>
            </div>

            {/* Things to Do Card */}
            <div className="vision-card-glass rounded-2xl p-3.5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-[#0B1E36]" />
                  <span className="text-[13px] font-extrabold text-[#0B1E36]">Things to Do</span>
                </div>
                <button className="w-5 h-5 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3 h-3 text-[#0B1E36] stroke-[2.5]" />
                </button>
              </div>

              {/* Task Checklist */}
              <div className="flex flex-col gap-1.5">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="flex items-center justify-between py-1 px-1.5 rounded-lg hover:bg-white/80 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-colors ${
                          task.completed
                            ? 'bg-[#1D4ED8] text-white shadow-2xs'
                            : 'border-1.5 border-gray-400 bg-white group-hover:border-[#0B1E36]'
                        }`}
                      >
                        {task.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span
                        className={`text-[11.5px] truncate transition-colors ${
                          task.completed ? 'text-[#0B1E36] font-semibold' : 'text-[#1E293B] font-medium'
                        }`}
                      >
                        {task.text}
                      </span>
                    </div>
                    <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-md border ${
                      task.due === 'Today'
                        ? 'text-rose-600 bg-rose-50 border-rose-200'
                        : task.due === 'Tomorrow'
                        ? 'text-amber-700 bg-amber-50 border-amber-200'
                        : 'text-slate-600 bg-slate-50 border-slate-200'
                    }`}>
                      {task.due}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Desk Ground Reflection of Dashboard Bottom Edge */}
      <div 
        className="w-[94%] mx-auto h-6 rounded-b-[30px] opacity-40 blur-[4px] pointer-events-none -mt-2 bg-gradient-to-b from-white/40 via-white/10 to-transparent"
        style={{
          transform: 'scaleY(-0.4) perspective(500px) rotateX(45deg)',
        }}
      ></div>
    </div>
  );
};
