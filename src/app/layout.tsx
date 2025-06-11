import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from '@/components/Providers';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'KidsCode - Leren Programmeren voor Kinderen',
    template: '%s | KidsCode'
  },
  description: 'Een veilige en toegankelijke omgeving waar kinderen leren programmeren met plezier. Volledig toegankelijk, mobiel-vriendelijk en inclusief ontworpen.',
  keywords: ['programmeren', 'kinderen', 'HTML', 'CSS', 'JavaScript', 'Python', 'onderwijs', 'toegankelijk'],
  authors: [{ name: 'KidsCode Team' }],
  creator: 'KidsCode',
  publisher: 'KidsCode',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    title: 'KidsCode - Leren Programmeren voor Kinderen',
    description: 'Een veilige en toegankelijke omgeving waar kinderen leren programmeren met plezier.',
    siteName: 'KidsCode',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KidsCode - Leren Programmeren voor Kinderen',
    description: 'Een veilige en toegankelijke omgeving waar kinderen leren programmeren met plezier.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Prevent flash of unstyled content */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const isDark = theme === 'dark' || (theme === 'system' && systemDark) || (!theme && systemDark);
                
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch {}
            `,
          }}
        />
        
        {/* Accessibility meta tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      
      <body 
        className={`${inter.className} font-sans antialiased`}
        // Prevent layout shift during hydration
        suppressHydrationWarning
      >
        {/* Skip link for screen readers */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white px-4 py-2 rounded-br-lg z-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Spring naar hoofdinhoud
        </a>
        
        <Providers>
          {children}
        </Providers>
        
        {/* Screen reader announcements for route changes */}
        <div 
          id="route-announcer" 
          aria-live="assertive" 
          aria-atomic="true" 
          className="sr-only"
        />
      </body>
    </html>
  );
}
