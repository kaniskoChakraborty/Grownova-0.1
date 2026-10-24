import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { Header } from '../components/Header';

interface CreateBillScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const CreateBillScreen: React.FC<CreateBillScreenProps> = ({ onBack, onSuccess }) => {
  const [customerType, setCustomerType] = useState<'walkin' | 'khata'>('khata');
  const [paymentMode, setPaymentMode] = useState<'upi' | 'cash' | 'udhaar'>('upi');

  const [items, setItems] = useState([
    { id: '1', name: 'Fortune Sunflower Oil (1L)', price: 145, qty: 2, stock: 14 },
    { id: '2', name: 'Aashirvaad Sharbati Atta (10kg)', price: 480, qty: 1, stock: 6 },
    { id: '3', name: 'Tata Tea Premium (500g)', price: 160, qty: 2, stock: 28 },
  ]);

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((it) => (it.id === id ? { ...it, qty: Math.max(0, it.qty + delta) } : it))
        .filter((it) => it.qty > 0)
    );
  };

  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const discount = 40;
  const tax = 52;
  const finalTotal = Math.max(0, subtotal - discount + tax);

  const handleSaveBill = () => {
    Alert.alert(
      '✅ Bill Generated & Sent!',
      `Bill #GN-1045 for ₹${finalTotal.toLocaleString('en-IN')} saved in local cache and sent to WhatsApp.`,
      [{ text: 'OK', onPress: onSuccess }]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Make New Bill (बिल बनाएं)"
        subtitle="POS Counter 01 · Step 1 of 2"
        showBack={true}
        onBack={onBack}
        rightBadge="Synced"
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Bill Meta Pill */}
        <View style={styles.metaRow}>
          <View style={styles.metaLeft}>
            <View style={styles.metaIcon}>
              <MaterialIcons name="receipt-long" size={18} color={theme.colors.secondary} />
            </View>
            <View>
              <View style={styles.billIdRow}>
                <Text style={styles.billIdText}>Bill #GN-1045</Text>
                <View style={styles.liveBadge}>
                  <Text style={styles.liveBadgeText}>POS Live</Text>
                </View>
              </View>
              <Text style={styles.metaTime}>Counter 01 · 24 Oct, Today</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.draftBtn}>
            <MaterialIcons name="bookmark-add" size={15} color={theme.colors.primary} />
            <Text style={styles.draftText}>Draft</Text>
          </TouchableOpacity>
        </View>

        {/* Customer Selector Card */}
        <View style={styles.custCard}>
          <View style={styles.custToggleRow}>
            <TouchableOpacity
              onPress={() => setCustomerType('walkin')}
              style={[styles.custToggleBtn, customerType === 'walkin' && styles.custToggleActive]}
            >
              <Text style={[styles.custToggleText, customerType === 'walkin' && styles.custToggleTextActive]}>
                Walk-in Customer
              </Text>
              <Text style={styles.custToggleSub}>(दुकान ग्राहक)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setCustomerType('khata')}
              style={[styles.custToggleBtn, customerType === 'khata' && styles.custToggleActive]}
            >
              <Text style={[styles.custToggleText, customerType === 'khata' && styles.custToggleTextActive]}>
                Regular / Khata
              </Text>
              <Text style={styles.custToggleSub}>(उधार / खाता)</Text>
            </TouchableOpacity>
          </View>

          {customerType === 'khata' ? (
            <View style={styles.selectedCustBox}>
              <View style={styles.custAvatar}>
                <Text style={styles.custAvatarText}>AS</Text>
              </View>
              <View style={styles.custInfo}>
                <View style={styles.custNameRow}>
                  <Text style={styles.custName}>Amit Sharma</Text>
                  <View style={styles.khataActivePill}>
                    <Text style={styles.khataActiveText}>Khata Active</Text>
                  </View>
                </View>
                <View style={styles.custSubRow}>
                  <MaterialIcons name="call" size={14} color={theme.colors.textMuted} />
                  <Text style={styles.custPhone}>98230-84192</Text>
                  <Text style={styles.custLimit}>• Limit ₹15k</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.custSearchBtn}>
                <MaterialIcons name="person-search" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.walkinBox}>
              <Text style={styles.walkinText}>Direct counter customer (No account ledger created)</Text>
            </View>
          )}
        </View>

        {/* Cart Items Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.cartTitleRow}>
            <Text style={styles.sectionTitle}>Cart Items (सामान)</Text>
            <View style={styles.cartCountBadge}>
              <Text style={styles.cartCountText}>{items.length}</Text>
            </View>
          </View>
          <Text style={styles.adjustText}>Tap + / - to adjust</Text>
        </View>

        <View style={styles.itemList}>
          {items.map((it) => (
            <View key={it.id} style={styles.itemRow}>
              <View style={styles.itemLeft}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {it.name}
                </Text>
                <Text style={styles.itemSub}>
                  ₹{it.price} × {it.qty} {it.qty > 1 ? 'packs' : 'pack'}
                </Text>
                <View style={styles.stockStatus}>
                  <MaterialIcons name="inventory-2" size={12} color={theme.colors.success} />
                  <Text style={styles.stockStatusText}>{it.stock} in stock</Text>
                </View>
              </View>

              <View style={styles.itemRight}>
                <Text style={styles.itemTotal}>₹{it.price * it.qty}</Text>
                <View style={styles.qtyControl}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQty(it.id, -1)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name="remove" size={16} color={theme.colors.primary} />
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{it.qty}</Text>
                  <TouchableOpacity
                    style={[styles.qtyBtn, styles.qtyBtnPlus]}
                    onPress={() => updateQty(it.id, 1)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name="add" size={16} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Add item buttons */}
        <View style={styles.addItemRow}>
          <TouchableOpacity style={styles.addItemBtn} activeOpacity={0.8}>
            <MaterialIcons name="add-circle" size={18} color={theme.colors.primary} />
            <Text style={styles.addItemText}>+ Add Item</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.scanBtn} activeOpacity={0.8}>
            <MaterialIcons name="qr-code-scanner" size={18} color={theme.colors.secondary} />
            <Text style={styles.scanText}>Scan Barcode</Text>
          </TouchableOpacity>
        </View>

        {/* Bill Calculation Box */}
        <View style={styles.calcBox}>
          <View style={styles.calcHeader}>
            <Text style={styles.calcTitle}>Bill Calculation (हिसाब)</Text>
            <View style={styles.gstBadge}>
              <Text style={styles.gstText}>GST Included</Text>
            </View>
          </View>

          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>Total Items</Text>
            <Text style={styles.calcValue}>{items.length} items</Text>
          </View>
          <View style={styles.calcRow}>
            <Text style={[styles.calcLabel, { color: theme.colors.success }]}>Discount (छूट)</Text>
            <Text style={[styles.calcValue, { color: theme.colors.success }]}>-₹{discount}.00</Text>
          </View>
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>Taxes Included</Text>
            <Text style={styles.calcValue}>+₹{tax}.00</Text>
          </View>

          <View style={styles.finalTotalBox}>
            <View>
              <Text style={styles.finalTotalLabel}>Final Amount to Collect</Text>
              <Text style={styles.finalTotalSub}>(कुल राशि)</Text>
            </View>
            <Text style={styles.finalTotalValue}>₹{finalTotal.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        {/* Payment Selection */}
        <View style={styles.paymentBox}>
          <Text style={styles.paymentTitle}>Payment Selection (भुगतान)</Text>

          <TouchableOpacity
            style={[styles.paymentOption, paymentMode === 'upi' && styles.paymentOptionActive]}
            onPress={() => setPaymentMode('upi')}
          >
            <View style={styles.paymentOptLeft}>
              <View style={[styles.radioCircle, paymentMode === 'upi' && styles.radioActive]} />
              <View style={styles.payIconCircle}>
                <MaterialIcons name="qr-code-scanner" size={20} color={theme.colors.secondary} />
              </View>
              <View>
                <Text style={styles.payOptionTitle}>UPI QR Code</Text>
                <Text style={styles.payOptionSub}>Instant soundbox alert</Text>
              </View>
            </View>
            <View style={styles.autoVerifyBadge}>
              <Text style={styles.autoVerifyText}>Auto Verify</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentOption, paymentMode === 'cash' && styles.paymentOptionActive]}
            onPress={() => setPaymentMode('cash')}
          >
            <View style={styles.paymentOptLeft}>
              <View style={[styles.radioCircle, paymentMode === 'cash' && styles.radioActive]} />
              <View style={styles.payIconCircle}>
                <MaterialIcons name="payments" size={20} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={styles.payOptionTitle}>Cash on Counter</Text>
                <Text style={styles.payOptionSub}>Manual cash collected</Text>
              </View>
            </View>
            <Text style={styles.cashAmount}>₹{finalTotal}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentOption, paymentMode === 'udhaar' && styles.paymentOptionActive]}
            onPress={() => setPaymentMode('udhaar')}
          >
            <View style={styles.paymentOptLeft}>
              <View style={[styles.radioCircle, paymentMode === 'udhaar' && styles.radioActive]} />
              <View style={styles.payIconCircle}>
                <MaterialIcons name="menu-book" size={20} color={theme.colors.error} />
              </View>
              <View>
                <Text style={styles.payOptionTitle}>Add to Customer Udhaar</Text>
                <Text style={styles.payOptionSub}>Pay later (खाते में जोड़ें)</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={theme.colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Generate Bill CTA */}
        <TouchableOpacity style={styles.generateBtn} activeOpacity={0.85} onPress={handleSaveBill}>
          <View style={styles.genBtnLeft}>
            <Text style={styles.genCheck}>✅</Text>
            <View>
              <Text style={styles.genTitle}>Save & Share on WhatsApp</Text>
              <Text style={styles.genSub}>(बिल सेव करें व भेजें)</Text>
            </View>
          </View>
          <View style={styles.genAmountPill}>
            <Text style={styles.genAmountText}>₹{finalTotal}</Text>
            <MaterialIcons name="arrow-forward" size={18} color="#FFF" />
          </View>
        </TouchableOpacity>

        <View style={styles.secondaryActionsRow}>
          <TouchableOpacity style={styles.thermalBtn} activeOpacity={0.8}>
            <MaterialIcons name="print" size={18} color={theme.colors.primary} />
            <Text style={styles.thermalText}>Thermal Print</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearBtn} activeOpacity={0.8} onPress={() => setItems([])}>
            <MaterialIcons name="delete-sweep" size={18} color={theme.colors.error} />
            <Text style={styles.clearText}>Clear Bill</Text>
          </TouchableOpacity>
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  billIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  billIdText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  liveBadge: {
    backgroundColor: theme.colors.surfaceContainerHigh,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  liveBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  metaTime: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 1,
  },
  draftBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  draftText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  custCard: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  custToggleRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: theme.borderRadius.md,
    padding: 3,
    marginBottom: theme.spacing.sm,
  },
  custToggleBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  custToggleActive: {
    backgroundColor: theme.colors.surfaceWhite,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  custToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  custToggleTextActive: {
    color: theme.colors.primary,
    fontWeight: '800',
  },
  custToggleSub: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  selectedCustBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  custAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  custAvatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.secondary,
  },
  custInfo: {
    flex: 1,
  },
  custNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  custName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  khataActivePill: {
    backgroundColor: theme.colors.successBg,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: theme.borderRadius.full,
  },
  khataActiveText: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.success,
  },
  custSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  custPhone: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  custLimit: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.secondary,
  },
  custSearchBtn: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walkinBox: {
    backgroundColor: theme.colors.surfaceWhite,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  walkinText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  cartTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  cartCountBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartCountText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  adjustText: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  itemList: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  itemLeft: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  itemSub: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  stockStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  stockStatusText: {
    fontSize: 11,
    color: theme.colors.success,
    fontWeight: '600',
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: theme.borderRadius.sm,
    padding: 2,
    gap: 4,
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 4,
    backgroundColor: theme.colors.surfaceWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnPlus: {
    backgroundColor: theme.colors.primary,
  },
  qtyValue: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
    paddingHorizontal: 4,
  },
  addItemRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  addItemBtn: {
    flex: 1,
    height: 44,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceContainerLow,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  addItemText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  scanBtn: {
    flex: 1,
    height: 44,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.secondaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  scanText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  calcBox: {
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  calcHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: 8,
  },
  calcTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  gstBadge: {
    backgroundColor: theme.colors.secondaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  gstText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  calcLabel: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  calcValue: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  finalTotalBox: {
    marginTop: 8,
    backgroundColor: theme.colors.secondaryLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.secondaryContainer,
  },
  finalTotalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  finalTotalSub: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  finalTotalValue: {
    fontSize: 26,
    fontWeight: '900',
    color: theme.colors.primary,
  },
  paymentBox: {
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceContainerLow,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  paymentOptionActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surfaceWhite,
  },
  paymentOptLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  radioActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  payIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payOptionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  payOptionSub: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  autoVerifyBadge: {
    backgroundColor: theme.colors.secondaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  autoVerifyText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  cashAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  generateBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: theme.spacing.sm,
  },
  genBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  genCheck: {
    fontSize: 18,
  },
  genTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
  },
  genSub: {
    fontSize: 10,
    color: theme.colors.primaryDim,
  },
  genAmountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  genAmountText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  thermalBtn: {
    flex: 1,
    height: 42,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  thermalText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  clearBtn: {
    flex: 1,
    height: 42,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.errorContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  clearText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.error,
  },
});
