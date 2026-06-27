import { useState, useCallback } from 'react';
import PiSDK from '../services/piSdk';
import { authAPI } from '../services/api';

const usePiAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signIn = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Initialize Pi SDK
      await PiSDK.init();

      // Sign in with Pi
      const authResult = await PiSDK.signIn();

      // Verify with backend
      const response = await authAPI.verify(
        authResult.accessToken,
        authResult.user
      );

      // Store token and user
      localStorage.setItem('authToken', response.authToken);
      setUser(response.user);

      return response.user;
    } catch (err) {
      const errorMsg = err.message || 'Authentication failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authAPI.signout();
      localStorage.removeItem('authToken');
      setUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  }, []);

  const getMe = useCallback(async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.user);
      return response.user;
    } catch (err) {
      console.error('Get user error:', err);
    }
  }, []);

  return {
    user,
    loading,
    error,
    signIn,
    signOut,
    getMe,
  };
};

export default usePiAuth;
