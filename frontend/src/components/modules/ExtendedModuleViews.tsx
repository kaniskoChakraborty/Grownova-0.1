import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Phone,
  Mail,
  Lock,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext';

/* ========================================================================= */
/* 1. PEOPLE & ORGANIZATION DIRECTORY                                        */
/* ========================================================================= */
export const PeopleModuleView: React.FC<{ onNotify?: (msg: string) => void }> = ({
  onNotify = () => {}
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const members = [
    { name: 'Ravi Sharma', role: 'Founder & Managing Director', dept: 'Executive', email: 'ravi.owner@grownova.in', phone: '+91 98201 44521', rbac: 'OWNER', status: 'Active' },
    { name: 'Taksh Joshi', role: 'Chief Operating Officer', dept: 'Operations', email: 'taksh.ops@grownova.in', phone: '+91 98212 34109', rbac: 'OPS (Manager)', status: 'Active' },
    { name: 'Pooja Sharma', role: 'Senior Finance Lead', dept: 'Finance & Tax', email: 'pooja.acc@grownova.in', phone: '+91 94231 88920', rbac: 'ACCOUNTANT', status: 'Active' },
    { name: 'Sunil Verma', role: 'Master Dyer & Mill Head', dept: 'Production', email: 'sunil.ops@grownova.in', phone: '+91 97110 55412', rbac: 'EMPLOYEE', status: 'Active' },
    { name: 'CA Narendra Mehta', role: 'External Statutory Auditor', dept: 'Audit & Legal', email: 'narendra.ca@mehta.co.in', phone: '+91 98190 22019', rbac: 'AUDITOR (Read-only)', status: 'External' }
  ];

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.dept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#102B4E]/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102B4E]">People & Teams Directory</h1>
          <p className="text-xs sm:text-sm text-[#55677D] mt-0.5">Role-based access matrix, contact channels & team hierarchy.</p>
        </div>
        <button
          onClick={() => onNotify('Invitation link dispatched via email & WhatsApp.')}
          className="px-4 py-2 rounded-full bg-[#102B4E] hover:bg-[#0B2340] text-white text-xs font-bold border border-[#C69A43]/40 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 text-[#C69A43]" />
          <span>Invite Team Member</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="gn-panel p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#55677D]">Total Personnel</span>
          <div className="text-2xl font-bold tracking-tight text-[#102B4E] mt-1 tabular-nums">28 Members</div>
        </div>
        <div className="gn-panel p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#55677D]">RBAC Roles</span>
          <div className="text-2xl font-bold tracking-tight text-[#102B4E] mt-1 tabular-nums">4 Levels</div>
        </div>
        <div className="gn-panel p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#55677D]">External Advisors</span>
          <div className="text-2xl font-bold tracking-tight text-[#102B4E] mt-1 tabular-nums">3 Partners</div>
        </div>
        <div className="gn-panel p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#55677D]">Security Status</span>
          <div className="text-2xl font-bold tracking-tight text-emerald-700 mt-1 tabular-nums">100% 2FA</div>
        </div>
      </div>

      <div className="gn-panel p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#102B4E]/10 mb-4">
          <span className="text-xs font-bold text-[#102B4E]">Active Organization Members</span>
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-[#55677D] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search people..."
              className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white/80 border border-[#102B4E]/15 text-xs text-[#102B4E]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((m, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-white/70 border border-[#102B4E]/10 hover:bg-white transition-all space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#102B4E]">{m.name}</h4>
                  <p className="text-[11px] text-[#55677D]">{m.role}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F7EEDA] text-[#C69A43] border border-[#C69A43]/40">
                  {m.rbac}
                </span>
              </div>
              <div className="pt-2 border-t border-[#102B4E]/5 text-[11px] text-[#55677D] space-y-1">
                <div className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-[#C69A43]" /><span>{m.email}</span></div>
                <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-emerald-600" /><span>{m.phone}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 2. PROJECTS & OPERATIONS SPRINTS                                          */
/* ========================================================================= */
export const ProjectsModuleView: React.FC<{ onNotify?: (msg: string) => void }> = ({
  onNotify = () => {}
}) => {
  const projects = [
    { title: 'Diwali Festive Collection Run', lead: 'Taksh Joshi', deadline: '18 Oct 2026', progress: 85, status: 'Production', priority: 'High' },
    { title: 'Surat Loom Automation Phase 2', lead: 'Sunil Verma', deadline: '28 Oct 2026', progress: 42, status: 'Engineering', priority: 'Medium' },
    { title: 'Wholesale B2B Catalog Release', lead: 'Pooja Sharma', deadline: '05 Nov 2026', progress: 90, status: 'Final Review', priority: 'Critical' },
    { title: 'Bhiwandi Godown Barcode Scanner Setup', lead: 'Rakesh Kumar', deadline: '12 Nov 2026', progress: 20, status: 'Planning', priority: 'Medium' }
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#102B4E]/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102B4E]">Projects & Operational Sprints</h1>
          <p className="text-xs sm:text-sm text-[#55677D] mt-0.5">Track manufacturing batches, milestone SLAs & team deliverables.</p>
        </div>
        <button
          onClick={() => onNotify('New production batch initiated.')}
          className="px-4 py-2 rounded-full bg-[#102B4E] hover:bg-[#0B2340] text-white text-xs font-bold border border-[#C69A43]/40 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 text-[#C69A43]" />
          <span>New Operations Batch</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="gn-panel p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#55677D]">Active Sprints</span>
          <div className="text-2xl font-bold tracking-tight text-[#102B4E] mt-1 tabular-nums">4 Batches</div>
        </div>
        <div className="gn-panel p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#55677D]">On-Time Delivery</span>
          <div className="text-2xl font-bold tracking-tight text-emerald-700 mt-1 tabular-nums">94.2%</div>
        </div>
        <div className="gn-panel p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#55677D]">Critical Milestones</span>
          <div className="text-2xl font-bold tracking-tight text-[#102B4E] mt-1 tabular-nums">2 Pending</div>
        </div>
        <div className="gn-panel p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#55677D]">Avg Batch Cycle</span>
          <div className="text-2xl font-bold tracking-tight text-[#102B4E] mt-1 tabular-nums">12 Days</div>
        </div>
      </div>

      <div className="gn-panel p-5 space-y-3">
        <h3 className="text-xs font-bold text-[#102B4E] pb-2 border-b border-[#102B4E]/10">Active Operations Sprints</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {projects.map((p, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/70 border border-[#102B4E]/10 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#102B4E]">{p.title}</h4>
                  <p className="text-[11px] text-[#55677D]">Lead: {p.lead} • Target: {p.deadline}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F7EEDA] text-[#C69A43]">
                  {p.status}
                </span>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-[#55677D] mb-1">
                  <span>Progress</span>
                  <span className="font-bold text-[#102B4E]">{p.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-[#C69A43] rounded-full transition-all" style={{ width: `${p.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 3. DOCUMENTS & DIGILOCKER VAULT                                           */
/* ========================================================================= */
export const DocumentsModuleView: React.FC<{ onNotify?: (msg: string) => void }> = ({
  onNotify = () => {}
}) => {
  const { isDemoMode } = useAuth();
  const [digiLoading, setDigiLoading] = useState(false);
  const [digiError, setDigiError] = useState<string | null>(null);
  const [consentResult, setConsentResult] = useState<{
    consentId: string;
    consentUrl?: string;
    expiresAt?: string;
  } | null>(null);

  const handleDigiLockerKyc = async () => {
    setDigiLoading(true);
    setDigiError(null);
    try {
      if (isDemoMode) {
        await new Promise((r) => setTimeout(r, 600));
        onNotify('DigiLocker KYC consent verified with Indian National Portal (Demo).');
        setConsentResult({
          consentId: 'demo-consent-8f3a9e',
          expiresAt: 'In 15 minutes'
        });
        return;
      }

      // Backend expects: POST /integrations/digilocker/consent with body { documentType: 'AADHAAR' }
      const res = await apiClient.post<{
        consentId: string;
        consentUrl: string;
        expiresAt: string;
      }>('/integrations/digilocker/consent', {
        documentType: 'AADHAAR'
      });

      setConsentResult(res);
      onNotify(`DigiLocker consent generated: Consent ID ${res.consentId.slice(0, 8)}…`);
    } catch (err: any) {
      setDigiError(err.message || 'DigiLocker verification failed.');
      onNotify(`DigiLocker request failed: ${err.message || 'Request failed'}`);
    } finally {
      setDigiLoading(false);
    }
  };

  const docs = [
    { title: 'GST_Registration_Certificate_27AABCS1429B1Z8.pdf', cat: 'Statutory License', size: '1.4 MB', status: 'DigiLocker Verified' },
    { title: 'Raymond_Mills_Commercial_Supply_Deed_2026.pdf', cat: 'Vendor Agreement', size: '3.8 MB', status: 'Encrypted AES-256' },
    { title: 'Surat_Godown_Lease_Agreement_Certified.pdf', cat: 'Legal & Property', size: '5.2 MB', status: 'Encrypted AES-256' },
    { title: 'MSME_Udyam_Registration_MH19B0021481.pdf', cat: 'Government MSME', size: '840 KB', status: 'DigiLocker Verified' }
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#102B4E]/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102B4E]">Documents & DigiLocker Vault</h1>
          <p className="text-xs sm:text-sm text-[#55677D] mt-0.5">256-bit AES encrypted storage for contracts, GST deeds & verified KYC.</p>
        </div>
        <button
          onClick={handleDigiLockerKyc}
          disabled={digiLoading}
          className="px-4 py-2 rounded-full bg-[#102B4E] hover:bg-[#0B2340] text-white text-xs font-bold border border-[#C69A43]/40 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          {digiLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C69A43]" />
          ) : (
            <Lock className="w-3.5 h-3.5 text-[#C69A43]" />
          )}
          <span>{digiLoading ? 'Verifying Consent…' : 'Sync DigiLocker KYC'}</span>
        </button>
      </div>

      {consentResult && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              <strong>DigiLocker Consent Active:</strong> ID <code className="font-mono">{consentResult.consentId}</code> (Expires: {consentResult.expiresAt || '15 mins'})
            </span>
          </div>
          {consentResult.consentUrl && (
            <a
              href={consentResult.consentUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-bold text-emerald-800 underline hover:text-emerald-950"
            >
              Open DigiLocker Portal →
            </a>
          )}
        </div>
      )}

      {digiError && (
        <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-900 flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>DigiLocker Service Notice: {digiError}</span>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="gn-panel p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#55677D]">Encrypted Vault</span>
          <div className="text-2xl font-bold tracking-tight text-[#102B4E] mt-1 tabular-nums">42 Documents</div>
        </div>
        <div className="gn-panel p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#55677D]">DigiLocker Verified</span>
          <div className="text-2xl font-bold tracking-tight text-emerald-700 mt-1 tabular-nums">18 Certified</div>
        </div>
        <div className="gn-panel p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#55677D]">Storage Quota</span>
          <div className="text-2xl font-bold tracking-tight text-[#102B4E] mt-1 tabular-nums">1.4 GB / 50 GB</div>
        </div>
        <div className="gn-panel p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#55677D]">Expiring Soon</span>
          <div className="text-2xl font-bold tracking-tight text-amber-600 mt-1 tabular-nums">1 License</div>
        </div>
      </div>

      <div className="gn-panel p-5 space-y-3">
        <h3 className="text-xs font-bold text-[#102B4E] pb-2 border-b border-[#102B4E]/10">Secure Vault Documents</h3>
        <div className="space-y-2">
          {docs.map((d, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-white/70 border border-[#102B4E]/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#C69A43]" />
                <div>
                  <div className="text-xs font-bold text-[#102B4E]">{d.title}</div>
                  <div className="text-[11px] text-[#55677D]">{d.cat} • {d.size}</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {d.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 4. COMPLIANCE & GST STATUTORY CALENDAR                                    */
/* ========================================================================= */
export const ComplianceModuleView: React.FC<{ onNotify?: (msg: string) => void }> = ({
  onNotify = () => {}
}) => {
  const obligations = [
    { title: 'GSTR-1 Monthly Outward Supplies', due: '11th of every month', status: 'Filed on Time', risk: 'Clean' },
    { title: 'GSTR-3B Summary Return & Tax Payment', due: '20th of every month', status: 'Draft Auto-Reconciled', risk: 'Action Required' },
    { title: 'Quarterly TDS Return (Form 26Q)', due: '31 Oct 2026', status: 'Data Populated', risk: 'In Progress' },
    { title: 'Advance Tax Q3 Payment Installment', due: '15 Dec 2026', status: 'Projected', risk: 'Upcoming' },
    { title: 'ROC Annual Filing (AOC-4 & MGT-7)', due: '30 Oct 2026', status: 'Chartered Review', risk: 'Clean' }
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#102B4E]/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102B4E]">Statutory Compliance Engine</h1>
          <p className="text-xs sm:text-sm text-[#55677D] mt-0.5">Stay 100% compliant with Indian GST, TDS, advance tax & ROC filing deadlines.</p>
        </div>
        <button
          onClick={() => onNotify('Compliance status package exported.')}
          className="px-4 py-2 rounded-full bg-[#102B4E] hover:bg-[#0B2340] text-white text-xs font-bold border border-[#C69A43]/40 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#C69A43]" />
          <span>Export Compliance Audit</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="gn-panel p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#55677D]">Compliance Score</span>
          <div className="text-2xl font-bold tracking-tight text-emerald-700 mt-1 tabular-nums">100% On-Time</div>
        </div>
        <div className="gn-panel p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#55677D]">Due in 10 Days</span>
          <div className="text-2xl font-bold tracking-tight text-[#102B4E] mt-1 tabular-nums">GSTR-3B</div>
        </div>
        <div className="gn-panel p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#55677D]">Penalty Risk</span>
          <div className="text-2xl font-bold tracking-tight text-emerald-700 mt-1 tabular-nums">₹ 0 (Zero)</div>
        </div>
        <div className="gn-panel p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#55677D]">Auditor Sync</span>
          <div className="text-2xl font-bold tracking-tight text-[#102B4E] mt-1 tabular-nums">CA Narendra M.</div>
        </div>
      </div>

      <div className="gn-panel p-5 space-y-3">
        <h3 className="text-xs font-bold text-[#102B4E] pb-2 border-b border-[#102B4E]/10">Indian Regulatory Deadlines & Return Drafts</h3>
        <div className="space-y-2.5">
          {obligations.map((o, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-white/70 border border-[#102B4E]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-[#102B4E]">{o.title}</h4>
                <p className="text-[11px] text-[#55677D]">Due: {o.due}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  o.risk === 'Clean' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-[#F7EEDA] text-[#C69A43] border border-[#C69A43]/40'
                }`}>
                  {o.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 5. SETTINGS & SYSTEM CONFIGURATION                                        */
/* ========================================================================= */
export const SettingsModuleView: React.FC<{ onNotify?: (msg: string) => void }> = ({
  onNotify = () => {}
}) => {
  const [businessName, setBusinessName] = useState('Shree Ganesh Textiles Pvt. Ltd.');
  const [gstin, setGstin] = useState('27AABCS1429B1Z8');
  const [pan, setPan] = useState('AABCS1429B');
  const [whatsappApi, setWhatsappApi] = useState('Enabled (Cloud API v20.0)');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify('Business configurations & GST credentials saved.');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#102B4E]/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102B4E]">System Configuration & Security</h1>
          <p className="text-xs sm:text-sm text-[#55677D] mt-0.5">Multi-branch locations, fiscal year definitions, GSTINs & API keys.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="gn-panel p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#55677D]">Operating Entity</span>
          <div className="text-2xl font-bold tracking-tight text-[#102B4E] mt-1">Private Ltd.</div>
        </div>
        <div className="gn-panel p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#55677D]">Active Branches</span>
          <div className="text-2xl font-bold tracking-tight text-[#102B4E] mt-1 tabular-nums">3 Locations</div>
        </div>
        <div className="gn-panel p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#55677D]">Primary GSTIN</span>
          <div className="font-mono text-base font-bold text-[#102B4E] mt-1">27AABCS1429B1Z8</div>
        </div>
        <div className="gn-panel p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#55677D]">Integrations</span>
          <div className="text-2xl font-bold tracking-tight text-emerald-700 mt-1 tabular-nums">4 Connected</div>
        </div>
      </div>

      <form onSubmit={handleSave} className="gn-panel p-5 space-y-4">
        <h3 className="text-xs font-bold text-[#102B4E] pb-2 border-b border-[#102B4E]/10">Primary Business Identity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#55677D] block mb-1">Legal Enterprise Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/80 border border-[#102B4E]/15 text-xs text-[#102B4E]"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#55677D] block mb-1">Primary GSTIN Number</label>
            <input
              type="text"
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/80 border border-[#102B4E]/15 text-xs text-[#102B4E] uppercase"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#55677D] block mb-1">Corporate Permanent Account (PAN)</label>
            <input
              type="text"
              value={pan}
              onChange={(e) => setPan(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/80 border border-[#102B4E]/15 text-xs text-[#102B4E] uppercase"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#55677D] block mb-1">WhatsApp Cloud API Gateway</label>
            <input
              type="text"
              value={whatsappApi}
              onChange={(e) => setWhatsappApi(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/80 border border-[#102B4E]/15 text-xs text-[#102B4E]"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 rounded-full bg-[#102B4E] hover:bg-[#0B2340] text-white text-xs font-bold border border-[#C69A43]/40 shadow-sm cursor-pointer"
          >
            Save Configuration Changes
          </button>
        </div>
      </form>
    </div>
  );
};

/* ========================================================================= */
/* 6. CALENDAR & OPERATING TIMELINE                                          */
/* ========================================================================= */
interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration: string;
  date: number; // day in October 2026
  category: 'meeting' | 'compliance' | 'operations' | 'general';
  attendees: string[];
  location: string;
  notes?: string;
  status: 'upcoming' | 'in-progress' | 'completed';
}

export const CalendarModuleView: React.FC<{ onNotify?: (msg: string) => void }> = ({
  onNotify = () => {}
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(19);
  const [filterCategory, setFilterCategory] = useState<'all' | 'meeting' | 'compliance' | 'operations'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<'meeting' | 'compliance' | 'operations' | 'general'>('meeting');
  const [newEventTime, setNewEventTime] = useState('11:00 AM');
  const [newEventLocation, setNewEventLocation] = useState('Main Boardroom / Google Meet');

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 'evt-1',
      title: 'Daily Floor Huddle & Dispatch Review',
      time: '09:30 AM',
      duration: '30 mins',
      date: 19,
      category: 'operations',
      attendees: ['Taksh Joshi', 'Sunil Verma'],
      location: 'Spinning Unit Floor',
      notes: 'Review morning yarn count output and Surat transport dispatch schedule.',
      status: 'completed'
    },
    {
      id: 'evt-2',
      title: 'Client Review: Raymonds Ltd Festive Weave',
      time: '11:30 AM',
      duration: '45 mins',
      date: 19,
      category: 'meeting',
      attendees: ['Ravi Sharma', 'Pooja Sharma', 'Vikram Raymonds'],
      location: 'Executive Boardroom & Virtual Meet',
      notes: 'Finalize pricing for 12,000 meters organic combed cotton.',
      status: 'in-progress'
    },
    {
      id: 'evt-3',
      title: 'GSTR-3B Statutory Tax Reconciliation',
      time: '02:30 PM',
      duration: '60 mins',
      date: 19,
      category: 'compliance',
      attendees: ['Pooja Sharma', 'CA Narendra Mehta'],
      location: 'Finance Suite / Remote Bridge',
      notes: 'Final audit sign-off for input tax credit claims before due date.',
      status: 'upcoming'
    },
    {
      id: 'evt-4',
      title: 'Chemical Supplier Contract Negotiation',
      time: '04:30 PM',
      duration: '45 mins',
      date: 19,
      category: 'operations',
      attendees: ['Taksh Joshi', 'Surat Dyes Rep'],
      location: 'Operations Office',
      notes: 'Bulk reactive dye procurement at ₹420/kg rate contract.',
      status: 'upcoming'
    },
    {
      id: 'evt-5',
      title: 'GSTR-3B Monthly Return Statutory Due Date',
      time: '05:00 PM',
      duration: 'All Day',
      date: 20,
      category: 'compliance',
      attendees: ['Pooja Sharma'],
      location: 'GST Portal',
      notes: 'Mandatory GST filing portal deadline for September invoices.',
      status: 'upcoming'
    },
    {
      id: 'evt-6',
      title: 'Spinning Machine Calibration & Safety Audit',
      time: '10:00 AM',
      duration: '2 hours',
      date: 21,
      category: 'operations',
      attendees: ['Sunil Verma', 'Precision Tech Inspector'],
      location: 'Unit 2 - Weaving Shed',
      notes: 'Quarterly sensor calibration and safety guard inspection.',
      status: 'upcoming'
    },
    {
      id: 'evt-7',
      title: 'Q3 Financial Health & Growth Review',
      time: '03:00 PM',
      duration: '90 mins',
      date: 23,
      category: 'meeting',
      attendees: ['Ravi Sharma', 'Taksh Joshi', 'Pooja Sharma'],
      location: 'Executive Suite',
      notes: 'Working capital runway, Diwali inventory ramp-up & new loom capex.',
      status: 'upcoming'
    }
  ]);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const newEvt: CalendarEvent = {
      id: `evt-${Date.now()}`,
      title: newEventTitle,
      time: newEventTime,
      duration: '45 mins',
      date: selectedDay,
      category: newEventCategory,
      attendees: ['Ravi Sharma (Owner)'],
      location: newEventLocation,
      status: 'upcoming'
    };

    setEvents(prev => [...prev, newEvt]);
    setIsModalOpen(false);
    setNewEventTitle('');
    onNotify(`Event "${newEvt.title}" scheduled for Oct ${selectedDay}, 2026`);
  };

  const selectedDayEvents = events.filter(e => {
    if (e.date !== selectedDay) return false;
    if (filterCategory === 'all') return true;
    return e.category === filterCategory;
  });

  // Calendar setup for October 2026: Oct 1 is Thursday
  const daysInMonth = 31;

  const getCategoryColor = (category: CalendarEvent['category']) => {
    switch (category) {
      case 'compliance':
        return '#D97706'; // warm amber
      case 'meeting':
        return '#2563EB'; // blue
      case 'operations':
        return '#15803D'; // emerald green
      default:
        return '#64748B';
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#102B4E]/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102B4E]">Executive Calendar & Agenda</h1>
          <p className="text-xs sm:text-sm text-[#55677D] mt-0.5">
            Cross-department operations, client appointments, GST statutory filings, and team timeline.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setSelectedDay(19)}
            className="px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-xs font-semibold text-[#102B4E] border border-[#102B4E]/15 transition-all cursor-pointer"
          >
            Today
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-full bg-[#102B4E] hover:bg-[#0B2340] text-white text-xs font-bold border border-[#C69A43]/40 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#C69A43]" />
            <span>Schedule Event</span>
          </button>
        </div>
      </div>

      {/* Main Calendar View: Month Grid & Daily Agenda - Immediate Hero Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Side: Month Grid (7 cols) */}
        <div className="lg:col-span-7 gn-panel p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#102B4E]/10">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#102B4E]" />
              <h2 className="text-base sm:text-lg font-bold text-[#102B4E] tracking-tight">October 2026</h2>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onNotify('Navigating to September 2026')}
                className="w-7 h-7 rounded-lg hover:bg-black/5 text-[#102B4E]/70 flex items-center justify-center transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNotify('Navigating to November 2026')}
                className="w-7 h-7 rounded-lg hover:bg-black/5 text-[#102B4E]/70 flex items-center justify-center transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-[#55677D] py-1 border-b border-[#102B4E]/5">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Previous month filler days (4 days for Thursday start) */}
            {[27, 28, 29, 30].map(d => (
              <div
                key={`prev-${d}`}
                className="min-h-[72px] sm:min-h-[84px] p-2 rounded-xl bg-black/[0.015] border border-transparent text-[#55677D]/35 text-xs flex flex-col justify-start"
              >
                <span className="font-medium text-[11px]">{d}</span>
              </div>
            ))}

            {/* Current month days (1 to 31) */}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const isSelected = day === selectedDay;
              const isToday = day === 19;
              const dayEvents = events.filter(e => e.date === day);

              return (
                <button
                  key={`day-${day}`}
                  onClick={() => setSelectedDay(day)}
                  className={`min-h-[72px] sm:min-h-[84px] p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white shadow-md border-[#102B4E] ring-1 ring-[#102B4E]/20'
                      : isToday
                      ? 'bg-white/90 border-[#102B4E]/30 hover:bg-white'
                      : 'bg-white/50 border-black/[0.04] hover:bg-white/90 hover:border-black/[0.08]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        isToday
                          ? 'bg-[#102B4E] text-white font-bold shadow-xs'
                          : isSelected
                          ? 'bg-[#C69A43] text-white font-bold'
                          : 'text-[#102B4E]'
                      }`}
                    >
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#102B4E]/8 text-[#102B4E] tabular-nums">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Refined Event Indicators */}
                  <div className="w-full space-y-1 mt-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map(evt => (
                      <div
                        key={evt.id}
                        className="truncate text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1 bg-white/90 border border-black/[0.06] shadow-2xs text-[#102B4E]"
                        title={evt.title}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: getCategoryColor(evt.category) }}
                        />
                        <span className="truncate">{evt.title}</span>
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[9.5px] text-[#55677D] font-medium pl-0.5">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Minimal Legend */}
          <div className="pt-2 border-t border-[#102B4E]/10 flex flex-wrap items-center justify-between gap-3 text-xs text-[#55677D]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-600" /> Client Meeting
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-600" /> GST / Statutory
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-600" /> Mill Operations
              </span>
            </div>
            <span className="text-[#55677D]/70 text-[11px]">Select date to review timeline</span>
          </div>
        </div>

        {/* Right Side: Day Agenda & Timeline (5 cols) */}
        <div className="lg:col-span-5 gn-panel p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#102B4E]/10">
            <div>
              <span className="text-[11px] font-semibold text-[#55677D] uppercase tracking-wider">
                {selectedDay === 19 ? 'Today’s Schedule' : 'Daily Schedule'}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[#102B4E] tracking-tight">
                October {selectedDay}, 2026
              </h3>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 rounded-full bg-[#102B4E] hover:bg-[#0B2340] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#C69A43]" />
              <span>Add</span>
            </button>
          </div>

          {/* Category Filter Segment */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/[0.03] border border-black/[0.04]">
            {(['all', 'meeting', 'compliance', 'operations'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`flex-1 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-white text-[#102B4E] shadow-2xs'
                    : 'text-[#55677D] hover:text-[#102B4E]'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>

          {/* Agenda Timeline Items */}
          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {selectedDayEvents.length === 0 ? (
              <div className="py-12 text-center rounded-2xl bg-white/40 border border-dashed border-[#102B4E]/15 space-y-2.5">
                <Calendar className="w-8 h-8 text-[#55677D]/35 mx-auto" />
                <p className="text-xs font-semibold text-[#102B4E]">No scheduled items for this day.</p>
                <p className="text-[11px] text-[#55677D] max-w-xs mx-auto">
                  Keep this day clear for focus work or add a customer appointment.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-1 px-3 py-1.5 rounded-full bg-white border border-[#102B4E]/15 text-xs font-semibold text-[#102B4E] hover:bg-[#102B4E] hover:text-white transition-all cursor-pointer"
                >
                  + Add Event
                </button>
              </div>
            ) : (
              selectedDayEvents.map(evt => (
                <div
                  key={evt.id}
                  className="p-3.5 rounded-xl bg-white/85 border border-black/[0.06] hover:bg-white hover:border-[#102B4E]/20 transition-all space-y-2 group shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: getCategoryColor(evt.category) }}
                      />
                      <span className="text-xs font-bold text-[#102B4E] tabular-nums">{evt.time}</span>
                      <span className="text-[11px] text-[#55677D]">{evt.duration}</span>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize bg-black/[0.04] text-[#55677D]">
                      {evt.category}
                    </span>
                  </div>

                  <h4 className="text-[13px] font-semibold text-[#102B4E] leading-snug">{evt.title}</h4>

                  {evt.notes && (
                    <p className="text-[11.5px] text-[#55677D] leading-relaxed border-l-2 border-[#C69A43]/50 pl-2 py-0.5">
                      {evt.notes}
                    </p>
                  )}

                  <div className="pt-1.5 flex items-center justify-between text-[11px] text-[#55677D] border-t border-black/[0.04]">
                    <span className="flex items-center gap-1 truncate max-w-[200px]">
                      <MapPin className="w-3 h-3 text-[#55677D]/70 shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </span>
                    <div className="flex items-center gap-1 font-medium text-[#102B4E]">
                      <Users className="w-3 h-3 text-[#55677D]/70" />
                      <span>{evt.attendees.length}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Schedule Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102B4E]/30 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md gn-panel p-6 shadow-2xl border border-white/95 relative space-y-4 bg-white/95 rounded-[24px]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-black/5 text-[#55677D] hover:text-[#102B4E] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-[#102B4E]/10 pb-3">
              <h3 className="text-lg font-bold text-[#102B4E] tracking-tight">Schedule New Event</h3>
              <p className="text-xs text-[#55677D]">Date: October {selectedDay}, 2026</p>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-[#102B4E] block mb-1">Event / Meeting Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Raymonds Dispatch Review"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#102B4E]/20 text-xs text-[#102B4E] focus:outline-none focus:ring-2 focus:ring-[#C69A43]/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#102B4E] block mb-1">Category</label>
                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#102B4E]/20 text-xs text-[#102B4E] focus:outline-none focus:ring-2 focus:ring-[#C69A43]/40"
                  >
                    <option value="meeting">Client Meeting</option>
                    <option value="compliance">GST / Statutory</option>
                    <option value="operations">Mill Operations</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#102B4E] block mb-1">Start Time</label>
                  <input
                    type="text"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#102B4E]/20 text-xs text-[#102B4E] focus:outline-none focus:ring-2 focus:ring-[#C69A43]/40"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#102B4E] block mb-1">Location / Bridge</label>
                <input
                  type="text"
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#102B4E]/20 text-xs text-[#102B4E] focus:outline-none focus:ring-2 focus:ring-[#C69A43]/40"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#55677D] hover:bg-black/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#102B4E] hover:bg-[#0B2340] text-white text-xs font-bold border border-[#C69A43]/40 shadow-xs cursor-pointer transition-all"
                >
                  Confirm Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

