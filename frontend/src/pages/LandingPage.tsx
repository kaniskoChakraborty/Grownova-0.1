import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingNav } from '../components/navigation/LandingNav';
import { HeroLeft } from '../components/HeroLeft';
import { VisionDashboard } from '../components/VisionDashboard';
import { ReferenceCompare } from '../components/ReferenceCompare';
import { CheckCircle2, Sparkles } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Subtle 3D tilt tracking for visionOS spatial immersion
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
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden bg-[#FBF8F1] text-[#0B1E36] flex flex-col justify-between selection:bg-[#C2831E]/25">
      
      {/* ============================================================== */}
      {/* 1. CINEMATIC BACKGROUND ENVIRONMENT LAYER */}
      {/* ============================================================== */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Photographic background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: "url('/hero-bg.jpg')",
            transform: `scale(1.02) translate(${mousePos.x * -4}px, ${mousePos.y * -4}px)`,
          }}
        />

        {/* Warm Golden Hour Light Blooms and Vignette */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-gradient-to-br from-amber-200/40 via-amber-100/15 to-transparent rounded-full blur-3xl pointer-events-none mix-blend-screen" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[400px] bg-gradient-to-l from-orange-200/25 via-yellow-100/20 to-transparent rounded-full blur-2xl pointer-events-none mix-blend-screen" />
        
        {/* Delicate Soft Light Veil behind left copy for high contrast text readability without washing out the heritage scene */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-[46%] bg-gradient-to-r from-white/65 via-white/30 to-transparent pointer-events-none" />
        
        {/* Soft top gradient */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#FFFDF8]/70 to-transparent pointer-events-none" />

        {/* Bottom subtle desk shading */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0B1E36]/15 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* ============================================================== */}
      {/* 2. OPTIONAL REFERENCE IMAGE GHOST OVERLAY (FOR QA & PIXEL FIDELITY) */}
      {/* ============================================================== */}
      {overlayOpacity > 0 && (
        <div 
          className="absolute inset-0 z-50 pointer-events-none transition-opacity duration-200"
          style={{
            backgroundImage: "url('/reference.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: overlayOpacity,
            mixBlendMode: overlayOpacity === 1 ? 'normal' : 'difference',
          }}
        />
      )}

      {/* ============================================================== */}
      {/* 3. SHARED TOP NAVIGATION WITH CLIENT-SIDE ROUTING */}
      {/* ============================================================== */}
      <LandingNav
        onGetStartedClick={() => navigate('/auth?mode=signup')}
        onSignInClick={() => navigate('/auth?mode=signin')}
      />

      {/* ============================================================== */}
      {/* 4. MAIN HERO SECTION (LEFT COPY + RIGHT VISIONOS DASHBOARD) */}
      {/* ============================================================== */}
      <main className="relative z-10 w-full flex-1 flex items-center px-4 sm:px-6 md:px-10 lg:px-12 py-4 md:py-6 max-w-[1720px] mx-auto">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 xl:gap-12">
          
          {/* LEFT COLUMN: MARKETING COPY & CTAS */}
          <div className="w-full lg:w-[38%] xl:w-[35%] flex-shrink-0 flex justify-center lg:justify-start">
            <HeroLeft
              onStartClick={() => navigate('/auth?mode=signup')}
              onExploreClick={() => navigate('/product')}
            />
          </div>

          {/* RIGHT COLUMN: VISIONOS LIQUID GLASS DASHBOARD */}
          <div className="w-full lg:w-[62%] xl:w-[65%] flex justify-center lg:justify-end items-center relative min-w-0">
            <div 
              className="w-full flex justify-center lg:justify-end transition-transform duration-300 ease-out"
              style={{
                perspective: '1200px',
                transform: `rotateY(${mousePos.x * -2.5 - 2.5}deg) rotateX(${mousePos.y * 1.5 + 0.8}deg)`,
              }}
            >
              <VisionDashboard 
                onActionClick={(action) => triggerToast(`Action Triggered: ${action}`)}
              />
            </div>
          </div>

        </div>
      </main>

      {/* ============================================================== */}
      {/* 5. INTERACTIVE NOTIFICATION TOAST */}
      {/* ============================================================== */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full vision-glass-container shadow-xl border border-white/80 animate-in fade-in slide-in-from-top-4 duration-300">
          <Sparkles className="w-4 h-4 text-[#C2831E]" />
          <span className="text-xs font-semibold text-[#0B1E36]">{toastMessage}</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. REFERENCE VERIFICATION TOOL (BOTTOM-RIGHT) */}
      {/* ============================================================== */}
      <ReferenceCompare
        overlayOpacity={overlayOpacity}
        onOpacityChange={setOverlayOpacity}
      />

    </div>
  );
};
