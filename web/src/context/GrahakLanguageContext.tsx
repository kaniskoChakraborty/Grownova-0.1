import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  type SupportedLanguage, 
  type TranslationDictionary, 
  type LanguageInfo,
  SUPPORTED_LANGUAGES, 
  GRAHAK_TRANSLATIONS, 
  getStoredGrahakLanguage, 
  setStoredGrahakLanguage 
} from '../utils/grahakTranslations';
import { Globe, Check, X } from 'lucide-react';

interface GrahakLanguageContextType {
  currentLang: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationDictionary;
  languageInfo: LanguageInfo;
  supportedLanguages: LanguageInfo[];
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  openLanguageModal: () => void;
}

const GrahakLanguageContext = createContext<GrahakLanguageContextType | undefined>(undefined);

export const GrahakLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLangState] = useState<SupportedLanguage>(() => getStoredGrahakLanguage());
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Sync html lang attribute
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const setLanguage = (lang: SupportedLanguage) => {
    setCurrentLangState(lang);
    setStoredGrahakLanguage(lang);
    document.documentElement.lang = lang;
  };

  const openLanguageModal = () => setIsModalOpen(true);

  const t = GRAHAK_TRANSLATIONS[currentLang] || GRAHAK_TRANSLATIONS.hi;
  const languageInfo = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <GrahakLanguageContext.Provider
      value={{
        currentLang,
        setLanguage,
        t,
        languageInfo,
        supportedLanguages: SUPPORTED_LANGUAGES,
        isModalOpen,
        setIsModalOpen,
        openLanguageModal,
      }}
    >
      {children}

      {/* Global Interactive Contemporary Desi Art Language Selector Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-[#F8F5F1] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#C69A43]/30 relative text-[#102B4E] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Auspicious Toran Top Accent */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#102B4E] via-[#C69A43] to-[#102B4E]" />

            <div className="flex items-center justify-between pb-4 border-b border-[#C69A43]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#102B4E] text-[#C69A43] flex items-center justify-center font-bold text-lg shadow-sm border border-[#C69A43]/40">
                  <Globe className="w-5 h-5 text-[#C69A43]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg sm:text-xl text-[#102B4E]">
                    {t.chooseLanguage || 'अपनी भाषा चुनें'}
                  </h3>
                  <p className="text-xs text-[#55677D]">
                    Choose Your Preferred Language
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#102B4E] flex items-center justify-center border border-[#C69A43]/30 cursor-pointer transition-all"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Language Selection Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-6 max-h-[60vh] overflow-y-auto">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = lang.code === currentLang;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsModalOpen(false);
                    }}
                    className={`relative p-3.5 rounded-2xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between border ${
                      isSelected
                        ? 'bg-[#102B4E] text-white border-[#C69A43] shadow-md ring-2 ring-[#C69A43]/40'
                        : 'bg-white hover:bg-[#F3ECE0] text-[#102B4E] border-[#E2D8C9] hover:border-[#C69A43]/50 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-base sm:text-lg font-bold">
                        {lang.nativeName}
                      </span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-[#C69A43] text-white flex items-center justify-center text-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] opacity-80">
                      <span>{lang.name}</span>
                      <span className="italic">{lang.greeting}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#C69A43]/20 flex items-center justify-between text-xs text-[#55677D]">
              <span>💡 You can change language anytime from settings</span>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#102B4E] text-white text-xs font-bold hover:bg-[#102B4E]/90 cursor-pointer"
              >
                {t.continueBtn || 'लागू करें / Apply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </GrahakLanguageContext.Provider>
  );
};

export const useGrahakLanguage = (): GrahakLanguageContextType => {
  const context = useContext(GrahakLanguageContext);
  if (!context) {
    throw new Error('useGrahakLanguage must be used within a GrahakLanguageProvider');
  }
  return context;
};
