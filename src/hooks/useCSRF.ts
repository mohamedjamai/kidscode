import { useState, useEffect, useCallback } from 'react';
import { getCSRFConfig } from '@/lib/csrf';

interface UseCSRFReturn {
  token: string | null;
  loading: boolean;
  error: string | null;
  refreshToken: () => Promise<void>;
  getTokenFromCookie: () => string | null;
  isTokenValid: () => boolean;
}

export function useCSRF(): UseCSRFReturn {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const config = getCSRFConfig();

  // Get token from cookie
  const getTokenFromCookie = useCallback((): string | null => {
    if (typeof document === 'undefined') return null;
    
    try {
      const cookies = document.cookie.split(';');
      const csrfCookie = cookies.find(cookie => 
        cookie.trim().startsWith(`${config.cookieName}=`)
      );
      
      if (csrfCookie) {
        const token = csrfCookie.split('=')[1];
        return decodeURIComponent(token);
      }
    } catch (err) {
      console.warn('⚠️ Error reading CSRF token from cookie:', err);
    }
    
    return null;
  }, [config.cookieName]);

  // Check if token is valid (not expired)
  const isTokenValid = useCallback((): boolean => {
    const currentToken = token || getTokenFromCookie();
    if (!currentToken) return false;
    
    try {
      const parts = currentToken.split('.');
      if (parts.length !== 3) return false;
      
      const timestamp = parseInt(parts[1], 10);
      if (isNaN(timestamp)) return false;
      
      const now = Date.now();
      
      // Check if token is expired (with 5 minute buffer)
      const isValid = (now - timestamp) < (config.maxAge - 5 * 60 * 1000);
      
      if (!isValid) {
        console.log('⏰ CSRF token has expired');
      }
      
      return isValid;
    } catch (err) {
      console.warn('⚠️ Error validating CSRF token:', err);
      return false;
    }
  }, [token, config.maxAge, getTokenFromCookie]);

  // Fetch new CSRF token with retry logic
  const refreshToken = useCallback(async (retryCount = 0): Promise<void> => {
    const maxRetries = 3;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🔐 Fetching CSRF token (attempt ${retryCount + 1})...`);
      
      const response = await fetch('/api/csrf', {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ CSRF API error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.csrfToken) {
        setToken(data.csrfToken);
        setError(null);
        console.log('✅ CSRF token fetched successfully');
      } else {
        throw new Error(data.message || 'Failed to get CSRF token');
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Failed to fetch CSRF token:', errorMessage);
      
      // Retry logic
      if (retryCount < maxRetries) {
        console.log(`🔄 Retrying CSRF token fetch in ${(retryCount + 1) * 1000}ms...`);
        setTimeout(() => {
          refreshToken(retryCount + 1);
        }, (retryCount + 1) * 1000);
        return;
      }
      
      // Final failure
      setError(`Failed to get security token: ${errorMessage}`);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize token on mount
  useEffect(() => {
    const initializeToken = async () => {
      try {
        // First try to get token from cookie
        const cookieToken = getTokenFromCookie();
        
        if (cookieToken && isTokenValid()) {
          console.log('🔐 Using existing valid CSRF token from cookie');
          setToken(cookieToken);
          setLoading(false);
          setError(null);
        } else {
          // Fetch new token if none exists or is invalid
          console.log('🔐 No valid CSRF token found, fetching new one...');
          await refreshToken();
        }
      } catch (err) {
        console.error('❌ Error initializing CSRF token:', err);
        setError('Failed to initialize security token');
        setLoading(false);
      }
    };

    initializeToken();
  }, [getTokenFromCookie, isTokenValid, refreshToken]);

  // Auto-refresh token before expiration
  useEffect(() => {
    if (!token || error) return;

    const refreshInterval = setInterval(() => {
      if (!isTokenValid()) {
        console.log('🔐 CSRF token expired, auto-refreshing...');
        refreshToken();
      }
    }, 10 * 60 * 1000); // Check every 10 minutes

    return () => clearInterval(refreshInterval);
  }, [token, error, isTokenValid, refreshToken]);

  return {
    token: token || getTokenFromCookie(),
    loading,
    error,
    refreshToken: () => refreshToken(0),
    getTokenFromCookie,
    isTokenValid,
  };
} 