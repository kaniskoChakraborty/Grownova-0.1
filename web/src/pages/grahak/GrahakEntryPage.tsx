import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Globe, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Receipt, 
  Camera, 
  MapPin, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { 
  GrahakLogo, 
  DesiToranArch, 
  ShopkeeperIllustration, 
  FolkArtBorder 
} from '../../components/grahak/DesiArtElements';
import { 
  SUPPORTED_LANGUAGES, 
  GRAHAK_TRANSLATIONS, 
  getStoredGrahakLanguage, 
  setStoredGrahakLanguage,
  type SupportedLanguage 
} from '../../utils/grahakTranslations';

export const GrahakEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('hi');
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  useEffect(() => {
    document.title = 'Grahak — Aapke Dukaan Ka Digital Saathi';
    const saved = getStoredGrahakLanguage();
    setCurrentLang(saved);
  }, []);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLang(lang);
    setStoredGrahakLanguage(lang);
    setIsLangModalOpen(false);
  };

  const t = GRAHAK_TRANSLATIONS[currentLang];
  const activeLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang);

  return (
    <div className="min-h-screen bg-[#F8F5F1] text-[#102B4E] flex flex-col justify-between selection:bg-[#C69A43] selection:text-white">
      {/* 1. TOP MARIGOLD & MANGO LEAF TORAN ARCH */}
      <DesiToranArch className="top-0 left-0" />

      {/* 2. TOP NAV HEADER */}
      <header className="px-4 sm:px-8 py-3 max-w-5xl mx-auto w-full flex items-center justify-between border-b border-[#C69A43]/20">
        <GrahakLogo size={42} />

        {/* Language Selector Pill */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsLangModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white border border-[#C69A43]/40 shadow-xs text-xs font-semibold text-[#102B4E] transition-all cursor-pointer hover:border-[#C69A43]"
            aria-label="Change Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#C69A43]" />
            <span className="font-bold text-[#102B4E]">{activeLangObj?.nativeName}</span>
            <span className="text-[10px] text-[#65758B]">({activeLangObj?.name})</span>
          </button>
        </div>
      </header>

      {/* 3. HERO CONTENT CONTAINER (Contemporary Desi Art) */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 flex flex-col items-center text-center justify-center">
        
        {/* Subtle folk auspicious badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C69A43]/10 border border-[#C69A43]/30 text-xs font-bold text-[#102B4E] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#C69A43]" />
          <span>१००% सुरक्षित • भारतीय दुकानदारों के लिए समर्पित</span>
        </div>

        {/* Main Headline & Supporting Subheadline */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#102B4E] font-serif max-w-2xl leading-tight">
          {t.headline}
        </h1>
        
        <p className="mt-3 text-base sm:text-lg text-[#55677D] font-medium max-w-xl leading-relaxed">
          {t.subheadline}
        </p>

        {/* Refined Indian Shopkeeper-and-Customer Illustration */}
        <div className="my-6 w-full max-w-md">
          <ShopkeeperIllustration className="w-full" />
        </div>

        {/* Primary Call to Action: "Shuru Kijiye" */}
        <div className="w-full max-w-sm flex flex-col gap-3.5">
          <button
            type="button"
            onClick={() => navigate('/grahak/language')}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#102B4E] to-[#0B2340] hover:from-[#0B2340] hover:to-[#102B4E] text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-xl border border-[#C69A43]/40 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
          >
            <span className="tracking-wide">{t.ctaStart}</span>
            <div className="w-7 h-7 rounded-full bg-[#C69A43] flex items-center justify-center text-[#102B4E] transition-transform group-hover:translate-x-1">
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </button>

          {/* Secondary Action: Login for returning users */}
          <Link
            to="/grahak/login"
            className="py-2.5 px-4 rounded-xl text-sm font-bold text-[#102B4E] hover:text-[#C69A43] transition-colors flex items-center justify-center gap-1.5"
          >
            <span>{t.loginReturning}</span>
            <ChevronRight className="w-4 h-4 text-[#C69A43]" />
          </Link>
        </div>

        {/* 4. KEY FEATURE PILLARS (Mobile-First Cards) */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl text-left">
          <div className="p-3.5 rounded-2xl bg-white/70 border border-[#C69A43]/20 shadow-xs flex flex-col gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#C69A43]/15 flex items-center justify-center text-[#C69A43]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#102B4E]">हिसाब & बिक्री</span>
            <span className="text-[10px] text-[#65758B]">उधारी खाता और रोज़ की बिक्री</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/70 border border-[#C69A43]/20 shadow-xs flex flex-col gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#102B4E]/10 flex items-center justify-center text-[#102B4E]">
              <Camera className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#102B4E]">फोटो स्टॉक स्कैन</span>
            <span className="text-[10px] text-[#65758B]">सामान की फोटो से ऑटो गिनती</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/70 border border-[#C69A43]/20 shadow-xs flex flex-col gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#15803D]/10 flex items-center justify-center text-[#15803D]">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#102B4E]">जियोटैग हाजिरी</span>
            <span className="text-[10px] text-[#65758B]">कर्मचारियों की दुकान पर उपस्थिति</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/70 border border-[#C69A43]/20 shadow-xs flex flex-col gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#C05A3E]/10 flex items-center justify-center text-[#C05A3E]">
              <Receipt className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#102B4E]">ऑफलाइन बिल</span>
            <span className="text-[10px] text-[#65758B]">बिना इंटरनेट तुरंत पर्ची बनाएं</span>
          </div>
        </div>

      </main>

      {/* 5. FOOTER */}
      <footer className="py-4 px-6 text-center text-xs text-[#65758B] border-t border-[#C69A43]/20 bg-white/40">
        <div className="flex items-center justify-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-[#15803D]" />
          <span className="font-semibold text-[#102B4E]">GrowNova OS द्वारा संचालित • डेटा १००% सुरक्षित</span>
        </div>
        <p className="text-[11px]">© {new Date().getFullYear()} Grahak Enterprise Services. Made with pride for Bharat.</p>
      </footer>

      {/* 6. LANGUAGE SELECTION MODAL */}
      {isLangModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B2340]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <FolkArtBorder className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#C69A43]/25 mb-4">
              <div>
                <h3 className="font-bold text-lg text-[#102B4E]">{t.chooseLanguage}</h3>
                <p className="text-xs text-[#65758B]">{t.chooseLanguageSub}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsLangModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-[#C69A43]/30 text-xs font-bold text-[#102B4E] hover:bg-red-50 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`p-3 rounded-2xl text-left border flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#102B4E] text-white border-[#C69A43] shadow-md scale-[1.02]'
                        : 'bg-white/80 hover:bg-white text-[#102B4E] border-[#C69A43]/25 hover:border-[#C69A43]'
                    }`}
                  >
                    <div>
                      <div className="text-base font-bold">{lang.nativeName}</div>
                      <div className={`text-xs ${isSelected ? 'text-[#D5AD66]' : 'text-[#65758B]'}`}>
                        {lang.name} • {lang.greeting}
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-[#D5AD66] flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 pt-3 border-t border-[#C69A43]/25 text-center">
              <button
                type="button"
                onClick={() => setIsLangModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#C69A43] hover:bg-[#D5AD66] text-[#102B4E] font-bold text-sm shadow-xs transition-colors cursor-pointer"
              >
                {t.continueBtn}
              </button>
            </div>
          </FolkArtBorder>
        </div>
      )}
    </div>
  );
};

export default GrahakEntryPage;
