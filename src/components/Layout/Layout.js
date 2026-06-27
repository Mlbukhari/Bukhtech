import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, user, onLogout, isVendor }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="layout">
      <Header user={user} onLogout={onLogout} isVendor={isVendor} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
