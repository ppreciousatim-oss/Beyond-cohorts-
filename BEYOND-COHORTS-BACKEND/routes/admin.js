const express = require('express');
const router = express.Router();
const { createAdmin, getAdmins, deleteAdmin, loginAdmin } = require('../controllers/admin');
const { protect } = require('../middlewares/auth');

// Register new admin
router.post('/register', createAdmin);

// Admin login
router.post('/login', loginAdmin);

// Other admin routes
router.get('/', protect, getAdmins);
router.delete('/:id', protect, deleteAdmin);

module.exports = router;
