'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SecurityProviderProps {
  children: React.ReactNode;
}

export default function SecurityProvider({ children }: SecurityProviderProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const lastActivityRef = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Security settings
  const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes
  const WARNING_TIME = 4 * 60 * 1000; // 4 minutes - show warning

  useEffect(() => {
    if (status !== 'authenticated') return;

    const resetTimer = () => {
      lastActivityRef.current = Date.now();
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        console.log('🔒 Auto-logout due to inactivity');
        signOut({ 
          callbackUrl: '/login?reason=timeout',
          redirect: true 
        });
      }, INACTIVITY_TIMEOUT);
    };

    // Activity events to track
    const events = [
      'mousedown', 'mousemove', 'keypress', 'scroll', 
      'touchstart', 'click', 'focus', 'blur'
    ];

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    // Initial timer setup
    resetTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [status]);

  // Logout when browser/tab closes (beforeunload event)
  useEffect(() => {
    if (status !== 'authenticated') return;

    const handleBeforeUnload = () => {
      // Attempt to sign out (may not complete due to browser closing)
      signOut({ redirect: false });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [status]);

  // Show security warning if needed
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated') return;

    const warningInterval = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivityRef.current;
      
      if (timeSinceActivity >= WARNING_TIME && timeSinceActivity < INACTIVITY_TIMEOUT) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    }, 1000);

    return () => clearInterval(warningInterval);
  }, [status]);

  return (
    <>
      {children}
      {showWarning && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 animate-pulse">
          <div className="flex items-center space-x-2">
            <span className="text-lg">⚠️</span>
            <div>
              <div className="font-semibold">Security Warning</div>
              <div className="text-sm">You will be automatically logged out in 1 minute due to inactivity</div>
            </div>
            <button
              onClick={() => {
                lastActivityRef.current = Date.now();
                setShowWarning(false);
              }}
              className="bg-white text-red-500 px-2 py-1 rounded text-sm font-semibold"
            >
              Stay Logged In
            </button>
          </div>
        </div>
      )}
    </>
  );
} 