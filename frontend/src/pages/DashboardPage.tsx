import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { DashboardGreeting } from '../components/dashboard/DashboardGreeting';
import { BusinessAtGlance } from '../components/dashboard/BusinessAtGlance';
import { WorkspaceGrid } from '../components/dashboard/WorkspaceGrid';
import { CalendarPanel } from '../components/dashboard/CalendarPanel';
import {
  EditorialTopRight,
  EditorialBottomRight,
  EditorialBottomLeft
} from '../components/dashboard/EditorialMessages';
import { QuickActionModals, type ActionModalType } from '../components/dashboard/QuickActionModals';
import { ChevronLeft, ChevronRight, Search, X, Bell, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, switchRole } = useAuth();
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<ActionModalType>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Synchronize persona role when navigating to specific role URLs
  useEffect(() => {
    if (location.pathname === '/dashboard/manager' && user?.role !== 'OPS') {
      switchRole('OPS');
    } else if (location.pathname === '/dashboard/employee' && user?.role !== 'EMPLOYEE') {
      switchRole('EMPLOYEE');
    } else if (location.pathname === '/dashboard' && user?.role !== 'OWNER') {
      switchRole('OWNER');
    }
  }, [location.pathname, user?.role, switchRole]);

  // Keyboard shortcut listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsNotificationsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const carouselNext = () => {
    setActiveSlide((prev) => (prev + 1) % 3);
  };

  const carouselPrev = () => {
    setActiveSlide((prev) => (prev - 1 + 3) % 3);
  };

  const quickSearchApps = [
    { name: 'People & Directory', path: '/dashboard/people', cat: 'Organization' },
    { name: 'Projects & Tasks', path: '/dashboard/projects', cat: 'Operations' },
    { name: 'Finance & Accounting', path: '/dashboard/accounting', cat: 'Finance' },
    { name: 'Sales & CRM Leads', path: '/dashboard/crm', cat: 'Sales' },
    { name: 'Inventory & Warehousing', path: '/dashboard/inventory', cat: 'Supply Chain' },
    { name: 'HR & Payroll Management', path: '/dashboard/hr', cat: 'People' },
    { name: 'Documents & Vault', path: '/dashboard/documents', cat: 'Workspace' },
    { name: 'Business Intelligence & Reports', path: '/dashboard/reports', cat: 'Analytics' },
    { name: 'Compliance & GST Filing', path: '/dashboard/compliance', cat: 'Taxation' },
    { name: 'Settings & Security', path: '/dashboard/settings', cat: 'System' },
  ].filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.cat.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="relative min-h-screen w-full bg-[#F8F5F1] text-[#102B4E] flex flex-col justify-between overflow-x-hidden selection:bg-[#C69A43]/20">
      
      {/* ============================================================== */}
      {/* 1. LAYERED SCENERY BACKGROUND (MATCHING CANONICAL REFERENCE)    */}
      {/* ============================================================== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Mountain Landscape Background Asset */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out"
          style={{
            backgroundImage: "url('/dashboard-bg.jpg')",
            backgroundPosition: 'center 45%',
          }}
        />

        {/* Soft atmospheric gradient washes to ensure high contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8F5F1]/80 via-transparent to-[#F8F5F1]/40" />
      </div>

      {/* ============================================================== */}
      {/* 2. TOP APPLICATION HEADER                                      */}
      {/* ============================================================== */}
      <div className="relative z-30 w-full max-w-[1720px] mx-auto">
        <DashboardHeader
          onSearchClick={() => setIsSearchOpen(true)}
          onNotificationsClick={() => setIsNotificationsOpen(true)}
        />
      </div>

      {/* ============================================================== */}
      {/* 3. MAIN WORKSPACE VIEWPORT (16:9 DESKTOP-FIRST THREE-ZONE)     */}
      {/* ============================================================== */}
      <main className="relative z-10 w-full flex-1 flex flex-col justify-center px-4 sm:px-8 max-w-[1680px] mx-auto py-2">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* ==================== LEFT ZONE (COL 1-3) ==================== */}
          <div className="lg:col-span-3 flex flex-col justify-between h-full py-4 space-y-12 lg:space-y-36">
            {/* Top: Editorial Greeting */}
            <DashboardGreeting onFundTransferClick={() => setActiveModal('transfer')} />

            {/* Bottom: Editorial Message & System Status */}
            <EditorialBottomLeft />
          </div>

          {/* ==================== CENTER ZONE (COL 4-9) ================== */}
          <div className="lg:col-span-6 relative flex flex-col items-center">
            
            {/* Floating Carousel Left Arrow (Hidden on small mobile) */}
            <button
              onClick={carouselPrev}
              className="hidden xl:flex absolute -left-12 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full gn-floating-btn items-center justify-center text-[#102B4E]/80 hover:text-[#102B4E] cursor-pointer z-20 shadow-md"
              title="Previous View"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Vertical Stack of the 3 Canonical Dashboard Panels */}
            <div className="w-full flex flex-col space-y-3.5 max-w-[620px]">
              
              {/* Panel 1: Business at a Glance */}
              <BusinessAtGlance />

              {/* Panel 2: Your Workspace App Grid */}
              <WorkspaceGrid />

              {/* Panel 3: Calendar & Agenda Panel */}
              <CalendarPanel />

            </div>

            {/* Floating Carousel Right Arrow (Hidden on small mobile) */}
            <button
              onClick={carouselNext}
              className="hidden xl:flex absolute -right-12 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full gn-floating-btn items-center justify-center text-[#102B4E]/80 hover:text-[#102B4E] cursor-pointer z-20 shadow-md"
              title="Next View"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Carousel Indicators at Bottom Center (● ○ ○) */}
            <div className="flex items-center gap-2 mt-4 select-none">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeSlide === idx
                      ? 'w-5 bg-[#0B2340]'
                      : 'w-2 bg-[#102B4E]/25 hover:bg-[#102B4E]/45'
                  }`}
                  title={`View ${idx + 1}`}
                />
              ))}
            </div>

          </div>

          {/* ==================== RIGHT ZONE (COL 10-12) ================= */}
          <div className="lg:col-span-3 flex flex-col justify-between h-full py-4 space-y-12 lg:space-y-48 items-end text-right">
            {/* Top Right Editorial Message */}
            <EditorialTopRight />

            {/* Bottom Right Editorial Message */}
            <EditorialBottomRight />
          </div>

        </div>
      </main>

      {/* ============================================================== */}
      {/* 4. SPOTLIGHT COMMAND PALETTE (⌘ K)                            */}
      {/* ============================================================== */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-2xl bg-white/95 backdrop-blur-xl border border-white p-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#102B4E]/10">
              <div className="flex items-center gap-2 text-[#102B4E] flex-1">
                <Search className="w-4 h-4 text-[#C69A43]" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search apps, records, actions, or ask GrowNova..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-[#102B4E] placeholder:text-[#65758B]/70 focus:outline-none"
                />
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-lg hover:bg-black/5 text-[#65758B] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 max-h-72 overflow-y-auto space-y-1">
              <p className="text-[10.5px] font-bold text-[#65758B] uppercase tracking-wider px-2 py-1">
                Quick Navigation
              </p>
              {quickSearchApps.map((item) => (
                <div
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setIsSearchOpen(false);
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F7EEDA] transition-colors cursor-pointer group text-xs font-semibold text-[#102B4E]"
                >
                  <span>{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#65758B] font-normal">{item.cat}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#C69A43]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. NOTIFICATIONS DRAWER                                         */}
      {/* ============================================================== */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-4 bg-black/20 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white/95 backdrop-blur-xl border border-white p-4 shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#102B4E]/10 mb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#C69A43]" />
                <h3 className="text-sm font-bold text-[#102B4E]">Notifications</h3>
              </div>
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="p-1 rounded-lg hover:bg-black/5 text-[#65758B] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-[#F7EEDA]/60 border border-[#C69A43]/20 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#15803D] mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-[#102B4E]">GSTR-3B Tax Draft Ready</p>
                  <p className="text-[#65758B] text-[11px] mt-0.5">Automated GST calculation ready for review and filing.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/60 border border-[#102B4E]/10 flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#2563EB] mt-1.5 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-[#102B4E]">Payment Received • ₹1,42,000</p>
                  <p className="text-[#65758B] text-[11px] mt-0.5">Invoice #INV-2025-089 settled by Raymond Mills via NEFT.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. QUICK ACTION MODALS                                         */}
      {/* ============================================================== */}
      <QuickActionModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onNotify={triggerToast}
      />

      {/* ============================================================== */}
      {/* 7. FLOATING TOAST NOTIFICATION                                 */}
      {/* ============================================================== */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full os-nav-island shadow-2xl border border-white/95 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <Bell className="w-4 h-4 text-[#C69A43]" />
          <span className="text-xs font-bold text-[#102B4E]">{toastMessage}</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
      )}

    </div>
  );
};
