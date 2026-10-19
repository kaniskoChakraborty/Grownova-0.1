import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GrowNovaCompassLogo } from '../components/GrowNovaCompassLogo';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

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
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8F5F1]/90 via-[#F8F5F1]/80 to-[#F8F5F1]/92" />
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[400px] bg-gradient-to-br from-amber-200/25 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-md gn-panel rounded-[32px] p-8 sm:p-10 shadow-2xl border border-white/95 bg-white/90">
        
        {/* Back Link to Auth */}
        <Link
          to="/auth"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#65758B] hover:text-[#102B4E] transition-colors mb-6 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Sign In</span>
        </Link>

        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <GrowNovaCompassLogo size="md" showText={true} />
        </div>

        {!submitted ? (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-[#C69A43] text-xs font-bold uppercase tracking-wider mb-2">
                <Lock className="w-3 h-3" />
                <span>Account Recovery</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[#0B2340]">
                Reset your password
              </h1>
              <p className="text-xs text-[#65758B] mt-1.5 leading-relaxed">
                Enter your registered business email and we'll send a secure password reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11.5px] font-bold text-[#102B4E] uppercase tracking-wider block mb-1">
                  Business Email
                </label>
                <div className="relative flex items-center bg-white/80 rounded-2xl border border-[#102B4E]/15 px-4 py-3 focus-within:ring-2 focus-within:ring-[#C69A43]/40">
                  <Mail className="w-4 h-4 text-[#65758B] mr-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="founder@yourcompany.com"
                    className="w-full bg-transparent text-sm font-medium text-[#102B4E] placeholder:text-[#65758B]/60 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl text-sm font-bold text-white gold-glow-btn flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shadow-md mt-2"
              >
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#15803D] flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0B2340] mb-2">
              Recovery Link Sent
            </h2>
            <p className="text-xs text-[#65758B] mb-6 leading-relaxed">
              We have dispatched password recovery instructions to <strong className="text-[#102B4E]">{email}</strong>. Please check your inbox and spam folders.
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#102B4E] text-white text-xs font-bold hover:bg-[#0B2340] transition-colors"
            >
              <span>Return to Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

      </div>

    </div>
  );
};

export default ForgotPasswordPage;
