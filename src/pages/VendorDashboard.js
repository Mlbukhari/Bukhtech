import React, { useState, useEffect } from 'react';
import '../styles/VendorDashboard.css';

const VendorDashboard = ({ user }) => {
  const [sales, setSales] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch('/api/vendors/dashboard', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSales(data.sales || []);
        setTotalRevenue(data.totalRevenue || 0);
        setTotalTransactions(data.totalTransactions || 0);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="vendor-dashboard">
      <h1>Vendor Dashboard</h1>
      <p className="vendor-subtitle">Welcome back, {user?.username}!</p>

      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'sales' ? 'active' : ''}`}
          onClick={() => setActiveTab('sales')}
        >
          Sales
        </button>
        <button
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="overview-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>Total Revenue</h3>
                <p className="stat-value">{totalRevenue} π</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>Total Transactions</h3>
                <p className="stat-value">{totalTransactions}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <h3>Average Order Value</h3>
                <p className="stat-value">{ totalTransactions > 0 ? (totalRevenue / totalTransactions).toFixed(2) : 0} π</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3>Rating</h3>
                <p className="stat-value">4.8 / 5.0</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sales' && (
        <div className="sales-section">
          <h2>Recent Sales</h2>
          {sales.length > 0 ? (
            <table className="sales-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale, index) => (
                  <tr key={index}>
                    <td>{sale.id || `TXN-${index + 1}`}</td>
                    <td>{sale.product || 'Product'}</td>
                    <td>{sale.amount || 0} π</td>
                    <td>{sale.date || new Date().toLocaleDateString()}</td>
                    <td><span className="status-badge completed">Completed</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No sales yet. Start selling to see transactions here!</p>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="settings-section">
          <h2>Vendor Settings</h2>
          <div className="settings-form">
            <div className="form-group">
              <label>Shop Name</label>
              <input type="text" placeholder="Your shop name" defaultValue={user?.username} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Your email" defaultValue={user?.email} />
            </div>
            <div className="form-group">
              <label>Pi Wallet Address</label>
              <input type="text" placeholder="Your Pi wallet address" />
            </div>
            <div className="form-group">
              <label>Shop Description</label>
              <textarea placeholder="Describe your shop..."></textarea>
            </div>
            <button className="btn btn-primary">Save Settings</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
