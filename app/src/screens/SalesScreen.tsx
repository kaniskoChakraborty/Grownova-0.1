import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { Header } from '../components/Header';

interface SalesScreenProps {
  onNavigateToBill: () => void;
}

export const SalesScreen: React.FC<SalesScreenProps> = ({ onNavigateToBill }) => {
  const [filter, setFilter] = useState<'all' | 'upi' | 'cash' | 'udhaar'>('all');
  const [search, setSearch] = useState('');

  const salesData = [
    { id: 'GN-1044', cust: 'Amit Store', mode: 'upi', amount: 1450, time: '10m ago', items: 3 },
    { id: 'GN-1043', cust: 'Ramesh ji', mode: 'cash', amount: 8000, time: '35m ago', items: 5 },
    { id: 'GN-1042', cust: 'Pooja Provision', mode: 'upi', amount: 4850, time: '1h ago', items: 4 },
    { id: 'GN-1041', cust: 'Deepak Sharma', mode: 'udhaar', amount: 2300, time: '2h ago', items: 2 },
    { id: 'GN-1040', cust: 'Walk-in Customer', mode: 'cash', amount: 620, time: '2h ago', items: 1 },
    { id: 'GN-1039', cust: 'Mahadev Kirana', mode: 'upi', amount: 9400, time: '3h ago', items: 8 },
  ];

  const filteredSales = salesData.filter((s) => {
    const matchesFilter = filter === 'all' || s.mode === filter;
    const matchesSearch = s.cust.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <Header title="Sales Management" subtitle="Today's Register & Invoices" />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* KPI Banner */}
        <View style={styles.kpiBanner}>
          <View style={styles.kpiTop}>
            <View>
              <Text style={styles.kpiTitle}>Today's Gross Sales</Text>
              <Text style={styles.kpiTotal}>₹38,450</Text>
            </View>
            <TouchableOpacity style={styles.recordSaleBtn} onPress={onNavigateToBill}>
              <MaterialIcons name="add" size={16} color="#FFF" />
              <Text style={styles.recordSaleText}>New Bill</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>18</Text>
              <Text style={styles.statLabel}>Bills Cut</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNum}>₹2,136</Text>
              <Text style={styles.statLabel}>Avg Bill</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: theme.colors.success }]}>₹29,200</Text>
              <Text style={styles.statLabel}>Collected</Text>
            </View>
          </View>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {(['all', 'upi', 'cash', 'udhaar'] as const).map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.filterPill, filter === item && styles.filterPillActive]}
              onPress={() => setFilter(item)}
            >
              <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>
                {item === 'all'
                  ? 'All (सभी)'
                  : item === 'upi'
                  ? 'UPI QR'
                  : item === 'cash'
                  ? 'Cash (नकद)'
                  : 'Udhaar (उधार)'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search input */}
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color={theme.colors.textMuted} />
          <TextInput
            placeholder="Search customer name or bill number..."
            placeholderTextColor={theme.colors.textMuted}
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Transactions List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Invoices ({filteredSales.length})</Text>
        </View>

        <View style={styles.salesList}>
          {filteredSales.map((s) => (
            <View key={s.id} style={styles.saleItem}>
              <View style={styles.saleLeft}>
                <View
                  style={[
                    styles.modeBadge,
                    s.mode === 'upi'
                      ? { backgroundColor: theme.colors.primaryLight }
                      : s.mode === 'cash'
                      ? { backgroundColor: theme.colors.secondaryLight }
                      : { backgroundColor: theme.colors.errorContainer },
                  ]}
                >
                  <MaterialIcons
                    name={
                      s.mode === 'upi'
                        ? 'qr-code-scanner'
                        : s.mode === 'cash'
                        ? 'payments'
                        : 'pending-actions'
                    }
                    size={18}
                    color={
                      s.mode === 'upi'
                        ? theme.colors.primary
                        : s.mode === 'cash'
                        ? theme.colors.secondary
                        : theme.colors.error
                    }
                  />
                </View>

                <View>
                  <Text style={styles.custName}>{s.cust}</Text>
                  <Text style={styles.billMeta}>
                    {s.id} · {s.items} items · {s.time}
                  </Text>
                </View>
              </View>

              <View style={styles.saleRight}>
                <Text style={styles.saleAmount}>₹{s.amount.toLocaleString('en-IN')}</Text>
                <Text
                  style={[
                    styles.modeLabel,
                    s.mode === 'upi'
                      ? { color: theme.colors.primary }
                      : s.mode === 'cash'
                      ? { color: theme.colors.secondary }
                      : { color: theme.colors.error },
                  ]}
                >
                  {s.mode.toUpperCase()}
                </Text>
              </View>
            </View>
          ))}
        </View>
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
  kpiBanner: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  kpiTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  kpiTitle: {
    fontSize: 12,
    color: theme.colors.primaryDim,
    fontWeight: '600',
  },
  kpiTotal: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.3,
  },
  recordSaleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.secondaryAccent,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.borderRadius.sm,
  },
  recordSaleText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primaryDark,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: theme.borderRadius.md,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  statBox: {
    alignItems: 'center',
  },
  statNum: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
  },
  statLabel: {
    fontSize: 10,
    color: theme.colors.primaryDim,
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: theme.spacing.sm,
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surfaceWhite,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterPillActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  filterTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    height: 42,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.textPrimary,
  },
  sectionHeader: {
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  salesList: {
    gap: theme.spacing.sm,
  },
  saleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  saleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  modeBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  custName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  billMeta: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 1,
  },
  saleRight: {
    alignItems: 'flex-end',
  },
  saleAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  modeLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
});
