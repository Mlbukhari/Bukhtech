const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Generate auth token
function generateAuthToken(user) {
  const token = jwt.sign(
    {
      id: user.uid,
      username: user.username,
      email: user.email,
    },
    SECRET_KEY,
    { expiresIn: '7d' }
  );
  return token;
}

// Verify auth token middleware
function verifyAuthToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Missing or invalid authorization header',
      });
    }

    const token = authHeader.slice(7); // Remove 'Bearer '
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      error: 'Invalid or expired token',
    });
  }
}

// Verify Pi signature
function verifyPiSignature(signature, message, piPublicKey) {
  // In production, verify the signature using Pi's public key
  // This is a placeholder
  return true;
}

module.exports = {
  generateAuthToken,
  verifyAuthToken,
  verifyPiSignature,
};
