import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

export type TabKey = 'home' | 'sales' | 'purchase' | 'stock' | 'accounts';

interface BottomNavBarProps {
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentTab, onSelectTab }) => {
  const tabs: {
    key: TabKey;
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
  }[] = [
    { key: 'home', label: 'Desk', icon: 'storefront' },
    { key: 'sales', label: 'Sales', icon: 'point-of-sale' },
    { key: 'purchase', label: 'Purchases', icon: 'shopping-bag' },
    { key: 'stock', label: 'Inventory', icon: 'inventory-2' },
    { key: 'accounts', label: 'Khata', icon: 'account-balance-wallet' },
  ];

  return (
    <View style={styles.navBar}>
      {tabs.map((tab) => {
        const isActive = currentTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onSelectTab(tab.key)}
            style={[styles.tabItem, isActive && styles.activeTabItem]}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrapper, isActive && styles.activeIconWrapper]}>
              <MaterialIcons
                name={tab.icon}
                size={22}
                color={isActive ? theme.colors.primary : theme.colors.textMuted}
              />
            </View>
            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.activePill} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    height: Platform.OS === 'ios' ? 78 : 66,
    paddingBottom: Platform.OS === 'ios' ? 14 : 6,
    paddingTop: 6,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#102B4E',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingVertical: 2,
  },
  activeTabItem: {
    transform: [{ translateY: -1 }],
  },
  iconWrapper: {
    width: 38,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  activeIconWrapper: {
    backgroundColor: 'rgba(198, 154, 67, 0.15)',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
    letterSpacing: 0.2,
  },
  activeTabLabel: {
    color: theme.colors.primary,
    fontWeight: '800',
  },
  activePill: {
    width: 14,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.secondary,
    marginTop: 3,
  },
});
