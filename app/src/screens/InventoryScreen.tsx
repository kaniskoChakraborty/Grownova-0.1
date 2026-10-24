import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { Header } from '../components/Header';

export const InventoryScreen: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'low'>('all');
  const [search, setSearch] = useState('');

  const inventoryItems = [
    { id: '1', name: 'Fortune Sunflower Oil (1L)', cat: 'Edible Oils', stock: 14, min: 10, price: 145, status: 'safe' },
    { id: '2', name: 'Aashirvaad Sharbati Atta (10kg)', cat: 'Flour & Grains', stock: 6, min: 15, price: 480, status: 'low' },
    { id: '3', name: 'Tata Tea Premium (500g)', cat: 'Beverages', stock: 28, min: 20, price: 160, status: 'safe' },
    { id: '4', name: 'Madhur Pure Sugar (1kg)', cat: 'Pantry Staples', stock: 3, min: 25, price: 46, status: 'critical' },
    { id: '5', name: 'Toor Dal Desi (1kg)', cat: 'Pulses', stock: 1, min: 10, price: 175, status: 'critical' },
    { id: '6', name: 'Parle-G Gold Biscuits', cat: 'Packaged Foods', stock: 54, min: 20, price: 10, status: 'safe' },
  ];

  const displayed = inventoryItems.filter((it) => {
    const matchesFilter = filter === 'all' || it.status !== 'safe';
    const matchesSearch = it.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <Header title="Inventory & Stock" subtitle="Items, Batches & Reorders" />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* KPI Card */}
        <View style={styles.kpiCard}>
          <View style={styles.kpiTop}>
            <View>
              <Text style={styles.kpiLabel}>Total Inventory Value</Text>
              <Text style={styles.kpiVal}>₹4,82,000</Text>
            </View>
            <View style={styles.lowStockBadge}>
              <MaterialIcons name="warning" size={14} color={theme.colors.secondary} />
              <Text style={styles.lowStockText}>5 Low Stock</Text>
            </View>
          </View>
          <View style={styles.kpiRow}>
            <Text style={styles.kpiSub}>142 Registered Items · Pune Central Godown</Text>
          </View>
        </View>

        {/* Filter & Search */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <MaterialIcons name="search" size={20} color={theme.colors.textMuted} />
            <TextInput
              placeholder="Search items, brand or category..."
              placeholderTextColor={theme.colors.textMuted}
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={styles.scanBtn}>
            <MaterialIcons name="qr-code-scanner" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Filter Toggle */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, filter === 'all' && styles.tabBtnActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.tabText, filter === 'all' && styles.tabTextActive]}>
              All Items (142)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, filter === 'low' && styles.tabBtnActive]}
            onPress={() => setFilter('low')}
          >
            <Text style={[styles.tabText, filter === 'low' && styles.tabTextActive]}>
              ⚠️ Low Stock Alert (5)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Item Cards */}
        <View style={styles.itemList}>
          {displayed.map((it) => (
            <View key={it.id} style={styles.itemCard}>
              <View style={styles.itemMain}>
                <View style={styles.itemLeft}>
                  <Text style={styles.itemName}>{it.name}</Text>
                  <Text style={styles.itemCat}>{it.cat} · ₹{it.price}/unit</Text>
                </View>

                <View style={styles.itemRight}>
                  <Text
                    style={[
                      styles.stockCount,
                      it.status === 'critical'
                        ? { color: theme.colors.error }
                        : it.status === 'low'
                        ? { color: theme.colors.warning }
                        : { color: theme.colors.success },
                    ]}
                  >
                    {it.stock} in stock
                  </Text>
                  <Text style={styles.minStock}>Min {it.min}</Text>
                </View>
              </View>

              {it.status !== 'safe' && (
                <View style={styles.reorderBar}>
                  <Text style={styles.reorderAlert}>⚠️ Running short of buffer</Text>
                  <TouchableOpacity style={styles.reorderBtn}>
                    <Text style={styles.reorderText}>+ Reorder</Text>
                  </TouchableOpacity>
                </View>
              )}
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
  kpiCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  kpiTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  kpiLabel: {
    fontSize: 12,
    color: theme.colors.primaryDim,
    fontWeight: '600',
  },
  kpiVal: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.3,
  },
  lowStockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  lowStockText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  kpiRow: {
    marginTop: 4,
  },
  kpiSub: {
    fontSize: 11,
    color: theme.colors.primaryDim,
  },
  searchRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    height: 42,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.textPrimary,
  },
  scanBtn: {
    width: 42,
    height: 42,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceWhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    paddingVertical: 6,
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
  itemList: {
    gap: theme.spacing.sm,
  },
  itemCard: {
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  itemMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLeft: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  itemCat: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  stockCount: {
    fontSize: 14,
    fontWeight: '800',
  },
  minStock: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  reorderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  reorderAlert: {
    fontSize: 11,
    color: theme.colors.error,
    fontWeight: '600',
  },
  reorderBtn: {
    backgroundColor: theme.colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  reorderText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
});
