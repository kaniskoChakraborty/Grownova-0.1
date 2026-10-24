import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';

export const InventoryScreen: React.FC = () => {
  const { inventory, updateStock, reorderStock, addProduct, lowStockCount, language } = useApp();
  const [filter, setFilter] = useState<'all' | 'low'>('all');
  const [search, setSearch] = useState('');
  const [addModalVisible, setAddModalVisible] = useState(false);

  // New Product Form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Pantry Staples');
  const [price, setPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [unit, setUnit] = useState('packet');
  const [stock, setStock] = useState('20');
  const [minStock, setMinStock] = useState('10');

  const displayed = inventory.filter((it) => {
    const matchesFilter = filter === 'all' || it.status !== 'safe';
    const matchesSearch =
      it.name.toLowerCase().includes(search.toLowerCase()) ||
      it.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalValuation = inventory.reduce((sum, it) => sum + it.price * it.stock, 0);

  const handleAddProduct = () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert('Required Fields', 'Please enter product name and selling price.');
      return;
    }

    addProduct({
      name: name.trim(),
      nameHi: name.trim(),
      category,
      unit,
      price: parseFloat(price) || 0,
      costPrice: parseFloat(costPrice) || Math.round((parseFloat(price) || 0) * 0.85),
      stock: parseInt(stock, 10) || 0,
      minStock: parseInt(minStock, 10) || 10,
    });

    setName('');
    setPrice('');
    setCostPrice('');
    setStock('20');
    setAddModalVisible(false);

    Alert.alert('✅ Product Added', `${name} has been added to shop inventory.`);
  };

  return (
    <View style={styles.container}>
      <Header
        title={language === 'hi' ? 'दुकान का सामान (Stock & Items)' : 'Inventory & Stock'}
        subtitle="Catalog & Reorder Management"
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Inventory Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.summaryLabel}>Total Stock Valuation</Text>
              <Text style={styles.summaryAmount}>₹{totalValuation.toLocaleString('en-IN')}</Text>
            </View>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setAddModalVisible(true)}
              activeOpacity={0.8}
            >
              <MaterialIcons name="add" size={20} color="#FFF" />
              <Text style={styles.addBtnText}>+ Add Item</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.summarySub}>
            {inventory.length} total products · {lowStockCount} need reordering
          </Text>
        </View>

        {/* Filter Chips */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
            onPress={() => setFilter('all')}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              All Items ({inventory.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filter === 'low' && styles.filterChipWarningActive]}
            onPress={() => setFilter('low')}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="warning"
              size={14}
              color={filter === 'low' ? '#FFF' : theme.colors.warning}
            />
            <Text
              style={[
                styles.filterText,
                filter === 'low' && styles.filterTextActive,
                filter !== 'low' && { color: theme.colors.warning },
              ]}
            >
              Low Stock Alert ({lowStockCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color={theme.colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products by name or category..."
            placeholderTextColor={theme.colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Inventory Items List */}
        {displayed.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.itemTop}>
              <View style={styles.itemInfo}>
                <View style={styles.categoryPill}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrices}>
                  Sell: ₹{item.price}/{item.unit} · Cost: ₹{item.costPrice}
                </Text>
              </View>

              <View style={styles.itemStatusWrap}>
                <View
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor:
                        item.status === 'safe'
                          ? theme.colors.successBg
                          : item.status === 'low'
                          ? theme.colors.warningBg
                          : theme.colors.errorBg,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      {
                        color:
                          item.status === 'safe'
                            ? theme.colors.success
                            : item.status === 'low'
                            ? theme.colors.warning
                            : theme.colors.error,
                      },
                    ]}
                  >
                    {item.status.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.currentStockText}>
                  {item.stock} {item.unit}s
                </Text>
              </View>
            </View>

            {/* Quick Adjust & Reorder Controls */}
            <View style={styles.actionsRow}>
              <View style={styles.adjustStockBox}>
                <Text style={styles.adjustLabel}>Quick Adjust:</Text>
                <TouchableOpacity
                  style={styles.adjustBtn}
                  onPress={() => updateStock(item.id, -1)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="remove" size={16} color={theme.colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.adjustBtn}
                  onPress={() => updateStock(item.id, 1)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="add" size={16} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.reorderBtn}
                onPress={() => reorderStock(item.id, 10)}
                activeOpacity={0.8}
              >
                <MaterialIcons name="local-shipping" size={16} color={theme.colors.secondary} />
                <Text style={styles.reorderBtnText}>+10 Reorder</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Product Modal */}
      <Modal
        visible={addModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Product (नया सामान)</Text>
              <TouchableOpacity onPress={() => setAddModalVisible(false)} style={styles.closeBtn}>
                <MaterialIcons name="close" size={24} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Product Name (नाम):</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Fortune Mustard Oil (1L)"
                placeholderTextColor={theme.colors.textMuted}
                value={name}
                onChangeText={setName}
              />

              <View style={styles.formRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.inputLabel}>Selling Price (बिक्री दर):</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="₹ 150"
                    placeholderTextColor={theme.colors.textMuted}
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Cost Price (खरीद दर):</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="₹ 130"
                    placeholderTextColor={theme.colors.textMuted}
                    keyboardType="numeric"
                    value={costPrice}
                    onChangeText={setCostPrice}
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.inputLabel}>Opening Stock (प्रारंभिक):</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="20"
                    placeholderTextColor={theme.colors.textMuted}
                    keyboardType="numeric"
                    value={stock}
                    onChangeText={setStock}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Unit (इकाई):</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="packet / kg / bag"
                    placeholderTextColor={theme.colors.textMuted}
                    value={unit}
                    onChangeText={setUnit}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Category (श्रेणी):</Text>
              <View style={styles.categoryChips}>
                {[
                  'Edible Oils',
                  'Flour & Grains',
                  'Pulses',
                  'Pantry Staples',
                  'Beverages',
                  'Spices',
                ].map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.catChip, category === c && styles.catChipActive]}
                    onPress={() => setCategory(c)}
                  >
                    <Text style={[styles.catChipText, category === c && styles.catChipTextActive]}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.saveProductBtn}
                onPress={handleAddProduct}
                activeOpacity={0.85}
              >
                <MaterialIcons name="check" size={20} color="#FFF" />
                <Text style={styles.saveProductBtnText}>Save Product to Stock</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderGold,
    marginBottom: theme.spacing.lg,
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  summarySub: {
    fontSize: 11,
    color: theme.colors.secondary,
    fontWeight: '600',
  },
  addBtn: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
  },
  addBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: theme.spacing.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipWarningActive: {
    backgroundColor: theme.colors.warning,
    borderColor: theme.colors.warning,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  filterTextActive: {
    color: '#FFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 8,
    marginBottom: theme.spacing.lg,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  itemCard: {
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 8,
  },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemInfo: {
    flex: 1,
    marginRight: 8,
  },
  categoryPill: {
    backgroundColor: theme.colors.surfaceContainerLow,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  itemPrices: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  itemStatusWrap: {
    alignItems: 'flex-end',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 4,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  currentStockText: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  adjustStockBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  adjustLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  adjustBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.secondaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.borderRadius.full,
  },
  reorderBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.secondary,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surfaceWhite,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  closeBtn: {
    padding: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  formInput: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: theme.colors.border,
    fontSize: 14,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  formRow: {
    flexDirection: 'row',
  },
  categoryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: theme.spacing.lg,
  },
  catChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  catChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  catChipText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  catChipTextActive: {
    color: '#FFF',
  },
  saveProductBtn: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    marginTop: 8,
  },
  saveProductBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
