import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import MarketplacePage from './pages/MarketplacePage';
import LoginPage from './pages/LoginPage';
import VendorDashboard from './pages/VendorDashboard';
import PaymentPage from './pages/PaymentPage';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVendor, setIsVendor] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsVendor(JSON.parse(storedUser).isVendor || false);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsVendor(userData.isVendor || false);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsVendor(false);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout} isVendor={isVendor}>
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/marketplace" element={<MarketplacePage user={user} />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />}
          />
          <Route
            path="/vendor-dashboard"
            element={user && isVendor ? <VendorDashboard user={user} /> : <Navigate to="/" />}
          />
          <Route
            path="/payment/:paymentId"
            element={user ? <PaymentPage user={user} /> : <Navigate to="/login" />}
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
