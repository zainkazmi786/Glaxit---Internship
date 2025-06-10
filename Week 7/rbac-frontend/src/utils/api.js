

const API_BASE_URL = import.meta.env.VITE_API_URL
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }
  });
  console.log(`API Call: ${API_BASE_URL}${endpoint}`, options);
  let data;
  try {
    data = await response.json(); // ✅ always parse
  } catch (err) {
    throw new Error('Invalid JSON response from server');
  }

  if (!response.ok) {
    // ✅ throw actual backend error message if available
    throw new Error(data.message || `API Error: ${response.status}`);
  }

  return data;
};
