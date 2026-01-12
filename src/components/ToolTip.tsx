import React, { useState } from "react";

interface ToolTipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const ToolTip = ({ content, children, className }: ToolTipProps) => {
  const [tooltipStyle, setTooltipStyle] = useState({
    top: 0,
    left: 0,
    display: "none",
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    const offset = 10; // Slight padding to avoid overlap with the cursor
    const tooltipWidth = 200; // Approximate width of the tooltip for bounds checking
    const tooltipHeight = 50; // Approximate height of the tooltip for bounds checking
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Calculate tooltip position such that the center aligns with the cursor
    const newLeft = e.clientX - tooltipWidth / 2;  // Move left by half the tooltip width
    const newTop = e.clientY - tooltipHeight / 2; // Move up by half the tooltip height

    setTooltipStyle({
      top: newTop,
      left: newLeft,
      display: "block",
    });
  };

  const handleMouseLeave = () => {
    setTooltipStyle({ ...tooltipStyle, display: "none" });
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <div
        className="fixed bg-gray-800 text-white px-2 py-1 rounded text-sm pointer-events-auto z-50 transition-opacity duration-300"
        style={{
          top: tooltipStyle.top,
          left: tooltipStyle.left,
          display: tooltipStyle.display,
          maxWidth: "200px",
          pointerEvents: "none",
        }}
      >
        {content}
      </div>
    </div>
  );
};

export default ToolTip;
