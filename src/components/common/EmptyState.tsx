'use client'
import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

/**
 * Reusable empty state component for when there's no data to display
 */
export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      {icon && (
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {action}
    </div>
  );
}