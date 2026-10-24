import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  Receipt, 
  AlertTriangle, 
  MapPin, 
  Camera, 
  DollarSign, 
  CheckCircle2, 
  Landmark, 
  Sparkles, 
  Upload 
} from 'lucide-react';
import { GrahakLogo, DesiToranArch, FolkArtBorder } from '../../components/grahak/DesiArtElements';
import { useGrahakLanguage } from '../../context/GrahakLanguageContext';
import fixtures from '../../data/grahakFixtures.json';

export const GrahakFeaturesPage: React.FC = () => {
  const { t } = useGrahakLanguage();
  const [activeSection, setActiveSection] = useState<'dashboard' | 'attendance' | 'inventory_ai' | 'offline_billing' | 'salary'>('dashboard');

  // Dynamic Home / Today's stats state
  const [salesAmount, setSalesAmount] = useState(fixtures.todayStats.salesAmount);
  const [paymentsReceived, setPaymentsReceived] = useState(fixtures.todayStats.paymentsReceived);
  const [pendingBills, setPendingBills] = useState(fixtures.todayStats.pendingBillsAmount);
  const [stockItems, setStockItems] = useState(fixtures.lowStockItems);
  const [employees, setEmployees] = useState(fixtures.employees);
  const [customers] = useState(fixtures.customers);

  // Geotag attendance state
  const [currentGeoStatus, setCurrentGeoStatus] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState('emp-001');
  const [selfieCaptured, setSelfieCaptured] = useState(false);

  // AI Inventory recognition state
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);
  const [detectedProduct, setDetectedProduct] = useState<{ name: string; confidence: string } | null>(null);
  const [inputQuantity, setInputQuantity] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Offline bill creation state
  const [billCustomer, setBillCustomer] = useState(fixtures.customers[0].name);
  const [billItem, setBillItem] = useState('Tata Salt (1kg)');
  const [billQty, setBillQty] = useState(2);
  const [billRate, setBillRate] = useState(28);
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'UPI' | 'KHATA'>('CASH');
  const [createdBills, setCreatedBills] = useState<Array<{
    id: string;
    customer: string;
    item: string;
    amount: number;
    mode: string;
    time: string;
  }>>([
    { id: 'BILL-101', customer: 'Sunil Verma', item: 'Tata Salt x 2', amount: 56, mode: 'CASH', time: '10:15 AM' },
    { id: 'BILL-102', customer: 'Pooja Sharma', item: 'Mustard Oil x 1', amount: 145, mode: 'UPI', time: '11:30 AM' }
  ]);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Grahak Features — Geotag Haziri, AI Stock & Bills';
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Geotag Attendance check-in
  const handleGeotagCheckIn = () => {
    setIsLocating(true);
    setCurrentGeoStatus('GPS लोकेशन खोजी जा रही है...');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          const lat = pos.coords.latitude.toFixed(4);
          const lng = pos.coords.longitude.toFixed(4);
          setCurrentGeoStatus(`✅ दुकान पर उपस्थित: ${lat}° N, ${lng}° E (दूरी: 14m)`);
          setSelfieCaptured(true);

          // Update employee state
          setEmployees(prev => prev.map(emp => {
            if (emp.id === selectedEmpId) {
              return {
                ...emp,
                attendanceToday: 'PRESENT',
                checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                geotagLocation: `${lat}° N, ${lng}° E`,
                photoVerified: true
              };
            }
            return emp;
          }));

          triggerToast('हाजिरी सफलतापूर्वक जियोटैग एवं फोटो के साथ दर्ज हुई!');
        },
        () => {
          setIsLocating(false);
          setCurrentGeoStatus('✅ दुकान लोकेशन: 26.8467° N, 80.9462° E (मानक परिधि)');
          setSelfieCaptured(true);
          triggerToast('हाजिरी दर्ज की गई (मानक दुकान परिधि)।');
        }
      );
    } else {
      setIsLocating(false);
      setCurrentGeoStatus('स्थान दर्ज हुआ (GPS fallback)');
    }
  };

  // AI Inventory Simulation
  const handlePhotoUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedImageName(file.name);
    setIsAnalyzing(true);
    setDetectedProduct(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      // Sample AI detection
      setDetectedProduct({
        name: 'Fortune Kachi Ghani Mustard Oil (1L Pouch)',
        confidence: '98.4%'
      });
      setInputQuantity('10');
      triggerToast('AI ने सामान पहचान लिया! कृपया मात्रा की पुष्टि करें।');
    }, 1200);
  };

  const handleConfirmStockAdd = () => {
    if (!detectedProduct || !inputQuantity) return;
    const qty = parseInt(inputQuantity, 10) || 1;

    setStockItems(prev => [
      ...prev,
      {
        id: `stock-${Date.now()}`,
        name: detectedProduct.name,
        currentQuantity: qty,
        minimumThreshold: 15,
        unit: 'Packets',
        supplier: 'Kisan Agro Direct',
        price: 145
      }
    ]);

    triggerToast(`${detectedProduct.name} (+${qty}) स्टॉक में जोड़ दिया गया!`);
    setUploadedImageName(null);
    setDetectedProduct(null);
    setInputQuantity('');
  };

  // Create Offline Bill
  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = billQty * billRate;
    const newBill = {
      id: `BILL-${Date.now().toString().slice(-4)}`,
      customer: billCustomer,
      item: `${billItem} x ${billQty}`,
      amount: totalAmount,
      mode: paymentMode,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setCreatedBills([newBill, ...createdBills]);
    setSalesAmount(prev => prev + totalAmount);
    if (paymentMode === 'CASH' || paymentMode === 'UPI') {
      setPaymentsReceived(prev => prev + totalAmount);
    } else {
      setPendingBills(prev => prev + totalAmount);
    }

    triggerToast(`बिल #${newBill.id} (₹${totalAmount}) सफलतापूर्वक दर्ज किया गया!`);
  };

  return (
    <div className="min-h-screen bg-[#F8F5F1] text-[#102B4E] flex flex-col justify-between selection:bg-[#C69A43] selection:text-white">
      {/* Top Toran Arch */}
      <DesiToranArch />

      {/* Top Header */}
      <div className="max-w-5xl mx-auto w-full px-4 pt-3 flex items-center justify-between border-b border-[#C69A43]/20 pb-3">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-xs font-semibold text-[#102B4E] border border-[#C69A43]/30 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <GrahakLogo size={36} />
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/grahak/settings"
            className="px-3 py-1.5 rounded-full bg-[#102B4E] text-white text-xs font-bold hover:bg-[#0B2340] cursor-pointer"
          >
            Settings
          </Link>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white shadow-xl border border-[#C69A43] animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
          <span className="text-xs font-bold text-[#102B4E]">{toastMessage}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        
        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveSection('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
              activeSection === 'dashboard'
                ? 'bg-[#102B4E] text-white shadow-sm'
                : 'bg-white/80 hover:bg-white text-[#102B4E] border border-[#C69A43]/30'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#D5AD66]" />
            <span>आज का हिसाब (Today's Home)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('offline_billing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
              activeSection === 'offline_billing'
                ? 'bg-[#102B4E] text-white shadow-sm'
                : 'bg-white/80 hover:bg-white text-[#102B4E] border border-[#C69A43]/30'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-[#D5AD66]" />
            <span>ऑफलाइन बिलिंग (Create Bill)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('inventory_ai')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
              activeSection === 'inventory_ai'
                ? 'bg-[#102B4E] text-white shadow-sm'
                : 'bg-white/80 hover:bg-white text-[#102B4E] border border-[#C69A43]/30'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-[#D5AD66]" />
            <span>AI फोटो स्टॉक स्कैन (Inventory AI)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('attendance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
              activeSection === 'attendance'
                ? 'bg-[#102B4E] text-white shadow-sm'
                : 'bg-white/80 hover:bg-white text-[#102B4E] border border-[#C69A43]/30'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#D5AD66]" />
            <span>जियोटैग हाजिरी (Attendance)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('salary')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
              activeSection === 'salary'
                ? 'bg-[#102B4E] text-white shadow-sm'
                : 'bg-white/80 hover:bg-white text-[#102B4E] border border-[#C69A43]/30'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-[#D5AD66]" />
            <span>कर्मचारी वेतन (Salary Workflows)</span>
          </button>
        </div>

        {/* 1. DYNAMIC HOME / TODAY'S SALES & ALERTS */}
        {activeSection === 'dashboard' && (
          <div className="space-y-6">
            {/* 4 KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl bg-white border border-[#C69A43]/30 shadow-xs">
                <span className="text-[11px] font-bold text-[#65758B]">{t.todaySales}</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#102B4E] font-serif mt-1">
                  ₹{salesAmount.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-[#15803D] font-bold mt-1 block">
                  ↑ +18% कल से अधिक
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#C69A43]/30 shadow-xs">
                <span className="text-[11px] font-bold text-[#65758B]">{t.paymentsReceived}</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#15803D] font-serif mt-1">
                  ₹{paymentsReceived.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-[#65758B] font-medium mt-1 block">
                  UPI & नकद मिला
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#C69A43]/30 shadow-xs">
                <span className="text-[11px] font-bold text-[#65758B]">{t.pendingBills}</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#C05A3E] font-serif mt-1">
                  ₹{pendingBills.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-[#C05A3E] font-bold mt-1 block">
                  8 ग्राहकों के खाते में बाकी
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#C69A43]/30 shadow-xs">
                <span className="text-[11px] font-bold text-[#65758B]">{t.stockAlerts}</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#C69A43] font-serif mt-1">
                  {stockItems.length} सामान
                </div>
                <span className="text-[10px] text-[#C69A43] font-bold mt-1 block">
                  तुरंत मंगाने की ज़रूरत
                </span>
              </div>
            </div>

            {/* Low-stock Table and Bank Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Low Stock Items */}
              <div className="lg:col-span-7">
                <FolkArtBorder>
                  <div className="flex items-center justify-between pb-2 border-b border-[#C69A43]/20 mb-3">
                    <h3 className="text-sm font-bold text-[#102B4E] flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-[#C69A43]" />
                      <span>कम स्टॉक अलर्ट (Low-Stock Reorder List)</span>
                    </h3>
                  </div>

                  <div className="space-y-2 text-xs">
                    {stockItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-xl bg-white border border-[#C69A43]/25 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-[#102B4E] block">{item.name}</span>
                          <span className="text-[10px] text-[#65758B]">सप्लायर: {item.supplier}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full block">
                            बचे हैं: {item.currentQuantity} {item.unit}
                          </span>
                          <span className="text-[10px] text-[#65758B]">न्यूनतम सीमा: {item.minimumThreshold}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </FolkArtBorder>
              </div>

              {/* Consent-Based Bank Feed Status */}
              <div className="lg:col-span-5">
                <FolkArtBorder>
                  <div className="flex items-center justify-between pb-2 border-b border-[#C69A43]/20 mb-3">
                    <h3 className="text-sm font-bold text-[#102B4E] flex items-center gap-1.5">
                      <Landmark className="w-4 h-4 text-[#102B4E]" />
                      <span>बैंक खाता स्थिति (Consent-Based)</span>
                    </h3>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#C69A43]/30 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#102B4E]">{fixtures.bankConnection.bankName}</span>
                      <span className="text-[10px] font-bold text-[#15803D] bg-emerald-50 px-2 py-0.5 rounded-full">
                        सक्रिय
                      </span>
                    </div>
                    <span className="font-mono text-[#65758B] block text-[11px]">
                      {fixtures.bankConnection.accountMasked}
                    </span>
                    <p className="text-[10px] text-[#55677D]">
                      सुरक्षित RBI अकाउंट एग्रीगेटर से जुड़ा हुआ। कोई बैंकिंग पासवर्ड या UPI पिन आवश्यक नहीं है।
                    </p>
                    <div className="pt-2 border-t border-[#C69A43]/20 flex items-center justify-between text-[11px]">
                      <span>अंतिम सिंक: {fixtures.bankConnection.lastSyncTime}</span>
                      <span className="font-bold text-[#102B4E]">3 नए UPI लेनदेन</span>
                    </div>
                  </div>
                </FolkArtBorder>
              </div>
            </div>
          </div>
        )}

        {/* 2. GEOTAG ATTENDANCE MODULE */}
        {activeSection === 'attendance' && (
          <div className="space-y-6">
            <FolkArtBorder>
              <div className="flex items-center justify-between pb-3 border-b border-[#C69A43]/20 mb-4">
                <div>
                  <h2 className="text-base font-bold text-[#102B4E] flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#C69A43]" />
                    <span>कर्मचारी जियोटैग हाजिरी (Geotag Employee Attendance)</span>
                  </h2>
                  <p className="text-xs text-[#55677D]">
                    स्थान केवल चेक-इन या चेक-आउट के समय दुकान की परिधि में होने पर ही लिया जाता है।
                  </p>
                </div>
              </div>

              {/* Attendance Action Box */}
              <div className="p-4 rounded-2xl bg-white border border-[#C69A43]/30 space-y-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#102B4E] block mb-1">
                      कर्मचारी चुनें (Select Employee)
                    </label>
                    <select
                      value={selectedEmpId}
                      onChange={(e) => setSelectedEmpId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F8F5F1] border border-[#C69A43]/40 text-xs font-bold text-[#102B4E]"
                    >
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} ({emp.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#102B4E] block mb-1">
                      लाइव चेक-इन क्रिया
                    </label>
                    <button
                      type="button"
                      onClick={handleGeotagCheckIn}
                      disabled={isLocating}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#102B4E] hover:bg-[#0B2340] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#D5AD66]" />
                      <span>{isLocating ? 'स्थान जांचा जा रहा है...' : 'जियोटैग हाजिरी लगाएं'}</span>
                    </button>
                  </div>
                </div>

                {/* Geotag Result Feedback */}
                {currentGeoStatus && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-medium flex items-center justify-between">
                    <span>{currentGeoStatus}</span>
                    {selfieCaptured && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                        📸 सेल्फी सत्यापित
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Today's Staff Attendance List */}
              <h3 className="text-xs font-bold text-[#102B4E] mb-2 uppercase tracking-wider">
                आज की हाजिरी स्थिति ({new Date().toLocaleDateString('hi-IN')})
              </h3>
              <div className="space-y-2 text-xs">
                {employees.map((emp) => (
                  <div
                    key={emp.id}
                    className="p-3 rounded-xl bg-white border border-[#C69A43]/20 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#102B4E]/10 flex items-center justify-center font-bold text-[#102B4E]">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-[#102B4E] block">{emp.name}</span>
                        <span className="text-[11px] text-[#65758B]">{emp.role}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      {emp.attendanceToday === 'PRESENT' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-[#15803D]">
                          उपस्थित • {emp.checkInTime}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                          छुट्टी (Leave)
                        </span>
                      )}
                      {emp.geotagLocation && (
                        <span className="text-[10px] text-[#65758B] block mt-0.5 font-mono">
                          {emp.geotagLocation}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </FolkArtBorder>
          </div>
        )}

        {/* 3. AI INVENTORY RECOGNITION FROM PHOTO & PDF */}
        {activeSection === 'inventory_ai' && (
          <div className="space-y-6">
            <FolkArtBorder>
              <div className="flex items-center justify-between pb-3 border-b border-[#C69A43]/20 mb-4">
                <div>
                  <h2 className="text-base font-bold text-[#102B4E] flex items-center gap-2">
                    <Camera className="w-5 h-5 text-[#C69A43]" />
                    <span>फोटो एवं पर्ची से सामान पहचान (AI Inventory Scanner)</span>
                  </h2>
                  <p className="text-xs text-[#55677D]">
                    सामान या इनवॉइस की फोटो क्लिक करें। AI उत्पाद पहचान कर आपसे संख्या पूछेगा और स्टॉक में जोड़ देगा।
                  </p>
                </div>
              </div>

              {/* Upload Box */}
              <div className="p-6 rounded-2xl bg-white border-2 border-dashed border-[#C69A43]/50 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#C69A43]/15 text-[#C69A43] flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <label className="px-4 py-2 rounded-xl bg-[#102B4E] text-white text-xs font-bold cursor-pointer hover:bg-[#0B2340] transition-colors inline-block">
                    <span>सामान की फोटो या PDF चुनें</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handlePhotoUploadSim}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-[#65758B] mt-2">
                    (कैमरे से फोटो लें या बिल / सप्लायर चालान की PDF अपलोड करें)
                  </p>
                  {uploadedImageName && (
                    <span className="text-[11px] font-bold text-[#102B4E] block mt-1">
                      चयनित: {uploadedImageName}
                    </span>
                  )}
                </div>
              </div>

              {/* Analysis state */}
              {isAnalyzing && (
                <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-2 animate-pulse">
                  <Sparkles className="w-4 h-4 text-[#C69A43]" />
                  <span>AI उत्पाद की पहचान कर रहा है...</span>
                </div>
              )}

              {/* Detected Product & Quantity Prompt */}
              {detectedProduct && (
                <div className="mt-5 p-4 rounded-2xl bg-white border border-[#15803D]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#15803D] uppercase tracking-wider block">
                        पहचाना गया सामान (AI Confidence: {detectedProduct.confidence})
                      </span>
                      <h4 className="text-sm font-bold text-[#102B4E]">{detectedProduct.name}</h4>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#C69A43]/20 flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-xs font-bold text-[#102B4E] block mb-1">
                        दुकान में कितनी मात्रा आई है? (Enter Quantity)
                      </label>
                      <input
                        type="number"
                        value={inputQuantity}
                        onChange={(e) => setInputQuantity(e.target.value)}
                        placeholder="उदा. 12"
                        className="w-full px-3 py-2 rounded-xl bg-[#F8F5F1] border border-[#C69A43]/40 text-xs font-bold text-[#102B4E]"
                      />
                    </div>
                    <div className="pt-5">
                      <button
                        type="button"
                        onClick={handleConfirmStockAdd}
                        className="py-2.5 px-5 rounded-xl bg-[#15803D] text-white font-bold text-xs cursor-pointer hover:bg-emerald-800 transition-colors"
                      >
                        स्टॉक में जोड़ें
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </FolkArtBorder>
          </div>
        )}

        {/* 4. OFFLINE BILLING & PAYMENT RECORDING */}
        {activeSection === 'offline_billing' && (
          <div className="space-y-6">
            <FolkArtBorder>
              <div className="flex items-center justify-between pb-3 border-b border-[#C69A43]/20 mb-4">
                <div>
                  <h2 className="text-base font-bold text-[#102B4E] flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-[#C69A43]" />
                    <span>ऑफलाइन बिल बनाएं & भुगतान दर्ज करें</span>
                  </h2>
                  <p className="text-xs text-[#55677D]">
                    इंटरनेट के बिना भी तुरंत बिल काटें। नकद, UPI या उधारी खाता चुनें।
                  </p>
                </div>
              </div>

              {/* Bill Form */}
              <form onSubmit={handleCreateBill} className="p-4 rounded-2xl bg-white border border-[#C69A43]/30 space-y-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#102B4E] block mb-1">ग्राहक का नाम</label>
                    <input
                      type="text"
                      list="customer-list"
                      value={billCustomer}
                      onChange={(e) => setBillCustomer(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F8F5F1] border border-[#C69A43]/40 text-xs font-semibold text-[#102B4E]"
                      required
                    />
                    <datalist id="customer-list">
                      {customers.map((c) => (
                        <option key={c.id} value={c.name} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#102B4E] block mb-1">सामान का नाम</label>
                    <input
                      type="text"
                      value={billItem}
                      onChange={(e) => setBillItem(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F8F5F1] border border-[#C69A43]/40 text-xs font-semibold text-[#102B4E]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-[#102B4E] block mb-1">मात्रा (Qty)</label>
                      <input
                        type="number"
                        min="1"
                        value={billQty}
                        onChange={(e) => setBillQty(parseInt(e.target.value, 10) || 1)}
                        className="w-full px-2 py-2 rounded-xl bg-[#F8F5F1] border border-[#C69A43]/40 text-xs font-semibold text-[#102B4E]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#102B4E] block mb-1">मूल्य (Rate ₹)</label>
                      <input
                        type="number"
                        min="1"
                        value={billRate}
                        onChange={(e) => setBillRate(parseInt(e.target.value, 10) || 0)}
                        className="w-full px-2 py-2 rounded-xl bg-[#F8F5F1] border border-[#C69A43]/40 text-xs font-semibold text-[#102B4E]"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Mode Selector */}
                <div className="pt-2 border-t border-[#C69A43]/20">
                  <label className="text-xs font-bold text-[#102B4E] block mb-2">भुगतान का माध्यम (Payment Mode)</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMode('CASH')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        paymentMode === 'CASH'
                          ? 'bg-[#15803D] text-white border-[#15803D]'
                          : 'bg-[#F8F5F1] text-[#102B4E] border-[#C69A43]/30'
                      }`}
                    >
                      💵 नकद (Cash)
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMode('UPI')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        paymentMode === 'UPI'
                          ? 'bg-[#102B4E] text-white border-[#102B4E]'
                          : 'bg-[#F8F5F1] text-[#102B4E] border-[#C69A43]/30'
                      }`}
                    >
                      📱 ऑनलाइन UPI
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMode('KHATA')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        paymentMode === 'KHATA'
                          ? 'bg-[#C05A3E] text-white border-[#C05A3E]'
                          : 'bg-[#F8F5F1] text-[#102B4E] border-[#C69A43]/30'
                      }`}
                    >
                      📒 उधारी खाता (Credit)
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-bold text-[#102B4E]">
                    कुल बिल राशि: <strong className="text-lg font-serif">₹{billQty * billRate}</strong>
                  </span>
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-[#102B4E] text-white font-bold text-xs cursor-pointer hover:bg-[#0B2340] transition-colors"
                  >
                    बिल काटें (Create Bill)
                  </button>
                </div>
              </form>

              {/* Recent Bills List */}
              <h3 className="text-xs font-bold text-[#102B4E] mb-2 uppercase tracking-wider">
                हाल ही में कटे ऑफलाइन बिल (Recent Bills)
              </h3>
              <div className="space-y-2 text-xs">
                {createdBills.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-xl bg-white border border-[#C69A43]/20 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-[#102B4E]">{b.customer}</span>
                      <span className="text-[11px] text-[#65758B] block">{b.item} • {b.time}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold font-serif text-[#102B4E] block">₹{b.amount}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-[#102B4E]">
                        {b.mode}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </FolkArtBorder>
          </div>
        )}

        {/* 5. SALARY WORKFLOWS */}
        {activeSection === 'salary' && (
          <div className="space-y-6">
            <FolkArtBorder>
              <div className="flex items-center justify-between pb-3 border-b border-[#C69A43]/20 mb-4">
                <div>
                  <h2 className="text-base font-bold text-[#102B4E] flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#C69A43]" />
                    <span>कर्मचारी वेतन एवं अग्रिम (Salary & Advance Ledger)</span>
                  </h2>
                  <p className="text-xs text-[#55677D]">
                    हाजिरी रिकॉर्ड एवं लिए गए एडवांस के आधार पर महीने का वेतन ऑटो-कैलकुलेट करें।
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                {employees.map((emp) => {
                  const daysPresent = emp.attendanceToday === 'PRESENT' ? 24 : 20;
                  const perDaySalary = Math.round(emp.monthlySalary / 30);
                  const netEarned = perDaySalary * daysPresent;
                  const netPayable = netEarned - emp.salaryAdvance;

                  return (
                    <div
                      key={emp.id}
                      className="p-4 rounded-2xl bg-white border border-[#C69A43]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <span className="text-sm font-bold text-[#102B4E] block">{emp.name}</span>
                        <span className="text-[11px] text-[#65758B]">
                          मूल मासिक वेतन: ₹{emp.monthlySalary.toLocaleString('en-IN')} • हाजिरी: {daysPresent}/30 दिन
                        </span>
                        <span className="text-[11px] text-red-600 font-semibold block mt-0.5">
                          लिया गया अग्रिम (Advance): ₹{emp.salaryAdvance}
                        </span>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-[#65758B] block">इस महीने का देय वेतन (Net Payable)</span>
                        <span className="text-lg font-bold font-serif text-[#15803D]">
                          ₹{netPayable.toLocaleString('en-IN')}
                        </span>
                        <div className="mt-1">
                          <button
                            type="button"
                            onClick={() => triggerToast(`${emp.name} का वेतन भुगतान (₹${netPayable}) दर्ज किया गया!`)}
                            className="px-3 py-1 rounded-lg bg-[#102B4E] text-white text-[10px] font-bold cursor-pointer"
                          >
                            वेतन भुगतान दर्ज करें
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </FolkArtBorder>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="py-3 text-center text-xs text-[#65758B] border-t border-[#C69A43]/20 bg-white/40">
        <span>Grahak Feature Hub • Contemporary Desi Art Business Module</span>
      </footer>
    </div>
  );
};

export default GrahakFeaturesPage;
