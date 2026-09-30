interface AuthTabsProps {
  activeTab: 'signin' | 'signup';
  onTabChange: (tab: 'signin' | 'signup') => void;
}

export const AuthTabs = ({ activeTab, onTabChange }: AuthTabsProps) => {
  return (
    <div className="w-full bg-black/[0.04] p-1 rounded-2xl border border-white/60 flex items-center mb-6 shadow-2xs backdrop-blur-xs">
      <button
        type="button"
        onClick={() => onTabChange('signin')}
        className={`flex-1 py-2.5 px-4 rounded-xl text-[13.5px] font-semibold transition-all duration-200 cursor-pointer text-center select-none ${
          activeTab === 'signin'
            ? 'bg-[#E1C699] text-[#0B1E36] font-bold shadow-[0_2px_8px_rgba(225,198,153,0.4)]'
            : 'text-[#55677D] hover:text-[#0B1E36] hover:bg-white/30'
        }`}
      >
        Sign In
      </button>

      <button
        type="button"
        onClick={() => onTabChange('signup')}
        className={`flex-1 py-2.5 px-4 rounded-xl text-[13.5px] font-semibold transition-all duration-200 cursor-pointer text-center select-none ${
          activeTab === 'signup'
            ? 'bg-[#E1C699] text-[#0B1E36] font-bold shadow-[0_2px_8px_rgba(225,198,153,0.4)]'
            : 'text-[#55677D] hover:text-[#0B1E36] hover:bg-white/30'
        }`}
      >
        Sign Up
      </button>
    </div>
  );
};
