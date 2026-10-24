import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

interface GrahakEntryScreenProps {
  onStart: () => void;
  onLogin: () => void;
  onLanguageSelect: () => void;
  selectedLanguage?: string;
}

export const GrahakEntryScreen: React.FC<GrahakEntryScreenProps> = ({
  onStart,
  onLogin,
  onLanguageSelect,
  selectedLanguage = 'हिन्दी (Hindi)',
}) => {
  return (
    <View style={styles.container}>
      {/* Decorative Toran Garland */}
      <View style={styles.toranContainer}>
        <View style={styles.toranLine} />
        <View style={styles.toranPattis}>
          {[1, 2, 3, 4, 5, 6, 7].map((item) => (
            <View key={item} style={styles.toranLeaf}>
              <View style={styles.gendaFlower} />
              <View style={styles.mangoLeaf} />
            </View>
          ))}
        </View>
      </View>

      {/* Top Header with Language Pill */}
      <View style={styles.topHeader}>
        <View style={styles.logoRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>卐</Text>
          </View>
          <View>
            <View style={styles.brandTitleRow}>
              <Text style={styles.brandName}>Grahak</Text>
              <Text style={styles.brandHindi}>ग्राहक</Text>
            </View>
            <Text style={styles.brandTagline}>Aapke Dukaan Ka Digital Saathi</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.langPill}
          onPress={onLanguageSelect}
          activeOpacity={0.8}
        >
          <Ionicons name="globe-outline" size={14} color={theme.colors.secondaryAccent} />
          <Text style={styles.langPillText}>{selectedLanguage}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Desi Art Auspicious Badge */}
        <View style={styles.auspiciousBadge}>
          <MaterialCommunityIcons name="brightness-percent" size={14} color={theme.colors.secondaryAccent} />
          <Text style={styles.auspiciousText}>१००% सुरक्षित • भारतीय दुकानदारों का भरोसेमंद ऐप</Text>
        </View>

        {/* Hero Headline */}
        <Text style={styles.heroHeadline}>
          Aapke dukaan ka apna{'\n'}digital saathi.
        </Text>
        
        <Text style={styles.heroSubhead}>
          Hisab, bikri, stock aur bills — sab ek hi jagah.
        </Text>

        {/* Contemporary Desi Art Shopkeeper Illustration Card */}
        <View style={styles.illustrationCard}>
          <View style={styles.archFrame}>
            <View style={styles.diyaContainer}>
              <MaterialCommunityIcons name="fire" size={24} color="#D5AD66" />
            </View>

            <View style={styles.charactersRow}>
              {/* Shopkeeper */}
              <View style={styles.characterBox}>
                <View style={[styles.avatarCircle, { backgroundColor: '#102B4E' }]}>
                  <MaterialCommunityIcons name="store" size={32} color="#D5AD66" />
                </View>
                <Text style={styles.charLabel}>दुकानदार भाई</Text>
                <Text style={styles.charSub}>खाता & बिक्री</Text>
              </View>

              <View style={styles.dividerArrow}>
                <Ionicons name="repeat" size={24} color={theme.colors.secondaryAccent} />
                <Text style={styles.arrowText}>UPI / पर्ची</Text>
              </View>

              {/* Customer */}
              <View style={styles.characterBox}>
                <View style={[styles.avatarCircle, { backgroundColor: '#C69A43' }]}>
                  <MaterialCommunityIcons name="cellphone-check" size={30} color="#102B4E" />
                </View>
                <Text style={styles.charLabel}>संतुष्ट ग्राहक</Text>
                <Text style={styles.charSub}>तुरंत भुगतान</Text>
              </View>
            </View>

            {/* Counter Balance Scale Graphic */}
            <View style={styles.counterDesk}>
              <View style={styles.tarazuRow}>
                <MaterialCommunityIcons name="scale-balance" size={18} color="#D5AD66" />
                <Text style={styles.tarazuText}>पक्का हिसाब • सुरक्षित उधारी डायरी</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Feature Highlights Grid */}
        <View style={styles.featuresGrid}>
          <View style={styles.featurePill}>
            <Ionicons name="receipt-outline" size={16} color={theme.colors.primary} />
            <Text style={styles.featureTitle}>ऑफलाइन बिल</Text>
          </View>
          <View style={styles.featurePill}>
            <Ionicons name="camera-outline" size={16} color={theme.colors.primary} />
            <Text style={styles.featureTitle}>AI फोटो स्टॉक</Text>
          </View>
          <View style={styles.featurePill}>
            <Ionicons name="location-outline" size={16} color={theme.colors.primary} />
            <Text style={styles.featureTitle}>जियोटैग हाजिरी</Text>
          </View>
          <View style={styles.featurePill}>
            <Ionicons name="shield-checkmark-outline" size={16} color={theme.colors.primary} />
            <Text style={styles.featureTitle}>RBI बैंक सिंक</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Buttons */}
      <View style={styles.bottomBar}>
        {/* Prominent CTA: "Shuru Kijiye" */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={onStart}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>Shuru Kijiye (शुरू कीजिये)</Text>
          <View style={styles.ctaArrowCircle}>
            <Ionicons name="arrow-forward" size={18} color="#102B4E" />
          </View>
        </TouchableOpacity>

        {/* Secondary Login option for returning users */}
        <TouchableOpacity
          style={styles.loginLink}
          onPress={onLogin}
          activeOpacity={0.7}
        >
          <Text style={styles.loginText}>
            Pehle se account hai? <Text style={styles.loginHighlight}>Login kijiye</Text>
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
  toranContainer: {
    height: 18,
    position: 'relative',
    overflow: 'hidden',
  },
  toranLine: {
    height: 2,
    backgroundColor: '#C69A43',
    marginHorizontal: -10,
    marginTop: 2,
  },
  toranPattis: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  toranLeaf: {
    alignItems: 'center',
  },
  gendaFlower: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E65100',
    marginTop: -1,
  },
  mangoLeaf: {
    width: 8,
    height: 10,
    backgroundColor: '#2E7D32',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(198, 154, 67, 0.2)',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#102B4E',
    borderWidth: 1,
    borderColor: '#C69A43',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 16,
    color: '#D5AD66',
    fontWeight: 'bold',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#102B4E',
    fontFamily: 'serif',
  },
  brandHindi: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C69A43',
  },
  brandTagline: {
    fontSize: 9.5,
    color: '#65758B',
    fontWeight: '500',
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(198, 154, 67, 0.35)',
  },
  langPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#102B4E',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },
  auspiciousBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(198, 154, 67, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(198, 154, 67, 0.3)',
    marginBottom: 12,
  },
  auspiciousText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#102B4E',
  },
  heroHeadline: {
    fontSize: 26,
    fontWeight: '800',
    color: '#102B4E',
    fontFamily: 'serif',
    textAlign: 'center',
    lineHeight: 32,
  },
  heroSubhead: {
    fontSize: 13,
    fontWeight: '500',
    color: '#55677D',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  illustrationCard: {
    width: '100%',
    marginVertical: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(198, 154, 67, 0.35)',
    padding: 16,
    shadowColor: '#102B4E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  archFrame: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(198, 154, 67, 0.4)',
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
  },
  diyaContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#102B4E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  charactersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 10,
  },
  characterBox: {
    alignItems: 'center',
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#C69A43',
    marginBottom: 6,
  },
  charLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#102B4E',
  },
  charSub: {
    fontSize: 10,
    color: '#65758B',
  },
  dividerArrow: {
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#C69A43',
    marginTop: 2,
  },
  counterDesk: {
    width: '100%',
    backgroundColor: '#F8F5F1',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(198, 154, 67, 0.3)',
    paddingVertical: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  tarazuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tarazuText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#102B4E',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    width: '100%',
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(198, 154, 67, 0.25)',
    width: '48%',
  },
  featureTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#102B4E',
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
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
    paddingVertical: 15,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(198, 154, 67, 0.5)',
    shadowColor: '#102B4E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  ctaArrowCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#C69A43',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginLink: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 4,
  },
  loginText: {
    fontSize: 12,
    color: '#55677D',
    fontWeight: '600',
  },
  loginHighlight: {
    color: '#C69A43',
    fontWeight: '800',
  },
});
