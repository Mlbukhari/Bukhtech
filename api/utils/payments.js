// In-memory payment storage (use database in production)
const payments = {};

// Generate unique payment ID
function createPaymentId() {
  return `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Store payment
function storePayment(payment) {
  payments[payment.id] = payment;
  // In production, save to database
  console.log(`Payment ${payment.id} stored:`, payment);
}

// Get payment
function getPayment(paymentId) {
  return payments[paymentId];
}

// Get all payments for user
function getUserPayments(userId) {
  return Object.values(payments).filter(p => p.userId === userId);
}

// Update payment
function updatePayment(paymentId, updates) {
  if (payments[paymentId]) {
    payments[paymentId] = { ...payments[paymentId], ...updates };
  }
}

module.exports = {
  createPaymentId,
  storePayment,
  getPayment,
  getUserPayments,
  updatePayment,
};
