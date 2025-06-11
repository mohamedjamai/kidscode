import { getCSRFConfig } from './csrf';

interface SecureRequestOptions extends RequestInit {
  csrfToken?: string;
  skipCSRF?: boolean;
}

/**
 * Make a secure API request with CSRF protection
 */
export async function secureRequest(
  url: string, 
  options: SecureRequestOptions = {}
): Promise<Response> {
  const { csrfToken, skipCSRF = false, ...requestOptions } = options;
  const config = getCSRFConfig();
  
  // Skip CSRF for GET requests or when explicitly disabled
  const isWriteOperation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(
    (requestOptions.method || 'GET').toUpperCase()
  );
  
  if (!skipCSRF && isWriteOperation) {
    let token = csrfToken;
    
    // If no token provided, try to get from cookie
    if (!token && typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const csrfCookie = cookies.find(cookie => 
        cookie.trim().startsWith(`${config.cookieName}=`)
      );
      if (csrfCookie) {
        token = decodeURIComponent(csrfCookie.split('=')[1]);
      }
    }
    
    if (!token) {
      console.warn('⚠️ No CSRF token available for write operation');
      throw new Error('CSRF token required for this operation');
    }
    
    // Add CSRF token to headers
    const headers = new Headers(requestOptions.headers);
    headers.set(config.headerName, token);
    requestOptions.headers = headers;
    
    console.log(`🔐 Added CSRF token to ${requestOptions.method || 'POST'} request`);
  }
  
  return fetch(url, {
    credentials: 'same-origin',
    ...requestOptions,
  });
}

/**
 * POST request with CSRF protection
 */
export async function securePost(
  url: string,
  data: any,
  options: SecureRequestOptions = {}
): Promise<Response> {
  return secureRequest(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * PUT request with CSRF protection
 */
export async function securePut(
  url: string,
  data: any,
  options: SecureRequestOptions = {}
): Promise<Response> {
  return secureRequest(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * PATCH request with CSRF protection
 */
export async function securePatch(
  url: string,
  data: any,
  options: SecureRequestOptions = {}
): Promise<Response> {
  return secureRequest(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * DELETE request with CSRF protection
 */
export async function secureDelete(
  url: string,
  options: SecureRequestOptions = {}
): Promise<Response> {
  return secureRequest(url, {
    method: 'DELETE',
    ...options,
  });
}

/**
 * Form submission with CSRF protection
 */
export async function secureFormSubmit(
  url: string,
  formData: FormData,
  options: SecureRequestOptions = {}
): Promise<Response> {
  const { csrfToken, skipCSRF = false, ...requestOptions } = options;
  const config = getCSRFConfig();
  
  if (!skipCSRF) {
    let token = csrfToken;
    
    // If no token provided, try to get from cookie
    if (!token && typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const csrfCookie = cookies.find(cookie => 
        cookie.trim().startsWith(`${config.cookieName}=`)
      );
      if (csrfCookie) {
        token = decodeURIComponent(csrfCookie.split('=')[1]);
      }
    }
    
    if (!token) {
      throw new Error('CSRF token required for form submission');
    }
    
    // Add CSRF token to form data
    formData.append('csrf_token', token);
    console.log('🔐 Added CSRF token to form submission');
  }
  
  return fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    body: formData,
    ...requestOptions,
  });
}

/**
 * Secure GET request - no CSRF needed for GET requests
 * But provides consistent error handling and logging
 */
export const secureGet = async (
  url: string,
  options: Omit<RequestInit, 'method'> = {}
): Promise<Response> => {
  console.log('🔍 Secure GET request to:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    console.error('❌ GET request failed:', response.status, response.statusText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}; 