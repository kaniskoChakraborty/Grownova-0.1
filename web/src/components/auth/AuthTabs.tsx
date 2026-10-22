import React from 'react';

interface AuthTabsProps {
  activeTab: 'signin' | 'signup';
  onChange?: (tab: 'signin' | 'signup') => void;
  onTabChange?: (tab: 'signin' | 'signup') => void;
}

export const AuthTabs: React.FC<AuthTabsProps> = ({ activeTab, onChange, onTabChange }) => {
  const handleChange = (tab: 'signin' | 'signup') => {
    if (onChange) onChange(tab);
    if (onTabChange) onTabChange(tab);
  };

  return (
    <div className="w-full max-w-sm bg-black/[0.04] p-1 rounded-2xl border border-white/80 flex items-center shadow-2xs backdrop-blur-xs select-none">
      <button
        type="button"
        onClick={() => handleChange('signin')}
        className={`flex-1 py-2 px-4 rounded-xl text-[13.5px] font-semibold transition-all duration-200 cursor-pointer text-center ${
          activeTab === 'signin'
            ? 'bg-[#F7EEDA] text-[#102B4E] font-bold border border-[#C69A43]/40 shadow-xs'
            : 'text-[#65758B] hover:text-[#102B4E] hover:bg-white/40'
        }`}
      >
        Sign In
      </button>

      <button
        type="button"
        onClick={() => handleChange('signup')}
        className={`flex-1 py-2 px-4 rounded-xl text-[13.5px] font-semibold transition-all duration-200 cursor-pointer text-center ${
          activeTab === 'signup'
            ? 'bg-[#F7EEDA] text-[#102B4E] font-bold border border-[#C69A43]/40 shadow-xs'
            : 'text-[#65758B] hover:text-[#102B4E] hover:bg-white/40'
        }`}
      >
        Sign Up
      </button>
    </div>
  );
};

export default AuthTabs;
