export type SupportedLanguage = 
  | 'hi' // Hindi
  | 'en' // English
  | 'pa' // Punjabi
  | 'mr' // Marathi
  | 'gu' // Gujarati
  | 'bn' // Bengali
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'kn'; // Kannada

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  script: string;
  greeting: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari', greeting: 'नमस्ते' },
  { code: 'en', name: 'English', nativeName: 'English', script: 'Latin', greeting: 'Welcome' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', script: 'Gurmukhi', greeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', script: 'Devanagari', greeting: 'नमस्कार' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', script: 'Gujarati', greeting: 'નમસ્તે' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', script: 'Bengali', greeting: 'নমস্কার' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil', greeting: 'வணக்கம்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu', greeting: 'నమస్కారం' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada', greeting: 'ನಮಸ್ಕಾರ' },
];

export interface TranslationDictionary {
  brandName: string;
  headline: string;
  subheadline: string;
  ctaStart: string;
  loginReturning: string;
  loginAction: string;
  signupAction: string;
  chooseLanguage: string;
  chooseLanguageSub: string;
  continueBtn: string;
  mobileLabel: string;
  mobilePlaceholder: string;
  enterOtp: string;
  otpSub: string;
  resendOtp: string;
  verifyAndLogin: string;
  fullNameLabel: string;
  shopNameLabel: string;
  businessTypeLabel: string;
  preferredLangLabel: string;
  alreadyHaveAccount: string;
  noAccount: string;
  onboardingTitle: string;
  onboardingSub: string;
  continueToGrahak: string;
  todaySales: string;
  paymentsReceived: string;
  pendingBills: string;
  stockAlerts: string;
  geotagAttendance: string;
  inventoryScanner: string;
  offlineBilling: string;
  bankSync: string;
  settingsTitle: string;
}

export const GRAHAK_TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  hi: {
    brandName: 'ग्राहक',
    headline: 'आपके दुकान का अपना डिजिटल साथी।',
    subheadline: 'हिसाब, बिक्री, स्टॉक और बिल्स — सब एक ही जगह।',
    ctaStart: 'शुरू कीजिये',
    loginReturning: 'पहले से खाता है? लॉगिन करें',
    loginAction: 'लॉगिन करें',
    signupAction: 'नया खाता बनाएं',
    chooseLanguage: 'अपनी पसंदीदा भाषा चुनें',
    chooseLanguageSub: 'आप इसे बाद में सेटिंग्स से कभी भी बदल सकते हैं।',
    continueBtn: 'आगे बढ़ें',
    mobileLabel: 'मोबाइल नंबर',
    mobilePlaceholder: '10 अंकों का मोबाइल नंबर दर्ज करें',
    enterOtp: 'ओटीपी (OTP) दर्ज करें',
    otpSub: 'हमने आपके मोबाइल नंबर पर 6 अंकों का कोड भेजा है',
    resendOtp: 'दोबारा ओटीपी भेजें',
    verifyAndLogin: 'सत्यापित करें और आगे बढ़ें',
    fullNameLabel: 'आपका पूरा नाम',
    shopNameLabel: 'दुकान या व्यापार का नाम',
    businessTypeLabel: 'व्यापार का प्रकार',
    preferredLangLabel: 'पसंदीदा भाषा',
    alreadyHaveAccount: 'पहले से खाता है?',
    noAccount: 'नया खाता बनाना चाहते हैं?',
    onboardingTitle: 'दुकान की बुनियादी जानकारी',
    onboardingSub: 'सिर्फ दो मिनट में अपने डिजिटल व्यापार की शुरुआत करें',
    continueToGrahak: 'ग्राहक ऐप शुरू करें',
    todaySales: 'आज की कुल बिक्री',
    paymentsReceived: 'प्राप्त भुगतान',
    pendingBills: 'बाकी उधारी (पेंडिंग बिल्स)',
    stockAlerts: 'कम स्टॉक अलर्ट',
    geotagAttendance: 'कर्मचारी जियोटैग हाजिरी',
    inventoryScanner: 'फोटो से सामान पहचान (AI)',
    offlineBilling: 'ऑफलाइन बिल बनाएं',
    bankSync: 'बैंक खाता स्थिति (सुरक्षित)',
    settingsTitle: 'दुकान एवं खाता सेटिंग्स',
  },
  en: {
    brandName: 'Grahak',
    headline: 'Aapke dukaan ka apna digital saathi.',
    subheadline: 'Hisab, bikri, stock aur bills — sab ek hi jagah.',
    ctaStart: 'Shuru Kijiye',
    loginReturning: 'Already have an account? Login',
    loginAction: 'Login to Grahak',
    signupAction: 'Create New Account',
    chooseLanguage: 'Choose Your Preferred Language',
    chooseLanguageSub: 'You can change your language anytime from Settings.',
    continueBtn: 'Continue',
    mobileLabel: 'Mobile Number',
    mobilePlaceholder: 'Enter 10-digit mobile number',
    enterOtp: 'Enter 6-Digit OTP',
    otpSub: 'We sent a verification code to your mobile number',
    resendOtp: 'Resend OTP',
    verifyAndLogin: 'Verify & Continue',
    fullNameLabel: 'Full Name',
    shopNameLabel: 'Shop / Business Name',
    businessTypeLabel: 'Type of Business',
    preferredLangLabel: 'Preferred Language',
    alreadyHaveAccount: 'Already registered?',
    noAccount: 'Need a new account?',
    onboardingTitle: 'Quick Shop Setup',
    onboardingSub: 'Set up your digital ledger in less than two minutes',
    continueToGrahak: 'Continue to Grahak',
    todaySales: "Today's Total Sales",
    paymentsReceived: 'Payments Received',
    pendingBills: 'Pending Customer Bills',
    stockAlerts: 'Low Stock Alerts',
    geotagAttendance: 'Employee Geotag Attendance',
    inventoryScanner: 'Photo Stock Recognition (AI)',
    offlineBilling: 'Create Offline Bills',
    bankSync: 'Bank Account Status (Secure)',
    settingsTitle: 'Shop & Account Settings',
  },
  pa: {
    brandName: 'ਗ੍ਰਾਹਕ',
    headline: 'ਤੁਹਾਡੀ ਦੁਕਾਨ ਦਾ ਆਪਣਾ ਡਿਜੀਟਲ ਸਾਥੀ।',
    subheadline: 'ਹਿਸਾਬ, ਵਿਕਰੀ, ਸਟਾਕ ਅਤੇ ਬਿੱਲ — ਸਭ ਇੱਕੋ ਥਾਂ।',
    ctaStart: 'ਸ਼ੁਰੂ ਕਰੋ',
    loginReturning: 'ਪਹਿਲਾਂ ਤੋਂ ਖਾਤਾ ਹੈ? ਲੌਗਇਨ ਕਰੋ',
    loginAction: 'ਲੌਗਇਨ ਕਰੋ',
    signupAction: 'ਨਵਾਂ ਖਾਤਾ ਬਣਾਓ',
    chooseLanguage: 'ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਚੁਣੋ',
    chooseLanguageSub: 'ਤੁਸੀਂ ਬਾਅਦ ਵਿੱਚ ਸੈਟਿੰਗਾਂ ਤੋਂ ਇਸਨੂੰ ਬਦਲ ਸਕਦੇ ਹੋ।',
    continueBtn: 'ਅੱਗੇ ਵਧੋ',
    mobileLabel: 'ਮੋਬਾਈਲ ਨੰਬਰ',
    mobilePlaceholder: '10 ਅੰਕਾਂ ਦਾ ਮੋਬਾਈਲ ਨੰਬਰ ਭਰੋ',
    enterOtp: 'ਓਟੀਪੀ (OTP) ਦਰਜ ਕਰੋ',
    otpSub: 'ਅਸੀਂ ਤੁਹਾਡੇ ਮੋਬਾਈਲ ਨੰਬਰ ਤੇ 6 ਅੰਕਾਂ ਦਾ ਕੋਡ ਭੇਜਿਆ ਹੈ',
    resendOtp: 'ਓਟੀਪੀ ਦੁਬਾਰਾ ਭੇਜੋ',
    verifyAndLogin: 'ਪੁਸ਼ਟੀ ਕਰੋ ਅਤੇ ਅੱਗੇ ਵਧੋ',
    fullNameLabel: 'ਤੁਹਾਡਾ ਪੂਰਾ ਨਾਮ',
    shopNameLabel: 'ਦੁਕਾਨ ਜਾਂ ਵਪਾਰ ਦਾ ਨਾਮ',
    businessTypeLabel: 'ਕਾਰੋਬਾਰ ਦੀ ਕਿਸਮ',
    preferredLangLabel: 'ਤਰਜੀਹੀ ਭਾਸ਼ਾ',
    alreadyHaveAccount: 'ਪਹਿਲਾਂ ਤੋਂ ਖਾਤਾ ਹੈ?',
    noAccount: 'ਨਵਾਂ ਖਾਤਾ ਬਣਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?',
    onboardingTitle: 'ਦੁਕਾਨ ਦਾ ਸੈੱਟਅੱਪ',
    onboardingSub: 'ਦੋ ਮਿੰਟ ਵਿੱਚ ਆਪਣਾ ਡਿਜੀਟਲ ਕਾਰੋਬਾਰ ਸ਼ੁਰੂ ਕਰੋ',
    continueToGrahak: 'ਗ੍ਰਾਹਕ ਐਪ ਵਿੱਚ ਜਾਓ',
    todaySales: 'ਅੱਜ ਦੀ ਕੁੱਲ ਵਿਕਰੀ',
    paymentsReceived: 'ਮਿਲੇ ਭੁਗਤਾਨ',
    pendingBills: 'ਬਕਾਇਆ ਬਿੱਲ',
    stockAlerts: 'ਘੱਟ ਸਟਾਕ ਅਲਰਟ',
    geotagAttendance: 'ਕਰਮਚਾਰੀ ਜਿਓਟੈਗ ਹਾਜ਼ਰੀ',
    inventoryScanner: 'ਫੋਟੋ ਨਾਲ ਸਟਾਕ ਪਛਾਣ (AI)',
    offlineBilling: 'ਆਫਲਾਈਨ ਬਿੱਲ ਬਣਾਓ',
    bankSync: 'ਬੈਂਕ ਖਾਤਾ ਸਥਿਤੀ',
    settingsTitle: 'ਦੁਕਾਨ ਅਤੇ ਖਾਤਾ ਸੈਟਿੰਗਾਂ',
  },
  mr: {
    brandName: 'ग्राहक',
    headline: 'तुमच्या दुकानाचा हक्काचा डिजिटल साथीदार.',
    subheadline: 'हिशोब, विक्री, स्टॉक आणि बिले — सर्व काही एकाच ठिकाणी.',
    ctaStart: 'सुरू करा',
    loginReturning: 'आधीच खाते आहे? लॉगिन करा',
    loginAction: 'लॉगिन करा',
    signupAction: 'नवीन खाते तयार करा',
    chooseLanguage: 'तुमची आवडती भाषा निवडा',
    chooseLanguageSub: 'तुम्ही नंतर सेटिंग्जमधून भाषा बदलू शकता.',
    continueBtn: 'पुढे जा',
    mobileLabel: 'मोबाईल नंबर',
    mobilePlaceholder: '१० अंकी मोबाईल नंबर टाका',
    enterOtp: 'ओटीपी (OTP) प्रविष्ट करा',
    otpSub: 'आम्ही तुमच्या नंबरवर ६ अंकी पडताळणी कोड पाठवला आहे',
    resendOtp: 'पुन्हा ओटीपी पाठवा',
    verifyAndLogin: 'पडताळणी करा आणि पुढे जा',
    fullNameLabel: 'तुमचे पूर्ण नाव',
    shopNameLabel: 'दुकान किंवा व्यवसायाचे नाव',
    businessTypeLabel: 'व्यवसायाचा प्रकार',
    preferredLangLabel: 'पसंतीची भाषा',
    alreadyHaveAccount: 'आधीच नोंदणीकृत आहात?',
    noAccount: 'नवीन खाते सुरू करायचे आहे?',
    onboardingTitle: 'दुकान सेटअप',
    onboardingSub: 'अवघ्या दोन मिनिटांत तुमचा डिजिटल व्यवसाय सुरू करा',
    continueToGrahak: 'ग्राहक ॲपमध्ये सुरू ठेवा',
    todaySales: 'आजची एकूण विक्री',
    paymentsReceived: 'मिळालेली देयके',
    pendingBills: 'बाकी उधारी बिले',
    stockAlerts: 'कमी स्टॉक अलर्ट',
    geotagAttendance: 'कर्मचारी जिओटॅग हजेरी',
    inventoryScanner: 'फोटोवरून स्टॉक ओळख (AI)',
    offlineBilling: 'ऑफलाइन बिल तयार करा',
    bankSync: 'बँक खाते स्थिती',
    settingsTitle: 'दुकान आणि खाते सेटिंग्ज',
  },
  gu: {
    brandName: 'ગ્રાહક',
    headline: 'તમારી દુકાનનો પોતાનો ડિજિટલ સાથી.',
    subheadline: 'હિસાબ, વેચાણ, સ્ટોક અને બિલો — બધું એક જ જગ્યાએ.',
    ctaStart: 'શરૂ કરો',
    loginReturning: 'પહેલેથી ખાતું છે? લૉગિન કરો',
    loginAction: 'લૉગિન કરો',
    signupAction: 'નવું ખાતું બનાવો',
    chooseLanguage: 'તમારી પસંદગીની ભાષા પસંદ કરો',
    chooseLanguageSub: 'તમે પછીથી સેટિંગ્સમાંથી ભાષા બદલી શકો છો.',
    continueBtn: 'આગળ વધો',
    mobileLabel: 'મોબાઈલ નંબર',
    mobilePlaceholder: '૧૦ અંકનો મોબાઈલ નંબર લખો',
    enterOtp: 'ઓટીપી (OTP) દાખલ કરો',
    otpSub: 'અમે તમારા મોબાઈલ નંબર પર ૬ અંકનો કોડ મોકલ્યો છે',
    resendOtp: 'ફરીથી ઓટીપી મોકલો',
    verifyAndLogin: 'ચકાસો અને આગળ વધો',
    fullNameLabel: 'તમારું પૂરું નામ',
    shopNameLabel: 'દુકાન અથવા વ્યવસાયનું નામ',
    businessTypeLabel: 'વ્યવસાયનો પ્રકાર',
    preferredLangLabel: 'પસંદગીની ભાષા',
    alreadyHaveAccount: 'પહેલેથી નોંધાયેલા છો?',
    noAccount: 'નવું ખાતું બનાવવું છે?',
    onboardingTitle: 'દુકાન સેટઅપ',
    onboardingSub: 'બે મિનિટમાં તમારો ડિજિટલ ચોપડો શરૂ કરો',
    continueToGrahak: 'ગ્રાહક ઍપ પર જાઓ',
    todaySales: 'આજનું કુલ વેચાણ',
    paymentsReceived: 'મળેલ ચૂકવણી',
    pendingBills: 'બાકી ઉધારી બિલો',
    stockAlerts: 'ઓછો સ્ટોક ચેતવણી',
    geotagAttendance: 'કર્મચારી જીઓટેગ હાજરી',
    inventoryScanner: 'ફોટો દ્વારા સ્ટોક ઓળખ (AI)',
    offlineBilling: 'ઓફલાઇન બિલ બનાવો',
    bankSync: 'બેંક ખાતાની સ્થિતિ',
    settingsTitle: 'દુકાન અને ખાતા સેટિંગ્સ',
  },
  bn: {
    brandName: 'গ্রাহক',
    headline: 'আপনার দোকানের নিজস্ব ডিজিটাল সাথী।',
    subheadline: 'হিসাব, বিক্রি, স্টক ও বিল — সবই এক জায়গায়।',
    ctaStart: 'শুরু করুন',
    loginReturning: 'আগে থেকেই অ্যাকাউন্ট আছে? লগইন করুন',
    loginAction: 'লগইন করুন',
    signupAction: 'নতুন অ্যাকাউন্ট তৈরি করুন',
    chooseLanguage: 'আপনার পছন্দের ভাষা বেছে নিন',
    chooseLanguageSub: 'আপনি সেটিংস থেকে পরে যেকোনো সময় এটি পরিবর্তন করতে পারেন।',
    continueBtn: 'এগিয়ে যান',
    mobileLabel: 'মোবাইল নম্বর',
    mobilePlaceholder: '১০ সংখ্যার মোবাইল নম্বর লিখুন',
    enterOtp: 'ওটিপি (OTP) লিখুন',
    otpSub: 'আমরা আপনার নম্বরে ৬ সংখ্যার কোড পাঠিয়েছি',
    resendOtp: 'আবার ওটিপি পাঠান',
    verifyAndLogin: 'যাচাই করে এগিয়ে যান',
    fullNameLabel: 'আপনার পুরো নাম',
    shopNameLabel: 'দোকান বা ব্যবসার নাম',
    businessTypeLabel: 'ব্যবসার ধরন',
    preferredLangLabel: 'পছন্দের ভাষা',
    alreadyHaveAccount: 'আগে থেকেই অ্যাকাউন্ট আছে?',
    noAccount: 'নতুন অ্যাকাউন্ট খুলতে চান?',
    onboardingTitle: 'দোকানের সেটআপ',
    onboardingSub: 'মাত্র দুই মিনিটে আপনার ডিজিটাল খাতা শুরু করুন',
    continueToGrahak: 'গ্রাহক অ্যাপে প্রবেশ করুন',
    todaySales: 'আজকের মোট বিক্রি',
    paymentsReceived: 'গৃহীত পেমেন্ট',
    pendingBills: 'বাকি থাকা বিল',
    stockAlerts: 'কম স্টক সতর্কতা',
    geotagAttendance: 'কর্মীদের জিওট্যাগ হাজিরা',
    inventoryScanner: 'ছবি থেকে স্টক শনাক্তকরণ (AI)',
    offlineBilling: 'অফলাইন বিল তৈরি করুন',
    bankSync: 'ব্যাংক অ্যাকাউন্টের অবস্থা',
    settingsTitle: 'দোকান ও অ্যাকাউন্ট সেটিংস',
  },
  ta: {
    brandName: 'கிராஹக்',
    headline: 'உங்கள் கடையின் டிஜிட்டல் தோழன்.',
    subheadline: 'கணக்கு, விற்பனை, இருப்பு மற்றும் பில்கள் — அனைத்தும் ஒரே இடத்தில்.',
    ctaStart: 'தொடங்குங்கள்',
    loginReturning: 'ஏற்கனவே கணக்கு உள்ளதா? உள்நுழையவும்',
    loginAction: 'உள்நுழையவும்',
    signupAction: 'புதிய கணக்கை உருவாக்கவும்',
    chooseLanguage: 'உங்கள் விருப்ப மொழியைத் தேர்ந்தெடுக்கவும்',
    chooseLanguageSub: 'அமைப்புகள் பகுதியில் இதை எப்போது வேண்டுமானாலும் மாற்றலாம்.',
    continueBtn: 'தொடரவும்',
    mobileLabel: 'கைபேசி எண்',
    mobilePlaceholder: '10 இலக்க மொபைல் எண்ணை உள்ளிடவும்',
    enterOtp: 'OTP குறியீட்டை உள்ளிடவும்',
    otpSub: 'உங்கள் கைபேசிக்கு 6 இலக்க குறியீடு அனுப்பப்பட்டுள்ளது',
    resendOtp: 'மீண்டும் OTP அனுப்பவும்',
    verifyAndLogin: 'சரிபார்த்து தொடரவும்',
    fullNameLabel: 'முழு பெயர்',
    shopNameLabel: 'கடை / வணிகப் பெயர்',
    businessTypeLabel: 'வணிக வகை',
    preferredLangLabel: 'விருப்ப மொழி',
    alreadyHaveAccount: 'ஏற்கனவே கணக்கு உள்ளதா?',
    noAccount: 'புதிய கணக்கு தேவையா?',
    onboardingTitle: 'கடை அமைப்புகள்',
    onboardingSub: 'இரண்டு நிமிடங்களில் உங்கள் டிஜிட்டல் கணக்கை அமைக்கவும்',
    continueToGrahak: 'கிராஹக் பயன்பாட்டிற்கு செல்க',
    todaySales: 'இன்றைய மொத்த விற்பனை',
    paymentsReceived: 'பெறப்பட்ட கட்டணங்கள்',
    pendingBills: 'நிலுவையில் உள்ள பில்கள்',
    stockAlerts: 'குறைந்த இருப்பு எச்சரிக்கை',
    geotagAttendance: 'பணியாளர் ஜியோடேக் வருகைப்பதிவு',
    inventoryScanner: 'புகைப்பட இருப்பு அறிதல் (AI)',
    offlineBilling: 'ஆஃப்லைன் பில் உருவாக்கவும்',
    bankSync: 'வங்கி கணக்கு நிலை',
    settingsTitle: 'கடை மற்றும் கணக்கு அமைப்புகள்',
  },
  te: {
    brandName: 'గ్రాహక్',
    headline: 'మీ దుకాణానికి అసలైన డిజిటల్ స్నేహితుడు.',
    subheadline: 'లెక్కలు, అమ్మకాలు, స్టాక్ మరియు బిల్లులు — అన్నీ ఒకే చోట.',
    ctaStart: 'ప్రారంభించండి',
    loginReturning: 'ఇప్పటికే ఖాతా ఉందా? లాగిన్ అవ్వండి',
    loginAction: 'లాగిన్ అవ్వండి',
    signupAction: 'కొత్త ఖాతా సృష్టించండి',
    chooseLanguage: 'మీకు నచ్చిన భాషను ఎంచుకోండి',
    chooseLanguageSub: 'మీరు తర్వాత సెట్టింగ్స్ నుండి మార్చుకోవచ్చు.',
    continueBtn: 'కొనసాగించండి',
    mobileLabel: 'మొబైల్ నంబర్',
    mobilePlaceholder: '10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి',
    enterOtp: 'OTP నమోదు చేయండి',
    otpSub: 'మీ మొబైల్ నంబర్‌కు 6 అంకెల కోడ్ పంపాము',
    resendOtp: 'మళ్లీ OTP పంపండి',
    verifyAndLogin: 'ధృవీకరించి కొనసాగించండి',
    fullNameLabel: 'మీ పూర్తి పేరు',
    shopNameLabel: 'దుకాణం లేదా వ్యాపారం పేరు',
    businessTypeLabel: 'వ్యాపార రకం',
    preferredLangLabel: 'ప్రాధాన్యత భాష',
    alreadyHaveAccount: 'ఇప్పటికే రిజిస్టర్ అయ్యారా?',
    noAccount: 'కొత్త ఖాతా కావాలా?',
    onboardingTitle: 'దుకాణం సెటప్',
    onboardingSub: 'కేవలం రెండు నిమిషాల్లో డిజిటల్ వ్యాపారం ప్రారంభించండి',
    continueToGrahak: 'గ్రాహక్ యాప్‌కు వెళ్లండి',
    todaySales: 'నేటి మొత్తం అమ్మకాలు',
    paymentsReceived: 'వచ్చిన చెల్లింపులు',
    pendingBills: 'బాకీ ఉన్న బిల్లులు',
    stockAlerts: 'తక్కువ స్టాక్ హెచ్చరిక',
    geotagAttendance: 'ఉద్యోగుల జియోట్యాగ్ హాజరు',
    inventoryScanner: 'ఫోటో ద్వారా స్టాక్ గుర్తింపు (AI)',
    offlineBilling: 'ఆఫ్‌లైన్ బిల్లు చేయండి',
    bankSync: 'బ్యాంకు ఖాతా స్థితి',
    settingsTitle: 'దుకాణం & ఖాతా సెట్టింగ్స్',
  },
  kn: {
    brandName: 'ಗ್ರಾಹಕ್',
    headline: 'ನಿಮ್ಮ ಅಂಗಡಿಯ ನೆಚ್ಚಿನ ಡಿಜಿಟಲ್ ಸಹಾಯಕ.',
    subheadline: 'ಲೆಕ್ಕ, ಮಾರಾಟ, ಸ್ಟಾಕ್ ಮತ್ತು ಬಿಲ್‌ಗಳು — ಎಲ್ಲವೂ ಒಂದೇ ಕಡೆ.',
    ctaStart: 'ಪ್ರಾರಂಭಿಸಿ',
    loginReturning: 'ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ? ಲಾಗಿನ್ ಮಾಡಿ',
    loginAction: 'ಲಾಗಿನ್ ಮಾಡಿ',
    signupAction: 'ಹೊಸ ಖಾತೆ ರಚಿಸಿ',
    chooseLanguage: 'ನಿಮ್ಮ ನೆಚ್ಚಿನ ಭಾಷೆ ಆರಿಸಿ',
    chooseLanguageSub: 'ನಂತರ ಸೆಟ್ಟಿಂಗ್ಸ್‌ನಿಂದ ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಬಹುದು.',
    continueBtn: 'ಮುಂದುವರಿಯಿರಿ',
    mobileLabel: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    mobilePlaceholder: '10 ಅಂಕಿಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ',
    enterOtp: 'OTP ನಮೂದಿಸಿ',
    otpSub: 'ನಾವು ನಿಮ್ಮ ಮೊಬೈಲ್‌ಗೆ 6 ಅಂಕಿಗಳ ಕೋಡ್ ಕಳುಹಿಸಿದ್ದೇವೆ',
    resendOtp: 'ಮತ್ತೆ OTP ಕಳುಹಿಸಿ',
    verifyAndLogin: 'ದೃಢೀಕರಿಸಿ ಮುಂದುವರಿಯಿರಿ',
    fullNameLabel: 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು',
    shopNameLabel: 'ಅಂಗಡಿ ಅಥವಾ ವ್ಯಾಪಾರದ ಹೆಸರು',
    businessTypeLabel: 'ವ್ಯಾಪಾರದ ವಿಧ',
    preferredLangLabel: 'ಆದ್ಯತೆಯ ಭಾಷೆ',
    alreadyHaveAccount: 'ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?',
    noAccount: 'ಹೊಸ ಖಾತೆ ಬೇಕೇ?',
    onboardingTitle: 'ಅಂಗಡಿಯ ಸೆಟಪ್',
    onboardingSub: 'ಕೇವಲ ಎರಡು ನಿಮಿಷಗಳಲ್ಲಿ ಡಿಜಿಟಲ್ ಖಾತೆ ಆರಂಭಿಸಿ',
    continueToGrahak: 'ಗ್ರಾಹಕ್ ಆ್ಯಪ್ ಮುಂದುವರಿಸಿ',
    todaySales: 'ಇಂದಿನ ಒಟ್ಟು ಮಾರಾಟ',
    paymentsReceived: 'ಸ್ವೀಕರಿಸಿದ ಪಾವತಿ',
    pendingBills: 'ಬಾಕಿ ಬಿಲ್‌ಗಳು',
    stockAlerts: 'ಕಡಿಮೆ ಸ್ಟಾಕ್ ಎಚ್ಚರಿಕೆ',
    geotagAttendance: 'ನೌಕರರ ಜಿಯೋಟ್ಯಾಗ್ ಹಾಜರಾತಿ',
    inventoryScanner: 'ಫೋಟೋ ಮೂಲಕ ಸ್ಟಾಕ್ ಗುರುತಿಸುವಿಕೆ (AI)',
    offlineBilling: 'ಆಫ್‌ಲೈನ್ ಬಿಲ್ ರಚಿಸಿ',
    bankSync: 'ಬ್ಯಾಂಕ್ ಖಾತೆಯ ಸ್ಥಿತಿ',
    settingsTitle: 'ಅಂಗಡಿ ಮತ್ತು ಖಾತೆ ಸೆಟ್ಟಿಂಗ್ಸ್',
  },
};

const STORAGE_KEY = 'grahak_selected_language';

export function getStoredGrahakLanguage(): SupportedLanguage {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (saved in GRAHAK_TRANSLATIONS)) {
      return saved as SupportedLanguage;
    }
  } catch {
    // ignore
  }
  return 'hi'; // Default to Hindi
}

export function setStoredGrahakLanguage(lang: SupportedLanguage): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // ignore
  }
}
