import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { getGrahakTranslation } from '../constants/translations';

interface GrahakSignUpScreenProps {
  onBack: () => void;
  onSuccess: (profile: {
    fullName: string;
    mobile: string;
    shopName: string;
    businessType: string;
    language?: string;
  }) => void;
  onNavigateToLogin: () => void;
  languageCode?: string;
}

export const GrahakSignUpScreen: React.FC<GrahakSignUpScreenProps> = ({
  onBack,
  onSuccess,
  onNavigateToLogin,
  languageCode = 'hi',
}) => {
  const t = getGrahakTranslation(languageCode);

  const bizTypes = [
    t.catKirana,
    t.catWholesaler,
    t.catClothing,
    t.catElectronics,
    t.catHardware,
    t.catOther,
  ];

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [shopName, setShopName] = useState('');
  const [businessType, setBusinessType] = useState(bizTypes[0]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = () => {
    setErrorMsg(null);
    if (!fullName.trim()) {
      setErrorMsg(
        languageCode === 'en'
          ? 'Please enter your full name.'
          : 'कृपया अपना पूरा नाम दर्ज करें।'
      );
      return;
    }
    const cleaned = mobile.replace(/\D/g, '');
    if (cleaned.length !== 10 || !/^[6-9]\d{9}$/.test(cleaned)) {
      setErrorMsg(
        languageCode === 'en'
          ? 'Please enter a valid 10-digit Indian mobile number.'
          : 'कृपया १० अंकों का सही भारतीय मोबाइल नंबर दर्ज करें।'
      );
      return;
    }
    if (!shopName.trim()) {
      setErrorMsg(
        languageCode === 'en'
          ? 'Please enter your shop or business name.'
          : 'कृपया अपनी दुकान का नाम दर्ज करें।'
      );
      return;
    }

    onSuccess({
      fullName: fullName.trim(),
      mobile: `+91 ${cleaned}`,
      shopName: shopName.trim(),
      businessType: businessType || bizTypes[0],
      language: languageCode,
    });
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.primary} />
          <Text style={styles.backText}>{t.backBtn}</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>{t.signupHeading}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {languageCode === 'en' ? 'New Digital Account' : 'नया डिजिटल खाता'}
            </Text>
          </View>
          <Text style={styles.title}>{t.signupHeading}</Text>
          <Text style={styles.subtitle}>{t.signupSub}</Text>
        </View>

        {errorMsg && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={16} color="#BA1A1A" />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Full Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{t.fullNameLabel} *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color="#C69A43" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t.fullNamePlaceholder}
                placeholderTextColor="#94A3B8"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          </View>

          {/* Mobile Number with +91 */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{t.mobileLabel} *</Text>
            <View style={styles.phoneInputRow}>
              <View style={styles.codeBox}>
                <Text style={styles.flag}>🇮🇳</Text>
                <Text style={styles.code}>+91</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                keyboardType="phone-pad"
                maxLength={10}
                placeholder={t.mobilePlaceholder}
                placeholderTextColor="#94A3B8"
                value={mobile}
                onChangeText={(t) => setMobile(t.replace(/\D/g, ''))}
              />
            </View>
          </View>

          {/* Shop Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{t.shopNameLabel} *</Text>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="store-outline" size={18} color="#C69A43" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t.shopNamePlaceholder}
                placeholderTextColor="#94A3B8"
                value={shopName}
                onChangeText={setShopName}
              />
            </View>
          </View>

          {/* Business Type Selector Pills */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{t.businessTypeLabel}</Text>
            <View style={styles.pillsRow}>
              {bizTypes.map((type) => {
                const isSelected = businessType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.pill, isSelected && styles.pillSelected]}
                    onPress={() => setBusinessType(type)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <Text style={styles.submitBtnText}>{t.createAccountBtn}</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Switch to Login */}
        <View style={styles.loginRow}>
          <Text style={styles.loginPrompt}>{t.alreadyHaveAccount} </Text>
          <TouchableOpacity onPress={onNavigateToLogin}>
            <Text style={styles.loginLink}>{t.loginAction}</Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: 'rgba(198, 154, 67, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#102B4E',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#102B4E',
    fontFamily: 'serif',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#65758B',
    textAlign: 'center',
    marginTop: 4,
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
    padding: 16,
    shadowColor: '#102B4E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#102B4E',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCF9F5',
    borderWidth: 1.5,
    borderColor: 'rgba(198, 154, 67, 0.4)',
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13.5,
    fontWeight: '600',
    color: '#102B4E',
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(198, 154, 67, 0.4)',
    borderRadius: 12,
    backgroundColor: '#FCF9F5',
    overflow: 'hidden',
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: 'rgba(198, 154, 67, 0.3)',
    backgroundColor: '#F8F5F1',
  },
  flag: {
    fontSize: 14,
  },
  code: {
    fontSize: 13,
    fontWeight: '800',
    color: '#102B4E',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '700',
    color: '#102B4E',
    letterSpacing: 1,
  },
  pillsRow: {
    gap: 6,
  },
  pill: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#F8F5F1',
    borderWidth: 1,
    borderColor: 'rgba(198, 154, 67, 0.3)',
  },
  pillSelected: {
    backgroundColor: '#102B4E',
    borderColor: '#C69A43',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#102B4E',
  },
  pillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#102B4E',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  loginPrompt: {
    fontSize: 12,
    color: '#65758B',
  },
  loginLink: {
    fontSize: 12,
    fontWeight: '800',
    color: '#C69A43',
    textDecorationLine: 'underline',
  },
});
