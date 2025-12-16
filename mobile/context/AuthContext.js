import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import apiService from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Проверка сохраненной сессии при загрузке приложения
  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        apiService.token = token;
        const userData = await apiService.getUser();
        setUser(userData.user);
      }
    } catch (e) {
      console.error('Failed to restore token', e);
    } finally {
      setLoading(false);
    }
  };

  const authContext = {
    signIn: async (email, password) => {
      try {
        setError(null);
        const response = await apiService.login(email, password);
        setUser(response.user);
        return response;
      } catch (e) {
        setError(e.message);
        throw e;
      }
    },

    signUp: async (username, email, password) => {
      try {
        setError(null);
        const response = await apiService.register(username, email, password);
        setUser(response.user);
        return response;
      } catch (e) {
        setError(e.message);
        throw e;
      }
    },

    signOut: async () => {
      try {
        await apiService.logout();
        setUser(null);
      } catch (e) {
        setError(e.message);
      }
    },

    updateUser: async (userData) => {
      try {
        const response = await apiService.updateUser(userData);
        setUser(response.user);
        return response;
      } catch (e) {
        setError(e.message);
        throw e;
      }
    },

    user,
    loading,
    error,
    isSignedIn: !!user,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
