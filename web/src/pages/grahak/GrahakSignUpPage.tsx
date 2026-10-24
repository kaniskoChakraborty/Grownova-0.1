import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Store, 
  Briefcase, 
  ShieldCheck, 
  AlertCircle,
  Sparkles
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

const BUSINESS_TYPES = [
  { id: 'kirana', label: 'किराना एवं जनरल स्टोर (Kirana & General Store)' },
  { id: 'textiles', label: 'कपड़ा एवं रेडीमेड (Clothing & Textiles)' },
  { id: 'hardware', label: 'हार्डवेयर एवं इलेक्ट्रिकल (Hardware & Electricals)' },
  { id: 'medical', label: 'मेडिकल स्टोर एवं फार्मेसी (Medical & Pharmacy)' },
  { id: 'sweets', label: 'डेयरी, बेकरी एवं मिठाई (Dairy & Sweets)' },
  { id: 'electronics', label: 'मोबाइल एवं इलेक्ट्रॉनिक्स (Mobile & Electronics)' },
  { id: 'other', label: 'अन्य खुदरा / सेवा व्यापार (Other Retail / Service)' },
];

export const GrahakSignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, setDemoPersona } = useAuth();

  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('hi');
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [shopName, setShopName] = useState('');
  const [businessType, setBusinessType] = useState('kirana');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Grahak Registration — Naya Khata Banayein';
    const saved = getStoredGrahakLanguage();
    setCurrentLang(saved);
  }, []);

  const handleLangChange = (lang: SupportedLanguage) => {
    setCurrentLang(lang);
    setStoredGrahakLanguage(lang);
  };

  const t = GRAHAK_TRANSLATIONS[currentLang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!fullName.trim()) {
      setErrorMsg('कृपया अपना पूरा नाम दर्ज करें। (Please enter your full name)');
      return;
    }
    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (cleanMobile.length !== 10 || !/^[6-9]\d{9}$/.test(cleanMobile)) {
      setErrorMsg('कृपया १० अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें।');
      return;
    }
    if (!shopName.trim()) {
      setErrorMsg('कृपया अपनी दुकान या व्यापार का नाम दर्ज करें।');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Persist new Grahak shop profile to local storage
      const newShopProfile = {
        fullName: fullName.trim(),
        mobileNumber: `+91 ${cleanMobile}`,
        shopName: shopName.trim(),
        businessType,
        language: currentLang,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('grahak_shop_profile', JSON.stringify(newShopProfile));
      localStorage.setItem('grahak_auth_mobile', `+91 ${cleanMobile}`);

      // 2. Register with existing AuthContext (attempt live signup or set authenticated OWNER persona)
      try {
        await signup({
          name: fullName.trim(),
          email: `${cleanMobile}@grahak.grownova.in`,
          businessName: shopName.trim(),
          password: `Grahak@${cleanMobile.slice(-4)}`,
        });
      } catch {
        // Fallback to active OWNER persona if backend signup endpoint is offline
        setDemoPersona('OWNER');
      }

      // 3. Navigate directly to guided first-time onboarding
      navigate('/grahak/onboarding');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F1] text-[#102B4E] flex flex-col justify-between selection:bg-[#C69A43] selection:text-white">
      {/* Top Toran Arch */}
      <DesiToranArch />

      {/* Top Header */}
      <div className="max-w-xl mx-auto w-full px-4 pt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/grahak/language')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white text-xs font-semibold text-[#102B4E] border border-[#C69A43]/30 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Wapas / Back</span>
        </button>

        <GrahakLogo size={36} />

        {/* Language selector in header */}
        <select
          value={currentLang}
          onChange={(e) => handleLangChange(e.target.value as SupportedLanguage)}
          className="px-2.5 py-1 text-xs font-bold rounded-full bg-white border border-[#C69A43]/40 text-[#102B4E] cursor-pointer"
        >
          {SUPPORTED_LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.nativeName}
            </option>
          ))}
        </select>
      </div>

      {/* Main Sign Up Form */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 sm:py-8 flex flex-col justify-center">
        <FolkArtBorder className="w-full">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#C69A43]/15 text-[#102B4E] text-xs font-bold mb-2">
              <Sparkles className="w-3 h-3 text-[#C69A43]" />
              <span>Step 2 of 3: Dukaan Ka Panjikaran</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102B4E] font-serif">
              {t.signupAction}
            </h1>
            <p className="text-xs text-[#55677D] mt-1">
              अपनी दुकान का डिजिटल खाता सिर्फ १ मिनट में शुरू करें
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Full Name */}
            <div>
              <label className="text-xs font-bold text-[#102B4E] block mb-1">
                {t.fullNameLabel} <span className="text-[#C05A3E]">*</span>
              </label>
              <div className="flex items-center rounded-xl bg-white border border-[#C69A43]/40 focus-within:border-[#102B4E] px-3 py-2.5 shadow-2xs">
                <User className="w-4 h-4 text-[#C69A43] mr-2.5 flex-shrink-0" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="उदा. रमेश कुमार गुप्ता"
                  className="w-full bg-transparent text-sm font-medium text-[#102B4E] placeholder:text-[#65758B]/60 focus:outline-none"
                />
              </div>
            </div>

            {/* 2. Indian Mobile Number */}
            <div>
              <label className="text-xs font-bold text-[#102B4E] block mb-1">
                {t.mobileLabel} <span className="text-[#C05A3E]">*</span>
              </label>
              <div className="flex items-center rounded-xl bg-white border border-[#C69A43]/40 focus-within:border-[#102B4E] px-3 py-2.5 shadow-2xs">
                <div className="flex items-center gap-1 pr-2.5 border-r border-[#C69A43]/30 text-xs font-bold text-[#102B4E]">
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
                  className="w-full pl-2.5 bg-transparent text-sm font-semibold text-[#102B4E] placeholder:text-[#65758B]/60 focus:outline-none"
                />
              </div>
            </div>

            {/* 3. Shop Name */}
            <div>
              <label className="text-xs font-bold text-[#102B4E] block mb-1">
                {t.shopNameLabel} <span className="text-[#C05A3E]">*</span>
              </label>
              <div className="flex items-center rounded-xl bg-white border border-[#C69A43]/40 focus-within:border-[#102B4E] px-3 py-2.5 shadow-2xs">
                <Store className="w-4 h-4 text-[#C69A43] mr-2.5 flex-shrink-0" />
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="उदा. श्री गणेश किराना स्टोर"
                  className="w-full bg-transparent text-sm font-medium text-[#102B4E] placeholder:text-[#65758B]/60 focus:outline-none"
                />
              </div>
            </div>

            {/* 4. Business Type */}
            <div>
              <label className="text-xs font-bold text-[#102B4E] block mb-1">
                {t.businessTypeLabel}
              </label>
              <div className="flex items-center rounded-xl bg-white border border-[#C69A43]/40 focus-within:border-[#102B4E] px-3 py-2.5 shadow-2xs">
                <Briefcase className="w-4 h-4 text-[#C69A43] mr-2.5 flex-shrink-0" />
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#102B4E] focus:outline-none cursor-pointer"
                >
                  {BUSINESS_TYPES.map((bt) => (
                    <option key={bt.id} value={bt.id}>
                      {bt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#102B4E] to-[#0B2340] hover:from-[#0B2340] hover:to-[#102B4E] text-white font-bold text-sm shadow-md border border-[#C69A43]/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
            >
              {isSubmitting ? (
                <span>खाता बनाया जा रहा है...</span>
              ) : (
                <>
                  <span>खाता बनाएं और ऑनबोर्डिंग शुरू करें</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Switch: Login for existing users */}
          <div className="mt-5 pt-4 border-t border-[#C69A43]/20 text-center text-xs text-[#55677D]">
            <span>{t.alreadyHaveAccount} </span>
            <Link
              to="/grahak/login"
              className="text-[#C69A43] font-bold hover:underline transition-colors ml-1"
            >
              {t.loginAction}
            </Link>
          </div>
        </FolkArtBorder>
      </main>

      {/* Footer */}
      <footer className="py-3 text-center text-xs text-[#65758B]">
        <div className="flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
          <span>सुरक्षित एवं गोपनीय डेटा • GrowNova Enterprise Architecture</span>
        </div>
      </footer>
    </div>
  );
};

export default GrahakSignUpPage;
