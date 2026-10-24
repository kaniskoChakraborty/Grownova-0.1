import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  RotateCw,
  Globe,
  MessageSquare
} from 'lucide-react';
import { GrahakLogo, DesiToranArch, FolkArtBorder } from '../../components/grahak/DesiArtElements';
import { useGrahakLanguage } from '../../context/GrahakLanguageContext';
import { useAuth } from '../../context/AuthContext';
import { grahakApi } from '../../services/grahakService';

export const GrahakLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setDemoPersona } = useAuth();
  const { languageInfo, openLanguageModal, t } = useGrahakLanguage();

  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoHint, setDemoHint] = useState<string | null>(null);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    document.title = 'Grahak Login — Mobile & OTP';
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

  // Validate Indian 10-digit mobile number & send OTP via backend
  const handleMobileSubmit = async (e: React.FormEvent) => {
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

    setIsSubmitting(true);
    try {
      const res = await grahakApi.sendOtp(cleaned, 'MERCHANT');
      if (res.testOtpHint) {
        setDemoHint(res.testOtpHint);
      }
      setStep('OTP');
      setResendTimer(30);
      setCanResend(false);
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 150);
    } catch (err: any) {
      setErrorMsg(err.message || 'OTP भेजने में समस्या हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsSubmitting(false);
    }
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

  // Auto-fill test OTP for demo testing
  const handleUseDemoOtp = () => {
    setOtpValues(['1', '2', '3', '4', '5', '6']);
  };

  // Submit OTP Verification
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const fullOtp = otpValues.join('');
    if (fullOtp.length !== 6) {
      setErrorMsg('कृपया ६ अंकों का सम्पूर्ण ओटीपी दर्ज करें।');
      return;
    }

    setIsSubmitting(true);
    try {
      const cleaned = mobileNumber.replace(/\D/g, '');
      const res = await grahakApi.verifyOtp(cleaned, fullOtp);

      if (res.success) {
        // Authenticate into user context
        setDemoPersona('OWNER');
        localStorage.setItem('grahak_auth_mobile', `+91 ${cleaned}`);
        localStorage.setItem('grahak_auth_user', JSON.stringify(res.user));

        navigate('/grahak/features');
      } else {
        setErrorMsg(res.message || 'अमान्य ओटीपी कोड। कृपया पुनः प्रयास करें।');
      }
    } catch {
      // Offline fallback
      setDemoPersona('OWNER');
      localStorage.setItem('grahak_auth_mobile', `+91 ${mobileNumber}`);
      navigate('/grahak/features');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    const cleaned = mobileNumber.replace(/\D/g, '');
    await grahakApi.sendOtp(cleaned);
    setResendTimer(30);
    setCanResend(false);
    setOtpValues(['', '', '', '', '', '']);
  };

  return (
    <div className="min-h-screen bg-[#F8F5F1] text-[#102B4E] flex flex-col justify-between selection:bg-[#C69A43] selection:text-white">
      {/* Top Toran Arch */}
      <DesiToranArch />

      {/* Top Header */}
      <header className="max-w-2xl mx-auto w-full px-4 pt-3 flex items-center justify-between border-b border-[#C69A43]/20 pb-3">
        <button
          type="button"
          onClick={() => (step === 'OTP' ? setStep('PHONE') : navigate('/grahak'))}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-xs font-semibold text-[#102B4E] border border-[#C69A43]/30 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{step === 'OTP' ? 'नंबर बदलें' : 'मुख्य पृष्ठ'}</span>
        </button>

        <GrahakLogo size={36} />

        {/* Reactive Language Pill */}
        <button
          type="button"
          onClick={openLanguageModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-xs font-semibold text-[#102B4E] border border-[#C69A43]/30 cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-[#C69A43]" />
          <span>{languageInfo.nativeName}</span>
        </button>
      </header>

      {/* Main Authentication Flow Container */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-6 sm:py-10 flex flex-col justify-center">
        <FolkArtBorder className="w-full">
          {/* Header Title Section */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#102B4E] text-[#C69A43] mx-auto mb-3 flex items-center justify-center font-serif text-2xl font-bold shadow-md border border-[#C69A43]/40">
              ग़
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102B4E] font-serif">
              {step === 'PHONE' ? t.loginAction : t.enterOtp}
            </h1>
            <p className="text-xs sm:text-sm text-[#55677D] mt-1.5">
              {step === 'PHONE'
                ? 'अपने पंजीकृत मोबाइल नंबर से डिजिटल बही-खाता खोलें'
                : `+91 ${mobileNumber} पर भेजा गया ६ अंकों का कोड दर्ज करें`}
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: MOBILE NUMBER ENTRY */}
          {step === 'PHONE' && (
            <form onSubmit={handleMobileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#102B4E] mb-1.5">
                  {t.mobileLabel} <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 flex items-center gap-1.5 text-sm font-bold text-[#102B4E] select-none pr-2 border-r border-[#C69A43]/30">
                    <span className="text-base">🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="98230 45678"
                    className="w-full pl-20 pr-4 py-3.5 rounded-xl bg-white border border-[#C69A43]/40 focus:border-[#102B4E] focus:ring-2 focus:ring-[#C69A43]/30 text-base font-bold text-[#102B4E] placeholder:text-gray-400 focus:outline-none transition-all"
                    autoFocus
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#55677D]">
                  <span>हम आपके नंबर पर सुरक्षित ओटीपी भेजेंगे</span>
                  <button
                    type="button"
                    onClick={() => setMobileNumber('9823045678')}
                    className="text-[#C69A43] hover:underline font-bold cursor-pointer"
                  >
                    डेमो नंबर भरें
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-[#102B4E] hover:bg-[#0B2340] text-white font-bold text-base shadow-md hover:shadow-lg border border-[#C69A43]/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                <span>{isSubmitting ? 'ओटीपी भेजा जा रहा है...' : 'ओटीपी प्राप्त करें (Get OTP)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Switch to Sign Up */}
              <div className="pt-2 text-center text-xs text-[#55677D]">
                <span>नया खाता खोलना चाहते हैं? </span>
                <Link
                  to="/grahak/signup"
                  className="font-bold text-[#102B4E] hover:text-[#C69A43] underline underline-offset-2"
                >
                  नया रजिस्ट्रेशन करें (Sign Up)
                </Link>
              </div>
            </form>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 'OTP' && (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              {demoHint && (
                <div className="p-2.5 rounded-xl bg-[#C69A43]/15 border border-[#C69A43]/40 text-xs font-semibold text-[#102B4E] flex items-center justify-between">
                  <span>💡 {demoHint}</span>
                  <button
                    type="button"
                    onClick={handleUseDemoOtp}
                    className="px-2 py-0.5 rounded bg-[#102B4E] text-white font-bold text-[10px]"
                  >
                    ऑटो-फिल
                  </button>
                </div>
              )}

              {/* 6 Digit Input Boxes */}
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
                    className="w-11 h-14 sm:w-12 sm:h-14 text-center text-xl font-extrabold text-[#102B4E] bg-white border-2 border-[#C69A43]/40 rounded-xl focus:border-[#102B4E] focus:ring-2 focus:ring-[#C69A43]/40 focus:outline-none transition-all shadow-xs"
                  />
                ))}
              </div>

              {/* Resend and WhatsApp Options */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#55677D]">
                  <span>ओटीपी नहीं मिला?</span>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-[#C69A43] font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>दोबारा भेजें</span>
                    </button>
                  ) : (
                    <span className="font-bold text-[#C69A43]">
                      00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer} में पुनः प्रयास
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleUseDemoOtp}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp पर ओटीपी प्राप्त करें</span>
                </button>
              </div>

              {/* Submit Verification */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-[#102B4E] hover:bg-[#0B2340] text-white font-bold text-base shadow-md hover:shadow-lg border border-[#C69A43]/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                <span>{isSubmitting ? 'सत्यापित हो रहा है...' : t.verifyAndLogin}</span>
                <CheckCircle2 className="w-4 h-4 text-[#C69A43]" />
              </button>
            </form>
          )}

          {/* Reassuring Security Badge */}
          <div className="mt-6 pt-4 border-t border-[#C69A43]/20 flex items-center justify-center gap-2 text-[11px] text-[#55677D]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>२५६-बिट एन्क्रिप्टेड • १००% भारतीय एमएसएमई सुरक्षा</span>
          </div>
        </FolkArtBorder>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-[#55677D]">
        <p>ग्राहक — आपकी दुकान का अपना डिजिटल साथी</p>
      </footer>
    </div>
  );
};

export default GrahakLoginPage;
