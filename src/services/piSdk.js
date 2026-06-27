// Pi SDK Integration Module
const PiSDK = {
  // Initialize Pi SDK
  init: async function(config = {}) {
    console.log('Initializing Pi SDK with config:', config);
    
    if (!window.Pi) {
      console.warn('Pi SDK not available in this environment');
      return false;
    }
    
    this.config = {
      appId: config.appId || process.env.REACT_APP_PI_APP_ID,
      environment: config.environment || process.env.REACT_APP_PI_ENVIRONMENT || 'testnet',
      ...config
    };
    
    return true;
  },

  // Sign in with Pi
  signIn: async function() {
    try {
      if (!window.Pi) {
        throw new Error('Pi SDK not available');
      }
      
      const result = await window.Pi.authenticate();
      return result;
    } catch (error) {
      console.error('Pi authentication error:', error);
      throw error;
    }
  },

  // Create payment
  createPayment: async function(paymentDetails) {
    try {
      if (!window.Pi || !window.Pi.payments) {
        throw new Error('Pi Payments API not available');
      }
      
      return new Promise((resolve, reject) => {
        window.Pi.payments.initiate(
          {
            amount: paymentDetails.amount,
            memo: paymentDetails.memo,
            metadata: paymentDetails.metadata
          },
          {
            onReadyForServerApproval: (paymentId) => {
              console.log('Payment ready for server approval:', paymentId);
              resolve({
                stage: 'server_approval',
                paymentId
              });
            },
            onReadyForServerCompletion: (paymentId, txid) => {
              console.log('Payment ready for server completion:', paymentId, txid);
              resolve({
                stage: 'completion',
                paymentId,
                txid
              });
            },
            onCancel: (paymentId) => {
              reject(new Error(`Payment cancelled: ${paymentId}`));
            },
            onError: (error) => {
              reject(new Error(`Payment error: ${error.message}`));
            }
          }
        );
      });
    } catch (error) {
      console.error('Payment creation error:', error);
      throw error;
    }
  },

  // Get user info
  getUserInfo: async function() {
    try {
      if (!window.Pi) {
        throw new Error('Pi SDK not available');
      }
      
      // In production, this would fetch from Pi's servers
      return window.Pi.user || null;
    } catch (error) {
      console.error('Get user info error:', error);
      throw error;
    }
  },

  // Verify payment on blockchain
  verifyPayment: async function(txid) {
    try {
      // In production, verify with Pi network
      console.log('Verifying payment:', txid);
      return true;
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  }
};

export default PiSDK;
