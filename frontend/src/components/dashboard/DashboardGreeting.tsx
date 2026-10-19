import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowUpRight, SunMedium } from 'lucide-react';

interface DashboardGreetingProps {
  onFundTransferClick?: () => void;
}

export const DashboardGreeting: React.FC<DashboardGreetingProps> = ({
  onFundTransferClick
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const roleName = user?.role === 'OPS' ? 'manager' : user?.role === 'EMPLOYEE' ? 'employee' : 'owner';

  return (
    <div className="flex flex-col select-none space-y-4">
      {/* 1. Executive Terminal Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-[2px] bg-[#C69A43] rounded-full" />
          <span className="text-[10px] font-bold text-[#C69A43] tracking-widest uppercase">
            Executive Terminal
          </span>
        </div>

        {/* Editorial Serif Greeting */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-[42px] font-bold text-[#0B2340] leading-[1.06] tracking-tight">
          Good morning,
          <br />
          <span className="font-serif lowercase font-bold text-[#0B2340]">
            {roleName}.
          </span>
        </h1>

        {/* Supporting Copy */}
        <div className="mt-3 text-xs sm:text-[13px] text-[#55677D] font-medium leading-relaxed max-w-xs">
          <p>Plan. Operate. Grow. All in one place.</p>
          <p className="text-[11.5px] text-[#55677D]/80 mt-1">
            Centralized command node for fiscal governance and operational velocity.
          </p>
        </div>

        {/* Compliance Status Badge */}
        <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800 shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span>Fiscal Year Q3 • Statutory Compliant GSTN</span>
        </div>
      </div>

      {/* 2. Strategic Operating Capital Card (From Stitch Architecture) */}
      <div className="gn-panel p-4 rounded-2xl bg-white/85 backdrop-blur-xl border border-white/95 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-bold text-[#55677D] uppercase tracking-wider">
            Strategic Reserves
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#15803D]">
            +4.2% yield
          </span>
        </div>

        <div>
          <div className="text-xs text-[#55677D] font-medium">Liquid Operating Capital</div>
          <div className="text-2xl font-bold tracking-tight text-[#102B4E] tabular-nums mt-0.5">
            ₹ 84,25,000
          </div>
          <div className="text-[10.5px] text-[#55677D]/80 mt-0.5">
            State Bank Escrow • Auto-Rebalanced 06:00 AM
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={onFundTransferClick || (() => navigate('/dashboard/accounting'))}
            className="px-3 py-1.5 rounded-xl bg-[#102B4E] hover:bg-[#0B2340] text-white text-[11px] font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1 transition-all"
          >
            <span>Fund Transfer</span>
            <ArrowUpRight className="w-3 h-3 text-[#C69A43]" />
          </button>
          <button
            onClick={() => navigate('/dashboard/accounting')}
            className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-[#102B4E] text-[11px] font-bold border border-[#102B4E]/10 cursor-pointer flex items-center justify-center gap-1 transition-all"
          >
            <span>Audit Trail</span>
          </button>
        </div>
      </div>

      {/* 3. Environment Node Telemetry */}
      <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/60 border border-white/80 text-[11px] text-[#55677D]">
        <div className="flex items-center gap-2">
          <SunMedium className="w-3.5 h-3.5 text-[#C69A43]" />
          <span className="font-medium">Shimla Node: 14°C Crisp Air</span>
        </div>
        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          Relay 100%
        </span>
      </div>
    </div>
  );
};
