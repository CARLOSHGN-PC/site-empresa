import React from 'react';

export const Logo: React.FC<{ className?: string, mode?: 'light' | 'dark' }> = ({ className, mode = 'light' }) => {
  // mode 'light': White text (for dark green backgrounds)
  // mode 'dark': Dark Green text (for white backgrounds)
  
  const fillColor = mode === 'light' ? 'fill-white' : 'fill-cacu-dark';
  const accentColor = mode === 'light' ? '#009E49' : '#009E49'; // Always vibrant green for the leaf part
  const textColor = mode === 'light' ? 'text-white' : 'text-cacu-dark';
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon: Triangle Shape strictly mimicking the PDF logo */}
      <div className="relative w-10 h-10">
         <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
            {/* Main Body */}
            <path d="M15 85 L50 15 L85 85 H15 Z" className={fillColor} />
            
            {/* Cutout Effect */}
            <path d="M50 35 L70 75 H30 L50 35" fill={mode === 'light' ? '#0B3B24' : '#ffffff'} />
            
            {/* Green Leaf Base - The signature "A" crossbar */}
            <path d="M15 85 H85 C85 85 95 85 95 95 H5 C5 85 15 85 15 85" fill={accentColor} />
         </svg>
      </div>
      
      <div className="flex flex-col leading-none select-none">
          <span className={`text-2xl font-extrabold tracking-tighter ${textColor}`}>CACU</span>
          <span className={`text-[8px] uppercase tracking-[0.3em] font-bold ${textColor} opacity-80 ml-0.5`}>Agroindustrial</span>
      </div>
    </div>
  );
};