import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GrowNovaLogo } from '../GrowNovaLogo';
import { ArrowRight, Menu, X } from 'lucide-react';

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

  return (
    <header className="relative w-full z-40 pt-5 md:pt-7 px-4 sm:px-8 md:px-12 lg:px-16 flex items-center justify-between">
      {/* Top Left: GrowNova Logo (Navigates to /) */}
      <div className="flex-shrink-0">
        <Link to="/" className="inline-block focus:outline-none transition-transform hover:scale-[1.02]">
          <GrowNovaLogo size="md" />
        </Link>
      </div>

      {/* Center: Floating Translucent Liquid Glass Navigation Island */}
      <nav className="hidden md:flex items-center">
        <div className="nav-island-glass rounded-full p-1.5 px-3 flex items-center gap-1.5 text-[14.5px] font-semibold text-[#0B1E36] transition-all duration-300">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-4 py-1.5 rounded-full transition-all duration-200 select-none ${
                  isActive
                    ? 'bg-[#F9EED9]/95 text-[#0B1E36] shadow-xs border border-[#C2831E]/40 font-bold'
                    : 'text-[#0B1E36]/80 hover:text-[#C2831E] hover:bg-white/40'
                }`}
              >
                <span>{item.name}</span>
                {isActive && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3.5 h-[2px] bg-[#C2831E] rounded-full"></span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Top Right: Sign in & Get Started */}
      <div className="hidden sm:flex items-center gap-3.5">
        {/* Sign in Button */}
        <button
          onClick={onSignInClick || (() => navigate('/pricing'))}
          className="rounded-full px-6 py-2.5 text-[14px] font-bold text-[#0B1E36] bg-white/80 hover:bg-white backdrop-blur-md border border-white shadow-xs transition-all duration-200 active:scale-95 focus:outline-none cursor-pointer"
        >
          Sign in
        </button>

        {/* Get Started Button */}
        <button
          onClick={onGetStartedClick || (() => navigate('/product'))}
          className="group relative rounded-full px-6 py-2.5 text-[14px] font-bold text-white gold-glow-btn flex items-center gap-2 transition-all duration-300 active:scale-95 focus:outline-none overflow-hidden cursor-pointer"
        >
          <span className="absolute inset-0 w-1/2 h-full bg-white/30 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-700 pointer-events-none"></span>
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 stroke-[2.5]" />
        </button>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-2">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2.5 rounded-full bg-white/80 backdrop-blur-md border border-white text-[#0B1E36] focus:outline-none shadow-sm cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 stroke-[2.5]" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-4 right-4 mt-2 p-5 vision-glass-container rounded-2xl shadow-2xl flex flex-col gap-4 md:hidden z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-2">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-[15px] font-bold py-2.5 px-3.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#F9EED9] text-[#0B1E36] border border-[#C2831E]/30 font-extrabold'
                      : 'text-[#0B1E36] hover:text-[#C2831E] hover:bg-white/50'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="pt-3 border-t border-[#0B1E36]/10 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onSignInClick?.();
              }}
              className="w-full py-3 rounded-full text-sm font-bold text-[#0B1E36] bg-white/90 border border-white text-center shadow-xs cursor-pointer"
            >
              Sign in
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onGetStartedClick?.();
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
