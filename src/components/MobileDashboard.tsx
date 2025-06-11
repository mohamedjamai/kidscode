'use client';

import { ReactNode } from 'react';

interface MobileDashboardProps {
  title: string;
  subtitle?: string;
  icon?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export default function MobileDashboard({ 
  title, 
  subtitle, 
  icon, 
  children, 
  actions 
}: MobileDashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 safe-area-top safe-area-bottom mobile-viewport-fix">
      {/* Compact Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="mobile-container-compact py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              {icon && (
                <div className="text-xl sm:text-2xl flex-shrink-0">{icon}</div>
              )}
              <div className="min-w-0 flex-1">
                <h1 className="text-responsive-lg font-bold text-gray-900 dark:text-white truncate">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-responsive-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            {actions && (
              <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compact Content */}
      <main className="mobile-container-compact mobile-padding-tight mobile-spacing-tight">
        {children}
      </main>
    </div>
  );
}

interface MobileCardProps {
  title?: string;
  subtitle?: string;
  icon?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function MobileCard({ 
  title, 
  subtitle, 
  icon, 
  children, 
  className = '', 
  onClick,
  disabled = false 
}: MobileCardProps) {
  const baseClasses = "mobile-card-compact transition-all duration-200";
  const interactiveClasses = onClick && !disabled 
    ? "cursor-pointer hover:shadow-lg active:scale-95 touch-target" 
    : "";
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <div 
      className={`${baseClasses} ${interactiveClasses} ${disabledClasses} ${className}`}
      onClick={onClick && !disabled ? onClick : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
    >
      {(title || subtitle || icon) && (
        <div className="flex items-center space-x-2 mb-2 sm:mb-3">
          {icon && (
            <div className="text-lg sm:text-xl flex-shrink-0">{icon}</div>
          )}
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="text-responsive-sm font-semibold text-gray-900 dark:text-white truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-responsive-xs text-gray-600 dark:text-gray-400 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}
      <div className="mobile-text-compact">
        {children}
      </div>
    </div>
  );
}

interface MobileGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function MobileGrid({ 
  children, 
  columns = 2, 
  className = '' 
}: MobileGridProps) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'mobile-grid-2',
    3: 'mobile-grid-3', 
    4: 'mobile-grid-4'
  };

  return (
    <div className={`grid ${gridClasses[columns]} mobile-spacing-compact ${className}`}>
      {children}
    </div>
  );
}

interface MobileButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export function MobileButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = ''
}: MobileButtonProps) {
  const baseClasses = "mobile-button-compact font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-900 no-zoom";
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white',
    secondary: 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-gray-500 text-gray-700 dark:text-gray-300',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 text-white',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const widthClasses = fullWidth ? 'w-full' : '';
  const disabledClasses = (disabled || loading) 
    ? 'opacity-50 cursor-not-allowed' 
    : 'hover:shadow-md active:scale-95';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${disabledClasses} ${className} touch-target`}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
          <span className="text-xs">Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

interface MobileStatsProps {
  title: string;
  value: string | number;
  icon?: string;
  trend?: {
    value: number;
    label?: string;
    positive?: boolean;
  };
  className?: string;
}

export function MobileStats({
  title,
  value,
  icon,
  trend,
  className = ''
}: MobileStatsProps) {
  return (
    <div className={`mobile-card-compact text-center ${className}`}>
      {icon && (
        <div className="text-lg sm:text-xl mb-1">{icon}</div>
      )}
      <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </div>
      <div className="text-responsive-xs text-gray-600 dark:text-gray-400 mb-1">
        {title}
      </div>
      {trend && (
        <div className={`text-xs flex items-center justify-center space-x-1 ${
          trend.positive ? 'text-green-600' : 'text-red-600'
        }`}>
          <span>{trend.positive ? '↗️' : '↘️'}</span>
          <span>{trend.value}%</span>
          {trend.label && <span className="truncate">{trend.label}</span>}
        </div>
      )}
    </div>
  );
} 