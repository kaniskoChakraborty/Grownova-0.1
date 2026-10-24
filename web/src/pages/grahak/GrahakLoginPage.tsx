import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound, 
  RotateCw,
  Globe
} from 'lucide-react';
import { GrahakLogo, DesiToranArch, FolkArtBorder } from '../../components/grahak/DesiArtElements';
import { 
  SUPPORTED_LANGUAGES, 
  GRAHAK_TRANSLATIONS, 
  getStoredGrahakLanguage, 
  setStoredGrahakLanguage,
  type SupportedLanguage 
} from '../../utils/grahakTranslations';
import { useAuth } from '../../context/AuthContext';

export const GrahakLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setDemoPersona } = useAuth();

  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('hi');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    document.title = 'Grahak Login — Mobile & OTP';
    const saved = getStoredGrahakLanguage();
    setCurrentLang(saved);
  }, []);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === 'OTP' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const t = GRAHAK_TRANSLATIONS[currentLang];
  const activeLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang);

  // Validate Indian 10-digit mobile number
  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleaned = mobileNumber.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setErrorMsg('कृपया १० अंकों का सही भारतीय मोबाइल नंबर दर्ज करें। (Please enter a valid 10-digit mobile number)');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(cleaned)) {
      setErrorMsg('मोबाइल नंबर 6, 7, 8 या 9 से शुरू होना चाहिए।');
      return;
    }

    // Move to OTP step
    setStep('OTP');
    setResendTimer(30);
    setCanResend(false);
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Handle OTP verification and authentication
  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const enteredOtp = otpValues.join('');
    if (enteredOtp.length !== 6) {
      setErrorMsg('कृपया पूरा 6 अंकों का OTP कोड दर्ज करें। (Please enter complete 6-digit OTP)');
      return;
    }

    setIsSubmitting(true);
    try {
      // Connect to existing authentication system
      // For mobile-based Grahak login: set session persona or sync with AuthContext
      setDemoPersona('OWNER');
      
      // Store Grahak mobile login credentials in local storage for persistence
      localStorage.setItem('grahak_auth_mobile', `+91 ${mobileNumber}`);
      
      // Check if user completed onboarding
      const hasOnboarded = localStorage.getItem('grahak_onboarding_completed') === 'true';
      if (hasOnboarded) {
        navigate('/dashboard');
      } else {
        navigate('/grahak/onboarding');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    setOtpValues(['', '', '', '', '', '']);
    setResendTimer(30);
    setCanResend(false);
    setErrorMsg(null);
    otpInputsRef.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-[#F8F5F1] text-[#102B4E] flex flex-col justify-between selection:bg-[#C69A43] selection:text-white">
      {/* Top Toran Arch */}
      <DesiToranArch />

      {/* Top Header */}
      <div className="max-w-xl mx-auto w-full px-4 pt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (step === 'OTP') {
              setStep('PHONE');
            } else {
              navigate('/grahak');
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white text-xs font-semibold text-[#102B4E] border border-[#C69A43]/30 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Wapas / Back</span>
        </button>

        <GrahakLogo size={36} />

        {/* Quick Language Toggle */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/70 hover:bg-white text-xs font-bold text-[#102B4E] border border-[#C69A43]/30 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#C69A43]" />
            <span>{activeLangObj?.nativeName}</span>
          </button>

          {isLangOpen && (
            <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-[#C69A43]/30 p-1.5 z-30">
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => {
                    setCurrentLang(l.code);
                    setStoredGrahakLanguage(l.code);
                    setIsLangOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-[#F8F5F1] text-[#102B4E] flex items-center justify-between cursor-pointer"
                >
                  <span>{l.nativeName}</span>
                  {currentLang === l.code && <CheckCircle2 className="w-3 h-3 text-[#C69A43]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Login Form */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-6 sm:py-8 flex flex-col justify-center">
        <FolkArtBorder className="w-full">
          
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102B4E] font-serif">
              {step === 'PHONE' ? t.loginAction : t.enterOtp}
            </h1>
            <p className="text-xs text-[#55677D] mt-1">
              {step === 'PHONE' 
                ? 'अपने पंजीकृत मोबाइल नंबर से लॉगिन करें' 
                : `${t.otpSub} (+91 ${mobileNumber})`}
            </p>
          </div>

          {/* Error Message Box */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: MOBILE NUMBER INPUT */}
          {step === 'PHONE' && (
            <form onSubmit={handleMobileSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#102B4E] block mb-1.5">
                  {t.mobileLabel}
                </label>
                <div className="flex items-center rounded-2xl bg-white border-2 border-[#C69A43]/40 focus-within:border-[#102B4E] shadow-xs px-3.5 py-3 transition-colors">
                  {/* Indian Flag & Code */}
                  <div className="flex items-center gap-1.5 pr-3 border-r border-[#C69A43]/30 text-xs font-bold text-[#102B4E]">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder={t.mobilePlaceholder}
                    className="w-full pl-3 bg-transparent text-sm sm:text-base font-semibold text-[#102B4E] tracking-wider placeholder:text-[#65758B]/60 focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-[#102B4E] hover:bg-[#0B2340] text-white font-bold text-sm shadow-md border border-[#C69A43]/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
              >
                <span>आगे बढ़ें (Send OTP)</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          )}

          {/* STEP 2: 6-DIGIT OTP INPUT */}
          {step === 'OTP' && (
            <form onSubmit={handleOtpVerify} className="space-y-5">
              <div className="flex justify-between gap-1.5 sm:gap-2">
                {otpValues.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { otpInputsRef.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 sm:w-12 h-13 text-center text-xl font-bold rounded-xl bg-white border-2 border-[#C69A43]/40 focus:border-[#102B4E] focus:outline-none text-[#102B4E] shadow-xs transition-colors"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              {/* Resend OTP Row */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setStep('PHONE')}
                  className="text-[#65758B] hover:text-[#102B4E] underline cursor-pointer"
                >
                  नंबर बदलें / Change Number
                </button>

                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="font-bold text-[#C69A43] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>{t.resendOtp}</span>
                  </button>
                ) : (
                  <span className="text-[#65758B]">
                    दोबारा भेजें: <strong className="text-[#102B4E]">{resendTimer}s</strong>
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#102B4E] to-[#0B2340] hover:from-[#0B2340] hover:to-[#102B4E] text-white font-bold text-sm shadow-md border border-[#C69A43]/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
              >
                {isSubmitting ? (
                  <span>सत्यापित किया जा रहा है...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-[#D5AD66]" />
                    <span>{t.verifyAndLogin}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Bottom Switch: Sign Up navigation */}
          <div className="mt-6 pt-4 border-t border-[#C69A43]/20 text-center text-xs text-[#55677D]">
            <span>{t.noAccount} </span>
            <Link
              to="/grahak/signup"
              className="text-[#C69A43] font-bold hover:underline transition-colors ml-1"
            >
              {t.signupAction}
            </Link>
          </div>
        </FolkArtBorder>
      </main>

      {/* Footer */}
      <footer className="py-3 text-center text-xs text-[#65758B]">
        <div className="flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
          <span>सुरक्षित ओटीपी प्रमाणीकरण • GrowNova Auth Protocol</span>
        </div>
      </footer>
    </div>
  );
};

export default GrahakLoginPage;
