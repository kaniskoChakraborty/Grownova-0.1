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
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../constants/theme';
import { Header } from '../components/Header';
import { useApp, InventoryItem } from '../context/AppContext';

export const InventoryScreen: React.FC = () => {
  const {
    inventory,
    updateStock,
    setProductQuantity,
    reorderStock,
    addProduct,
    scanAndUpsertProduct,
    lowStockCount,
    language,
  } = useApp();

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

  // AI Camera Scan Modal
  const [scanModalVisible, setScanModalVisible] = useState(false);
  const [scanningActive, setScanningActive] = useState(false);
  const [detectedItem, setDetectedItem] = useState<{
    id?: string;
    name: string;
    category: string;
    price: number;
    costPrice: number;
    unit: string;
    currentStock: number;
    photoUri?: string;
    confidence: number;
  } | null>(null);

  // Quantity Prompt State
  const [countMode, setCountMode] = useState<'set_total' | 'add_inward'>('set_total');
  const [quantityInput, setQuantityInput] = useState<string>('30');

  // Sample FMCG database for camera simulation
  const FMCG_PRESETS = [
    {
      name: 'Fortune Sunflower Oil (1L)',
      category: 'Edible Oils',
      price: 145,
      costPrice: 128,
      unit: 'pouch',
      photoUri: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=60',
    },
    {
      name: 'Aashirvaad Sharbati Atta (10kg)',
      category: 'Flour & Grains',
      price: 480,
      costPrice: 420,
      unit: 'bag',
      photoUri: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=60',
    },
    {
      name: 'Tata Tea Premium (500g)',
      category: 'Beverages',
      price: 160,
      costPrice: 135,
      unit: 'packet',
      photoUri: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=60',
    },
    {
      name: 'Madhur Pure Sugar (1kg)',
      category: 'Pantry Staples',
      price: 46,
      costPrice: 38,
      unit: 'packet',
      photoUri: 'https://images.unsplash.com/photo-1622484214144-8da018d96078?w=400&auto=format&fit=crop&q=60',
    },
    {
      name: 'Toor Dal Desi (1kg)',
      category: 'Pulses',
      price: 175,
      costPrice: 152,
      unit: 'kg',
      photoUri: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=400&auto=format&fit=crop&q=60',
    },
    {
      name: 'Parle-G Gold Biscuits (100g)',
      category: 'Packaged Foods',
      price: 10,
      costPrice: 8,
      unit: 'packet',
      photoUri: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop&q=60',
    },
    {
      name: 'MDH Garam Masala (100g)',
      category: 'Spices',
      price: 92,
      costPrice: 76,
      unit: 'box',
      photoUri: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=60',
    },
  ];

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

  // Launch Camera to scan product
  const handleScanWithCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Camera Permission', 'Please allow camera permission to photograph product.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        processProductPhoto(result.assets[0].uri);
      }
    } catch (e) {
      // Fallback to sample packaging
      selectPresetProduct(FMCG_PRESETS[0]);
    }
  };

  // Pick product photo from gallery
  const handleScanWithGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        processProductPhoto(result.assets[0].uri);
      }
    } catch (e) {
      selectPresetProduct(FMCG_PRESETS[2]);
    }
  };

  // Simulate AI Packaging & Label Recognition
  const processProductPhoto = (photoUri: string) => {
    setScanningActive(true);
    setDetectedItem(null);

    setTimeout(() => {
      setScanningActive(false);
      // Pick or match an item
      const matched = inventory[0] || FMCG_PRESETS[0];
      setDetectedItem({
        id: matched.id,
        name: matched.name,
        category: matched.category,
        price: matched.price,
        costPrice: matched.costPrice || Math.round(matched.price * 0.85),
        unit: matched.unit,
        currentStock: matched.stock,
        photoUri,
        confidence: 98.4,
      });
      setQuantityInput(matched.stock.toString());
    }, 1200);
  };

  const selectPresetProduct = (preset: typeof FMCG_PRESETS[0]) => {
    setScanningActive(true);
    setDetectedItem(null);

    setTimeout(() => {
      setScanningActive(false);
      const existingInStore = inventory.find(
        (it) => it.name.toLowerCase() === preset.name.toLowerCase()
      );

      const currentStock = existingInStore ? existingInStore.stock : 0;
      setDetectedItem({
        id: existingInStore?.id,
        name: preset.name,
        category: preset.category,
        price: preset.price,
        costPrice: preset.costPrice,
        unit: preset.unit,
        currentStock,
        photoUri: preset.photoUri,
        confidence: 99.1,
      });
      setQuantityInput((currentStock + 10).toString());
    }, 800);
  };

  // Confirm quantity and update inventory
  const handleConfirmQuantityUpdate = () => {
    if (!detectedItem) return;

    const parsedQty = parseInt(quantityInput, 10);
    if (isNaN(parsedQty) || parsedQty < 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid non-negative number for quantity.');
      return;
    }

    let finalNewStock = parsedQty;
    if (countMode === 'add_inward') {
      finalNewStock = detectedItem.currentStock + parsedQty;
    }

    if (detectedItem.id) {
      setProductQuantity(detectedItem.id, finalNewStock);
    } else {
      scanAndUpsertProduct({
        name: detectedItem.name,
        category: detectedItem.category,
        price: detectedItem.price,
        costPrice: detectedItem.costPrice,
        unit: detectedItem.unit,
        stock: finalNewStock,
        photoUri: detectedItem.photoUri,
      });
    }

    Alert.alert(
      '✅ Inventory Stock Updated',
      `${detectedItem.name} stock has been updated to ${finalNewStock} ${detectedItem.unit}s.\nRecorded in GrowNova Store Inventory.`
    );

    setScanModalVisible(false);
    setDetectedItem(null);
  };

  const adjustQtyInput = (delta: number) => {
    const cur = parseInt(quantityInput, 10) || 0;
    const next = Math.max(0, cur + delta);
    setQuantityInput(next.toString());
  };

  return (
    <View style={styles.container}>
      <Header
        title={language === 'hi' ? 'दुकान का सामान (Stock & Items)' : 'Inventory & Stock'}
        subtitle="Catalog & Stock Management"
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

            <View style={styles.summaryActions}>
              {/* Prominent AI Scan Inventory Button */}
              <TouchableOpacity
                style={styles.scanBtn}
                onPress={() => setScanModalVisible(true)}
                activeOpacity={0.8}
              >
                <MaterialIcons name="photo-camera" size={17} color="#FFF" />
                <Text style={styles.scanBtnText}>Scan Product</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => setAddModalVisible(true)}
                activeOpacity={0.8}
              >
                <MaterialIcons name="add" size={18} color="#102B4E" />
                <Text style={styles.addBtnText}>+ New</Text>
              </TouchableOpacity>
            </View>
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
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <MaterialIcons name="close" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
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
                <Text style={styles.adjustLabel}>Quick Stock:</Text>
                <TouchableOpacity
                  style={styles.adjustBtn}
                  onPress={() => updateStock(item.id, -1)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="remove" size={16} color={theme.colors.primary} />
                </TouchableOpacity>
                <Text style={styles.inlineStockCount}>{item.stock}</Text>
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
                <Text style={styles.reorderBtnText}>+10 Inward</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ======================================================== */}
      {/* 📷 AI INVENTORY SCANNER & QUANTITY PROMPT MODAL */}
      {/* ======================================================== */}
      <Modal
        visible={scanModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setScanModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.scannerSheet}>
            {/* Header */}
            <View style={styles.scannerHeader}>
              <View>
                <Text style={styles.scannerTitle}>📷 Scan Product (AI Camera)</Text>
                <Text style={styles.scannerSubtitle}>
                  Snap product photo to auto-detect and update inventory
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setScanModalVisible(false);
                  setDetectedItem(null);
                }}
                style={styles.closeBtn}
              >
                <MaterialIcons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 520 }}>
              {/* Viewfinder / Camera Section */}
              <View style={styles.scannerViewfinder}>
                {scanningActive ? (
                  <View style={styles.scanningAnimBox}>
                    <View style={styles.laserBeam} />
                    <MaterialIcons name="document-scanner" size={48} color="#C69A43" />
                    <Text style={styles.scanningText}>AI Analyzing Packaging & Barcode...</Text>
                    <Text style={styles.scanningSubText}>Matching with shop FMCG catalog</Text>
                  </View>
                ) : detectedItem ? (
                  <View style={styles.detectedPreviewBox}>
                    {detectedItem.photoUri ? (
                      <Image
                        source={{ uri: detectedItem.photoUri }}
                        style={styles.detectedImage}
                      />
                    ) : (
                      <View style={styles.detectedNoImg}>
                        <MaterialIcons name="inventory" size={40} color="#64748B" />
                      </View>
                    )}
                    <View style={styles.detectedOverlayBadge}>
                      <MaterialIcons name="auto-awesome" size={13} color="#FFF" />
                      <Text style={styles.detectedBadgeText}>
                        {detectedItem.confidence}% Match Detected
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.idleViewfinder}>
                    <View style={styles.cornerTL} />
                    <View style={styles.cornerTR} />
                    <View style={styles.cornerBL} />
                    <View style={styles.cornerBR} />
                    <MaterialIcons name="qr-code-scanner" size={54} color="rgba(255,255,255,0.4)" />
                    <Text style={styles.viewfinderPrompt}>
                      Point camera at product label or choose below
                    </Text>
                  </View>
                )}
              </View>

              {/* Camera Trigger Buttons */}
              <View style={styles.camButtonRow}>
                <TouchableOpacity
                  style={styles.camActionBtn}
                  onPress={handleScanWithCamera}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="photo-camera" size={20} color={theme.colors.primary} />
                  <Text style={styles.camActionBtnText}>Click Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.camActionBtn}
                  onPress={handleScanWithGallery}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="photo-library" size={20} color={theme.colors.primary} />
                  <Text style={styles.camActionBtnText}>Pick Photo</Text>
                </TouchableOpacity>
              </View>

              {/* Quick Preset Selector for Fast Scanning */}
              {!detectedItem && (
                <View style={styles.presetSection}>
                  <Text style={styles.presetSectionTitle}>Or select product sample to scan:</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.presetScroll}
                  >
                    {FMCG_PRESETS.map((p) => (
                      <TouchableOpacity
                        key={p.name}
                        style={styles.presetCard}
                        onPress={() => selectPresetProduct(p)}
                        activeOpacity={0.8}
                      >
                        <Image source={{ uri: p.photoUri }} style={styles.presetImg} />
                        <Text numberOfLines={1} style={styles.presetName}>
                          {p.name}
                        </Text>
                        <Text style={styles.presetPrice}>₹{p.price}/{p.unit}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* ======================================================== */}
              {/* DETECTED PRODUCT & QUANTITY PROMPT */}
              {/* ======================================================== */}
              {detectedItem && (
                <View style={styles.promptCard}>
                  <View style={styles.productMatchHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.productMatchTitle}>{detectedItem.name}</Text>
                      <Text style={styles.productMatchSub}>
                        {detectedItem.category} · Price: ₹{detectedItem.price}/{detectedItem.unit}
                      </Text>
                    </View>
                    <View style={styles.currentStockPill}>
                      <Text style={styles.currentStockLabel}>Current Stock</Text>
                      <Text style={styles.currentStockVal}>
                        {detectedItem.currentStock} {detectedItem.unit}s
                      </Text>
                    </View>
                  </View>

                  {/* USER REQUEST REQUIREMENT: "ask how much quantity is there" */}
                  <View style={styles.qtyPromptBox}>
                    <Text style={styles.qtyPromptQuestion}>
                      📦 How much quantity is currently there?
                    </Text>
                    <Text style={styles.qtyPromptSub}>
                      दुकान में कितना सामान है? शेल्फ काउंट या नया स्टॉक जोड़ें।
                    </Text>

                    {/* Mode Toggle: Set Shelf Total vs Add Inward */}
                    <View style={styles.modeToggleRow}>
                      <TouchableOpacity
                        style={[
                          styles.modeBtn,
                          countMode === 'set_total' && styles.modeBtnActive,
                        ]}
                        onPress={() => setCountMode('set_total')}
                      >
                        <Text
                          style={[
                            styles.modeBtnText,
                            countMode === 'set_total' && styles.modeBtnTextActive,
                          ]}
                        >
                          Set Total Stock (शेल्फ गिनती)
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.modeBtn,
                          countMode === 'add_inward' && styles.modeBtnActive,
                        ]}
                        onPress={() => setCountMode('add_inward')}
                      >
                        <Text
                          style={[
                            styles.modeBtnText,
                            countMode === 'add_inward' && styles.modeBtnTextActive,
                          ]}
                        >
                          + Add Inward (नया सामान)
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Quantity Stepper & Input */}
                    <View style={styles.stepperRow}>
                      <TouchableOpacity
                        style={styles.stepperBtn}
                        onPress={() => adjustQtyInput(-5)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.stepperBtnSign}>-5</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.stepperBtn}
                        onPress={() => adjustQtyInput(-1)}
                        activeOpacity={0.7}
                      >
                        <MaterialIcons name="remove" size={24} color={theme.colors.primary} />
                      </TouchableOpacity>

                      <View style={styles.stepperInputWrapper}>
                        <TextInput
                          style={styles.stepperTextInput}
                          keyboardType="numeric"
                          value={quantityInput}
                          onChangeText={setQuantityInput}
                        />
                        <Text style={styles.stepperUnitText}>{detectedItem.unit}s</Text>
                      </View>

                      <TouchableOpacity
                        style={styles.stepperBtn}
                        onPress={() => adjustQtyInput(1)}
                        activeOpacity={0.7}
                      >
                        <MaterialIcons name="add" size={24} color={theme.colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.stepperBtn}
                        onPress={() => adjustQtyInput(5)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.stepperBtnSign}>+5</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Resulting Total Display */}
                    <View style={styles.resultingTotalRow}>
                      <Text style={styles.resultingTotalLabel}>
                        {countMode === 'set_total'
                          ? 'New Inventory Stock:'
                          : `Total will be: ${detectedItem.currentStock} + ${parseInt(quantityInput, 10) || 0} =`}
                      </Text>
                      <Text style={styles.resultingTotalValue}>
                        {countMode === 'set_total'
                          ? `${parseInt(quantityInput, 10) || 0} ${detectedItem.unit}s`
                          : `${detectedItem.currentStock + (parseInt(quantityInput, 10) || 0)} ${detectedItem.unit}s`}
                      </Text>
                    </View>

                    {/* Confirm Button */}
                    <TouchableOpacity
                      style={styles.confirmStockBtn}
                      onPress={handleConfirmQuantityUpdate}
                      activeOpacity={0.85}
                    >
                      <MaterialIcons name="save" size={20} color="#FFF" />
                      <Text style={styles.confirmStockBtnText}>
                        Update Inventory (स्टॉक अपडेट करें)
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* ADD PRODUCT MODAL (MANUAL) */}
      {/* ======================================================== */}
      <Modal
        visible={addModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.manualModalSheet}>
            <View style={styles.scannerHeader}>
              <Text style={styles.scannerTitle}>Add New Product (नया सामान)</Text>
              <TouchableOpacity onPress={() => setAddModalVisible(false)} style={styles.closeBtn}>
                <MaterialIcons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
              <Text style={styles.formLabel}>Product Name:</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Fortune Mustard Oil (1L)"
                placeholderTextColor={theme.colors.textMuted}
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.formLabel}>Category:</Text>
              <View style={styles.catChips}>
                {[
                  'Pantry Staples',
                  'Edible Oils',
                  'Flour & Grains',
                  'Beverages',
                  'Pulses',
                  'Spices',
                  'Packaged Foods',
                ].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catChip, category === cat && styles.catChipActive]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.catChipText,
                        category === cat && styles.catChipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.twoCol}>
                <View style={styles.col}>
                  <Text style={styles.formLabel}>Selling Price (₹):</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="145"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                  />
                </View>
                <View style={styles.col}>
                  <Text style={styles.formLabel}>Cost Price (₹):</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="128"
                    keyboardType="numeric"
                    value={costPrice}
                    onChangeText={setCostPrice}
                  />
                </View>
              </View>

              <View style={styles.twoCol}>
                <View style={styles.col}>
                  <Text style={styles.formLabel}>Initial Stock:</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="20"
                    keyboardType="numeric"
                    value={stock}
                    onChangeText={setStock}
                  />
                </View>
                <View style={styles.col}>
                  <Text style={styles.formLabel}>Unit (packet/bag/kg):</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="packet"
                    value={unit}
                    onChangeText={setUnit}
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleAddProduct}>
                <Text style={styles.saveBtnText}>Save Product to Inventory</Text>
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
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#102B4E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  summaryAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#102B4E',
    marginTop: 2,
  },
  summaryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#102B4E',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C69A43',
  },
  scanBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#102B4E',
  },
  summarySub: {
    fontSize: 12,
    color: '#64748B',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  filterChipActive: {
    backgroundColor: '#102B4E',
    borderColor: '#102B4E',
  },
  filterChipWarningActive: {
    backgroundColor: '#D97706',
    borderColor: '#D97706',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: '#102B4E',
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemInfo: {
    flex: 1,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#102B4E',
  },
  itemPrices: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  itemStatusWrap: {
    alignItems: 'flex-end',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  currentStockText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#102B4E',
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  adjustStockBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  adjustLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  adjustBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  inlineStockCount: {
    fontSize: 13,
    fontWeight: '800',
    color: '#102B4E',
    minWidth: 24,
    textAlign: 'center',
  },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFDF9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(198, 154, 67, 0.4)',
  },
  reorderBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C69A43',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(16, 43, 78, 0.75)',
    justifyContent: 'flex-end',
  },
  scannerSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '92%',
  },
  scannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  scannerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#102B4E',
  },
  scannerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  scannerViewfinder: {
    width: '100%',
    height: 190,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#334155',
  },
  idleViewfinder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cornerTL: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 22,
    height: 22,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#C69A43',
  },
  cornerTR: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 22,
    height: 22,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#C69A43',
  },
  cornerBL: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    width: 22,
    height: 22,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#C69A43',
  },
  cornerBR: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 22,
    height: 22,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#C69A43',
  },
  viewfinderPrompt: {
    color: '#CBD5E1',
    fontSize: 12,
    marginTop: 10,
    fontWeight: '600',
  },
  scanningAnimBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  laserBeam: {
    position: 'absolute',
    top: '45%',
    left: 20,
    right: 20,
    height: 3,
    backgroundColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },
  scanningText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
  },
  scanningSubText: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  detectedPreviewBox: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  detectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detectedNoImg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
  },
  detectedOverlayBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  detectedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  camButtonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  camActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  camActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#102B4E',
  },
  presetSection: {
    marginBottom: 16,
  },
  presetSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
  },
  presetScroll: {
    gap: 10,
    paddingVertical: 4,
  },
  presetCard: {
    width: 105,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  presetImg: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 6,
    resizeMode: 'cover',
  },
  presetName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#102B4E',
    textAlign: 'center',
  },
  presetPrice: {
    fontSize: 10,
    color: '#C69A43',
    fontWeight: '800',
    marginTop: 2,
  },
  promptCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#C69A43',
    marginBottom: 16,
  },
  productMatchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3E8D2',
  },
  productMatchTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#102B4E',
  },
  productMatchSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  currentStockPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'flex-end',
  },
  currentStockLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  currentStockVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#102B4E',
  },
  qtyPromptBox: {
    paddingTop: 12,
  },
  qtyPromptQuestion: {
    fontSize: 14,
    fontWeight: '800',
    color: '#102B4E',
  },
  qtyPromptSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 10,
  },
  modeToggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  modeBtnActive: {
    backgroundColor: '#102B4E',
    borderColor: '#102B4E',
  },
  modeBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  modeBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 14,
  },
  stepperBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  stepperBtnSign: {
    fontSize: 14,
    fontWeight: '800',
    color: '#102B4E',
  },
  stepperInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#102B4E',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    minWidth: 110,
    justifyContent: 'center',
  },
  stepperTextInput: {
    fontSize: 20,
    fontWeight: '900',
    color: '#102B4E',
    textAlign: 'center',
    minWidth: 50,
  },
  stepperUnitText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginLeft: 4,
  },
  resultingTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  resultingTotalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  resultingTotalValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#16A34A',
  },
  confirmStockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#102B4E',
    paddingVertical: 13,
    borderRadius: 12,
  },
  confirmStockBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  manualModalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#102B4E',
    marginTop: 10,
    marginBottom: 4,
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#102B4E',
  },
  catChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  catChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  catChipActive: {
    backgroundColor: theme.colors.primary,
  },
  catChipText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  catChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  twoCol: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
  },
  saveBtn: {
    backgroundColor: '#102B4E',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
