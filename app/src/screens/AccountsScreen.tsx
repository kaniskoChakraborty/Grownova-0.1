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
import { useApp, Customer } from '../context/AppContext';

export const AccountsScreen: React.FC = () => {
  const {
    customers,
    cashflow,
    todayUdhaar,
    todayCash,
    addCustomer,
    recordCustomerPayment,
    recordExpense,
    sendWhatsAppReminder,
    language,
  } = useApp();

  const [tab, setTab] = useState<'khata' | 'cashflow'>('khata');
  const [search, setSearch] = useState('');

  // Selected Customer for Payment Modal
  const [selectedCust, setSelectedCust] = useState<Customer | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi'>('upi');

  // Add Customer Modal
  const [addCustModalVisible, setAddCustModalVisible] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustLimit, setNewCustLimit] = useState('10000');

  // Add Expense Modal
  const [addExpenseModalVisible, setAddExpenseModalVisible] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseMode, setExpenseMode] = useState<'cash' | 'upi'>('cash');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const handleRecordPayment = () => {
    if (!selectedCust || !paymentAmount.trim()) {
      Alert.alert('Required', 'Please enter payment amount.');
      return;
    }
    const amt = parseFloat(paymentAmount) || 0;
    recordCustomerPayment(selectedCust.id, amt, paymentMode);
    setPaymentAmount('');
    setSelectedCust(null);
  };

  const handleCreateCustomer = () => {
    if (!newCustName.trim() || !newCustPhone.trim()) {
      Alert.alert('Required', 'Please enter customer name and phone number.');
      return;
    }
    addCustomer({
      name: newCustName.trim(),
      phone: newCustPhone.trim(),
      limit: parseFloat(newCustLimit) || 10000,
    });
    setNewCustName('');
    setNewCustPhone('');
    setAddCustModalVisible(false);
    Alert.alert('✅ Customer Added', `${newCustName} added to Khata directory.`);
  };

  const handleAddExpense = () => {
    if (!expenseAmount.trim() || !expenseDesc.trim()) {
      Alert.alert('Required', 'Please enter expense description and amount.');
      return;
    }
    recordExpense(parseFloat(expenseAmount) || 0, expenseDesc.trim(), expenseMode);
    setExpenseAmount('');
    setExpenseDesc('');
    setAddExpenseModalVisible(false);
    Alert.alert('✅ Expense Logged', `Recorded ₹${expenseAmount} expense for ${expenseDesc}.`);
  };

  return (
    <View style={styles.container}>
      <Header
        title={language === 'hi' ? 'रोकड़ व खाता (Accounts & Money)' : 'Accounts & Daily Cashflow'}
        subtitle="Customer Ledgers & Cash Register"
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* KPI Dual Summary Card */}
        <View style={styles.summaryDualRow}>
          <View style={[styles.dualCard, { borderColor: theme.colors.borderGold }]}>
            <Text style={styles.dualLabel}>
              {language === 'hi' ? 'गल्ला (Cash in Hand)' : 'Cash in Hand'}
            </Text>
            <Text style={styles.dualAmountCash}>₹{todayCash.toLocaleString('en-IN')}</Text>
            <Text style={styles.dualSub}>Active drawer balance</Text>
          </View>

          <View style={[styles.dualCard, { borderColor: 'rgba(186, 26, 26, 0.2)' }]}>
            <Text style={styles.dualLabel}>
              {language === 'hi' ? 'कुल उधारी (Customer Udhaar)' : 'Total Udhaar Due'}
            </Text>
            <Text style={styles.dualAmountUdhaar}>₹{todayUdhaar.toLocaleString('en-IN')}</Text>
            <Text style={styles.dualSub}>{customers.filter((c) => c.due > 0).length} parties pending</Text>
          </View>
        </View>

        {/* Segment Tabs: Khata vs Cashflow */}
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[styles.segmentBtn, tab === 'khata' && styles.segmentBtnActive]}
            onPress={() => setTab('khata')}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="menu-book"
              size={18}
              color={tab === 'khata' ? '#FFF' : theme.colors.textMuted}
            />
            <Text style={[styles.segmentText, tab === 'khata' && styles.segmentTextActive]}>
              Customer Khata ({customers.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, tab === 'cashflow' && styles.segmentBtnActive]}
            onPress={() => setTab('cashflow')}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="receipt-long"
              size={18}
              color={tab === 'cashflow' ? '#FFF' : theme.colors.textMuted}
            />
            <Text style={[styles.segmentText, tab === 'cashflow' && styles.segmentTextActive]}>
              Cash Register ({cashflow.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* TAB 1: CUSTOMER KHATA */}
        {tab === 'khata' ? (
          <>
            <View style={styles.searchAndAddRow}>
              <View style={styles.searchBar}>
                <MaterialIcons name="search" size={20} color={theme.colors.textMuted} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search customer name or phone..."
                  placeholderTextColor={theme.colors.textMuted}
                  value={search}
                  onChangeText={setSearch}
                />
              </View>

              <TouchableOpacity
                style={styles.addCustomerBtn}
                onPress={() => setAddCustModalVisible(true)}
                activeOpacity={0.8}
              >
                <MaterialIcons name="person-add" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            {filteredCustomers.map((cust) => (
              <View key={cust.id} style={styles.customerCard}>
                <View style={styles.custTop}>
                  <View style={styles.custLeft}>
                    <View style={styles.custAvatar}>
                      <Text style={styles.custInitial}>{cust.name.charAt(0)}</Text>
                    </View>
                    <View>
                      <Text style={styles.custName}>{cust.name}</Text>
                      <Text style={styles.custPhone}>
                        {cust.phone} · Limit: ₹{cust.limit.toLocaleString('en-IN')}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.custRight}>
                    <Text style={[styles.dueAmount, cust.due > 0 && { color: theme.colors.error }]}>
                      ₹{cust.due.toLocaleString('en-IN')}
                    </Text>
                    <View
                      style={[
                        styles.statusPill,
                        {
                          backgroundColor:
                            cust.due === 0 ? theme.colors.successBg : theme.colors.errorBg,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusPillText,
                          {
                            color: cust.due === 0 ? theme.colors.success : theme.colors.error,
                          },
                        ]}
                      >
                        {cust.due === 0 ? 'CLEARED' : 'PENDING'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Customer Action Buttons */}
                <View style={styles.custActionsRow}>
                  <TouchableOpacity
                    style={styles.payActionBtn}
                    onPress={() => setSelectedCust(cust)}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons name="add" size={16} color={theme.colors.primary} />
                    <Text style={styles.payActionText}>रुपये प्राप्त (Record Pay)</Text>
                  </TouchableOpacity>

                  {cust.due > 0 && (
                    <TouchableOpacity
                      style={styles.reminderBtn}
                      onPress={() => sendWhatsAppReminder(cust)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="logo-whatsapp" size={15} color="#FFF" />
                      <Text style={styles.reminderBtnText}>Remind</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </>
        ) : (
          /* TAB 2: CASHFLOW REGISTER */
          <>
            <View style={styles.expenseActionRow}>
              <Text style={styles.registerTitle}>Today's Register Logs</Text>
              <TouchableOpacity
                style={styles.addExpenseBtn}
                onPress={() => setAddExpenseModalVisible(true)}
                activeOpacity={0.8}
              >
                <MaterialIcons name="remove-circle-outline" size={16} color="#FFF" />
                <Text style={styles.addExpenseBtnText}>+ Log Expense</Text>
              </TouchableOpacity>
            </View>

            {cashflow.map((entry) => (
              <View key={entry.id} style={styles.cashflowCard}>
                <View style={styles.cfLeft}>
                  <View
                    style={[
                      styles.cfIcon,
                      {
                        backgroundColor:
                          entry.type === 'in' ? theme.colors.successBg : theme.colors.errorBg,
                      },
                    ]}
                  >
                    <MaterialIcons
                      name={entry.type === 'in' ? 'arrow-downward' : 'arrow-upward'}
                      size={18}
                      color={entry.type === 'in' ? theme.colors.success : theme.colors.error}
                    />
                  </View>
                  <View>
                    <Text style={styles.cfDesc}>{entry.description}</Text>
                    <Text style={styles.cfTime}>
                      {entry.mode.toUpperCase()} · {entry.time}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.cfAmount,
                    {
                      color: entry.type === 'in' ? theme.colors.success : theme.colors.error,
                    },
                  ]}
                >
                  {entry.type === 'in' ? '+' : '-'}₹{entry.amount.toLocaleString('en-IN')}
                </Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Record Payment Modal */}
      <Modal
        visible={selectedCust !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedCust(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Record Payment (खाता जमा)</Text>
                <Text style={styles.modalSub}>
                  {selectedCust?.name} · Current Due: ₹{selectedCust?.due.toLocaleString('en-IN')}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedCust(null)} style={styles.closeBtn}>
                <MaterialIcons name="close" size={24} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Amount Received (प्राप्त राशि):</Text>
            <View style={styles.amountInputRow}>
              <Text style={styles.rupeeSignBig}>₹</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="numeric"
                value={paymentAmount}
                onChangeText={setPaymentAmount}
                autoFocus
              />
            </View>

            {/* Quick Amount Suggestion Chips */}
            <View style={styles.quickAmtsRow}>
              {[500, 1000, 2000, selectedCust?.due || 0].map((amt, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.amtChip}
                  onPress={() => setPaymentAmount(String(amt))}
                >
                  <Text style={styles.amtChipText}>₹{amt}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Payment Mode Selection */}
            <Text style={styles.inputLabel}>Received via:</Text>
            <View style={styles.modeToggleRow}>
              <TouchableOpacity
                style={[styles.modeToggleBtn, paymentMode === 'upi' && styles.modeToggleBtnActive]}
                onPress={() => setPaymentMode('upi')}
              >
                <Text
                  style={[
                    styles.modeToggleText,
                    paymentMode === 'upi' && styles.modeToggleTextActive,
                  ]}
                >
                  UPI (GPay / PhonePe)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modeToggleBtn, paymentMode === 'cash' && styles.modeToggleBtnActive]}
                onPress={() => setPaymentMode('cash')}
              >
                <Text
                  style={[
                    styles.modeToggleText,
                    paymentMode === 'cash' && styles.modeToggleTextActive,
                  ]}
                >
                  Cash (नकद)
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.confirmPayBtn}
              onPress={handleRecordPayment}
              activeOpacity={0.85}
            >
              <MaterialIcons name="check-circle" size={20} color="#FFF" />
              <Text style={styles.confirmPayText}>Confirm Payment & Update Khata</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Customer Modal */}
      <Modal
        visible={addCustModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddCustModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>+ New Customer (नया ग्राहक)</Text>
              <TouchableOpacity
                onPress={() => setAddCustModalVisible(false)}
                style={styles.closeBtn}
              >
                <MaterialIcons name="close" size={24} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Customer Name (नाम):</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g. Ramesh Patil"
              placeholderTextColor={theme.colors.textMuted}
              value={newCustName}
              onChangeText={setNewCustName}
            />

            <Text style={styles.inputLabel}>Mobile Phone (फ़ोन):</Text>
            <TextInput
              style={styles.formInput}
              placeholder="98230-00000"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="phone-pad"
              value={newCustPhone}
              onChangeText={setNewCustPhone}
            />

            <Text style={styles.inputLabel}>Credit Limit (उधारी सीमा):</Text>
            <TextInput
              style={styles.formInput}
              placeholder="10000"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="numeric"
              value={newCustLimit}
              onChangeText={setNewCustLimit}
            />

            <TouchableOpacity
              style={styles.confirmPayBtn}
              onPress={handleCreateCustomer}
              activeOpacity={0.85}
            >
              <MaterialIcons name="person-add" size={20} color="#FFF" />
              <Text style={styles.confirmPayText}>Add Customer to Khata</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Expense Modal */}
      <Modal
        visible={addExpenseModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddExpenseModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log Shop Expense (दुकान खर्च)</Text>
              <TouchableOpacity
                onPress={() => setAddExpenseModalVisible(false)}
                style={styles.closeBtn}
              >
                <MaterialIcons name="close" size={24} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Expense Description (खर्च का विवरण):</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g. Chai, Loading labor, electricity"
              placeholderTextColor={theme.colors.textMuted}
              value={expenseDesc}
              onChangeText={setExpenseDesc}
            />

            <Text style={styles.inputLabel}>Amount (राशि):</Text>
            <TextInput
              style={styles.formInput}
              placeholder="₹ 200"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="numeric"
              value={expenseAmount}
              onChangeText={setExpenseAmount}
            />

            <Text style={styles.inputLabel}>Paid via:</Text>
            <View style={styles.modeToggleRow}>
              <TouchableOpacity
                style={[styles.modeToggleBtn, expenseMode === 'cash' && styles.modeToggleBtnActive]}
                onPress={() => setExpenseMode('cash')}
              >
                <Text
                  style={[
                    styles.modeToggleText,
                    expenseMode === 'cash' && styles.modeToggleTextActive,
                  ]}
                >
                  Cash (गल्ले से)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modeToggleBtn, expenseMode === 'upi' && styles.modeToggleBtnActive]}
                onPress={() => setExpenseMode('upi')}
              >
                <Text
                  style={[
                    styles.modeToggleText,
                    expenseMode === 'upi' && styles.modeToggleTextActive,
                  ]}
                >
                  UPI (ऑनलाइन)
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.confirmPayBtn, { backgroundColor: theme.colors.error }]}
              onPress={handleAddExpense}
              activeOpacity={0.85}
            >
              <MaterialIcons name="check" size={20} color="#FFF" />
              <Text style={styles.confirmPayText}>Log Outflow in Cash Register</Text>
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
  summaryDualRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: theme.spacing.lg,
  },
  dualCard: {
    flex: 1,
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
  },
  dualLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  dualAmountCash: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.primary,
    marginVertical: 4,
  },
  dualAmountUdhaar: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.error,
    marginVertical: 4,
  },
  dualSub: {
    fontSize: 10,
    color: theme.colors.textMuted,
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
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  segmentTextActive: {
    color: '#FFF',
  },
  searchAndAddRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: theme.spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  addCustomerBtn: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerCard: {
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 8,
  },
  custTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  custLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  custAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  custInitial: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  custName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  custPhone: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  custRight: {
    alignItems: 'flex-end',
  },
  dueAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '800',
  },
  custActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: 8,
  },
  payActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: theme.colors.surfaceContainerLow,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.md,
  },
  payActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  reminderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#25D366',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.md,
  },
  reminderBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  expenseActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  registerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  addExpenseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
  },
  addExpenseBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  cashflowCard: {
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 8,
  },
  cfLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  cfIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cfDesc: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  cfTime: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  cfAmount: {
    fontSize: 15,
    fontWeight: '800',
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
    marginBottom: theme.spacing.lg,
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
    marginBottom: 6,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 14,
    height: 56,
    marginBottom: theme.spacing.md,
  },
  rupeeSignBig: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.primary,
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  quickAmtsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: theme.spacing.lg,
  },
  amtChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceContainerLow,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  amtChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  modeToggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: theme.spacing.xl,
  },
  modeToggleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceContainerLow,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modeToggleBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  modeToggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  modeToggleTextActive: {
    color: '#FFF',
  },
  confirmPayBtn: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: theme.borderRadius.md,
  },
  confirmPayText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
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
});
