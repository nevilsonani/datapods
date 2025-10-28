const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    nonce: {
      type: String,
      required: true,
    },
    dataVaults: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DataVault',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Generate a random nonce for wallet authentication
userSchema.methods.generateNonce = function () {
  this.nonce = Math.floor(Math.random() * 1000000).toString();
  return this.nonce;
};

// Verify the signed nonce
userSchema.methods.verifySignature = function (signature) {
  // In a real implementation, this would verify the signature against the nonce
  // using the wallet's public key
  return true; // Placeholder
};

const User = mongoose.model('User', userSchema);

module.exports = User;
