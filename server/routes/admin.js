const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getDashboardStats,
  getUsers,
  toggleUserBan,
  deleteUser,
  getAdminAnalytics
} = require('../controllers/adminController');

router.use(auth, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.get('/analytics', getAdminAnalytics);
router.put('/users/:id/ban', toggleUserBan);
router.delete('/users/:id', deleteUser);

module.exports = router;
