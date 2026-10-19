import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Zap, ShieldCheck, ArrowLeft, Bell, CheckCircle2 } from 'lucide-react';
import { GrowNovaCompassLogo } from '../GrowNovaCompassLogo';
import { AuthTabs } from './AuthTabs';
import { AuthForm } from './AuthForm';
import { GrowNovaPreview } from './GrowNovaPreview';

interface AuthShellProps {
  initialMode?: 'signin' | 'signup';
}

export const AuthShell: React.FC<AuthShellProps> = ({ initialMode = 'signin' }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(initialMode);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-3 sm:p-5 md:p-8 lg:p-10 overflow-x-hidden select-none bg-[#F8F5F1]">
      
      {/* 1. CINEMATIC BACKGROUND: CANONICAL MISTY MOUNTAIN ENVIRONMENT */}
      <div className="fixed inset-0 z-0">
        <img
          src="/dashboard-bg.jpg"
          alt="GrowNova OS Executive Environment"
          className="w-full h-full object-cover object-center filter brightness-[1.01] contrast-[1.01]"
        />
        {/* Soft Golden Morning Atmosphere Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#102B4E]/25 via-transparent to-[#F8F5F1]/30 pointer-events-none" />
        {/* Warm Ambient Sunlight Radial Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(213,173,102,0.18)_0%,transparent_65%)] pointer-events-none" />
      </div>

      {/* Floating Return to Home Button */}
      <Link
        to="/"
        className="fixed top-4 left-4 z-40 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/75 hover:bg-white/95 backdrop-blur-md border border-white/90 shadow-sm text-xs font-semibold text-[#102B4E] transition-all hover:scale-105 active:scale-95"
      >
        <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Return to Home</span>
      </Link>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full gn-panel shadow-xl border border-white/90 animate-in fade-in slide-in-from-top-4 duration-300 bg-white/95">
          <Bell className="w-4 h-4 text-[#C69A43]" />
          <span className="text-xs font-semibold text-[#102B4E]">{toastMessage}</span>
          <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
        </div>
      )}

      {/* 2. MAIN DUAL LIQUID GLASS CONTAINER (TWO PANELS SIDE-BY-SIDE) */}
      <div className="relative z-10 w-full max-w-[1240px] grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch my-auto">
        
        {/* LEFT PANEL: MARKETING & VISIONOS DASHBOARD PREVIEW */}
        <div 
          className="lg:col-span-6 rounded-[28px] sm:rounded-[34px] border border-white/90 shadow-[0_30px_65px_-15px_rgba(16,43,78,0.18),inset_0_2px_3px_0_rgba(255,255,255,0.95),inset_0_-2px_3px_0_rgba(255,255,255,0.4)] p-5 sm:p-7 md:p-8 flex flex-col justify-between transition-all duration-300 bg-white/75 backdrop-blur-2xl"
        >
          {/* Top Section */}
          <div>
            {/* GrowNova OS Brand Logo */}
            <div className="flex items-center justify-between mb-4">
              <Link to="/" className="inline-block transition-transform hover:scale-[1.02]">
                <GrowNovaCompassLogo size="sm" showText={true} />
              </Link>
            </div>

            {/* Editorial Headline */}
            <h1 className="font-serif text-[32px] sm:text-[38px] xl:text-[42px] leading-[1.08] tracking-tight font-medium mb-2.5">
              <span className="text-[#0B2340] block font-semibold drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
                Your business.
              </span>
              <span className="text-[#C69A43] block font-semibold drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
                In better hands.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-[13px] sm:text-[14px] text-[#65758B] font-medium leading-[1.55] max-w-[480px] mb-4">
              One operating system for sales, finance, inventory, people, compliance and everyday operations.
            </p>

            {/* Three Feature Indicators Horizontally */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center text-[#C69A43]">
                  <BarChart3 className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold text-[#102B4E]">All-in-one platform</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-sky-100 flex items-center justify-center text-sky-700">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold text-[#102B4E]">Axiom AI Intelligence</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-[#15803D]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold text-[#102B4E]">Built for India (GST ready)</span>
              </div>
            </div>
          </div>

          {/* Interactive GrowNova OS Compact Preview */}
          <div className="pt-2">
            <GrowNovaPreview />
          </div>

        </div>

        {/* RIGHT PANEL: SIGN IN & SIGN UP FORM */}
        <div 
          className="lg:col-span-6 rounded-[28px] sm:rounded-[34px] border border-white/90 shadow-[0_30px_65px_-15px_rgba(16,43,78,0.18),inset_0_2px_3px_0_rgba(255,255,255,0.95),inset_0_-2px_3px_0_rgba(255,255,255,0.4)] p-6 sm:p-8 md:p-10 flex flex-col justify-between transition-all duration-300 bg-white/85 backdrop-blur-2xl"
        >
          <div>
            {/* Header Titles */}
            <div className="text-center mb-6">
              <h2 className="font-serif text-[28px] sm:text-[34px] font-bold text-[#0B2340] tracking-tight">
                {activeTab === 'signin' ? 'Welcome back' : 'Get started with GrowNova'}
              </h2>
              <p className="text-xs sm:text-[13px] text-[#65758B] mt-1 font-medium">
                {activeTab === 'signin' 
                  ? 'Sign in to access your business operating system' 
                  : 'Start your journey with an all-in-one workspace built for India'}
              </p>
            </div>

            {/* Sign In / Sign Up Capsule Tabs */}
            <div className="mb-6 flex justify-center">
              <AuthTabs activeTab={activeTab} onChange={setActiveTab} />
            </div>

            {/* Authentication Form with Demo Mode buttons */}
            <AuthForm 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              onSuccessToast={showToast}
            />
          </div>

          {/* Bottom Security Assurance */}
          <div className="pt-6 border-t border-[#102B4E]/10 flex items-center justify-between text-[11px] text-[#65758B]">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
              <span>256-Bit Encrypted Statutory Core</span>
            </span>
            <span className="font-semibold text-[#102B4E]">
              MSME Verified Platform
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AuthShell;
