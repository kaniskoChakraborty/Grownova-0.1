import React, { useState } from 'react';
import { BarChart3, ChevronDown, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const BusinessAtGlance: React.FC = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState<'This Month' | 'Last Month' | 'Quarterly'>('This Month');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const role = user?.role || 'OWNER';

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="w-full gn-panel p-5 sm:p-6 select-none relative">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#102B4E]/8">
        <div className="flex items-center gap-2 text-[#102B4E]">
          <BarChart3 className="w-4 h-4 text-[#102B4E]" />
          <h2 className="text-sm sm:text-[15px] font-bold text-[#102B4E] tracking-tight">
            {role === 'OPS' ? 'Team at a glance' : role === 'EMPLOYEE' ? 'My Day at a glance' : 'Business at a glance'}
          </h2>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#55677D]/80">
            <span>Last updated 2m ago</span>
            <button
              onClick={handleRefresh}
              className="p-1 rounded-md hover:bg-black/5 text-[#55677D] hover:text-[#102B4E] transition-all cursor-pointer"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-[#C69A43]' : ''}`} />
            </button>
          </div>

          {/* Period Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-[#102B4E] hover:bg-black/5 transition-colors cursor-pointer"
            >
              <span>{period}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#102B4E]/60 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-36 rounded-xl bg-white/95 backdrop-blur-md border border-white p-1 shadow-lg z-30 animate-in fade-in zoom-in-95 duration-150">
              {(['This Month', 'Last Month', 'Quarterly'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setPeriod(opt);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    period === opt ? 'bg-[#F7EEDA] text-[#102B4E] font-bold' : 'text-[#65758B] hover:bg-black/5'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

      {/* 4 Evenly Spaced KPI Columns with Vertical Separators */}
      {role === 'OWNER' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0">
          
          {/* 1. Revenue */}
          <div className="md:pr-4 md:border-r border-[#102B4E]/10 flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-[#102B4E] tracking-tight">
              {period === 'Last Month' ? '₹11.1L' : period === 'Quarterly' ? '₹34.8L' : '₹12.4L'}
            </span>
            <span className="text-[11.5px] text-[#65758B] mt-0.5">Revenue</span>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#15803D] mt-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>18%</span>
            </span>
          </div>

          {/* 2. Expenses */}
          <div className="md:px-4 md:border-r border-[#102B4E]/10 flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-[#102B4E] tracking-tight">
              {period === 'Last Month' ? '₹3.9L' : period === 'Quarterly' ? '₹10.5L' : '₹3.6L'}
            </span>
            <span className="text-[11.5px] text-[#65758B] mt-0.5">Expenses</span>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#DC2626] mt-1.5">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>6%</span>
            </span>
          </div>

          {/* 3. Tasks Done */}
          <div className="md:px-4 md:border-r border-[#102B4E]/10 flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-[#102B4E] tracking-tight">
              {period === 'Last Month' ? '28 / 30' : '24 / 32'}
            </span>
            <span className="text-[11.5px] text-[#65758B] mt-0.5">Tasks Done</span>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#15803D] mt-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>12%</span>
            </span>
          </div>

          {/* 4. Meetings */}
          <div className="md:pl-4 flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-[#102B4E] tracking-tight">
              3
            </span>
            <span className="text-[11.5px] text-[#65758B] mt-0.5">Meetings</span>
            <span className="text-xs font-medium text-[#65758B] mt-1.5">
              This Week
            </span>
          </div>

        </div>
      )}

      {/* Role: Manager / OPS View */}
      {role === 'OPS' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0">
          <div className="md:pr-4 md:border-r border-[#102B4E]/10 flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-[#102B4E] tracking-tight">14 / 16</span>
            <span className="text-[11.5px] text-[#65758B] mt-0.5">Active Members</span>
            <span className="text-xs font-semibold text-[#15803D] mt-1.5">94% Attendance</span>
          </div>
          <div className="md:px-4 md:border-r border-[#102B4E]/10 flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-[#102B4E] tracking-tight">38 / 45</span>
            <span className="text-[11.5px] text-[#65758B] mt-0.5">Team Tasks Done</span>
            <span className="text-xs font-semibold text-[#15803D] mt-1.5">↑ 15% Velocity</span>
          </div>
          <div className="md:px-4 md:border-r border-[#102B4E]/10 flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-[#102B4E] tracking-tight">5</span>
            <span className="text-[11.5px] text-[#65758B] mt-0.5">Pending Approvals</span>
            <span className="text-xs font-semibold text-[#C69A43] mt-1.5">Needs Review</span>
          </div>
          <div className="md:pl-4 flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-[#102B4E] tracking-tight">2</span>
            <span className="text-[11.5px] text-[#65758B] mt-0.5">Active Sprints</span>
            <span className="text-xs font-medium text-[#65758B] mt-1.5">On Schedule</span>
          </div>
        </div>
      )}

      {/* Role: Employee View */}
      {role === 'EMPLOYEE' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0">
          <div className="md:pr-4 md:border-r border-[#102B4E]/10 flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-[#102B4E] tracking-tight">6 / 8</span>
            <span className="text-[11.5px] text-[#65758B] mt-0.5">My Tasks Done</span>
            <span className="text-xs font-semibold text-[#15803D] mt-1.5">↑ 75% Today</span>
          </div>
          <div className="md:px-4 md:border-r border-[#102B4E]/10 flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-[#102B4E] tracking-tight">6.5 hrs</span>
            <span className="text-[11.5px] text-[#65758B] mt-0.5">Hours Logged</span>
            <span className="text-xs font-medium text-[#65758B] mt-1.5">Standard Shift</span>
          </div>
          <div className="md:px-4 md:border-r border-[#102B4E]/10 flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-[#102B4E] tracking-tight">14 days</span>
            <span className="text-[11.5px] text-[#65758B] mt-0.5">Leave Balance</span>
            <span className="text-xs font-semibold text-[#15803D] mt-1.5">Available</span>
          </div>
          <div className="md:pl-4 flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-[#102B4E] tracking-tight">2</span>
            <span className="text-[11.5px] text-[#65758B] mt-0.5">Upcoming Meetings</span>
            <span className="text-xs font-medium text-[#65758B] mt-1.5">Today</span>
          </div>
        </div>
      )}
    </div>
  );
};
