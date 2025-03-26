import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  fullWidth = false,
  ...props
}) => {
  const baseStyles = "button-text rounded-lg shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 inline-flex items-center justify-center";

  const variantStyles = {
    primary: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 disabled:bg-red-300",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400 disabled:bg-gray-100 disabled:text-gray-400",
    outline: "bg-transparent border border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500 disabled:border-red-300 disabled:text-red-300",
    text: "bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50 focus:ring-red-500 disabled:text-red-300",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 disabled:bg-red-300",
  };

  const sizeStyles = {
    sm: "py-1 px-2 text-sm",
    md: "py-2 px-4",
    lg: "py-3 px-6 text-lg"
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${widthClass}
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;