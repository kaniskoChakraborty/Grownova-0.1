import React, { useState } from 'react';
import { MarketingLayout } from '../layouts/MarketingLayout';
import { ArrowRight, Bell, CheckCircle2, X, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => {
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
      <div className="relative min-h-[calc(100vh-180px)] w-full flex items-center justify-center px-4 sm:px-8 py-12 overflow-hidden select-none">
        
        {/* Centered Coming Soon Content Container */}
        <div className="relative z-10 max-w-2xl w-full text-center gn-panel rounded-[36px] p-8 sm:p-14 border border-white shadow-2xl backdrop-blur-3xl bg-white/80">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-[#C69A43]/30 text-[#C69A43] text-xs font-extrabold tracking-[0.24em] mb-6">
            <Lock className="w-3 h-3" />
            <span>GROWNOVA OS</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-[42px] sm:text-[54px] md:text-[62px] text-[#0B2340] font-medium leading-[1.08] mb-5">
            Pricing is coming soon.
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-[#55677D] font-medium leading-relaxed max-w-lg mx-auto mb-10">
            We're building transparent plans that grow with your business.
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
              className="w-full sm:w-auto rounded-full px-7 py-3.5 text-sm sm:text-base font-bold text-[#102B4E] luminous-glass-pill flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Bell className="w-4 h-4 text-[#C69A43]" />
              <span>Get notified</span>
            </button>
          </div>

          <div className="text-xs text-[#65758B] font-medium">
            Want to know when we're ready? Click above to receive exclusive founder launch updates.
          </div>
        </div>

        {/* Notification Glass Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102B4E]/30 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-md gn-panel rounded-[32px] p-6 sm:p-8 shadow-2xl border border-white bg-white/95 text-center">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-black/5 text-[#65758B] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {!submitted ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 border border-[#C69A43]/40">
                    <Bell className="w-6 h-6 text-[#C69A43]" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-[#0B2340] mb-2">
                    Be the first to know
                  </h3>
                  <p className="text-xs sm:text-sm text-[#55677D] leading-relaxed mb-6">
                    Enter your email to receive early access and preferential founder pricing when GrowNova OS launches.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="relative flex items-center bg-white rounded-2xl border border-[#102B4E]/15 px-4 py-3">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="founder@yourcompany.com"
                        className="w-full bg-transparent text-sm font-medium text-[#102B4E] placeholder:text-[#65758B]/60 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-2xl text-sm font-bold text-white gold-glow-btn flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shadow-md"
                    >
                      <span>Join Early Access List</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#15803D] flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-[#102B4E] mb-2">
                    You're on the list!
                  </h3>
                  <p className="text-xs text-[#55677D]">
                    We'll notify <strong className="text-[#102B4E]">{email}</strong> as soon as pricing plans are announced.
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

export default PricingPage;
