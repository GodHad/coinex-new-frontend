import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
  showIcon?: boolean;
}

export function Tooltip({ content, children, showIcon = true }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-flex items-center group">
      {children}
      {showIcon && <HelpCircle className="w-4 h-4 ml-1 text-gray-400" />}
      <div className={`
        absolute z-50 w-64 p-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg
        transition-opacity duration-200
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        bottom-full left-1/2 transform -translate-x-1/2 mb-2
      `}>
        {content}
        <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 left-1/2 -translate-x-1/2 -bottom-1"></div>
      </div>
      <button
        className="absolute inset-0 w-full h-full cursor-help"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={(e) => e.preventDefault()}
      />
    </div>
  );
}