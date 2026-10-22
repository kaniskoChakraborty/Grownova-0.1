import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LandingNav } from '../components/navigation/LandingNav';
import { HeroLeft } from '../components/landing/HeroLeft';
import { VisionDashboard } from '../components/landing/VisionDashboard';
import { ChaosVsCalmSection } from '../components/landing/ChaosVsCalmSection';
import { CashflowCalculator } from '../components/landing/CashflowCalculator';
import { DayInYourBusiness } from '../components/landing/DayInYourBusiness';
import { FounderStoriesSection } from '../components/landing/FounderStoriesSection';
import { MigrationGuaranteeSection } from '../components/landing/MigrationGuaranteeSection';
import { CheckCircle2, Bell } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Subtle 3D tilt tracking for spatial immersion
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden bg-[#F8F5F1] text-[#102B4E] flex flex-col justify-between selection:bg-[#C69A43]/20">
      
      {/* ============================================================== */}
      {/* 1. CINEMATIC BACKGROUND ENVIRONMENT LAYER (CANONICAL MOUNTAIN) */}
      {/* ============================================================== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Photographic mountain backdrop image with subtle 3D mouse parallax */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out opacity-85"
          style={{
            backgroundImage: "url('/dashboard-bg.jpg')",
            backgroundPosition: 'center 42%',
            transform: `scale(1.04) translate(${mousePos.x * -4}px, ${mousePos.y * -4}px)`,
          }}
        />

        {/* Ambient Warm Golden Hour Light Blooms and Vignette */}
        <div 
          className="absolute top-0 right-1/4 w-[650px] h-[550px] bg-gradient-to-br from-amber-200/40 via-amber-100/20 to-transparent rounded-full blur-3xl pointer-events-none mix-blend-screen transition-transform duration-700"
          style={{ transform: `translate(${mousePos.x * 6}px, ${mousePos.y * 6}px)` }}
        />
        <div 
          className="absolute top-1/3 right-10 w-[550px] h-[450px] bg-gradient-to-l from-orange-200/25 via-yellow-100/20 to-transparent rounded-full blur-2xl pointer-events-none mix-blend-screen"
        />

        {/* Subtle Floating Iridescent Glass Orbs for Optical Refraction */}
        <div 
          className="absolute top-1/4 left-1/6 w-72 h-72 rounded-full bg-gradient-to-tr from-sky-200/30 via-white/20 to-amber-100/25 blur-xl pointer-events-none animate-float-gentle"
          style={{ animationDuration: '8s' }}
        />
        <div 
          className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-gradient-to-br from-amber-100/30 via-white/20 to-emerald-100/20 blur-xl pointer-events-none animate-float-gentle"
          style={{ animationDuration: '11s', animationDelay: '-3s' }}
        />
        
        {/* Soft atmospheric gradient wash to ensure crisp contrast without washing out scenery */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-[48%] bg-gradient-to-r from-[#F8F5F1]/45 via-[#F8F5F1]/15 to-transparent pointer-events-none" />
        
        {/* Soft top gradient */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#F8F5F1]/60 to-transparent pointer-events-none" />

        {/* Bottom subtle atmospheric wash */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F8F5F1]/65 via-transparent to-transparent pointer-events-none" />
      </div>


      {/* ============================================================== */}
      {/* 2. SHARED TOP NAVIGATION WITH CLIENT-SIDE ROUTING              */}
      {/* ============================================================== */}
      <LandingNav
        onGetStartedClick={() => navigate('/auth?mode=signup')}
        onSignInClick={() => navigate('/auth?mode=signin')}
      />

      {/* ============================================================== */}
      {/* 3. MAIN HERO SECTION (LEFT COPY + RIGHT VISIONOS DASHBOARD)     */}
      {/* ============================================================== */}
      <main className="relative z-10 w-full flex-1 flex items-center px-4 sm:px-6 md:px-10 lg:px-12 py-1.5 sm:py-2.5 max-w-[1720px] mx-auto">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-5 lg:gap-8 xl:gap-12">
          
          {/* LEFT COLUMN: MARKETING COPY & CTAS IN SPATIAL GLASS CARD */}
          <div 
            className="w-full lg:w-[42%] xl:w-[40%] flex-shrink-0 flex justify-center lg:justify-start transition-transform duration-300 ease-out"
            style={{
              perspective: '1200px',
              transform: `rotateY(${mousePos.x * 1.5 + 1}deg) rotateX(${mousePos.y * -1 - 0.5}deg)`,
            }}
          >
            <HeroLeft
              onStartClick={() => navigate('/auth?mode=signup')}
              onExploreClick={() => {
                const el = document.getElementById('ecosystem');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else navigate('/product');
              }}
            />
          </div>

          {/* RIGHT COLUMN: CANONICAL GROWNOVA OS DASHBOARD PREVIEW */}
          <div className="w-full lg:w-[58%] xl:w-[60%] flex justify-center lg:justify-end items-center relative min-w-0">
            <div className="w-full flex flex-col items-center lg:items-end">
              
              {/* Luminous Glass Preview Pill */}
              <Link
                to="/dashboard"
                className="mb-2 px-3.5 py-1 rounded-full glass-pill-container text-[11.5px] font-bold text-[#102B4E] hover:text-[#C69A43] shadow-2xs flex items-center gap-2 transition-all hover:scale-[1.02] border border-white/95 cursor-pointer select-none"
              >
                <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse" />
                <span>Executive OS Preview</span>
                <span className="text-[#C69A43] font-extrabold flex items-center gap-0.5 underline">
                  Launch Fullscreen OS →
                </span>
              </Link>

              {/* 3D Glass Dashboard Container with Inverse Spatial Perspective */}
              <div 
                className="w-full flex justify-center lg:justify-end transition-transform duration-300 ease-out"
                style={{
                  perspective: '1200px',
                  transform: `rotateY(${mousePos.x * -2 - 1.5}deg) rotateX(${mousePos.y * 1 + 0.5}deg)`,
                }}
              >
                <VisionDashboard 
                  onActionClick={(action) => {
                    triggerToast(`Opening ${action} in GrowNova OS...`);
                    setTimeout(() => {
                      navigate('/dashboard');
                    }, 400);
                  }}
                />
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ============================================================== */}
      {/* 4. BOTTOM FLOATING GLASS STATUS TELEMETRY DOCK                 */}
      {/* ============================================================== */}
      <div className="relative z-30 w-full px-4 sm:px-8 pb-2 sm:pb-3 pt-0.5 flex flex-col items-center gap-2">
        <div className="glass-telemetry-dock rounded-full px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-3 sm:gap-6 text-xs text-[#102B4E] max-w-4xl w-full">
          <div className="flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse" />
            <span className="text-[#102B4E]">GrowNova OS v2.4</span>
            <span className="text-[#65758B] hidden sm:inline">• Active in 28 States</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[#65758B] text-[11px] font-medium">
            <span>GST & E-Way Ready</span>
            <span>•</span>
            <span>Multi-User RBAC</span>
            <span>•</span>
            <span>Automated Daily Backup</span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                const el = document.getElementById('chaos-vs-calm');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="font-bold text-[#C69A43] hover:underline flex items-center gap-1 cursor-pointer text-xs"
            >
              <span>See Chaos vs. Calm ↓</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 5. CONNECTING SECTIONS: CHAOS VS CALM, CALCULATOR, DAY IN LIFE */}
      {/* ============================================================== */}
      <div id="chaos-vs-calm">
        <ChaosVsCalmSection onCtaClick={() => navigate('/auth?mode=signup')} />
      </div>

      <div id="calculator">
        <CashflowCalculator onCtaClick={() => navigate('/auth?mode=signup')} />
      </div>

      <div id="day-in-life">
        <DayInYourBusiness onCtaClick={() => navigate('/dashboard')} />
      </div>

      <div id="stories">
        <FounderStoriesSection />
      </div>

      <div id="guarantee">
        <MigrationGuaranteeSection onCtaClick={() => navigate('/auth?mode=signup')} />
      </div>

      {/* Big Glass Emotional Call to Action Banner */}
      <section className="relative z-20 w-full py-16 sm:py-20 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto">
        <div className="glass-bento-card p-8 sm:p-14 text-center relative overflow-hidden rounded-3xl">
          <div className="absolute -inset-full w-[250%] h-[250%] glass-shine opacity-30 pointer-events-none transform -rotate-12 translate-x-12 -translate-y-24" />
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-[#C69A43]/40 text-xs font-extrabold text-[#C69A43] uppercase tracking-wider mb-4">
            <span>BEGIN YOUR CALM BUSINESS ERA</span>
          </div>

          <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[#102B4E] mb-4 tracking-tight">
            Your business deserves better <br />
            <span className="radiant-gold-text">than endless firefighting.</span>
          </h3>
          
          <p className="text-sm sm:text-base text-[#52647C] max-w-2xl mx-auto mb-8 leading-relaxed">
            Stop losing hours to delayed udhari, missing paper challans, and stressful CA calls. Deploy GrowNova OS in under 5 minutes and see your entire business in complete harmony.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <button
              onClick={() => navigate('/auth?mode=signup')}
              className="px-8 py-3.5 rounded-full font-bold text-white gold-glow-btn shadow-lg hover:shadow-xl transition-all cursor-pointer text-sm"
            >
              Get Started Free — In 5 Mins →
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-7 py-3.5 rounded-full font-bold text-[#102B4E] bg-white/80 hover:bg-white backdrop-blur-md border border-white shadow-2xs hover:shadow-sm transition-all cursor-pointer text-sm"
            >
              Launch Live OS Demo
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#65758B]">
            <span className="text-[#15803D]">✓ No Credit Card Required</span>
            <span>•</span>
            <span>✓ 1-Click Tally & Excel Import</span>
            <span>•</span>
            <span>✓ Human Support on WhatsApp</span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. GLASS FOOTER                                                */}
      {/* ============================================================== */}
      <footer className="relative z-20 border-t border-white/80 bg-white/40 backdrop-blur-xl py-10 px-4 sm:px-8 md:px-12 text-xs text-[#65758B]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#102B4E] text-sm">GrowNova OS</span>
            <span>•</span>
            <span>Engineered for Indian Micro, Small & Medium Enterprises</span>
          </div>
          <div className="flex items-center gap-6 font-medium text-[#102B4E]">
            <Link to="/product" className="hover:text-[#C69A43]">Product</Link>
            <Link to="/solutions" className="hover:text-[#C69A43]">Solutions</Link>
            <Link to="/resources" className="hover:text-[#C69A43]">Resources</Link>
            <Link to="/pricing" className="hover:text-[#C69A43]">Pricing</Link>
            <Link to="/dashboard" className="text-[#C69A43] font-bold">Launch OS →</Link>
          </div>
          <div>
            © {new Date().getFullYear()} GrowNova Technologies Pvt. Ltd. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ============================================================== */}
      {/* 7. INTERACTIVE NOTIFICATION TOAST                              */}
      {/* ============================================================== */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 flex items-center gap-2.5 px-4.5 py-2.5 rounded-full glass-pill-container shadow-2xl border border-white/95 animate-in fade-in slide-in-from-top-4 duration-300">
          <Bell className="w-4 h-4 text-[#C69A43]" />
          <span className="text-xs font-semibold text-[#102B4E]">{toastMessage}</span>
          <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
        </div>
      )}


    </div>
  );
};

export default LandingPage;
