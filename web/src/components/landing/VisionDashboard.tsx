import React from 'react';
import { GrowNovaCompassLogo } from '../GrowNovaCompassLogo';
import {
  Search,
  Bell,
  ChevronDown,
  BarChart3,
  TrendingUp,
  Users2,
  Folder,
  BarChart2,
  Box,
  UserCheck,
  FileText,
  PieChart,
  ShieldCheck,
  Settings,
  Calendar as CalendarIcon
} from 'lucide-react';

interface VisionDashboardProps {
  onActionClick?: (actionName: string) => void;
}

export const VisionDashboard: React.FC<VisionDashboardProps> = ({
  onActionClick,
}) => {

  const apps = [
    { name: 'Billing & GST', icon: FileText, color: '#D97706', path: '/dashboard/accounting' },
    { name: 'Udhari Khata', icon: TrendingUp, color: '#059669', path: '/dashboard/crm' },
    { name: 'Godown Stock', icon: Box, color: '#0284C7', path: '/dashboard/inventory' },
    { name: 'Staff & Pay', icon: UserCheck, color: '#2563EB', path: '/dashboard/hr' },
    { name: 'Bank & UPI', icon: BarChart2, color: '#10B981', path: '/dashboard/accounting' },
    { name: 'Orders / CRM', icon: Users2, color: '#7C3AED', path: '/dashboard/people' },
    { name: 'E-Way Bills', icon: ShieldCheck, color: '#D97706', path: '/dashboard/compliance' },
    { name: 'Daily P&L', icon: PieChart, color: '#0D9488', path: '/dashboard/reports' },
    { name: 'CA Portal', icon: Folder, color: '#2563EB', path: '/dashboard/documents' },
    { name: 'Settings', icon: Settings, color: '#9333EA', path: '/dashboard/settings' },
  ];

  const events = [
    { time: '09:30 AM', title: 'Dispatch 120 Boxes to Surat (E-Way #9821)', team: 'Godown Dispatch', color: '#0284C7' },
    { time: '11:30 AM', title: '₹85,000 WhatsApp UPI Received (Sharma Traders)', team: 'Accounts Auto-Sync', color: '#15803D' },
    { time: '02:30 PM', title: 'CA Rakesh: GSTR-3B Auto-Review Completed', team: 'Compliance Desk', color: '#D97706' },
    { time: '06:00 PM', title: 'Daily Evening Cash & P&L Closing Alert', team: 'Owner WhatsApp', color: '#7C3AED' },
  ];

  return (
    <div className="relative w-full max-w-[820px] transition-transform duration-500 group select-none">
      {/* Ambient Rim Glow with Warm Golden Bloom */}
      <div className="absolute -inset-2.5 bg-gradient-to-tr from-white/70 via-amber-100/35 to-[#C69A43]/25 rounded-[38px] blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* 3D Glass Dashboard Main Slab */}
      <div 
        className="relative rounded-[26px] sm:rounded-[30px] p-3.5 sm:p-4 shadow-[0_28px_65px_-15px_rgba(16,43,78,0.15),0_10px_24px_-6px_rgba(198,154,67,0.08),inset_0_2px_2px_0_rgba(255,255,255,0.95),inset_0_-1.5px_1.5px_0_rgba(255,255,255,0.35)] border border-white/85 overflow-hidden transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.68) 0%, rgba(255, 255, 255, 0.44) 100%)',
          backdropFilter: 'blur(32px) saturate(190%)',
          WebkitBackdropFilter: 'blur(32px) saturate(190%)',
        }}
      >
        {/* Specular Diagonal Light Sheen */}
        <div className="absolute -inset-full w-[250%] h-[250%] glass-shine opacity-35 pointer-events-none transform -rotate-12 translate-x-12 -translate-y-24" />

        {/* 1. TOP HEADER BAR */}
        <div className="relative flex items-center justify-between gap-2 pb-2 mb-2 border-b border-white/75">
          <GrowNovaCompassLogo size="sm" showText={true} />

          {/* Search Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/65 hover:bg-white/85 backdrop-blur-md border border-white/90 shadow-2xs text-xs text-[#102B4E]/75 flex-1 max-w-xs mx-3 transition-colors">
            <Search className="w-3.5 h-3.5 text-[#102B4E]/60 flex-shrink-0" />
            <span className="truncate text-[11px]">Search GSTIN, party, invoice #...</span>
            <kbd className="ml-auto px-1.5 py-0.5 rounded bg-black/5 text-[9px] font-bold">⌘K</kbd>
          </div>

          {/* Right Status */}
          <div className="flex items-center gap-2">
            <div className="relative p-1.5 rounded-full bg-white/65 hover:bg-white/85 backdrop-blur-md border border-white/90 shadow-2xs text-[#102B4E] cursor-pointer">
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#EAB308]" />
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/65 backdrop-blur-md border border-white/90 shadow-2xs cursor-pointer">
              <div className="w-4.5 h-4.5 rounded-full bg-[#0B2340] text-white flex items-center justify-center text-[9.5px] font-bold">
                O
              </div>
              <span className="text-[11.5px] font-semibold text-[#102B4E] hidden sm:inline">Owner Desk</span>
              <ChevronDown className="w-3 h-3 text-[#102B4E]/60" />
            </div>
            <span className="text-[10.5px] font-medium text-[#65758B] hidden md:inline pl-2 border-l border-[#102B4E]/10">
              Live Business Hub
            </span>
          </div>
        </div>

        {/* 2. THREE-PANEL COMPACT WORKSPACE */}
        <div className="space-y-2 sm:space-y-2.5">
          
          {/* Panel 1: Business at a Glance */}
          <div className="p-2.5 sm:p-3 rounded-2xl glass-crystal-card">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#102B4E]/8">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#102B4E]">
                <BarChart3 className="w-3.5 h-3.5 text-[#102B4E]" />
                <span>Today's Business Telemetry</span>
              </div>
              <span className="text-[10.5px] font-medium text-[#102B4E] flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/60 border border-white/80 cursor-pointer">
                This Month <ChevronDown className="w-3 h-3 text-[#65758B]" />
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center sm:text-left">
              <div className="sm:border-r border-[#102B4E]/8 sm:pr-2">
                <div className="text-sm sm:text-base font-bold text-[#102B4E] tracking-tight">₹14.8L</div>
                <div className="text-[9.5px] text-[#65758B]">Sales (May)</div>
                <div className="text-[9.5px] font-bold text-[#15803D] flex items-center gap-0.5 justify-center sm:justify-start">
                  <TrendingUp className="w-3 h-3" /> +18% (₹4.2L Today)
                </div>
              </div>

              <div className="sm:border-r border-[#102B4E]/8 sm:px-2">
                <div className="text-sm sm:text-base font-bold text-[#102B4E] tracking-tight">₹2.4L</div>
                <div className="text-[9.5px] text-[#65758B]">Pending Udhari</div>
                <div className="text-[9.5px] font-bold text-[#D97706] flex items-center gap-0.5 justify-center sm:justify-start">
                  <span>⚡ 8 Auto-Reminded</span>
                </div>
              </div>

              <div className="sm:border-r border-[#102B4E]/8 sm:px-2">
                <div className="text-sm sm:text-base font-bold text-[#102B4E] tracking-tight">100%</div>
                <div className="text-[9.5px] text-[#65758B]">GST Reconciled</div>
                <div className="text-[9.5px] font-bold text-[#15803D] flex items-center gap-0.5 justify-center sm:justify-start">
                  <span>✓ 0 Penalties</span>
                </div>
              </div>

              <div className="sm:pl-2">
                <div className="text-sm sm:text-base font-bold text-[#102B4E] tracking-tight">18 / 18</div>
                <div className="text-[9.5px] text-[#65758B]">Staff on Duty</div>
                <div className="text-[9.5px] font-bold text-[#15803D] flex items-center gap-0.5 justify-center sm:justify-start">
                  <span>✓ Biometric Synced</span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel 2: Your Workspace (10 Tiles in 2 Rows) */}
          <div>
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="text-[10.5px] font-semibold text-[#65758B]">Your Daily Workflows</span>
              <span className="text-[10.5px] font-semibold text-[#102B4E] hover:text-[#C69A43] cursor-pointer">
                All Modules →
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
              {apps.map((app) => {
                const Icon = app.icon;
                return (
                  <button
                    key={app.name}
                    onClick={() => onActionClick?.(app.name)}
                    className="p-1.5 sm:p-2 rounded-xl bg-white/55 hover:bg-white/95 backdrop-blur-md border border-white/80 hover:border-white shadow-[0_2px_8px_rgba(16,43,78,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:shadow-[0_6px_18px_rgba(16,43,78,0.08)] flex flex-col items-center justify-center text-center cursor-pointer group hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mb-0.5 group-hover:scale-110 transition-transform" style={{ color: app.color }} />
                    <span className="text-[9.5px] sm:text-[10.5px] font-semibold text-[#102B4E] truncate max-w-full">
                      {app.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel 3: Calendar & Day Dispatch Agenda */}
          <div className="p-2.5 sm:p-3 rounded-2xl glass-crystal-card">
            <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-[#102B4E]/8 text-xs font-bold text-[#102B4E]">
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-[#102B4E]" />
                <span className="text-[11.5px]">Daily Dispatch & Banking Schedule</span>
              </div>
              <span className="text-[10px] font-normal text-[#65758B]">Today's Live Queue</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-center">
              {/* Mini Month Grid */}
              <div className="text-center text-[10px]">
                <div className="font-bold text-[#102B4E] mb-0.5 text-[10.5px]">May 2025</div>
                <div className="grid grid-cols-7 gap-1 text-[#65758B] text-[9px] font-semibold mb-0.5">
                  <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                </div>
                <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-[9.5px]">
                  <span className="text-[#65758B]/40">28</span><span className="text-[#65758B]/40">29</span><span className="text-[#65758B]/40">30</span>
                  <span>1</span><span>2</span><span>3</span><span>4</span>
                  <span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span>
                  <span>12</span><span>13</span><span>14</span><span>15</span><span>16</span><span>17</span><span>18</span>
                  <span>19</span><span>20</span><span>21</span><span>22</span><span>23</span><span>24</span><span>25</span>
                  <span>26</span><span>27</span><span>28</span><span>29</span>
                  <span className="w-3.5 h-3.5 mx-auto rounded-full bg-[#0B2340] text-white flex items-center justify-center font-bold text-[9px]">30</span>
                  <span>31</span>
                </div>
              </div>

              {/* Agenda Events */}
              <div className="space-y-1 sm:border-l border-[#102B4E]/8 sm:pl-2.5 text-[10.5px]">
                {events.map((ev, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: ev.color }} />
                    <span className="text-[9.5px] text-[#65758B] w-16 flex-shrink-0 tabular-nums">{ev.time}</span>
                    <span className="font-semibold text-[#102B4E] truncate text-[10px]">{ev.title}</span>
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
