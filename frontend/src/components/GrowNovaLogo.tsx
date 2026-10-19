import React from 'react';
import { GrowNovaCompassLogo } from './GrowNovaCompassLogo';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  light?: boolean;
}

export const GrowNovaLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  light = false,
}) => {
  return (
    <div className={`inline-flex items-center ${light ? 'brightness-200' : ''} ${className}`}>
      <GrowNovaCompassLogo
        size={size}
        showText={true}
        variant={showSubtitle ? 'subtitled' : 'classic'}
      />
    </div>
  );
};
