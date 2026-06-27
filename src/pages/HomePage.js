import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = ({ user }) => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Bukhtech</h1>
          <p className="hero-subtitle">Production-Ready Pi Network Marketplace</p>
          <p className="hero-description">
            Buy, sell, and trade with Pi Network. Secure, fast, and decentralized.
          </p>
          
          <div className="hero-actions">
            {user ? (
              <>
                <Link to="/marketplace" className="btn btn-primary btn-large">Explore Marketplace</Link>
                {user.isVendor && <Link to="/vendor-dashboard" className="btn btn-secondary btn-large">Vendor Dashboard</Link>}
              </>
            ) : (
              <Link to="/login" className="btn btn-primary btn-large">Sign in with Pi</Link>
            )}
          </div>
        </div>
      </section>
      
      <section className="features">
        <h2>Why Choose Bukhtech?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Secure</h3>
            <p>Built with Pi SDK and server-side verification for maximum security</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast</h3>
            <p>Instant payments powered by Pi Network blockchain</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Decentralized</h3>
            <p>Peer-to-peer marketplace without intermediaries</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile First</h3>
            <p>Optimized for Pi Browser and Pi App Studio</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>Vendor Ready</h3>
            <p>Complete dashboard for vendors and sellers</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Production</h3>
            <p>Enterprise-grade infrastructure on Vercel</p>
          </div>
        </div>
      </section>
      
      <section className="cta">
        <h2>Ready to Get Started?</h2>
        <p>Join the Pi Network marketplace revolution today</p>
        {user ? (
          <Link to="/marketplace" className="btn btn-primary btn-large">Start Trading</Link>
        ) : (
          <Link to="/login" className="btn btn-primary btn-large">Sign in with Pi</Link>
        )}
      </section>
    </div>
  );
};

export default HomePage;
