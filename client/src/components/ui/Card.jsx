import React from 'react';

const Card = ({
  children,
  className = '',
  title,
  subtitle,
  padding = 'normal',
  elevation = 'md',
  border = false,
  ...props
}) => {
  const paddingVariants = {
    none: '',
    xs: 'p-2',
    sm: 'p-4',
    normal: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const elevationVariants = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  return (
    <div
      className={`
        bg-white rounded-xl overflow-hidden
        ${paddingVariants[padding]}
        ${elevationVariants[elevation]}
        ${border ? 'border border-gray-200' : ''}
        ${className}
      `}
      {...props}
    >
      {title && (
        <div className="mb-4">
          <h3 className="card-title">{title}</h3>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '', ...props }) => {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`} {...props}>
      {children}
    </h3>
  );
};

export const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-6 py-3 bg-gray-50 border-t border-gray-100 ${className}`} {...props}>
      {children}
    </div>
  );
};

// New card component variants for different color contexts
export const CardWithBackground = ({
  children,
  className = '',
  bgColor = 'bg-gray-100',
  textColor = 'text-gray-900',
  ...props
}) => {
  return (
    <div className={`rounded-lg shadow overflow-hidden ${bgColor} ${textColor} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardWithDarkHeader = ({
  children,
  title,
  headerBgColor = 'bg-red-600',
  headerTextColor = 'text-white',
  className = '',
  ...props
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden" {...props}>
      <div className={`px-6 py-4 ${headerBgColor} ${headerTextColor}`}>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className={`${className}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;