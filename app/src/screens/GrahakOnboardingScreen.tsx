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

interface GrahakOnboardingScreenProps {
  initialShopName?: string;
  initialOwnerName?: string;
  initialBusinessType?: string;
  languageCode?: string;
  onComplete: (data?: { shopName: string; ownerName: string; upiId: string }) => void;
}

export const GrahakOnboardingScreen: React.FC<GrahakOnboardingScreenProps> = ({
  initialShopName,
  initialOwnerName,
  initialBusinessType,
  languageCode = 'hi',
  onComplete,
}) => {
  const t = getGrahakTranslation(languageCode);

  const [step, setStep] = useState<number>(1);
  const [shopName, setShopName] = useState(initialShopName || t.defaultShopName);
  const [ownerName, setOwnerName] = useState(initialOwnerName || t.defaultOwnerName);
  const [upiId, setUpiId] = useState('shreeganesh@upi');
  const [geotagStatus, setGeotagStatus] = useState(
    languageCode === 'en'
      ? 'Location: 26.8467° N, 80.9462° E (Standard Perimeter)'
      : 'स्थान: 26.8467° N, 80.9462° E (मानक परिधि)'
  );

  const handleFinish = () => {
    onComplete({
      shopName: shopName.trim() || t.defaultShopName,
      ownerName: ownerName.trim() || t.defaultOwnerName,
      upiId: upiId.trim() || 'shreeganesh@upi',
    });
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.navBar}>
        <Text style={styles.navTitle}>
          {languageCode === 'en' ? 'Shop Onboarding (Setup)' : 'दुकान ऑनबोर्डिंग (Setup)'}
        </Text>
        <View style={styles.stepIndicators}>
          {[1, 2, 3, 4].map((s) => (
            <View
              key={s}
              style={[
                styles.stepDot,
                s === step && styles.stepDotActive,
                s < step && styles.stepDotDone,
              ]}
            >
              <Text
                style={[
                  styles.stepDotText,
                  (s === step || s < step) && styles.stepDotTextActive,
                ]}
              >
                {s < step ? '✓' : s}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* STEP 1: SHOP CONFIRMATION */}
        {step === 1 && (
          <View style={styles.card}>
            <View style={styles.cardIconBox}>
              <MaterialCommunityIcons name="store" size={32} color="#D5AD66" />
            </View>
            <Text style={styles.cardTitle}>{t.step1Title}</Text>
            <Text style={styles.cardSub}>{t.step1Sub}</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t.shopNameLabel}</Text>
              <TextInput
                style={styles.input}
                value={shopName}
                onChangeText={setShopName}
                placeholder={t.shopNamePlaceholder}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t.fullNameLabel}</Text>
              <TextInput
                style={styles.input}
                value={ownerName}
                onChangeText={setOwnerName}
                placeholder={t.fullNamePlaceholder}
              />
            </View>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setStep(2)}
              activeOpacity={0.85}
            >
              <Text style={styles.actionBtnText}>
                {languageCode === 'en' ? 'Next: Payment Settings' : `${t.nextBtn} (भुगतान सेटिंग्स)`}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2: PAYMENTS SETUP */}
        {step === 2 && (
          <View style={styles.card}>
            <View style={[styles.cardIconBox, { backgroundColor: '#15803D' }]}>
              <MaterialCommunityIcons name="qrcode-scan" size={30} color="#FFFFFF" />
            </View>
            <Text style={styles.cardTitle}>{t.step2Title}</Text>
            <Text style={styles.cardSub}>{t.step2Sub}</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t.upiIdLabel}</Text>
              <TextInput
                style={styles.input}
                value={upiId}
                onChangeText={setUpiId}
                placeholder="shreeganesh@upi"
                placeholderTextColor="#94A3B8"
              />
              <Text style={styles.helperText}>{t.upiNotice}</Text>
            </View>

            <View style={styles.infoBadge}>
              <Ionicons name="cloud-offline-outline" size={18} color="#15803D" />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoBadgeTitle}>{t.offlineSupportTitle}</Text>
                <Text style={styles.infoBadgeSub}>{t.offlineSupportDesc}</Text>
              </View>
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.prevBtn} onPress={() => setStep(1)}>
                <Text style={styles.prevBtnText}>{t.backBtn}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(3)}>
                <Text style={styles.actionBtnText}>
                  {languageCode === 'en' ? 'Next: Attendance Setup' : `${t.nextBtn} (हाजिरी नियम)`}
                </Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* STEP 3: GEOTAG & STAFF ATTENDANCE */}
        {step === 3 && (
          <View style={styles.card}>
            <View style={[styles.cardIconBox, { backgroundColor: '#C05A3E' }]}>
              <MaterialCommunityIcons name="map-marker-radius" size={30} color="#FFFFFF" />
            </View>
            <Text style={styles.cardTitle}>{t.step3Title}</Text>
            <Text style={styles.cardSub}>{t.step3Sub}</Text>

            <View style={styles.geoBox}>
              <View style={styles.geoHeader}>
                <Text style={styles.geoLabel}>{t.geotagLabel}</Text>
                <TouchableOpacity
                  style={styles.detectBtn}
                  onPress={() =>
                    setGeotagStatus(
                      languageCode === 'en'
                        ? '✅ Location Registered: 26.8467° N, 80.9462° E'
                        : '✅ स्थान दर्ज: 26.8467° N, 80.9462° E'
                    )
                  }
                >
                  <Text style={styles.detectBtnText}>
                    {languageCode === 'en' ? '📍 Set Location' : '📍 स्थान सेट करें'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.geoValue}>{geotagStatus}</Text>
            </View>

            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.toggleTitle}>
                  {languageCode === 'en' ? 'Check-in Photo Verification' : 'चेक-इन फोटो सत्यापन'}
                </Text>
                <Text style={styles.toggleSub}>
                  {languageCode === 'en'
                    ? 'Live selfie mandatory during attendance'
                    : 'हाजिरी के समय लाइव सेल्फी अनिवार्य'}
                </Text>
              </View>
              <Ionicons name="checkbox" size={24} color="#102B4E" />
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.prevBtn} onPress={() => setStep(2)}>
                <Text style={styles.prevBtnText}>{t.backBtn}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(4)}>
                <Text style={styles.actionBtnText}>
                  {languageCode === 'en' ? 'Review & Finish' : 'समीक्षा देखें'}
                </Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* STEP 4: SUCCESS / COMPLETE */}
        {step === 4 && (
          <View style={[styles.card, { alignItems: 'center' }]}>
            <View style={styles.successCircle}>
              <Ionicons name="checkmark-sharp" size={38} color="#15803D" />
            </View>
            <Text style={styles.congratsText}>{t.congratulations}</Text>
            <Text style={styles.completeTitle}>{t.step4Title}</Text>
            <Text style={styles.completeSub}>
              <Text style={{ fontWeight: '800', color: '#102B4E' }}>{shopName}</Text>{' '}
              {t.accountReadyDesc}
            </Text>

            <View style={styles.summaryList}>
              <View style={styles.summaryItem}>
                <Ionicons name="checkmark-circle" size={16} color="#15803D" />
                <Text style={styles.summaryText}>
                  {languageCode === 'en' ? 'UPI & Cash Ledger Active' : 'UPI & नकद खाता सक्रिय'}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Ionicons name="checkmark-circle" size={16} color="#15803D" />
                <Text style={styles.summaryText}>
                  {languageCode === 'en' ? 'Offline Billing Enabled' : 'ऑफलाइन बिलिंग तैयार'}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Ionicons name="checkmark-circle" size={16} color="#15803D" />
                <Text style={styles.summaryText}>
                  {languageCode === 'en'
                    ? 'Staff Geotag Attendance Ready'
                    : 'कर्मचारी जियोटैग हाजिरी सक्षम'}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Ionicons name="checkmark-circle" size={16} color="#15803D" />
                <Text style={styles.summaryText}>
                  {languageCode === 'en' ? 'Data 100% Encrypted & Safe' : 'डेटा १००% सुरक्षित'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.actionBtn, { width: '100%', marginTop: 14 }]}
              onPress={handleFinish}
              activeOpacity={0.85}
            >
              <Text style={styles.actionBtnText}>{t.continueToGrahak}</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
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
  navTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#102B4E',
  },
  stepIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(198, 154, 67, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: '#102B4E',
    borderColor: '#C69A43',
  },
  stepDotDone: {
    backgroundColor: '#15803D',
    borderColor: '#15803D',
  },
  stepDotText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#65758B',
  },
  stepDotTextActive: {
    color: '#FFFFFF',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  card: {
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
  cardIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#102B4E',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#102B4E',
    fontFamily: 'serif',
    textAlign: 'center',
  },
  cardSub: {
    fontSize: 12,
    color: '#65758B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#102B4E',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FCF9F5',
    borderWidth: 1.5,
    borderColor: 'rgba(198, 154, 67, 0.4)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '700',
    color: '#102B4E',
  },
  helperText: {
    fontSize: 10.5,
    color: '#65758B',
    marginTop: 4,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 12,
    marginBottom: 14,
  },
  infoBadgeTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#15803D',
  },
  infoBadgeSub: {
    fontSize: 10,
    color: '#55677D',
  },
  geoBox: {
    backgroundColor: '#FCF9F5',
    borderWidth: 1,
    borderColor: 'rgba(198, 154, 67, 0.4)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  geoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  geoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#102B4E',
  },
  detectBtn: {
    backgroundColor: 'rgba(198, 154, 67, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  detectBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#102B4E',
  },
  geoValue: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#15803D',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#F8F5F1',
    borderRadius: 12,
    marginBottom: 16,
  },
  toggleTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#102B4E',
  },
  toggleSub: {
    fontSize: 10,
    color: '#65758B',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  prevBtn: {
    width: '30%',
    backgroundColor: '#F8F5F1',
    borderWidth: 1,
    borderColor: 'rgba(198, 154, 67, 0.4)',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  prevBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#102B4E',
  },
  nextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#102B4E',
    borderRadius: 14,
    paddingVertical: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#102B4E',
    paddingVertical: 14,
    borderRadius: 16,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  successCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  congratsText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#C69A43',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  completeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#102B4E',
    fontFamily: 'serif',
    marginTop: 2,
  },
  completeSub: {
    fontSize: 12,
    color: '#65758B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
    maxWidth: 280,
  },
  summaryList: {
    width: '100%',
    backgroundColor: '#F8F5F1',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(198, 154, 67, 0.25)',
    padding: 12,
    gap: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#102B4E',
  },
});
