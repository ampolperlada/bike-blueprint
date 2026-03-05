'use client';

import { Settings, Maximize2, Grid3x3 } from 'lucide-react';

interface BlueprintHeaderProps {
  onSettingsClick: () => void;
  projectName?: string;
  revision?: string;
}

export function BlueprintHeader({ 
  onSettingsClick,
  projectName = "NMAX 155",
  revision = "REV 1.0"
}: BlueprintHeaderProps) {
  return (
    <header className="relative bg-gradient-to-r from-[#0D2136] to-[#0A1929] border-b-2 border-[#00B8D9]">
      {/* Corner Markers */}
      <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-[#00B8D9]"></div>
      <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-[#00B8D9]"></div>
      
      <div className="container mx-auto px-6 py-4">
        <div className="grid grid-cols-3 items-center">
          {/* Left - Project Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Grid3x3 className="w-4 h-4 text-[#00B8D9]" />
              <span className="text-[10px] text-[#80B3FF] font-mono uppercase tracking-widest">
                Technical Specification
              </span>
            </div>
            <div className="text-xs text-[#00B8D9] font-mono">
              DRG NO: BP-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
            </div>
          </div>
          
          {/* Center - Main Title */}
          <div className="text-center">
            <h1 className="font-['Orbitron'] text-2xl md:text-3xl font-bold text-[#00E5FF] uppercase tracking-wider relative inline-block">
              <span className="relative z-10">BikeBlueprint</span>
              <div className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent"></div>
            </h1>
            <p className="text-[10px] text-[#80B3FF] font-mono uppercase tracking-widest mt-1">
              3D Customization System
            </p>
          </div>
          
          {/* Right - Model Info + Settings */}
          <div className="flex items-center justify-end gap-4">
            {/* Model Spec Box */}
            <div className="hidden md:block bg-[#0D2136] border border-[#00B8D9] px-4 py-2">
              <div className="text-[9px] text-[#00B8D9] uppercase tracking-wider">Model</div>
              <div className="text-sm text-[#00E5FF] font-['Orbitron'] font-bold">{projectName}</div>
              <div className="text-[9px] text-[#80B3FF] font-mono">{revision}</div>
            </div>
            
            {/* Settings Button */}
            <button
              onClick={onSettingsClick}
              className="bp-button !px-3 !py-3 group relative"
              title="System Configuration"
            >
              <Settings className="w-5 h-5 transition-transform group-hover:rotate-90 duration-500" />
              
              {/* Pulsing indicator */}
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#00E676] rounded-full animate-pulse"></span>
            </button>
          </div>
        </div>
        
        {/* Bottom Info Bar */}
        <div className="mt-3 pt-3 border-t border-[#00B8D9]/30 flex justify-between items-center text-[9px] text-[#80B3FF] font-mono uppercase">
          <div className="flex gap-6">
            <span>SCALE: 1:1</span>
            <span>UNIT: MM</span>
            <span className="hidden md:inline">PROJECTION: ORTHOGRAPHIC</span>
          </div>
          <div className="flex gap-4">
            <span>STATUS: <span className="text-[#00E676]">ACTIVE</span></span>
            <span className="hidden md:inline">
              DATE: {new Date().toISOString().split('T')[0]}
            </span>
          </div>
        </div>
      </div>
      
      {/* Animated scan line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-50 animate-pulse"></div>
    </header>
  );
}