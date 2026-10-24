import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Globe } from 'lucide-react';
import { GrahakLogo, DesiToranArch, FolkArtBorder } from '../../components/grahak/DesiArtElements';
import { 
  SUPPORTED_LANGUAGES, 
  GRAHAK_TRANSLATIONS, 
  getStoredGrahakLanguage, 
  setStoredGrahakLanguage,
  type SupportedLanguage 
} from '../../utils/grahakTranslations';

export const GrahakLanguagePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('hi');

  useEffect(() => {
    document.title = 'Bhasha Chuniye — Choose Language | Grahak';
    const saved = getStoredGrahakLanguage();
    setSelectedLang(saved);
  }, []);

  const handleSelect = (code: SupportedLanguage) => {
    setSelectedLang(code);
    setStoredGrahakLanguage(code);
  };

  const handleContinue = () => {
    setStoredGrahakLanguage(selectedLang);
    navigate('/grahak/signup');
  };

  const t = GRAHAK_TRANSLATIONS[selectedLang];

  return (
    <div className="min-h-screen bg-[#F8F5F1] text-[#102B4E] flex flex-col justify-between selection:bg-[#C69A43] selection:text-white">
      {/* Top Toran Arch */}
      <DesiToranArch />

      {/* Top Navigation */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/grahak')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white text-xs font-semibold text-[#102B4E] border border-[#C69A43]/30 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Wapas / Back</span>
        </button>

        <GrahakLogo size={36} />
      </div>

      {/* Main Content Card */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 sm:py-8 flex flex-col justify-center">
        <FolkArtBorder className="w-full">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C69A43]/15 text-[#102B4E] text-xs font-bold mb-2">
              <Globe className="w-3.5 h-3.5 text-[#C69A43]" />
              <span>Step 1 of 3: Bhasha Ka Chunaav</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102B4E] font-serif">
              {t.chooseLanguage}
            </h1>
            <p className="text-xs sm:text-sm text-[#55677D] mt-1">
              {t.chooseLanguageSub}
            </p>
          </div>

          {/* 9 Language Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = selectedLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`p-3.5 rounded-2xl text-left border flex flex-col justify-between transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-[#102B4E] text-white border-[#C69A43] shadow-md scale-[1.02]'
                      : 'bg-white/80 hover:bg-white text-[#102B4E] border-[#C69A43]/25 hover:border-[#C69A43]'
                  }`}
                >
                  <div className="flex items-start justify-between w-full">
                    <span className="text-lg font-bold font-serif">{lang.nativeName}</span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-[#D5AD66] flex-shrink-0" />
                    )}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] w-full">
                    <span className={isSelected ? 'text-[#D5AD66]' : 'text-[#65758B]'}>
                      {lang.name}
                    </span>
                    <span className={`italic ${isSelected ? 'text-white/80' : 'text-[#65758B]/70'}`}>
                      "{lang.greeting}"
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#C69A43]/20">
            <Link
              to="/grahak/login"
              className="text-xs font-bold text-[#102B4E] hover:text-[#C69A43] transition-colors order-2 sm:order-1"
            >
              {t.loginReturning}
            </Link>

            <button
              type="button"
              onClick={handleContinue}
              className="w-full sm:w-auto py-3 px-8 rounded-xl bg-gradient-to-r from-[#102B4E] to-[#0B2340] hover:from-[#0B2340] hover:to-[#102B4E] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer order-1 sm:order-2 border border-[#C69A43]/40"
            >
              <span>{t.continueBtn}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </FolkArtBorder>
      </main>

      {/* Footer */}
      <footer className="py-3 text-center text-xs text-[#65758B]">
        <span>Grahak • Contemporary Desi Art Mobile Experience</span>
      </footer>
    </div>
  );
};

export default GrahakLanguagePage;
