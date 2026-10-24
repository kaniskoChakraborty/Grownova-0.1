import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { Header } from '../components/Header';

export const AccountsScreen: React.FC = () => {
  const [tab, setTab] = useState<'khata' | 'cashflow'>('khata');

  const customers = [
    { name: 'Amit Sharma', phone: '98230-84192', due: 3200, limit: 15000, status: 'active' },
    { name: 'Suresh Kirana', phone: '94220-19283', due: 6750, limit: 20000, status: 'overdue' },
    { name: 'Pooja Store', phone: '98901-44521', due: 4850, limit: 10000, status: 'active' },
    { name: 'Ramesh ji', phone: '97654-32109', due: 0, limit: 10000, status: 'cleared' },
  ];

  const sendReminder = (name: string) => {
    Alert.alert('WhatsApp Reminder Sent', `Payment reminder with UPI payment link sent to ${name}.`);
  };

  return (
    <View style={styles.container}>
      <Header title="Accounts & Cashflow" subtitle="Daily Khata & Ledger" />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Net Balances 2-column Banner */}
        <View style={styles.balanceGrid}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Cash In Hand (रोकड़)</Text>
            <Text style={styles.balanceAmount}>₹29,200</Text>
            <Text style={styles.balanceSub}>Cash + UPI today</Text>
          </View>
          <View style={[styles.balanceCard, styles.balanceCardDue]}>
            <Text style={[styles.balanceLabel, { color: theme.colors.error }]}>Udhaar (बाकी)</Text>
            <Text style={[styles.balanceAmount, { color: theme.colors.error }]}>₹14,800</Text>
            <Text style={styles.balanceSub}>6 customers due</Text>
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'khata' && styles.tabBtnActive]}
            onPress={() => setTab('khata')}
          >
            <Text style={[styles.tabText, tab === 'khata' && styles.tabTextActive]}>
              Customer Udhaar / Khata (खाता)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'cashflow' && styles.tabBtnActive]}
            onPress={() => setTab('cashflow')}
          >
            <Text style={[styles.tabText, tab === 'cashflow' && styles.tabTextActive]}>
              Cashflow Daily
            </Text>
          </TouchableOpacity>
        </View>

        {tab === 'khata' ? (
          <View style={styles.list}>
            {customers.map((c, idx) => (
              <View key={idx} style={styles.custCard}>
                <View style={styles.custTop}>
                  <View style={styles.custLeft}>
                    <Text style={styles.custName}>{c.name}</Text>
                    <Text style={styles.custPhone}>📱 {c.phone} · Limit ₹{c.limit.toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={styles.custRight}>
                    <Text
                      style={[
                        styles.custDue,
                        c.due > 0 ? { color: theme.colors.error } : { color: theme.colors.success },
                      ]}
                    >
                      {c.due > 0 ? `₹${c.due.toLocaleString('en-IN')}` : 'Cleared'}
                    </Text>
                    <Text style={styles.dueLabel}>{c.due > 0 ? 'Pending' : 'Zero Due'}</Text>
                  </View>
                </View>

                {c.due > 0 && (
                  <View style={styles.custActions}>
                    <TouchableOpacity
                      style={styles.remindBtn}
                      onPress={() => sendReminder(c.name)}
                    >
                      <MaterialIcons name="share" size={15} color={theme.colors.success} />
                      <Text style={styles.remindText}>WhatsApp Reminder</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.collectBtn}>
                      <Text style={styles.collectText}>Collect Cash</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.cashflowBox}>
            <View style={styles.cashflowRow}>
              <Text style={styles.cfLabel}>Opening Cash Balance</Text>
              <Text style={styles.cfVal}>₹8,500</Text>
            </View>
            <View style={styles.cashflowRow}>
              <Text style={[styles.cfLabel, { color: theme.colors.success }]}>+ Cash In (Sales)</Text>
              <Text style={[styles.cfVal, { color: theme.colors.success }]}>+₹22,400</Text>
            </View>
            <View style={styles.cashflowRow}>
              <Text style={[styles.cfLabel, { color: theme.colors.error }]}>- Cash Out (Expenses & Suppliers)</Text>
              <Text style={[styles.cfVal, { color: theme.colors.error }]}>-₹1,700</Text>
            </View>
            <View style={styles.cfTotalDivider} />
            <View style={styles.cashflowRow}>
              <Text style={styles.cfTotalLabel}>Closing Counter Cash</Text>
              <Text style={styles.cfTotalVal}>₹29,200</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 40,
  },
  balanceGrid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  balanceCardDue: {
    borderColor: theme.colors.errorContainer,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  balanceAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.primary,
    marginVertical: 4,
  },
  balanceSub: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: theme.borderRadius.md,
    padding: 3,
    marginBottom: theme.spacing.md,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  tabBtnActive: {
    backgroundColor: theme.colors.surfaceWhite,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  tabTextActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  list: {
    gap: theme.spacing.sm,
  },
  custCard: {
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  custTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  custLeft: {
    flex: 1,
  },
  custName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  custPhone: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  custRight: {
    alignItems: 'flex-end',
  },
  custDue: {
    fontSize: 16,
    fontWeight: '800',
  },
  dueLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 1,
  },
  custActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  remindBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: theme.colors.successBg,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
  },
  remindText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.success,
  },
  collectBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
  },
  collectText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },
  cashflowBox: {
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cashflowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  cfLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  cfVal: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  cfTotalDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 10,
  },
  cfTotalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  cfTotalVal: {
    fontSize: 20,
    fontWeight: '900',
    color: theme.colors.primary,
  },
});
