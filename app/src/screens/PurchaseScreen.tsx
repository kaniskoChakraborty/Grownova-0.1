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
import { useApp, PurchaseBill } from '../context/AppContext';

export const PurchaseScreen: React.FC = () => {
  const {
    suppliers,
    purchaseBills,
    addPurchaseBill,
    paySupplierBill,
    language,
  } = useApp();

  const [addBillModalVisible, setAddBillModalVisible] = useState(false);
  const [selectedBillToPay, setSelectedBillToPay] = useState<PurchaseBill | null>(null);

  // New Purchase Form
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [itemsDesc, setItemsDesc] = useState('');
  const [dueDate, setDueDate] = useState('In 7 days');

  // Pay Form
  const [payAmount, setPayAmount] = useState('');
  const [payMode, setPayMode] = useState<'cash' | 'upi'>('upi');

  const totalDues = suppliers.reduce((sum, s) => sum + s.dues, 0);
  const overdueCount = purchaseBills.filter((b) => b.status === 'overdue').length;

  const handleCreateBill = () => {
    if (!amount.trim() || !itemsDesc.trim()) {
      Alert.alert('Required Fields', 'Please enter bill amount and items description.');
      return;
    }

    addPurchaseBill({
      supplierId,
      amount: parseFloat(amount) || 0,
      itemsDescription: itemsDesc.trim(),
      dueDate,
    });

    setAmount('');
    setItemsDesc('');
    setAddBillModalVisible(false);
    Alert.alert('✅ Inward Bill Logged', 'Supplier ledger updated and inward purchase recorded.');
  };

  const handlePayBill = () => {
    if (!selectedBillToPay || !payAmount.trim()) {
      Alert.alert('Required', 'Please enter payment amount.');
      return;
    }

    paySupplierBill(selectedBillToPay.id, parseFloat(payAmount) || 0, payMode);
    setPayAmount('');
    setSelectedBillToPay(null);
  };

  return (
    <View style={styles.container}>
      <Header
        title={language === 'hi' ? 'खरीद व सप्लायर (Purchase & Suppliers)' : 'Purchase & Suppliers'}
        subtitle="Inward Stock & Supplier Khata"
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Payable Header Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.summaryLabel}>Total Payable to Suppliers</Text>
              <Text style={styles.summaryAmount}>₹{totalDues.toLocaleString('en-IN')}</Text>
            </View>
            <TouchableOpacity
              style={styles.addBillBtn}
              onPress={() => setAddBillModalVisible(true)}
              activeOpacity={0.8}
            >
              <MaterialIcons name="add" size={20} color="#FFF" />
              <Text style={styles.addBillBtnText}>+ Inward Bill</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.summarySub}>
            {suppliers.length} active suppliers · {overdueCount} bills overdue
          </Text>
        </View>

        {/* Overdue Warning Pill */}
        {overdueCount > 0 && (
          <View style={styles.warningPill}>
            <MaterialIcons name="error-outline" size={18} color={theme.colors.error} />
            <Text style={styles.warningPillText}>
              {overdueCount} supplier payments are overdue. Clear soon to avoid supply disruption.
            </Text>
          </View>
        )}

        {/* Suppliers Dues Directory */}
        <Text style={styles.sectionTitle}>Supplier Balances ({suppliers.length})</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suppliersScroll}>
          {suppliers.map((s) => (
            <View key={s.id} style={styles.supplierPillCard}>
              <Text style={styles.supplierName} numberOfLines={1}>
                {s.name}
              </Text>
              <Text style={styles.supplierCity}>{s.city}</Text>
              <Text
                style={[
                  styles.supplierDuesText,
                  s.dues > 0 ? { color: theme.colors.error } : { color: theme.colors.success },
                ]}
              >
                {s.dues > 0 ? `Due: ₹${s.dues.toLocaleString('en-IN')}` : 'Cleared'}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Inward Bills List */}
        <Text style={styles.sectionTitle}>Inward Stock Invoices ({purchaseBills.length})</Text>

        {purchaseBills.map((bill) => (
          <View key={bill.id} style={styles.billCard}>
            <View style={styles.billTop}>
              <View style={styles.billLeft}>
                <View
                  style={[
                    styles.billIconCircle,
                    {
                      backgroundColor:
                        bill.status === 'paid'
                          ? theme.colors.successBg
                          : bill.status === 'overdue'
                          ? theme.colors.errorBg
                          : theme.colors.warningBg,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="local-shipping"
                    size={20}
                    color={
                      bill.status === 'paid'
                        ? theme.colors.success
                        : bill.status === 'overdue'
                        ? theme.colors.error
                        : theme.colors.warning
                    }
                  />
                </View>
                <View>
                  <Text style={styles.billSupplierName}>{bill.supplierName}</Text>
                  <Text style={styles.billItemsDesc}>{bill.itemsDescription}</Text>
                  <Text style={styles.billDate}>
                    Dated: {bill.date} · Due: {bill.dueDate}
                  </Text>
                </View>
              </View>

              <View style={styles.billRight}>
                <Text style={styles.billAmount}>₹{bill.amount.toLocaleString('en-IN')}</Text>
                <View
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor:
                        bill.status === 'paid'
                          ? theme.colors.successBg
                          : bill.status === 'overdue'
                          ? theme.colors.errorBg
                          : theme.colors.warningBg,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      {
                        color:
                          bill.status === 'paid'
                            ? theme.colors.success
                            : bill.status === 'overdue'
                            ? theme.colors.error
                            : theme.colors.warning,
                      },
                    ]}
                  >
                    {bill.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>

            {bill.status !== 'paid' && (
              <View style={styles.billActionRow}>
                <TouchableOpacity
                  style={styles.payBtn}
                  onPress={() => {
                    setSelectedBillToPay(bill);
                    setPayAmount(String(bill.amount));
                  }}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="payment" size={16} color="#FFF" />
                  <Text style={styles.payBtnText}>Pay Supplier (भुगतान करें)</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Inward Bill Modal */}
      <Modal
        visible={addBillModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddBillModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>+ Inward Purchase Bill (नया माल)</Text>
              <TouchableOpacity
                onPress={() => setAddBillModalVisible(false)}
                style={styles.closeBtn}
              >
                <MaterialIcons name="close" size={24} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Select Supplier (सप्लायर चुनें):</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              {suppliers.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.supSelectChip, supplierId === s.id && styles.supSelectChipActive]}
                  onPress={() => setSupplierId(s.id)}
                >
                  <Text
                    style={[
                      styles.supSelectText,
                      supplierId === s.id && styles.supSelectTextActive,
                    ]}
                  >
                    {s.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.inputLabel}>Bill Amount (कुल बिल राशि):</Text>
            <TextInput
              style={styles.formInput}
              placeholder="₹ 15000"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <Text style={styles.inputLabel}>Items Description (माल का विवरण):</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g. 50 bags Basmati Rice, 20 tins oil"
              placeholderTextColor={theme.colors.textMuted}
              value={itemsDesc}
              onChangeText={setItemsDesc}
            />

            <Text style={styles.inputLabel}>Payment Due Date (देय तिथि):</Text>
            <TextInput
              style={styles.formInput}
              placeholder="In 7 days / In 15 days"
              placeholderTextColor={theme.colors.textMuted}
              value={dueDate}
              onChangeText={setDueDate}
            />

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleCreateBill}
              activeOpacity={0.85}
            >
              <MaterialIcons name="check" size={20} color="#FFF" />
              <Text style={styles.submitBtnText}>Record Inward Purchase</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Pay Supplier Modal */}
      <Modal
        visible={selectedBillToPay !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedBillToPay(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Pay Supplier Bill</Text>
                <Text style={styles.modalSub}>{selectedBillToPay?.supplierName}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedBillToPay(null)}
                style={styles.closeBtn}
              >
                <MaterialIcons name="close" size={24} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Payment Amount:</Text>
            <TextInput
              style={styles.formInput}
              keyboardType="numeric"
              value={payAmount}
              onChangeText={setPayAmount}
            />

            <Text style={styles.inputLabel}>Payment Method:</Text>
            <View style={styles.modeToggleRow}>
              <TouchableOpacity
                style={[styles.modeToggleBtn, payMode === 'upi' && styles.modeToggleBtnActive]}
                onPress={() => setPayMode('upi')}
              >
                <Text
                  style={[styles.modeToggleText, payMode === 'upi' && styles.modeToggleTextActive]}
                >
                  Bank UPI / RTGS
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modeToggleBtn, payMode === 'cash' && styles.modeToggleBtnActive]}
                onPress={() => setPayMode('cash')}
              >
                <Text
                  style={[styles.modeToggleText, payMode === 'cash' && styles.modeToggleTextActive]}
                >
                  Shop Cash
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handlePayBill}
              activeOpacity={0.85}
            >
              <MaterialIcons name="check-circle" size={20} color="#FFF" />
              <Text style={styles.submitBtnText}>Confirm Supplier Payment</Text>
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
  summaryCard: {
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderGold,
    marginBottom: theme.spacing.md,
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
  addBillBtn: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
  },
  addBillBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  warningPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.errorBg,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    gap: 8,
    marginBottom: theme.spacing.lg,
  },
  warningPillText: {
    fontSize: 12,
    color: theme.colors.error,
    fontWeight: '600',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  suppliersScroll: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  supplierPillCard: {
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: 130,
  },
  supplierName: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  supplierCity: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  supplierDuesText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
  },
  billCard: {
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 8,
  },
  billTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  billLeft: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    flex: 1,
    marginRight: 8,
  },
  billIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  billSupplierName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  billItemsDesc: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  billDate: {
    fontSize: 11,
    color: theme.colors.secondary,
    fontWeight: '500',
    marginTop: 2,
  },
  billRight: {
    alignItems: 'flex-end',
  },
  billAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '800',
  },
  billActionRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: 8,
  },
  payBtn: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.md,
  },
  payBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
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
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  modalSub: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
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
  supSelectChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceContainerLow,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  supSelectChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  supSelectText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  supSelectTextActive: {
    color: '#FFF',
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
  modeToggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: theme.spacing.lg,
  },
  modeToggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceContainerLow,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modeToggleBtnActive: {
    backgroundColor: theme.colors.primary,
  },
  modeToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  modeToggleTextActive: {
    color: '#FFF',
  },
  submitBtn: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    marginTop: 6,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
