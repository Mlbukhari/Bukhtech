import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Bukhtech</h3>
          <p>Production-ready Pi Network Marketplace dApp</p>
        </div>
        
        <div className="footer-section">
          <h4>Links</h4>
          <ul>
            <li><a href="https://pi-network.com" target="_blank" rel="noopener noreferrer">Pi Network</a></li>
            <li><a href="https://developers.pi-network.com" target="_blank" rel="noopener noreferrer">Developer Docs</a></li>
            <li><a href="https://github.com/Mlbukhari/Bukhtech" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: support@bukhtech.com</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 Bukhtech. All rights reserved. Built for Pi Network.</p>
      </div>
    </footer>
  );
};

export default Footer;
