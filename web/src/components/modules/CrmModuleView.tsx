import React, { useState } from 'react';
import {
  Search,
  Plus,
  MessageSquare,
  Building,
  CheckCircle2,
  FileText,
  Send,
  Zap,
  ArrowUpRight
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  business: string;
  phone: string;
  city: string;
  source: 'WhatsApp' | 'Showroom' | 'B2B Referral' | 'Call';
  value: string;
  item: string;
  score: number;
  stage: 'New Inbound' | 'Quoted' | 'Negotiation' | 'Won' | 'Lost';
  createdAt: string;
}

const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-101',
    name: 'Ghanshyam Patel',
    business: 'Balaji Traders',
    phone: '+91 98251 44102',
    city: 'Ahmedabad, Gujarat',
    source: 'WhatsApp',
    value: '₹ 45,000',
    item: '250m Pure Cotton Fabric',
    score: 96,
    stage: 'Negotiation',
    createdAt: 'Today, 11:24 AM'
  },
  {
    id: 'lead-102',
    name: 'Mahesh Sanghvi',
    business: 'Shree Mahavir Textiles',
    phone: '+91 94280 88219',
    city: 'Surat, Gujarat',
    source: 'Showroom',
    value: '₹ 1,20,000',
    item: '85 Rolls Banarasi Silk',
    score: 92,
    stage: 'Won',
    createdAt: 'Yesterday'
  },
  {
    id: 'lead-103',
    name: 'Rajendra Joshi',
    business: 'Royal Garments',
    phone: '+91 98930 11450',
    city: 'Indore, MP',
    source: 'B2B Referral',
    value: '₹ 80,000',
    item: 'Dyeing Thread 40S (200 Spools)',
    score: 84,
    stage: 'Quoted',
    createdAt: '10 Oct 2026'
  },
  {
    id: 'lead-104',
    name: 'Kavita Agarwal',
    business: 'Apex Retail Stores',
    phone: '+91 97129 66341',
    city: 'Jaipur, Rajasthan',
    source: 'WhatsApp',
    value: '₹ 35,000',
    item: 'Wooden Buttons (1,200 Pcs)',
    score: 78,
    stage: 'New Inbound',
    createdAt: '11 Oct 2026'
  },
  {
    id: 'lead-105',
    name: 'Sunil Chawla',
    business: 'Chawla & Sons Fabric Hub',
    phone: '+91 98110 33921',
    city: 'Delhi NCR',
    source: 'Call',
    value: '₹ 95,000',
    item: 'Printed Rayon Rolls',
    score: 89,
    stage: 'Quoted',
    createdAt: '09 Oct 2026'
  }
];

interface CrmModuleViewProps {
  onNotify?: (msg: string) => void;
  onOpenActionModal?: (type: 'invoice' | 'customer') => void;
}

export const CrmModuleView: React.FC<CrmModuleViewProps> = ({
  onNotify = () => {},
  onOpenActionModal = () => {}
}) => {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  
  // GrowAI NLP Lead Enrichment state
  const [rawInquiryText, setRawInquiryText] = useState(
    'Need 500 meters pure cotton fabric for Surat delivery before Diwali, please quote best wholesale rate with GST invoice'
  );
  const [nlpLoading, setNlpLoading] = useState(false);
  const [nlpResult, setNlpResult] = useState<{
    intent: string;
    product: string;
    qty: string;
    market: string;
    urgency: string;
    score: number;
  } | null>(null);

  // WhatsApp simulation state
  const [waPhone, setWaPhone] = useState('+91 98201 99312');
  const [waMessage, setWaMessage] = useState('Urgent inquiry: 150 rolls of Banarasi Silk needed for wedding season');
  const [waSending, setWaSending] = useState(false);

  const handleRunNlp = () => {
    setNlpLoading(true);
    setTimeout(() => {
      setNlpResult({
        intent: 'HIGH_BUYING_INTENT',
        product: 'Pure Cotton Fabric',
        qty: '500 Meters',
        market: 'Surat, Gujarat',
        urgency: 'Immediate (Pre-Diwali dispatch)',
        score: 96
      });
      setNlpLoading(false);
      onNotify('GrowAI NLP Lead Extraction complete (Intent: 96% Match)');
    }, 600);
  };

  const handleSimulateWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    setWaSending(true);
    setTimeout(() => {
      const newLead: Lead = {
        id: `lead-${Date.now().toString().slice(-4)}`,
        name: 'Inbound WhatsApp Buyer',
        business: 'Surat Wedding Fabrics',
        phone: waPhone,
        city: 'Surat, Gujarat',
        source: 'WhatsApp',
        value: '₹ 1,50,000',
        item: '150 Rolls Banarasi Silk',
        score: 94,
        stage: 'New Inbound',
        createdAt: 'Just now'
      };
      setLeads([newLead, ...leads]);
      setWaSending(false);
      onNotify(`Inbound WhatsApp Lead captured from ${waPhone}!`);
    }, 500);
  };

  const handleStageChange = (leadId: string, nextStage: Lead['stage']) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: nextStage } : l));
    onNotify(`Lead status updated to: ${nextStage}`);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.item.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStage === 'All' || lead.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Module Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#102B4E]/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102B4E] leading-tight">
            Customer Relationship Management
          </h1>
          <p className="text-xs sm:text-sm text-[#55677D] mt-0.5">
            Unified WhatsApp inquiries, commercial quotations, customer dossiers & GrowAI lead scoring.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onOpenActionModal('customer')}
            className="px-4 py-2 rounded-full bg-[#102B4E] hover:bg-[#0B2340] text-white text-xs font-bold border border-[#C69A43]/40 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#C69A43]" />
            <span>Add Customer</span>
          </button>
          <button
            onClick={() => onOpenActionModal('invoice')}
            className="px-4 py-2 rounded-full bg-white/80 hover:bg-white text-[#102B4E] text-xs font-bold border border-white/90 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#C69A43]" />
            <span>Draft Quotation</span>
          </button>
        </div>
      </div>

      {/* 4 Canonical KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="gn-panel p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#55677D]">Pipeline Value</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              +18.4%
            </span>
          </div>
          <div className="mt-1">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102B4E] tabular-nums">₹ 48.5L</div>
            <div className="text-[11px] text-[#55677D] mt-0.5">42 Active Deals in Progress</div>
          </div>
        </div>

        <div className="gn-panel p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#55677D]">Active Leads</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-[#C69A43] border border-amber-200">
              12 Inbound
            </span>
          </div>
          <div className="mt-1">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102B4E] tabular-nums">34 Leads</div>
            <div className="text-[11px] text-[#55677D] mt-0.5">8 In negotiation stage</div>
          </div>
        </div>

        <div className="gn-panel p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#55677D]">Won Deals</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              68% Win Rate
            </span>
          </div>
          <div className="mt-1">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102B4E] tabular-nums">18 Closed</div>
            <div className="text-[11px] text-[#55677D] mt-0.5">Avg Cycle: 4.2 Days</div>
          </div>
        </div>

        <div className="gn-panel p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#55677D]">GrowAI Intent</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F7EEDA] text-[#C69A43] border border-[#C69A43]/40">
              High
            </span>
          </div>
          <div className="mt-1">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102B4E] tabular-nums">91.4%</div>
            <div className="text-[11px] text-[#55677D] mt-0.5">Automated lead enrichment</div>
          </div>
        </div>
      </div>

      {/* GrowAI Lead Extraction & WhatsApp Live Testers (Two-Column Bento Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Card 1: GrowAI NLP Intent Classifier */}
        <div className="gn-panel p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#102B4E]/10 mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#C69A43]" />
              <h3 className="text-sm sm:text-base font-bold text-[#102B4E] tracking-tight">
                GrowAI NLP Lead Intent Classifier
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-[#C69A43] border border-amber-200">
              POST /crm/leads/:id/enrich
            </span>
          </div>

          <p className="text-xs text-[#55677D] mb-2.5">
            Test raw unstructured WhatsApp customer inquiry parsing into typed commercial entities:
          </p>

          <textarea
            value={rawInquiryText}
            onChange={(e) => setRawInquiryText(e.target.value)}
            rows={2}
            className="w-full p-2.5 rounded-xl bg-white/80 border border-[#102B4E]/15 text-xs text-[#102B4E] focus:outline-none focus:ring-1 focus:ring-[#C69A43] mb-2.5"
          />

          <div className="flex items-center justify-between">
            <button
              onClick={handleRunNlp}
              disabled={nlpLoading}
              className="px-4 py-2 rounded-full bg-[#102B4E] hover:bg-[#0B2340] text-white text-xs font-bold border border-[#C69A43]/40 shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-[#C69A43]" />
              <span>{nlpLoading ? 'Analyzing NLP Intent…' : 'Run GrowAI Extraction'}</span>
            </button>

            {nlpResult && (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Score: {nlpResult.score}%</span>
              </span>
            )}
          </div>

          {nlpResult && (
            <div className="mt-3 p-3 rounded-xl bg-[#F7EEDA]/60 border border-[#C69A43]/30 text-xs space-y-1 animate-in fade-in">
              <div className="flex justify-between">
                <span className="text-[#55677D]">Classified Intent:</span>
                <span className="font-bold text-[#102B4E]">{nlpResult.intent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#55677D]">Extracted Product:</span>
                <span className="font-bold text-[#102B4E]">{nlpResult.product} ({nlpResult.qty})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#55677D]">Target Market:</span>
                <span className="font-bold text-[#102B4E]">{nlpResult.market}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#55677D]">Urgency:</span>
                <span className="font-bold text-[#C69A43]">{nlpResult.urgency}</span>
              </div>
            </div>
          )}
        </div>

        {/* Card 2: WhatsApp Inbound Ingestion Simulator */}
        <div className="gn-panel p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#102B4E]/10 mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm sm:text-base font-bold text-[#102B4E] tracking-tight">
                WhatsApp Business Webhook Ingestion
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              POST /integrations/whatsapp/intake
            </span>
          </div>

          <form onSubmit={handleSimulateWhatsApp} className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#55677D] block mb-1">
                  Customer WhatsApp Phone
                </label>
                <input
                  type="text"
                  value={waPhone}
                  onChange={(e) => setWaPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white/80 border border-[#102B4E]/15 text-xs text-[#102B4E]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#55677D] block mb-1">
                  Lead Category
                </label>
                <div className="px-2.5 py-1.5 rounded-xl bg-white/80 border border-[#102B4E]/15 text-xs text-[#102B4E] font-medium">
                  Wholesale Inquiry
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#55677D] block mb-1">
                Raw Incoming Message
              </label>
              <input
                type="text"
                value={waMessage}
                onChange={(e) => setWaMessage(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-white/80 border border-[#102B4E]/15 text-xs text-[#102B4E]"
              />
            </div>

            <div className="pt-1 flex items-center justify-between">
              <span className="text-[11px] text-[#55677D]">Simulates real webhook trigger</span>
              <button
                type="submit"
                disabled={waSending}
                className="px-4 py-2 rounded-full bg-[#15803D] hover:bg-emerald-800 text-white text-xs font-bold border border-emerald-600 shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{waSending ? 'Ingesting…' : 'Simulate Inbound Lead'}</span>
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Main CRM Pipeline Table */}
      <div className="gn-panel p-5">
        
        {/* Controls: Search & Stage Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#102B4E]/10 mb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'New Inbound', 'Quoted', 'Negotiation', 'Won'].map((stage) => (
              <button
                key={stage}
                onClick={() => setSelectedStage(stage)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedStage === stage
                    ? 'bg-[#F7EEDA] text-[#102B4E] border border-[#C69A43]/40 font-bold shadow-2xs'
                    : 'text-[#55677D] hover:text-[#102B4E] hover:bg-white/70'
                }`}
              >
                {stage === 'All' ? `All Leads (${leads.length})` : stage}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#55677D] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter leads or parties..."
              className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white/80 border border-[#102B4E]/15 text-xs text-[#102B4E] focus:outline-none focus:ring-1 focus:ring-[#C69A43]"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#102B4E]/10 text-[#55677D] font-bold uppercase tracking-wider text-[10.5px]">
                <th className="py-2.5 px-3">Lead / Enterprise</th>
                <th className="py-2.5 px-3">Contact & City</th>
                <th className="py-2.5 px-3">Channel</th>
                <th className="py-2.5 px-3">Inquiry Value</th>
                <th className="py-2.5 px-3">GrowAI Score</th>
                <th className="py-2.5 px-3">Stage</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#102B4E]/5">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/60 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#102B4E]">{lead.business}</div>
                    <div className="text-[11px] text-[#55677D]">{lead.name}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-[#102B4E]">{lead.phone}</div>
                    <div className="text-[11px] text-[#55677D]">{lead.city}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-white/80 border border-[#102B4E]/10 text-[#102B4E]">
                      {lead.source === 'WhatsApp' && <MessageSquare className="w-3 h-3 text-emerald-600" />}
                      {lead.source === 'Showroom' && <Building className="w-3 h-3 text-[#C69A43]" />}
                      {lead.source}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#102B4E]">{lead.value}</div>
                    <div className="text-[11px] text-[#55677D] truncate max-w-[160px]">{lead.item}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 font-bold text-xs text-[#102B4E]">
                      <span className="text-[#C69A43]">★</span>
                      <span>{lead.score}%</span>
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={lead.stage}
                      onChange={(e) => handleStageChange(lead.id, e.target.value as Lead['stage'])}
                      className={`text-[11px] font-bold px-2 py-1 rounded-full border cursor-pointer focus:outline-none ${
                        lead.stage === 'Won'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : lead.stage === 'Negotiation'
                          ? 'bg-[#F7EEDA] text-[#C69A43] border-[#C69A43]/40'
                          : lead.stage === 'Quoted'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-slate-100 text-[#55677D] border-slate-200'
                      }`}
                    >
                      <option value="New Inbound">New Inbound</option>
                      <option value="Quoted">Quoted</option>
                      <option value="Negotiation">Negotiation</option>
                      <option value="Won">Won</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onOpenActionModal('invoice')}
                      className="px-2.5 py-1 rounded-full bg-white/90 hover:bg-white text-[11px] font-bold text-[#102B4E] border border-white shadow-2xs hover:border-[#C69A43]/40 transition-all inline-flex items-center gap-1 cursor-pointer"
                      title="Convert to GST Tax Invoice"
                    >
                      <span>Invoice</span>
                      <ArrowUpRight className="w-3 h-3 text-[#C69A43]" />
                    </button>
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
