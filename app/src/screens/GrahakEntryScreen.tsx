import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { getGrahakTranslation } from '../constants/translations';

interface GrahakEntryScreenProps {
  onStart: () => void;
  onLogin: () => void;
  onLanguageSelect: () => void;
  selectedLanguage?: string;
  languageCode?: string;
}

export const GrahakEntryScreen: React.FC<GrahakEntryScreenProps> = ({
  onStart,
  onLogin,
  onLanguageSelect,
  selectedLanguage = 'हिन्दी (Hindi)',
  languageCode = 'hi',
}) => {
  const t = getGrahakTranslation(languageCode);

  return (
    <View style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.topHeader}>
        <View style={styles.brandRow}>
          <View style={styles.emblemBadge}>
            <Text style={styles.emblemText}>ग</Text>
          </View>
          <View>
            <View style={styles.brandNameRow}>
              <Text style={styles.brandTitleHindi}>ग्राहक</Text>
              <Text style={styles.brandTitleEnglish}>GRAHAK</Text>
            </View>
            <Text style={styles.brandTagline}>
              {languageCode === 'en' ? 'Digital Vyapar Saathi' : 'दुकान का डिजिटल साथी'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.langButton}
          onPress={onLanguageSelect}
          activeOpacity={0.8}
        >
          <MaterialIcons name="translate" size={16} color={theme.colors.secondary} />
          <Text style={styles.langButtonText}>
            {selectedLanguage.split(' ')[0] || 'हिंदी / Eng'}
          </Text>
        </TouchableOpacity>
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
            {languageCode === 'en' ? 'Shubh Labh • Trusted OS' : 'शुभ लाभ • १००% सुरक्षित'}
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
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Contemporary Desi Folk-Art Arch Card */}
        <View style={styles.heroCard}>
          {/* Central Auspicious Emblem */}
          <View style={styles.heroEmblemContainer}>
            <View style={styles.heroEmblemNavySquare}>
              <Text style={styles.heroEmblemChar}>ग़</Text>
            </View>
            <View style={styles.storefrontBadgeCircle}>
              <MaterialIcons name="storefront" size={14} color="#FFF" />
            </View>
          </View>

          {/* Title and Tagline */}
          <View style={styles.heroTitleRow}>
            <Text style={styles.heroTitleHindi}>ग्राहक</Text>
            <Text style={styles.heroTitleDivider}>|</Text>
            <Text style={styles.heroTitleEnglish}>Grahak</Text>
          </View>

          <Text style={styles.heroSubtitleHindi}>
            {t.headline}
          </Text>
          <Text style={styles.heroSubtitleEnglish}>
            {t.subheadline}
          </Text>

          {/* Google Stitch Hand-Painted Counter Visual Canvas */}
          <View style={styles.canvasContainer}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLbkzIlB0y0V9GJlVC3cUJjFLJIDGsViVA1fHE4wPb5TamdJZzaTQF1qzttnjOfEnNQgXd0jbzoeSpIeP5lRSb9gSbwYOxVIPyM05md9dUDC31s3Zz3o3xm64Jesx3KO1bFO11asOH9BaXRgw9zFzwCMnsvxJDPkgLBav1FtMc5rtqmbKJk7aWpKwJ8oo0kHkew6FZq8O7x9G5F80urSiK5eV4rpN5mZM7bkljdmk_evaB3Wi0MMEN',
              }}
              style={styles.canvasImage}
              resizeMode="cover"
            />
            {/* Bottom Stamp Overlay */}
            <View style={styles.canvasStampOverlay}>
              <View style={styles.stampLeft}>
                <View style={styles.greenLiveDot} />
                <Text style={styles.stampLeftText}>
                  {languageCode === 'en' ? 'Smart Vyapar Live' : 'दुकानदारी हुई अब आसान'}
                </Text>
              </View>
              <Text style={styles.stampRightText}>
                {languageCode === 'en' ? 'Khata 2.0' : 'बही-खाता 2.0'}
              </Text>
            </View>
          </View>
        </View>

        {/* 3 Value Pillars Proposition Grid */}
        <View style={styles.pillarsCard}>
          <View style={styles.pillarsHeader}>
            <Text style={styles.pillarsSub}>
              {languageCode === 'en' ? 'ONE ALL-IN-ONE SOLUTION' : 'एक समाधान • सम्पूर्ण व्यापार'}
            </Text>
            <Text style={styles.pillarsTitle}>
              {languageCode === 'en'
                ? 'Accounts, Sales, Stock & Bills in One Place'
                : 'हिसाब, बिक्री, स्टॉक और बिल — सब एक ही जगह'}
            </Text>
          </View>

          <View style={styles.pillarsGrid}>
            {/* Pillar 1 */}
            <View style={styles.pillarItem}>
              <View style={[styles.pillarIconCircle, { backgroundColor: '#FFDEA6' }]}>
                <MaterialIcons name="bolt" size={20} color={theme.colors.secondary} />
              </View>
              <Text style={styles.pillarTitle}>1-Min Bill</Text>
              <Text style={styles.pillarSub}>
                {languageCode === 'en' ? 'Quick POS Bill' : 'पक्का बिल & पर्ची'}
              </Text>
            </View>

            {/* Pillar 2 */}
            <View style={styles.pillarItem}>
              <View style={[styles.pillarIconCircle, { backgroundColor: '#FFDAD6' }]}>
                <MaterialIcons name="pending-actions" size={20} color={theme.colors.error} />
              </View>
              <Text style={styles.pillarTitle}>Udhaar</Text>
              <Text style={styles.pillarSub}>
                {languageCode === 'en' ? 'Ledger Safety' : 'सुरक्षित उधारी'}
              </Text>
            </View>

            {/* Pillar 3 */}
            <View style={styles.pillarItem}>
              <View style={[styles.pillarIconCircle, { backgroundColor: '#D5E3FF' }]}>
                <MaterialIcons name="payments" size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.pillarTitle}>Daily Hisab</Text>
              <Text style={styles.pillarSub}>
                {languageCode === 'en' ? 'Cash & UPI' : 'मुनाफा & गल्ला'}
              </Text>
            </View>
          </View>
        </View>

        {/* Feature Pills Horizontal Highlights */}
        <View style={styles.featuresRow}>
          <View style={styles.featureChip}>
            <Ionicons name="camera-outline" size={15} color={theme.colors.secondary} />
            <Text style={styles.featureChipText}>{t.inventoryScanner}</Text>
          </View>
          <View style={styles.featureChip}>
            <Ionicons name="location-outline" size={15} color={theme.colors.secondary} />
            <Text style={styles.featureChipText}>{t.geotagAttendance}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Buttons */}
      <View style={styles.bottomBar}>
        {/* Primary CTA: Start New Account */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={onStart}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>
            {languageCode === 'en' ? 'Get Started • Open Khata' : 'नया खाता शुरू करें (Get Started)'}
          </Text>
          <View style={styles.ctaArrowCircle}>
            <MaterialIcons name="arrow-forward" size={18} color="#102B4E" />
          </View>
        </TouchableOpacity>

        {/* Secondary CTA: Existing Merchant Login */}
        <TouchableOpacity
          style={styles.loginLink}
          onPress={onLogin}
          activeOpacity={0.7}
        >
          <Text style={styles.loginLinkText}>
            {languageCode === 'en'
              ? 'Already registered? '
              : 'पहले से खाता है? '}
            <Text style={styles.loginLinkHighlight}>
              {languageCode === 'en' ? 'Sign In / लॉगिन करें' : 'लॉगिन करें'}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  emblemBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#102B4E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C69A43',
  },
  emblemText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFDEA6',
    lineHeight: 24,
  },
  brandNameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  brandTitleHindi: {
    fontSize: 17,
    fontWeight: '800',
    color: '#102B4E',
  },
  brandTitleEnglish: {
    fontSize: 11,
    fontWeight: '800',
    color: '#C69A43',
    letterSpacing: 1.5,
  },
  brandTagline: {
    fontSize: 10,
    color: '#65758B',
    fontWeight: '500',
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(198, 154, 67, 0.35)',
  },
  langButtonText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#102B4E',
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
    paddingTop: 8,
    paddingBottom: 20,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(198, 154, 67, 0.28)',
    shadowColor: '#102B4E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 14,
  },
  heroEmblemContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  heroEmblemNavySquare: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#102B4E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#C69A43',
    shadowColor: '#102B4E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  heroEmblemChar: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFDEA6',
  },
  storefrontBadgeCircle: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#C69A43',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  heroTitleHindi: {
    fontSize: 22,
    fontWeight: '800',
    color: '#102B4E',
  },
  heroTitleDivider: {
    fontSize: 18,
    fontWeight: '600',
    color: '#C69A43',
  },
  heroTitleEnglish: {
    fontSize: 16,
    fontWeight: '800',
    color: '#102B4E',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroSubtitleHindi: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7C5800',
    textAlign: 'center',
    marginBottom: 2,
  },
  heroSubtitleEnglish: {
    fontSize: 12,
    fontWeight: '500',
    color: '#65758B',
    textAlign: 'center',
    marginBottom: 12,
  },
  canvasContainer: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(198, 154, 67, 0.3)',
  },
  canvasImage: {
    width: '100%',
    height: '100%',
  },
  canvasStampOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  stampLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greenLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E7D32',
  },
  stampLeftText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#102B4E',
  },
  stampRightText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C5800',
  },
  pillarsCard: {
    backgroundColor: '#F6F3EF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(198, 154, 67, 0.2)',
    marginBottom: 12,
  },
  pillarsHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  pillarsSub: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C5800',
    letterSpacing: 0.8,
  },
  pillarsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#102B4E',
    marginTop: 2,
    textAlign: 'center',
  },
  pillarsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  pillarItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  pillarIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  pillarTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#102B4E',
  },
  pillarSub: {
    fontSize: 9.5,
    color: '#65758B',
    textAlign: 'center',
    marginTop: 2,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  featureChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(198, 154, 67, 0.25)',
  },
  featureChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#102B4E',
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(198, 154, 67, 0.2)',
    backgroundColor: '#FFFFFF',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#102B4E',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#C69A43',
    shadowColor: '#102B4E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  ctaArrowCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#C69A43',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginLink: {
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 4,
  },
  loginLinkText: {
    fontSize: 12.5,
    color: '#65758B',
    fontWeight: '500',
  },
  loginLinkHighlight: {
    color: '#102B4E',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
