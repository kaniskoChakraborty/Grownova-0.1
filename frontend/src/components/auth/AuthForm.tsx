import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Building2, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { SocialLogin } from './SocialLogin';

interface AuthFormProps {
  activeTab: 'signin' | 'signup';
  onTabChange: (tab: 'signin' | 'signup') => void;
  onSuccessToast?: (msg: string) => void;
}

export const AuthForm = ({
  activeTab,
  onTabChange,
  onSuccessToast,
}: AuthFormProps) => {
  // Sign In state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
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

  // Status feedback
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'signin') {
      if (!signInEmail) {
        onSuccessToast?.('Please enter your email address.');
        return;
      }
      onSuccessToast?.(`Welcome back, ${signInEmail}! Signing in to GrowNova...`);
    } else {
      if (!signUpEmail || !fullName) {
        onSuccessToast?.('Please fill in your name and email.');
        return;
      }
      if (signUpPassword !== confirmPassword) {
        onSuccessToast?.('Passwords do not match. Please verify.');
        return;
      }
      onSuccessToast?.(`Welcome to GrowNova, ${fullName}! Account created.`);
    }
  };

  const handleForgotPassword = () => {
    setForgotSent(true);
    onSuccessToast?.('Password reset instructions sent to your email.');
    setTimeout(() => setForgotSent(false), 4000);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {activeTab === 'signin' ? (
          /* ======================================================== */
          /* SIGN IN FIELDS                                          */
          /* ======================================================== */
          <>
            {/* Email Field */}
            <div className="relative flex items-center bg-white/60 hover:bg-white/75 focus-within:bg-white/85 backdrop-blur-md rounded-2xl border border-white/80 px-4 py-3 shadow-2xs transition-all duration-200">
              <Mail className="w-4 h-4 text-[#55677D] flex-shrink-0 mr-3 stroke-[2]" />
              <input
                type="email"
                required
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-transparent text-[13.5px] font-medium text-[#102B4E] placeholder:text-[#8E9CAE] focus:outline-none"
              />
            </div>

            {/* Password Field */}
            <div className="relative flex items-center bg-white/60 hover:bg-white/75 focus-within:bg-white/85 backdrop-blur-md rounded-2xl border border-white/80 px-4 py-3 shadow-2xs transition-all duration-200">
              <Lock className="w-4 h-4 text-[#55677D] flex-shrink-0 mr-3 stroke-[2]" />
              <input
                type={showSignInPassword ? 'text' : 'password'}
                required
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-transparent text-[13.5px] font-medium text-[#102B4E] placeholder:text-[#8E9CAE] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowSignInPassword(!showSignInPassword)}
                className="text-[#64748B] hover:text-[#102B4E] p-1 transition-colors cursor-pointer ml-1"
                aria-label="Toggle password visibility"
              >
                {showSignInPassword ? <EyeOff className="w-4 h-4 stroke-[2]" /> : <Eye className="w-4 h-4 stroke-[2]" />}
              </button>
            </div>

            {/* Options Row: Keep me signed in & Forgot password? */}
            <div className="flex items-center justify-between pt-0.5 pb-1 text-[12px] sm:text-[12.5px]">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[#55677D]">
                <div
                  onClick={() => setKeepSignedIn(!keepSignedIn)}
                  className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                    keepSignedIn
                      ? 'bg-[#B0782D] border-[#B0782D] text-white shadow-2xs'
                      : 'border-white/90 bg-white/70 hover:border-[#B0782D]/60'
                  }`}
                >
                  {keepSignedIn && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>Keep me signed in</span>
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[#B0782D] font-semibold hover:underline transition-colors cursor-pointer select-none"
              >
                {forgotSent ? 'Reset link sent!' : 'Forgot password?'}
              </button>
            </div>
          </>
        ) : (
          /* ======================================================== */
          /* SIGN UP FIELDS                                          */
          /* ======================================================== */
          <>
            {/* Full Name Field */}
            <div className="relative flex items-center bg-white/60 hover:bg-white/75 focus-within:bg-white/85 backdrop-blur-md rounded-2xl border border-white/80 px-4 py-2.5 shadow-2xs transition-all duration-200">
              <User className="w-4 h-4 text-[#55677D] flex-shrink-0 mr-3 stroke-[2]" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-transparent text-[13px] font-medium text-[#102B4E] placeholder:text-[#8E9CAE] focus:outline-none"
              />
            </div>

            {/* Business Name Field */}
            <div className="relative flex items-center bg-white/60 hover:bg-white/75 focus-within:bg-white/85 backdrop-blur-md rounded-2xl border border-white/80 px-4 py-2.5 shadow-2xs transition-all duration-200">
              <Building2 className="w-4 h-4 text-[#55677D] flex-shrink-0 mr-3 stroke-[2]" />
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Enter your business name"
                className="w-full bg-transparent text-[13px] font-medium text-[#102B4E] placeholder:text-[#8E9CAE] focus:outline-none"
              />
            </div>

            {/* Email Field */}
            <div className="relative flex items-center bg-white/60 hover:bg-white/75 focus-within:bg-white/85 backdrop-blur-md rounded-2xl border border-white/80 px-4 py-2.5 shadow-2xs transition-all duration-200">
              <Mail className="w-4 h-4 text-[#55677D] flex-shrink-0 mr-3 stroke-[2]" />
              <input
                type="email"
                required
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-transparent text-[13px] font-medium text-[#102B4E] placeholder:text-[#8E9CAE] focus:outline-none"
              />
            </div>

            {/* Password Field */}
            <div className="relative flex items-center bg-white/60 hover:bg-white/75 focus-within:bg-white/85 backdrop-blur-md rounded-2xl border border-white/80 px-4 py-2.5 shadow-2xs transition-all duration-200">
              <Lock className="w-4 h-4 text-[#55677D] flex-shrink-0 mr-3 stroke-[2]" />
              <input
                type={showSignUpPassword ? 'text' : 'password'}
                required
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full bg-transparent text-[13px] font-medium text-[#102B4E] placeholder:text-[#8E9CAE] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                className="text-[#64748B] hover:text-[#102B4E] p-1 transition-colors cursor-pointer ml-1"
                aria-label="Toggle password visibility"
              >
                {showSignUpPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="relative flex items-center bg-white/60 hover:bg-white/75 focus-within:bg-white/85 backdrop-blur-md rounded-2xl border border-white/80 px-4 py-2.5 shadow-2xs transition-all duration-200">
              <ShieldCheck className="w-4 h-4 text-[#55677D] flex-shrink-0 mr-3 stroke-[2]" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full bg-transparent text-[13px] font-medium text-[#102B4E] placeholder:text-[#8E9CAE] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-[#64748B] hover:text-[#102B4E] p-1 transition-colors cursor-pointer ml-1"
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
          className="group w-full py-3.5 px-6 rounded-2xl text-[15px] font-bold text-white bg-gradient-to-r from-[#B57C2B] via-[#C58E3C] to-[#A66F21] shadow-[0_8px_20px_-3px_rgba(181,124,43,0.45)] hover:shadow-[0_12px_24px_-2px_rgba(181,124,43,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none"
        >
          <span>{activeTab === 'signin' ? 'Sign in' : 'Create account'}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </form>

      {/* Social Login Options */}
      <SocialLogin
        onGoogleClick={() => onSuccessToast?.('Redirecting to Google authentication...')}
        onMicrosoftClick={() => onSuccessToast?.('Redirecting to Microsoft authentication...')}
      />

      {/* Bottom Switch Prompt */}
      <div className="mt-5 text-center text-[12.5px] text-[#55677D] select-none">
        {activeTab === 'signin' ? (
          <>
            <span>Don't have an account? </span>
            <button
              type="button"
              onClick={() => onTabChange('signup')}
              className="text-[#B0782D] font-bold hover:underline cursor-pointer transition-colors ml-1"
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
              className="text-[#B0782D] font-bold hover:underline cursor-pointer transition-colors ml-1"
            >
              Sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
};
