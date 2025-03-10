'use client'
import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'premium' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  isLoading?: boolean;
}

/**
 * Reusable button component with different variants and sizes
 */
export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  fullWidth = false,
  isLoading = false,
  className = '',
  ...props 
}: ButtonProps) {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg transition-colors';
  
  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    premium: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white hover:from-yellow-500 hover:to-yellow-700 shadow-md',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700'
  };
  
  // Disabled styles
  const disabledStyles = 'opacity-50 cursor-not-allowed';
  
  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';
  
  // Combine styles
  const buttonStyles = `
    ${baseStyles} 
    ${sizeStyles[size]} 
    ${variantStyles[variant]} 
    ${props.disabled ? disabledStyles : ''} 
    ${widthStyles}
    ${className}
  `;
  
  return (
    <button className={buttonStyles} {...props}>
      {isLoading ? (
        <span className="animate-spin">⟳</span>
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </button>
  );
}