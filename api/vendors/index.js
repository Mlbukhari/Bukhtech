const express = require('express');
const router = express.Router();
const { verifyAuthToken } = require('../utils/auth');
const { getVendorSales, registerVendor } = require('../utils/vendors');

// Get vendor dashboard data
router.get('/dashboard', verifyAuthToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get vendor sales
    const sales = getVendorSales(userId);
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0);
    const totalTransactions = sales.length;

    res.json({
      success: true,
      sales,
      totalRevenue,
      totalTransactions,
      vendorId: userId,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      error: 'Failed to get dashboard data',
    });
  }
});

// Register as vendor
router.post('/register', verifyAuthToken, async (req, res) => {
  try {
    const { shopName, description, piWalletAddress } = req.body;
    const userId = req.user.id;

    if (!shopName || !piWalletAddress) {
      return res.status(400).json({
        error: 'Missing required vendor fields',
      });
    }

    // Register vendor
    const vendor = registerVendor({
      userId,
      shopName,
      description,
      piWalletAddress,
      registeredAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      vendor,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Failed to register as vendor',
    });
  }
});

// Get vendor sales
router.get('/:vendorId/sales', verifyAuthToken, async (req, res) => {
  try {
    const { vendorId } = req.params;

    const sales = getVendorSales(vendorId);
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0);

    res.json({
      success: true,
      vendorId,
      sales,
      totalRevenue,
    });
  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({
      error: 'Failed to get sales data',
    });
  }
});

module.exports = router;
