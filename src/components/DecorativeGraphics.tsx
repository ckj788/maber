import React from "react";

// Spinning celestial ring of sacred geometry
export const HeroGeometry: React.FC = () => {
  return (
    <div className="relative w-full max-w-[420px] aspect-square mx-auto flex items-center justify-center overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-950/40 p-6 backdrop-blur-md shadow-2xl group transition-all duration-500 hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.15)] hover:border-neutral-800">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity duration-75" />

      {/* Rotating geometric layers */}
      <div className="absolute w-[80%] h-[80%] border border-dashed border-neutral-800 rounded-full animate-[spin_60s_linear_infinite]" />
      <div className="absolute w-[60%] h-[60%] border border-neutral-800 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
      <div className="absolute w-[40%] h-[40%] border border-dashed border-neutral-700/60 rounded-full animate-[spin_20s_linear_infinite]" />

      {/* Center glowing vector star */}
      <svg
        viewBox="0 0 100 100"
        className="w-[75%] h-[75%] relative select-none transition-transform duration-500 group-hover:scale-105"
      >
        <defs>
          <filter id="vectorGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Hexagon / octagram lattices */}
        <polygon
          points="50,5 95,50 50,95 5,50"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.75"
        />
        <polygon
          points="50,5 95,50 50,95 5,50"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.5"
          transform="rotate(45, 50, 50)"
        />

        {/* Outer circle rings */}
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
        <circle
          cx="50"
          cy="50"
          r="30"
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1.2"
          strokeDasharray="4 2 1 2"
        />

        {/* Inner star of David/Pyramid layout */}
        <polygon
          points="50,18 77,65 23,65"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.2"
        />
        <polygon
          points="50,82 77,35 23,35"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />

        {/* Orbit paths and nodes */}
        <circle cx="50" cy="18" r="2.5" fill="#ffffff" filter="url(#vectorGlow)" />
        <circle cx="77" cy="65" r="2.5" fill="rgba(255,255,255,0.7)" />
        <circle cx="23" cy="65" r="2.5" fill="rgba(255,255,255,0.7)" />

        <circle cx="50" cy="50" r="8" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        <circle cx="50" cy="50" r="2" fill="#ffffff" />
      </svg>
      
      {/* Decorative corners */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-neutral-800" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-neutral-800" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-neutral-800" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-neutral-800" />
    </div>
  );
};

// Harmony of the Cosmos mystical map
export const CosmicHarmony: React.FC = () => {
  return (
    <div className="relative w-full max-w-[390px] aspect-square mx-auto flex items-center justify-center overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-950/40 p-6 backdrop-blur-md shadow-2xl group transition-all duration-500 hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.1)] hover:border-neutral-800">
      <div className="absolute inset-0 bg-radial-gradient from-white/5 to-transparent pointer-events-none opacity-40 group-hover:opacity-50 transition-opacity duration-300" />

      {/* Rotating dial structures */}
      <div className="absolute w-[85%] h-[85%] border border-neutral-900 rounded-full animate-[spin_80s_linear_infinite]" />
      <div className="absolute w-[75%] h-[75%] border border-dotted border-neutral-800 rounded-full animate-[spin_50s_linear_infinite_reverse]" />

      <svg
        viewBox="0 0 100 100"
        className="w-[80%] h-[80%] relative select-none transition-transform duration-500 group-hover:scale-105"
      >
        {/* Constellations lines behind */}
        <path
          d="M15,25 L35,30 L50,15 L70,35 L85,20"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.8"
        />
        <path
          d="M20,70 L40,60 L50,85 L80,75"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.8"
        />

        {/* Nodes */}
        <circle cx="15" cy="25" r="1.5" fill="rgba(255,255,255,0.4)" />
        <circle cx="35" cy="30" r="1" fill="rgba(255,255,255,0.3)" />
        <circle cx="50" cy="15" r="2" fill="rgba(255,255,255,0.5)" />
        <circle cx="70" cy="35" r="1.5" fill="rgba(255,255,255,0.4)" />
        <circle cx="85" cy="20" r="2" fill="rgba(255,255,255,0.6)" />

        {/* concentric circles and compass */}
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
        <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Crosshair grids */}
        <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />
        <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />

        {/* Compass markings */}
        <path d="M50,5 L47,12 L53,12 Z" fill="rgba(255,255,255,0.4)" />
        <path d="M50,95 L47,88 L53,88 Z" fill="rgba(255,255,255,0.2)" />
        <path d="M5,50 L12,47 L12,53 Z" fill="rgba(255,255,255,0.2)" />
        <path d="M95,50 L88,47 L88,53 Z" fill="rgba(255,255,255,0.2)" />

        {/* Central pulsing gold-like glowing star */}
        <circle cx="50" cy="50" r="3.5" fill="#ffffff" />
        <circle cx="50" cy="50" r="9" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      </svg>
    </div>
  );
};

// Numerology pattern grid
export const NumerologyMap: React.FC = () => {
  return (
    <div className="relative w-full max-w-[390px] aspect-square mx-auto flex items-center justify-center overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-950/40 p-6 backdrop-blur-md shadow-2xl group transition-all duration-500 hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.1)] hover:border-neutral-800">
      <div className="absolute inset-0 bg-radial-gradient from-white/5 to-transparent pointer-events-none opacity-40 group-hover:opacity-50 transition-opacity duration-300" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] opacity-70" />

      <svg
        viewBox="0 0 100 100"
        className="w-[80%] h-[80%] relative select-none transition-transform duration-500 group-hover:scale-105"
      >
        {/* Connection matrix */}
        <polygon
          points="50,15 80,45 65,80 35,80 20,45"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
        <line x1="50" y1="15" x2="65" y2="80" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
        <line x1="50" y1="15" x2="35" y2="80" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
        <line x1="20" y1="45" x2="80" y2="45" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
        <line x1="20" y1="45" x2="65" y2="80" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
        <line x1="80" y1="45" x2="35" y2="80" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />

        {/* Nodes with custom numeric glyphs */}
        <circle cx="50" cy="15" r="7" fill="#0c0c0e" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        <text x="50" y="15" fill="#f3f3f1" fontSize="8" fontFamily="serif" textAnchor="middle" dominantBaseline="central">9</text>

        <circle cx="80" cy="45" r="7" fill="#0c0c0e" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <text x="80" y="45" fill="rgba(255,255,255,0.6)" fontSize="8" fontFamily="serif" textAnchor="middle" dominantBaseline="central">3</text>

        <circle cx="65" cy="80" r="7" fill="#0c0c0e" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <text x="65" y="80" fill="rgba(255,255,255,0.6)" fontSize="8" fontFamily="serif" textAnchor="middle" dominantBaseline="central">7</text>

        <circle cx="35" cy="80" r="7" fill="#0c0c0e" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <text x="35" y="80" fill="rgba(255,255,255,0.6)" fontSize="8" fontFamily="serif" textAnchor="middle" dominantBaseline="central">1</text>

        <circle cx="20" cy="45" r="7" fill="#0c0c0e" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <text x="20" y="45" fill="rgba(255,255,255,0.6)" fontSize="8" fontFamily="serif" textAnchor="middle" dominantBaseline="central">5</text>

        {/* Center node */}
        <circle cx="50" cy="50" r="8" fill="#1d1d21" stroke="#ffffff" strokeWidth="1.2" />
        <text x="50" y="50" fill="#ffffff" fontWeight="bold" fontSize="9" fontFamily="serif" textAnchor="middle" dominantBaseline="central">O</text>
      </svg>
    </div>
  );
};

// Report cover dynamic mockup
export const ReportMockup: React.FC = () => {
  return (
    <div className="relative w-full max-w-[280px] aspect-[3/4] mx-auto rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 p-6 flex flex-col justify-between shadow-2xl group transition-all duration-300 hover:border-neutral-700">
      {/* Texture in catalog / book */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
      <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/50 via-white/[0.04] to-transparent" />

      {/* Frame border */}
      <div className="absolute inset-2 border border-neutral-900 pointer-events-none rounded-lg" />

      {/* Top details */}
      <div className="flex flex-col gap-0.5 relative z-10 text-center select-none pt-4">
        <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-500 font-mono">COSMIC BLUEPRINT</span>
        <div className="border-b border-neutral-900 w-12 mx-auto my-1.5" />
        <span className="text-sm font-serif tracking-[0.15em] text-neutral-300">Level 4 Calibration</span>
      </div>

      {/* Center glowing lock or central vector */}
      <div className="flex flex-col items-center justify-center relative z-10 py-6">
        <div className="w-14 h-14 rounded-full border border-neutral-800 flex items-center justify-center bg-neutral-900/60 relative mb-2">
          {/* Glowing dot effect */}
          <div className="absolute inset-0 rounded-full bg-white/5 animate-pulse" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 text-neutral-400 group-hover:text-neutral-200 transition-colors"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <span className="text-[10px] tracking-widest text-[#ecebe7] font-serif uppercase mt-1">PERSONALIZED REPORT</span>
        <span className="text-[9px] text-neutral-500 font-mono mt-0.5">3-4 PAGES · VERIFIED GEOMETRY</span>
      </div>

      {/* Footer details */}
      <div className="relative z-10 text-center pb-2 select-none flex flex-col items-center">
        <div className="text-[11px] font-serif tracking-[0.25em] text-neutral-400">OMNIORA</div>
        <div className="text-[8px] font-mono text-neutral-600 mt-1 uppercase">EST. 2025 · SHADOW & LIGHT</div>
      </div>
    </div>
  );
};
