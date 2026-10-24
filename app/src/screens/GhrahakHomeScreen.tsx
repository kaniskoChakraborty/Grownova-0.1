import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  Alert,
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { useApp, InventoryItem, BillItem } from '../context/AppContext';

interface GhrahakHomeScreenProps {
  onSwitchToMerchant: () => void;
}

export const GhrahakHomeScreen: React.FC<GhrahakHomeScreenProps> = ({
  onSwitchToMerchant,
}) => {
  const {
    store,
    language,
    toggleLanguage,
    activeCustomer,
    setActiveCustomerId,
    customers,
    inventory,
    sales,
    customerCart,
    addToCustomerCart,
    updateCustomerCartQty,
    clearCustomerCart,
    sendParchiOrder,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [parchiNote, setParchiNote] = useState('');
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [upiPayModalVisible, setUpiPayModalVisible] = useState(false);
  const [customerPickerVisible, setCustomerPickerVisible] = useState(false);
  const [billsModalVisible, setBillsModalVisible] = useState(false);

  // Filter products
  const filteredProducts = inventory.filter((item) => {
    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const cartTotal = customerCart.reduce((sum, it) => sum + it.price * it.qty, 0);
  const cartItemCount = customerCart.reduce((sum, it) => sum + it.qty, 0);

  // Invoices for this customer
  const myInvoices = sales.filter(
    (s) =>
      (s.customerId && s.customerId === activeCustomer.id) ||
      s.customerName.toLowerCase().includes(activeCustomer.name.toLowerCase())
  );

  const categories = [
    'All',
    'Edible Oils',
    'Flour & Grains',
    'Pulses',
    'Pantry Staples',
    'Beverages',
    'Spices',
  ];

  return (
    <View style={styles.container}>
      {/* Ghrahak Brand Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.brandContainer}>
          <View style={styles.brandIconWrap}>
            <MaterialIcons name="shopping-bag" size={20} color={theme.colors.secondary} />
          </View>
          <View>
            <View style={styles.brandTitleRow}>
              <Text style={styles.brandTitle}>Ghrahak</Text>
              <View style={styles.hindiBadge}>
                <Text style={styles.hindiBadgeText}>ग्राहक</Text>
              </View>
            </View>
            <Text style={styles.storeTagline}>
              {store.name} · Pune Mandi
            </Text>
          </View>
        </View>

        {/* Right Action Icons: Language & Switch to Vyapar */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.langBtn}
            onPress={toggleLanguage}
            activeOpacity={0.8}
          >
            <Text style={styles.langBtnText}>{language === 'hi' ? 'हिंदी' : 'ENG'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchModePill}
            onPress={onSwitchToMerchant}
            activeOpacity={0.85}
          >
            <MaterialIcons name="storefront" size={15} color="#FFF" />
            <Text style={styles.switchModeText}>व्यापारी Desk</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.customerAvatarBtn}
            onPress={() => setCustomerPickerVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.customerAvatarInitial}>
              {activeCustomer.name.charAt(0)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Customer Welcome & Store Status Banner */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeTop}>
            <View>
              <Text style={styles.welcomeGreeting}>
                {language === 'hi' ? `नमस्ते, ${activeCustomer.name} 🙏` : `Hello, ${activeCustomer.name} 👋`}
              </Text>
              <Text style={styles.welcomeSub}>
                {language === 'hi'
                  ? `${store.name} की ऑनलाइन दुकान में आपका स्वागत है।`
                  : `Welcome to ${store.name}'s verified online counter.`}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.switchCustBtn}
              onPress={() => setCustomerPickerVisible(true)}
            >
              <Text style={styles.switchCustText}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.storeStatusRow}>
            <View style={styles.openPill}>
              <View style={styles.pulseDot} />
              <Text style={styles.openPillText}>Shop Open · Delivery Available</Text>
            </View>
            <Text style={styles.timingsText}>8:00 AM - 9:30 PM</Text>
          </View>
        </View>

        {/* 💳 Mera Khata (My Ledger & Udhaar Card) */}
        <View style={styles.khataCard}>
          <View style={styles.khataHeader}>
            <View style={styles.khataLeft}>
              <View style={styles.khataIconWrap}>
                <MaterialIcons name="menu-book" size={22} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={styles.khataTitle}>
                  {language === 'hi' ? 'मेरा खाता (My Khata)' : 'My Store Khata'}
                </Text>
                <Text style={styles.khataSubtitle}>
                  Credit Limit: ₹{activeCustomer.limit.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.viewBillsBtn}
              onPress={() => setBillsModalVisible(true)}
            >
              <Text style={styles.viewBillsText}>Past Bills ({myInvoices.length})</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.khataDueRow}>
            <View>
              <Text style={styles.dueLabel}>
                {language === 'hi' ? 'बकाया उधारी (Outstanding Due):' : 'Current Due Balance:'}
              </Text>
              <Text style={[styles.dueAmountBig, activeCustomer.due > 0 && { color: theme.colors.error }]}>
                ₹{activeCustomer.due.toLocaleString('en-IN')}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.payUpiBtn}
              onPress={() => setUpiPayModalVisible(true)}
              activeOpacity={0.85}
            >
              <MaterialIcons name="qr-code-scanner" size={18} color="#FFF" />
              <Text style={styles.payUpiText}>Pay via UPI</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.khataFooter}>
            <MaterialIcons name="security" size={14} color={theme.colors.success} />
            <Text style={styles.khataFooterText}>
              Verified by Shree Ganesh Traders · Cloud Ledger Synced
            </Text>
          </View>
        </View>

        {/* 📝 Quick Parchi / WhatsApp Grocery Order */}
        <View style={styles.parchiCard}>
          <View style={styles.parchiHeader}>
            <View style={styles.parchiTitleGroup}>
              <MaterialIcons name="edit-note" size={24} color={theme.colors.secondary} />
              <Text style={styles.parchiTitle}>
                {language === 'hi' ? 'पर्ची भेजें (Quick WhatsApp Order)' : 'Quick Grocery Parchi Order'}
              </Text>
            </View>
            <View style={styles.whatsAppPill}>
              <Ionicons name="logo-whatsapp" size={12} color="#FFF" />
              <Text style={styles.whatsAppPillText}>WhatsApp</Text>
            </View>
          </View>
          <Text style={styles.parchiSubtitle}>
            {language === 'hi'
              ? 'सामान की पर्ची लिखें या टोकरी चुनें, दुकानदार सीधे पैक करके रखेगा!'
              : 'Write your grocery list or pick items below. Shopkeeper packs ready for pickup!'}
          </Text>

          <View style={styles.parchiInputBox}>
            <TextInput
              style={styles.parchiInput}
              placeholder="e.g. 5kg Atta, 2L Fortune Oil, 1kg Toor Dal, 500g Tata Tea..."
              placeholderTextColor={theme.colors.textMuted}
              value={parchiNote}
              onChangeText={setParchiNote}
              multiline
            />
            <TouchableOpacity
              style={styles.sendParchiBtn}
              onPress={() => {
                if (customerCart.length > 0 || parchiNote.trim()) {
                  sendParchiOrder(customerCart, parchiNote);
                } else {
                  Alert.alert('Empty Parchi', 'Please type your grocery list or select items below.');
                }
              }}
              activeOpacity={0.85}
            >
              <Ionicons name="send" size={16} color="#FFF" />
              <Text style={styles.sendParchiText}>Send Order to Shop</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mandi Rates Today */}
        <View style={styles.mandiSection}>
          <View style={styles.mandiHeaderRow}>
            <Text style={styles.mandiTitle}>
              {language === 'hi' ? 'आज के मंडी भाव (Mandi Daily Rates)' : "Today's Mandi Wholesale Rates"}
            </Text>
            <Text style={styles.mandiDate}>Pune Yard · 24 Oct</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mandiScroll}>
            {[
              { name: 'Madhur Sugar', rate: '₹46/kg', tag: 'Best Rate' },
              { name: 'Sharbati Atta', rate: '₹48/kg', tag: 'Fresh' },
              { name: 'Sunflower Oil', rate: '₹145/L', tag: 'Hot Deal' },
              { name: 'Toor Dal Desi', rate: '₹175/kg', tag: 'Pure' },
              { name: 'Tata Tea Gold', rate: '₹160/pkt', tag: 'In Stock' },
            ].map((m, idx) => (
              <View key={idx} style={styles.mandiCard}>
                <View style={styles.mandiTag}>
                  <Text style={styles.mandiTagText}>{m.tag}</Text>
                </View>
                <Text style={styles.mandiItemName}>{m.name}</Text>
                <Text style={styles.mandiRate}>{m.rate}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Store Grocery Catalog */}
        <View style={styles.catalogSectionHeader}>
          <Text style={styles.catalogTitle}>
            {language === 'hi' ? 'दुकान का सामान (Shop Catalog)' : 'Store Catalog & Items'}
          </Text>
          <Text style={styles.catalogCount}>{filteredProducts.length} items</Text>
        </View>

        {/* Search Input */}
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color={theme.colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search oil, atta, tea, sugar, dal..."
            placeholderTextColor={theme.colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Category Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catPill, categoryFilter === cat && styles.catPillActive]}
              onPress={() => setCategoryFilter(cat)}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.catPillText, categoryFilter === cat && styles.catPillTextActive]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Products Grid */}
        <View style={styles.productGrid}>
          {filteredProducts.map((item) => {
            const inCart = customerCart.find((it) => it.id === item.id);
            return (
              <View key={item.id} style={styles.productCard}>
                <View style={styles.productBadgeRow}>
                  <Text style={styles.productCategory}>{item.category}</Text>
                  {item.stock > 0 ? (
                    <Text style={styles.inStockBadge}>In Stock</Text>
                  ) : (
                    <Text style={styles.outOfStockBadge}>Sold Out</Text>
                  )}
                </View>

                <Text style={styles.productName} numberOfLines={2}>
                  {language === 'hi' ? item.nameHi || item.name : item.name}
                </Text>
                <Text style={styles.productPrice}>
                  ₹{item.price} <Text style={styles.productUnit}>/ {item.unit}</Text>
                </Text>

                {inCart ? (
                  <View style={styles.inCartControl}>
                    <TouchableOpacity
                      style={styles.cartQtyBtn}
                      onPress={() => updateCustomerCartQty(item.id, -1)}
                    >
                      <MaterialIcons name="remove" size={16} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.cartQtyNum}>{inCart.qty}</Text>
                    <TouchableOpacity
                      style={styles.cartQtyBtn}
                      onPress={() => updateCustomerCartQty(item.id, 1)}
                    >
                      <MaterialIcons name="add" size={16} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.addToCartBtn}
                    onPress={() => addToCustomerCart(item)}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons name="add-shopping-cart" size={16} color={theme.colors.primary} />
                    <Text style={styles.addToCartText}>+ Add to Basket</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        {/* Shop Info & Contact Footer */}
        <View style={styles.shopFooterCard}>
          <Text style={styles.footerStoreName}>{store.name}</Text>
          <Text style={styles.footerStoreAddress}>{store.address}</Text>
          <Text style={styles.footerStoreOwner}>Managed by {store.ownerName} · GST: {store.gstin}</Text>

          <View style={styles.footerActionsRow}>
            <TouchableOpacity
              style={styles.footerCallBtn}
              onPress={() => Alert.alert('Call Store', `Calling ${store.ownerName} at ${store.phone}...`)}
              activeOpacity={0.8}
            >
              <MaterialIcons name="phone" size={16} color="#FFF" />
              <Text style={styles.footerCallText}>Call Store</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.footerWhatsAppBtn}
              onPress={() => sendParchiOrder([], 'Namaste Rajesh ji, I want to inquire about shop items.')}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-whatsapp" size={16} color="#FFF" />
              <Text style={styles.footerWhatsAppText}>WhatsApp Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Basket Bar (Visible when basket has items) */}
      {customerCart.length > 0 && (
        <View style={styles.floatingBasketBar}>
          <View style={styles.basketInfo}>
            <View style={styles.basketBadge}>
              <Text style={styles.basketBadgeText}>{cartItemCount}</Text>
            </View>
            <View>
              <Text style={styles.basketTotalText}>₹{cartTotal.toLocaleString('en-IN')}</Text>
              <Text style={styles.basketSubText}>{customerCart.length} items in basket</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.orderWhatsAppBtn}
            onPress={() => setCartModalVisible(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.orderWhatsAppText}>View Basket & Order</Text>
            <MaterialIcons name="arrow-forward" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}

      {/* Basket Modal */}
      <Modal
        visible={cartModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCartModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Ghrahak Basket (आपकी टोकरी)</Text>
                <Text style={styles.modalSub}>{store.name}</Text>
              </View>
              <TouchableOpacity onPress={() => setCartModalVisible(false)} style={styles.closeBtn}>
                <MaterialIcons name="close" size={24} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 260 }}>
              {customerCart.map((it) => (
                <View key={it.id} style={styles.cartRow}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.cartItemTitle}>{it.name}</Text>
                    <Text style={styles.cartItemPriceUnit}>
                      ₹{it.price} / {it.unit}
                    </Text>
                  </View>

                  <View style={styles.cartQtyControls}>
                    <TouchableOpacity
                      style={styles.cartSmallBtn}
                      onPress={() => updateCustomerCartQty(it.id, -1)}
                    >
                      <MaterialIcons name="remove" size={14} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <Text style={styles.cartSmallQty}>{it.qty}</Text>
                    <TouchableOpacity
                      style={styles.cartSmallBtn}
                      onPress={() => updateCustomerCartQty(it.id, 1)}
                    >
                      <MaterialIcons name="add" size={14} color={theme.colors.primary} />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.cartRowTotal}>
                    ₹{(it.price * it.qty).toLocaleString('en-IN')}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.cartTotalDivider} />
            <View style={styles.cartTotalRow}>
              <Text style={styles.cartTotalLabel}>Total Order Estimate:</Text>
              <Text style={styles.cartTotalVal}>₹{cartTotal.toLocaleString('en-IN')}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => {
                sendParchiOrder(customerCart, parchiNote);
                setCartModalVisible(false);
              }}
              activeOpacity={0.85}
            >
              <Ionicons name="logo-whatsapp" size={20} color="#FFF" />
              <Text style={styles.checkoutBtnText}>Send Order to Shree Ganesh Traders</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Pay via UPI Modal */}
      <Modal
        visible={upiPayModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setUpiPayModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.upiModalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Pay Shop via UPI</Text>
                <Text style={styles.modalSub}>{store.name}</Text>
              </View>
              <TouchableOpacity onPress={() => setUpiPayModalVisible(false)} style={styles.closeBtn}>
                <MaterialIcons name="close" size={24} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.qrCard}>
              <Image source={{ uri: store.qrCodeUrl }} style={styles.qrImage} resizeMode="contain" />
              <Text style={styles.qrUpiId}>VPA: {store.upiId}</Text>
              <Text style={styles.qrHint}>
                Scan using any UPI App (GPay, PhonePe, Paytm, BHIM)
              </Text>
            </View>

            <View style={styles.payDueNotice}>
              <Text style={styles.payDueNoticeLabel}>Your Pending Khata Balance:</Text>
              <Text style={styles.payDueNoticeVal}>₹{activeCustomer.due.toLocaleString('en-IN')}</Text>
            </View>

            <TouchableOpacity
              style={styles.upiDoneBtn}
              onPress={() => {
                setUpiPayModalVisible(false);
                Alert.alert(
                  'UPI Payment Initiated',
                  'Once payment is sent, please notify Rajesh Bhai on WhatsApp for instant receipt.'
                );
              }}
            >
              <Text style={styles.upiDoneText}>I Have Paid / Open UPI App</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Customer Switcher Modal */}
      <Modal
        visible={customerPickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCustomerPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Switch Customer Profile (Demo)</Text>
              <TouchableOpacity onPress={() => setCustomerPickerVisible(false)} style={styles.closeBtn}>
                <MaterialIcons name="close" size={24} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalSub, { marginBottom: 12 }]}>
              Select a customer to view their personalized Khata, bills, and profile:
            </Text>

            {customers.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[styles.custSelectRow, activeCustomer.id === c.id && styles.custSelectRowActive]}
                onPress={() => {
                  setActiveCustomerId(c.id);
                  setCustomerPickerVisible(false);
                }}
              >
                <View style={styles.custAvatarCircle}>
                  <Text style={styles.custAvatarText}>{c.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.custRowName}>{c.name}</Text>
                  <Text style={styles.custRowPhone}>{c.phone}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.custRowDue, c.due > 0 && { color: theme.colors.error }]}>
                    Due: ₹{c.due.toLocaleString('en-IN')}
                  </Text>
                  <Text style={styles.custRowLimit}>Limit: ₹{c.limit.toLocaleString('en-IN')}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Past Bills Modal */}
      <Modal
        visible={billsModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setBillsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Past Store Invoices</Text>
                <Text style={styles.modalSub}>{activeCustomer.name} · {store.name}</Text>
              </View>
              <TouchableOpacity onPress={() => setBillsModalVisible(false)} style={styles.closeBtn}>
                <MaterialIcons name="close" size={24} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 350 }}>
              {myInvoices.length === 0 ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={{ color: theme.colors.textMuted }}>No invoices found for this customer.</Text>
                </View>
              ) : (
                myInvoices.map((inv) => (
                  <View key={inv.id} style={styles.billHistoryCard}>
                    <View style={styles.billHistTop}>
                      <Text style={styles.billHistNum}>#{inv.invoiceNumber}</Text>
                      <Text style={styles.billHistTotal}>₹{inv.total.toLocaleString('en-IN')}</Text>
                    </View>
                    <Text style={styles.billHistMeta}>
                      {new Date(inv.createdAt).toLocaleDateString('en-IN')} · {inv.paymentMode.toUpperCase()}
                    </Text>
                    <Text style={styles.billHistItems} numberOfLines={1}>
                      {inv.items.map((i) => `${i.name} (x${i.qty})`).join(', ')}
                    </Text>
                  </View>
                ))
              )}
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
  topHeader: {
    height: 70,
    backgroundColor: theme.colors.surfaceWhite,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: -0.3,
  },
  hindiBadge: {
    backgroundColor: theme.colors.secondaryLight,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  hindiBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.secondary,
  },
  storeTagline: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  langBtn: {
    backgroundColor: theme.colors.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  langBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  switchModePill: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
  },
  switchModeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },
  customerAvatarBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.secondaryLight,
    borderWidth: 1.5,
    borderColor: theme.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerAvatarInitial: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.secondary,
  },

  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 90,
  },

  welcomeCard: {
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  welcomeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  welcomeGreeting: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  welcomeSub: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  switchCustBtn: {
    backgroundColor: theme.colors.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  switchCustText: {
    fontSize: 11,
    color: theme.colors.secondary,
    fontWeight: '700',
  },
  storeStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  openPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: theme.colors.success,
  },
  openPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.success,
  },
  timingsText: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },

  // Khata Card
  khataCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderGold,
    marginBottom: theme.spacing.lg,
    shadowColor: '#102B4E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  khataHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  khataLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  khataIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  khataTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  khataSubtitle: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 1,
  },
  viewBillsBtn: {
    backgroundColor: theme.colors.surfaceWhite,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.borderRadius.full,
  },
  viewBillsText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  khataDueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 10,
  },
  dueLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  dueAmountBig: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.primary,
    marginTop: 2,
  },
  payUpiBtn: {
    backgroundColor: theme.colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
  },
  payUpiText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  khataFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  khataFooterText: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },

  // Parchi Card
  parchiCard: {
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  parchiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  parchiTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  parchiTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  whatsAppPill: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.full,
  },
  whatsAppPillText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  parchiSubtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 10,
  },
  parchiInputBox: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 10,
  },
  parchiInput: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    minHeight: 50,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  sendParchiBtn: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
  },
  sendParchiText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },

  // Mandi Section
  mandiSection: {
    marginBottom: theme.spacing.lg,
  },
  mandiHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mandiTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  mandiDate: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  mandiScroll: {
    flexDirection: 'row',
  },
  mandiCard: {
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: 120,
  },
  mandiTag: {
    backgroundColor: theme.colors.secondaryLight,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  mandiTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  mandiItemName: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  mandiRate: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.primary,
    marginTop: 4,
  },

  // Catalog Section
  catalogSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  catalogTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  catalogCount: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.textPrimary,
  },
  catScroll: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surfaceContainerLow,
    marginRight: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  catPillActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  catPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  catPillTextActive: {
    color: '#FFF',
  },

  // Product Grid
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: theme.spacing.xl,
  },
  productCard: {
    width: '48.5%',
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'space-between',
  },
  productBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  productCategory: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  inStockBadge: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.success,
  },
  outOfStockBadge: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.error,
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    minHeight: 34,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.primary,
    marginVertical: 6,
  },
  productUnit: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  addToCartBtn: {
    backgroundColor: theme.colors.surfaceContainerLow,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  addToCartText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  inCartControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: 3,
  },
  cartQtyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  cartQtyNum: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },

  // Shop Footer
  shopFooterCard: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    gap: 4,
  },
  footerStoreName: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  footerStoreAddress: {
    fontSize: 12,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  footerStoreOwner: {
    fontSize: 11,
    color: theme.colors.secondary,
    fontWeight: '600',
    marginBottom: 10,
  },
  footerActionsRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  footerCallBtn: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
  },
  footerCallText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  footerWhatsAppBtn: {
    flex: 1,
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
  },
  footerWhatsAppText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // Floating Basket Bar
  floatingBasketBar: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.xl,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  basketInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  basketBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.secondaryAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  basketBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  basketTotalText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
  },
  basketSubText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  orderWhatsAppBtn: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
  },
  orderWhatsAppText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // Modals
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
  upiModalContent: {
    backgroundColor: theme.colors.surfaceWhite,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    width: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  modalSub: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  closeBtn: {
    padding: 6,
  },
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  cartItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  cartItemPriceUnit: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  cartQtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: 6,
    padding: 2,
    marginRight: 10,
  },
  cartSmallBtn: {
    padding: 4,
  },
  cartSmallQty: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
    paddingHorizontal: 4,
  },
  cartRowTotal: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  cartTotalDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 10,
  },
  cartTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cartTotalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  cartTotalVal: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  checkoutBtn: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
  },
  checkoutBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  qrCard: {
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.borderGold,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: '#FFFDF9',
    width: '100%',
    marginBottom: 14,
  },
  qrImage: {
    width: 160,
    height: 160,
    marginBottom: 8,
  },
  qrUpiId: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  qrHint: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  payDueNotice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: theme.colors.surfaceContainerLow,
    padding: 12,
    borderRadius: theme.borderRadius.md,
    marginBottom: 14,
  },
  payDueNoticeLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  payDueNoticeVal: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.error,
  },
  upiDoneBtn: {
    backgroundColor: theme.colors.primary,
    width: '100%',
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  upiDoneText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  custSelectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceContainerLow,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  custSelectRowActive: {
    backgroundColor: '#FFFDF9',
    borderColor: theme.colors.secondary,
  },
  custAvatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  custAvatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  custRowName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  custRowPhone: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  custRowDue: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  custRowLimit: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  billHistoryCard: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.md,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  billHistTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  billHistNum: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  billHistTotal: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  billHistMeta: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  billHistItems: {
    fontSize: 11,
    color: theme.colors.textPrimary,
  },
});
