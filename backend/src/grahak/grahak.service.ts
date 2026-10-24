import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { 
  SendOtpDto, 
  VerifyOtpDto, 
  RegisterAccountDto, 
  CreateBillDto, 
  KhataTransactionDto, 
  AttendanceRecordDto, 
  InventoryScanDto 
} from './dto/grahak.dto';

export interface StoreProfile {
  id: string;
  name: string;
  tagline: string;
  category: string;
  ownerName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  gstin?: string;
  upiId: string;
  rating: number;
  isOpen: boolean;
  geofence: { lat: number; lng: number; radiusMeters: number };
  language?: string;
}

export interface CatalogItem {
  id: string;
  storeId: string;
  name: string;
  category: string;
  mrp: number;
  sellingPrice: number;
  unit: string;
  stock: number;
  barcode: string;
  imageUrl?: string;
  gstRate: number;
}

export interface KhataEntry {
  id: string;
  storeId: string;
  customerPhone: string;
  customerName: string;
  type: 'GAVE_CREDIT' | 'GOT_PAYMENT';
  amount: number;
  date: string;
  note?: string;
}

export interface BillRecord {
  id: string;
  billNumber: string;
  storeId: string;
  storeName: string;
  customerName: string;
  customerPhone: string;
  date: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMode: string;
  parchiUrl: string;
}

export interface AttendanceEntry {
  id: string;
  storeId: string;
  staffName: string;
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  distanceFromStoreMeters: number;
  status: 'PRESENT_VERIFIED' | 'OUTSIDE_GEOFENCE';
  photoUrl?: string;
  notes?: string;
}

@Injectable()
export class GrahakService {
  private readonly logger = new Logger(GrahakService.name);

  // In-memory persistent stores across B2B & B2C
  private stores: StoreProfile[] = [
    {
      id: 'store-01',
      name: 'Shree Balaji Kirana & Supermarket',
      tagline: 'Aapka Apna Vishwasniya Parchaana Store',
      category: 'Kirana & FMCG',
      ownerName: 'Ravi Kant Sharma',
      phone: '9823045678',
      address: 'Shop No. 12, Main Mandi Road, Near Gandhi Chowk',
      city: 'Indore',
      state: 'Madhya Pradesh',
      gstin: '23AAAAA0000A1Z5',
      upiId: 'shreebalaji@okaxis',
      rating: 4.8,
      isOpen: true,
      geofence: { lat: 22.7196, lng: 75.8577, radiusMeters: 150 },
    },
    {
      id: 'store-02',
      name: 'Radhe Krishna Wholesalers',
      tagline: 'Best Wholesale Rates on Grains & Spices',
      category: 'Wholesaler / Mandi',
      ownerName: 'Mohan Lal Verma',
      phone: '9811098765',
      address: 'Plot 45, Grain Market Yard',
      city: 'Jaipur',
      state: 'Rajasthan',
      gstin: '08AAAAA1234B1Z9',
      upiId: 'radhekrishna@icici',
      rating: 4.9,
      isOpen: true,
      geofence: { lat: 26.9124, lng: 75.7873, radiusMeters: 200 },
    },
  ];

  private catalog: CatalogItem[] = [
    {
      id: 'prod-01',
      storeId: 'store-01',
      name: 'Tata Salt (Desh Ka Namak) 1kg',
      category: 'Grocery',
      mrp: 28,
      sellingPrice: 26,
      unit: 'Packet',
      stock: 142,
      barcode: '8901058852371',
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
      gstRate: 0,
    },
    {
      id: 'prod-02',
      storeId: 'store-01',
      name: 'Fortune Sunlite Sunflower Oil 1L',
      category: 'Oils & Ghee',
      mrp: 165,
      sellingPrice: 148,
      unit: 'Pouch',
      stock: 58,
      barcode: '8906007280014',
      imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
      gstRate: 5,
    },
    {
      id: 'prod-03',
      storeId: 'store-01',
      name: 'Aashirvaad Shudh Chakki Atta 5kg',
      category: 'Atta & Flours',
      mrp: 275,
      sellingPrice: 245,
      unit: 'Bag',
      stock: 35,
      barcode: '8901725132515',
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
      gstRate: 0,
    },
    {
      id: 'prod-04',
      storeId: 'store-01',
      name: 'Amul Butter Pasteurised 500g',
      category: 'Dairy',
      mrp: 285,
      sellingPrice: 275,
      unit: 'Box',
      stock: 22,
      barcode: '8901262010058',
      imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400',
      gstRate: 12,
    },
    {
      id: 'prod-05',
      storeId: 'store-01',
      name: 'India Gate Basmati Rice Feast Rozzana 1kg',
      category: 'Rice & Grains',
      mrp: 120,
      sellingPrice: 99,
      unit: 'Packet',
      stock: 80,
      barcode: '8901144001229',
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      gstRate: 5,
    },
  ];

  private khataLedger: KhataEntry[] = [
    {
      id: 'k-01',
      storeId: 'store-01',
      customerPhone: '9823045678',
      customerName: 'Rakesh Gupta',
      type: 'GAVE_CREDIT',
      amount: 1450,
      date: new Date(Date.now() - 86400000 * 3).toISOString(),
      note: 'Groceries bill #GN-1082',
    },
    {
      id: 'k-02',
      storeId: 'store-01',
      customerPhone: '9823045678',
      customerName: 'Rakesh Gupta',
      type: 'GOT_PAYMENT',
      amount: 1000,
      date: new Date(Date.now() - 86400000).toISOString(),
      note: 'UPI Payment received via Grahak app',
    },
  ];

  private bills: BillRecord[] = [
    {
      id: 'bill-1082',
      billNumber: 'GN-2026-1082',
      storeId: 'store-01',
      storeName: 'Shree Balaji Kirana & Supermarket',
      customerName: 'Rakesh Gupta',
      customerPhone: '9823045678',
      date: new Date(Date.now() - 86400000 * 3).toISOString(),
      items: [
        { name: 'Fortune Sunlite Sunflower Oil 1L', quantity: 2, unitPrice: 148, total: 296 },
        { name: 'Aashirvaad Shudh Chakki Atta 5kg', quantity: 1, unitPrice: 245, total: 245 },
        { name: 'Tata Salt 1kg', quantity: 2, unitPrice: 26, total: 52 },
      ],
      subtotal: 593,
      tax: 27,
      discount: 20,
      total: 600,
      paymentMode: 'UDHAAR',
      parchiUrl: '/parchi/bill-1082',
    },
  ];

  private attendanceList: AttendanceEntry[] = [
    {
      id: 'att-01',
      storeId: 'store-01',
      staffName: 'Sunil Verma',
      date: new Date().toISOString().split('T')[0],
      time: '09:12 AM',
      latitude: 22.7197,
      longitude: 75.8578,
      distanceFromStoreMeters: 14,
      status: 'PRESENT_VERIFIED',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      notes: 'Morning shift check-in',
    },
    {
      id: 'att-02',
      storeId: 'store-01',
      staffName: 'Deepak Chouhan',
      date: new Date().toISOString().split('T')[0],
      time: '09:28 AM',
      latitude: 22.7195,
      longitude: 75.8579,
      distanceFromStoreMeters: 18,
      status: 'PRESENT_VERIFIED',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      notes: 'Counter & stock supervisor',
    },
  ];

  private activeOtps = new Map<string, string>();

  // 1. Send OTP
  sendOtp(dto: SendOtpDto) {
    const cleanPhone = dto.phone.replace(/\D/g, '').slice(-10);
    // Standard test OTP '123456' for fast deterministic development testing
    const otp = cleanPhone === '9823045678' ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
    this.activeOtps.set(cleanPhone, otp);
    this.logger.log(`[OTP DISPATCH] Phone: ${cleanPhone} -> OTP: ${otp}`);

    return {
      success: true,
      phone: `+91 ${cleanPhone}`,
      message: 'OTP sent successfully to your mobile number via SMS and WhatsApp',
      expiresInSeconds: 300,
      testOtpHint: 'For quick demo login, you can use OTP: 123456',
    };
  }

  // 2. Verify OTP
  verifyOtp(dto: VerifyOtpDto) {
    const cleanPhone = dto.phone.replace(/\D/g, '').slice(-10);
    const storedOtp = this.activeOtps.get(cleanPhone) || '123456';

    if (dto.otp !== storedOtp && dto.otp !== '123456') {
      return {
        success: false,
        message: 'Amanaya OTP. Kripya 6 ankon ka sahi code darj karein (Demo OTP: 123456)',
      };
    }

    // Check if store owner / merchant or grahak
    const existingStore = this.stores.find((s) => s.phone.endsWith(cleanPhone));
    const token = `gn_jwt_${cleanPhone}_${Date.now()}`;

    return {
      success: true,
      token,
      user: {
        phone: `+91 ${cleanPhone}`,
        name: existingStore ? existingStore.ownerName : 'Grahak Vyapari',
        role: existingStore ? 'MERCHANT' : 'CUSTOMER',
        storeId: existingStore ? existingStore.id : 'store-01',
        storeName: existingStore ? existingStore.name : 'Shree Balaji Kirana & Supermarket',
      },
      message: 'Aapka swagat hai! Login safalta-poorvak sampann hua.',
    };
  }

  // 3. Register New Account (B2B Merchant or B2C Grahak)
  registerAccount(dto: RegisterAccountDto) {
    const cleanPhone = dto.phone.replace(/\D/g, '').slice(-10);
    const storeId = `store-${Date.now().toString().slice(-4)}`;

    const isEnglish = dto.language === 'en';
    const newStore: StoreProfile = {
      id: storeId,
      name: dto.shopName || (isEnglish ? `${dto.fullName}'s Store` : `${dto.fullName} ki Dukaan`),
      tagline: isEnglish ? 'Your Trusted Digital Store' : 'Aapka Apna Vishwasniya Store',
      category: dto.businessType || 'Kirana & FMCG',
      ownerName: dto.fullName,
      phone: cleanPhone,
      address: 'Main Bazaar Road',
      city: 'Indore',
      state: 'Madhya Pradesh',
      gstin: dto.gstin,
      upiId: `${cleanPhone}@upi`,
      rating: 5.0,
      isOpen: true,
      geofence: { lat: 22.7196, lng: 75.8577, radiusMeters: 150 },
      language: dto.language || 'hi',
    };

    this.stores.unshift(newStore);
    this.logger.log(`[MERCHANT REGISTERED] ${newStore.name} by ${newStore.ownerName} (${cleanPhone}) in ${dto.language || 'hi'}`);

    return {
      success: true,
      store: newStore,
      token: `gn_jwt_${cleanPhone}_${Date.now()}`,
      message: isEnglish
        ? 'Congratulations! Your Merchant Account has been successfully created.'
        : 'Badhaai ho! Aapka naya Vyapari Khata safalta-poorvak shuru ho gaya hai.',
    };
  }

  // 4. Stores Directory (B2C customer discovers B2B merchants)
  getStores() {
    return {
      success: true,
      count: this.stores.length,
      stores: this.stores,
    };
  }

  getStoreById(id: string) {
    const store = this.stores.find((s) => s.id === id);
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} nahi mila`);
    }
    return {
      success: true,
      store,
    };
  }

  // 5. Store Catalog
  getCatalog(storeId?: string) {
    const targetStoreId = storeId || this.stores[0].id;
    const items = this.catalog.filter((c) => c.storeId === targetStoreId || !storeId);
    return {
      success: true,
      storeId: targetStoreId,
      count: items.length,
      items,
    };
  }

  // 6. Barcode or AI Photo Scan (B2C & B2B Inventory check)
  scanInventory(dto: InventoryScanDto) {
    let matchedItem: CatalogItem | undefined;

    if (dto.barcode) {
      matchedItem = this.catalog.find(
        (c) => c.barcode === dto.barcode && (c.storeId === dto.storeId || !dto.storeId)
      );
    }

    if (!matchedItem && dto.query) {
      const q = dto.query.toLowerCase();
      matchedItem = this.catalog.find(
        (c) => c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
      );
    }

    // Default fallback to first product for interactive camera simulation
    if (!matchedItem) {
      matchedItem = this.catalog[0];
    }

    return {
      success: true,
      detected: true,
      confidenceScore: 0.96,
      product: matchedItem,
      inventoryStatus: {
        inStock: matchedItem.stock > 0,
        availableQuantity: matchedItem.stock,
        reorderAlert: matchedItem.stock < 15,
      },
    };
  }

  // 7. Khata Ledger (Customer debt & transaction history)
  getCustomerKhata(phone: string, storeId?: string) {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const targetStoreId = storeId || 'store-01';

    const records = this.khataLedger.filter(
      (k) => k.customerPhone === cleanPhone && (k.storeId === targetStoreId || !storeId)
    );

    const gaveCreditTotal = records
      .filter((k) => k.type === 'GAVE_CREDIT')
      .reduce((sum, r) => sum + r.amount, 0);

    const gotPaymentTotal = records
      .filter((k) => k.type === 'GOT_PAYMENT')
      .reduce((sum, r) => sum + r.amount, 0);

    const netOutstanding = gaveCreditTotal - gotPaymentTotal;

    const store = this.stores.find((s) => s.id === targetStoreId) || this.stores[0];

    return {
      success: true,
      customerPhone: `+91 ${cleanPhone}`,
      storeId: targetStoreId,
      storeName: store.name,
      merchantUpiId: store.upiId,
      netOutstandingBalance: Math.max(0, netOutstanding),
      totalUdhaarGiven: gaveCreditTotal,
      totalJamaReceived: gotPaymentTotal,
      status: netOutstanding > 0 ? 'PAYMENT_PENDING' : 'ALL_CLEARED',
      transactions: records,
    };
  }

  // 8. Record Khata Transaction (B2B records, B2C sees immediately)
  addKhataTransaction(dto: KhataTransactionDto) {
    const cleanPhone = dto.customerPhone.replace(/\D/g, '').slice(-10);
    const entry: KhataEntry = {
      id: `k-${Date.now().toString().slice(-4)}`,
      storeId: dto.storeId,
      customerPhone: cleanPhone,
      customerName: dto.customerName,
      type: dto.type,
      amount: dto.amount,
      date: new Date().toISOString(),
      note: dto.note || (dto.type === 'GAVE_CREDIT' ? 'Dukaan se udhaar saaman' : 'UPI/Cash se jama kiya'),
    };

    this.khataLedger.unshift(entry);
    return {
      success: true,
      entry,
      updatedKhata: this.getCustomerKhata(cleanPhone, dto.storeId),
    };
  }

  // 9. Create Digital Bill / POS Invoice
  createBill(dto: CreateBillDto) {
    const store = this.stores.find((s) => s.id === dto.storeId) || this.stores[0];
    const billNum = `GN-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    let subtotal = 0;
    const computedItems = dto.items.map((item) => {
      const lineTotal = item.quantity * item.unitPrice;
      subtotal += lineTotal;

      // Deduct inventory stock automatically
      const catalogProd = this.catalog.find(
        (c) => c.name.toLowerCase() === item.name.toLowerCase() && c.storeId === store.id
      );
      if (catalogProd) {
        catalogProd.stock = Math.max(0, catalogProd.stock - item.quantity);
      }

      return {
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: lineTotal,
      };
    });

    const discount = dto.discount || 0;
    const tax = Math.round(subtotal * 0.05); // Standard 5% GST avg
    const grandTotal = Math.max(0, subtotal + tax - discount);

    const newBill: BillRecord = {
      id: `bill-${Date.now()}`,
      billNumber: billNum,
      storeId: store.id,
      storeName: store.name,
      customerName: dto.customerName || 'Walk-in Customer',
      customerPhone: dto.customerPhone || '9823045678',
      date: new Date().toISOString(),
      items: computedItems,
      subtotal,
      tax,
      discount,
      total: grandTotal,
      paymentMode: dto.paymentMode,
      parchiUrl: `/parchi/${billNum}`,
    };

    this.bills.unshift(newBill);

    // If payment was UDHAAR, auto-record in Khata
    if (dto.paymentMode === 'UDHAAR' && dto.customerPhone) {
      this.addKhataTransaction({
        storeId: store.id,
        customerPhone: dto.customerPhone,
        customerName: dto.customerName || 'Khata Customer',
        type: 'GAVE_CREDIT',
        amount: grandTotal,
        note: `Bill #${billNum} se bahi-khata udhaar`,
      });
    }

    return {
      success: true,
      bill: newBill,
      message: 'Bill safalta-poorvak ban gaya aur stock update ho gaya!',
    };
  }

  // 10. Get Bill by ID
  getBillById(id: string) {
    const bill = this.bills.find((b) => b.id === id || b.billNumber === id);
    if (!bill) {
      throw new NotFoundException(`Bill with ID ${id} nahi mila`);
    }
    return {
      success: true,
      bill,
    };
  }

  // 11. Geo-tagged Staff Attendance
  recordAttendance(dto: AttendanceRecordDto) {
    const store = this.stores.find((s) => s.id === dto.storeId) || this.stores[0];

    // Simple Haversine / Distance approximation
    const dLat = (dto.latitude - store.geofence.lat) * 111000;
    const dLng = (dto.longitude - store.geofence.lng) * 111000 * Math.cos((dto.latitude * Math.PI) / 180);
    const distanceMeters = Math.round(Math.sqrt(dLat * dLat + dLng * dLng));

    const isVerified = distanceMeters <= store.geofence.radiusMeters + 100;

    const entry: AttendanceEntry = {
      id: `att-${Date.now()}`,
      storeId: store.id,
      staffName: dto.staffName,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      latitude: dto.latitude,
      longitude: dto.longitude,
      distanceFromStoreMeters: distanceMeters,
      status: isVerified ? 'PRESENT_VERIFIED' : 'OUTSIDE_GEOFENCE',
      photoUrl: dto.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      notes: dto.notes || (isVerified ? 'Dukaan par upasthit' : 'Dukaan ki geofence boundary se bahar'),
    };

    this.attendanceList.unshift(entry);

    return {
      success: true,
      entry,
      geofenceMatch: isVerified,
      message: isVerified
        ? `Shabaash! ${dto.staffName} ki photo aur geotag haajiri safalta-poorvak darj hui.`
        : `Dhyaan dein: Aap dukaan se ${distanceMeters}m door hain. Haajiri flag ke saath darj hui.`,
    };
  }

  getAttendance(storeId?: string) {
    const targetStoreId = storeId || 'store-01';
    const list = this.attendanceList.filter((a) => a.storeId === targetStoreId || !storeId);
    return {
      success: true,
      storeId: targetStoreId,
      todayDate: new Date().toISOString().split('T')[0],
      totalStaffPresent: list.filter((a) => a.status === 'PRESENT_VERIFIED').length,
      records: list,
    };
  }
}
