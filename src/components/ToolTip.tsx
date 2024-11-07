import React from "react";

interface ToolTipProps {
  content: React.ReactNode
  children: React.ReactNode;
  className?: string;
}

const toolTip = ({ content, children, className }: ToolTipProps) => {
  return (
    <div className={`relative group ${className}`}>
      {children}
      <div className="absolute bottom-[110%] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {content}
      </div>
    </div>
  );
};

export default toolTip;
