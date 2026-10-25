import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { getGrahakTranslation } from '../constants/translations';

interface GrahakLoginScreenProps {
  onBack: () => void;
  onSuccess: (mobile: string) => void;
  onNavigateToSignup: () => void;
  languageCode?: string;
}

export const GrahakLoginScreen: React.FC<GrahakLoginScreenProps> = ({
  onBack,
  onSuccess,
  onNavigateToSignup,
  languageCode = 'hi',
}) => {
  const t = getGrahakTranslation(languageCode);

  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const otpInputRefs = useRef<any[]>([]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (step === 'OTP' && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  const handleSendOtp = () => {
    setErrorMsg(null);
    const cleaned = mobile.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setErrorMsg(
        languageCode === 'en'
          ? 'Please enter a valid 10-digit Indian mobile number.'
          : 'कृपया १० अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें।'
      );
      return;
    }
    if (!/^[6-9]\d{9}$/.test(cleaned)) {
      setErrorMsg(
        languageCode === 'en'
          ? 'Mobile number must start with 6, 7, 8 or 9.'
          : 'मोबाइल नंबर 6, 7, 8 या 9 से शुरू होना चाहिए।'
      );
      return;
    }

    setStep('OTP');
    setResendTimer(30);
    setCanResend(false);
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 100);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    if (!/^\d*$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    setErrorMsg(null);
    const code = otp.join('');
    if (code.length !== 6) {
      setErrorMsg(
        languageCode === 'en'
          ? 'Please enter the complete 6-digit OTP code.'
          : 'कृपया पूरा ६ अंकों का OTP कोड दर्ज करें।'
      );
      return;
    }

    onSuccess(mobile);
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setResendTimer(30);
    setCanResend(false);
    setErrorMsg(null);
    otpInputRefs.current[0]?.focus();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top Header Bar */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            if (step === 'OTP') {
              setStep('PHONE');
            } else {
              onBack();
            }
          }}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={22} color={theme.colors.primary} />
        </TouchableOpacity>

        <View style={styles.headerBrand}>
          <View style={styles.headerEmblem}>
            <Text style={styles.headerEmblemText}>ग़</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>
              ग्राहक <Text style={styles.headerTitleSub}>GRAHAK</Text>
            </Text>
            <Text style={styles.headerTagline}>Digital Vyapar Saathi</Text>
          </View>
        </View>

        <View style={styles.headerRightSpacer} />
      </View>

      {/* Decorative Auspicious Toran Marigold Garland */}
      <View style={styles.toranRow}>
        <View style={styles.flowerDot}>
          <Text style={styles.flowerGlyph}>✿</Text>
        </View>
        <View style={styles.goldBead} />
        <View style={styles.flowerDot}>
          <Text style={styles.flowerGlyph}>✿</Text>
        </View>
        <View style={styles.shubhLabhPill}>
          <Text style={styles.shubhLabhStar}>✦</Text>
          <Text style={styles.shubhLabhText}>
            {languageCode === 'en' ? 'Vyapar Login • Safe' : 'व्यापारी लॉगिन • सुरक्षित'}
          </Text>
          <Text style={styles.shubhLabhStar}>✦</Text>
        </View>
        <View style={styles.flowerDot}>
          <Text style={styles.flowerGlyph}>✿</Text>
        </View>
        <View style={styles.goldBead} />
        <View style={styles.flowerDot}>
          <Text style={styles.flowerGlyph}>✿</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Step 1: Phone Input Form */}
        {step === 'PHONE' ? (
          <View style={styles.formContainer}>
            <View style={styles.titleArea}>
              <Text style={styles.screenHeading}>
                {languageCode === 'en' ? 'Shopkeeper Login' : 'दुकानदार लॉगिन'}
              </Text>
              <Text style={styles.screenSubheading}>
                {languageCode === 'en'
                  ? 'Enter your registered 10-digit mobile number to access your shop khata.'
                  : 'अपने पंजीकृत मोबाइल नंबर से दुकान का हिसाब-किताब खोलें।'}
              </Text>
            </View>

            {errorMsg && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={16} color={theme.colors.error} />
                <Text style={styles.errorBannerText}>{errorMsg}</Text>
              </View>
            )}

            {/* Input Card */}
            <View style={styles.inputCard}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>
                  {languageCode === 'en' ? 'Mobile Number' : 'मोबाइल नंबर'}
                </Text>
                <View style={styles.vyaparIdBadge}>
                  <Text style={styles.vyaparIdText}>VYAPAR ID</Text>
                </View>
              </View>

              <View style={styles.phoneInputRow}>
                <View style={styles.flagBlock}>
                  <Text style={styles.flagEmoji}>🇮🇳</Text>
                  <Text style={styles.countryCode}>+91</Text>
                </View>
                <View style={styles.inputDivider} />
                <TextInput
                  style={styles.phoneInput}
                  keyboardType="phone-pad"
                  maxLength={10}
                  placeholder="98230 45678"
                  placeholderTextColor="#94A3B8"
                  value={mobile}
                  onChangeText={(val) => setMobile(val.replace(/\D/g, ''))}
                  autoFocus
                />
              </View>

              {/* Helper SMS Chip */}
              <View style={styles.helperChip}>
                <MaterialIcons name="sms" size={16} color={theme.colors.secondary} />
                <Text style={styles.helperChipText}>
                  {languageCode === 'en'
                    ? 'A 6-digit OTP will be sent for instant login'
                    : 'लॉगिन के लिए आपके नंबर पर एक OTP आएगा'}
                </Text>
              </View>
            </View>

            {/* Action CTA Button */}
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleSendOtp}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>
                {languageCode === 'en' ? 'Get OTP Code • Continue' : 'OTP भेजें / Get OTP'}
              </Text>
              <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
            </TouchableOpacity>

            {/* Link to Register */}
            <View style={styles.switchAuthRow}>
              <Text style={styles.switchAuthPrompt}>
                {languageCode === 'en' ? 'New shop owner? ' : 'नया व्यापारी खाता खोलना है? '}
              </Text>
              <TouchableOpacity onPress={onNavigateToSignup} activeOpacity={0.7}>
                <Text style={styles.switchAuthLink}>
                  {languageCode === 'en' ? 'Sign Up (नया खाता)' : 'नया खाता बनाएं'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Trust Mini Showcase Card */}
            <View style={styles.showcaseCard}>
              <View style={styles.showcaseIconWrap}>
                <MaterialIcons name="receipt-long" size={22} color={theme.colors.secondary} />
              </View>
              <View style={styles.showcaseTextWrap}>
                <Text style={styles.showcaseTitle}>
                  {languageCode === 'en' ? '100% Free Digital Khata' : '१००% मुफ़्त डिजिटल खाता'}
                </Text>
                <Text style={styles.showcaseSubtitle}>
                  {languageCode === 'en'
                    ? 'Udhaar collection, GST bills & daily profit'
                    : 'उधारी वसूली, पक्का बिल और रोज़ाना गल्ला'}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          /* Step 2: OTP Verification */
          <View style={styles.formContainer}>
            <View style={styles.otpCard}>
              <View style={styles.otpCardHeader}>
                <View>
                  <Text style={styles.otpHeaderSub}>
                    {languageCode === 'en' ? 'VERIFICATION CODE' : 'वेरिफिकेशन कोड'}
                  </Text>
                  <Text style={styles.screenHeading}>
                    {languageCode === 'en' ? 'Enter OTP' : 'OTP दर्ज करें'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.changePhoneBtn}
                  onPress={() => setStep('PHONE')}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="edit" size={14} color={theme.colors.secondary} />
                  <Text style={styles.changePhoneBtnText}>
                    {languageCode === 'en' ? 'Change' : 'बदलें'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Target Phone notification bar */}
              <View style={styles.phoneNotifyBar}>
                <MaterialIcons name="mark-chat-unread" size={16} color={theme.colors.secondary} />
                <Text style={styles.phoneNotifyText}>
                  {languageCode === 'en' ? 'Sent to: ' : 'भेजा गया: '}
                  <Text style={styles.phoneNotifyBold}>+91 {mobile}</Text>
                </Text>
              </View>

              {errorMsg && (
                <View style={styles.errorBanner}>
                  <Ionicons name="alert-circle" size={16} color={theme.colors.error} />
                  <Text style={styles.errorBannerText}>{errorMsg}</Text>
                </View>
              )}

              {/* 6-Digit OTP Boxes */}
              <View style={styles.otpRow}>
                {otp.map((digit, idx) => (
                  <TextInput
                    key={idx}
                    ref={(ref) => {
                      otpInputRefs.current[idx] = ref;
                    }}
                    style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                    keyboardType="numeric"
                    maxLength={1}
                    value={digit}
                    onChangeText={(val) => handleOtpChange(idx, val)}
                  />
                ))}
              </View>

              {/* Resend Row */}
              <View style={styles.resendRow}>
                {canResend ? (
                  <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
                    <Text style={styles.resendActiveText}>{t.resendOtp}</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.resendWaitText}>
                    {languageCode === 'en' ? 'Resend OTP in ' : 'दोबारा भेजें: '}
                    <Text style={styles.resendWaitTimer}>{resendTimer}s</Text>
                  </Text>
                )}
              </View>

              {/* Verify Action Button */}
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleVerifyOtp}
                activeOpacity={0.85}
              >
                <MaterialIcons name="check-circle" size={20} color="#FFDEA6" />
                <Text style={styles.primaryBtnText}>
                  {languageCode === 'en' ? 'Verify & Open Shop' : 'दुकान खोलें (Verify & Login)'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF9F5',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(198, 154, 67, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerEmblem: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#102B4E',
    borderWidth: 1,
    borderColor: '#C69A43',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerEmblemText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFDEA6',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#102B4E',
  },
  headerTitleSub: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C69A43',
    letterSpacing: 1,
  },
  headerTagline: {
    fontSize: 9.5,
    color: '#65758B',
    fontWeight: '500',
  },
  headerRightSpacer: {
    width: 38,
  },
  toranRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 4,
  },
  flowerDot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flowerGlyph: {
    color: '#7C5800',
    fontSize: 11,
    fontWeight: 'bold',
  },
  goldBead: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FECD70',
  },
  shubhLabhPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(198, 154, 67, 0.12)',
  },
  shubhLabhStar: {
    fontSize: 9,
    color: '#7C5800',
  },
  shubhLabhText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7C5800',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  formContainer: {
    width: '100%',
  },
  titleArea: {
    marginBottom: 16,
  },
  screenHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#102B4E',
    marginBottom: 4,
  },
  screenSubheading: {
    fontSize: 13,
    color: '#65758B',
    lineHeight: 18,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#FFCDD2',
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  errorBannerText: {
    fontSize: 12,
    color: theme.colors.error,
    fontWeight: '600',
    flex: 1,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(198, 154, 67, 0.3)',
    shadowColor: '#102B4E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#102B4E',
  },
  vyaparIdBadge: {
    backgroundColor: 'rgba(198, 154, 67, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  vyaparIdText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#7C5800',
    letterSpacing: 0.5,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F3EF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(16, 43, 78, 0.08)',
  },
  flagBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 6,
  },
  flagEmoji: {
    fontSize: 18,
  },
  countryCode: {
    fontSize: 15,
    fontWeight: '700',
    color: '#102B4E',
  },
  inputDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#D1D5DB',
    marginRight: 10,
  },
  phoneInput: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#102B4E',
    letterSpacing: 1,
  },
  helperChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F6F3EF',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  helperChipText: {
    fontSize: 11,
    color: '#65758B',
    fontWeight: '500',
    flex: 1,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#102B4E',
    paddingVertical: 15,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#C69A43',
    shadowColor: '#102B4E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 16,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  switchAuthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  switchAuthPrompt: {
    fontSize: 12.5,
    color: '#65758B',
  },
  switchAuthLink: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#102B4E',
    textDecorationLine: 'underline',
  },
  showcaseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F6F3EF',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(198, 154, 67, 0.2)',
  },
  showcaseIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  showcaseTextWrap: {
    flex: 1,
  },
  showcaseTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#102B4E',
  },
  showcaseSubtitle: {
    fontSize: 11,
    color: '#65758B',
    marginTop: 1,
  },

  // OTP Verification Card Styles
  otpCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(198, 154, 67, 0.35)',
    shadowColor: '#102B4E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  otpCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  otpHeaderSub: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C5800',
    letterSpacing: 0.8,
  },
  changePhoneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F6F3EF',
  },
  changePhoneBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#102B4E',
  },
  phoneNotifyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F6F3EF',
    padding: 9,
    borderRadius: 10,
    marginBottom: 16,
  },
  phoneNotifyText: {
    fontSize: 12,
    color: '#44474E',
  },
  phoneNotifyBold: {
    fontWeight: '800',
    color: '#102B4E',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 14,
  },
  otpBox: {
    flex: 1,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#F6F3EF',
    borderWidth: 1.5,
    borderColor: 'rgba(198, 154, 67, 0.25)',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    color: '#102B4E',
  },
  otpBoxFilled: {
    backgroundColor: '#FFFDF9',
    borderColor: '#C69A43',
  },
  resendRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  resendActiveText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#7C5800',
    textDecorationLine: 'underline',
  },
  resendWaitText: {
    fontSize: 12,
    color: '#65758B',
  },
  resendWaitTimer: {
    fontWeight: '800',
    color: '#102B4E',
  },
});
