'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';

export default function AccessibleHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const menuItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/lessons', label: 'Lessen', icon: '📚' },
    { href: '/student/dashboard', label: 'Student', icon: '👨‍🎓' },
    { href: '/teacher/dashboard', label: 'Docent', icon: '👩‍🏫' },
    { href: '/security-demo', label: 'Security', icon: '🔐' },
    { href: '/accessibility-demo', label: 'Toegankelijk', icon: '♿' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header 
      className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200"
      role="banner"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-lg p-1 transition-colors"
            aria-label="KidsCode - Ga naar homepage"
            onClick={closeMenu}
          >
            <span role="img" aria-hidden="true" className="text-xl sm:text-2xl">🚀</span>
            <span className="hidden xs:inline">KidsCode</span>
          </Link>

          {/* Desktop Navigation */}
          <nav 
            className="hidden lg:flex items-center space-x-1"
            role="navigation"
            aria-label="Hoofdnavigatie"
          >
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors touch-target"
                aria-label={item.label}
              >
                <span role="img" aria-hidden="true" className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Theme Toggle - Compact for mobile */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 transition-colors">
              {(['light', 'dark', 'system'] as const).map((themeName) => (
                <button
                  key={themeName}
                  onClick={() => setTheme(themeName)}
                  onKeyDown={(e) => handleKeyDown(e, () => setTheme(themeName))}
                  className={`p-1.5 sm:p-2 rounded-md text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 touch-target ${
                    theme === themeName 
                      ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                  aria-label={`Schakel naar ${themeName} thema`}
                  aria-pressed={theme === themeName}
                  role="button"
                >
                  <span className="text-sm sm:text-base">
                    {themeName === 'light' && (isMounted ? '☀️' : '🌙')}
                    {themeName === 'dark' && '🌙'}
                    {themeName === 'system' && '💻'}
                  </span>
                  <span className="sr-only">
                    {themeName === 'light' && 'Lichte modus'}
                    {themeName === 'dark' && 'Donkere modus'}
                    {themeName === 'system' && 'Systeem modus'}
                  </span>
                </button>
              ))}
            </div>

            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMenu}
              onKeyDown={(e) => handleKeyDown(e, toggleMenu)}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors touch-target"
              aria-label={isMenuOpen ? 'Sluit menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              type="button"
            >
              {/* Hamburger Icon */}
              <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
                <span 
                  className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                    isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}
                />
                <span 
                  className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span 
                  className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                    isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <nav
          id="mobile-menu"
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen 
              ? 'max-h-96 opacity-100 pb-4' 
              : 'max-h-0 opacity-0'
          }`}
          role="navigation"
          aria-label="Mobiele navigatie"
          aria-hidden={!isMenuOpen}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors touch-target"
                tabIndex={isMenuOpen ? 0 : -1}
                aria-label={item.label}
              >
                <span role="img" aria-hidden="true" className="text-2xl flex-shrink-0">
                  {item.icon}
                </span>
                <span className="font-medium text-base">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile-only Quick Actions */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/login"
              onClick={closeMenu}
              className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors touch-target"
            >
              <span>🔑</span>
              <span>Inloggen</span>
            </Link>
            <Link
              href="/help"
              onClick={closeMenu}
              className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors touch-target"
            >
              <span>❓</span>
              <span>Help</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Skip Link */}
      <a
        href="#main-content"
        className="absolute top-0 left-0 bg-blue-600 text-white px-4 py-2 rounded-br-lg transform -translate-y-full focus:translate-y-0 transition-transform z-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Spring naar hoofdinhoud
      </a>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </header>
  );
} 