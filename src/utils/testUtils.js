// Testing utilities
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock Pi SDK
export const mockPiSDK = () => {
  window.Pi = {
    authenticate: jest.fn().mockResolvedValue({
      accessToken: 'test_token',
      user: {
        uid: 'test_user_123',
        username: 'testuser',
        email: 'test@example.com'
      }
    }),
    payments: {
      initiate: jest.fn((payment, callbacks) => {
        setTimeout(() => callbacks.onReadyForServerApproval('PAY_123'), 100);
      })
    }
  };
};

// Mock API responses
export const mockAuthResponse = {
  success: true,
  authToken: 'test_auth_token',
  user: {
    id: 'user_123',
    username: 'testuser',
    email: 'test@example.com',
    isVendor: false
  }
};

export const mockPaymentResponse = {
  success: true,
  id: 'PAY_123',
  amount: 50,
  memo: 'Test payment',
  metadata: {
    paymentId: 'PAY_123',
    productId: 1
  }
};

// Render with providers (if using Redux, Context, etc.)
export const renderWithProviders = (component, options = {}) => {
  return render(component, { ...options });
};

// Wait utilities
export const waitForElement = async (testId) => {
  return await screen.findByTestId(testId);
};

// User interaction helpers
export const clickButton = async (buttonName) => {
  const button = screen.getByRole('button', { name: new RegExp(buttonName, 'i') });
  await userEvent.click(button);
};

export const fillInput = async (labelText, value) => {
  const input = screen.getByLabelText(new RegExp(labelText, 'i'));
  await userEvent.type(input, value);
};

// Data generators
export const generateTestUser = (overrides = {}) => {
  return {
    id: 'user_' + Math.random().toString(36).substr(2, 9),
    username: 'testuser',
    email: 'test@example.com',
    isVendor: false,
    ...overrides
  };
};

export const generateTestPayment = (overrides = {}) => {
  return {
    id: 'PAY_' + Math.random().toString(36).substr(2, 9),
    userId: 'user_123',
    amount: 50,
    productId: 1,
    productName: 'Test Product',
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...overrides
  };
};

export const generateTestProduct = (overrides = {}) => {
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: 'Test Product',
    price: 50,
    seller: 'Test Seller',
    description: 'Test Description',
    image: '📦',
    ...overrides
  };
};
