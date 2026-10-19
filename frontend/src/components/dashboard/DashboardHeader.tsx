import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GrowNovaCompassLogo } from '../GrowNovaCompassLogo';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Shield,
  Briefcase,
  Check,
  LogOut,
  Compass
} from 'lucide-react';

interface DashboardHeaderProps {
  onSearchClick?: () => void;
  onNotificationsClick?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onSearchClick,
  onNotificationsClick,
}) => {
  const { user, switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Live dynamic Indian / Local format clock: "Fri, 30 May 2025  09:30 AM"
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      // Format to "Fri, 12 Oct 2026, 02:18 PM" and clean spacing
      const formatted = new Intl.DateTimeFormat('en-GB', options).format(now);
      setCurrentTime(formatted.replace(',', ' '));
    };

    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  const currentRoleName = user?.role === 'OPS' ? 'manager' : user?.role === 'EMPLOYEE' ? 'employee' : 'owner';

  const handleRoleSelect = (roleKey: 'OWNER' | 'OPS' | 'EMPLOYEE') => {
    switchRole(roleKey);
    setProfileOpen(false);
    if (roleKey === 'OWNER') navigate('/dashboard');
    else if (roleKey === 'OPS') navigate('/dashboard/manager');
    else if (roleKey === 'EMPLOYEE') navigate('/dashboard/employee');
  };

  return (
    <header className="w-full flex items-center justify-between gap-4 py-3 px-4 sm:px-8 select-none z-30">
      {/* 1. LEFT: GROWNOVA COMPASS STAR EMBLEM & WORDMARK */}
      <div className="flex items-center flex-shrink-0">
        <Link to="/dashboard" className="cursor-pointer focus:outline-none">
          <GrowNovaCompassLogo size="md" showText={true} />
        </Link>
      </div>

      {/* 2. CENTER: WIDE FLOATING SEARCH PILL */}
      <div className="flex-1 max-w-xl mx-2 sm:mx-6">
        <div
          onClick={onSearchClick}
          className="w-full flex items-center justify-between gn-search-pill px-4 py-2 text-xs sm:text-sm text-[#102B4E]/75 cursor-pointer hover:border-white transition-all shadow-sm"
        >
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <Search className="w-4 h-4 text-[#102B4E]/60 flex-shrink-0" />
            <span className="truncate text-xs sm:text-[13px] font-normal text-[#102B4E]/70">
              Search apps, people, files, or ask GrowNova...
            </span>
          </div>
          <div className="flex-shrink-0 flex items-center gap-1 ml-2">
            <kbd className="px-2 py-0.5 rounded-md bg-black/5 text-[11px] font-semibold text-[#102B4E]/60 border border-black/5">
              ⌘ K
            </kbd>
          </div>
        </div>
      </div>

      {/* 3. RIGHT CONTROLS: NOTIFICATION BELL, USER AVATAR, ROLE DROPDOWN, DATE/TIME */}
      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
        
        {/* Notification Bell with unread amber dot */}
        <button
          onClick={onNotificationsClick}
          className="relative p-2 rounded-full hover:bg-white/60 transition-colors text-[#102B4E] cursor-pointer focus:outline-none"
          title="Notifications"
        >
          <Bell className="w-4 h-4 text-[#102B4E]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EAB308] ring-2 ring-[#F8F5F1]" />
        </button>

        {/* User Avatar + Role Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-white/60 transition-colors cursor-pointer focus:outline-none"
          >
            {/* Black Circular Avatar with White Initial */}
            <div className="w-7 h-7 rounded-full bg-[#0B2340] text-white flex items-center justify-center text-xs font-bold shadow-xs">
              {currentRoleName.charAt(0).toUpperCase()}
            </div>
            
            <span className="text-xs sm:text-sm font-medium text-[#102B4E] lowercase">
              {currentRoleName}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#102B4E]/60 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Role & Profile Popover */}
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white/95 backdrop-blur-xl border border-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-[#102B4E]/10 mb-1.5">
                <p className="text-xs font-bold text-[#102B4E]">GrowNova Persona</p>
                <p className="text-[11px] text-[#65758B]">Switch role-based perspective</p>
              </div>

              {/* Roles list */}
              <div className="space-y-1">
                <button
                  onClick={() => handleRoleSelect('OWNER')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                    user?.role === 'OWNER' ? 'bg-[#F7EEDA] text-[#102B4E]' : 'hover:bg-[#102B4E]/5 text-[#65758B]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-[#C69A43]" />
                    <span>Owner Dashboard</span>
                  </span>
                  {user?.role === 'OWNER' && <Check className="w-3.5 h-3.5 text-[#102B4E]" />}
                </button>

                <button
                  onClick={() => handleRoleSelect('OPS')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                    user?.role === 'OPS' ? 'bg-[#F7EEDA] text-[#102B4E]' : 'hover:bg-[#102B4E]/5 text-[#65758B]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-[#15803D]" />
                    <span>Manager Dashboard</span>
                  </span>
                  {user?.role === 'OPS' && <Check className="w-3.5 h-3.5 text-[#102B4E]" />}
                </button>

                <button
                  onClick={() => handleRoleSelect('EMPLOYEE')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                    user?.role === 'EMPLOYEE' ? 'bg-[#F7EEDA] text-[#102B4E]' : 'hover:bg-[#102B4E]/5 text-[#65758B]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#1D4172]" />
                    <span>Employee Dashboard</span>
                  </span>
                  {user?.role === 'EMPLOYEE' && <Check className="w-3.5 h-3.5 text-[#102B4E]" />}
                </button>
              </div>

              <div className="mt-2 pt-2 border-t border-[#102B4E]/10 flex flex-col gap-1">
                <Link
                  to="/"
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#65758B] hover:bg-[#102B4E]/5 flex items-center gap-2"
                  onClick={() => setProfileOpen(false)}
                >
                  <Compass className="w-3.5 h-3.5 text-[#C69A43]" />
                  <span>Marketing Website</span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    navigate('/auth');
                  }}
                  className="w-full px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Live Date & Time matching reference format: Fri, 30 May 2025  09:30 AM */}
        <div className="hidden lg:block text-xs font-medium text-[#65758B] pl-2 border-l border-[#102B4E]/15 whitespace-nowrap">
          {currentTime || 'Fri, 30 May 2025 09:30 AM'}
        </div>

      </div>
    </header>
  );
};
