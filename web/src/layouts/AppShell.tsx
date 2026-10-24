import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GrowNovaCompassLogo } from '../components/GrowNovaCompassLogo';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Bell,
  ChevronDown,
  X,
  CheckCircle2,
  Menu,
  LogOut,
  Building,
  ArrowRight,
  FileText,
  Users,
  Package,
  Calculator,
  Calendar,
  BarChart3,
  Users2,
  Folder,
  ShieldCheck,
  Settings,
  Shield,
  Briefcase,
  User,
  Check,
  Globe
} from 'lucide-react';
import { useGrahakLanguage } from '../context/GrahakLanguageContext';
import { QuickActionModals, type ActionModalType } from '../components/dashboard/QuickActionModals';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, switchBusiness, isDemoMode } = useAuth();
  const { languageInfo, openLanguageModal } = useGrahakLanguage();

  // Floating states
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick Action Modal state
  const [activeModal, setActiveModal] = useState<ActionModalType>(null);

  // Notifications state
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Payment Received',
      desc: '₹42,500 credited via UPI from Balaji Traders',
      time: '12m ago',
      unread: true,
      category: 'accounting'
    },
    {
      id: 2,
      title: 'WhatsApp Lead Captured',
      desc: 'New inquiry for 500m cotton twill from Surat',
      time: '45m ago',
      unread: true,
      category: 'crm'
    },
    {
      id: 3,
      title: 'GST Reconciliation Alert',
      desc: 'GSTR-1 auto-populated draft ready for verification',
      time: '2h ago',
      unread: false,
      category: 'gst'
    },
    {
      id: 4,
      title: 'Leave Request Pending',
      desc: 'Sunil Verma submitted 2-day personal leave ticket',
      time: 'Yesterday',
      unread: false,
      category: 'hr'
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Keyboard shortcut listener (Cmd+K / Ctrl+K and Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setProfileOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const primaryNavItems = [
    { name: 'Home', path: '/dashboard', icon: BarChart3 },
    { name: 'CRM', path: '/dashboard/crm', icon: Users },
    { name: 'Inventory', path: '/dashboard/inventory', icon: Package },
    { name: 'Accounting', path: '/dashboard/accounting', icon: Calculator },
    { name: 'HR', path: '/dashboard/hr', icon: Briefcase },
    { name: 'Reports', path: '/dashboard/reports', icon: FileText },
  ];

  const moreNavItems = [
    { name: 'Calendar', path: '/dashboard/calendar', icon: Calendar },
    { name: 'People', path: '/dashboard/people', icon: Users2 },
    { name: 'Projects', path: '/dashboard/projects', icon: Folder },
    { name: 'Documents', path: '/dashboard/documents', icon: FileText },
    { name: 'Compliance', path: '/dashboard/compliance', icon: ShieldCheck },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const allNavItems = [...primaryNavItems, ...moreNavItems];

  const [moreOpen, setMoreOpen] = useState(false);
  const isMoreActive = moreNavItems.some(item => location.pathname === item.path);

  const isDenseRoute = location.pathname !== '/dashboard' && 
                       location.pathname !== '/dashboard/manager' && 
                       location.pathname !== '/dashboard/employee';

  const searchResults = [
    { title: 'Create GST Tax Invoice', type: 'Quick Action', action: () => setActiveModal('invoice') },
    { title: 'Add Customer to CRM', type: 'Quick Action', action: () => setActiveModal('customer') },
    { title: 'Record Business Expense', type: 'Quick Action', action: () => setActiveModal('expense') },
    { title: 'Approve Staff Leave', type: 'Quick Action', action: () => setActiveModal('leave') },
    { title: 'Executive Sales Overview', type: 'Dashboard View', path: '/dashboard' },
    { title: 'Customer Lead Pipeline', type: 'CRM Module', path: '/dashboard/crm' },
    { title: 'Stock & Inventory Catalog', type: 'Inventory Module', path: '/dashboard/inventory' },
    { title: 'GST Ledger & Balance Sheet', type: 'Accounting Module', path: '/dashboard/accounting' },
    { title: 'Staff Attendance & Payroll', type: 'HR Module', path: '/dashboard/hr' },
    { title: 'Executive Calendar & Schedule', type: 'Calendar Module', path: '/dashboard/calendar' },
    { title: 'Compliance & Audit Logs', type: 'Reports Module', path: '/dashboard/reports' },
  ].filter(item => 
    !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#F8F5F1] text-[#102B4E] selection:bg-[#C69A43]/20 overflow-x-hidden">
      
      {/* Background Atmosphere - Canonical Misty Mountain Scenery */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out"
          style={{
            backgroundImage: "url('/dashboard-bg.jpg')",
            backgroundPosition: 'center 45%',
          }}
        />
        <div className={`absolute inset-0 transition-opacity duration-500 ${
          isDenseRoute 
            ? 'bg-gradient-to-b from-[#F8F5F1]/94 via-[#F8F5F1]/90 to-[#F8F5F1]/94 backdrop-blur-[1px]' 
            : 'bg-gradient-to-t from-[#F8F5F1]/85 via-transparent to-[#F8F5F1]/40'
        }`} />
      </div>

      {/* Floating Top Navigation Island */}
      <header className="sticky top-0 z-40 w-full pt-3 sm:pt-4 px-3 sm:px-6 md:px-8 max-w-[1720px] mx-auto">
        <div className="gn-panel rounded-full px-3.5 sm:px-5 py-2 flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300 shadow-md">
          
          {/* Left: GrowNova Compass Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/dashboard" className="focus:outline-none transition-transform hover:scale-[1.02]">
              <GrowNovaCompassLogo size="sm" showText={true} variant="subtitled" />
            </Link>
          </div>

          {/* Center: Module Navigation Island Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/50 p-1 rounded-full border border-white/80 shadow-2xs overflow-visible">
            {primaryNavItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 select-none whitespace-nowrap ${
                    isActive
                      ? 'bg-[#F7EEDA] text-[#102B4E] border border-[#C69A43]/40 shadow-xs font-bold'
                      : 'text-[#102B4E]/75 hover:text-[#102B4E] hover:bg-white/80'
                  }`}
                >
                  <item.icon className={`w-3.5 h-3.5 stroke-[2] ${isActive ? 'text-[#C69A43]' : 'text-[#65758B]'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* More Modules Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1 select-none whitespace-nowrap cursor-pointer ${
                  isMoreActive
                    ? 'bg-[#F7EEDA] text-[#102B4E] border border-[#C69A43]/40 font-bold'
                    : 'text-[#102B4E]/75 hover:text-[#102B4E] hover:bg-white/80'
                }`}
              >
                <span>More</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-2xl gn-panel p-2 shadow-xl z-50 bg-white/95 border border-white/95 space-y-1 animate-in fade-in zoom-in-95">
                  {moreNavItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setMoreOpen(false)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                          isActive
                            ? 'bg-[#F7EEDA] text-[#102B4E] font-bold'
                            : 'text-[#55677D] hover:text-[#102B4E] hover:bg-[#102B4E]/5'
                        }`}
                      >
                        <item.icon className="w-3.5 h-3.5 text-[#C69A43]" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            
            {/* Search Pill */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white/95 border border-white/80 shadow-2xs text-xs text-[#55677D] hover:text-[#102B4E] transition-all cursor-pointer"
              title="Search or ask... (⌘K)"
            >
              <Search className="w-3.5 h-3.5 stroke-[2.2] text-[#C69A43]" />
              <span className="font-medium">Search or ask…</span>
              <kbd className="px-1.5 py-0.5 rounded-md bg-[#102B4E]/8 text-[10px] font-bold text-[#102B4E]">⌘K</kbd>
            </button>

            {/* Mobile Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="sm:hidden p-2 rounded-full bg-white/70 hover:bg-white text-[#102B4E] border border-white/80 shadow-2xs cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-[#C69A43]" />
            </button>

            {/* Language Switcher Pill */}
            <button
              type="button"
              onClick={openLanguageModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white/95 border border-white/80 shadow-2xs text-xs font-bold text-[#102B4E] hover:text-[#C69A43] transition-all cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#C69A43]" />
              <span className="hidden sm:inline">{languageInfo.nativeName}</span>
            </button>

            {/* Direct Grahak B2C App Link */}
            <Link
              to="/grahak"
              className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-100/80 hover:bg-amber-100 border border-amber-300/50 shadow-2xs text-xs font-bold text-amber-900 transition-all cursor-pointer"
              title="Grahak B2C Customer & POS View"
            >
              <span>ग्राहक B2C</span>
            </Link>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                }}
                className="relative p-2 rounded-full bg-white/70 hover:bg-white/95 border border-white/80 shadow-2xs text-[#102B4E] transition-all cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 stroke-[2.2]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#DC2626] ring-2 ring-white"></span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2.5 w-80 sm:w-96 os-panel-primary rounded-2xl p-4 shadow-2xl border border-white/95 z-50 bg-white/95 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-[#102B4E]/10 mb-3">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#C69A43]" />
                      <h4 className="text-sm font-bold text-[#102B4E] tracking-tight">Notifications</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-[#C69A43]">
                        {unreadCount} unread
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
                        triggerToast('All notifications marked as read.');
                      }}
                      className="text-[11px] font-bold text-[#C69A43] hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {notifications.map(item => (
                      <div
                        key={item.id}
                        className={`p-2.5 rounded-xl border transition-all ${
                          item.unread
                            ? 'bg-[#F7EEDA]/50 border-[#C69A43]/30'
                            : 'bg-white/60 border-white/80 hover:bg-white/90'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-xs font-bold text-[#102B4E]">{item.title}</h5>
                          <span className="text-[10px] text-[#55677D] whitespace-nowrap">{item.time}</span>
                        </div>
                        <p className="text-[11.5px] text-[#55677D] mt-0.5 leading-snug">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 mt-2 border-t border-[#102B4E]/10 text-center">
                    <Link
                      to="/dashboard/reports"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-xs font-bold text-[#C69A43] hover:underline flex items-center justify-center gap-1"
                    >
                      <span>View Full Audit & Log Stream</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 p-1 sm:pr-3 rounded-full bg-white/70 hover:bg-white/95 border border-white/80 shadow-2xs transition-all cursor-pointer"
              >
                <img
                  src={user?.avatarUrl || '/ravi_avatar_hq.jpg'}
                  alt={user?.name || 'User'}
                  className="w-7 h-7 rounded-full object-cover border border-[#C69A43]/40"
                />
                <div className="hidden sm:flex flex-col text-left leading-none">
                  <span className="text-xs font-bold text-[#102B4E]">
                    {user?.role === 'OPS' ? 'manager' : user?.role === 'EMPLOYEE' ? 'employee' : 'owner'}
                  </span>
                  <span className="text-[9.5px] text-[#55677D] font-semibold uppercase tracking-wider">
                    {user?.role || 'OWNER'}
                  </span>
                </div>
                <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-[#55677D]" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2.5 w-64 gn-panel rounded-2xl p-3 shadow-2xl border border-white/95 z-50 bg-white/95 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="p-2 pb-3 border-b border-[#102B4E]/10 mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-extrabold text-[#102B4E]">
                        {user?.role === 'OPS' ? 'manager' : user?.role === 'EMPLOYEE' ? 'employee' : 'owner'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-[#C69A43]">
                        {user?.role || 'OWNER'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#55677D]">
                      <Building className="w-3.5 h-3.5 text-[#C69A43]" />
                      <span className="truncate">{user?.businessName || 'Shree Ganesh Textiles'}</span>
                    </div>
                  </div>

                  {/* Switch Persona */}
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#55677D]">
                    Switch Perspective
                  </div>
                  <div className="space-y-1 mb-2">
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-[#F7EEDA] text-xs font-semibold text-[#102B4E] flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-[#C69A43]" />
                        <span>Owner View</span>
                      </span>
                      {user?.role === 'OWNER' && <Check className="w-3.5 h-3.5 text-[#102B4E]" />}
                    </button>
                    <button
                      onClick={() => {
                        navigate('/dashboard/manager');
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-[#F7EEDA] text-xs font-semibold text-[#102B4E] flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Manager View</span>
                      </span>
                      {user?.role === 'OPS' && <Check className="w-3.5 h-3.5 text-[#102B4E]" />}
                    </button>
                    <button
                      onClick={() => {
                        navigate('/dashboard/employee');
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-[#F7EEDA] text-xs font-semibold text-[#102B4E] flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-blue-700" />
                        <span>Employee View</span>
                      </span>
                      {user?.role === 'EMPLOYEE' && <Check className="w-3.5 h-3.5 text-[#102B4E]" />}
                    </button>
                  </div>

                  <div className="pt-2 border-t border-[#102B4E]/10 space-y-1 text-xs font-semibold text-[#102B4E]">
                    <button
                      onClick={() => {
                        const newName = prompt('Enter business name to switch into:', 'Balaji Mega Retail Mart');
                        if (newName) {
                          switchBusiness(newName);
                          triggerToast(`Switched active tenant to: ${newName}`);
                        }
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Building className="w-3.5 h-3.5 text-[#55677D]" />
                        Switch Organization
                      </span>
                      <span className="text-[10px] text-[#C69A43] font-bold">Change</span>
                    </button>

                    <button
                      onClick={async () => {
                        await logout();
                        setProfileOpen(false);
                        navigate('/auth');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-700 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-600" />
                      <span>{isDemoMode ? 'Exit Demo Mode' : 'Sign Out from OS'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full bg-white/70 hover:bg-white text-[#102B4E] border border-white/80 shadow-2xs cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 stroke-[2.5]" /> : <Menu className="w-4 h-4 stroke-[2.5]" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 p-4 os-panel-primary rounded-2xl shadow-2xl flex flex-col gap-2 z-50 bg-white/95 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#102B4E]/10">
              {allNavItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'os-active-control font-extrabold'
                        : 'text-[#102B4E] hover:bg-white/80'
                    }`}
                  >
                    <item.icon className="w-4 h-4 text-[#C69A43]" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-1 flex items-center justify-between text-xs text-[#55677D]">
              <span className="font-semibold">{user?.businessName}</span>
              <button
                onClick={async () => {
                  await logout();
                  setMobileMenuOpen(false);
                  navigate('/auth');
                }}
                className="text-rose-600 font-bold hover:underline cursor-pointer"
              >
                {isDemoMode ? 'Exit Demo' : 'Sign out'}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Application Content */}
      <main className="relative z-10 flex-1 w-full max-w-[1720px] mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-5">
        {children}
      </main>

      {/* Command Palette (⌘K) */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-[#102B4E]/35 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl os-panel-primary rounded-3xl p-5 shadow-2xl border border-white/95 bg-white/95">
            <div className="flex items-center gap-3 pb-3 border-b border-[#102B4E]/10">
              <Search className="w-5 h-5 text-[#C69A43]" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search modules, actions, invoices, or ask GrowAI..."
                className="w-full bg-transparent text-sm font-semibold text-[#102B4E] placeholder:text-[#55677D] focus:outline-none"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-full text-[#55677D] hover:text-[#102B4E] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 max-h-80 overflow-y-auto space-y-1.5">
              <div className="text-[11px] font-bold text-[#55677D] uppercase tracking-wider px-2 py-1">
                Suggested Commands & Navigation
              </div>
              {searchResults.length > 0 ? (
                searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchOpen(false);
                      if (item.action) {
                        item.action();
                      } else if (item.path) {
                        navigate(item.path);
                      }
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F7EEDA]/70 transition-colors flex items-center justify-between cursor-pointer group"
                  >
                    <span className="text-xs sm:text-sm font-bold text-[#102B4E] group-hover:text-[#C69A43] transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-[#55677D] border border-slate-200">
                      {item.type}
                    </span>
                  </button>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-[#55677D]">
                  No matching results for "{searchQuery}". Try "Invoice", "CRM", "Expense", or "Reports".
                </div>
              )}
            </div>

            <div className="mt-3 pt-2 border-t border-[#102B4E]/10 flex items-center justify-between text-[11px] text-[#55677D]">
              <span>Press <kbd className="font-bold text-[#102B4E]">ESC</kbd> to close</span>
              <span>GrowNova OS Fast Navigation</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Modals */}
      <QuickActionModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onNotify={triggerToast}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full os-nav-island shadow-2xl border border-white/95 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <Bell className="w-4 h-4 text-[#C69A43]" />
          <span className="text-xs font-bold text-[#102B4E]">{toastMessage}</span>
          <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
        </div>
      )}

    </div>
  );
};
