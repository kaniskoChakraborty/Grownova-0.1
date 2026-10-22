import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/apiClient';

export const SystemStatusPill: React.FC = () => {
  const { isDemoMode } = useAuth();
  const [isOnline, setIsOnline] = useState<boolean>(false);

  // Probe backend /api/health endpoint via shared apiClient
  useEffect(() => {
    let isMounted = true;
    const checkHealth = async () => {
      try {
        const data = await apiClient.get<{ status: string }>('/health', { skipAuth: true });
        if (isMounted) setIsOnline(data?.status === 'ok');
      } catch {
        if (isMounted) setIsOnline(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 flex-wrap select-none">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-white shadow-sm text-xs font-semibold text-[#102B4E]">
        <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#15803D]' : 'bg-[#EAB308]'} animate-pulse`} />
        <span>{isOnline ? 'API Connected' : 'Backend Standby'}</span>
      </div>
      {isDemoMode ? (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-[#C69A43] tracking-wider uppercase">
          <span>Demo Mode</span>
        </div>
      ) : (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-700 tracking-wider uppercase">
          <span>Live Session</span>
        </div>
      )}
      <div className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/60 border border-white/80 text-[10px] font-medium text-[#55677D]">
        <span>Latency 14ms • AES-256</span>
      </div>
    </div>
  );
};

export const EditorialTopRight: React.FC = () => {
  return (
    <div className="flex flex-col items-start select-none">
      <p className="font-serif italic text-sm sm:text-base font-normal text-[#102B4E]/85 leading-snug">
        “Same vision.
        <br />
        A bigger tomorrow.”
      </p>
      {/* Short gold accent line below quote */}
      <div className="w-6 h-[2px] bg-[#C69A43] mt-2 rounded-full" />
    </div>
  );
};

export const EditorialBottomRight: React.FC = () => {
  return (
    <div className="flex items-center gap-2 select-none text-xs font-medium text-[#65758B]">
      <div className="w-5 h-[1.5px] bg-[#C69A43] rounded-full" />
      <span>Grow further. Together.</span>
    </div>
  );
};

export const EditorialBottomLeft: React.FC = () => {
  return (
    <div className="flex flex-col gap-2 select-none">
      <p className="font-serif italic text-xs sm:text-sm text-[#102B4E]/80 leading-snug">
        “Progress
        <br />
        lives here.”
      </p>
      <SystemStatusPill />
    </div>
  );
};
