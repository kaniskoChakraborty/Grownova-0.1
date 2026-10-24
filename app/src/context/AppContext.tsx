import React, { createContext, useContext, useState, useMemo } from 'react';
import { Share, Linking, Alert } from 'react-native';

// ==========================================
// TYPES & INTERFACES
// ==========================================

export type Language = 'en' | 'hi';

export interface StoreProfile {
  name: string;
  tagline: string;
  ownerName: string;
  phone: string;
  city: string;
  address: string;
  gstin: string;
  upiId: string;
  qrCodeUrl: string;
  counterId: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  nameHi: string;
  category: string;
  stock: number;
  unit: string;
  price: number;
  costPrice: number;
  minStock: number;
  status: 'safe' | 'low' | 'critical';
  barcode?: string;
}

export interface BillItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  unit: string;
}

export interface SaleInvoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone?: string;
  customerType: 'walkin' | 'khata';
  customerId?: string;
  paymentMode: 'upi' | 'cash' | 'udhaar';
  items: BillItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  createdAt: string;
  timeAgo: string;
  status: 'completed' | 'pending';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  due: number; // Positive = owes money
  limit: number;
  status: 'active' | 'overdue' | 'cleared';
  lastTransaction: string;
}

export interface CashflowEntry {
  id: string;
  type: 'in' | 'out';
  category: 'sale' | 'payment_received' | 'supplier_payment' | 'expense';
  amount: number;
  description: string;
  mode: 'cash' | 'upi';
  time: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  city: string;
  dues: number;
  status: 'due' | 'overdue' | 'paid';
  itemsSupplied: string;
}

export interface PurchaseBill {
  id: string;
  supplierId: string;
  supplierName: string;
  amount: number;
  status: 'due' | 'overdue' | 'paid';
  itemsDescription: string;
  dueDate: string;
  date: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  status: 'present' | 'absent' | 'half_day';
  checkInTime?: string;
  geoAccuracy: string;
}

// ==========================================
// CONTEXT INTERFACE
// ==========================================

interface AppContextType {
  // Localization & Store
  language: Language;
  toggleLanguage: () => void;
  store: StoreProfile;
  updateStore: (data: Partial<StoreProfile>) => void;

  // Cloud Sync
  isSyncing: boolean;
  syncNow: () => Promise<void>;

  // Inventory
  inventory: InventoryItem[];
  addProduct: (item: Omit<InventoryItem, 'id' | 'status'>) => void;
  updateStock: (id: string, delta: number) => void;
  reorderStock: (id: string, qty: number) => void;

  // Sales & POS Invoicing
  sales: SaleInvoice[];
  createBill: (billData: {
    customerName: string;
    customerPhone?: string;
    customerType: 'walkin' | 'khata';
    customerId?: string;
    paymentMode: 'upi' | 'cash' | 'udhaar';
    items: BillItem[];
    discount: number;
    tax: number;
  }) => SaleInvoice;

  // Accounts & Customers (Khata)
  customers: Customer[];
  cashflow: CashflowEntry[];
  addCustomer: (data: { name: string; phone: string; limit: number }) => Customer;
  recordCustomerPayment: (customerId: string, amount: number, mode: 'cash' | 'upi') => void;
  recordExpense: (amount: number, description: string, mode: 'cash' | 'upi') => void;
  sendWhatsAppReminder: (customer: Customer) => void;
  shareInvoiceWhatsApp: (invoice: SaleInvoice) => void;

  // Purchase & Suppliers
  suppliers: Supplier[];
  purchaseBills: PurchaseBill[];
  addPurchaseBill: (bill: {
    supplierId: string;
    amount: number;
    itemsDescription: string;
    dueDate: string;
  }) => void;
  paySupplierBill: (billId: string, amount: number, mode: 'cash' | 'upi') => void;

  // Staff & Attendance
  staff: StaffMember[];
  isOwnerPunchedIn: boolean;
  ownerPunchTime: string | null;
  toggleOwnerPunch: () => void;
  setStaffStatus: (staffId: string, status: 'present' | 'absent' | 'half_day') => void;
  addStaff: (data: { name: string; role: string; phone: string }) => void;

  // Dual-Mode Experience (Ghrahak Customer vs Merchant Desk)
  appMode: 'customer' | 'merchant';
  setAppMode: (mode: 'customer' | 'merchant') => void;
  toggleAppMode: () => void;
  activeCustomerId: string;
  setActiveCustomerId: (id: string) => void;
  activeCustomer: Customer;
  customerCart: BillItem[];
  addToCustomerCart: (item: InventoryItem) => void;
  updateCustomerCartQty: (id: string, delta: number) => void;
  clearCustomerCart: () => void;
  sendParchiOrder: (items: BillItem[], note?: string) => void;

  // Dashboard Aggregates
  todaySales: number;
  todayCash: number;
  todayUdhaar: number;
  lowStockCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ==========================================
// INITIAL MOCK SEED DATA
// ==========================================

const INITIAL_STORE: StoreProfile = {
  name: 'Shree Ganesh Traders',
  tagline: 'Wholesale & Retail Kirana',
  ownerName: 'Rajesh Bhai',
  phone: '+91 98230 12345',
  city: 'Pune Mandi, Maharashtra',
  address: 'Shop #14, Market Yard, Pune - 411037',
  gstin: '27ABCDE1234F1Z5',
  upiId: 'shreeganesh@icici',
  qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=shreeganesh@icici&pn=Shree%20Ganesh%20Traders',
  counterId: 'POS-01',
};

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'Fortune Sunflower Oil (1L)', nameHi: 'फॉर्च्यून सूरजमुखी तेल (1L)', category: 'Edible Oils', stock: 14, unit: 'pouch', price: 145, costPrice: 128, minStock: 10, status: 'safe', barcode: '8901234567890' },
  { id: '2', name: 'Aashirvaad Sharbati Atta (10kg)', nameHi: 'आशीर्वाद शरबती आटा (10kg)', category: 'Flour & Grains', stock: 6, unit: 'bag', price: 480, costPrice: 420, minStock: 15, status: 'low', barcode: '8901234567891' },
  { id: '3', name: 'Tata Tea Premium (500g)', nameHi: 'टाटा टी प्रीमियम (500g)', category: 'Beverages', stock: 28, unit: 'packet', price: 160, costPrice: 135, minStock: 20, status: 'safe', barcode: '8901234567892' },
  { id: '4', name: 'Madhur Pure Sugar (1kg)', nameHi: 'मधुर चीनी (1kg)', category: 'Pantry Staples', stock: 3, unit: 'packet', price: 46, costPrice: 38, minStock: 25, status: 'critical', barcode: '8901234567893' },
  { id: '5', name: 'Toor Dal Desi (1kg)', nameHi: 'तूर दाल देशी (1kg)', category: 'Pulses', stock: 1, unit: 'kg', price: 175, costPrice: 152, minStock: 10, status: 'critical', barcode: '8901234567894' },
  { id: '6', name: 'Parle-G Gold Biscuits (100g)', nameHi: 'पारले-जी बिस्कुट', category: 'Packaged Foods', stock: 54, unit: 'packet', price: 10, costPrice: 8, minStock: 20, status: 'safe', barcode: '8901234567895' },
  { id: '7', name: 'Tata Salt Vaccum Evap (1kg)', nameHi: 'टाटा नमक (1kg)', category: 'Pantry Staples', stock: 40, unit: 'packet', price: 28, costPrice: 22, minStock: 20, status: 'safe', barcode: '8901234567896' },
  { id: '8', name: 'MDH Garam Masala (100g)', nameHi: 'एमडीएच गरम मसाला', category: 'Spices', stock: 12, unit: 'box', price: 92, costPrice: 76, minStock: 8, status: 'safe', barcode: '8901234567897' },
];

const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Amit Store', phone: '98230-84192', due: 3200, limit: 15000, status: 'active', lastTransaction: 'Today, 10m ago' },
  { id: 'c2', name: 'Suresh Kirana', phone: '94220-19283', due: 6750, limit: 20000, status: 'overdue', lastTransaction: 'Yesterday' },
  { id: 'c3', name: 'Pooja Provision', phone: '98901-44521', due: 4850, limit: 10000, status: 'active', lastTransaction: 'Today, 1h ago' },
  { id: 'c4', name: 'Deepak Sharma', phone: '98221-55443', due: 2300, limit: 8000, status: 'active', lastTransaction: 'Today, 2h ago' },
  { id: 'c5', name: 'Ramesh ji', phone: '97654-32109', due: 0, limit: 10000, status: 'cleared', lastTransaction: '3 days ago' },
];

const INITIAL_SALES: SaleInvoice[] = [
  {
    id: 's1',
    invoiceNumber: 'GN-1044',
    customerName: 'Amit Store',
    customerPhone: '98230-84192',
    customerType: 'khata',
    customerId: 'c1',
    paymentMode: 'upi',
    items: [
      { id: '1', name: 'Fortune Sunflower Oil (1L)', price: 145, qty: 5, unit: 'pouch' },
      { id: '3', name: 'Tata Tea Premium (500g)', price: 160, qty: 3, unit: 'packet' },
      { id: '7', name: 'Tata Salt (1kg)', price: 28, qty: 8, unit: 'packet' },
    ],
    subtotal: 1429,
    discount: 29,
    tax: 50,
    total: 1450,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    timeAgo: '10m ago',
    status: 'completed',
  },
  {
    id: 's2',
    invoiceNumber: 'GN-1043',
    customerName: 'Ramesh ji',
    customerPhone: '97654-32109',
    customerType: 'khata',
    customerId: 'c5',
    paymentMode: 'cash',
    items: [
      { id: '2', name: 'Aashirvaad Sharbati Atta (10kg)', price: 480, qty: 15, unit: 'bag' },
      { id: '1', name: 'Fortune Sunflower Oil (1L)', price: 145, qty: 5, unit: 'pouch' },
    ],
    subtotal: 7925,
    discount: 125,
    tax: 200,
    total: 8000,
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    timeAgo: '35m ago',
    status: 'completed',
  },
  {
    id: 's3',
    invoiceNumber: 'GN-1042',
    customerName: 'Pooja Provision',
    customerPhone: '98901-44521',
    customerType: 'khata',
    customerId: 'c3',
    paymentMode: 'upi',
    items: [
      { id: '2', name: 'Aashirvaad Sharbati Atta (10kg)', price: 480, qty: 8, unit: 'bag' },
      { id: '5', name: 'Toor Dal Desi (1kg)', price: 175, qty: 5, unit: 'kg' },
    ],
    subtotal: 4715,
    discount: 65,
    tax: 200,
    total: 4850,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    timeAgo: '1h ago',
    status: 'completed',
  },
  {
    id: 's4',
    invoiceNumber: 'GN-1041',
    customerName: 'Deepak Sharma',
    customerPhone: '98221-55443',
    customerType: 'khata',
    customerId: 'c4',
    paymentMode: 'udhaar',
    items: [
      { id: '2', name: 'Aashirvaad Sharbati Atta (10kg)', price: 480, qty: 4, unit: 'bag' },
      { id: '3', name: 'Tata Tea Premium (500g)', price: 160, qty: 2, unit: 'packet' },
    ],
    subtotal: 2240,
    discount: 40,
    tax: 100,
    total: 2300,
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    timeAgo: '2h ago',
    status: 'completed',
  },
  {
    id: 's5',
    invoiceNumber: 'GN-1040',
    customerName: 'Walk-in Customer',
    customerType: 'walkin',
    paymentMode: 'cash',
    items: [
      { id: '1', name: 'Fortune Sunflower Oil (1L)', price: 145, qty: 2, unit: 'pouch' },
      { id: '3', name: 'Tata Tea Premium (500g)', price: 160, qty: 2, unit: 'packet' },
    ],
    subtotal: 610,
    discount: 10,
    tax: 20,
    total: 620,
    createdAt: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    timeAgo: '2h ago',
    status: 'completed',
  },
];

const INITIAL_CASHFLOW: CashflowEntry[] = [
  { id: 'cf1', type: 'in', category: 'sale', amount: 1450, description: 'Sale: Amit Store (UPI)', mode: 'upi', time: '10m ago' },
  { id: 'cf2', type: 'in', category: 'sale', amount: 8000, description: 'Sale: Ramesh ji (Cash)', mode: 'cash', time: '35m ago' },
  { id: 'cf3', type: 'in', category: 'payment_received', amount: 5000, description: 'Khata Received: Suresh Kirana', mode: 'upi', time: '45m ago' },
  { id: 'cf4', type: 'out', category: 'expense', amount: 350, description: 'Shop Chai & Snacks (Helper)', mode: 'cash', time: '1h ago' },
  { id: 'cf5', type: 'in', category: 'sale', amount: 4850, description: 'Sale: Pooja Provision (UPI)', mode: 'upi', time: '1h ago' },
  { id: 'cf6', type: 'out', category: 'supplier_payment', amount: 6000, description: 'Supplier Advance: Kisan Wholesalers', mode: 'cash', time: '3h ago' },
];

const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 'sup1', name: 'Balaji Agro Mills', phone: '98220-77112', city: 'Nagpur', dues: 18400, status: 'due', itemsSupplied: 'Wheat & Rice 50 bags' },
  { id: 'sup2', name: 'Gujarat Oil Traders', phone: '94231-88223', city: 'Ahmedabad', dues: 12100, status: 'overdue', itemsSupplied: 'Refined Oil 20 cartons' },
  { id: 'sup3', name: 'Kisan Wholesalers', phone: '98900-33445', city: 'Pune Mandi', dues: 0, status: 'paid', itemsSupplied: 'Pulses & Spices' },
  { id: 'sup4', name: 'Tata Consumer Distrib.', phone: '99220-44556', city: 'Mumbai', dues: 0, status: 'paid', itemsSupplied: 'Tea 500g 48 units' },
];

const INITIAL_PURCHASES: PurchaseBill[] = [
  { id: 'pb1', supplierId: 'sup1', supplierName: 'Balaji Agro Mills', amount: 18400, status: 'due', itemsDescription: 'Wheat & Rice 50 bags', dueDate: 'In 3 days', date: '21 Oct' },
  { id: 'pb2', supplierId: 'sup2', supplierName: 'Gujarat Oil Traders', amount: 12100, status: 'overdue', itemsDescription: 'Refined Oil 20 cartons', dueDate: 'Overdue 2 days', date: '18 Oct' },
  { id: 'pb3', supplierId: 'sup3', supplierName: 'Kisan Wholesalers', amount: 12000, status: 'paid', itemsDescription: 'Pulses & Spices', dueDate: 'Paid', date: '15 Oct' },
  { id: 'pb4', supplierId: 'sup4', supplierName: 'Tata Consumer Distrib.', amount: 7680, status: 'paid', itemsDescription: 'Tea 500g 48 units', dueDate: 'Paid', date: '12 Oct' },
];

const INITIAL_STAFF: StaffMember[] = [
  { id: 'st1', name: 'Ramesh Kumar', role: 'Counter Billing', phone: '98230-11223', status: 'present', checkInTime: '08:45 AM', geoAccuracy: 'Inside Shop (12m)' },
  { id: 'st2', name: 'Sunita Patil', role: 'Inventory & Stock', phone: '98230-22334', status: 'present', checkInTime: '09:00 AM', geoAccuracy: 'Inside Shop (18m)' },
  { id: 'st3', name: 'Suresh Verma', role: 'Helper & Delivery', phone: '98230-33445', status: 'present', checkInTime: '09:12 AM', geoAccuracy: 'Mandi Gate (45m)' },
  { id: 'st4', name: 'Manoj Shinde', role: 'Loading Staff', phone: '98230-44556', status: 'absent', checkInTime: undefined, geoAccuracy: 'Not Clocked In' },
];

// ==========================================
// PROVIDER COMPONENT
// ==========================================

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('hi');
  const [store, setStore] = useState<StoreProfile>(INITIAL_STORE);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [sales, setSales] = useState<SaleInvoice[]>(INITIAL_SALES);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [cashflow, setCashflow] = useState<CashflowEntry[]>(INITIAL_CASHFLOW);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [purchaseBills, setPurchaseBills] = useState<PurchaseBill[]>(INITIAL_PURCHASES);
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);

  const [isOwnerPunchedIn, setIsOwnerPunchedIn] = useState<boolean>(true);
  const [ownerPunchTime, setOwnerPunchTime] = useState<string | null>('08:30 AM');

  // Dual-mode state (Ghrahak Customer vs Merchant Desk)
  const [appMode, setAppMode] = useState<'customer' | 'merchant'>('customer');
  const [activeCustomerId, setActiveCustomerId] = useState<string>('c1');
  const [customerCart, setCustomerCart] = useState<BillItem[]>([
    { id: '1', name: 'Fortune Sunflower Oil (1L)', price: 145, qty: 1, unit: 'pouch' },
    { id: '3', name: 'Tata Tea Premium (500g)', price: 160, qty: 1, unit: 'packet' },
  ]);

  const toggleAppMode = () => {
    setAppMode((prev) => (prev === 'customer' ? 'merchant' : 'customer'));
  };

  const activeCustomer = useMemo(() => {
    return (
      customers.find((c) => c.id === activeCustomerId) ||
      customers[0] || {
        id: 'c1',
        name: 'Amit Sharma',
        phone: '98230-84192',
        due: 3200,
        limit: 15000,
        status: 'active' as const,
        lastTransaction: 'Today, 10m ago',
      }
    );
  }, [customers, activeCustomerId]);

  const addToCustomerCart = (item: InventoryItem) => {
    setCustomerCart((prev) => {
      const existing = prev.find((it) => it.id === item.id);
      if (existing) {
        return prev.map((it) => (it.id === item.id ? { ...it, qty: it.qty + 1 } : it));
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1, unit: item.unit }];
    });
    Alert.alert('✅ Added to Basket', `${item.name} added to your Ghrahak basket.`);
  };

  const updateCustomerCartQty = (id: string, delta: number) => {
    setCustomerCart((prev) =>
      prev
        .map((it) => (it.id === id ? { ...it, qty: Math.max(0, it.qty + delta) } : it))
        .filter((it) => it.qty > 0)
    );
  };

  const clearCustomerCart = () => {
    setCustomerCart([]);
  };

  const sendParchiOrder = (items: BillItem[], note?: string) => {
    if (items.length === 0) {
      Alert.alert('Basket is empty', 'Please add some items to your order or write a parchi.');
      return;
    }

    const itemsList = items
      .map((it) => `• ${it.name} x${it.qty} = ₹${(it.price * it.qty).toLocaleString('en-IN')}`)
      .join('\n');
    const totalEst = items.reduce((sum, it) => sum + it.price * it.qty, 0);

    const text =
      `🛒 *New Order from Ghrahak (ग्राहक पर्ची)*\n` +
      `Customer: ${activeCustomer.name} (${activeCustomer.phone})\n` +
      `To Store: ${store.name}\n` +
      `--------------------------------\n` +
      `${itemsList}\n` +
      `--------------------------------\n` +
      `*Estimated Total: ₹${totalEst.toLocaleString('en-IN')}*\n` +
      (note ? `Note: ${note}\n` : '') +
      `\nPlease pack and confirm when ready. Thank you! 🙏`;

    Share.share({
      message: text,
      title: 'Ghrahak Grocery Order',
    }).catch(() => {
      const url = `whatsapp://send?phone=${store.phone}&text=${encodeURIComponent(text)}`;
      Linking.canOpenURL(url).then((supported: boolean) => {
        if (supported) Linking.openURL(url);
      });
    });
  };

  // Toggle Language
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const updateStore = (data: Partial<StoreProfile>) => {
    setStore((prev) => ({ ...prev, ...data }));
  };

  // Cloud Sync Simulation
  const syncNow = async () => {
    setIsSyncing(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSyncing(false);
    Alert.alert('✅ Cloud Sync Complete', 'All 48 shop transactions & inventory records backed up to GrowNova Cloud.');
  };

  // Stock Helper: Calculates status automatically
  const getStockStatus = (stock: number, minStock: number): 'safe' | 'low' | 'critical' => {
    if (stock <= 2) return 'critical';
    if (stock <= minStock) return 'low';
    return 'safe';
  };

  // Add Product
  const addProduct = (item: Omit<InventoryItem, 'id' | 'status'>) => {
    const status = getStockStatus(item.stock, item.minStock);
    const newItem: InventoryItem = {
      ...item,
      id: 'inv_' + Date.now(),
      status,
    };
    setInventory((prev) => [newItem, ...prev]);
  };

  // Update Stock (+ or -)
  const updateStock = (id: string, delta: number) => {
    setInventory((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const newStock = Math.max(0, it.stock + delta);
          return {
            ...it,
            stock: newStock,
            status: getStockStatus(newStock, it.minStock),
          };
        }
        return it;
      })
    );
  };

  // Reorder Stock
  const reorderStock = (id: string, qty: number) => {
    updateStock(id, qty);
    const item = inventory.find((i) => i.id === id);
    if (item) {
      Alert.alert(
        '📦 Stock Received & Updated',
        `Added +${qty} ${item.unit} to ${item.name}. New total stock: ${item.stock + qty}`
      );
    }
  };

  // Create Bill / Invoice
  const createBill = (billData: {
    customerName: string;
    customerPhone?: string;
    customerType: 'walkin' | 'khata';
    customerId?: string;
    paymentMode: 'upi' | 'cash' | 'udhaar';
    items: BillItem[];
    discount: number;
    tax: number;
  }): SaleInvoice => {
    const subtotal = billData.items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const total = Math.max(0, subtotal - billData.discount + billData.tax);
    const invoiceNum = 'GN-' + (1045 + sales.length);

    const newInvoice: SaleInvoice = {
      id: 'inv_' + Date.now(),
      invoiceNumber: invoiceNum,
      customerName: billData.customerName || (billData.customerType === 'walkin' ? 'Walk-in Customer' : 'Khata Customer'),
      customerPhone: billData.customerPhone,
      customerType: billData.customerType,
      customerId: billData.customerId,
      paymentMode: billData.paymentMode,
      items: billData.items,
      subtotal,
      discount: billData.discount,
      tax: billData.tax,
      total,
      createdAt: new Date().toISOString(),
      timeAgo: 'Just now',
      status: 'completed',
    };

    // 1. Add to sales list
    setSales((prev) => [newInvoice, ...prev]);

    // 2. Deduct inventory quantities
    setInventory((prev) =>
      prev.map((invItem) => {
        const sold = billData.items.find((it) => it.id === invItem.id || it.name === invItem.name);
        if (sold) {
          const newStock = Math.max(0, invItem.stock - sold.qty);
          return {
            ...invItem,
            stock: newStock,
            status: getStockStatus(newStock, invItem.minStock),
          };
        }
        return invItem;
      })
    );

    // 3. If Udhaar, add to customer balance
    if (billData.paymentMode === 'udhaar') {
      if (billData.customerId) {
        setCustomers((prev) =>
          prev.map((c) =>
            c.id === billData.customerId
              ? {
                  ...c,
                  due: c.due + total,
                  status: 'active',
                  lastTransaction: 'Just now',
                }
              : c
          )
        );
      } else {
        // Create new customer entry for this customer
        const newCust: Customer = {
          id: 'c_' + Date.now(),
          name: billData.customerName,
          phone: billData.customerPhone || 'N/A',
          due: total,
          limit: 10000,
          status: 'active',
          lastTransaction: 'Just now',
        };
        setCustomers((prev) => [newCust, ...prev]);
      }
    }

    // 4. Record Cashflow entry if cash or upi
    if (billData.paymentMode !== 'udhaar') {
      const cashEntry: CashflowEntry = {
        id: 'cf_' + Date.now(),
        type: 'in',
        category: 'sale',
        amount: total,
        description: `Sale: ${newInvoice.customerName} (${billData.paymentMode.toUpperCase()})`,
        mode: billData.paymentMode,
        time: 'Just now',
      };
      setCashflow((prev) => [cashEntry, ...prev]);
    }

    return newInvoice;
  };

  // Add Customer
  const addCustomer = (data: { name: string; phone: string; limit: number }): Customer => {
    const newCust: Customer = {
      id: 'cust_' + Date.now(),
      name: data.name,
      phone: data.phone,
      due: 0,
      limit: data.limit || 10000,
      status: 'cleared',
      lastTransaction: 'Never',
    };
    setCustomers((prev) => [newCust, ...prev]);
    return newCust;
  };

  // Record Customer Payment (Udhaar Clearing)
  const recordCustomerPayment = (customerId: string, amount: number, mode: 'cash' | 'upi') => {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return;

    const remainingDue = Math.max(0, customer.due - amount);

    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? {
              ...c,
              due: remainingDue,
              status: remainingDue === 0 ? 'cleared' : c.status,
              lastTransaction: 'Payment: Just now',
            }
          : c
      )
    );

    // Record cashflow inflow
    const entry: CashflowEntry = {
      id: 'cf_' + Date.now(),
      type: 'in',
      category: 'payment_received',
      amount,
      description: `Khata Payment: ${customer.name}`,
      mode,
      time: 'Just now',
    };
    setCashflow((prev) => [entry, ...prev]);

    Alert.alert(
      '✅ Payment Recorded!',
      `Received ₹${amount.toLocaleString('en-IN')} from ${customer.name}. Remaining Udhaar: ₹${remainingDue.toLocaleString('en-IN')}`
    );
  };

  // Record Miscellaneous Expense
  const recordExpense = (amount: number, description: string, mode: 'cash' | 'upi') => {
    const entry: CashflowEntry = {
      id: 'cf_' + Date.now(),
      type: 'out',
      category: 'expense',
      amount,
      description,
      mode,
      time: 'Just now',
    };
    setCashflow((prev) => [entry, ...prev]);
  };

  // WhatsApp Reminder
  const sendWhatsAppReminder = (customer: Customer) => {
    const text = `नमस्ते ${customer.name} जी 🙏\n\n${store.name} से आपका बकाया खाता (Udhaar): *₹${customer.due.toLocaleString('en-IN')}* है।\n\nकृपया Google Pay / PhonePe / Paytm से UPI ID पर भेजें:\n👉 *${store.upiId}*\n\nधन्यवाद!\n-${store.name}, ${store.city}`;
    
    Share.share({
      message: text,
      title: `Payment Reminder - ${customer.name}`,
    }).catch(() => {
      // Fallback to whatsapp link if available
      const url = `whatsapp://send?phone=${customer.phone}&text=${encodeURIComponent(text)}`;
      Linking.canOpenURL(url).then((supported: boolean) => {
        if (supported) Linking.openURL(url);
      });
    });
  };

  // Share Invoice WhatsApp
  const shareInvoiceWhatsApp = (invoice: SaleInvoice) => {
    const itemsList = invoice.items
      .map((it) => `• ${it.name} x${it.qty} = ₹${(it.price * it.qty).toLocaleString('en-IN')}`)
      .join('\n');

    const text = `🧾 *${store.name}*\n` +
      `Bill #${invoice.invoiceNumber}\n` +
      `Date: ${new Date(invoice.createdAt).toLocaleDateString('en-IN')}\n` +
      `Customer: ${invoice.customerName}\n` +
      `--------------------------------\n` +
      `${itemsList}\n` +
      `--------------------------------\n` +
      `Subtotal: ₹${invoice.subtotal.toLocaleString('en-IN')}\n` +
      `Discount: ₹${invoice.discount}\n` +
      `Tax: ₹${invoice.tax}\n` +
      `*Grand Total: ₹${invoice.total.toLocaleString('en-IN')}*\n` +
      `Payment: ${invoice.paymentMode.toUpperCase()} (Received)\n\n` +
      `Thank you for shopping with us! 🙏`;

    Share.share({
      message: text,
      title: `Invoice ${invoice.invoiceNumber}`,
    });
  };

  // Purchase Bills
  const addPurchaseBill = (bill: {
    supplierId: string;
    amount: number;
    itemsDescription: string;
    dueDate: string;
  }) => {
    const supplier = suppliers.find((s) => s.id === bill.supplierId);
    const newBill: PurchaseBill = {
      id: 'pb_' + Date.now(),
      supplierId: bill.supplierId,
      supplierName: supplier?.name || 'Supplier',
      amount: bill.amount,
      status: 'due',
      itemsDescription: bill.itemsDescription,
      dueDate: bill.dueDate || 'In 7 days',
      date: 'Today',
    };

    setPurchaseBills((prev) => [newBill, ...prev]);

    // Update supplier dues
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === bill.supplierId
          ? { ...s, dues: s.dues + bill.amount, status: 'due' }
          : s
      )
    );
  };

  // Pay Supplier
  const paySupplierBill = (billId: string, amount: number, mode: 'cash' | 'upi') => {
    const bill = purchaseBills.find((b) => b.id === billId);
    if (!bill) return;

    setPurchaseBills((prev) =>
      prev.map((b) => (b.id === billId ? { ...b, status: 'paid' } : b))
    );

    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === bill.supplierId
          ? { ...s, dues: Math.max(0, s.dues - amount) }
          : s
      )
    );

    // Record cashflow outflow
    const entry: CashflowEntry = {
      id: 'cf_' + Date.now(),
      type: 'out',
      category: 'supplier_payment',
      amount,
      description: `Supplier Payment: ${bill.supplierName}`,
      mode,
      time: 'Just now',
    };
    setCashflow((prev) => [entry, ...prev]);

    Alert.alert('✅ Supplier Payment Recorded', `Paid ₹${amount.toLocaleString('en-IN')} to ${bill.supplierName}.`);
  };

  // Staff & Attendance
  const toggleOwnerPunch = () => {
    if (isOwnerPunchedIn) {
      setIsOwnerPunchedIn(false);
      setOwnerPunchTime(null);
      Alert.alert('Shop Clock-Out', 'Owner counter clocked out for the day.');
    } else {
      setIsOwnerPunchedIn(true);
      const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      setOwnerPunchTime(timeStr);
      Alert.alert('✅ Shop Clock-In Verified', `Geotag verified at Pune Mandi Counter (Accuracy 12m). Clocked in at ${timeStr}.`);
    }
  };

  const setStaffStatus = (staffId: string, status: 'present' | 'absent' | 'half_day') => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === staffId
          ? {
              ...s,
              status,
              checkInTime: status === 'present' ? '09:00 AM' : status === 'half_day' ? '01:00 PM' : undefined,
              geoAccuracy: status === 'present' ? 'Inside Shop (15m)' : 'Not in Shop',
            }
          : s
      )
    );
  };

  const addStaff = (data: { name: string; role: string; phone: string }) => {
    const newStaff: StaffMember = {
      id: 'st_' + Date.now(),
      name: data.name,
      role: data.role,
      phone: data.phone,
      status: 'present',
      checkInTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      geoAccuracy: 'Inside Shop (14m)',
    };
    setStaff((prev) => [...prev, newStaff]);
  };

  // Computed Aggregates
  const todaySales = useMemo(() => {
    return sales.reduce((sum, s) => sum + s.total, 0);
  }, [sales]);

  const todayCash = useMemo(() => {
    const cashIn = cashflow.filter((c) => c.type === 'in' && c.mode === 'cash').reduce((sum, c) => sum + c.amount, 0);
    const cashOut = cashflow.filter((c) => c.type === 'out' && c.mode === 'cash').reduce((sum, c) => sum + c.amount, 0);
    return Math.max(0, 10000 + cashIn - cashOut); // base opening cash 10,000
  }, [cashflow]);

  const todayUdhaar = useMemo(() => {
    return customers.reduce((sum, c) => sum + c.due, 0);
  }, [customers]);

  const lowStockCount = useMemo(() => {
    return inventory.filter((i) => i.status === 'low' || i.status === 'critical').length;
  }, [inventory]);

  return (
    <AppContext.Provider
      value={{
        language,
        toggleLanguage,
        store,
        updateStore,
        isSyncing,
        syncNow,
        inventory,
        addProduct,
        updateStock,
        reorderStock,
        sales,
        createBill,
        customers,
        cashflow,
        addCustomer,
        recordCustomerPayment,
        recordExpense,
        sendWhatsAppReminder,
        shareInvoiceWhatsApp,
        suppliers,
        purchaseBills,
        addPurchaseBill,
        paySupplierBill,
        staff,
        isOwnerPunchedIn,
        ownerPunchTime,
        toggleOwnerPunch,
        setStaffStatus,
        addStaff,
        appMode,
        setAppMode,
        toggleAppMode,
        activeCustomerId,
        setActiveCustomerId,
        activeCustomer,
        customerCart,
        addToCustomerCart,
        updateCustomerCartQty,
        clearCustomerCart,
        sendParchiOrder,
        todaySales,
        todayCash,
        todayUdhaar,
        lowStockCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
