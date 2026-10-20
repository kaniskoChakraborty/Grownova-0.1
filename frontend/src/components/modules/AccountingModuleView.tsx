import React, { useState } from 'react';
import {
  Search,
  Plus,
  UploadCloud,
  FileText,
  CheckCircle2,
  Download,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext';

interface Voucher {
  id: string;
  date: string;
  refNo: string;
  party: string;
  type: 'Sales Invoice' | 'Payment' | 'Expense' | 'Credit Note';
  debit: string;
  credit: string;
  balance: string;
  gstStatus: 'Reconciled' | 'Pending' | 'Exempt';
}

const INITIAL_VOUCHERS: Voucher[] = [
  {
    id: 'v-01',
    date: '12 Oct 2026',
    refNo: 'INV-2026-108',
    party: 'Balaji Traders (Ahmedabad)',
    type: 'Sales Invoice',
    debit: '—',
    credit: '₹ 42,500',
    balance: '₹ 12,42,500',
    gstStatus: 'Reconciled'
  },
  {
    id: 'v-02',
    date: '12 Oct 2026',
    refNo: 'PAY-2026-091',
    party: 'HDFC Bank Current A/c',
    type: 'Payment',
    debit: '₹ 25,000',
    credit: '—',
    balance: '₹ 12,00,000',
    gstStatus: 'Exempt'
  },
  {
    id: 'v-03',
    date: '11 Oct 2026',
    refNo: 'EXP-2026-084',
    party: 'Om Logistics Express (Freight)',
    type: 'Expense',
    debit: '₹ 4,200',
    credit: '—',
    balance: '₹ 12,25,000',
    gstStatus: 'Reconciled'
  },
  {
    id: 'v-04',
    date: '10 Oct 2026',
    refNo: 'INV-2026-107',
    party: 'Shree Mahavir Textiles (Surat)',
    type: 'Sales Invoice',
    debit: '—',
    credit: '₹ 1,20,000',
    balance: '₹ 12,29,200',
    gstStatus: 'Reconciled'
  },
  {
    id: 'v-05',
    date: '09 Oct 2026',
    refNo: 'TAX-2026-042',
    party: 'GST Output CGST/SGST (18%)',
    type: 'Sales Invoice',
    debit: '—',
    credit: '₹ 21,600',
    balance: '₹ 11,09,200',
    gstStatus: 'Reconciled'
  },
  {
    id: 'v-06',
    date: '08 Oct 2026',
    refNo: 'PAY-2026-090',
    party: 'Reliance Retail Godown Supplier',
    type: 'Payment',
    debit: '₹ 50,000',
    credit: '—',
    balance: '₹ 10,87,600',
    gstStatus: 'Pending'
  }
];

interface AccountingModuleViewProps {
  onNotify?: (msg: string) => void;
  onOpenActionModal?: (type: 'invoice' | 'expense') => void;
}

export const AccountingModuleView: React.FC<AccountingModuleViewProps> = ({
  onNotify = () => {},
  onOpenActionModal = () => {}
}) => {
  const { isDemoMode } = useAuth();
  const [vouchers] = useState<Voucher[]>(INITIAL_VOUCHERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  // Tally & Excel migration upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [migrationSummary, setMigrationSummary] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadError(null);
    }
  };

  const handleUploadMigration = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    if (!selectedFile) {
      if (isDemoMode) {
        simulateMigration('TallyPrime_Backup_DayBook.xml');
        return;
      }
      setUploadStatus('error');
      setUploadError('Please select a valid .xml, .xlsx, or .xls file to upload.');
      return;
    }

    // Client-side extension validation
    const ext = selectedFile.name.toLowerCase().split('.').pop();
    if (!['xml', 'xlsx', 'xls'].includes(ext || '')) {
      setUploadStatus('error');
      setUploadError('Unsupported file type. Please upload a .xml (Tally DayBook) or .xlsx/.xls (Excel) workbook.');
      return;
    }

    if (isDemoMode) {
      simulateMigration(selectedFile.name);
      return;
    }

    setUploadStatus('uploading');
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const data = await apiClient.upload<any>('/migration/upload', formData);

      setUploadStatus('success');
      const count = Array.isArray(data) ? data.length : (data.vouchersCount || data.count || 'batch');
      setMigrationSummary(
        `Successfully imported and parsed ${count} ledger records from "${selectedFile.name}" into Double-Entry Ledger.`
      );
      onNotify(`Tally/Excel migration complete: ${selectedFile.name} integrated with backend.`);
    } catch (err: any) {
      setUploadStatus('error');
      setUploadError(err.message || 'Failed to upload and parse migration file.');
      onNotify(`Migration upload error: ${err.message || 'Request failed'}`);
    }
  };

  const simulateMigration = (fileName: string) => {
    setUploadStatus('uploading');
    setTimeout(() => {
      setUploadStatus('success');
      setMigrationSummary(
        `[Demo Mode] Parsed 148 Vouchers (112 Sales, 24 Payments, 12 Expenses) & 46 Ledger Master Accounts from "${fileName}". Balance is zero-error reconciled.`
      );
      onNotify(`[Demo] Parsed 148 vouchers from ${fileName} into Double-Entry Ledger.`);
    }, 700);
  };

  const filteredVouchers = vouchers.filter(v => {
    const matchesSearch =
      v.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.refNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || v.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#102B4E]/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102B4E] leading-tight">
            GST & Double-Entry Accounting
          </h1>
          <p className="text-xs sm:text-sm text-[#55677D] mt-0.5">
            Automated general ledgers, Tally Prime / ERP 9 XML sync, voucher generation & GSTR-1 draft engine.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onOpenActionModal('invoice')}
            className="px-4 py-2 rounded-full bg-[#102B4E] hover:bg-[#0B2340] text-white text-xs font-bold border border-[#C69A43]/40 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#C69A43]" />
            <span>Create Tax Invoice</span>
          </button>
          <button
            onClick={() => onOpenActionModal('expense')}
            className="px-4 py-2 rounded-full bg-white/80 hover:bg-white text-[#102B4E] text-xs font-bold border border-white/90 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#C69A43]" />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* 4 Canonical KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="gn-panel p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#55677D]">B2B Turnover</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              +12.8% MoM
            </span>
          </div>
          <div className="mt-1">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102B4E] tabular-nums">₹ 28.4L</div>
            <div className="text-[11px] text-[#55677D] mt-0.5">148 Total Invoices in Oct</div>
          </div>
        </div>

        <div className="gn-panel p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#55677D]">Receivables</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-[#C69A43] border border-amber-200">
              4 Overdue
            </span>
          </div>
          <div className="mt-1">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102B4E] tabular-nums">₹ 6.80L</div>
            <div className="text-[11px] text-[#55677D] mt-0.5">Credit aging: 22 Days avg</div>
          </div>
        </div>

        <div className="gn-panel p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#55677D]">Vendor Payables</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Due in 7d
            </span>
          </div>
          <div className="mt-1">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102B4E] tabular-nums">₹ 3.20L</div>
            <div className="text-[11px] text-[#55677D] mt-0.5">3 Raw material vendors</div>
          </div>
        </div>

        <div className="gn-panel p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#55677D]">Net GST Liability</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F7EEDA] text-[#C69A43] border border-[#C69A43]/40">
              GSTR-1 Draft
            </span>
          </div>
          <div className="mt-1">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102B4E] tabular-nums">₹ 1.45L</div>
            <div className="text-[11px] text-[#55677D] mt-0.5">Eligible ITC: ₹48,600</div>
          </div>
        </div>
      </div>

      {/* Tally XML / Excel Parser & GSTR-1 Summary (Two-Column Bento Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Card 1: Universal Legacy Tally XML / Excel Migration Engine */}
        <div className="gn-panel p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#102B4E]/10 mb-3">
            <div className="flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-[#C69A43]" />
              <h3 className="text-sm sm:text-base font-bold text-[#102B4E] tracking-tight">
                Tally Prime & Excel Migration Engine
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-[#C69A43] border border-amber-200">
              POST /migration/upload
            </span>
          </div>

          <p className="text-xs text-[#55677D] mb-3">
            Upload exported Tally XML DayBook or sales Excel workbook to synchronize with double-entry ledgers:
          </p>

          <form onSubmit={handleUploadMigration} className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-white/70 border border-dashed border-[#C69A43]/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F7EEDA] flex items-center justify-center text-[#C69A43] flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#102B4E]">
                    {selectedFile ? selectedFile.name : 'Select or drop Tally XML / Excel'}
                  </div>
                  <div className="text-[11px] text-[#55677D]">
                    {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Supports .xml, .xlsx, .csv format'}
                  </div>
                </div>
              </div>

              <label className="px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-[#102B4E] cursor-pointer shadow-2xs">
                Browse File
                <input
                  type="file"
                  accept=".xml,.xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#55677D]">Zero data-loss XML parser</span>
              <button
                type="submit"
                disabled={uploadStatus === 'uploading'}
                className="px-4 py-2 rounded-full bg-[#102B4E] hover:bg-[#0B2340] text-white text-xs font-bold border border-[#C69A43]/40 shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#C69A43] ${uploadStatus === 'uploading' ? 'animate-spin' : ''}`} />
                <span>{uploadStatus === 'uploading' ? 'Parsing Vouchers…' : 'Sync into GrowNova Ledger'}</span>
              </button>
            </div>
          </form>

          {uploadError && (
            <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 animate-in fade-in flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">{uploadError}</div>
            </div>
          )}

          {migrationSummary && (
            <div className="mt-3 p-3 rounded-xl bg-[#F7EEDA]/60 border border-[#C69A43]/30 text-xs text-[#102B4E] animate-in fade-in flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{migrationSummary}</span>
            </div>
          )}
        </div>

        {/* Card 2: GSTR-1 & GSTR-3B Tax Liability Preview */}
        <div className="gn-panel p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#102B4E]/10 mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#102B4E]" />
              <h3 className="text-sm sm:text-base font-bold text-[#102B4E] tracking-tight">
                GST Monthly Return Telemetry (October 2026)
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Auto-Reconciled
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded-xl bg-white/70">
              <span className="text-[#55677D]">Total Taxable Supplies (Outward B2B):</span>
              <span className="font-bold text-[#102B4E]">₹ 24,06,780</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-xl bg-white/70 flex justify-between">
                <span className="text-[#55677D]">CGST (9%):</span>
                <span className="font-bold text-[#102B4E]">₹ 2,16,610</span>
              </div>
              <div className="p-2 rounded-xl bg-white/70 flex justify-between">
                <span className="text-[#55677D]">SGST (9%):</span>
                <span className="font-bold text-[#102B4E]">₹ 2,16,610</span>
              </div>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-white/70">
              <span className="text-[#55677D]">Eligible Input Tax Credit (ITC Set-off):</span>
              <span className="font-bold text-emerald-700">- ₹ 48,600</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-[#F7EEDA] border border-[#C69A43]/40 text-xs">
              <span className="font-bold text-[#102B4E]">Net Payable Cash Ledger Liability:</span>
              <span className="font-bold text-[#102B4E] text-sm">₹ 3,84,620</span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-[#102B4E]/10 flex items-center justify-between text-[11px] text-[#55677D]">
            <span>Due Date: 20th Nov 2026</span>
            <button
              onClick={() => onNotify('GSTR-1 JSON export prepared for GST Portal upload.')}
              className="text-[#C69A43] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>Download GSTR-1 JSON</span>
            </button>
          </div>
        </div>

      </div>

      {/* General Ledger Table */}
      <div className="gn-panel p-5">
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#102B4E]/10 mb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Sales Invoice', 'Payment', 'Expense'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  typeFilter === type
                    ? 'bg-[#F7EEDA] text-[#102B4E] border border-[#C69A43]/40 font-bold shadow-2xs'
                    : 'text-[#55677D] hover:text-[#102B4E] hover:bg-white/70'
                }`}
              >
                {type === 'All' ? `All Vouchers (${vouchers.length})` : type}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#55677D] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search account or voucher ref..."
              className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white/80 border border-[#102B4E]/15 text-xs text-[#102B4E] focus:outline-none focus:ring-1 focus:ring-[#C69A43]"
            />
          </div>
        </div>

        {/* Double-Entry Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#102B4E]/10 text-[#55677D] font-bold uppercase tracking-wider text-[10.5px]">
                <th className="py-2.5 px-3">Date & Ref No.</th>
                <th className="py-2.5 px-3">Account Head / Party</th>
                <th className="py-2.5 px-3">Voucher Type</th>
                <th className="py-2.5 px-3 text-right">Debit (₹)</th>
                <th className="py-2.5 px-3 text-right">Credit (₹)</th>
                <th className="py-2.5 px-3 text-right">Balance (₹)</th>
                <th className="py-2.5 px-3 text-center">GST Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#102B4E]/5">
              {filteredVouchers.map((v) => (
                <tr key={v.id} className="hover:bg-white/60 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#102B4E]">{v.refNo}</div>
                    <div className="text-[11px] text-[#55677D]">{v.date}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-[#102B4E]">{v.party}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-white/80 border border-[#102B4E]/10 text-[#102B4E]">
                      {v.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-[#102B4E]">
                    {v.debit !== '—' ? (
                      <span className="text-rose-700 font-bold">{v.debit}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-[#102B4E]">
                    {v.credit !== '—' ? (
                      <span className="text-emerald-700 font-bold">{v.credit}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-[#102B4E]">
                    {v.balance}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                      v.gstStatus === 'Reconciled'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : v.gstStatus === 'Pending'
                        ? 'bg-amber-50 text-[#C69A43] border border-amber-200'
                        : 'bg-slate-100 text-[#55677D] border border-slate-200'
                    }`}>
                      {v.gstStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
