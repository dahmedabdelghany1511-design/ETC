import React from "react";

interface BluePyramidLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  textColor?: "white" | "dark";
  showSubtitle?: boolean;
  className?: string;
}

export const BluePyramidLogo: React.FC<BluePyramidLogoProps> = ({
  size = "md",
  showText = true,
  textColor = "white",
  showSubtitle = false,
  className = "",
}) => {
  const sizeMap = {
    sm: { icon: 28, text: "text-base", sub: "text-[10px]" },
    md: { icon: 40, text: "text-xl", sub: "text-xs" },
    lg: { icon: 56, text: "text-3xl", sub: "text-sm" },
    xl: { icon: 84, text: "text-5xl", sub: "text-base" },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* 3D Geometric Blue Pyramid SVG */}
      <div
        className="relative shrink-0 flex items-center justify-center filter drop-shadow-md"
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Pyramid Left Facet Gradient */}
            <linearGradient id="pyrLeftGrad" x1="50%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="60%" stopColor="#1565C0" />
              <stop offset="100%" stopColor="#0A4DA3" />
            </linearGradient>

            {/* Pyramid Right Facet Gradient */}
            <linearGradient id="pyrRightGrad" x1="50%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="45%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>

            {/* Base / Floor Shadow Gradient */}
            <linearGradient id="pyrBaseGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#0A4DA3" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#062552" stopOpacity="0.95" />
            </linearGradient>

            {/* Peak Glow Filter */}
            <filter id="peakGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Base Floor Reflection */}
          <polygon
            points="50,88 12,82 88,82"
            fill="url(#pyrBaseGrad)"
            opacity="0.35"
          />

          {/* Left Facet (Darker Blue with deep perspective) */}
          <polygon
            points="50,10 12,82 50,88"
            fill="url(#pyrLeftGrad)"
          />

          {/* Right Facet (Lighter reflective Blue) */}
          <polygon
            points="50,10 50,88 88,82"
            fill="url(#pyrRightGrad)"
          />

          {/* Center Precision Seam Line */}
          <line
            x1="50"
            y1="10"
            x2="50"
            y2="88"
            stroke="#93C5FD"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Diagonal Laser Accent / Tier Lines */}
          <path
            d="M32,48 L50,51 L68,48"
            stroke="#BAE6FD"
            strokeWidth="1"
            strokeDasharray="2 2"
            opacity="0.6"
          />
          <path
            d="M20,68 L50,72 L80,68"
            stroke="#BAE6FD"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.5"
          />

          {/* Peak Keystone Star / Diamond */}
          <polygon
            points="50,8 53,13 50,18 47,13"
            fill="#FFFFFF"
            filter="url(#peakGlow)"
          />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight ${currentSize.text} ${
                textColor === "white" ? "text-white" : "text-[#0A4DA3]"
              }`}
            >
              ETC
            </span>
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                textColor === "white"
                  ? "bg-white/20 text-white"
                  : "bg-[#EAF4FF] text-[#0A4DA3]"
              }`}
            >
              ERP & AI
            </span>
          </div>
          {showSubtitle && (
            <span
              className={`${currentSize.sub} font-medium leading-none mt-0.5 ${
                textColor === "white" ? "text-blue-100" : "text-slate-500"
              }`}
            >
              منصة المحاسبة والمراجعة والضرائب
            </span>
          )}
        </div>
      )}
    </div>
  );
};
