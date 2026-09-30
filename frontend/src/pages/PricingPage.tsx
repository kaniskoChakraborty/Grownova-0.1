import React, { useState } from 'react';
import { MarketingLayout } from '../layouts/MarketingLayout';
import { ArrowRight, Bell, Sparkles, CheckCircle2, X, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PricingPage = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        // Auto close after 3 seconds
        setTimeout(() => {
          setModalOpen(false);
          setSubmitted(false);
          setEmail('');
        }, 1500);
      }, 500);
    }
  };

  return (
    <MarketingLayout showNav={true}>
      <div className="relative min-h-[calc(100vh-180px)] w-full flex items-center justify-center px-4 sm:px-8 py-12 overflow-hidden">
        
        {/* ============================================================== */}
        {/* 1. ATMOSPHERIC VISIONOS GLASS BACKGROUND */}
        {/* ============================================================== */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Subtle warm architectural texture */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-multiply blur-sm"
            style={{ backgroundImage: "url('/hero-bg.jpg')" }}
          />

          {/* Warm ivory and soft navy glow orbs */}
          <div className="absolute top-1/4 left-1/3 w-[550px] h-[450px] bg-gradient-to-br from-amber-200/35 via-amber-100/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[400px] bg-gradient-to-tl from-[#0B1E36]/15 via-blue-100/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          {/* Subtle floating glass visual behind content */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[420px] bg-white/20 backdrop-blur-2xl rounded-[40px] border border-white/50 -rotate-2 pointer-events-none shadow-2xl opacity-75"></div>
        </div>

        {/* ============================================================== */}
        {/* 2. CENTERED COMING SOON CONTENT CONTAINER */}
        {/* ============================================================== */}
        <div className="relative z-10 max-w-2xl w-full text-center vision-glass-container rounded-[36px] p-8 sm:p-14 border border-white shadow-2xl backdrop-blur-3xl">
          
          {/* Small Eyebrow: GROWNOVA */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#B57716] text-xs font-extrabold tracking-[0.24em] mb-6">
            <Lock className="w-3 h-3" />
            <span>GROWNOVA</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-[42px] sm:text-[54px] md:text-[62px] text-[#0B1E36] font-medium leading-[1.08] mb-5">
            Pricing is coming soon.
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-[#334155] font-medium leading-relaxed max-w-lg mx-auto mb-10">
            We're building plans that grow with your business.
            <br />
            Stay tuned.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            {/* Back to GrowNova -> Navigates to / */}
            <button
              onClick={() => navigate('/')}
              className="group w-full sm:w-auto rounded-full px-8 py-3.5 text-sm sm:text-base font-bold text-white gold-glow-btn flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <span>Back to GrowNova</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Get Notified Button */}
            <button
              onClick={() => setModalOpen(true)}
              className="w-full sm:w-auto rounded-full px-7 py-3.5 text-sm sm:text-base font-bold text-[#0B1E36] luminous-glass-pill flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Bell className="w-4 h-4 text-[#B57716]" />
              <span>Get notified</span>
            </button>
          </div>

          <div className="text-xs text-[#64748B] font-medium">
            Want to know when we're ready? Click above to receive exclusive founder launch updates.
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. NOTIFICATION GLASS MODAL */}
        {/* ============================================================== */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-md vision-glass-container rounded-3xl p-6 sm:p-8 border border-white shadow-2xl bg-white/95">
              
              {/* Close Button */}
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {!submitted ? (
                <>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#B57716] uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Founder Priority Access</span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-[#0B1E36] mb-2">
                    Pricing updates are coming soon.
                  </h3>
                  <p className="text-xs sm:text-sm text-[#475569] font-medium mb-6">
                    Enter your email to receive early access terms and launch discounts tailored for Indian MSMEs.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#0B1E36] uppercase tracking-wider block mb-1">
                        Your email
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="founder@yourcompany.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-[#0B1E36] focus:outline-none focus:ring-2 focus:ring-[#C2831E]/40"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 py-3.5 rounded-xl font-bold text-sm text-white gold-glow-btn flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
                    >
                      <span>Notify me</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-[#0B1E36] mb-1">You're on the list!</h4>
                  <p className="text-xs text-[#475569]">
                    We'll email <span className="font-bold text-[#0B1E36]">{email}</span> the moment GrowNova pricing plans open.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </MarketingLayout>
  );
};
