const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getNonce,
  login,
  getMe,
} = require('../controllers/authController');

// Public routes
router.get('/nonce/:walletAddress', getNonce);
router.post('/login', login);

// Protected routes
router.use(protect);
router.get('/me', getMe);

module.exports = router;
