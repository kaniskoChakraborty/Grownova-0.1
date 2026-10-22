import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GrowNovaCompassLogo } from '../GrowNovaCompassLogo';
import { ArrowRight, Menu, X, LayoutDashboard } from 'lucide-react';

interface LandingNavProps {
  onGetStartedClick?: () => void;
  onSignInClick?: () => void;
}

export const LandingNav = ({
  onGetStartedClick,
  onSignInClick,
}: LandingNavProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Product', path: '/product' },
    { name: 'Solutions', path: '/solutions' },
    { name: 'Resources', path: '/resources' },
    { name: 'Pricing', path: '/pricing' },
  ];

  const handleSignIn = () => {
    if (onSignInClick) {
      onSignInClick();
    } else {
      navigate('/auth?mode=signin');
    }
  };

  const handleGetStarted = () => {
    if (onGetStartedClick) {
      onGetStartedClick();
    } else {
      navigate('/auth?mode=signup');
    }
  };

  return (
    <header className="relative w-full z-40 pt-3 sm:pt-4 pb-1 sm:pb-2 px-4 sm:px-8 md:px-12 lg:px-16 flex items-center justify-between">
      {/* Top Left: GrowNova OS Compass Logo (Navigates to /) */}
      <div className="flex-shrink-0">
        <Link 
          to="/" 
          className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/50 hover:bg-white/80 backdrop-blur-md border border-white/80 shadow-2xs focus:outline-none transition-all duration-300 hover:scale-[1.02]"
        >
          <GrowNovaCompassLogo size="md" showText={true} />
        </Link>
      </div>

      {/* Center: Floating Translucent Liquid Glass Navigation Island */}
      <nav className="hidden md:flex items-center">
        <div className="glass-pill-container rounded-full p-1.5 px-3 flex items-center gap-1.5 text-[14px] font-semibold text-[#102B4E] transition-all duration-300">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-4 py-1.5 rounded-full transition-all duration-200 select-none ${
                  isActive
                    ? 'os-active-control shadow-xs font-bold'
                    : 'text-[#102B4E]/80 hover:text-[#C69A43] hover:bg-white/60'
                }`}
              >
                <span>{item.name}</span>
                {isActive && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3.5 h-[2px] bg-[#C69A43] rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Top Right: Dashboard, Sign in & Get Started */}
      <div className="hidden sm:flex items-center gap-2.5 p-1.5 rounded-full bg-white/45 backdrop-blur-md border border-white/80 shadow-2xs">
        {/* Direct Link to Dashboard */}
        <Link
          to="/dashboard"
          className="rounded-full px-3.5 py-2 text-[13px] font-bold text-[#102B4E] hover:text-[#C69A43] bg-white/60 hover:bg-white/95 backdrop-blur-md border border-white/80 shadow-2xs transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-[#C69A43]" />
          <span>Dashboard</span>
        </Link>

        {/* Sign in Button */}
        <button
          onClick={handleSignIn}
          className="rounded-full px-4.5 py-2 text-[13px] font-bold text-[#102B4E] hover:text-[#C69A43] bg-white/70 hover:bg-white/95 backdrop-blur-md border border-white/90 shadow-2xs transition-all duration-200 active:scale-95 focus:outline-none cursor-pointer"
        >
          Sign in
        </button>

        {/* Get Started Button */}
        <button
          onClick={handleGetStarted}
          className="group relative rounded-full px-5.5 py-2 text-[13px] font-bold text-white gold-glow-btn flex items-center gap-2 transition-all duration-300 active:scale-95 focus:outline-none overflow-hidden cursor-pointer shadow-md"
        >
          <span className="absolute inset-0 w-1/2 h-full bg-white/30 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-700 pointer-events-none" />
          <span>Get Started</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 stroke-[2.5]" />
        </button>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-2">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2.5 rounded-full bg-white/75 backdrop-blur-md border border-white/90 text-[#102B4E] focus:outline-none shadow-sm cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 stroke-[2.5]" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-4 right-4 mt-2 p-5 os-panel-primary rounded-2xl shadow-2xl flex flex-col gap-3 md:hidden z-50 bg-white/95 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-[14.5px] font-bold py-2.5 px-3.5 rounded-xl transition-all ${
                    isActive
                      ? 'os-active-control font-extrabold'
                      : 'text-[#102B4E] hover:text-[#C69A43] hover:bg-white/50'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[14.5px] font-bold py-2.5 px-3.5 rounded-xl text-[#C69A43] hover:bg-white/50 flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Owner Dashboard</span>
            </Link>
          </div>
          <div className="pt-3 border-t border-[#102B4E]/10 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleSignIn();
              }}
              className="w-full py-3 rounded-full text-sm font-bold text-[#102B4E] bg-white/90 border border-white text-center shadow-xs cursor-pointer"
            >
              Sign in
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleGetStarted();
              }}
              className="w-full py-3 rounded-full text-sm font-bold text-white gold-glow-btn flex items-center justify-center gap-2 text-center cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
