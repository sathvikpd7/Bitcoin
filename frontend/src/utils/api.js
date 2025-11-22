// Centralized API client with environment-based base URL and runtime override

function getRuntimeApiBaseFromSettings() {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return null;
  }
  
  try {
    const stored = localStorage.getItem('appSettings');
    if (!stored) return null;
    
    const settings = JSON.parse(stored);
    if (settings && settings.apiBase && typeof settings.apiBase === 'string') {
      return settings.apiBase;
    }
  } catch (e) {
    console.warn('Failed to read API base from settings:', e);
  }
  return null;
}

// Use a function to get API_BASE_URL dynamically to avoid initialization issues
function getApiBase() {
  const runtimeBase = getRuntimeApiBaseFromSettings();
  if (runtimeBase) return runtimeBase;
  
  // Fallback to environment variable
  if (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  return '';
}

export async function postJson(path, body, options = {}) {
  const API_BASE_URL = getApiBase();
  const url = `${API_BASE_URL}${path}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      body: JSON.stringify(body),
      ...options
    });

    if (!response.ok) {
      let errorMessage = `Request failed (${response.status})`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch {
        const text = await response.text().catch(() => '');
        errorMessage = text || response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    // Enhance error message for better debugging
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error(`Network error: Unable to connect to ${url}. Please check if the backend server is running.`);
    }
    throw error;
  }
}

export async function getJson(path, options = {}) {
  const API_BASE_URL = getApiBase();
  const url = `${API_BASE_URL}${path}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });

    if (!response.ok) {
      let errorMessage = `Request failed (${response.status})`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch {
        const text = await response.text().catch(() => '');
        errorMessage = text || response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error(`Network error: Unable to connect to ${url}. Please check if the backend server is running.`);
    }
    throw error;
  }
}

export async function putJson(path, body, options = {}) {
  const API_BASE_URL = getApiBase();
  const url = `${API_BASE_URL}${path}`;
  
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      body: JSON.stringify(body),
      ...options
    });

    if (!response.ok) {
      let errorMessage = `Request failed (${response.status})`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch {
        const text = await response.text().catch(() => '');
        errorMessage = text || response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error(`Network error: Unable to connect to ${url}. Please check if the backend server is running.`);
    }
    throw error;
  }
}

export async function deleteJson(path, options = {}) {
  const API_BASE_URL = getApiBase();
  const url = `${API_BASE_URL}${path}`;
  
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });

    if (!response.ok) {
      let errorMessage = `Request failed (${response.status})`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch {
        const text = await response.text().catch(() => '');
        errorMessage = text || response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error(`Network error: Unable to connect to ${url}. Please check if the backend server is running.`);
    }
    throw error;
  }
}

export function getApiBaseUrl() {
  return getApiBase();
}
