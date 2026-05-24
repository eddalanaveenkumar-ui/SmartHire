const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const { auth } = require('../middleware/auth');
const {
  register,
  login,
  getProfile,
  updateProfile,
  uploadResume,
  uploadProfilePicture,
  saveJob,
  getSavedJobs
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.post('/resume', auth, upload.single('resume'), uploadResume);
router.post('/profile-picture', auth, upload.single('profilePicture'), uploadProfilePicture);
router.post('/save-job/:jobId', auth, saveJob);
router.get('/saved-jobs', auth, getSavedJobs);

module.exports = router;
