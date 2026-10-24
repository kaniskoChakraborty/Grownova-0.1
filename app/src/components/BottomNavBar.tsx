import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { useApp } from '../context/AppContext';

export type TabKey = 'ghrahak' | 'home' | 'sales' | 'purchase' | 'stock' | 'accounts';

interface BottomNavBarProps {
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentTab, onSelectTab }) => {
  const { appMode, toggleAppMode } = useApp();

  const customerTabs: {
    key: TabKey;
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    action?: () => void;
  }[] = [
    { key: 'ghrahak', label: 'ग्राहक Home', icon: 'home' },
    { key: 'stock', label: 'दुकान Items', icon: 'local-mall' },
    { key: 'accounts', label: 'मेरा खाता', icon: 'account-balance-wallet' },
  ];

  const merchantTabs: {
    key: TabKey;
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
  }[] = [
    { key: 'home', label: 'Desk', icon: 'storefront' },
    { key: 'sales', label: 'Sales', icon: 'point-of-sale' },
    { key: 'purchase', label: 'Buy Stock', icon: 'shopping-bag' },
    { key: 'stock', label: 'Inventory', icon: 'inventory-2' },
    { key: 'accounts', label: 'खाता', icon: 'account-balance-wallet' },
  ];

  const activeTabsList = appMode === 'customer' ? customerTabs : merchantTabs;

  return (
    <View style={styles.navBar}>
      {activeTabsList.map((tab) => {
        const isActive = currentTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onSelectTab(tab.key)}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={tab.icon}
              size={24}
              color={isActive ? theme.colors.primary : theme.colors.textMuted}
            />
            <Text
              style={[
                styles.tabLabel,
                isActive && styles.activeTabLabel,
              ]}
            >
              {tab.label}
            </Text>
            {isActive && <View style={styles.activeDot} />}
          </TouchableOpacity>
        );
      })}

      {/* Switch Mode Tab */}
      <TouchableOpacity
        onPress={toggleAppMode}
        style={[styles.tabItem, styles.modeSwitchTab]}
        activeOpacity={0.7}
      >
        <MaterialIcons
          name={appMode === 'customer' ? 'storefront' : 'shopping-bag'}
          size={22}
          color={theme.colors.secondary}
        />
        <Text style={styles.modeSwitchLabel}>
          {appMode === 'customer' ? 'व्यापारी' : 'ग्राहक'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    height: Platform.OS === 'ios' ? 76 : 64,
    paddingBottom: Platform.OS === 'ios' ? 14 : 4,
    backgroundColor: theme.colors.surfaceWhite,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    shadowColor: '#102B4E',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingTop: 4,
  },
  modeSwitchTab: {
    backgroundColor: '#FFFDF9',
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.border,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  activeTabLabel: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.secondaryAccent,
    marginTop: 2,
  },
  modeSwitchLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.secondary,
    marginTop: 2,
  },
});
