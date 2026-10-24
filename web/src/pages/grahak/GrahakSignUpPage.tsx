import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Store, 
  ShieldCheck, 
  AlertCircle,
  Sparkles,
  Globe,
  FileText
} from 'lucide-react';
import { GrahakLogo, DesiToranArch, FolkArtBorder } from '../../components/grahak/DesiArtElements';
import { useGrahakLanguage } from '../../context/GrahakLanguageContext';
import { useAuth } from '../../context/AuthContext';
import { grahakApi } from '../../services/grahakService';

const CATEGORY_CHIPS = [
  { id: 'Kirana & FMCG', label: 'किराना & जनरल स्टोर', icon: '🛒' },
  { id: 'Wholesaler / Mandi', label: 'थोक विक्रेता / मंडी', icon: '📦' },
  { id: 'Clothing & Textiles', label: 'कपड़ा & रेडीमेड', icon: '👕' },
  { id: 'Electronics & Mobile', label: 'इलेक्ट्रॉनिक्स & मोबाइल', icon: '📱' },
  { id: 'Hardware & Paint', label: 'हार्डवेयर & पेंट', icon: '🔧' },
  { id: 'Other Retail', label: 'अन्य खुदरा व्यापार', icon: '🏬' },
];

export const GrahakSignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, setDemoPersona } = useAuth();
  const { currentLang, languageInfo, openLanguageModal, t } = useGrahakLanguage();

  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [shopName, setShopName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('Kirana & FMCG');
  const [gstin, setGstin] = useState('');
  const [whatsappOptIn, setWhatsappOptIn] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Grahak Registration — Naya Khata Banayein';
  }, []);

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
      // 1. Register with backend Grahak API
      await grahakApi.register({
        fullName: fullName.trim(),
        phone: cleanMobile,
        shopName: shopName.trim(),
        businessType: businessCategory,
        gstin: gstin.trim() || undefined,
        language: currentLang,
        role: 'MERCHANT',
      });

      // 2. Persist shop profile locally
      const newShopProfile = {
        fullName: fullName.trim(),
        mobileNumber: `+91 ${cleanMobile}`,
        shopName: shopName.trim(),
        businessType: businessCategory,
        gstin: gstin.trim() || undefined,
        language: currentLang,
        whatsappOptIn,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('grahak_shop_profile', JSON.stringify(newShopProfile));
      localStorage.setItem('grahak_auth_mobile', `+91 ${cleanMobile}`);

      // 3. Authenticate session
      try {
        await signup({
          name: fullName.trim(),
          email: `${cleanMobile}@grahak.grownova.in`,
          businessName: shopName.trim(),
          password: `Grahak@${cleanMobile.slice(-4)}`,
        });
      } catch {
        setDemoPersona('OWNER');
      }

      // Navigate to onboarding tutorial
      navigate('/grahak/onboarding');
    } catch (err: any) {
      setErrorMsg(err.message || 'रजिस्ट्रेशन में समस्या हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F1] text-[#102B4E] flex flex-col justify-between selection:bg-[#C69A43] selection:text-white">
      {/* Top Auspicious Toran Arch */}
      <DesiToranArch />

      {/* Header Bar */}
      <header className="max-w-3xl mx-auto w-full px-4 pt-3 flex items-center justify-between border-b border-[#C69A43]/20 pb-3">
        <button
          type="button"
          onClick={() => navigate('/grahak')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-xs font-semibold text-[#102B4E] border border-[#C69A43]/30 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>मुख्य पृष्ठ</span>
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

      {/* Main Registration Form Card */}
      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-6 sm:py-8 flex flex-col justify-center">
        <FolkArtBorder className="w-full">
          {/* Header Title Section */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#C69A43]/15 text-[#102B4E] text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C69A43]" />
              <span>शुभ आरम्भ • नया खाता खोलें (Sign Up)</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102B4E] font-serif">
              दुकान या व्यापार का रजिस्ट्रेशन
            </h1>
            <p className="text-xs sm:text-sm text-[#55677D] mt-1">
              सिर्फ १ मिनट में अपना डिजिटल बही-खाता और बिलिंग शुरू करें
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-[#102B4E] mb-1">
                {t.fullNameLabel} (Proprietor Name) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="उदा. रमेश कुमार शर्मा"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#C69A43]/40 focus:border-[#102B4E] focus:ring-2 focus:ring-[#C69A43]/30 text-sm font-semibold text-[#102B4E] placeholder:text-gray-400 focus:outline-none"
                  required
                />
                <User className="w-4 h-4 text-[#C69A43] absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Shop Name */}
            <div>
              <label className="block text-xs font-bold text-[#102B4E] mb-1">
                {t.shopNameLabel} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="उदा. श्री गणेश किराना स्टोर"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#C69A43]/40 focus:border-[#102B4E] focus:ring-2 focus:ring-[#C69A43]/30 text-sm font-semibold text-[#102B4E] placeholder:text-gray-400 focus:outline-none"
                  required
                />
                <Store className="w-4 h-4 text-[#C69A43] absolute left-3.5 top-3.5" />
              </div>
              <p className="mt-1 text-[11px] text-[#55677D]">
                यही नाम आपके ग्राहक के बिल और व्हाट्सऐप रसीद पर प्रिंट होगा।
              </p>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-[#102B4E] mb-1">
                {t.mobileLabel} <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 flex items-center gap-1.5 text-xs font-bold text-[#102B4E] select-none pr-2 border-r border-[#C69A43]/30">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="98230 45678"
                  className="w-full pl-20 pr-4 py-3 rounded-xl bg-white border border-[#C69A43]/40 focus:border-[#102B4E] focus:ring-2 focus:ring-[#C69A43]/30 text-sm font-bold text-[#102B4E] placeholder:text-gray-400 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Business Category Selection Chips */}
            <div>
              <label className="block text-xs font-bold text-[#102B4E] mb-1.5">
                व्यापार का प्रकार (Category)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORY_CHIPS.map((cat) => {
                  const isSelected = businessCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setBusinessCategory(cat.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#102B4E] text-white border-[#C69A43] shadow-xs'
                          : 'bg-white hover:bg-[#F3ECE0] text-[#102B4E] border-[#C69A43]/20'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span className="truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional GSTIN / PAN */}
            <div>
              <label className="block text-xs font-bold text-[#102B4E] mb-1">
                जीएसटीआईएन या पैन (GSTIN / PAN) <span className="text-gray-500 font-normal">ऐच्छिक (Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={15}
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  placeholder="उदा. 23AAAAA0000A1Z5"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#C69A43]/30 focus:border-[#102B4E] focus:outline-none text-xs font-semibold uppercase text-[#102B4E] placeholder:normal-case placeholder:text-gray-400"
                />
                <FileText className="w-4 h-4 text-[#C69A43] absolute left-3.5 top-3" />
              </div>
            </div>

            {/* WhatsApp Daily Summary Opt-in */}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F0EDE9] border border-[#C69A43]/20">
              <input
                type="checkbox"
                id="whatsapp-opt"
                checked={whatsappOptIn}
                onChange={(e) => setWhatsappOptIn(e.target.checked)}
                className="w-4 h-4 rounded text-[#102B4E] focus:ring-[#C69A43] accent-[#102B4E] cursor-pointer"
              />
              <label htmlFor="whatsapp-opt" className="text-xs text-[#102B4E] font-medium cursor-pointer">
                व्हाट्सऐप पर रोज़ाना का हिसाब और लेन-देन पर्ची प्राप्त करें
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-[#102B4E] hover:bg-[#0B2340] text-white font-bold text-base shadow-md hover:shadow-lg border border-[#C69A43]/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              <span>{isSubmitting ? 'खाता खोला जा रहा है...' : 'खाता खोलें • Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Switch to Login */}
            <div className="pt-2 text-center text-xs text-[#55677D]">
              <span>पहले से खाता है? </span>
              <Link
                to="/grahak/login"
                className="font-bold text-[#102B4E] hover:text-[#C69A43] underline underline-offset-2"
              >
                {t.loginReturning}
              </Link>
            </div>
          </form>

          {/* Trust Footnote */}
          <div className="mt-6 pt-4 border-t border-[#C69A43]/20 flex items-center justify-center gap-2 text-[11px] text-[#55677D]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>१००% सुरक्षित • भारत सरकार डीपीएसपी नियमों के अनुकूल</span>
          </div>
        </FolkArtBorder>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-[#55677D]">
        <p>24x7 निःशुल्क व्यापारी सहायता: 1800-GRAHAK</p>
      </footer>
    </div>
  );
};

export default GrahakSignUpPage;
