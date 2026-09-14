import React from "react";

export function GooglePayLogo({ height = 18 }: { height?: number }) {
  return (
    <span className="upi-logo-badge" title="Google Pay">
      <svg
        height={height}
        viewBox="0 0 62 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", overflow: "visible" }}
      >
        <g transform="translate(1, 1) scale(0.8)">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </g>
        <text
          x="24"
          y="15.5"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="13"
          fontWeight="700"
          fill="#3f453d"
          letterSpacing="-0.3px"
        >
          Pay
        </text>
      </svg>
    </span>
  );
}

export function PhonePeLogo({ height = 18 }: { height?: number }) {
  return (
    <span className="upi-logo-badge" title="PhonePe">
      <svg
        height={height}
        viewBox="0 0 92 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", overflow: "visible" }}
      >
        <rect x="0" y="0.5" width="21" height="21" rx="5" fill="#5f259f" />
        <text
          x="10.5"
          y="16"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="13"
          fontWeight="900"
          fill="#ffffff"
          textAnchor="middle"
        >
          पे
        </text>
        <text
          x="26"
          y="15.5"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="12.5"
          fontWeight="800"
          fill="#5f259f"
          letterSpacing="-0.4px"
        >
          Phone<tspan fill="#3f453d">Pe</tspan>
        </text>
      </svg>
    </span>
  );
}

export function UpiLogo({ height = 18 }: { height?: number }) {
  return (
    <span className="upi-logo-badge" title="UPI - Unified Payments Interface">
      <svg
        height={height}
        viewBox="0 0 74 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", overflow: "visible" }}
      >
        {/* Green Arrow (Behind) */}
        <path
          d="M 45 2.5 L 56.5 10 L 40.5 17.5 Z"
          fill="#0f823a"
        />
        {/* Orange Arrow (Front with clean white separation gap) */}
        <path
          d="M 37.5 2.5 L 49 10 L 33 17.5 Z"
          fill="#f47920"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* UPI Text */}
        <text
          x="0"
          y="15.5"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="17"
          fontStyle="italic"
          fontWeight="900"
          fill="#4a4d4e"
          letterSpacing="0.4px"
        >
          UPI
        </text>
        {/* Subtitle */}
        <text
          x="0"
          y="22.5"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="4.1"
          fontStyle="italic"
          fontWeight="700"
          fill="#5a5d5e"
          letterSpacing="0.25px"
        >
          UNIFIED PAYMENTS INTERFACE
        </text>
      </svg>
    </span>
  );
}

export const BhimUpiLogo = UpiLogo;
