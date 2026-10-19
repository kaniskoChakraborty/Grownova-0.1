import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LandingNav } from '../components/navigation/LandingNav';
import { HeroLeft } from '../components/HeroLeft';
import { VisionDashboard } from '../components/VisionDashboard';
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
        {/* Photographic background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: "url('/dashboard-bg.jpg')",
            backgroundPosition: 'center 45%',
            transform: `scale(1.02) translate(${mousePos.x * -3}px, ${mousePos.y * -3}px)`,
          }}
        />

        {/* Warm Golden Hour Light Blooms and Vignette */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-gradient-to-br from-amber-200/35 via-amber-100/15 to-transparent rounded-full blur-3xl pointer-events-none mix-blend-screen" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[400px] bg-gradient-to-l from-orange-200/20 via-yellow-100/15 to-transparent rounded-full blur-2xl pointer-events-none mix-blend-screen" />
        
        {/* Soft atmospheric gradient wash to guarantee high contrast */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-[48%] bg-gradient-to-r from-[#F8F5F1]/85 via-[#F8F5F1]/55 to-transparent pointer-events-none" />
        
        {/* Soft top gradient */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#F8F5F1]/80 to-transparent pointer-events-none" />

        {/* Bottom subtle atmospheric wash */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F8F5F1]/85 via-transparent to-transparent pointer-events-none" />
      </div>


      {/* ============================================================== */}
      {/* 3. SHARED TOP NAVIGATION WITH CLIENT-SIDE ROUTING              */}
      {/* ============================================================== */}
      <LandingNav
        onGetStartedClick={() => navigate('/auth?mode=signup')}
        onSignInClick={() => navigate('/auth?mode=signin')}
      />

      {/* ============================================================== */}
      {/* 4. MAIN HERO SECTION (LEFT COPY + RIGHT VISIONOS DASHBOARD)     */}
      {/* ============================================================== */}
      <main className="relative z-10 w-full flex-1 flex items-center px-4 sm:px-6 md:px-10 lg:px-12 py-4 md:py-6 max-w-[1720px] mx-auto">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 xl:gap-12">
          
          {/* LEFT COLUMN: MARKETING COPY & CTAS */}
          <div className="w-full lg:w-[40%] xl:w-[38%] flex-shrink-0 flex justify-center lg:justify-start">
            <HeroLeft
              onStartClick={() => navigate('/auth?mode=signup')}
              onExploreClick={() => navigate('/product')}
            />
          </div>

          {/* RIGHT COLUMN: CANONICAL GROWNOVA OS DASHBOARD PREVIEW */}
          <div className="w-full lg:w-[60%] xl:w-[62%] flex justify-center lg:justify-end items-center relative min-w-0">
            <div className="w-full flex flex-col items-center lg:items-end">
              <Link
                to="/dashboard"
                className="mb-2.5 px-4 py-1.5 rounded-full os-nav-island text-xs font-bold text-[#102B4E] hover:text-[#C69A43] shadow-sm flex items-center gap-2 transition-all hover:scale-[1.02] border border-white cursor-pointer select-none"
              >
                <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse" />
                <span>Executive OS Preview</span>
                <span className="text-[#C69A43] font-extrabold flex items-center gap-0.5 underline">
                  Launch Fullscreen OS →
                </span>
              </Link>
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
      {/* 5. INTERACTIVE NOTIFICATION TOAST                              */}
      {/* Floating Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full os-nav-island shadow-xl border border-white/80 animate-in fade-in slide-in-from-top-4 duration-300">
          <Bell className="w-4 h-4 text-[#C69A43]" />
          <span className="text-xs font-semibold text-[#102B4E]">{toastMessage}</span>
          <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
        </div>
      )}

    </div>
  );
};

export default LandingPage;
