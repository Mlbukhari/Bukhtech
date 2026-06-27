import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ user, onLogout, isVendor, menuOpen, setMenuOpen }) => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>🚀 Bukhtech</h1>
          <span className="tagline">Pi Network Marketplace</span>
        </Link>
        
        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/marketplace" className="nav-link">Marketplace</Link>
          {user && isVendor && <Link to="/vendor-dashboard" className="nav-link">Dashboard</Link>}
          
          <div className="nav-auth">
            {user ? (
              <>
                <span className="user-info">Welcome, {user.username}</span>
                <button onClick={onLogout} className="btn btn-logout">Logout</button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary">Sign in with Pi</Link>
            )}
          </div>
        </nav>
        
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>
    </header>
  );
};

export default Header;
