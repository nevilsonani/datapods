const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createVault,
  getVaults,
  getVault,
  updateVault,
  deleteVault,
  grantAccess,
  revokeAccess,
} = require('../controllers/vaultController');

// All routes are protected
router.use(protect);

// Vault routes
router.route('/')
  .get(getVaults)
  .post(createVault);

router.route('/:id')
  .get(getVault)
  .put(updateVault)
  .delete(deleteVault);

// Access management
router.post('/:id/access', grantAccess);
router.delete('/:id/access/:userId', revokeAccess);

module.exports = router;
