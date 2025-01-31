"use client";

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline'; 
  size?: 'small' | 'medium' | 'large' | 'long'  ; 
  onClick?: () => void; 
  disabled?: boolean; 
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
}) => {
  const baseStyles = 'rounded transition duration-200 montserrat';
  const variantStyles = {
    default: 'text-white bg-neutral-800 rounded-full p-4 hover:bg-white hover:border hover:border-neutral-800 hover:text-black',
    outline: 'text-black border rounded-full border-black hover:bg-neutral-800 hover:text-white',
  }[variant];

  const sizeStyles = {
    small: 'text-sm py-2 px-8', 
    medium: 'text-base py-3 px-', 
    large: 'text-lg py-2 px-14', 
    long: 'text-base py-2 w-56', 
  }[size];

  const disabledStyles = 'opacity-50 cursor-not-allowed';

  return (
    <button
      className={`${variantStyles} ${baseStyles} ${sizeStyles} ${disabled ? disabledStyles : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
