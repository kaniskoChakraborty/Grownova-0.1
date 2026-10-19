import React, { useState } from 'react';
import { X, CheckCircle2, FileText, UserPlus, Receipt, Calendar, ArrowRight, Landmark, ArrowUpRight } from 'lucide-react';

export type ActionModalType = 'invoice' | 'customer' | 'expense' | 'leave' | 'transfer' | null;

interface QuickActionModalsProps {
  activeModal: ActionModalType;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export const QuickActionModals: React.FC<QuickActionModalsProps> = ({
  activeModal,
  onClose,
  onNotify,
}) => {
  // Invoice form state
  const [invoiceCustomer, setInvoiceCustomer] = useState('Balaji Traders (Ahmedabad)');
  const [invoiceAmount, setInvoiceAmount] = useState('42,500');
  const [invoiceGst, setInvoiceGst] = useState('18');
  const [invoiceItems, setInvoiceItems] = useState('Pure Cotton Fabric - 250m');

  // Customer form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+91 98');
  const [customerCity, setCustomerCity] = useState('Surat');
  const [customerGstin, setCustomerGstin] = useState('');

  // Expense form state
  const [expenseCategory, setExpenseCategory] = useState('Logistics & Freight');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseVendor, setExpenseVendor] = useState('');

  // Leave form state
  const [leaveEmployee, setLeaveEmployee] = useState('Sunil Verma');
  const [leaveDays, setLeaveDays] = useState('2');
  const [leaveReason, setLeaveReason] = useState('Family function');

  // Fund Transfer form state
  const [transferBeneficiary, setTransferBeneficiary] = useState('Raymond Luxury Mills Ltd');
  const [transferAmount, setTransferAmount] = useState('1,25,000');
  const [transferMode, setTransferMode] = useState('RTGS Real-Time');
  const [transferPurpose, setTransferPurpose] = useState('Raw Material Settlement - Batch #804');

  if (!activeModal) return null;

  const handleInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify(`Invoice created for ${invoiceCustomer} (₹${invoiceAmount} + ${invoiceGst}% GST)`);
    onClose();
  };

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName) return;
    onNotify(`Customer "${customerName}" (${customerCity}) saved to CRM directory.`);
    onClose();
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseAmount) return;
    onNotify(`Expense of ₹${expenseAmount} (${expenseCategory}) recorded into ledger.`);
    onClose();
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify(`Leave approval confirmed for ${leaveEmployee} (${leaveDays} days).`);
    onClose();
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferAmount) return;
    onNotify(`Dispatched ₹${transferAmount} via ${transferMode} to ${transferBeneficiary}.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102B4E]/30 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg gn-panel rounded-[28px] p-6 sm:p-7 shadow-2xl border border-white/95 overflow-hidden bg-white/95"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#102B4E]/10 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F7EEDA] border border-[#C69A43]/30 flex items-center justify-center text-[#C69A43]">
              {activeModal === 'invoice' && <FileText className="w-5 h-5" />}
              {activeModal === 'customer' && <UserPlus className="w-5 h-5" />}
              {activeModal === 'expense' && <Receipt className="w-5 h-5" />}
              {activeModal === 'leave' && <Calendar className="w-5 h-5" />}
              {activeModal === 'transfer' && <Landmark className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#102B4E] tracking-tight leading-tight">
                {activeModal === 'invoice' && 'Create GST Tax Invoice'}
                {activeModal === 'customer' && 'Add New Customer Profile'}
                {activeModal === 'expense' && 'Record Business Expense'}
                {activeModal === 'leave' && 'Approve Staff Leave Request'}
                {activeModal === 'transfer' && 'Execute Operating Fund Transfer'}
              </h3>
              <p className="text-[12px] text-[#55677D] font-medium">
                {activeModal === 'invoice' && 'Instant GST invoice generation for Indian B2B & retail buyers'}
                {activeModal === 'customer' && 'Add customer record with GSTIN, location and credit terms'}
                {activeModal === 'expense' && 'Log petty cash, vendor billing or operational expense'}
                {activeModal === 'leave' && 'Review pending workforce attendance and approval ticket'}
                {activeModal === 'transfer' && 'Direct settlement from State Bank Escrow to vendor / statutory accounts'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-[#55677D] hover:text-[#102B4E] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL 1: CREATE INVOICE */}
        {activeModal === 'invoice' && (
          <form onSubmit={handleInvoiceSubmit} className="space-y-4">
            <div>
              <label className="text-[11.5px] font-bold text-[#102B4E] uppercase tracking-wider block mb-1">
                Select Buyer / Customer
              </label>
              <input
                type="text"
                required
                value={invoiceCustomer}
                onChange={(e) => setInvoiceCustomer(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-[#102B4E]/15 text-[13.5px] font-medium text-[#102B4E] focus:outline-none focus:ring-2 focus:ring-[#C69A43]/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11.5px] font-bold text-[#102B4E] uppercase tracking-wider block mb-1">
                  Taxable Amount (₹)
                </label>
                <input
                  type="text"
                  required
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-[#102B4E]/15 text-[13.5px] font-semibold text-[#102B4E] focus:outline-none focus:ring-2 focus:ring-[#C69A43]/40"
                />
              </div>
              <div>
                <label className="text-[11.5px] font-bold text-[#102B4E] uppercase tracking-wider block mb-1">
                  GST Rate
                </label>
                <select
                  value={invoiceGst}
                  onChange={(e) => setInvoiceGst(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-[#102B4E]/15 text-[13.5px] font-medium text-[#102B4E] focus:outline-none focus:ring-2 focus:ring-[#C69A43]/40"
                >
                  <option value="5">5% (Essential Goods)</option>
                  <option value="12">12% (Apparel / Hardware)</option>
                  <option value="18">18% (Standard Services/Goods)</option>
                  <option value="28">28% (Luxury / Specific)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11.5px] font-bold text-[#102B4E] uppercase tracking-wider block mb-1">
                Item Line Summary
              </label>
              <input
                type="text"
                value={invoiceItems}
                onChange={(e) => setInvoiceItems(e.target.value)}
                placeholder="e.g. Surat Cotton Khadi Roll - 250 Meters"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-[#102B4E]/15 text-[13.5px] font-medium text-[#102B4E] focus:outline-none focus:ring-2 focus:ring-[#C69A43]/40"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#F7F3EA] border border-[#C69A43]/25 flex items-center justify-between text-xs text-[#102B4E]">
              <span className="font-medium">Estimated Gross Total (incl. GST):</span>
              <span className="font-bold text-sm text-[#C69A43]">₹ 50,150</span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#55677D] hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#102B4E] hover:bg-[#0B2340] border border-[#C69A43]/40 flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
              >
                <span>Generate Invoice</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C69A43]" />
              </button>
            </div>
          </form>
        )}

        {/* MODAL 2: ADD CUSTOMER */}
        {activeModal === 'customer' && (
          <form onSubmit={handleCustomerSubmit} className="space-y-4">
            <div>
              <label className="text-[11.5px] font-bold text-[#102B4E] uppercase tracking-wider block mb-1">
                Business / Customer Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mahavir Silk House"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-[#102B4E]/15 text-[13.5px] font-medium text-[#102B4E] focus:outline-none focus:ring-2 focus:ring-[#C69A43]/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11.5px] font-bold text-[#102B4E] uppercase tracking-wider block mb-1">
                  Mobile / WhatsApp
                </label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-[#102B4E]/15 text-[13.5px] font-medium text-[#102B4E] focus:outline-none focus:ring-2 focus:ring-[#C69A43]/40"
                />
              </div>
              <div>
                <label className="text-[11.5px] font-bold text-[#102B4E] uppercase tracking-wider block mb-1">
                  City / Market
                </label>
                <input
                  type="text"
                  placeholder="e.g. Surat, Gujarat"
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-[#102B4E]/15 text-[13.5px] font-medium text-[#102B4E] focus:outline-none focus:ring-2 focus:ring-[#C69A43]/40"
                />
              </div>
            </div>

            <div>
              <label className="text-[11.5px] font-bold text-[#102B4E] uppercase tracking-wider block mb-1">
                GSTIN Number (Optional)
              </label>
              <input
                type="text"
                placeholder="24AAAAA0000A1Z5"
                value={customerGstin}
                onChange={(e) => setCustomerGstin(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-[#102B4E]/15 text-[13.5px] font-medium text-[#102B4E] uppercase focus:outline-none focus:ring-2 focus:ring-[#C69A43]/40"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#55677D] hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#102B4E] hover:bg-[#0B2340] border border-[#C69A43]/40 flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
              >
                <span>Save to CRM</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C69A43]" />
              </button>
            </div>
          </form>
        )}

        {/* MODAL 3: RECORD EXPENSE */}
        {activeModal === 'expense' && (
          <form onSubmit={handleExpenseSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11.5px] font-bold text-[#102B4E] uppercase tracking-wider block mb-1">
                  Expense Category
                </label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-[#102B4E]/15 text-[13.5px] font-medium text-[#102B4E] focus:outline-none focus:ring-2 focus:ring-[#C69A43]/40"
                >
                  <option value="Logistics & Freight">Logistics & Freight</option>
                  <option value="Raw Materials">Raw Materials</option>
                  <option value="Electricity & Utilities">Electricity & Utilities</option>
                  <option value="Office & Refreshments">Office & Refreshments</option>
                  <option value="Maintenance & Spares">Maintenance & Spares</option>
                </select>
              </div>
              <div>
                <label className="text-[11.5px] font-bold text-[#102B4E] uppercase tracking-wider block mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  placeholder="8500"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-[#102B4E]/15 text-[13.5px] font-semibold text-[#102B4E] focus:outline-none focus:ring-2 focus:ring-[#C69A43]/40"
                />
              </div>
            </div>

            <div>
              <label className="text-[11.5px] font-bold text-[#102B4E] uppercase tracking-wider block mb-1">
                Vendor / Payee
              </label>
              <input
                type="text"
                placeholder="e.g. Om Logistics Express"
                value={expenseVendor}
                onChange={(e) => setExpenseVendor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-[#102B4E]/15 text-[13.5px] font-medium text-[#102B4E] focus:outline-none focus:ring-2 focus:ring-[#C69A43]/40"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#55677D] hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#102B4E] hover:bg-[#0B2340] border border-[#C69A43]/40 flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
              >
                <span>Record Expense</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C69A43]" />
              </button>
            </div>
          </form>
        )}

        {/* MODAL 4: APPROVE LEAVE */}
        {activeModal === 'leave' && (
          <form onSubmit={handleLeaveSubmit} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#F7EEDA]/70 border border-[#C69A43]/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#102B4E] text-white flex items-center justify-center font-bold text-xs">
                  SV
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#102B4E]">{leaveEmployee}</h4>
                  <p className="text-[11px] text-[#55677D]">Senior Dyeing Master • Ops Team</p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-[#C69A43] border border-amber-300">
                Pending Approval
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11.5px] font-bold text-[#102B4E] uppercase tracking-wider block mb-1">
                  Employee Name
                </label>
                <input
                  type="text"
                  value={leaveEmployee}
                  onChange={(e) => setLeaveEmployee(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-[#102B4E]/15 text-[13.5px] font-medium text-[#102B4E] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11.5px] font-bold text-[#102B4E] uppercase tracking-wider block mb-1">
                  Days Requested
                </label>
                <input
                  type="text"
                  value={leaveDays}
                  onChange={(e) => setLeaveDays(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-[#102B4E]/15 text-[13.5px] font-medium text-[#102B4E] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11.5px] font-bold text-[#102B4E] uppercase tracking-wider block mb-1">
                Reason
              </label>
              <input
                type="text"
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-[#102B4E]/15 text-[13.5px] font-medium text-[#102B4E] focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onNotify(`Leave request rejected for ${leaveEmployee}.`);
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
              >
                Reject
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#102B4E] hover:bg-[#0B2340] border border-[#C69A43]/40 flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
              >
                <span>Approve Leave</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C69A43]" />
              </button>
            </div>
          </form>
        )}

        {/* MODAL 5: EXECUTE ESCROW FUND TRANSFER */}
        {activeModal === 'transfer' && (
          <form onSubmit={handleTransferSubmit} className="space-y-4">
            {/* Source Account Info Box */}
            <div className="p-3.5 rounded-2xl bg-[#F7F3EA] border border-[#C69A43]/25 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#55677D] uppercase tracking-wider block">
                  Debiting Source Reserve
                </span>
                <span className="text-xs font-bold text-[#102B4E] block mt-0.5">
                  State Bank Escrow A/c • Primary Operating Pool
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#55677D] block">Available Liquid Pool</span>
                <span className="text-xs font-bold text-[#15803D] tabular-nums">₹ 84,25,000</span>
              </div>
            </div>

            <div>
              <label className="text-[11.5px] font-bold text-[#102B4E] uppercase tracking-wider block mb-1">
                Beneficiary Name / Enterprise Entity
              </label>
              <input
                type="text"
                required
                value={transferBeneficiary}
                onChange={(e) => setTransferBeneficiary(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-[#102B4E]/15 text-[13.5px] font-medium text-[#102B4E] focus:outline-none focus:ring-2 focus:ring-[#C69A43]/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11.5px] font-bold text-[#102B4E] uppercase tracking-wider block mb-1">
                  Transfer Amount (₹)
                </label>
                <input
                  type="text"
                  required
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-[#102B4E]/15 text-[13.5px] font-bold text-[#102B4E] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#C69A43]/40"
                />
              </div>
              <div>
                <label className="text-[11.5px] font-bold text-[#102B4E] uppercase tracking-wider block mb-1">
                  Settlement Rail
                </label>
                <select
                  value={transferMode}
                  onChange={(e) => setTransferMode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-[#102B4E]/15 text-[13.5px] font-medium text-[#102B4E] focus:outline-none focus:ring-2 focus:ring-[#C69A43]/40"
                >
                  <option value="RTGS Real-Time">RTGS (High Value Real-Time)</option>
                  <option value="NEFT Scheduled Batch">NEFT (Statutory Batch)</option>
                  <option value="IMPS Direct Relay">IMPS (Instant 24x7)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11.5px] font-bold text-[#102B4E] uppercase tracking-wider block mb-1">
                Purpose / Ledger Reference
              </label>
              <input
                type="text"
                value={transferPurpose}
                onChange={(e) => setTransferPurpose(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-[#102B4E]/15 text-[13.5px] font-medium text-[#102B4E] focus:outline-none focus:ring-2 focus:ring-[#C69A43]/40"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#55677D] hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#102B4E] hover:bg-[#0B2340] border border-[#C69A43]/40 flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
              >
                <span>Authorize Escrow Transfer</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#C69A43]" />
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
