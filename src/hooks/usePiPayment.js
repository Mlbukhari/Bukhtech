import { useState, useCallback } from 'react';
import { paymentsAPI } from '../services/api';
import PiSDK from '../services/piSdk';

const usePiPayment = () => {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPayment = useCallback(async (amount, productId, productName, memo) => {
    setLoading(true);
    setError(null);

    try {
      // Create payment in backend
      const paymentData = await paymentsAPI.create(amount, productId, productName, memo);
      setPayment(paymentData);

      // Initiate Pi payment
      const result = await PiSDK.createPayment({
        amount,
        memo: memo || `Payment for ${productName}`,
        metadata: {
          paymentId: paymentData.id,
          productId,
        },
      });

      return result;
    } catch (err) {
      const errorMsg = err.message || 'Payment failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const approvePayment = useCallback(async (paymentId) => {
    try {
      const result = await paymentsAPI.approve(paymentId);
      return result;
    } catch (err) {
      console.error('Approval error:', err);
      throw err;
    }
  }, []);

  const completePayment = useCallback(async (paymentId, txid) => {
    try {
      const result = await paymentsAPI.complete(paymentId, txid);
      setPayment(null);
      return result;
    } catch (err) {
      console.error('Completion error:', err);
      throw err;
    }
  }, []);

  const getPaymentDetails = useCallback(async (paymentId) => {
    try {
      const details = await paymentsAPI.getDetails(paymentId);
      setPayment(details);
      return details;
    } catch (err) {
      console.error('Get payment error:', err);
      throw err;
    }
  }, []);

  return {
    payment,
    loading,
    error,
    createPayment,
    approvePayment,
    completePayment,
    getPaymentDetails,
  };
};

export default usePiPayment;
