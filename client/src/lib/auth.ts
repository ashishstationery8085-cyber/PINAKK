export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('pinakk_token');
};

export const authHeaders = () => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const saveAuthToken = (token: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('pinakk_token', token);
};

export const clearAuthToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('pinakk_token');
};
