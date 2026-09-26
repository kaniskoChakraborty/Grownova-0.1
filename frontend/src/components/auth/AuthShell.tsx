import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Zap, ShieldCheck, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { GrowNovaLogo } from '../GrowNovaLogo';
import { AuthTabs } from './AuthTabs';
import { AuthForm } from './AuthForm';
import { GrowNovaPreview } from './GrowNovaPreview';

interface AuthShellProps {
  initialMode?: 'signin' | 'signup';
}

export const AuthShell = ({ initialMode = 'signin' }: AuthShellProps) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(initialMode);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-3 sm:p-5 md:p-8 lg:p-10 overflow-x-hidden select-none bg-[#F7F3EA]">
      {/* ============================================================== */}
      {/* 1. CINEMATIC BACKGROUND: WARM INDIAN HERITAGE DESK ENVIRONMENT */}
      {/* ============================================================== */}
      <div className="fixed inset-0 z-0">
        <img
          src="/hero-bg.jpg"
          alt="GrowNova Executive Desk Environment"
          className="w-full h-full object-cover object-center filter brightness-[1.02] contrast-[1.01]"
        />
        {/* Soft Golden Sunset Atmosphere Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0B1E36]/25 via-transparent to-[#FBF8F1]/20 pointer-events-none"></div>
        {/* Warm Ambient Sunlight Radial Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(246,188,71,0.18)_0%,transparent_65%)] pointer-events-none"></div>
      </div>

      {/* Floating Return to Home Button */}
      <Link
        to="/"
        className="fixed top-4 left-4 z-40 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 hover:bg-white/90 backdrop-blur-md border border-white/80 shadow-sm text-xs font-semibold text-[#0B1E36] transition-all hover:scale-105 active:scale-95"
      >
        <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Return to Home</span>
      </Link>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full vision-glass-container shadow-xl border border-white/90 animate-in fade-in slide-in-from-top-4 duration-300">
          <Sparkles className="w-4 h-4 text-[#C2831E]" />
          <span className="text-xs font-semibold text-[#0B1E36]">{toastMessage}</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. MAIN DUAL LIQUID GLASS CONTAINER (TWO PANELS SIDE-BY-SIDE)   */}
      {/* ============================================================== */}
      <div className="relative z-10 w-full max-w-[1280px] grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4.5 lg:gap-5 items-stretch my-auto">
        
        {/* ============================================================ */}
        {/* LEFT PANEL: MARKETING & VISIONOS DASHBOARD PREVIEW          */}
        {/* ============================================================ */}
        <div 
          className="lg:col-span-6 xl:col-span-6 rounded-[28px] sm:rounded-[34px] border border-white/80 shadow-[0_30px_65px_-15px_rgba(11,30,54,0.22),inset_0_2px_3px_0_rgba(255,255,255,0.95),inset_0_-2px_3px_0_rgba(255,255,255,0.4)] p-5 sm:p-7 md:p-8 flex flex-col justify-between transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.35) 100%)',
            backdropFilter: 'blur(28px) saturate(175%)',
            WebkitBackdropFilter: 'blur(28px) saturate(175%)',
          }}
        >
          
          {/* Top Section: Logo, Editorial Headline, Subtitle */}
          <div>
            {/* GrowNova Brand Logo */}
            <div className="flex items-center justify-between mb-4">
              <Link to="/" className="inline-block transition-transform hover:scale-[1.02]">
                <GrowNovaLogo size="sm" showSubtitle={true} />
              </Link>
            </div>

            {/* Editorial Headline: Your business. In better hands. */}
            <h1 className="font-serif text-[32px] sm:text-[38px] xl:text-[44px] leading-[1.08] tracking-[-0.015em] font-medium mb-2.5">
              <span className="text-[#0B1E36] block font-semibold drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
                Your business.
              </span>
              <span className="text-[#B0782D] block font-semibold drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
                In better hands.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-[13px] sm:text-[14px] text-[#475569] font-medium leading-[1.55] max-w-[480px] mb-4 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
              One operating system for sales, finance, inventory, people, compliance and everyday operations.
            </p>

            {/* Three Feature Indicators Horizontally */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 pb-4">
              {/* Feature 1 */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/75 border border-white/95 shadow-2xs flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-4 h-4 text-[#B0782D] stroke-[2.2]" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[11.5px] font-bold text-[#0B1E36]">All-in-one</span>
                  <span className="text-[10px] font-medium text-[#55677D]">business platform</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/75 border border-white/95 shadow-2xs flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-[#0B1E36] stroke-[2.2]" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[11.5px] font-bold text-[#0B1E36]">AI-powered</span>
                  <span className="text-[10px] font-medium text-[#55677D]">decisions (Axiom)</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/75 border border-white/95 shadow-2xs flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#0B1E36] stroke-[2.2]" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[11.5px] font-bold text-[#0B1E36]">Built for India</span>
                  <span className="text-[10px] font-medium text-[#55677D]">compliance ready</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Miniature Floating GrowNova Dashboard Preview */}
          <div className="mt-2 pt-2">
            <GrowNovaPreview />
          </div>

        </div>

        {/* ============================================================ */}
        {/* RIGHT PANEL: CLEAN VISIONOS AUTHENTICATION SLAB             */}
        {/* ============================================================ */}
        <div 
          className="lg:col-span-6 xl:col-span-6 rounded-[28px] sm:rounded-[34px] border border-white/80 shadow-[0_30px_65px_-15px_rgba(11,30,54,0.22),inset_0_2px_3px_0_rgba(255,255,255,0.95),inset_0_-2px_3px_0_rgba(255,255,255,0.4)] p-6 sm:p-9 md:p-12 flex flex-col justify-center transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.35) 100%)',
            backdropFilter: 'blur(28px) saturate(175%)',
            WebkitBackdropFilter: 'blur(28px) saturate(175%)',
          }}
        >
          
          <div className="w-full max-w-[420px] mx-auto my-auto">
            {/* Header: Editorial Serif Heading & Subtitle */}
            <div className="text-center mb-6">
              <h2 className="font-serif text-[32px] sm:text-[38px] leading-[1.1] font-semibold text-[#0B1E36] tracking-tight">
                {activeTab === 'signin' ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="text-[13.5px] sm:text-[14.5px] text-[#55677D] font-medium mt-1.5">
                {activeTab === 'signin'
                  ? 'Sign in to your GrowNova account'
                  : 'Start running your business with GrowNova.'}
              </p>
            </div>

            {/* Segmented Glass Tab Switch */}
            <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Form Fields & Primary Action Button */}
            <AuthForm
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onSuccessToast={showToast}
            />
          </div>

        </div>

      </div>
    </div>
  );
};
