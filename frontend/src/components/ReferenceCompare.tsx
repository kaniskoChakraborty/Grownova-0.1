import React, { useState } from 'react';
import { Layers, Eye, EyeOff, Sliders } from 'lucide-react';

interface ReferenceCompareProps {
  onOpacityChange: (opacity: number) => void;
  overlayOpacity: number;
}

export const ReferenceCompare: React.FC<ReferenceCompareProps> = ({
  onOpacityChange,
  overlayOpacity,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end font-sans select-none">
      {/* Popover Controls */}
      {isOpen && (
        <div className="mb-2 p-3.5 gn-panel rounded-2xl shadow-2xl border border-white/95 w-64 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200 bg-white/95">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#102B4E]/10 text-xs font-bold text-[#102B4E]">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#C69A43]" />
              <span>Canonical Fidelity QA</span>
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 text-[11px] cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-[11px] text-[#65758B]">
              <span>Reference Overlay:</span>
              <span className="font-mono font-bold text-[#102B4E]">{Math.round(overlayOpacity * 100)}%</span>
            </div>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={overlayOpacity}
              onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
              className="w-full accent-[#C69A43] cursor-pointer h-1.5 bg-black/10 rounded-lg"
            />

            <div className="grid grid-cols-3 gap-1 pt-1">
              <button
                onClick={() => onOpacityChange(0)}
                className={`py-1 text-[10px] font-semibold rounded-md border transition-all cursor-pointer ${
                  overlayOpacity === 0
                    ? 'bg-[#102B4E] text-white border-[#102B4E]'
                    : 'bg-white/60 text-[#102B4E] border-white/80 hover:bg-white'
                }`}
              >
                Live (0%)
              </button>
              <button
                onClick={() => onOpacityChange(0.5)}
                className={`py-1 text-[10px] font-semibold rounded-md border transition-all cursor-pointer ${
                  overlayOpacity === 0.5
                    ? 'bg-[#102B4E] text-white border-[#102B4E]'
                    : 'bg-white/60 text-[#102B4E] border-white/80 hover:bg-white'
                }`}
              >
                Split (50%)
              </button>
              <button
                onClick={() => onOpacityChange(1)}
                className={`py-1 text-[10px] font-semibold rounded-md border transition-all cursor-pointer ${
                  overlayOpacity === 1
                    ? 'bg-[#102B4E] text-white border-[#102B4E]'
                    : 'bg-white/60 text-[#102B4E] border-white/80 hover:bg-white'
                }`}
              >
                Ref (100%)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full gn-panel hover:bg-white/95 border border-white text-[#102B4E] text-xs font-semibold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 cursor-pointer bg-white/85"
      >
        <Sliders className="w-3.5 h-3.5 text-[#C69A43]" />
        <span>Compare Canonical QA</span>
        {overlayOpacity > 0 ? (
          <Eye className="w-3.5 h-3.5 text-[#C69A43]" />
        ) : (
          <EyeOff className="w-3.5 h-3.5 text-gray-400" />
        )}
      </button>
    </div>
  );
};
