import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/Layout/Header';

describe('Header', () => {
  const mockLogout = jest.fn();

  it('renders logo', () => {
    render(
      <BrowserRouter>
        <Header user={null} onLogout={mockLogout} isVendor={false} menuOpen={false} setMenuOpen={() => {}} />
      </BrowserRouter>
    );
    expect(screen.getByText('Bukhtech')).toBeInTheDocument();
  });

  it('shows login button when not authenticated', () => {
    render(
      <BrowserRouter>
        <Header user={null} onLogout={mockLogout} isVendor={false} menuOpen={false} setMenuOpen={() => {}} />
      </BrowserRouter>
    );
    expect(screen.getByText(/Sign in with Pi/i)).toBeInTheDocument();
  });

  it('shows user info when authenticated', () => {
    const user = {
      id: 'user_123',
      username: 'testuser',
      email: 'test@example.com',
      isVendor: false
    };
    render(
      <BrowserRouter>
        <Header user={user} onLogout={mockLogout} isVendor={false} menuOpen={false} setMenuOpen={() => {}} />
      </BrowserRouter>
    );
    expect(screen.getByText(/Welcome, testuser/i)).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('shows vendor dashboard link for vendors', () => {
    const user = {
      id: 'user_123',
      username: 'testuser',
      email: 'test@example.com',
      isVendor: true
    };
    render(
      <BrowserRouter>
        <Header user={user} onLogout={mockLogout} isVendor={true} menuOpen={false} setMenuOpen={() => {}} />
      </BrowserRouter>
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
