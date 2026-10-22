import React, { useState } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  FileSpreadsheet,
  ShieldCheck,
  MessageSquare,
  Building2,
  ArrowRight,
  TrendingUp,
  Cpu,
  Lock,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface LiveBackendFeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveBackendFeaturesModal: React.FC<LiveBackendFeaturesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'live_apis' | 'ai_automation' | 'compliance'>('all');

  if (!isOpen) return null;

  const backendModules = [
    {
      id: 'crm',
      title: 'Sales & CRM with GrowAI',
      category: 'live_apis',
      apiEndpoint: 'POST /crm/leads & POST /crm/leads/:id/enrich',
      status: 'Live Backend Controller',
      description: 'Inbound lead parsing, Hinglish message processing, and automated GrowAI buying intent classification (PRICE_ENQUIRY, ORDER, SUPPORT).',
      route: '/dashboard/crm',
      icon: TrendingUp,
      color: '#D97706',
    },
    {
      id: 'migration',
      title: 'Universal Legacy Migration',
      category: 'live_apis',
      apiEndpoint: 'POST /migration/upload',
      status: 'Live Backend Controller',
      description: 'Universal parser for legacy Tally ERP 9 / Prime XML ledgers and Excel spreadsheets (.xlsx, .xls) with double-entry normalization.',
      route: '/dashboard/documents',
      icon: FileSpreadsheet,
      color: '#059669',
    },
    {
      id: 'audit',
      title: 'Cryptographic SHA-256 Audit Trail',
      category: 'live_apis',
      apiEndpoint: 'GET /audit/integrity & POST /audit/test',
      status: 'Live Backend Controller',
      description: 'Tamper-evident blockchain-style cryptographic hash chain verifying ledger integrity for statutory audit compliance.',
      route: '/dashboard/reports',
      icon: Lock,
      color: '#2563EB',
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Business Cloud Integration',
      category: 'ai_automation',
      apiEndpoint: 'POST /integrations/whatsapp/intake',
      status: 'Live Backend Controller',
      description: 'Automated WhatsApp message intake, Indian mobile number normalization (+91), customer onboarding, and order receipts.',
      route: '/dashboard/people',
      icon: MessageSquare,
      color: '#16A34A',
    },
    {
      id: 'digilocker',
      title: 'DigiLocker Government KYC Adapter',
      category: 'compliance',
      apiEndpoint: 'POST /integrations/digilocker/consent & /kyc',
      status: 'Live Backend Controller',
      description: 'Statutory verification of Aadhaar, PAN, and MSME Udyam certificates directly through DigiLocker consent APIs.',
      route: '/dashboard/compliance',
      icon: ShieldCheck,
      color: '#0284C7',
    },
    {
      id: 'businesses',
      title: 'Multi-Branch Business Entities',
      category: 'live_apis',
      apiEndpoint: 'GET /businesses & PATCH /businesses/:id',
      status: 'Live Backend Controller',
      description: 'Multi-branch enterprise setup, legal business names, GSTIN configuration, and tenant isolation.',
      route: '/dashboard/settings',
      icon: Building2,
      color: '#9333EA',
    },
    {
      id: 'growai_rules',
      title: 'GrowAI Natural Language Engine',
      category: 'ai_automation',
      apiEndpoint: 'Internal Service: GrowaiRules & LlmService',
      status: 'Live Backend Service',
      description: 'Dual-engine LLM & rule-based parser handling Hindi, English, and Hinglish inquiries with automatic quantity extraction.',
      route: '/dashboard/crm',
      icon: Cpu,
      color: '#C69A43',
    },
    {
      id: 'health',
      title: 'System Daemon & Health Monitoring',
      category: 'live_apis',
      apiEndpoint: 'GET /health',
      status: 'Live Backend Controller',
      description: 'Continuous uptime monitoring and service discovery reporting grownova-api microservice health.',
      route: '/dashboard',
      icon: Database,
      color: '#15803D',
    },
  ];

  const filteredModules = backendModules.filter(m => {
    if (activeTab === 'all') return true;
    if (activeTab === 'live_apis') return m.category === 'live_apis';
    if (activeTab === 'ai_automation') return m.category === 'ai_automation' || m.id === 'crm';
    if (activeTab === 'compliance') return m.category === 'compliance' || m.id === 'audit';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-[28px] bg-white/95 backdrop-blur-2xl border border-white p-6 sm:p-8 shadow-2xl max-h-[90vh] flex flex-col text-[#102B4E] select-none">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#102B4E]/10 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F7EEDA] border border-[#C69A43]/40 flex items-center justify-center text-[#C69A43] shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#102B4E]">
                All Apps & Backend Features
              </h2>
              <p className="text-xs text-[#65758B]">
                Explore verified NestJS backend modules and connected capabilities
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#65758B] hover:text-[#102B4E] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 py-3 overflow-x-auto flex-shrink-0">
          {[
            { id: 'all', label: 'All Modules (8)' },
            { id: 'live_apis', label: 'Live REST APIs (5)' },
            { id: 'ai_automation', label: 'GrowAI & Messaging (2)' },
            { id: 'compliance', label: 'Audit & DigiLocker (2)' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#102B4E] text-white shadow-xs'
                  : 'bg-white/70 hover:bg-white text-[#65758B] border border-[#102B4E]/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modules Grid */}
        <div className="overflow-y-auto pr-1 space-y-2.5 flex-1 my-2">
          {filteredModules.map(mod => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                className="p-4 rounded-2xl bg-white/70 hover:bg-white border border-[#102B4E]/10 hover:border-[#C69A43]/40 transition-all shadow-2xs hover:shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs"
                    style={{ backgroundColor: `${mod.color}15`, color: mod.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-[#102B4E]">{mod.title}</h4>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{mod.status}</span>
                      </span>
                    </div>

                    <p className="text-xs text-[#65758B] leading-relaxed max-w-lg">
                      {mod.description}
                    </p>

                    <div className="text-[11px] font-mono text-[#102B4E]/70 pt-0.5">
                      Endpoint: <code className="bg-black/5 px-1.5 py-0.5 rounded text-[10.5px]">{mod.apiEndpoint}</code>
                    </div>
                  </div>
                </div>

                <Link
                  to={mod.route}
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#102B4E] bg-[#F7EEDA] hover:bg-[#F3BF61]/40 border border-[#C69A43]/30 flex items-center justify-center gap-1.5 flex-shrink-0 transition-colors shadow-2xs cursor-pointer self-end sm:self-center"
                >
                  <span>Open Module</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="pt-3 border-t border-[#102B4E]/10 flex items-center justify-between text-xs text-[#65758B] flex-shrink-0">
          <span className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-[#C69A43]" />
            <span>GrowNova OS v0.1 • NestJS 11 Microservices</span>
          </span>
          <span className="font-semibold text-[#102B4E]">
            All endpoints secured with JWT & RBAC
          </span>
        </div>

      </div>
    </div>
  );
};
