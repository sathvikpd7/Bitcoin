// Centralized API client with environment-based base URL and runtime override
function getRuntimeApiBaseFromSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem('appSettings') || '{}');
    if (stored.apiBase && typeof stored.apiBase === 'string') return stored.apiBase;
  } catch {}
  return null;
}

const API_BASE_URL = getRuntimeApiBaseFromSettings() || import.meta.env.VITE_API_BASE_URL || '';

export async function postJson(path, body, options = {}) {
  const url = `${API_BASE_URL}${path}`;
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
    const text = await response.text().catch(() => '');
    throw new Error(`Request failed (${response.status}): ${text || response.statusText}`);
  }

  return response.json();
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}


