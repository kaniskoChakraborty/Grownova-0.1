import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { Header } from '../components/Header';
import { useApp, SaleInvoice } from '../context/AppContext';

interface SalesScreenProps {
  onNavigateToBill: () => void;
}

export const SalesScreen: React.FC<SalesScreenProps> = ({ onNavigateToBill }) => {
  const { sales, todaySales, shareInvoiceWhatsApp, language } = useApp();
  const [filter, setFilter] = useState<'all' | 'upi' | 'cash' | 'udhaar'>('all');
  const [search, setSearch] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<SaleInvoice | null>(null);

  const filteredSales = sales.filter((s) => {
    const matchesFilter = filter === 'all' || s.paymentMode === filter;
    const matchesSearch =
      s.customerName.toLowerCase().includes(search.toLowerCase()) ||
      s.invoiceNumber.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <Header
        title={language === 'hi' ? 'बिक्री खाता (Sales Register)' : 'Sales Register'}
        subtitle="All Customer Invoices & Receipts"
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Sales KPI Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.summaryLabel}>
                {language === 'hi' ? 'कुल बिक्री (Today)' : "Total Today's Sales"}
              </Text>
              <Text style={styles.summaryAmount}>₹{todaySales.toLocaleString('en-IN')}</Text>
            </View>
            <TouchableOpacity
              style={styles.newBillBtn}
              onPress={onNavigateToBill}
              activeOpacity={0.8}
            >
              <MaterialIcons name="add" size={20} color="#FFF" />
              <Text style={styles.newBillBtnText}>+ New Bill</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.summarySub}>
            {sales.length} invoices generated · Auto-synced with Cloud
          </Text>
        </View>

        {/* Filter Chips */}
        <View style={styles.filterRow}>
          {(['all', 'upi', 'cash', 'udhaar'] as const).map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.filterChip, filter === m && styles.filterChipActive]}
              onPress={() => setFilter(m)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterText, filter === m && styles.filterTextActive]}>
                {m === 'all'
                  ? 'All'
                  : m === 'upi'
                  ? 'UPI QR'
                  : m === 'cash'
                  ? 'Cash'
                  : 'Udhaar'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search Input */}
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color={theme.colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by customer name or GN-1044..."
            placeholderTextColor={theme.colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Invoices List */}
        <Text style={styles.listHeader}>Invoices ({filteredSales.length})</Text>

        {filteredSales.map((sale) => (
          <TouchableOpacity
            key={sale.id}
            style={styles.invoiceCard}
            onPress={() => setSelectedInvoice(sale)}
            activeOpacity={0.7}
          >
            <View style={styles.invoiceTop}>
              <View style={styles.invoiceLeft}>
                <View
                  style={[
                    styles.modeIconCircle,
                    {
                      backgroundColor:
                        sale.paymentMode === 'upi'
                          ? theme.colors.secondaryLight
                          : sale.paymentMode === 'cash'
                          ? theme.colors.successBg
                          : theme.colors.errorBg,
                    },
                  ]}
                >
                  <MaterialIcons
                    name={
                      sale.paymentMode === 'upi'
                        ? 'qr-code-scanner'
                        : sale.paymentMode === 'cash'
                        ? 'payments'
                        : 'schedule'
                    }
                    size={20}
                    color={
                      sale.paymentMode === 'upi'
                        ? theme.colors.secondary
                        : sale.paymentMode === 'cash'
                        ? theme.colors.success
                        : theme.colors.error
                    }
                  />
                </View>
                <View>
                  <Text style={styles.customerName}>{sale.customerName}</Text>
                  <Text style={styles.invoiceMeta}>
                    #{sale.invoiceNumber} · {sale.items.length} items · {sale.timeAgo}
                  </Text>
                </View>
              </View>

              <View style={styles.invoiceRight}>
                <Text style={styles.invoiceAmount}>₹{sale.total.toLocaleString('en-IN')}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        sale.paymentMode === 'udhaar' ? theme.colors.errorBg : theme.colors.successBg,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      {
                        color:
                          sale.paymentMode === 'udhaar' ? theme.colors.error : theme.colors.success,
                      },
                    ]}
                  >
                    {sale.paymentMode.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.itemsPreviewRow}>
              <Text style={styles.itemsPreviewText} numberOfLines={1}>
                {sale.items.map((i) => `${i.name} (x${i.qty})`).join(', ')}
              </Text>
              <MaterialIcons name="chevron-right" size={20} color={theme.colors.textMuted} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Invoice Details Modal */}
      <Modal
        visible={selectedInvoice !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedInvoice(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Invoice #{selectedInvoice?.invoiceNumber}</Text>
                <Text style={styles.modalDate}>
                  {selectedInvoice &&
                    new Date(selectedInvoice.createdAt).toLocaleString('en-IN')}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedInvoice(null)} style={styles.closeBtn}>
                <MaterialIcons name="close" size={24} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Customer & Payment Badge */}
            <View style={styles.modalCustRow}>
              <View>
                <Text style={styles.modalCustLabel}>Customer:</Text>
                <Text style={styles.modalCustName}>{selectedInvoice?.customerName}</Text>
                {selectedInvoice?.customerPhone && (
                  <Text style={styles.modalCustPhone}>{selectedInvoice.customerPhone}</Text>
                )}
              </View>
              <View style={styles.modalModePill}>
                <Text style={styles.modalModeText}>
                  {selectedInvoice?.paymentMode.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Items Breakdown */}
            <Text style={styles.modalSectionLabel}>Purchased Items:</Text>
            <ScrollView style={{ maxHeight: 200 }}>
              {selectedInvoice?.items.map((it, idx) => (
                <View key={idx} style={styles.modalItemRow}>
                  <Text style={styles.modalItemName}>
                    {it.name} <Text style={{ color: theme.colors.textMuted }}>x{it.qty}</Text>
                  </Text>
                  <Text style={styles.modalItemTotal}>
                    ₹{(it.price * it.qty).toLocaleString('en-IN')}
                  </Text>
                </View>
              ))}
            </ScrollView>

            {/* Subtotal, Tax, Discount */}
            <View style={styles.modalSummaryBox}>
              <View style={styles.modalSummaryRow}>
                <Text style={styles.modalSummaryLabel}>Subtotal:</Text>
                <Text style={styles.modalSummaryVal}>
                  ₹{selectedInvoice?.subtotal.toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={styles.modalSummaryRow}>
                <Text style={styles.modalSummaryLabel}>Discount:</Text>
                <Text style={styles.modalSummaryVal}>-₹{selectedInvoice?.discount}</Text>
              </View>
              <View style={styles.modalSummaryRow}>
                <Text style={styles.modalSummaryLabel}>Tax (GST):</Text>
                <Text style={styles.modalSummaryVal}>+₹{selectedInvoice?.tax}</Text>
              </View>
              <View style={[styles.modalSummaryRow, styles.modalGrandTotalRow]}>
                <Text style={styles.modalGrandTotalLabel}>Total Paid:</Text>
                <Text style={styles.modalGrandTotalVal}>
                  ₹{selectedInvoice?.total.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>

            {/* WhatsApp Share CTA */}
            <TouchableOpacity
              style={styles.shareWhatsAppBtn}
              onPress={() => selectedInvoice && shareInvoiceWhatsApp(selectedInvoice)}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-whatsapp" size={20} color="#FFF" />
              <Text style={styles.shareWhatsAppText}>Share Receipt on WhatsApp</Text>
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
  newBillBtn: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
  },
  newBillBtnText: {
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
  listHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  invoiceCard: {
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 8,
  },
  invoiceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  invoiceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  modeIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  invoiceMeta: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  invoiceRight: {
    alignItems: 'flex-end',
  },
  invoiceAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  itemsPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  itemsPreviewText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    flex: 1,
    marginRight: 8,
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
  modalDate: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  modalCustRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  modalCustLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  modalCustName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  modalCustPhone: {
    fontSize: 12,
    color: theme.colors.secondary,
  },
  modalModePill: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  modalModeText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  modalSectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textMuted,
    marginBottom: 8,
  },
  modalItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalItemName: {
    fontSize: 13,
    color: theme.colors.textPrimary,
  },
  modalItemTotal: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  modalSummaryBox: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    gap: 4,
  },
  modalSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalSummaryLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  modalSummaryVal: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  modalGrandTotalRow: {
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: 4,
  },
  modalGrandTotalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  modalGrandTotalVal: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  shareWhatsAppBtn: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
  },
  shareWhatsAppText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
