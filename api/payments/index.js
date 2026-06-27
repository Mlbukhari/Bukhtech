const express = require('express');
const router = express.Router();
const { verifyAuthToken, verifyPiSignature } = require('../utils/auth');
const { createPaymentId, storePayment, getPayment } = require('../utils/payments');

// Create payment
router.post('/create', verifyAuthToken, async (req, res) => {
  try {
    const { amount, productId, productName, memo } = req.body;
    const userId = req.user.id;

    if (!amount || !productId || !productName) {
      return res.status(400).json({
        error: 'Missing required payment fields',
      });
    }

    // Generate unique payment ID
    const paymentId = createPaymentId();

    // Store payment record
    const payment = {
      id: paymentId,
      userId,
      amount,
      productId,
      productName,
      memo,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    storePayment(payment);

    res.json({
      success: true,
      id: paymentId,
      amount,
      memo: memo || `Payment for ${productName}`,
      metadata: {
        paymentId,
        productId,
      },
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({
      error: 'Failed to create payment',
    });
  }
});

// Server approval of payment
router.post('/approve', verifyAuthToken, async (req, res) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        error: 'Missing paymentId',
      });
    }

    // Get payment record
    const payment = getPayment(paymentId);
    if (!payment) {
      return res.status(404).json({
        error: 'Payment not found',
      });
    }

    // Update payment status
    payment.status = 'server_approved';
    payment.serverApprovedAt = new Date().toISOString();
    storePayment(payment);

    res.json({
      success: true,
      paymentId,
      status: 'server_approved',
    });
  } catch (error) {
    console.error('Payment approval error:', error);
    res.status(500).json({
      error: 'Failed to approve payment',
    });
  }
});

// Complete payment
router.post('/complete', verifyAuthToken, async (req, res) => {
  try {
    const { paymentId, txid } = req.body;

    if (!paymentId || !txid) {
      return res.status(400).json({
        error: 'Missing paymentId or txid',
      });
    }

    // Get payment record
    const payment = getPayment(paymentId);
    if (!payment) {
      return res.status(404).json({
        error: 'Payment not found',
      });
    }

    // Verify payment on blockchain (in production)
    // For now, we'll mark it as complete
    payment.status = 'completed';
    payment.txid = txid;
    payment.completedAt = new Date().toISOString();
    storePayment(payment);

    res.json({
      success: true,
      paymentId,
      txid,
      status: 'completed',
      message: 'Payment completed successfully',
    });
  } catch (error) {
    console.error('Payment completion error:', error);
    res.status(500).json({
      error: 'Failed to complete payment',
    });
  }
});

// Get payment details
router.get('/:paymentId', verifyAuthToken, async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = getPayment(paymentId);
    if (!payment) {
      return res.status(404).json({
        error: 'Payment not found',
      });
    }

    res.json(payment);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      error: 'Failed to get payment',
    });
  }
});

module.exports = router;
