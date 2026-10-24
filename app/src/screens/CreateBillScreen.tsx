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
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { Header } from '../components/Header';
import { useApp, BillItem, SaleInvoice } from '../context/AppContext';

interface CreateBillScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const CreateBillScreen: React.FC<CreateBillScreenProps> = ({ onBack, onSuccess }) => {
  const {
    inventory,
    customers,
    createBill,
    shareInvoiceWhatsApp,
    store,
    language,
  } = useApp();

  // State
  const [customerType, setCustomerType] = useState<'walkin' | 'khata'>('khata');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');

  const [paymentMode, setPaymentMode] = useState<'upi' | 'cash' | 'udhaar'>('upi');
  const [cashTendered, setCashTendered] = useState<string>('2000');
  const [discountAmount, setDiscountAmount] = useState<number>(40);
  const [taxPercent, setTaxPercent] = useState<number>(5);

  // Cart Items
  const [cartItems, setCartItems] = useState<BillItem[]>([
    { id: '1', name: 'Fortune Sunflower Oil (1L)', price: 145, qty: 2, unit: 'pouch' },
    { id: '2', name: 'Aashirvaad Sharbati Atta (10kg)', price: 480, qty: 1, unit: 'bag' },
    { id: '3', name: 'Tata Tea Premium (500g)', price: 160, qty: 2, unit: 'packet' },
  ]);

  // Modals
  const [catalogModalVisible, setCatalogModalVisible] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [createdInvoice, setCreatedInvoice] = useState<SaleInvoice | null>(null);

  // Cart Qty Modifiers
  const updateQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((it) => (it.id === id ? { ...it, qty: Math.max(0, it.qty + delta) } : it))
        .filter((it) => it.qty > 0)
    );
  };

  const addItemToCart = (item: { id: string; name: string; price: number; unit: string }) => {
    setCartItems((prev) => {
      const existing = prev.find((it) => it.id === item.id);
      if (existing) {
        return prev.map((it) => (it.id === item.id ? { ...it, qty: it.qty + 1 } : it));
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1, unit: item.unit }];
    });
    setCatalogModalVisible(false);
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, it) => sum + it.price * it.qty, 0);
  const calculatedTax = Math.round((subtotal * taxPercent) / 100);
  const finalTotal = Math.max(0, subtotal - discountAmount + calculatedTax);
  const tenderedNum = parseFloat(cashTendered) || 0;
  const changeToReturn = Math.max(0, tenderedNum - finalTotal);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  // Handle Save Bill
  const handleSaveBill = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add at least one item to generate a bill.');
      return;
    }

    const custName =
      customerType === 'khata'
        ? selectedCustomer?.name || 'Khata Customer'
        : walkinName.trim() || 'Walk-in Customer';

    const custPhone =
      customerType === 'khata' ? selectedCustomer?.phone : walkinPhone.trim() || undefined;

    const invoice = createBill({
      customerName: custName,
      customerPhone: custPhone,
      customerType,
      customerId: customerType === 'khata' ? selectedCustomerId : undefined,
      paymentMode,
      items: cartItems,
      discount: discountAmount,
      tax: calculatedTax,
    });

    setCreatedInvoice(invoice);
  };

  const handleFinish = () => {
    setCreatedInvoice(null);
    onSuccess();
  };

  return (
    <View style={styles.container}>
      <Header
        title={language === 'hi' ? 'बिल बनाएं (POS Counter)' : 'Make New Bill (POS)'}
        subtitle="Counter 01 · Quick Checkout"
        showBack={true}
        onBack={onBack}
        rightBadge="Auto-Sync"
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Customer Type Selector */}
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[styles.segmentBtn, customerType === 'khata' && styles.segmentBtnActive]}
            onPress={() => setCustomerType('khata')}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="menu-book"
              size={18}
              color={customerType === 'khata' ? '#FFF' : theme.colors.textMuted}
            />
            <Text
              style={[styles.segmentText, customerType === 'khata' && styles.segmentTextActive]}
            >
              {language === 'hi' ? 'खाता ग्राहक (Khata)' : 'Khata Customer'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, customerType === 'walkin' && styles.segmentBtnActive]}
            onPress={() => setCustomerType('walkin')}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="person-outline"
              size={18}
              color={customerType === 'walkin' ? '#FFF' : theme.colors.textMuted}
            />
            <Text
              style={[styles.segmentText, customerType === 'walkin' && styles.segmentTextActive]}
            >
              {language === 'hi' ? 'नकद ग्राहक (Walk-in)' : 'Walk-in'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Customer Details Box */}
        {customerType === 'khata' ? (
          <View style={styles.customerCard}>
            <Text style={styles.cardHeaderTitle}>
              {language === 'hi' ? 'खाता चुनें (Select Customer):' : 'Select Customer:'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.custChipsScroll}>
              {customers.map((c) => {
                const isSelected = c.id === selectedCustomerId;
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.custChip, isSelected && styles.custChipActive]}
                    onPress={() => setSelectedCustomerId(c.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.custChipName, isSelected && styles.custChipNameActive]}>
                      {c.name}
                    </Text>
                    <Text style={[styles.custChipDue, isSelected && styles.custChipDueActive]}>
                      Due: ₹{c.due.toLocaleString('en-IN')}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        ) : (
          <View style={styles.walkinCard}>
            <View style={styles.inputRow}>
              <MaterialIcons name="person" size={20} color={theme.colors.textMuted} />
              <TextInput
                style={styles.textInput}
                placeholder="Customer Name (optional)"
                placeholderTextColor={theme.colors.textMuted}
                value={walkinName}
                onChangeText={setWalkinName}
              />
            </View>
            <View style={styles.inputRow}>
              <MaterialIcons name="phone" size={20} color={theme.colors.textMuted} />
              <TextInput
                style={styles.textInput}
                placeholder="WhatsApp Phone Number (for receipt)"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="phone-pad"
                value={walkinPhone}
                onChangeText={setWalkinPhone}
              />
            </View>
          </View>
        )}

        {/* Cart Section Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>
            {language === 'hi' ? 'सामान सूची (Items in Cart)' : 'Items in Cart'} ({cartItems.length})
          </Text>
          <TouchableOpacity
            style={styles.addItemBtn}
            onPress={() => setCatalogModalVisible(true)}
            activeOpacity={0.8}
          >
            <MaterialIcons name="add" size={18} color="#FFF" />
            <Text style={styles.addItemBtnText}>+ Add Item</Text>
          </TouchableOpacity>
        </View>

        {/* Cart Item Cards */}
        {cartItems.map((item) => {
          const matchingInv = inventory.find((it) => it.id === item.id || it.name === item.name);
          return (
            <View key={item.id} style={styles.cartCard}>
              <View style={styles.cartTop}>
                <View style={styles.cartInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPriceUnit}>
                    ₹{item.price} / {item.unit}
                  </Text>
                  <Text style={styles.stockBadgeText}>
                    📦 In Stock: {matchingInv ? matchingInv.stock : '-'} (After bill: {matchingInv ? Math.max(0, matchingInv.stock - item.qty) : '-'})
                  </Text>
                </View>
                <Text style={styles.itemTotal}>
                  ₹{(item.price * item.qty).toLocaleString('en-IN')}
                </Text>
              </View>

            <View style={styles.cartControls}>
              <View style={styles.qtyBox}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQty(item.id, -1)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="remove" size={18} color={theme.colors.primary} />
                </TouchableOpacity>
                <Text style={styles.qtyNumber}>{item.qty}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQty(item.id, 1)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="add" size={18} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => updateQty(item.id, -item.qty)}
                style={styles.trashBtn}
              >
                <MaterialIcons name="delete-outline" size={20} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

        {/* Calculation Breakdown */}
        <View style={styles.summaryCard}>
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>Subtotal ({cartItems.length} items):</Text>
            <Text style={styles.calcVal}>₹{subtotal.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>Discount (छूट):</Text>
            <View style={styles.discountInputWrap}>
              <Text style={styles.rupeeSign}>₹</Text>
              <TextInput
                style={styles.discountInput}
                keyboardType="numeric"
                value={String(discountAmount)}
                onChangeText={(t) => setDiscountAmount(parseFloat(t) || 0)}
              />
            </View>
          </View>

          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>GST / Tax ({taxPercent}%):</Text>
            <Text style={styles.calcVal}>+₹{calculatedTax}</Text>
          </View>

          <View style={[styles.calcRow, styles.grandTotalRow]}>
            <Text style={styles.grandTotalLabel}>Grand Total (कुल देय):</Text>
            <Text style={styles.grandTotalVal}>₹{finalTotal.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        {/* Payment Modes */}
        <Text style={styles.sectionTitle}>
          {language === 'hi' ? 'भुगतान प्रकार (Payment Mode):' : 'Payment Mode:'}
        </Text>
        <View style={styles.paymentModesRow}>
          <TouchableOpacity
            style={[styles.payChip, paymentMode === 'upi' && styles.payChipActive]}
            onPress={() => setPaymentMode('upi')}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="qr-code-scanner"
              size={20}
              color={paymentMode === 'upi' ? '#FFF' : theme.colors.primary}
            />
            <Text style={[styles.payChipText, paymentMode === 'upi' && styles.payChipTextActive]}>
              UPI QR
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.payChip, paymentMode === 'cash' && styles.payChipActive]}
            onPress={() => setPaymentMode('cash')}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="payments"
              size={20}
              color={paymentMode === 'cash' ? '#FFF' : theme.colors.primary}
            />
            <Text style={[styles.payChipText, paymentMode === 'cash' && styles.payChipTextActive]}>
              Cash (नकद)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.payChip, paymentMode === 'udhaar' && styles.payChipActive]}
            onPress={() => setPaymentMode('udhaar')}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="schedule"
              size={20}
              color={paymentMode === 'udhaar' ? '#FFF' : theme.colors.primary}
            />
            <Text style={[styles.payChipText, paymentMode === 'udhaar' && styles.payChipTextActive]}>
              Udhaar (खाता)
            </Text>
          </TouchableOpacity>
        </View>

        {/* If Cash, show Cash Calculator */}
        {paymentMode === 'cash' && (
          <View style={styles.cashCalcBox}>
            <Text style={styles.cashCalcTitle}>💵 Cash Change Calculator:</Text>
            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>Cash Received from Customer:</Text>
              <View style={styles.tenderInputWrap}>
                <Text style={styles.rupeeSign}>₹</Text>
                <TextInput
                  style={styles.tenderInput}
                  keyboardType="numeric"
                  value={cashTendered}
                  onChangeText={setCashTendered}
                />
              </View>
            </View>
            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>Change to Return (वापस दें):</Text>
              <Text style={styles.returnCashText}>₹{changeToReturn.toLocaleString('en-IN')}</Text>
            </View>
          </View>
        )}

        {/* Generate Bill CTA */}
        <TouchableOpacity
          style={styles.submitBillBtn}
          onPress={handleSaveBill}
          activeOpacity={0.85}
        >
          <MaterialIcons name="receipt-long" size={24} color="#FFF" />
          <Text style={styles.submitBillText}>
            {language === 'hi'
              ? `₹${finalTotal.toLocaleString('en-IN')} बिल पूरा करें`
              : `Complete Bill · ₹${finalTotal.toLocaleString('en-IN')}`}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Catalog Selector Modal */}
      <Modal
        visible={catalogModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCatalogModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Item from Inventory</Text>
              <TouchableOpacity onPress={() => setCatalogModalVisible(false)} style={styles.closeBtn}>
                <MaterialIcons name="close" size={22} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
              <MaterialIcons name="search" size={20} color={theme.colors.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name, oil, atta, tea..."
                placeholderTextColor={theme.colors.textMuted}
                value={catalogSearch}
                onChangeText={setCatalogSearch}
              />
            </View>

            <ScrollView style={{ maxHeight: 350 }}>
              {inventory
                .filter((it) => it.name.toLowerCase().includes(catalogSearch.toLowerCase()))
                .map((it) => (
                  <TouchableOpacity
                    key={it.id}
                    style={styles.catalogItemRow}
                    onPress={() => addItemToCart(it)}
                    activeOpacity={0.7}
                  >
                    <View>
                      <Text style={styles.catItemName}>{it.name}</Text>
                      <Text style={styles.catItemSub}>
                        Stock: {it.stock} {it.unit}s · {it.category}
                      </Text>
                    </View>
                    <View style={styles.catRight}>
                      <Text style={styles.catPrice}>₹{it.price}</Text>
                      <Text style={styles.catAddPill}>+ Add</Text>
                    </View>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Success Receipt Modal */}
      <Modal
        visible={createdInvoice !== null}
        transparent
        animationType="fade"
        onRequestClose={handleFinish}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.receiptContent}>
            <View style={styles.successCheckWrap}>
              <MaterialIcons name="check-circle" size={48} color={theme.colors.success} />
            </View>

            <Text style={styles.receiptTitle}>Bill #{createdInvoice?.invoiceNumber}</Text>
            <Text style={styles.receiptSub}>Generated & Saved Successfully!</Text>

            <View style={styles.receiptBox}>
              <Text style={styles.storeHeaderName}>{store.name}</Text>
              <Text style={styles.storeHeaderSub}>{store.city}</Text>
              <View style={styles.divider} />

              <View style={styles.receiptMetaRow}>
                <Text style={styles.receiptMeta}>Cust: {createdInvoice?.customerName}</Text>
                <Text style={styles.receiptMeta}>
                  {createdInvoice?.paymentMode.toUpperCase()}
                </Text>
              </View>

              <View style={styles.divider} />

              {createdInvoice?.items.map((it, idx) => (
                <View key={idx} style={styles.receiptItemRow}>
                  <Text style={styles.receiptItemName} numberOfLines={1}>
                    {it.name} x{it.qty}
                  </Text>
                  <Text style={styles.receiptItemPrice}>₹{it.price * it.qty}</Text>
                </View>
              ))}

              <View style={styles.divider} />

              <View style={styles.receiptTotalRow}>
                <Text style={styles.receiptTotalLabel}>Grand Total:</Text>
                <Text style={styles.receiptTotalVal}>
                  ₹{createdInvoice?.total.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>

            {/* Inventory Auto-Updated Confirmation Badge */}
            <View style={styles.stockDeductedCard}>
              <View style={styles.stockDeductedHeader}>
                <MaterialIcons name="inventory-2" size={16} color="#166534" />
                <Text style={styles.stockDeductedTitle}>Inventory Auto-Deducted ✅</Text>
              </View>
              <Text style={styles.stockDeductedSub}>
                Stock automatically updated for {createdInvoice?.items.length} items:
              </Text>
              {createdInvoice?.items.map((it, idx) => {
                const inv = inventory.find((i) => i.id === it.id || i.name === it.name);
                return (
                  <View key={idx} style={styles.stockDeductedItemRow}>
                    <Text style={styles.stockDeductedItemName} numberOfLines={1}>• {it.name}</Text>
                    <Text style={styles.stockDeductedItemQty}>
                      -{it.qty} {it.unit}s {inv !== undefined ? `(Left: ${inv.stock})` : ''}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Receipt Actions */}
            <TouchableOpacity
              style={styles.whatsAppBtn}
              onPress={() => createdInvoice && shareInvoiceWhatsApp(createdInvoice)}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-whatsapp" size={20} color="#FFF" />
              <Text style={styles.whatsAppBtnText}>Send Bill on WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.doneBtn} onPress={handleFinish} activeOpacity={0.8}>
              <Text style={styles.doneBtnText}>Done / Start Next Bill</Text>
            </TouchableOpacity>
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
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.lg,
    padding: 4,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
  },
  segmentBtnActive: {
    backgroundColor: theme.colors.primary,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  segmentTextActive: {
    color: '#FFF',
  },
  customerCard: {
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  cardHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textMuted,
    marginBottom: 8,
  },
  custChipsScroll: {
    flexDirection: 'row',
  },
  custChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceContainerLow,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  custChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  custChipName: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  custChipNameActive: {
    color: '#FFF',
  },
  custChipDue: {
    fontSize: 11,
    color: theme.colors.error,
    fontWeight: '600',
    marginTop: 2,
  },
  custChipDueActive: {
    color: theme.colors.secondaryLight,
  },
  walkinCard: {
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
    gap: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 12,
    gap: 8,
    height: 44,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  addItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    gap: 4,
  },
  addItemBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  cartCard: {
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 8,
  },
  cartTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cartInfo: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  itemPriceUnit: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  cartControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  qtyBtn: {
    padding: 6,
  },
  qtyNumber: {
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  trashBtn: {
    padding: 6,
  },
  summaryCard: {
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginVertical: theme.spacing.lg,
    gap: 8,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calcLabel: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  calcVal: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  discountInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: 6,
    paddingHorizontal: 8,
    height: 32,
  },
  rupeeSign: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginRight: 2,
  },
  discountInput: {
    width: 60,
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
    padding: 0,
  },
  grandTotalRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  grandTotalVal: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  paymentModesRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: theme.spacing.md,
  },
  payChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceWhite,
  },
  payChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  payChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  payChipTextActive: {
    color: '#FFF',
  },
  cashCalcBox: {
    backgroundColor: '#FFFDF9',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderGold,
    marginBottom: theme.spacing.lg,
    gap: 8,
  },
  cashCalcTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  tenderInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    height: 32,
  },
  tenderInput: {
    width: 70,
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
    padding: 0,
  },
  returnCashText: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.success,
  },
  submitBillBtn: {
    backgroundColor: theme.colors.success,
    borderRadius: theme.borderRadius.xl,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: theme.colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    marginTop: theme.spacing.md,
  },
  submitBillText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
  },

  // Modal Styles
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
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  closeBtn: {
    padding: 6,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
    marginBottom: theme.spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  catalogItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  catItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  catItemSub: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  catRight: {
    alignItems: 'flex-end',
  },
  catPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  catAddPill: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.secondary,
    marginTop: 2,
  },

  // Receipt Modal
  receiptContent: {
    backgroundColor: theme.colors.surfaceWhite,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  successCheckWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  receiptTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  receiptSub: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.lg,
  },
  receiptBox: {
    width: '100%',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  storeHeaderName: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    color: theme.colors.primary,
  },
  storeHeaderSub: {
    fontSize: 11,
    textAlign: 'center',
    color: theme.colors.textMuted,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 8,
  },
  receiptMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  receiptMeta: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  receiptItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  receiptItemName: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  receiptItemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  receiptTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  receiptTotalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  receiptTotalVal: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  whatsAppBtn: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    marginBottom: 8,
  },
  whatsAppBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  doneBtn: {
    backgroundColor: theme.colors.primary,
    width: '100%',
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  stockBadgeText: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '600',
    marginTop: 3,
  },
  stockDeductedCard: {
    width: '100%',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  stockDeductedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  stockDeductedTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#166534',
  },
  stockDeductedSub: {
    fontSize: 11,
    color: '#15803D',
    marginBottom: 6,
  },
  stockDeductedItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  stockDeductedItemName: {
    fontSize: 11,
    color: '#14532D',
    flex: 1,
  },
  stockDeductedItemQty: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
  },
});
