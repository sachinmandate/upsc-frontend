/**
 * Centralized API Service Layer
 * Handles all HTTP requests with JWT token injection and error handling
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

/**
 * Get JWT token from localStorage
 */
const getToken = () => {
  const token = localStorage.getItem('sachin_jwt');
  return token;
};

/**
 * Make API request with automatic JWT token injection
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add JWT token if available and not a public endpoint
  const token = getToken();
  if (token && !endpoint.includes('/auth/')) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle empty responses
    if (response.status === 204) {
      return { success: true };
    }

    const data = await response.json();

    // Handle errors from backend
    if (!response.ok) {
      const error = new Error(
        data.message || `HTTP Error: ${response.status}`
      );
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

/**
 * GET request
 */
export const apiGet = (endpoint) => {
  return apiRequest(endpoint, {
    method: 'GET',
  });
};

/**
 * POST request
 */
export const apiPost = (endpoint, data) => {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * PUT request
 */
export const apiPut = (endpoint, data) => {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * DELETE request
 */
export const apiDelete = (endpoint) => {
  return apiRequest(endpoint, {
    method: 'DELETE',
  });
};

/**
 * POST with FormData (for file uploads)
 */
export const apiPostFormData = (endpoint, formData) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {};

  // Add JWT token
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('FormData Upload Error:', error);
      throw error;
    });
};

export default {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
  postFormData: apiPostFormData,
};
