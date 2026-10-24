import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

export interface MobileLanguageOption {
  code: string;
  name: string;
  nativeName: string;
  greeting: string;
}

export const MOBILE_LANGUAGES: MobileLanguageOption[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', greeting: 'नमस्ते' },
  { code: 'en', name: 'English', nativeName: 'English', greeting: 'Welcome' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', greeting: 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', greeting: 'नमस्कार' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', greeting: 'નમસ્તે' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', greeting: 'নমস্কার' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', greeting: 'வணக்கம்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', greeting: 'నమస్కారం' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', greeting: 'ನಮಸ್ಕಾರ' },
];

interface GrahakLanguageScreenProps {
  onBack: () => void;
  onSelectLanguage: (lang: MobileLanguageOption) => void;
  selectedCode?: string;
}

export const GrahakLanguageScreen: React.FC<GrahakLanguageScreenProps> = ({
  onBack,
  onSelectLanguage,
  selectedCode = 'hi',
}) => {
  const [selected, setSelected] = useState(selectedCode);

  const handleContinue = () => {
    const langObj = MOBILE_LANGUAGES.find((l) => l.code === selected) || MOBILE_LANGUAGES[0];
    onSelectLanguage(langObj);
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.primary} />
          <Text style={styles.backText}>पीछे (Back)</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>भाषा का चुनाव</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headingBox}>
          <Text style={styles.stepBadge}>चरण १: भाषा चुनें</Text>
          <Text style={styles.title}>अपनी पसंदीदा भाषा चुनें</Text>
          <Text style={styles.subtitle}>
            Choose your preferred language. You can change this later in Settings.
          </Text>
        </View>

        {/* 9 Language Grid Cards */}
        <View style={styles.grid}>
          {MOBILE_LANGUAGES.map((lang) => {
            const isSelected = selected === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.card,
                  isSelected && styles.cardSelected,
                ]}
                onPress={() => setSelected(lang.code)}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <Text style={[styles.nativeName, isSelected && styles.textWhite]}>
                    {lang.nativeName}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={18} color="#D5AD66" />
                  )}
                </View>
                <View style={styles.cardFooter}>
                  <Text style={[styles.englishName, isSelected && styles.textMutedGold]}>
                    {lang.name}
                  </Text>
                  <Text style={[styles.greeting, isSelected && styles.textWhiteMuted]}>
                    "{lang.greeting}"
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Continue Action */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.continueText}>आगे बढ़ें (Continue)</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
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
    paddingBottom: 28,
  },
  headingBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  stepBadge: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#102B4E',
    backgroundColor: 'rgba(198, 154, 67, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 8,
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
  grid: {
    gap: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(198, 154, 67, 0.25)',
    padding: 14,
  },
  cardSelected: {
    backgroundColor: '#102B4E',
    borderColor: '#C69A43',
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nativeName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#102B4E',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  englishName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#65758B',
  },
  greeting: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#94A3B8',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textMutedGold: {
    color: '#D5AD66',
  },
  textWhiteMuted: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(198, 154, 67, 0.2)',
    backgroundColor: '#FFFFFF',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#102B4E',
    paddingVertical: 14,
    borderRadius: 16,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
