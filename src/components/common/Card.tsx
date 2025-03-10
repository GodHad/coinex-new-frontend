'use client'
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string | React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

/**
 * Reusable card component for consistent UI
 */
export function Card({ children, title, actions, className = '', noPadding = false }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {title && (
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {typeof title === 'string' ? <h2 className="text-lg font-semibold">{title}</h2> : title}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  );
}