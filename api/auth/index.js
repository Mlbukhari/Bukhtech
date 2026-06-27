const express = require('express');
const router = express.Router();
const { verifyAuthToken, generateAuthToken } = require('./utils/auth');

// Sign in with Pi
router.post('/signin', async (req, res) => {
  try {
    const { accessToken, user } = req.body;

    if (!accessToken || !user) {
      return res.status(400).json({
        error: 'Missing accessToken or user data',
      });
    }

    // In production, verify the accessToken with Pi SDK
    // For now, we'll accept it as is
    const authToken = generateAuthToken(user);

    res.json({
      success: true,
      authToken,
      user: {
        id: user.uid,
        username: user.username,
        email: user.email,
        isVendor: false,
      },
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({
      error: 'Failed to sign in',
    });
  }
});

// Verify authentication token
router.post('/verify', async (req, res) => {
  try {
    const { accessToken, user } = req.body;

    if (!accessToken || !user) {
      return res.status(400).json({
        error: 'Missing accessToken or user data',
      });
    }

    // Verify with Pi SDK (in production)
    // For now, we'll create a session token
    const authToken = generateAuthToken(user);

    res.json({
      success: true,
      authToken,
      user: {
        id: user.uid,
        username: user.username,
        email: user.email,
        isVendor: false,
      },
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      error: 'Verification failed',
    });
  }
});

// Sign out
router.post('/signout', (req, res) => {
  try {
    // In a real app, invalidate the token
    res.json({
      success: true,
      message: 'Signed out successfully',
    });
  } catch (error) {
    console.error('Sign out error:', error);
    res.status(500).json({
      error: 'Failed to sign out',
    });
  }
});

// Get current user
router.get('/me', verifyAuthToken, (req, res) => {
  try {
    res.json({
      user: req.user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to get user',
    });
  }
});

module.exports = router;
