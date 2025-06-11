'use client';

import { useEffect } from 'react';
import AccessibleHeader from './AccessibleHeader';
import { ThemeProvider } from '@/contexts/ThemeContext';

interface AccessibleLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

function AccessibleLayoutInner({ children, title, description }: AccessibleLayoutProps) {
  // Set page title and description
  useEffect(() => {
    if (title) {
      document.title = `${title} - KidsCode`;
    }
    
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = description;
        document.head.appendChild(meta);
      }
    }
  }, [title, description]);

  // Add keyboard navigation helpers
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // Alt + M = Skip to main content
      if (e.altKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      }

      // Alt + N = Skip to navigation
      if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        const navigation = document.querySelector('[role="navigation"]');
        if (navigation instanceof HTMLElement) {
          navigation.focus();
          navigation.scrollIntoView({ behavior: 'smooth' });
        }
      }

      // Escape key closes mobile menus
      if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('max-h-0')) {
          // Find the mobile menu button and trigger it
          const menuButton = document.querySelector('[aria-controls="mobile-menu"]');
          if (menuButton instanceof HTMLElement) {
            menuButton.click();
            menuButton.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Accessibility announcements */}
      <div 
        id="accessibility-announcements" 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
        role="status"
      />

      <AccessibleHeader />
      
      <main 
        id="main-content"
        className="focus:outline-none"
        role="main"
        tabIndex={-1}
      >
        {children}
      </main>

      {/* Footer */}
      <footer 
        className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto"
        role="contentinfo"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Over KidsCode
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Een veilige en toegankelijke omgeving waar kinderen leren programmeren met plezier.
              </p>
              <div className="flex space-x-2">
                <span className="text-2xl" role="img" aria-label="Toegankelijkheid">♿</span>
                <span className="text-2xl" role="img" aria-label="Mobiel vriendelijk">📱</span>
                <span className="text-2xl" role="img" aria-label="Donkere modus">🌙</span>
                <span className="text-2xl" role="img" aria-label="Toetsenbord navigatie">⌨️</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Snelle Links
              </h3>
              <nav aria-label="Footer navigatie">
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="/lessons" 
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-colors"
                    >
                      📚 Alle Lessen
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/security-demo" 
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-colors"
                    >
                      🔐 Security Demo
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/accessibility-demo" 
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-colors"
                    >
                      ♿ Accessibility Demo
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Accessibility Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Toegankelijkheid
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <p>
                  <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Alt + M</kbd> 
                  <span className="ml-2">Spring naar hoofdinhoud</span>
                </p>
                <p>
                  <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Alt + N</kbd>
                  <span className="ml-2">Spring naar navigatie</span>
                </p>
                <p>
                  <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Esc</kbd>
                  <span className="ml-2">Sluit menu's</span>
                </p>
                <p className="text-xs mt-3">
                  Ontworpen voor screen readers en toetsenbord navigatie
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © 2024 KidsCode - Toegankelijk, Veilig, Inclusief
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function AccessibleLayout(props: AccessibleLayoutProps) {
  return (
    <ThemeProvider>
      <AccessibleLayoutInner {...props} />
    </ThemeProvider>
  );
} 