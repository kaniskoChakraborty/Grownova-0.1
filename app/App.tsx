import React, { useState, useEffect } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { theme } from './src/constants/theme';
import { AppProvider, useApp } from './src/context/AppContext';
import { BottomNavBar, TabKey } from './src/components/BottomNavBar';

import { GhrahakHomeScreen } from './src/screens/GhrahakHomeScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { SalesScreen } from './src/screens/SalesScreen';
import { PurchaseScreen } from './src/screens/PurchaseScreen';
import { InventoryScreen } from './src/screens/InventoryScreen';
import { AccountsScreen } from './src/screens/AccountsScreen';
import { CreateBillScreen } from './src/screens/CreateBillScreen';
import { AttendanceScreen } from './src/screens/AttendanceScreen';

function MainNavigator() {
  const { appMode, setAppMode } = useApp();
  const [currentTab, setCurrentTab] = useState<TabKey>(appMode === 'customer' ? 'ghrahak' : 'home');
  const [overlayScreen, setOverlayScreen] = useState<'create_bill' | 'attendance' | null>(null);

  // Sync tab when switching between Customer (Ghrahak) and Merchant mode
  useEffect(() => {
    if (appMode === 'customer') {
      setCurrentTab('ghrahak');
    } else {
      setCurrentTab('home');
    }
  }, [appMode]);

  // Hardware back button handler for Android
  useEffect(() => {
    const onBackPress = () => {
      if (overlayScreen !== null) {
        setOverlayScreen(null);
        return true;
      }
      const homeTab = appMode === 'customer' ? 'ghrahak' : 'home';
      if (currentTab !== homeTab) {
        setCurrentTab(homeTab);
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [overlayScreen, currentTab, appMode]);

  const handleSelectTab = (tab: TabKey) => {
    setOverlayScreen(null);
    setCurrentTab(tab);
  };

  const renderContent = () => {
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

    switch (currentTab) {
      case 'ghrahak':
        return (
          <GhrahakHomeScreen
            onSwitchToMerchant={() => {
              setAppMode('merchant');
              setCurrentTab('home');
            }}
          />
        );
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
          <GhrahakHomeScreen
            onSwitchToMerchant={() => {
              setAppMode('merchant');
              setCurrentTab('home');
            }}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.screenWrapper}>{renderContent()}</View>
        {!overlayScreen && (
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
    backgroundColor: theme.colors.surfaceWhite,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  screenWrapper: {
    flex: 1,
  },
});
