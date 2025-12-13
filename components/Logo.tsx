
import React from 'react';
import { GlobalSettings } from '../types';

interface LogoProps {
  className?: string;
  mode?: 'light' | 'dark';
  settings?: GlobalSettings;
}

export const Logo: React.FC<LogoProps> = ({ className, mode = 'light', settings }) => {
  // Use passed settings or defaults (defensive fallback)
  
  const accentColor = settings?.primaryColor || '#009E49'; 
  const darkColor = settings?.darkColor || '#0B3B24';
  const companyName = settings?.companyName || 'CACU Agroindustrial';
  
  const logoFill = mode === 'light' ? '#ffffff' : darkColor;
  
  // Helper to split name for styling
  const nameParts = companyName.split(' ');
  const firstName = nameParts[0];
  const restName = nameParts.slice(1).join(' ');

  // If user uploaded a custom logo
  if (settings?.logoUrl) {
      return (
        <div className={`flex items-center gap-3 ${className}`}>
             <img src={settings.logoUrl} alt={companyName} className="h-12 w-auto object-contain" />
             <div className="flex flex-col leading-none select-none">
                <span className={`text-2xl font-extrabold tracking-tighter`} style={{ color: mode === 'light' ? '#fff' : darkColor }}>
                    {firstName}
                </span>
                <span className={`text-[8px] uppercase tracking-[0.3em] font-bold opacity-80 ml-0.5`} style={{ color: mode === 'light' ? '#fff' : darkColor }}>
                    {restName}
                </span>
            </div>
        </div>
      );
  }

  // Default SVG Logo
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon: Triangle Shape */}
      <div className="relative w-10 h-10">
         <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
            {/* Main Body */}
            <path d="M15 85 L50 15 L85 85 H15 Z" fill={logoFill} />
            
            {/* Cutout Effect */}
            <path d="M50 35 L70 75 H30 L50 35" fill={mode === 'light' ? darkColor : '#ffffff'} />
            
            {/* Green Leaf Base */}
            <path d="M15 85 H85 C85 85 95 85 95 95 H5 C5 85 15 85 15 85" fill={accentColor} />
         </svg>
      </div>
      
      <div className="flex flex-col leading-none select-none">
          <span className={`text-2xl font-extrabold tracking-tighter`} style={{ color: mode === 'light' ? '#fff' : darkColor }}>
              {firstName}
          </span>
          <span className={`text-[8px] uppercase tracking-[0.3em] font-bold opacity-80 ml-0.5`} style={{ color: mode === 'light' ? '#fff' : darkColor }}>
              {restName}
          </span>
      </div>
    </div>
  );
};
