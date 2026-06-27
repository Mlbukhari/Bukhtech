import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize Pi SDK
    if (window.Pi) {
      console.log('Pi SDK loaded');
    }
  }, []);

  const handlePiSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!window.Pi) {
        throw new Error('Pi SDK not loaded. Please ensure you are accessing from Pi Browser or Pi App Studio.');
      }

      // Request authentication from Pi SDK
      const authResult = await window.Pi.authenticate();
      
      if (!authResult) {
        throw new Error('Authentication failed');
      }

      // Verify with backend
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: authResult.accessToken,
          user: authResult.user,
        }),
      });

      if (!response.ok) {
        throw new Error('Server verification failed');
      }

      const data = await response.json();
      
      // Store auth token and user data
      localStorage.setItem('authToken', data.authToken);
      
      const userData = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        isVendor: data.user.isVendor,
      };
      
      onLogin(userData);
      navigate('/marketplace');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in with Pi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h1>Sign in with Pi</h1>
          <p className="login-subtitle">Secure authentication powered by Pi Network</p>
          
          {error && (
            <div className="error-message">
              <p>⚠️ {error}</p>
            </div>
          )}
          
          <div className="info-box">
            <h3>ℹ️ How it works:</h3>
            <ol>
              <li>Click the button below to authenticate</li>
              <li>Approve the request in Pi Browser or Pi App Studio</li>
              <li>You'll be redirected to the marketplace</li>
            </ol>
          </div>
          
          <button
            onClick={handlePiSignIn}
            disabled={loading}
            className="btn btn-pi btn-large"
          >
            {loading ? 'Signing in...' : '🥧 Sign in with Pi'}
          </button>
          
          <div className="login-footer">
            <p>Don't have a Pi account? <a href="https://pi-network.com" target="_blank" rel="noopener noreferrer">Create one</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
