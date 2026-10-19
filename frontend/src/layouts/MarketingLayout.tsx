import React from 'react';
import { LandingNav } from '../components/navigation/LandingNav';
import { GrowNovaCompassLogo } from '../components/GrowNovaCompassLogo';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowUpRight } from 'lucide-react';

interface MarketingLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export const MarketingLayout: React.FC<MarketingLayoutProps> = ({
  children,
  showNav = true,
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-[#F8F5F1] text-[#102B4E] overflow-x-hidden selection:bg-[#C69A43]/20">
      
      {/* Background Atmosphere - Canonical Misty Mountain Scenery */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out opacity-45"
          style={{
            backgroundImage: "url('/dashboard-bg.jpg')",
            backgroundPosition: 'center 40%',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8F5F1]/85 via-[#F8F5F1]/70 to-[#F8F5F1]/95" />
      </div>

      {/* Shared Navigation with React Router navigation */}
      {showNav && (
        <div className="relative z-30">
          <LandingNav
            onGetStartedClick={() => navigate('/auth?mode=signup')}
            onSignInClick={() => navigate('/auth?mode=signin')}
          />
        </div>
      )}

      {/* Main Page Content with Subtle Smooth Transition */}
      <main className="relative z-10 flex-1 w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
        {children}
      </main>

      {/* Shared Cohesive Footer */}
      <footer className="relative z-20 border-t border-[#102B4E]/10 bg-white/60 backdrop-blur-xl py-12 px-6 sm:px-12 md:px-16 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex flex-col gap-2">
            <Link to="/" className="inline-block focus:outline-none">
              <GrowNovaCompassLogo size="md" showText={true} />
            </Link>
            <p className="text-xs text-[#65758B] max-w-sm mt-1">
              An AI-first, vernacular business operating system engineered for Indian MSMEs. Unifying sales, finance, inventory, compliance and everyday operations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-sm font-semibold text-[#102B4E]">
            <Link to="/product" className="hover:text-[#C69A43] transition-colors">Product</Link>
            <Link to="/solutions" className="hover:text-[#C69A43] transition-colors">Solutions</Link>
            <Link to="/resources" className="hover:text-[#C69A43] transition-colors">Resources</Link>
            <Link to="/pricing" className="hover:text-[#C69A43] transition-colors flex items-center gap-1">
              Pricing <span className="text-[10px] bg-[#C69A43]/15 text-[#C69A43] px-2 py-0.5 rounded-full font-bold">Soon</span>
            </Link>
            <Link to="/dashboard" className="text-[#C69A43] hover:underline font-bold">
              OS Dashboard →
            </Link>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#65758B]">
            <span className="flex items-center gap-1 font-medium bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              100% Indian GST & Statutory Compliant
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-[#102B4E]/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#65758B] gap-4">
          <div>
            © {new Date().getFullYear()} GrowNova Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-5 font-medium">
            <Link to="/pricing" className="hover:text-[#102B4E] transition-colors">Pricing</Link>
            <Link to="/auth" className="hover:text-[#102B4E] transition-colors">Sign In</Link>
            <Link to="/dashboard" className="hover:text-[#102B4E] transition-colors flex items-center gap-1 font-bold">
              Executive OS <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
