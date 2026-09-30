import { useState } from 'react';
import { GrowNovaLogo } from './GrowNovaLogo';
import { ArrowRight, Menu, X } from 'lucide-react';

interface TopNavbarProps {
  onGetStartedClick?: () => void;
  onSignInClick?: () => void;
}

export const TopNavbar = ({
  onGetStartedClick,
  onSignInClick,
}: TopNavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const navItems = ['Product', 'Solutions', 'Resources', 'Pricing'];

  return (
    <header className="relative w-full z-40 pt-5 md:pt-7 px-4 sm:px-8 md:px-12 lg:px-16 flex items-center justify-between">
      {/* Top Left: GrowNova Logo */}
      <div className="flex-shrink-0">
        <a href="#" className="inline-block focus:outline-none">
          <GrowNovaLogo size="md" />
        </a>
      </div>

      {/* Center: Floating Translucent Liquid Glass Navigation Island */}
      <nav className="hidden md:flex items-center">
        <div className="nav-island-glass rounded-full px-8 py-3 flex items-center gap-8 text-[15px] font-semibold text-[#0B1E36] transition-all duration-300">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onMouseEnter={() => setActiveItem(item)}
              onMouseLeave={() => setActiveItem(null)}
              className={`relative transition-colors duration-200 py-1 hover:text-[#C2831E] ${
                activeItem === item ? 'text-[#C2831E]' : 'text-[#0B1E36]'
              }`}
            >
              {item}
              {activeItem === item && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#C2831E] rounded-full transition-all duration-300"></span>
              )}
            </a>
          ))}
        </div>
      </nav>

      {/* Top Right: Sign in & Get Started */}
      <div className="hidden sm:flex items-center gap-3.5">
        {/* Sign in Button */}
        <button
          onClick={onSignInClick}
          className="rounded-full px-6 py-2.5 text-[14.5px] font-bold text-[#0B1E36] bg-white/80 hover:bg-white backdrop-blur-md border border-white shadow-xs transition-all duration-200 active:scale-95 focus:outline-none"
        >
          Sign in
        </button>

        {/* Get Started Button */}
        <button
          onClick={onGetStartedClick}
          className="group relative rounded-full px-6 py-2.5 text-[14.5px] font-bold text-white gold-glow-btn flex items-center gap-2 transition-all duration-300 active:scale-95 focus:outline-none overflow-hidden"
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
          className="p-2.5 rounded-full bg-white/80 backdrop-blur-md border border-white text-[#0B1E36] focus:outline-none shadow-sm"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 stroke-[2.5]" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-4 right-4 mt-2 p-5 vision-glass-container rounded-2xl shadow-2xl flex flex-col gap-4 md:hidden z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[16px] font-bold text-[#0B1E36] hover:text-[#C2831E] py-2 px-3 rounded-lg hover:bg-white/60 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="pt-3 border-t border-navy/10 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onSignInClick?.();
              }}
              className="w-full py-3 rounded-full text-sm font-bold text-[#0B1E36] bg-white/90 border border-white text-center shadow-xs"
            >
              Sign in
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onGetStartedClick?.();
              }}
              className="w-full py-3 rounded-full text-sm font-bold text-white gold-glow-btn flex items-center justify-center gap-2 text-center"
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
