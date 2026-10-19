import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GrowNovaLogo } from './GrowNovaLogo';
import { ArrowRight, Menu, X } from 'lucide-react';

export const TopNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Product', path: '/product' },
    { name: 'Solutions', path: '/solutions' },
    { name: 'Resources', path: '/resources' },
    { name: 'Pricing', path: '/pricing' },
  ];

  return (
    <header className="relative w-full z-40 pt-5 md:pt-7 px-4 sm:px-8 md:px-12 lg:px-16 flex items-center justify-between">
      {/* Top Left: GrowNova Logo */}
      <div className="flex-shrink-0">
        <Link to="/" className="inline-block focus:outline-none">
          <GrowNovaLogo size="md" />
        </Link>
      </div>

      {/* Center: Floating Translucent Liquid Glass Navigation Island */}
      <nav className="hidden md:flex items-center">
        <div className="os-nav-island rounded-full px-8 py-3 flex items-center gap-8 text-[15px] font-semibold text-[#102B4E] transition-all duration-300">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="relative transition-colors duration-200 py-1 hover:text-[#C69A43] text-[#102B4E]"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Top Right: Sign in & Get Started */}
      <div className="hidden sm:flex items-center gap-3.5">
        <Link
          to="/auth"
          className="rounded-full px-6 py-2.5 text-[14.5px] font-bold text-[#102B4E] bg-white/80 hover:bg-white backdrop-blur-md border border-white shadow-xs transition-all duration-200 active:scale-95 focus:outline-none"
        >
          Sign in
        </Link>

        <Link
          to="/auth?mode=signup"
          className="group relative rounded-full px-6 py-2.5 text-[14.5px] font-bold text-white gold-glow-btn flex items-center gap-2 transition-all duration-300 active:scale-95 focus:outline-none overflow-hidden"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 stroke-[2.5]" />
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-2">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2.5 rounded-full bg-white/80 backdrop-blur-md border border-white text-[#102B4E] focus:outline-none shadow-sm cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 stroke-[2.5]" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-4 right-4 mt-2 p-5 os-panel-primary rounded-2xl shadow-2xl flex flex-col gap-4 md:hidden z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-3">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[16px] font-bold text-[#102B4E] hover:text-[#C69A43] py-2 px-3 rounded-lg hover:bg-white/60 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-3 border-t border-[#102B4E]/10 flex flex-col gap-2.5">
            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-full text-sm font-bold text-[#102B4E] bg-white/90 border border-white text-center shadow-xs"
            >
              Sign in
            </Link>
            <Link
              to="/auth?mode=signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-full text-sm font-bold text-white gold-glow-btn flex items-center justify-center gap-2 text-center"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
