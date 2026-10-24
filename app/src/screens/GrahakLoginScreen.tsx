import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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

    // Successfully verified!
    onSuccess(`+91 ${mobile}`);
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtp(['', '', '', '', '', '']);
    setResendTimer(30);
    setCanResend(false);
    setErrorMsg(null);
    otpInputRefs.current[0]?.focus();
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (step === 'OTP') {
              setStep('PHONE');
            } else {
              onBack();
            }
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.primary} />
          <Text style={styles.backText}>{t.backBtn}</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>{t.loginAction}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Desi Art Banner */}
        <View style={styles.logoHeader}>
          <View style={styles.crestCircle}>
            <MaterialCommunityIcons name="storefront-outline" size={32} color="#D5AD66" />
          </View>
          <Text style={styles.screenHeading}>
            {step === 'PHONE' ? t.loginAction : t.enterOtp}
          </Text>
          <Text style={styles.screenSubtitle}>
            {step === 'PHONE'
              ? (languageCode === 'en'
                  ? 'Merchant Login • Secure mobile number access'
                  : 'दुकानदार लॉगिन • मोबाइल नंबर द्वारा सुरक्षित प्रवेश')
              : (languageCode === 'en'
                  ? `Enter 6-digit verification code sent to +91 ${mobile}`
                  : `+91 ${mobile} पर भेजा गया ६ अंकों का कोड दर्ज करें`)}
          </Text>
        </View>

        {/* Error Alert */}
        {errorMsg && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={16} color="#BA1A1A" />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        {/* STEP 1: MOBILE INPUT */}
        {step === 'PHONE' && (
          <View style={styles.formCard}>
            <Text style={styles.inputLabel}>{t.mobileLabel} *</Text>
            
            <View style={styles.phoneInputRow}>
              <View style={styles.countryCode}>
                <Text style={styles.flagText}>🇮🇳</Text>
                <Text style={styles.codeText}>+91</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                keyboardType="phone-pad"
                maxLength={10}
                placeholder={t.mobilePlaceholder}
                placeholderTextColor="#94A3B8"
                value={mobile}
                onChangeText={(text) => setMobile(text.replace(/\D/g, ''))}
                autoFocus
              />
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSendOtp}
              activeOpacity={0.85}
            >
              <Text style={styles.actionButtonText}>
                {languageCode === 'en' ? 'Get OTP Code • Continue' : 'OTP कोड प्राप्त करें (Continue)'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === 'OTP' && (
          <View style={styles.formCard}>
            <Text style={styles.inputLabel}>
              {languageCode === 'en' ? '6-Digit OTP Code' : '६ अंकों का OTP कोड'}
            </Text>

            <View style={styles.otpBoxesRow}>
              {otp.map((digit, idx) => (
                <TextInput
                  key={idx}
                  ref={(ref) => { otpInputRefs.current[idx] = ref; }}
                  style={styles.otpBox}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={(val) => handleOtpChange(idx, val)}
                  autoFocus={idx === 0}
                />
              ))}
            </View>

            {/* Resend Row */}
            <View style={styles.resendRow}>
              <TouchableOpacity onPress={() => setStep('PHONE')}>
                <Text style={styles.changePhoneText}>
                  {languageCode === 'en' ? 'Change Number' : 'नंबर बदलें'}
                </Text>
              </TouchableOpacity>

              {canResend ? (
                <TouchableOpacity onPress={handleResend}>
                  <Text style={styles.resendActiveText}>{t.resendOtp}</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.resendWaitText}>
                  {languageCode === 'en' ? 'Resend in: ' : 'दोबारा भेजें: '}
                  <Text style={{ fontWeight: '800' }}>{resendTimer}s</Text>
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleVerifyOtp}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-done" size={20} color="#D5AD66" />
              <Text style={styles.actionButtonText}>{t.verifyAndLogin}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom Signup Switch */}
        <View style={styles.signupPrompt}>
          <Text style={styles.promptText}>{t.noAccount} </Text>
          <TouchableOpacity onPress={onNavigateToSignup}>
            <Text style={styles.signupLinkText}>{t.signupAction}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF9F5',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(198, 154, 67, 0.2)',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  backText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#102B4E',
  },
  navTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#102B4E',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  logoHeader: {
    alignItems: 'center',
    marginVertical: 16,
  },
  crestCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#102B4E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#C69A43',
    marginBottom: 10,
  },
  screenHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#102B4E',
    fontFamily: 'serif',
  },
  screenSubtitle: {
    fontSize: 12,
    color: '#65758B',
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 280,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#FFCDD2',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
    width: '100%',
  },
  errorText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#BA1A1A',
    flex: 1,
  },
  formCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(198, 154, 67, 0.3)',
    padding: 18,
    shadowColor: '#102B4E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#102B4E',
    marginBottom: 8,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(198, 154, 67, 0.4)',
    borderRadius: 14,
    backgroundColor: '#FCF9F5',
    overflow: 'hidden',
    marginBottom: 16,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: 'rgba(198, 154, 67, 0.3)',
    backgroundColor: '#F8F5F1',
  },
  flagText: {
    fontSize: 14,
  },
  codeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#102B4E',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '700',
    color: '#102B4E',
    letterSpacing: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#102B4E',
    paddingVertical: 14,
    borderRadius: 16,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  otpBox: {
    width: 44,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(198, 154, 67, 0.4)',
    backgroundColor: '#FCF9F5',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    color: '#102B4E',
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  changePhoneText: {
    fontSize: 11,
    color: '#65758B',
    textDecorationLine: 'underline',
  },
  resendActiveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C69A43',
  },
  resendWaitText: {
    fontSize: 11,
    color: '#65758B',
  },
  signupPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  promptText: {
    fontSize: 12,
    color: '#65758B',
  },
  signupLinkText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#C69A43',
    textDecorationLine: 'underline',
  },
});
