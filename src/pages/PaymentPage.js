import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/PaymentPage.css';

const PaymentPage = ({ user }) => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');

  // Sample product data
  const products = {
    1: { name: 'Premium Digital Course', price: 50, description: 'Learn blockchain development' },
    2: { name: 'Design Templates', price: 25, description: 'Professional UI kits' },
    3: { name: 'Software License', price: 100, description: '1 year license' },
    4: { name: 'Music Collection', price: 30, description: '100 royalty-free tracks' },
  };

  useEffect(() => {
    const product = products[paymentId];
    if (product) {
      setPayment({
        id: paymentId,
        ...product,
      });
    } else {
      setError('Product not found');
    }
    setLoading(false);
  }, [paymentId]);

  const handleInitiatePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!window.Pi) {
        throw new Error('Pi SDK not available');
      }

      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('Not authenticated');
      }

      // Create payment via backend
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          amount: payment.price,
          productId: payment.id,
          productName: payment.name,
          memo: `Payment for ${payment.name}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment');
      }

      const paymentData = await response.json();
      console.log('Payment created:', paymentData);

      // Initialize Pi payment
      window.Pi.payments.initiate({
        amount: payment.price,
        memo: paymentData.memo,
        metadata: {
          paymentId: paymentData.id,
          productId: payment.id,
        },
      },
      {
        onReadyForServerApproval: (paymentId) => {
          console.log('Payment ready for approval:', paymentId);
          handleServerApproval(paymentId);
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          console.log('Payment ready for completion:', paymentId, txid);
          handlePaymentCompletion(paymentId, txid);
        },
        onCancel: (paymentId) => {
          console.log('Payment cancelled:', paymentId);
          setPaymentStatus('cancelled');
          setError('Payment was cancelled');
        },
        onError: (error) => {
          console.error('Payment error:', error);
          setPaymentStatus('failed');
          setError(`Payment error: ${error.message}`);
        },
      });
    } catch (err) {
      console.error('Error initiating payment:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleServerApproval = async (paymentId) => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch('/api/payments/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          paymentId,
        }),
      });

      if (!response.ok) {
        throw new Error('Server approval failed');
      }

      console.log('Payment approved by server');
    } catch (err) {
      console.error('Server approval error:', err);
      setError(err.message);
    }
  };

  const handlePaymentCompletion = async (paymentId, txid) => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch('/api/payments/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          paymentId,
          txid,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment completion failed');
      }

      const result = await response.json();
      setPaymentStatus('completed');
      setLoading(false);
      
      // Show success message
      alert('Payment completed successfully!');
      
      // Redirect to marketplace after 3 seconds
      setTimeout(() => {
        navigate('/marketplace');
      }, 3000);
    } catch (err) {
      console.error('Payment completion error:', err);
      setError(err.message);
      setPaymentStatus('failed');
      setLoading(false);
    }
  };

  if (loading && !payment) {
    return <div className="loading">Loading payment details...</div>;
  }

  if (!payment) {
    return <div className="error">Product not found</div>;
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1>Complete Your Purchase</h1>
        
        <div className="payment-summary">
          <div className="summary-item">
            <label>Product:</label>
            <span>{payment.name}</span>
          </div>
          <div className="summary-item">
            <label>Description:</label>
            <span>{payment.description}</span>
          </div>
          <div className="summary-item">
            <label>Buyer:</label>
            <span>{user?.username || 'Unknown'}</span>
          </div>
          <div className="summary-item total">
            <label>Total Amount:</label>
            <span>{payment.price} π</span>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>⚠️ {error}</p>
          </div>
        )}

        {paymentStatus === 'completed' && (
          <div className="success-message">
            <p>✅ Payment completed successfully! Redirecting...</p>
          </div>
        )}

        {paymentStatus === 'pending' && (
          <button
            onClick={handleInitiatePayment}
            disabled={loading}
            className="btn btn-pi btn-large"
          >
            {loading ? 'Processing...' : '🥧 Pay with Pi'}
          </button>
        )}

        <div className="payment-info">
          <h3>How It Works:</h3>
          <ol>
            <li>Review the payment details above</li>
            <li>Click "Pay with Pi" to initiate payment</li>
            <li>Approve the transaction in Pi Browser</li>
            <li>Wait for server confirmation</li>
            <li>Receive instant access to your purchase</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
