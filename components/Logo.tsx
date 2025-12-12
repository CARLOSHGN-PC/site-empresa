
import React from 'react';
import { ContentService } from '../services/contentService';

export const Logo: React.FC<{ className?: string, mode?: 'light' | 'dark' }> = ({ className, mode = 'light' }) => {
  const data = ContentService.getData();
  const settings = data.settings;

  // mode 'light': White text (for dark backgrounds)
  // mode 'dark': Colored text (for white backgrounds)
  
  const accentColor = settings?.primaryColor || '#009E49'; 
  const darkColor = settings?.darkColor || '#0B3B24';
  
  const textColor = mode === 'light' ? 'text-white' : `text-[${darkColor}]`;
  const logoFill = mode === 'light' ? '#ffffff' : darkColor;
  
  // If user uploaded a custom logo
  if (settings?.logoUrl) {
      return (
        <div className={`flex items-center gap-3 ${className}`}>
             <img src={settings.logoUrl} alt={settings.companyName} className="h-12 w-auto object-contain" />
             <div className="flex flex-col leading-none select-none">
                <span className={`text-2xl font-extrabold tracking-tighter`} style={{ color: mode === 'light' ? '#fff' : darkColor }}>
                    {settings.companyName.split(' ')[0]}
                </span>
                <span className={`text-[8px] uppercase tracking-[0.3em] font-bold opacity-80 ml-0.5`} style={{ color: mode === 'light' ? '#fff' : darkColor }}>
                    {settings.companyName.split(' ').slice(1).join(' ')}
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
              {settings.companyName.split(' ')[0]}
          </span>
          <span className={`text-[8px] uppercase tracking-[0.3em] font-bold opacity-80 ml-0.5`} style={{ color: mode === 'light' ? '#fff' : darkColor }}>
              {settings.companyName.split(' ').slice(1).join(' ')}
          </span>
      </div>
    </div>
  );
};
