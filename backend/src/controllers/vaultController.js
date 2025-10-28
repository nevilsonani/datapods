const DataVault = require('../models/DataVault');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create new vault
// @route   POST /api/v1/vaults
// @access  Private
exports.createVault = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.owner = req.user.id;

    const vault = await DataVault.create(req.body);

    res.status(201).json({
      success: true,
      data: vault,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all vaults for logged in user
// @route   GET /api/v1/vaults
// @access  Private
exports.getVaults = async (req, res, next) => {
  try {
    // Get vaults where user is owner or has access
    const vaults = await DataVault.find({
      $or: [
        { owner: req.user.id },
        { 'accessList.user': req.user.id },
      ],
    });

    res.status(200).json({
      success: true,
      count: vaults.length,
      data: vaults,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single vault
// @route   GET /api/v1/vaults/:id
// @access  Private
exports.getVault = async (req, res, next) => {
  try {
    const vault = await DataVault.findById(req.params.id);

    if (!vault) {
      return next(
        new ErrorResponse(`Vault not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is vault owner or has access
    if (
      vault.owner.toString() !== req.user.id &&
      !vault.accessList.some(
        (access) => access.user.toString() === req.user.id
      )
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to access this vault`,
          401
        )
      );
    }

    res.status(200).json({
      success: true,
      data: vault,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update vault
// @route   PUT /api/v1/vaults/:id
// @access  Private
exports.updateVault = async (req, res, next) => {
  try {
    let vault = await DataVault.findById(req.params.id);

    if (!vault) {
      return next(
        new ErrorResponse(`Vault not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is vault owner
    if (vault.owner.toString() !== req.user.id) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this vault`,
          401
        )
      );
    }

    vault = await DataVault.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: vault,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete vault
// @route   DELETE /api/v1/vaults/:id
// @access  Private
exports.deleteVault = async (req, res, next) => {
  try {
    const vault = await DataVault.findById(req.params.id);

    if (!vault) {
      return next(
        new ErrorResponse(`Vault not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is vault owner
    if (vault.owner.toString() !== req.user.id) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this vault`,
          401
        )
      );
    }

    await vault.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Grant access to vault
// @route   POST /api/v1/vaults/:id/access
// @access  Private
exports.grantAccess = async (req, res, next) => {
  try {
    const { userId, permission } = req.body;
    const vault = await DataVault.findById(req.params.id);

    if (!vault) {
      return next(
        new ErrorResponse(`Vault not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is vault owner
    if (vault.owner.toString() !== req.user.id) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to grant access to this vault`,
          401
        )
      );
    }

    // Check if user already has access
    const existingAccess = vault.accessList.find(
      (access) => access.user.toString() === userId
    );

    if (existingAccess) {
      // Update existing access
      existingAccess.permission = permission;
    } else {
      // Add new access
      vault.accessList.push({
        user: userId,
        permission,
      });
    }

    await vault.save();

    res.status(200).json({
      success: true,
      data: vault,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Revoke access from vault
// @route   DELETE /api/v1/vaults/:id/access/:userId
// @access  Private
exports.revokeAccess = async (req, res, next) => {
  try {
    const vault = await DataVault.findById(req.params.id);

    if (!vault) {
      return next(
        new ErrorResponse(`Vault not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is vault owner
    if (vault.owner.toString() !== req.user.id) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to revoke access from this vault`,
          401
        )
      );
    }

    // Remove access
    vault.accessList = vault.accessList.filter(
      (access) => access.user.toString() !== req.params.userId
    );

    await vault.save();

    res.status(200).json({
      success: true,
      data: vault,
    });
  } catch (err) {
    next(err);
  }
};
