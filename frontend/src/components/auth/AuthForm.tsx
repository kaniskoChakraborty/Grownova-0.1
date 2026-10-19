import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Building2, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { SocialLogin } from './SocialLogin';
import { useAuth } from '../../context/AuthContext';

interface AuthFormProps {
  activeTab: 'signin' | 'signup';
  onTabChange: (tab: 'signin' | 'signup') => void;
  onSuccessToast?: (msg: string) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  activeTab,
  onTabChange,
  onSuccessToast,
}) => {
  const navigate = useNavigate();
  const { login, signup, setDemoPersona } = useAuth();

  // Sign In state
  const [signInEmail, setSignInEmail] = useState('ravi.owner@grownova.in');
  const [signInPassword, setSignInPassword] = useState('••••••••••••');
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Sign Up state
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'signin') {
      if (!signInEmail) {
        onSuccessToast?.('Please enter your email address.');
        return;
      }
      login(signInEmail, signInPassword);
      onSuccessToast?.(`Welcome back! Authenticating to GrowNova OS...`);
      setTimeout(() => {
        navigate('/dashboard');
      }, 400);
    } else {
      if (!signUpEmail || !fullName) {
        onSuccessToast?.('Please fill in your name and email.');
        return;
      }
      if (signUpPassword !== confirmPassword) {
        onSuccessToast?.('Passwords do not match. Please verify.');
        return;
      }
      signup({ name: fullName, email: signUpEmail, businessName });
      onSuccessToast?.(`Welcome to GrowNova, ${fullName}! Account created.`);
      setTimeout(() => {
        navigate('/dashboard');
      }, 400);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {activeTab === 'signin' ? (
          <>
            {/* Email Field */}
            <div className="relative flex items-center bg-white/70 hover:bg-white/85 focus-within:bg-white backdrop-blur-md rounded-2xl border border-white/90 px-4 py-3 shadow-2xs transition-all duration-200">
              <Mail className="w-4 h-4 text-[#65758B] flex-shrink-0 mr-3 stroke-[2]" />
              <input
                type="email"
                required
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-transparent text-[13.5px] font-medium text-[#102B4E] placeholder:text-[#65758B]/70 focus:outline-none"
              />
            </div>

            {/* Password Field */}
            <div className="relative flex items-center bg-white/70 hover:bg-white/85 focus-within:bg-white backdrop-blur-md rounded-2xl border border-white/90 px-4 py-3 shadow-2xs transition-all duration-200">
              <Lock className="w-4 h-4 text-[#65758B] flex-shrink-0 mr-3 stroke-[2]" />
              <input
                type={showSignInPassword ? 'text' : 'password'}
                required
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-transparent text-[13.5px] font-medium text-[#102B4E] placeholder:text-[#65758B]/70 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowSignInPassword(!showSignInPassword)}
                className="text-[#65758B] hover:text-[#102B4E] p-1 transition-colors cursor-pointer ml-1"
                aria-label="Toggle password visibility"
              >
                {showSignInPassword ? <EyeOff className="w-4 h-4 stroke-[2]" /> : <Eye className="w-4 h-4 stroke-[2]" />}
              </button>
            </div>

            {/* Options Row: Keep me signed in & Forgot password? */}
            <div className="flex items-center justify-between pt-0.5 pb-1 text-[12px] sm:text-[12.5px]">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[#65758B]">
                <div
                  onClick={() => setKeepSignedIn(!keepSignedIn)}
                  className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                    keepSignedIn
                      ? 'bg-[#C69A43] border-[#C69A43] text-white shadow-2xs'
                      : 'border-[#102B4E]/20 bg-white/70 hover:border-[#C69A43]'
                  }`}
                >
                  {keepSignedIn && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>Keep me signed in</span>
              </label>

              <button
                type="button"
                onClick={() => navigate('/auth/forgot-password')}
                className="text-[#C69A43] font-semibold hover:underline transition-colors cursor-pointer select-none"
              >
                Forgot password?
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Full Name Field */}
            <div className="relative flex items-center bg-white/70 hover:bg-white/85 focus-within:bg-white backdrop-blur-md rounded-2xl border border-white/90 px-4 py-2.5 shadow-2xs transition-all duration-200">
              <User className="w-4 h-4 text-[#65758B] flex-shrink-0 mr-3 stroke-[2]" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-transparent text-[13px] font-medium text-[#102B4E] placeholder:text-[#65758B]/70 focus:outline-none"
              />
            </div>

            {/* Business Name Field */}
            <div className="relative flex items-center bg-white/70 hover:bg-white/85 focus-within:bg-white backdrop-blur-md rounded-2xl border border-white/90 px-4 py-2.5 shadow-2xs transition-all duration-200">
              <Building2 className="w-4 h-4 text-[#65758B] flex-shrink-0 mr-3 stroke-[2]" />
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Enter your business name"
                className="w-full bg-transparent text-[13px] font-medium text-[#102B4E] placeholder:text-[#65758B]/70 focus:outline-none"
              />
            </div>

            {/* Email Field */}
            <div className="relative flex items-center bg-white/70 hover:bg-white/85 focus-within:bg-white backdrop-blur-md rounded-2xl border border-white/90 px-4 py-2.5 shadow-2xs transition-all duration-200">
              <Mail className="w-4 h-4 text-[#65758B] flex-shrink-0 mr-3 stroke-[2]" />
              <input
                type="email"
                required
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-transparent text-[13px] font-medium text-[#102B4E] placeholder:text-[#65758B]/70 focus:outline-none"
              />
            </div>

            {/* Password Field */}
            <div className="relative flex items-center bg-white/70 hover:bg-white/85 focus-within:bg-white backdrop-blur-md rounded-2xl border border-white/90 px-4 py-2.5 shadow-2xs transition-all duration-200">
              <Lock className="w-4 h-4 text-[#65758B] flex-shrink-0 mr-3 stroke-[2]" />
              <input
                type={showSignUpPassword ? 'text' : 'password'}
                required
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full bg-transparent text-[13px] font-medium text-[#102B4E] placeholder:text-[#65758B]/70 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                className="text-[#65758B] hover:text-[#102B4E] p-1 transition-colors cursor-pointer ml-1"
                aria-label="Toggle password visibility"
              >
                {showSignUpPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="relative flex items-center bg-white/70 hover:bg-white/85 focus-within:bg-white backdrop-blur-md rounded-2xl border border-white/90 px-4 py-2.5 shadow-2xs transition-all duration-200">
              <ShieldCheck className="w-4 h-4 text-[#65758B] flex-shrink-0 mr-3 stroke-[2]" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full bg-transparent text-[13px] font-medium text-[#102B4E] placeholder:text-[#65758B]/70 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-[#65758B] hover:text-[#102B4E] p-1 transition-colors cursor-pointer ml-1"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </>
        )}

        {/* Primary Action Button */}
        <button
          type="submit"
          className="group w-full py-3.5 px-6 rounded-2xl text-[14.5px] font-bold text-white gold-glow-btn transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none shadow-md"
        >
          <span>{activeTab === 'signin' ? 'Sign in to GrowNova OS' : 'Create account & Launch'}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
        </button>

        {/* 1-Click Role-Based Demo Persona Shortcuts */}
        <div className="pt-2.5 border-t border-[#102B4E]/10 space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#65758B] uppercase tracking-wider">
              Explore Demo Personas
            </p>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-[#C69A43] border border-[#C69A43]/20 uppercase">
              Demo Mode
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => {
                setDemoPersona('OWNER');
                onSuccessToast?.('Logged in as Business Owner (Ravi)');
                navigate('/dashboard');
              }}
              className="py-2 px-1.5 rounded-xl text-[11px] font-bold text-[#102B4E] bg-white/75 hover:bg-white border border-white/90 shadow-2xs hover:border-[#C69A43] transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer"
            >
              <span className="text-[#C69A43] flex items-center gap-1 font-bold">
                👑 Owner
              </span>
              <span className="text-[9.5px] text-[#65758B] font-normal">/dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setDemoPersona('OPS');
                onSuccessToast?.('Logged in as Operations Manager');
                navigate('/dashboard/manager');
              }}
              className="py-2 px-1.5 rounded-xl text-[11px] font-bold text-[#102B4E] bg-white/75 hover:bg-white border border-white/90 shadow-2xs hover:border-[#15803D] transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer"
            >
              <span className="text-[#15803D] flex items-center gap-1 font-bold">
                💼 Manager
              </span>
              <span className="text-[9.5px] text-[#65758B] font-normal">/manager</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setDemoPersona('EMPLOYEE');
                onSuccessToast?.('Logged in as Team Employee');
                navigate('/dashboard/employee');
              }}
              className="py-2 px-1.5 rounded-xl text-[11px] font-bold text-[#102B4E] bg-white/75 hover:bg-white border border-white/90 shadow-2xs hover:border-[#2563EB] transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer"
            >
              <span className="text-[#2563EB] flex items-center gap-1 font-bold">
                👤 Employee
              </span>
              <span className="text-[9.5px] text-[#65758B] font-normal">/employee</span>
            </button>
          </div>
        </div>
      </form>

      {/* Social Login Options */}
      <SocialLogin
        onGoogleClick={() => {
          login('ravi.google@grownova.in');
          onSuccessToast?.('Signing in with Google Enterprise SSO...');
          setTimeout(() => navigate('/dashboard'), 300);
        }}
        onMicrosoftClick={() => {
          login('ravi.ms@grownova.in');
          onSuccessToast?.('Signing in with Microsoft 365...');
          setTimeout(() => navigate('/dashboard'), 300);
        }}
      />

      {/* Bottom Switch Prompt */}
      <div className="mt-5 text-center text-[12.5px] text-[#65758B] select-none">
        {activeTab === 'signin' ? (
          <>
            <span>Don't have an account? </span>
            <button
              type="button"
              onClick={() => onTabChange('signup')}
              className="text-[#C69A43] font-bold hover:underline cursor-pointer transition-colors ml-1"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={() => onTabChange('signin')}
              className="text-[#C69A43] font-bold hover:underline cursor-pointer transition-colors ml-1"
            >
              Sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
