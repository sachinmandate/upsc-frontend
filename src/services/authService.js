/**
 * Authentication Service
 * Handles student login, registration, and token management
 */

import { apiPost } from './api';

export const authService = {
  /**
   * Register a new student
   */
  registerStudent: async (formData) => {
    try {
      const response = await apiPost('/auth/student/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        district: formData.district,
        taluka: formData.taluka,
        city: formData.city,
        organization: formData.organization,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Login student
   */
  loginStudent: async (email, password) => {
    try {
      const response = await apiPost('/auth/student/login', {
        email,
        password,
      });

      // Store JWT token
      if (response.token) {
        localStorage.setItem('sachin_jwt', response.token);
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout student
   */
  logout: () => {
    localStorage.removeItem('sachin_jwt');
    localStorage.removeItem('studyPulse_user');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('sachin_jwt');
  },

  /**
   * Get stored JWT token
   */
  getToken: () => {
    return localStorage.getItem('sachin_jwt');
  },
};

export default authService;
