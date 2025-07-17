"use client";

import React, { useState, useRef } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = "bottom" 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-lg whitespace-nowrap ${positionClasses[position]}`}
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-gray-900 rotate-45 ${
              position === "top" 
                ? "top-full left-1/2 transform -translate-x-1/2 -mt-1"
                : position === "bottom"
                ? "bottom-full left-1/2 transform -translate-x-1/2 -mb-1"
                : position === "left"
                ? "left-full top-1/2 transform -translate-y-1/2 -ml-1"
                : "right-full top-1/2 transform -translate-y-1/2 -mr-1"
            }`}
          />
        </div>
      )}
    </div>
  );
};