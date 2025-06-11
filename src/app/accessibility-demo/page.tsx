'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export default function AccessibilityDemo() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [selectedFontSize, setSelectedFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [screenReaderText, setScreenReaderText] = useState('Welcome to the KidsCode accessibility demo');
  const [mounted, setMounted] = useState(false);

  // Derived state for dark mode
  const darkMode = resolvedTheme === 'dark';

  useEffect(() => {
    setMounted(true);
    
    // Check for user preferences
    const savedFontSize = localStorage.getItem('fontSize') as 'normal' | 'large' | 'xlarge';
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    const savedReduceMotion = localStorage.getItem('reduceMotion') === 'true';
    
    if (savedFontSize) setSelectedFontSize(savedFontSize);
    if (savedHighContrast) setHighContrast(savedHighContrast);
    if (savedReduceMotion) setReduceMotion(savedReduceMotion);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Apply font size to document
    document.documentElement.style.fontSize = selectedFontSize === 'large' ? '18px' : selectedFontSize === 'xlarge' ? '20px' : '16px';
    localStorage.setItem('fontSize', selectedFontSize);
  }, [selectedFontSize, mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    // Apply high contrast mode
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    localStorage.setItem('highContrast', highContrast.toString());
  }, [highContrast, mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    // Apply reduced motion preference
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    localStorage.setItem('reduceMotion', reduceMotion.toString());
  }, [reduceMotion, mounted]);

  const testKeyboardNavigation = () => {
    alert('Try using Tab, Shift+Tab, Enter, and Space keys to navigate through the interface. All interactive elements should be accessible via keyboard.');
  };

  const testScreenReader = () => {
    const speech = new SpeechSynthesisUtterance(screenReaderText);
    speech.rate = 0.8;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
  };

  const accessibilityFeatures = [
    {
      icon: '🌙',
      title: 'Dark Mode',
      description: 'Reduces eye strain in low light',
      active: darkMode,
      action: toggleTheme,
      color: 'from-indigo-500 to-purple-600'
    },
    {
      icon: '🔍',
      title: 'Large Text',
      description: 'Easier reading for visual impairments',
      active: selectedFontSize !== 'normal',
      action: () => {
        const sizes: ('normal' | 'large' | 'xlarge')[] = ['normal', 'large', 'xlarge'];
        const currentIndex = sizes.indexOf(selectedFontSize);
        const nextIndex = (currentIndex + 1) % sizes.length;
        setSelectedFontSize(sizes[nextIndex]);
      },
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: '⚡',
      title: 'High Contrast',
      description: 'Better visibility for low vision',
      active: highContrast,
      action: () => setHighContrast(!highContrast),
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: '🚀',
      title: 'Reduce Motion',
      description: 'Minimizes animations and transitions',
      active: reduceMotion,
      action: () => setReduceMotion(!reduceMotion),
      color: 'from-green-500 to-teal-600'
    }
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading accessibility demo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${highContrast ? 'high-contrast' : ''} ${reduceMotion ? 'reduce-motion' : ''}`}>
      {/* Professional Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                ♿
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Accessibility Demo ✨
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Inclusive design for everyone
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => window.location.href = '/'}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                aria-label="Go to homepage"
              >
                🏠 Home
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Introduction */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-6 text-white mb-6 shadow-xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-3xl">♿</div>
            <div>
              <h2 className="text-xl font-bold">Accessibility Features</h2>
              <p className="text-green-100 text-sm">Making KidsCode inclusive for all learners</p>
            </div>
          </div>
          <p className="text-sm opacity-90">
            Our platform is designed to be accessible to students with different abilities and needs. 
            Explore the features below to customize your experience.
          </p>
        </div>

        {/* Quick Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            {accessibilityFeatures.map((feature, index) => (
              <button
                key={index}
                onClick={feature.action}
                className={`p-4 rounded-xl transition-all duration-200 ${
                  feature.active
                    ? `bg-gradient-to-r ${feature.color} text-white shadow-lg transform scale-105`
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                aria-pressed={feature.active}
                aria-label={`${feature.title}: ${feature.active ? 'enabled' : 'disabled'}`}
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <div className="text-sm font-semibold mb-1">{feature.title}</div>
                <div className="text-xs opacity-80">{feature.description}</div>
                {feature.active && (
                  <div className="text-xs mt-2 font-medium">✓ Active</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size Demo */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Text Size Options</h3>
          <div className="space-y-3">
            {['normal', 'large', 'xlarge'].map((size) => (
              <button
                key={size}
                onClick={() => setSelectedFontSize(size as any)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  selectedFontSize === size
                    ? 'bg-blue-100 dark:bg-blue-900/20 border-2 border-blue-500'
                    : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
                aria-pressed={selectedFontSize === size}
              >
                <div className={`font-semibold text-gray-900 dark:text-white ${
                  size === 'normal' ? 'text-sm' :
                  size === 'large' ? 'text-base' : 'text-lg'
                }`}>
                  {size === 'normal' ? 'Normal Text' :
                   size === 'large' ? 'Large Text' : 'Extra Large Text'}
                </div>
                <div className={`text-gray-600 dark:text-gray-400 ${
                  size === 'normal' ? 'text-xs' :
                  size === 'large' ? 'text-sm' : 'text-base'
                }`}>
                  This is how text will appear with {size} size setting
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Tests */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Interactive Tests</h3>
          <div className="space-y-4">
            {/* Keyboard Navigation Test */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Keyboard Navigation</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                All features work with keyboard-only navigation
              </p>
              <button
                onClick={testKeyboardNavigation}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Test keyboard navigation"
              >
                🎹 Test Keyboard Navigation
              </button>
            </div>

            {/* Screen Reader Test */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">Screen Reader Support</h4>
              <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                Content is properly labeled for screen readers
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={testScreenReader}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  aria-label="Test screen reader by speaking sample text"
                >
                  🔊 Speak Sample Text
                </button>
                <input
                  type="text"
                  value={screenReaderText}
                  onChange={(e) => setScreenReaderText(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter text to speak"
                  aria-label="Text to speak with screen reader"
                />
              </div>
            </div>

            {/* Focus Indicators */}
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">Focus Indicators</h4>
              <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">
                Clear visual indicators when elements have focus
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                  Button 1
                </button>
                <button className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                  Button 2
                </button>
                <button className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                  Button 3
                </button>
              </div>
              <p className="text-xs text-purple-700 dark:text-purple-300 mt-2">
                Try using Tab key to navigate between these buttons
              </p>
            </div>
          </div>
        </div>

        {/* Accessibility Standards */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Accessibility Standards</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">WCAG 2.1 AA</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We follow Web Content Accessibility Guidelines for inclusive design
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Keyboard First</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Full functionality available via keyboard navigation
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Screen Readers</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Compatible with NVDA, JAWS, VoiceOver, and other assistive technologies
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Color Contrast</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All text meets AA color contrast requirements
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white text-center shadow-xl">
          <div className="text-4xl mb-3">🌟</div>
          <h2 className="text-xl font-bold mb-2">Inclusive Learning for All</h2>
          <p className="text-blue-100 text-sm mb-4">
            KidsCode is designed to be accessible to learners of all abilities. Start your coding journey today!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
            >
              🚀 Start Learning
            </button>
            <button
              onClick={() => window.location.href = '/lessons'}
              className="px-6 py-3 bg-white/20 text-white border border-white/30 rounded-lg font-medium hover:bg-white/30 transition-colors focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
            >
              📚 Browse Lessons
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 