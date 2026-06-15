import React from "react";
import { TriangleData } from "../types";

interface PyramidSvgProps {
  data: TriangleData | null;
}

export const PyramidSvg: React.FC<PyramidSvgProps> = ({ data }) => {
  // Define our rect parameters to dynamically place text center coordinates, style classes, and labels
  const rects = [
    { id: "I_val", key: "I" as keyof TriangleData, label: "I", x: 290, y: 565, w: 120, h: 90, grad: "url(#gPearl)", textClass: "fill-neutral-900 font-extrabold stroke-black/10 stroke-[0.5px]" },
    { id: "J_val", key: "J" as keyof TriangleData, label: "J", x: 460, y: 565, w: 120, h: 90, grad: "url(#gPearl)", textClass: "fill-neutral-900 font-extrabold stroke-black/10 stroke-[0.5px]" },
    { id: "K_val", key: "K" as keyof TriangleData, label: "K", x: 620, y: 565, w: 120, h: 90, grad: "url(#gPearl)", textClass: "fill-neutral-900 font-extrabold stroke-black/10 stroke-[0.5px]" },
    { id: "L_val", key: "L" as keyof TriangleData, label: "L", x: 790, y: 565, w: 120, h: 90, grad: "url(#gPearl)", textClass: "fill-neutral-900 font-extrabold stroke-black/10 stroke-[0.5px]" },
    
    { id: "M_val", key: "M" as keyof TriangleData, label: "M", x: 460, y: 445, w: 120, h: 90, grad: "url(#gMoon)", textClass: "fill-neutral-900 font-extrabold stroke-black/10 stroke-[0.5px]" },
    { id: "N_val", key: "N" as keyof TriangleData, label: "N", x: 620, y: 445, w: 120, h: 90, grad: "url(#gMoon)", textClass: "fill-neutral-900 font-extrabold stroke-black/10 stroke-[0.5px]" },
    
    // Core Archetype Center Node (O)
    { id: "O_val", key: "O" as keyof TriangleData, label: "O", x: 540, y: 300, w: 120, h: 110, grad: "url(#gInk)", textClass: "fill-white font-black stroke-white/5 stroke-[0.5px] drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]" },
    
    { id: "Q_val", key: "Q" as keyof TriangleData, label: "Q", x: 460, y: 30, w: 120, h: 90, grad: "url(#gMoon)", textClass: "fill-neutral-900 font-extrabold stroke-black/10 stroke-[0.5px]" },
    { id: "P_val", key: "P" as keyof TriangleData, label: "P", x: 620, y: 30, w: 120, h: 90, grad: "url(#gMoon)", textClass: "fill-neutral-900 font-extrabold stroke-black/10 stroke-[0.5px]" },
    { id: "R_val", key: "R" as keyof TriangleData, label: "R", x: 540, y: -80, w: 120, h: 90, grad: "url(#gPearl)", textClass: "fill-neutral-900 font-extrabold stroke-black/10 stroke-[0.5px]" },
    
    { id: "T_val", key: "T" as keyof TriangleData, label: "T", x: 60, y: 565, w: 120, h: 90, grad: "url(#gMoon)", textClass: "fill-neutral-900 font-extrabold stroke-black/10 stroke-[0.5px]" },
    { id: "S_val", key: "S" as keyof TriangleData, label: "S", x: -80, y: 565, w: 120, h: 90, grad: "url(#gMoon)", textClass: "fill-neutral-900 font-extrabold stroke-black/10 stroke-[0.5px]" },
    { id: "U_val", key: "U" as keyof TriangleData, label: "U", x: -10, y: 445, w: 120, h: 90, grad: "url(#gPearl)", textClass: "fill-neutral-900 font-extrabold stroke-black/10 stroke-[0.5px]" },
    
    { id: "V_val", key: "V" as keyof TriangleData, label: "V", x: 1160, y: 565, w: 120, h: 90, grad: "url(#gMoon)", textClass: "fill-neutral-900 font-extrabold stroke-black/10 stroke-[0.5px]" },
    { id: "W_val", key: "W" as keyof TriangleData, label: "W", x: 1020, y: 565, w: 120, h: 90, grad: "url(#gMoon)", textClass: "fill-neutral-900 font-extrabold stroke-black/10 stroke-[0.5px]" },
    { id: "X_val", key: "X" as keyof TriangleData, label: "X", x: 1090, y: 445, w: 120, h: 90, grad: "url(#gPearl)", textClass: "fill-neutral-900 font-extrabold stroke-black/10 stroke-[0.5px]" }
  ];

  return (
    <svg
      id="pyramid"
      viewBox="-120 -120 1440 960"
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-full max-h-[600px] select-none"
    >
      <defs>
        <filter id="shadowSoft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#000000" floodOpacity="0.45" />
        </filter>
        <filter id="triGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComponentTransfer in="blur" result="glow">
            <feFuncA type="linear" slope="0.3" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Dynamic, luxurious color gradients as referenced in the guidelines */}
        <linearGradient id="gPearl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4f3f1" />
          <stop offset="100%" stopColor="#e7e5e2" />
        </linearGradient>
        <linearGradient id="gMoon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ecebe7" />
          <stop offset="100%" stopColor="#dedcd7" />
        </linearGradient>
        <linearGradient id="gInk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#252528" />
          <stop offset="100%" stopColor="#0e0e11" />
        </linearGradient>

        <marker
          id="arrowHead"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 Z" fill="#e6e6e2" />
        </marker>
      </defs>

      {/* Main geometric pyramid lines */}
      <polygon
        points="600,160 220,660 980,660"
        fill="transparent"
        stroke="#e6e6e2"
        strokeWidth="1.6"
        className="opacity-70"
        filter="url(#triGlow)"
      />

      <line x1="295" y1="560" x2="902" y2="560" stroke="#e6e6e2" strokeWidth="1.2" className="opacity-60" />
      <line x1="404" y1="420" x2="796" y2="420" stroke="#e6e6e2" strokeWidth="1.2" className="opacity-60" />
      <line x1="600" y1="160" x2="600" y2="660" stroke="#e6e6e2" strokeWidth="1.2" className="opacity-60" />

      {/* Central cosmic glyph marker showing active query position */}
      <g id="main-star" fill="#e64646" stroke="rgba(255,255,255,0.4)" strokeWidth="1" transform="translate(600,260)" className="animate-pulse">
        <polygon points="0,-18 5,-6 18,-6 8,2 12,15 0,7 -12,15 -8,2 -18,-6 -5,-6" />
      </g>

      {/* Primary indicator for O (or core archetype path) */}
      <text x="160" y="210" fill="#f3f3f1" fontSize="24" fontWeight="600" fontFamily="serif" className="tracking-wider">
        Core Archetype
      </text>
      <line
        x1="240"
        y1="206"
        x2="520"
        y2="260"
        stroke="#e6e6e2"
        strokeWidth="1.6"
        markerEnd="url(#arrowHead)"
        className="opacity-80"
      />

      {/* Render rect elements statically or dynamically with actual math data */}
      {rects.map(({ id, key, label, x, y, w, h, grad, textClass }) => {
        const cx = x + w / 2;
        const cy = y + h / 2;
        const displayVal = data ? String(data[key]) : label;

        return (
          <g key={id} className="transition-transform duration-300 hover:-translate-y-1 cursor-crosshair">
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              rx={10}
              fill={grad}
              stroke="#1b1b1b"
              strokeWidth="1.4"
              filter="url(#shadowSoft)"
              className="transition-all duration-300 hover:stroke-white/40"
            />
            <text
              id={id}
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={key === "O" ? 44 : 34}
              fontFamily="sans-serif"
              className={`${textClass} select-none transition-all duration-300`}
            >
              {displayVal}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
