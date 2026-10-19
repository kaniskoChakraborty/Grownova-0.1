import React from 'react';
import { Link } from 'react-router-dom';
import { GrowNovaCompassLogo } from '../components/GrowNovaCompassLogo';
import { Home, LayoutDashboard, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-[#F8F5F1] text-[#102B4E] overflow-hidden selection:bg-[#C69A43]/20 select-none">
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-45"
          style={{
            backgroundImage: "url('/dashboard-bg.jpg')",
            backgroundPosition: 'center 45%',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8F5F1]/90 via-[#F8F5F1]/82 to-[#F8F5F1]/92" />
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[400px] bg-gradient-to-br from-amber-200/25 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Main 404 Glass Card */}
      <div className="relative z-10 w-full max-w-lg gn-panel rounded-[36px] p-8 sm:p-12 shadow-2xl border border-white/95 bg-white/90 text-center">
        
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <GrowNovaCompassLogo size="md" showText={true} />
        </div>

        {/* 404 Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 text-[#C69A43] text-xs font-black tracking-widest uppercase mb-4 border border-[#C69A43]/20">
          <Compass className="w-3.5 h-3.5" />
          <span>Error 404 • Destination Not Found</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0B2340] mb-3">
          Page not found.
        </h1>

        <p className="text-xs sm:text-sm text-[#65758B] font-medium leading-relaxed max-w-sm mx-auto mb-8">
          The route or module you attempted to access does not exist or has been relocated within GrowNova OS.
        </p>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-bold text-white gold-glow-btn flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>

          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-bold text-[#102B4E] gn-card-secondary hover:bg-white flex items-center justify-center gap-2 border border-white shadow-2xs cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4 text-[#C69A43]" />
            <span>Executive Dashboard</span>
          </Link>
        </div>

        {/* Quick Links Matrix */}
        <div className="pt-6 border-t border-[#102B4E]/10 grid grid-cols-3 gap-2 text-xs font-semibold text-[#65758B]">
          <Link to="/product" className="hover:text-[#C69A43] transition-colors py-1">
            Product
          </Link>
          <Link to="/solutions" className="hover:text-[#C69A43] transition-colors py-1">
            Solutions
          </Link>
          <Link to="/pricing" className="hover:text-[#C69A43] transition-colors py-1">
            Pricing
          </Link>
        </div>

      </div>

    </div>
  );
};

export default NotFoundPage;
