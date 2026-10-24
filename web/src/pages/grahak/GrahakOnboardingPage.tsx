import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Store, 
  QrCode, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Check,
  Globe
} from 'lucide-react';
import { GrahakLogo, DesiToranArch, FolkArtBorder } from '../../components/grahak/DesiArtElements';
import { useGrahakLanguage } from '../../context/GrahakLanguageContext';

export const GrahakOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentLang, languageInfo, openLanguageModal, t } = useGrahakLanguage();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form states from previous registration or defaults
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [upiId, setUpiId] = useState('shreeganesh@upi');
  const [enableGeotag] = useState(true);
  const [geotagStatus, setGeotagStatus] = useState<string>('26.8467° N, 80.9462° E (Verified Shop Zone)');
  const [staffCount] = useState(2);
  const [enablePhotoAttendance, setEnablePhotoAttendance] = useState(true);

  useEffect(() => {
    document.title = 'Grahak Onboarding — Shop Setup';

    // Read stored registration profile if present
    const profileJson = localStorage.getItem('grahak_shop_profile');
    if (profileJson) {
      try {
        const parsed = JSON.parse(profileJson);
        if (parsed.shopName) setShopName(parsed.shopName);
        if (parsed.fullName) setOwnerName(parsed.fullName);
        if (parsed.businessType) setBusinessType(parsed.businessType);
      } catch {
        // ignore
      }
    }
  }, []);

  // Set default localized values if user didn't register custom names
  useEffect(() => {
    if (!shopName) setShopName(t.defaultShopName);
    if (!ownerName) setOwnerName(t.defaultOwnerName);
    if (!businessType) setBusinessType(t.defaultCategory);
  }, [t, shopName, ownerName, businessType]);

  // Geolocation detector
  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGeotagStatus(`GPS: ${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E`);
        },
        () => {
          setGeotagStatus('GPS: 26.8467° N, 80.9462° E (Market Central Hub)');
        }
      );
    }
  };

  const handleFinishOnboarding = () => {
    localStorage.setItem('grahak_onboarding_completed', 'true');
    const fullProfile = {
      shopName,
      ownerName,
      businessType,
      upiId,
      enableGeotag,
      enablePhotoAttendance,
      staffCount,
      language: currentLang,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem('grahak_shop_full_setup', JSON.stringify(fullProfile));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8F5F1] text-[#102B4E] flex flex-col justify-between selection:bg-[#C69A43] selection:text-white">
      {/* Top Toran Arch */}
      <DesiToranArch />

      {/* Top Header */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-3 flex items-center justify-between">
        <GrahakLogo size={36} />

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                s === currentStep
                  ? 'bg-[#102B4E] text-white border-2 border-[#C69A43] shadow-xs'
                  : s < currentStep
                  ? 'bg-[#15803D] text-white'
                  : 'bg-white text-[#65758B] border border-[#C69A43]/30'
              }`}
            >
              {s < currentStep ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s}
            </div>
          ))}
        </div>

        {/* Language Pill */}
        <button
          type="button"
          onClick={openLanguageModal}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 hover:bg-white text-xs font-semibold text-[#102B4E] border border-[#C69A43]/30 cursor-pointer shadow-2xs"
        >
          <Globe className="w-3.5 h-3.5 text-[#C69A43]" />
          <span>{languageInfo.nativeName}</span>
        </button>
      </div>

      {/* Main Onboarding Wizard */}
      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-6 sm:py-8 flex flex-col justify-center">
        <FolkArtBorder className="w-full">
          
          {/* STEP 1: SHOP CONFIRMATION */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#C69A43]/15 text-[#C69A43] flex items-center justify-center mx-auto mb-2 border border-[#C69A43]/30">
                  <Store className="w-6 h-6" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#102B4E]">
                  {t.step1Title}
                </h2>
                <p className="text-xs text-[#55677D] mt-0.5">
                  {t.step1Sub}
                </p>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-[#102B4E] block mb-1">
                    {t.shopNameLabel}
                  </label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#C69A43]/40 text-sm font-semibold text-[#102B4E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#102B4E] block mb-1">
                    {t.fullNameLabel}
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#C69A43]/40 text-sm font-semibold text-[#102B4E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#102B4E] block mb-1">
                    {t.businessTypeLabel}
                  </label>
                  <input
                    type="text"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#C69A43]/40 text-sm font-semibold text-[#102B4E] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full py-3 rounded-xl bg-[#102B4E] hover:bg-[#0B2340] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <span>{t.nextBtn}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          )}

          {/* STEP 2: PAYMENT & BILLING SETUP */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#15803D]/15 text-[#15803D] flex items-center justify-center mx-auto mb-2 border border-[#15803D]/30">
                  <QrCode className="w-6 h-6" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#102B4E]">
                  {t.step2Title}
                </h2>
                <p className="text-xs text-[#55677D] mt-0.5">
                  {t.step2Sub}
                </p>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-[#102B4E] block mb-1">
                    {t.upiIdLabel}
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="shreeganesh@upi"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#C69A43]/40 text-sm font-semibold text-[#102B4E] focus:outline-none font-mono"
                  />
                  <span className="text-[10px] text-[#65758B] mt-1 block">
                    {t.upiNotice}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/80 border border-[#C69A43]/30 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#102B4E]">{t.offlineSupportTitle}</span>
                    <span className="text-[11px] font-bold text-[#15803D] bg-emerald-100 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                  <p className="text-[11px] text-[#55677D]">
                    {t.offlineSupportDesc}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="w-1/3 py-3 rounded-xl bg-white border border-[#C69A43]/40 text-xs font-bold text-[#102B4E] cursor-pointer"
                >
                  {t.backBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="w-2/3 py-3 rounded-xl bg-[#102B4E] hover:bg-[#0B2340] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>{t.nextBtn}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: GEOTAG ATTENDANCE SETUP */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#C05A3E]/15 text-[#C05A3E] flex items-center justify-center mx-auto mb-2 border border-[#C05A3E]/30">
                  <MapPin className="w-6 h-6" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#102B4E]">
                  {t.step3Title}
                </h2>
                <p className="text-xs text-[#55677D] mt-0.5">
                  {t.step3Sub}
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="p-3.5 rounded-xl bg-white border border-[#C69A43]/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#102B4E]">{t.geotagLabel}</span>
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      className="px-2.5 py-1 rounded-lg bg-[#C69A43]/15 hover:bg-[#C69A43]/25 text-[11px] font-bold text-[#102B4E] border border-[#C69A43]/40 cursor-pointer"
                    >
                      📍 {t.detectLocationBtn}
                    </button>
                  </div>
                  <p className="text-xs text-[#55677D] font-mono bg-[#F8F5F1] p-2 rounded-lg">
                    {geotagStatus}
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#C69A43]/30">
                  <div>
                    <span className="text-xs font-bold text-[#102B4E] block">{t.geotagAttendance}</span>
                    <span className="text-[10px] text-[#65758B]">Selfie Photo Verification Required</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enablePhotoAttendance}
                    onChange={(e) => setEnablePhotoAttendance(e.target.checked)}
                    className="w-4 h-4 accent-[#102B4E] cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-1/3 py-3 rounded-xl bg-white border border-[#C69A43]/40 text-xs font-bold text-[#102B4E] cursor-pointer"
                >
                  {t.backBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="w-2/3 py-3 rounded-xl bg-[#102B4E] hover:bg-[#0B2340] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>{t.nextBtn}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS / COMPLETE SCREEN */}
          {currentStep === 4 && (
            <div className="space-y-6 text-center animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#15803D] flex items-center justify-center mx-auto border-2 border-emerald-400 shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-bold text-[#C69A43] tracking-widest uppercase">
                  {t.congratulations}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102B4E] font-serif mt-1">
                  {t.step4Title}
                </h2>
                <p className="text-xs sm:text-sm text-[#55677D] mt-1 max-w-sm mx-auto">
                  <strong>{shopName}</strong> {t.accountReadyDesc}
                </p>
              </div>

              {/* Summary Badges */}
              <div className="grid grid-cols-2 gap-2 text-left text-xs bg-white/80 p-3.5 rounded-2xl border border-[#C69A43]/30">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                  <span className="text-[#102B4E] font-medium">{t.bankSync}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                  <span className="text-[#102B4E] font-medium">{t.offlineBilling}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                  <span className="text-[#102B4E] font-medium">{t.geotagAttendance}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                  <span className="text-[#102B4E] font-medium">100% Secure &amp; DPDP Ready</span>
                </div>
              </div>

              {/* Final Continue Action */}
              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#102B4E] to-[#0B2340] hover:from-[#0B2340] hover:to-[#102B4E] text-white font-bold text-base shadow-lg border border-[#C69A43]/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>{t.continueToGrahak}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          )}

        </FolkArtBorder>
      </main>

      {/* Footer */}
      <footer className="py-3 text-center text-xs text-[#65758B]">
        <div className="flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
          <span>Grahak Digital Onboarding System • Version 1.0</span>
        </div>
      </footer>
    </div>
  );
};

export default GrahakOnboardingPage;
