import React, { useState, useEffect } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { theme } from './src/constants/theme';
import { AppProvider } from './src/context/AppContext';
import { BottomNavBar, TabKey } from './src/components/BottomNavBar';

import { HomeScreen } from './src/screens/HomeScreen';
import { SalesScreen } from './src/screens/SalesScreen';
import { PurchaseScreen } from './src/screens/PurchaseScreen';
import { InventoryScreen } from './src/screens/InventoryScreen';
import { AccountsScreen } from './src/screens/AccountsScreen';
import { CreateBillScreen } from './src/screens/CreateBillScreen';
import { AttendanceScreen } from './src/screens/AttendanceScreen';

// Grahak Contemporary Desi Art Flow Screens
import { GrahakEntryScreen } from './src/screens/GrahakEntryScreen';
import { GrahakLanguageScreen } from './src/screens/GrahakLanguageScreen';
import { GrahakLoginScreen } from './src/screens/GrahakLoginScreen';
import { GrahakSignUpScreen } from './src/screens/GrahakSignUpScreen';
import { GrahakOnboardingScreen } from './src/screens/GrahakOnboardingScreen';

type AuthFlowStep = 'entry' | 'language' | 'login' | 'signup' | 'onboarding' | null;

function MainNavigator() {
  const [currentTab, setCurrentTab] = useState<TabKey>('home');
  const [overlayScreen, setOverlayScreen] = useState<'create_bill' | 'attendance' | null>(null);

  // Grahak Entry Flow State (Defaults to 'entry' for first-time / unauthenticated visitors)
  const [authStep, setAuthStep] = useState<AuthFlowStep>('entry');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('हिन्दी (Hindi)');
  const [registeredProfile, setRegisteredProfile] = useState<{
    fullName: string;
    mobile: string;
    shopName: string;
    businessType: string;
  } | null>(null);

  // Hardware back button handler for Android
  useEffect(() => {
    const onBackPress = () => {
      if (authStep !== null) {
        if (authStep === 'language' || authStep === 'login') {
          setAuthStep('entry');
          return true;
        }
        if (authStep === 'signup') {
          setAuthStep('language');
          return true;
        }
        if (authStep === 'onboarding') {
          setAuthStep('signup');
          return true;
        }
        return false;
      }

      if (overlayScreen !== null) {
        setOverlayScreen(null);
        return true;
      }
      if (currentTab !== 'home') {
        setCurrentTab('home');
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [authStep, overlayScreen, currentTab]);

  const handleSelectTab = (tab: TabKey) => {
    setOverlayScreen(null);
    setCurrentTab(tab);
  };

  const renderContent = () => {
    // 1. Grahak Unauthenticated Entry & Onboarding Flow
    if (authStep === 'entry') {
      return (
        <GrahakEntryScreen
          onStart={() => setAuthStep('language')}
          onLogin={() => setAuthStep('login')}
          onLanguageSelect={() => setAuthStep('language')}
          selectedLanguage={selectedLanguage}
        />
      );
    }

    if (authStep === 'language') {
      return (
        <GrahakLanguageScreen
          onBack={() => setAuthStep('entry')}
          onSelectLanguage={(l) => {
            setSelectedLanguage(`${l.nativeName} (${l.name})`);
            setAuthStep('signup');
          }}
          selectedCode="hi"
        />
      );
    }

    if (authStep === 'signup') {
      return (
        <GrahakSignUpScreen
          onBack={() => setAuthStep('language')}
          onNavigateToLogin={() => setAuthStep('login')}
          onSuccess={(prof) => {
            setRegisteredProfile(prof);
            setAuthStep('onboarding');
          }}
        />
      );
    }

    if (authStep === 'login') {
      return (
        <GrahakLoginScreen
          onBack={() => setAuthStep('entry')}
          onNavigateToSignup={() => setAuthStep('signup')}
          onSuccess={(_mob) => {
            setAuthStep(null);
          }}
        />
      );
    }

    if (authStep === 'onboarding') {
      return (
        <GrahakOnboardingScreen
          initialShopName={registeredProfile?.shopName}
          initialOwnerName={registeredProfile?.fullName}
          initialBusinessType={registeredProfile?.businessType}
          onComplete={() => setAuthStep(null)}
        />
      );
    }

    // 2. Existing Authenticated App Overlays (Create Bill, Attendance)
    if (overlayScreen === 'create_bill') {
      return (
        <CreateBillScreen
          onBack={() => setOverlayScreen(null)}
          onSuccess={() => setOverlayScreen(null)}
        />
      );
    }

    if (overlayScreen === 'attendance') {
      return (
        <AttendanceScreen
          onBack={() => setOverlayScreen(null)}
        />
      );
    }

    // 3. Existing Main Tab Screens
    switch (currentTab) {
      case 'home':
        return (
          <HomeScreen
            onNavigateToBill={() => setOverlayScreen('create_bill')}
            onNavigateToSales={() => setCurrentTab('sales')}
            onNavigateToPurchase={() => setCurrentTab('purchase')}
            onNavigateToStock={() => setCurrentTab('stock')}
            onNavigateToAttendance={() => setOverlayScreen('attendance')}
          />
        );
      case 'sales':
        return (
          <SalesScreen
            onNavigateToBill={() => setOverlayScreen('create_bill')}
          />
        );
      case 'purchase':
        return <PurchaseScreen />;
      case 'stock':
        return <InventoryScreen />;
      case 'accounts':
        return <AccountsScreen />;
      default:
        return (
          <HomeScreen
            onNavigateToBill={() => setOverlayScreen('create_bill')}
            onNavigateToSales={() => setCurrentTab('sales')}
            onNavigateToPurchase={() => setCurrentTab('purchase')}
            onNavigateToStock={() => setCurrentTab('stock')}
            onNavigateToAttendance={() => setOverlayScreen('attendance')}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.screenWrapper}>{renderContent()}</View>
        {!overlayScreen && authStep === null && (
          <BottomNavBar
            currentTab={currentTab}
            onSelectTab={handleSelectTab}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AppProvider>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <MainNavigator />
      </SafeAreaProvider>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  screenWrapper: {
    flex: 1,
  },
});
