import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Store, 
  Globe, 
  Landmark, 
  CloudCheck, 
  HelpCircle, 
  LogOut, 
  CheckCircle2, 
  Save, 
  MapPin, 
  RefreshCw
} from 'lucide-react';
import { GrahakLogo, DesiToranArch, FolkArtBorder } from '../../components/grahak/DesiArtElements';
import { useGrahakLanguage } from '../../context/GrahakLanguageContext';
import { type SupportedLanguage } from '../../utils/grahakTranslations';
import { useAuth } from '../../context/AuthContext';
import fixtures from '../../data/grahakFixtures.json';

export const GrahakSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { currentLang, setLanguage, t, supportedLanguages } = useGrahakLanguage();

  const [activeTab, setActiveTab] = useState<'profile' | 'language' | 'attendance' | 'bank' | 'sync' | 'support'>('profile');
  
  // Shop details
  const [shopName, setShopName] = useState(fixtures.shop.name);
  const [ownerName, setOwnerName] = useState(fixtures.shop.owner);
  const [phone, setPhone] = useState(fixtures.shop.phone);
  const [businessType, setBusinessType] = useState(fixtures.shop.businessType);
  const [gstin, setGstin] = useState(fixtures.shop.gstin);
  const [address, setAddress] = useState(fixtures.shop.address);
  const [upiId, setUpiId] = useState(fixtures.shop.upiId);

  // Attendance settings
  const [geotagRadius, setGeotagRadius] = useState('50');
  const [requireSelfie, setRequireSelfie] = useState(true);
  const [openingTime, setOpeningTime] = useState('09:00 AM');
  const [closingTime, setClosingTime] = useState('09:30 PM');

  // Bank & Sync status
  const [lastSyncTime, setLastSyncTime] = useState(fixtures.bankConnection.lastSyncTime);
  const [isSyncing, setIsSyncing] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Grahak Settings — Dukaan & Bhasha Niyantran';

    const savedSetup = localStorage.getItem('grahak_shop_full_setup');
    if (savedSetup) {
      try {
        const parsed = JSON.parse(savedSetup);
        if (parsed.shopName) setShopName(parsed.shopName);
        if (parsed.ownerName) setOwnerName(parsed.ownerName);
        if (parsed.businessType) setBusinessType(parsed.businessType);
        if (parsed.upiId) setUpiId(parsed.upiId);
      } catch {
        // ignore
      }
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
    const langObj = supportedLanguages.find((l) => l.code === lang);
    triggerToast(`भाषा बदलकर ${langObj?.nativeName || lang} कर दी गई है।`);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      shopName,
      ownerName,
      phone,
      businessType,
      gstin,
      address,
      upiId,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('grahak_shop_full_setup', JSON.stringify(updated));
    triggerToast('दुकान की जानकारी सफलतापूर्वक सुरक्षित कर ली गई है।');
  };

  const handleSyncData = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime('Just now');
      triggerToast('सभी ऑफलाइन बिल्स और डेटा क्लाउड पर सिंक हो चुके हैं।');
    }, 1200);
  };

  const handleLogout = async () => {
    if (window.confirm('क्या आप ग्राहक खाते से लॉगआउट करना चाहते हैं?')) {
      await logout();
      navigate('/grahak');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F1] text-[#102B4E] flex flex-col justify-between selection:bg-[#C69A43] selection:text-white">
      {/* Top Toran Arch */}
      <DesiToranArch />

      {/* Top Nav */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-3 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-xs font-semibold text-[#102B4E] border border-[#C69A43]/30 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard Par Jaayein</span>
        </Link>

        <GrahakLogo size={36} />

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-xs font-bold text-red-700 border border-red-200 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white shadow-xl border border-[#C69A43] animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
          <span className="text-xs font-bold text-[#102B4E]">{toastMessage}</span>
        </div>
      )}

      {/* Main Settings Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102B4E] font-serif">
            {t.settingsTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#55677D] mt-0.5">
            दुकान प्रोफाइल, बहुभाषी नियंत्रण, बैंक कनेक्शन एवं जियोटैग हाजिरी नियम
          </p>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-[#102B4E] text-white shadow-sm'
                : 'bg-white/80 hover:bg-white text-[#102B4E] border border-[#C69A43]/25'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>दुकान प्रोफाइल (Shop)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('language')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'language'
                ? 'bg-[#102B4E] text-white shadow-sm'
                : 'bg-white/80 hover:bg-white text-[#102B4E] border border-[#C69A43]/25'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>भाषा (Language - {supportedLanguages.find((l: any) => l.code === currentLang)?.nativeName})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'attendance'
                ? 'bg-[#102B4E] text-white shadow-sm'
                : 'bg-white/80 hover:bg-white text-[#102B4E] border border-[#C69A43]/25'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>जियोटैग हाजिरी (Attendance)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bank')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'bank'
                ? 'bg-[#102B4E] text-white shadow-sm'
                : 'bg-white/80 hover:bg-white text-[#102B4E] border border-[#C69A43]/25'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>बैंक कनेक्शन (Bank Link)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sync')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sync'
                ? 'bg-[#102B4E] text-white shadow-sm'
                : 'bg-white/80 hover:bg-white text-[#102B4E] border border-[#C69A43]/25'
            }`}
          >
            <CloudCheck className="w-3.5 h-3.5" />
            <span>डेटा सिंक (Data Sync)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('support')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'support'
                ? 'bg-[#102B4E] text-white shadow-sm'
                : 'bg-white/80 hover:bg-white text-[#102B4E] border border-[#C69A43]/25'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>मदद एवं सपोर्ट (Support)</span>
          </button>
        </div>

        {/* TAB 1: SHOP & OWNER PROFILE */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <FolkArtBorder>
              <h2 className="text-sm font-bold text-[#102B4E] pb-2 border-b border-[#C69A43]/20 mb-4 flex items-center gap-2">
                <Store className="w-4 h-4 text-[#C69A43]" />
                <span>दुकान एवं संचालक का विवरण</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#102B4E] block mb-1">दुकान का नाम</label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#C69A43]/40 text-xs font-semibold text-[#102B4E]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#102B4E] block mb-1">संचालक का नाम</label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#C69A43]/40 text-xs font-semibold text-[#102B4E]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#102B4E] block mb-1">पंजीकृत मोबाइल नंबर</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#C69A43]/40 text-xs font-semibold text-[#102B4E]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#102B4E] block mb-1">व्यापार श्रेणी</label>
                  <input
                    type="text"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#C69A43]/40 text-xs font-semibold text-[#102B4E]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#102B4E] block mb-1">GSTIN (वैकल्पिक)</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#C69A43]/40 text-xs font-semibold text-[#102B4E] uppercase"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#102B4E] block mb-1">दुकान का UPI आईडी (QR कोड के लिए)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#C69A43]/40 text-xs font-mono font-semibold text-[#102B4E]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-[#102B4E] block mb-1">दुकान का पूरा पता</label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#C69A43]/40 text-xs font-semibold text-[#102B4E]"
                  />
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#C69A43]/20 flex justify-end">
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-[#102B4E] hover:bg-[#0B2340] text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-xs"
                >
                  <Save className="w-3.5 h-3.5 text-[#D5AD66]" />
                  <span>सेव करें (Save Profile)</span>
                </button>
              </div>
            </FolkArtBorder>
          </form>
        )}

        {/* TAB 2: MULTILINGUAL CONTROLS */}
        {activeTab === 'language' && (
          <FolkArtBorder>
            <div className="mb-4">
              <h2 className="text-sm font-bold text-[#102B4E]">पसंदीदा भाषा चुनें (Choose Preferred Language)</h2>
              <p className="text-xs text-[#55677D]">ऐप की भाषा तुरंत बदल जाएगी। सभी ९ भारतीय भाषाएं उपलब्ध हैं।</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {supportedLanguages.map((lang: any) => {
                const isSelected = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`p-3 rounded-2xl text-left border flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#102B4E] text-white border-[#C69A43] shadow-md scale-[1.02]'
                        : 'bg-white/80 hover:bg-white text-[#102B4E] border-[#C69A43]/30 hover:border-[#C69A43]'
                    }`}
                  >
                    <div>
                      <div className="text-base font-bold font-serif">{lang.nativeName}</div>
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
          </FolkArtBorder>
        )}

        {/* TAB 3: GEOTAG ATTENDANCE PREFERENCES */}
        {activeTab === 'attendance' && (
          <FolkArtBorder className="space-y-4">
            <h2 className="text-sm font-bold text-[#102B4E] pb-2 border-b border-[#C69A43]/20 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C69A43]" />
              <span>कर्मचारी जियोटैग एवं हाजिरी नियम</span>
            </h2>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-white border border-[#C69A43]/30 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#102B4E] block">दुकान की जियो-फेंसिंग परिधि</span>
                  <span className="text-[#65758B] text-[11px]">हाजिरी केवल दुकान से कितने मीटर के दायरे में मान्य होगी</span>
                </div>
                <select
                  value={geotagRadius}
                  onChange={(e) => setGeotagRadius(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[#F8F5F1] border border-[#C69A43]/40 font-bold text-[#102B4E]"
                >
                  <option value="25">25 मीटर (दुकान के अंदर)</option>
                  <option value="50">50 मीटर (मानक)</option>
                  <option value="100">100 मीटर (बड़ा परिसर)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#C69A43]/30 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#102B4E] block">चेक-इन सेल्फी अनिवार्य</span>
                  <span className="text-[#65758B] text-[11px]">कर्मचारी को हाजिरी के समय लाइव फोटो क्लिक करना होगा</span>
                </div>
                <input
                  type="checkbox"
                  checked={requireSelfie}
                  onChange={(e) => setRequireSelfie(e.target.checked)}
                  className="w-4 h-4 accent-[#102B4E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white border border-[#C69A43]/30">
                  <span className="font-bold text-[#102B4E] block mb-1">दुकान खुलने का समय</span>
                  <input
                    type="text"
                    value={openingTime}
                    onChange={(e) => setOpeningTime(e.target.value)}
                    className="w-full px-2 py-1 rounded bg-[#F8F5F1] border border-[#C69A43]/40 font-semibold"
                  />
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#C69A43]/30">
                  <span className="font-bold text-[#102B4E] block mb-1">दुकान बंद होने का समय</span>
                  <input
                    type="text"
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
                    className="w-full px-2 py-1 rounded bg-[#F8F5F1] border border-[#C69A43]/40 font-semibold"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => triggerToast('हाजिरी नियम सुरक्षित कर लिए गए हैं।')}
              className="py-2 px-5 rounded-xl bg-[#102B4E] text-white font-bold text-xs cursor-pointer"
            >
              नियम सुरक्षित करें
            </button>
          </FolkArtBorder>
        )}

        {/* TAB 4: CONSENT-BASED BANK STATUS */}
        {activeTab === 'bank' && (
          <FolkArtBorder className="space-y-4">
            <h2 className="text-sm font-bold text-[#102B4E] pb-2 border-b border-[#C69A43]/20 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#C69A43]" />
              <span>सहमति-आधारित बैंक खाता स्थिति (Consent-Based Bank Feed)</span>
            </h2>

            <div className="p-4 rounded-2xl bg-white border border-[#C69A43]/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#102B4E] block">{fixtures.bankConnection.bankName}</span>
                  <span className="text-[11px] font-mono text-[#65758B]">{fixtures.bankConnection.accountMasked}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-[#15803D]">
                  सहमति सक्रिय (RBI AA Linked)
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F8F5F1] text-[11px] text-[#55677D] space-y-1">
                <p>• <strong>प्रकार:</strong> {fixtures.bankConnection.integrationType}</p>
                <p>• <strong>गोपनीयता नीति:</strong> कोई बैंकिंग पासवर्ड या UPI पिन कभी नहीं मांगा जाता।</p>
                <p>• <strong>अंतिम सिंक:</strong> {lastSyncTime}</p>
                <p>• <strong>सहमति समाप्ति:</strong> {fixtures.bankConnection.consentExpires}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#C69A43]/20">
                <span className="text-xs text-[#102B4E]">
                  अप्राप्त UPI लेनदेन: <strong>{fixtures.bankConnection.unreconciledUpiTransactions} प्राप्त हुए</strong>
                </span>
                <button
                  type="button"
                  onClick={handleSyncData}
                  disabled={isSyncing}
                  className="px-3 py-1.5 rounded-xl bg-[#102B4E] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>सिंक चेक करें</span>
                </button>
              </div>
            </div>
          </FolkArtBorder>
        )}

        {/* TAB 5: DATA SYNC STATUS */}
        {activeTab === 'sync' && (
          <FolkArtBorder className="space-y-4">
            <h2 className="text-sm font-bold text-[#102B4E] pb-2 border-b border-[#C69A43]/20 flex items-center gap-2">
              <CloudCheck className="w-4 h-4 text-[#C69A43]" />
              <span>डेटा सिंक एवं ऑफलाइन स्टोरेज स्थिति</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white border border-[#C69A43]/30">
                <span className="text-[11px] font-bold text-[#65758B] block">स्थानीय ऑफलाइन स्टोरेज</span>
                <span className="text-base font-bold text-[#102B4E] mt-1 block">सक्रिय (Active)</span>
                <p className="text-[10px] text-[#65758B] mt-1">इंटरनेट कटने पर भी सभी बिल स्थानीय रूप से सुरक्षित रहेंगे।</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#C69A43]/30">
                <span className="text-[11px] font-bold text-[#65758B] block">क्लाउड बैकअप</span>
                <span className="text-base font-bold text-[#15803D] mt-1 block">१००% सुरक्षित</span>
                <p className="text-[10px] text-[#65758B] mt-1">अंतिम बैकअप: {lastSyncTime}</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSyncData}
                disabled={isSyncing}
                className="py-2.5 px-6 rounded-xl bg-[#102B4E] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>अभी पूरा डेटा सिंक करें</span>
              </button>
            </div>
          </FolkArtBorder>
        )}

        {/* TAB 6: HELP & SUPPORT */}
        {activeTab === 'support' && (
          <FolkArtBorder className="space-y-4">
            <h2 className="text-sm font-bold text-[#102B4E] pb-2 border-b border-[#C69A43]/20 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#C69A43]" />
              <span>दुकानदार सहायता एवं हेल्पलाइन</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-900 block">WhatsApp हेल्पलाइन (२४x७)</span>
                  <span className="text-emerald-700 text-[11px]">+91 98765 00000 पर कभी भी संदेश भेजें</span>
                </div>
                <a
                  href="https://wa.me/919876500000"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#15803D] text-white font-bold text-xs cursor-pointer"
                >
                  WhatsApp खोलें
                </a>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#C69A43]/30">
                <span className="font-bold text-[#102B4E] block mb-1">अक्सर पूछे जाने वाले सवाल (FAQ)</span>
                <ul className="list-disc list-inside space-y-1 text-[#55677D] text-[11px]">
                  <li>इंटरनेट न होने पर बिल कैसे बनेगा? (ग्राहक ऐप अपने आप ऑफलाइन मोड में काम करता है)</li>
                  <li>कर्मचारी की हाजिरी फोटो कैसे सत्यापित होती है?</li>
                  <li>पुराना बही-खाता कैसे जोड़ें?</li>
                </ul>
              </div>
            </div>
          </FolkArtBorder>
        )}

      </main>

      {/* Footer */}
      <footer className="py-3 text-center text-xs text-[#65758B]">
        <span>Grahak Settings Module • GrowNova OS</span>
      </footer>
    </div>
  );
};

export default GrahakSettingsPage;
