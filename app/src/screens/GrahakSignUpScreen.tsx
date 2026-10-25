import React, { useState } from 'react';
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
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
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

  const categories = [
    { id: 'kirana', label: t.catKirana, icon: '🌾' },
    { id: 'wholesaler', label: t.catWholesaler, icon: '📦' },
    { id: 'clothing', label: t.catClothing, icon: '👕' },
    { id: 'electronics', label: t.catElectronics, icon: '📱' },
    { id: 'hardware', label: t.catHardware, icon: '🛠️' },
    { id: 'other', label: t.catOther, icon: '🏪' },
  ];

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [shopName, setShopName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0].label);
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
      businessType: selectedCategory,
      language: languageCode,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
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
            {languageCode === 'en' ? 'Shubh Shuruwat • New Account' : 'शुभ शुरुआत • नया व्यापार खाता'}
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
        {/* Title Area */}
        <View style={styles.titleArea}>
          <Text style={styles.screenHeading}>{t.signupHeading}</Text>
          <Text style={styles.screenSubheading}>{t.signupSub}</Text>
        </View>

        {errorMsg && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={16} color={theme.colors.error} />
            <Text style={styles.errorBannerText}>{errorMsg}</Text>
          </View>
        )}

        {/* Registration Form Card */}
        <View style={styles.formCard}>
          {/* 1. Full Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              {languageCode === 'en' ? 'Owner Full Name' : 'मालिक का पूरा नाम'} *
            </Text>
            <View style={styles.inputBox}>
              <MaterialIcons name="person" size={20} color={theme.colors.secondary} />
              <TextInput
                style={styles.textInput}
                placeholder={t.fullNamePlaceholder}
                placeholderTextColor="#94A3B8"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          </View>

          {/* 2. Mobile Number */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              {languageCode === 'en' ? 'Mobile Number (10 digits)' : 'मोबाइल नंबर (१० अंक)'} *
            </Text>
            <View style={styles.inputBox}>
              <View style={styles.flagBlock}>
                <Text style={styles.flagEmoji}>🇮🇳</Text>
                <Text style={styles.countryCode}>+91</Text>
              </View>
              <View style={styles.inputDivider} />
              <TextInput
                style={styles.textInput}
                keyboardType="phone-pad"
                maxLength={10}
                placeholder="98230 45678"
                placeholderTextColor="#94A3B8"
                value={mobile}
                onChangeText={(val) => setMobile(val.replace(/\D/g, ''))}
              />
            </View>
          </View>

          {/* 3. Shop Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              {languageCode === 'en' ? 'Shop / Business Name' : 'दुकान / फर्म का नाम'} *
            </Text>
            <View style={styles.inputBox}>
              <MaterialIcons name="storefront" size={20} color={theme.colors.secondary} />
              <TextInput
                style={styles.textInput}
                placeholder={t.shopNamePlaceholder}
                placeholderTextColor="#94A3B8"
                value={shopName}
                onChangeText={setShopName}
              />
            </View>
          </View>

          {/* 4. Business Category Chips */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              {languageCode === 'en' ? 'Business Category' : 'व्यापार का प्रकार'}
            </Text>
            <View style={styles.categoriesWrap}>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.label;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryChip,
                      isSelected && styles.categoryChipSelected,
                    ]}
                    onPress={() => setSelectedCategory(cat.label)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.categoryIcon}>{cat.icon}</Text>
                    <Text
                      style={[
                        styles.categoryText,
                        isSelected && styles.categoryTextSelected,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>
              {languageCode === 'en'
                ? 'Continue to Onboarding • आगे बढ़ें'
                : 'ओटीपी प्राप्त करें & खाता खोलें'}
            </Text>
            <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Existing User Login Link */}
        <View style={styles.loginLinkRow}>
          <Text style={styles.loginPrompt}>
            {languageCode === 'en'
              ? 'Already have an account? '
              : 'पहले से खाता है? '}
          </Text>
          <TouchableOpacity onPress={onNavigateToLogin} activeOpacity={0.7}>
            <Text style={styles.loginLink}>
              {languageCode === 'en' ? 'Login (लॉगिन करें)' : 'लॉगिन करें'}
            </Text>
          </TouchableOpacity>
        </View>
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
  titleArea: {
    marginBottom: 14,
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
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(198, 154, 67, 0.3)',
    shadowColor: '#102B4E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#102B4E',
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F3EF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(16, 43, 78, 0.08)',
    gap: 8,
  },
  flagBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  flagEmoji: {
    fontSize: 16,
  },
  countryCode: {
    fontSize: 14,
    fontWeight: '700',
    color: '#102B4E',
  },
  inputDivider: {
    width: 1,
    height: 22,
    backgroundColor: '#D1D5DB',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#102B4E',
  },
  categoriesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#F6F3EF',
    borderWidth: 1,
    borderColor: 'rgba(198, 154, 67, 0.2)',
  },
  categoryChipSelected: {
    backgroundColor: '#FFFCF7',
    borderColor: '#C69A43',
    borderWidth: 1.5,
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#44474E',
  },
  categoryTextSelected: {
    color: '#102B4E',
    fontWeight: '800',
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
    marginTop: 6,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
  loginLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  loginPrompt: {
    fontSize: 13,
    color: '#65758B',
  },
  loginLink: {
    fontSize: 13,
    fontWeight: '800',
    color: '#102B4E',
    textDecorationLine: 'underline',
  },
});
