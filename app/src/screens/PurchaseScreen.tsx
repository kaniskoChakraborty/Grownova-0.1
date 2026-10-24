import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { Header } from '../components/Header';

export const PurchaseScreen: React.FC = () => {
  const suppliers = [
    { name: 'Balaji Agro Mills', city: 'Nagpur', items: 'Wheat & Rice 50 bags', amount: 18400, due: 'In 3 days', status: 'due' },
    { name: 'Gujarat Oil Traders', city: 'Ahmedabad', items: 'Refined Oil 20 cartons', amount: 12100, due: 'Overdue 2 days', status: 'overdue' },
    { name: 'Kisan Wholesalers', city: 'Pune Mandi', items: 'Pulses & Spices', amount: 12000, due: 'Paid', status: 'paid' },
    { name: 'Tata Consumer Distrib.', city: 'Mumbai', items: 'Tea 500g 48 units', amount: 7680, due: 'Paid', status: 'paid' },
  ];

  return (
    <View style={styles.container}>
      <Header title="Purchase & Suppliers" subtitle="Inward Stock & Supplier Khata" />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Payable Header Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.summaryLabel}>Total Supplier Dues (देना बाकी)</Text>
              <Text style={styles.summaryAmount}>₹30,500</Text>
            </View>
            <TouchableOpacity style={styles.addBillBtn}>
              <MaterialIcons name="add" size={16} color="#FFF" />
              <Text style={styles.addBillText}>Add Bill</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dueAlertRow}>
            <MaterialIcons name="schedule" size={14} color={theme.colors.error} />
            <Text style={styles.dueAlertText}>₹12,100 overdue to Gujarat Oil Traders</Text>
          </View>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Supplier Inward Bills</Text>
          <Text style={styles.sectionCount}>4 Bills</Text>
        </View>

        {/* Suppliers List */}
        <View style={styles.list}>
          {suppliers.map((sup, idx) => (
            <View key={idx} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <View style={styles.itemLeft}>
                  <Text style={styles.supplierName}>{sup.name}</Text>
                  <Text style={styles.supplierCity}>{sup.city}</Text>
                </View>
                <View style={styles.itemRight}>
                  <Text style={styles.supplierAmount}>₹{sup.amount.toLocaleString('en-IN')}</Text>
                  <View
                    style={[
                      styles.statusPill,
                      sup.status === 'paid'
                        ? { backgroundColor: theme.colors.successBg }
                        : sup.status === 'overdue'
                        ? { backgroundColor: theme.colors.errorContainer }
                        : { backgroundColor: theme.colors.warningBg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        sup.status === 'paid'
                          ? { color: theme.colors.success }
                          : sup.status === 'overdue'
                          ? { color: theme.colors.error }
                          : { color: theme.colors.warning },
                      ]}
                    >
                      {sup.due}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.itemFooter}>
                <Text style={styles.itemsSummary}>📦 {sup.items}</Text>
                {sup.status !== 'paid' && (
                  <TouchableOpacity style={styles.payBtn}>
                    <Text style={styles.payBtnText}>Pay Now</Text>
                  </TouchableOpacity>
                )}
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
  summaryCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: 12,
    color: theme.colors.primaryDim,
    fontWeight: '600',
  },
  summaryAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.3,
  },
  addBillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.secondaryAccent,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.borderRadius.sm,
  },
  addBillText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primaryDark,
  },
  dueAlertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
  },
  dueAlertText: {
    fontSize: 11,
    color: theme.colors.errorBg,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  sectionCount: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  list: {
    gap: theme.spacing.sm,
  },
  itemCard: {
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemLeft: {
    flex: 1,
  },
  supplierName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  supplierCity: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 1,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  supplierAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  statusPill: {
    marginTop: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  itemsSummary: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  payBtn: {
    backgroundColor: theme.colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  payBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
});
