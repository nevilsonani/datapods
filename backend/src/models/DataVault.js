const mongoose = require('mongoose');

const dataVaultSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    ipfsHash: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    accessList: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        permission: {
          type: String,
          enum: ['read', 'write', 'admin'],
          default: 'read',
        },
        grantedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isEncrypted: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster querying
dataVaultSchema.index({ owner: 1 });
dataVaultSchema.index({ 'accessList.user': 1 });

const DataVault = mongoose.model('DataVault', dataVaultSchema);

module.exports = DataVault;
