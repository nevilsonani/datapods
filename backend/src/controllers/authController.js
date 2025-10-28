const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');

// @desc    Get nonce for wallet authentication
// @route   GET /api/v1/auth/nonce/:walletAddress
// @access  Public
exports.getNonce = async (req, res, next) => {
  try {
    const { walletAddress } = req.params;

    // Find or create user
    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });

    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        walletAddress: walletAddress.toLowerCase(),
      });
    }

    // Generate and save nonce
    const nonce = user.generateNonce();
    await user.save();

    res.status(200).json({
      success: true,
      nonce,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Authenticate user with signed message
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { walletAddress, signature } = req.body;

    if (!walletAddress || !signature) {
      return next(new ErrorResponse('Please provide wallet address and signature', 400));
    }

    // Find user
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // In a real implementation, verify the signature against the nonce
    const isValid = user.verifySignature(signature);
    
    if (!isValid) {
      return next(new ErrorResponse('Invalid signature', 401));
    }

    // Generate new nonce for next login
    user.generateNonce();
    await user.save();

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-nonce');

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
