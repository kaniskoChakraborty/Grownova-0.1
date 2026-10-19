import React from 'react';
import { GrowNovaCompassLogo } from './GrowNovaCompassLogo';
import {
  Search,
  Bell,
  ChevronDown,
  BarChart3,
  TrendingUp,
  TrendingDown,
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
    { name: 'People', icon: Users2, color: '#2563EB', path: '/dashboard/people' },
    { name: 'Projects', icon: Folder, color: '#0284C7', path: '/dashboard/projects' },
    { name: 'Finance', icon: BarChart2, color: '#059669', path: '/dashboard/accounting' },
    { name: 'Sales & CRM', icon: TrendingUp, color: '#D97706', path: '/dashboard/crm' },
    { name: 'Inventory', icon: Box, color: '#10B981', path: '/dashboard/inventory' },
    { name: 'HR & Payroll', icon: UserCheck, color: '#059669', path: '/dashboard/hr' },
    { name: 'Documents', icon: FileText, color: '#3B82F6', path: '/dashboard/documents' },
    { name: 'Reports', icon: PieChart, color: '#0D9488', path: '/dashboard/reports' },
    { name: 'Compliance', icon: ShieldCheck, color: '#2563EB', path: '/dashboard/compliance' },
    { name: 'Settings', icon: Settings, color: '#9333EA', path: '/dashboard/settings' },
  ];

  const events = [
    { time: '09:30 - 10:00', title: 'Team Stand-up', team: 'Development Team', color: '#2563EB' },
    { time: '11:00 - 12:00', title: 'Client Meeting', team: 'GrowNova Solutions', color: '#15803D' },
    { time: '02:30 - 03:30', title: 'Product Review', team: 'Design Team', color: '#D97706' },
    { time: '04:00 - 04:30', title: 'Follow-up with Leads', team: 'Sales Team', color: '#9333EA' },
  ];

  return (
    <div className="relative w-full max-w-[840px] transition-transform duration-500 group select-none">
      {/* Ambient Rim Glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-white/60 via-white/30 to-[#C69A43]/25 rounded-[38px] blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* 3D Glass Dashboard Main Slab */}
      <div 
        className="relative rounded-[28px] sm:rounded-[32px] p-4 sm:p-5 shadow-[0_30px_70px_-15px_rgba(16,43,78,0.18),0_10px_24px_-6px_rgba(198,154,67,0.10),inset_0_2px_3px_0_rgba(255,255,255,0.95),inset_0_-2px_3px_0_rgba(255,255,255,0.4)] border border-white/90 overflow-hidden transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.65) 100%)',
          backdropFilter: 'blur(30px) saturate(170%)',
          WebkitBackdropFilter: 'blur(30px) saturate(170%)',
        }}
      >
        {/* Specular Diagonal Light Sheen */}
        <div className="absolute -inset-full w-[250%] h-[250%] glass-shine opacity-30 pointer-events-none transform -rotate-12 translate-x-12 -translate-y-24" />

        {/* 1. TOP HEADER BAR */}
        <div className="relative flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#102B4E]/10">
          <GrowNovaCompassLogo size="sm" showText={true} />

          {/* Search Pill */}
          <div className="hidden sm:flex items-center gap-2 gn-search-pill px-3 py-1.5 text-xs text-[#102B4E]/70 flex-1 max-w-xs mx-3">
            <Search className="w-3.5 h-3.5 text-[#102B4E]/60 flex-shrink-0" />
            <span className="truncate text-[11.5px]">Search apps, records...</span>
            <kbd className="ml-auto px-1.5 py-0.5 rounded bg-black/5 text-[9.5px] font-bold">⌘K</kbd>
          </div>

          {/* Right Status */}
          <div className="flex items-center gap-2.5">
            <div className="relative p-1.5 rounded-full hover:bg-white/60 text-[#102B4E]">
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#EAB308]" />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-[#0B2340] text-white flex items-center justify-center text-[10px] font-bold">
                O
              </div>
              <span className="text-xs font-medium text-[#102B4E] hidden sm:inline">owner</span>
              <ChevronDown className="w-3 h-3 text-[#102B4E]/60" />
            </div>
            <span className="text-[11px] font-medium text-[#65758B] hidden md:inline pl-2 border-l border-[#102B4E]/10">
              Fri, 30 May 2025 09:30 AM
            </span>
          </div>
        </div>

        {/* 2. THREE-PANEL COMPACT WORKSPACE */}
        <div className="space-y-3">
          
          {/* Panel 1: Business at a Glance */}
          <div className="p-3.5 rounded-2xl bg-white/75 border border-white/95 shadow-2xs">
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#102B4E]/8">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#102B4E]">
                <BarChart3 className="w-3.5 h-3.5 text-[#102B4E]" />
                <span>Business at a glance</span>
              </div>
              <span className="text-[11px] font-medium text-[#102B4E] flex items-center gap-1">
                This Month <ChevronDown className="w-3 h-3 text-[#65758B]" />
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center sm:text-left">
              <div className="sm:border-r border-[#102B4E]/8 sm:pr-2">
                <div className="text-sm sm:text-base font-bold text-[#102B4E]">₹12.4L</div>
                <div className="text-[10px] text-[#65758B]">Revenue</div>
                <div className="text-[10px] font-bold text-[#15803D] flex items-center gap-0.5 justify-center sm:justify-start">
                  <TrendingUp className="w-3 h-3" /> 18%
                </div>
              </div>

              <div className="sm:border-r border-[#102B4E]/8 sm:px-2">
                <div className="text-sm sm:text-base font-bold text-[#102B4E]">₹3.6L</div>
                <div className="text-[10px] text-[#65758B]">Expenses</div>
                <div className="text-[10px] font-bold text-[#DC2626] flex items-center gap-0.5 justify-center sm:justify-start">
                  <TrendingDown className="w-3 h-3" /> 6%
                </div>
              </div>

              <div className="sm:border-r border-[#102B4E]/8 sm:px-2">
                <div className="text-sm sm:text-base font-bold text-[#102B4E]">24 / 32</div>
                <div className="text-[10px] text-[#65758B]">Tasks Done</div>
                <div className="text-[10px] font-bold text-[#15803D] flex items-center gap-0.5 justify-center sm:justify-start">
                  <TrendingUp className="w-3 h-3" /> 12%
                </div>
              </div>

              <div className="sm:pl-2">
                <div className="text-sm sm:text-base font-bold text-[#102B4E]">3</div>
                <div className="text-[10px] text-[#65758B]">Meetings</div>
                <div className="text-[10px] text-[#65758B]">This Week</div>
              </div>
            </div>
          </div>

          {/* Panel 2: Your Workspace (10 Tiles in 2 Rows) */}
          <div>
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[11px] font-semibold text-[#65758B]">Your Workspace</span>
              <span className="text-[11px] font-semibold text-[#102B4E] hover:text-[#C69A43] cursor-pointer">
                All Apps →
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {apps.map((app) => {
                const Icon = app.icon;
                return (
                  <button
                    key={app.name}
                    onClick={() => onActionClick?.(app.name)}
                    className="gn-app-tile p-2 flex flex-col items-center justify-center text-center cursor-pointer group hover:bg-white transition-all"
                  >
                    <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 mb-1 group-hover:scale-110 transition-transform" style={{ color: app.color }} />
                    <span className="text-[10px] sm:text-[11px] font-semibold text-[#102B4E] truncate max-w-full">
                      {app.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel 3: Calendar & Agenda */}
          <div className="p-3 rounded-2xl bg-white/75 border border-white/95 shadow-2xs">
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#102B4E]/8 text-xs font-bold text-[#102B4E]">
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-[#102B4E]" />
                <span>Calendar</span>
              </div>
              <span className="text-[10.5px] font-normal text-[#65758B]">Today, Fri 30 May 2025</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              {/* Mini Month Grid */}
              <div className="text-center text-[10.5px]">
                <div className="font-bold text-[#102B4E] mb-1">May 2025</div>
                <div className="grid grid-cols-7 gap-1 text-[#65758B] text-[9.5px] font-semibold mb-1">
                  <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-[10px]">
                  <span className="text-[#65758B]/40">28</span><span className="text-[#65758B]/40">29</span><span className="text-[#65758B]/40">30</span>
                  <span>1</span><span>2</span><span>3</span><span>4</span>
                  <span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span>
                  <span>12</span><span>13</span><span>14</span><span>15</span><span>16</span><span>17</span><span>18</span>
                  <span>19</span><span>20</span><span>21</span><span>22</span><span>23</span><span>24</span><span>25</span>
                  <span>26</span><span>27</span><span>28</span><span>29</span>
                  <span className="w-4 h-4 mx-auto rounded-full bg-[#0B2340] text-white flex items-center justify-center font-bold">30</span>
                  <span>31</span>
                </div>
              </div>

              {/* Agenda Events */}
              <div className="space-y-1.5 sm:border-l border-[#102B4E]/8 sm:pl-3 text-[11px]">
                {events.map((ev, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: ev.color }} />
                    <span className="text-[10px] text-[#65758B] w-20 flex-shrink-0 tabular-nums">{ev.time}</span>
                    <span className="font-semibold text-[#102B4E] truncate">{ev.title}</span>
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
