import React from 'react';
import { render } from '@testing-library/react';
import HomePage from '../pages/HomePage';

describe('HomePage', () => {
  it('renders welcome message', () => {
    const { getByText } = render(<HomePage user={null} />);
    expect(getByText('Welcome to Bukhtech')).toBeInTheDocument();
  });

  it('shows sign in button when not logged in', () => {
    const { getByText } = render(<HomePage user={null} />);
    expect(getByText(/Sign in with Pi/i)).toBeInTheDocument();
  });

  it('shows marketplace button when logged in', () => {
    const user = {
      id: 'user_123',
      username: 'testuser',
      email: 'test@example.com',
      isVendor: false
    };
    const { getByText } = render(<HomePage user={user} />);
    expect(getByText('Explore Marketplace')).toBeInTheDocument();
  });

  it('displays features section', () => {
    const { getByText } = render(<HomePage user={null} />);
    expect(getByText('Why Choose Bukhtech?')).toBeInTheDocument();
    expect(getByText('Secure')).toBeInTheDocument();
    expect(getByText('Fast')).toBeInTheDocument();
  });
});
