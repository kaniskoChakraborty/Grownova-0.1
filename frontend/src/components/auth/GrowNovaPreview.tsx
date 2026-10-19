import React from 'react';
import { GrowNovaCompassLogo } from '../GrowNovaCompassLogo';
import {
  TrendingUp,
  TrendingDown,
  Users2,
  Folder,
  BarChart2,
  Box,
  Calendar as CalendarIcon,
  Search,
  Bell,
  ChevronDown
} from 'lucide-react';

export const GrowNovaPreview: React.FC = () => {
  return (
    <div 
      className="w-full rounded-2xl md:rounded-[26px] p-3 sm:p-4 shadow-[0_20px_45px_-10px_rgba(16,43,78,0.16),inset_0_1.5px_2px_rgba(255,255,255,0.95),inset_0_-1.5px_2px_rgba(255,255,255,0.4)] border border-white/90 select-none text-[#102B4E] transition-all bg-white/85 backdrop-blur-xl"
    >
      {/* 1. Dashboard Top Header Bar */}
      <div className="flex items-center justify-between gap-1 pb-2 mb-2 border-b border-[#102B4E]/10">
        <GrowNovaCompassLogo size="sm" showText={true} />

        <div className="hidden sm:flex items-center gap-1 bg-white/80 border border-white/90 rounded-full px-2.5 py-1 text-[10px] text-[#65758B] shadow-2xs">
          <Search className="w-3 h-3 text-[#102B4E]/50" />
          <span>Search apps, people...</span>
          <kbd className="text-[8px] bg-black/5 px-1 rounded text-[#102B4E]/60 font-mono">⌘K</kbd>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative p-1 text-[#102B4E]">
            <Bell className="w-3 h-3" />
            <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-[#EAB308]" />
          </div>
          <div className="flex items-center gap-1 pl-1 pr-1.5 py-0.5 rounded-full bg-white/75 border border-white/90">
            <div className="w-4 h-4 rounded-full bg-[#0B2340] text-white flex items-center justify-center text-[8px] font-bold">
              O
            </div>
            <span className="text-[10px] font-bold text-[#102B4E]">owner</span>
            <ChevronDown className="w-2.5 h-2.5 text-[#65758B]" />
          </div>
        </div>
      </div>

      {/* 2. Business at a Glance KPI Mini Card */}
      <div className="p-2.5 rounded-xl bg-white/80 border border-white/90 shadow-2xs mb-2">
        <div className="flex items-center justify-between text-[10px] font-bold text-[#102B4E] pb-1.5 mb-1.5 border-b border-[#102B4E]/8">
          <span>Business at a glance</span>
          <span className="text-[#65758B] font-medium">This Month ▾</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 text-center sm:text-left">
          <div className="sm:border-r border-[#102B4E]/8 sm:pr-1">
            <div className="text-xs font-bold text-[#102B4E]">₹12.4L</div>
            <div className="text-[8.5px] text-[#65758B]">Revenue</div>
            <div className="text-[8.5px] font-bold text-[#15803D] flex items-center justify-center sm:justify-start gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" /> 18%
            </div>
          </div>
          <div className="sm:border-r border-[#102B4E]/8 sm:px-1">
            <div className="text-xs font-bold text-[#102B4E]">₹3.6L</div>
            <div className="text-[8.5px] text-[#65758B]">Expenses</div>
            <div className="text-[8.5px] font-bold text-[#DC2626] flex items-center justify-center sm:justify-start gap-0.5">
              <TrendingDown className="w-2.5 h-2.5" /> 6%
            </div>
          </div>
          <div className="sm:border-r border-[#102B4E]/8 sm:px-1">
            <div className="text-xs font-bold text-[#102B4E]">24 / 32</div>
            <div className="text-[8.5px] text-[#65758B]">Tasks Done</div>
            <div className="text-[8.5px] font-bold text-[#15803D] flex items-center justify-center sm:justify-start gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" /> 12%
            </div>
          </div>
          <div className="sm:pl-1">
            <div className="text-xs font-bold text-[#102B4E]">3</div>
            <div className="text-[8.5px] text-[#65758B]">Meetings</div>
            <div className="text-[8.5px] text-[#65758B]">This Week</div>
          </div>
        </div>
      </div>

      {/* 3. Workspace Mini Grid (5 Key Apps) */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-[9.5px] font-semibold text-[#65758B] mb-1 px-0.5">
          <span>Your Workspace</span>
          <span className="text-[#102B4E]">All Apps →</span>
        </div>
        <div className="grid grid-cols-5 gap-1">
          {[
            { name: 'People', icon: Users2, color: '#2563EB' },
            { name: 'Projects', icon: Folder, color: '#0284C7' },
            { name: 'Finance', icon: BarChart2, color: '#059669' },
            { name: 'CRM', icon: TrendingUp, color: '#D97706' },
            { name: 'Inventory', icon: Box, color: '#10B981' },
          ].map(app => {
            const Icon = app.icon;
            return (
              <div
                key={app.name}
                className="gn-app-tile p-1.5 flex flex-col items-center justify-center text-center bg-white/90 border border-white"
              >
                <Icon className="w-3.5 h-3.5 mb-0.5" style={{ color: app.color }} />
                <span className="text-[9px] font-semibold text-[#102B4E] truncate max-w-full">{app.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Calendar Timeline Snippet */}
      <div className="p-2 rounded-xl bg-white/80 border border-white/90 shadow-2xs flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-1.5">
          <CalendarIcon className="w-3.5 h-3.5 text-[#102B4E]" />
          <span className="font-bold text-[#102B4E]">Calendar</span>
          <span className="text-[#65758B] text-[9.5px]">Today, Fri 30 May</span>
        </div>
        <div className="flex items-center gap-1.5 text-[9.5px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
          <span className="font-semibold text-[#102B4E]">Team Stand-up (09:30 AM)</span>
        </div>
      </div>

    </div>
  );
};

export default GrowNovaPreview;
