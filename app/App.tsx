import React, { useState, useEffect } from 'react';
import { View, StyleSheet, BackHandler, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { theme } from './src/constants/theme';
import { BottomNavBar, TabKey } from './src/components/BottomNavBar';

import { HomeScreen } from './src/screens/HomeScreen';
import { SalesScreen } from './src/screens/SalesScreen';
import { PurchaseScreen } from './src/screens/PurchaseScreen';
import { InventoryScreen } from './src/screens/InventoryScreen';
import { AccountsScreen } from './src/screens/AccountsScreen';
import { CreateBillScreen } from './src/screens/CreateBillScreen';
import { AttendanceScreen } from './src/screens/AttendanceScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabKey>('home');
  const [overlayScreen, setOverlayScreen] = useState<'create_bill' | 'attendance' | null>(null);

  // Hardware back button handler for Android
  useEffect(() => {
    const onBackPress = () => {
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
  }, [overlayScreen, currentTab]);

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
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.container}>
          <View style={styles.screenWrapper}>{renderContent()}</View>
          {/* Hide bottom bar when in full-screen overlay mode (POS / Attendance) */}
          {!overlayScreen && (
            <BottomNavBar
              currentTab={currentTab}
              onSelectTab={handleSelectTab}
            />
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
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
