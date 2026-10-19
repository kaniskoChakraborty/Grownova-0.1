import React, { useState } from 'react';
import {
  Search,
  Plus,
  AlertTriangle,
  ArrowRight,
  Barcode
} from 'lucide-react';

interface SkuItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  hsn: string;
  warehouse: string;
  stock: number;
  unit: string;
  reorderLevel: number;
  unitRate: number;
  status: 'Optimal' | 'Low Stock' | 'Critical';
}

const INITIAL_SKUS: SkuItem[] = [
  {
    id: 'sku-1',
    sku: 'COT-KHADI-BLU',
    name: 'Pure Cotton Khadi Fabric (Indigo)',
    category: 'Fabrics & Textiles',
    hsn: '5208',
    warehouse: 'Mumbai Central Godown',
    stock: 420,
    unit: 'Meters',
    reorderLevel: 150,
    unitRate: 180,
    status: 'Optimal'
  },
  {
    id: 'sku-2',
    sku: 'SILK-BAN-GLD',
    name: 'Banarasi Brocade Silk Rolls',
    category: 'Silk & Luxury',
    hsn: '5007',
    warehouse: 'Surat Dyeing Facility',
    stock: 85,
    unit: 'Rolls',
    reorderLevel: 20,
    unitRate: 1400,
    status: 'Optimal'
  },
  {
    id: 'sku-3',
    sku: 'THRD-DYE-40S',
    name: 'Dyeing Thread 40S (High Tensile)',
    category: 'Trims & Notions',
    hsn: '5401',
    warehouse: 'Surat Dyeing Facility',
    stock: 14,
    unit: 'Spools',
    reorderLevel: 50,
    unitRate: 320,
    status: 'Critical'
  },
  {
    id: 'sku-4',
    sku: 'BTN-PRM-WOOD',
    name: 'Hand-Carved Garment Buttons',
    category: 'Trims & Notions',
    hsn: '9606',
    warehouse: 'Bhiwandi Hub',
    stock: 1200,
    unit: 'Pieces',
    reorderLevel: 500,
    unitRate: 12,
    status: 'Optimal'
  },
  {
    id: 'sku-5',
    sku: 'RAY-PRT-WHT',
    name: 'Floral Printed Rayon Fabric',
    category: 'Fabrics & Textiles',
    hsn: '5403',
    warehouse: 'Mumbai Central Godown',
    stock: 48,
    unit: 'Meters',
    reorderLevel: 80,
    unitRate: 210,
    status: 'Low Stock'
  }
];

interface InventoryModuleViewProps {
  onNotify?: (msg: string) => void;
  onOpenActionModal?: (type: 'invoice' | 'expense') => void;
}

export const InventoryModuleView: React.FC<InventoryModuleViewProps> = ({
  onNotify = () => {},
  onOpenActionModal: _onOpenActionModal = () => {}
}) => {
  const [items, setItems] = useState<SkuItem[]>(INITIAL_SKUS);
  const [searchTerm, setSearchTerm] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('All');

  const handleAdjustStock = (skuId: string, delta: number) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === skuId) {
          const nextStock = Math.max(0, item.stock + delta);
          const nextStatus: SkuItem['status'] =
            nextStock <= item.reorderLevel * 0.4
              ? 'Critical'
              : nextStock <= item.reorderLevel
              ? 'Low Stock'
              : 'Optimal';
          return { ...item, stock: nextStock, status: nextStatus };
        }
        return item;
      })
    );
    onNotify(`Adjusted stock by ${delta > 0 ? `+${delta}` : delta} units.`);
  };

  const handleAutoReorder = (skuItem: SkuItem) => {
    handleAdjustStock(skuItem.id, 100);
    onNotify(`Purchase order of 100 ${skuItem.unit} dispatched for ${skuItem.name}.`);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch =
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWarehouse = warehouseFilter === 'All' || item.warehouse === warehouseFilter;
    return matchesSearch && matchesWarehouse;
  });

  const criticalItem = items.find(i => i.status === 'Critical');

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#102B4E]/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102B4E] leading-tight">
            Smart Stock & Inventory OS
          </h1>
          <p className="text-xs sm:text-sm text-[#55677D] mt-0.5">
            Real-time stock balance, multi-godown allocation, HSN codes & automated low-inventory alerts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              const name = prompt('Enter SKU Title:', 'Jacquard Silk Weave');
              if (name) {
                const newSku: SkuItem = {
                  id: `sku-${Date.now().toString().slice(-4)}`,
                  sku: 'JAC-SLK-IND',
                  name,
                  category: 'Silk & Luxury',
                  hsn: '5007',
                  warehouse: 'Mumbai Central Godown',
                  stock: 150,
                  unit: 'Meters',
                  reorderLevel: 40,
                  unitRate: 450,
                  status: 'Optimal'
                };
                setItems([newSku, ...items]);
                onNotify(`New SKU "${name}" added to inventory catalog.`);
              }
            }}
            className="px-4 py-2 rounded-full bg-[#102B4E] hover:bg-[#0B2340] text-white text-xs font-bold border border-[#C69A43]/40 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#C69A43]" />
            <span>Add New SKU</span>
          </button>
          <button
            onClick={() => onNotify('Stock count audit package generated for physical verification.')}
            className="px-4 py-2 rounded-full bg-white/80 hover:bg-white text-[#102B4E] text-xs font-bold border border-white/90 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Barcode className="w-3.5 h-3.5 text-[#C69A43]" />
            <span>Stock Audit Scan</span>
          </button>
        </div>
      </div>

      {/* 4 Canonical KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="gn-panel p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#55677D]">Stock Valuation</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              142 SKUs
            </span>
          </div>
          <div className="mt-1">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102B4E] tabular-nums">₹ 34.8L</div>
            <div className="text-[11px] text-[#55677D] mt-0.5">FIFO landing valuation</div>
          </div>
        </div>

        <div className="gn-panel p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#55677D]">Godown Capacity</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              3 Godowns
            </span>
          </div>
          <div className="mt-1">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102B4E] tabular-nums">82% Full</div>
            <div className="text-[11px] text-[#55677D] mt-0.5">Central Hub in Bhiwandi</div>
          </div>
        </div>

        <div className="gn-panel p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#55677D]">Low Stock Alerts</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              Action Req.
            </span>
          </div>
          <div className="mt-1">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102B4E] tabular-nums">5 SKUs</div>
            <div className="text-[11px] text-[#55677D] mt-0.5">Below reorder safety level</div>
          </div>
        </div>

        <div className="gn-panel p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#55677D]">Turnover Speed</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F7EEDA] text-[#C69A43] border border-[#C69A43]/40">
              Optimal
            </span>
          </div>
          <div className="mt-1">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102B4E] tabular-nums">4.6x / Yr</div>
            <div className="text-[11px] text-[#55677D] mt-0.5">Fast-moving apparel fabrics</div>
          </div>
        </div>
      </div>

      {/* Critical Stock Alert Banner */}
      {criticalItem && (
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-[#C69A43]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#C69A43]/30 flex items-center justify-center text-[#C69A43] flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#102B4E]">
                Critical Reorder Threshold Breached: {criticalItem.name}
              </h4>
              <p className="text-[11.5px] text-[#55677D] mt-0.5">
                Current stock: <strong className="text-rose-700">{criticalItem.stock} {criticalItem.unit}</strong> (Reorder point: {criticalItem.reorderLevel} {criticalItem.unit}) at {criticalItem.warehouse}.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleAutoReorder(criticalItem)}
            className="px-4 py-2 rounded-full bg-[#102B4E] hover:bg-[#0B2340] text-white text-xs font-bold border border-[#C69A43]/40 shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            <span>Auto-Draft PO to Vendor</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C69A43]" />
          </button>
        </div>
      )}

      {/* SKU Catalog Table */}
      <div className="gn-panel p-5">
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#102B4E]/10 mb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Mumbai Central Godown', 'Surat Dyeing Facility', 'Bhiwandi Hub'].map((wh) => (
              <button
                key={wh}
                onClick={() => setWarehouseFilter(wh)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  warehouseFilter === wh
                    ? 'bg-[#F7EEDA] text-[#102B4E] border border-[#C69A43]/40 font-bold shadow-2xs'
                    : 'text-[#55677D] hover:text-[#102B4E] hover:bg-white/70'
                }`}
              >
                {wh}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#55677D] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search SKU or item name..."
              className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white/80 border border-[#102B4E]/15 text-xs text-[#102B4E] focus:outline-none focus:ring-1 focus:ring-[#C69A43]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#102B4E]/10 text-[#55677D] font-bold uppercase tracking-wider text-[10.5px]">
                <th className="py-2.5 px-3">SKU & Item Name</th>
                <th className="py-2.5 px-3">Category / HSN</th>
                <th className="py-2.5 px-3">Godown Facility</th>
                <th className="py-2.5 px-3 text-right">Available Units</th>
                <th className="py-2.5 px-3 text-right">Reorder Level</th>
                <th className="py-2.5 px-3 text-right">Unit Rate (₹)</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Stock Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#102B4E]/5">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-white/60 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-mono font-bold text-[#102B4E]">{item.sku}</div>
                    <div className="text-[11px] text-[#55677D] truncate max-w-[200px]">{item.name}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-[#102B4E]">{item.category}</div>
                    <div className="text-[10px] text-[#55677D]">HSN: {item.hsn}</div>
                  </td>
                  <td className="py-3 px-3 text-[11px] text-[#102B4E]">
                    {item.warehouse}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-xs text-[#102B4E]">
                    {item.stock} <span className="font-normal text-[10px] text-[#55677D]">{item.unit}</span>
                  </td>
                  <td className="py-3 px-3 text-right text-[11px] text-[#55677D]">
                    {item.reorderLevel} {item.unit}
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-[#102B4E]">
                    ₹ {item.unitRate.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                      item.status === 'Optimal'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : item.status === 'Low Stock'
                        ? 'bg-amber-50 text-[#C69A43] border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleAdjustStock(item.id, -10)}
                        className="w-6 h-6 rounded-full bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-[#102B4E] cursor-pointer"
                        title="Reduce 10 units"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleAdjustStock(item.id, 50)}
                        className="w-6 h-6 rounded-full bg-[#102B4E] hover:bg-[#0B2340] text-white flex items-center justify-center font-bold text-xs cursor-pointer"
                        title="Add 50 units"
                      >
                        +
                      </button>
                    </div>
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
