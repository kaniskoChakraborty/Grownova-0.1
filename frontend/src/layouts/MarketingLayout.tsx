import React, { useState } from 'react';
import { LandingNav } from '../components/navigation/LandingNav';
import { GrowNovaLogo } from '../components/GrowNovaLogo';
import { Link } from 'react-router-dom';
import { CheckCircle2, Sparkles, Shield, ArrowUpRight } from 'lucide-react';

interface MarketingLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export const MarketingLayout: React.FC<MarketingLayoutProps> = ({
  children,
  showNav = true,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#FBF8F1] text-[#0B1E36] overflow-x-hidden selection:bg-[#C2831E]/25">
      {/* Shared Navigation */}
      {showNav && (
        <LandingNav
          onGetStartedClick={() => triggerToast('GrowNova onboarding initiated. Welcome!')}
          onSignInClick={() => triggerToast('Opening secure business login...')}
        />
      )}

      {/* Main Page Content with Subtle Smooth Transition */}
      <main className="flex-1 w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
        {children}
      </main>

      {/* Shared Cohesive Footer */}
      <footer className="relative z-20 border-t border-[#0B1E36]/10 bg-white/40 backdrop-blur-xl py-12 px-6 sm:px-12 md:px-16 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex flex-col gap-2">
            <GrowNovaLogo size="md" />
            <p className="text-xs text-[#475569] max-w-sm mt-1">
              An AI-first, vernacular business operating system engineered for Indian MSMEs. Unifying sales, finance, inventory, compliance and everyday operations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-sm font-semibold text-[#0B1E36]">
            <Link to="/product" className="hover:text-[#C2831E] transition-colors">Product</Link>
            <Link to="/solutions" className="hover:text-[#C2831E] transition-colors">Solutions</Link>
            <Link to="/resources" className="hover:text-[#C2831E] transition-colors">Resources</Link>
            <Link to="/pricing" className="hover:text-[#C2831E] transition-colors flex items-center gap-1">
              Pricing <span className="text-[10px] bg-[#C2831E]/15 text-[#C2831E] px-2 py-0.5 rounded-full font-bold">Soon</span>
            </Link>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#475569]">
            <span className="flex items-center gap-1 font-medium bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              100% Indian GST & Statutory Compliant
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-[#0B1E36]/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-4">
          <div>
            © {new Date().getFullYear()} GrowNova Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-5">
            <span className="hover:text-[#0B1E36] transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#0B1E36] transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#0B1E36] transition-colors cursor-pointer flex items-center gap-1">
              Security <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </footer>

      {/* Floating Interactive Toast */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full vision-glass-container shadow-xl border border-white/80 animate-in fade-in slide-in-from-top-4 duration-300">
          <Sparkles className="w-4 h-4 text-[#C2831E]" />
          <span className="text-xs font-semibold text-[#0B1E36]">{toastMessage}</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
      )}
    </div>
  );
};
