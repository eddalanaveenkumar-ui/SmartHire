const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  applyJob,
  getMyApplications,
  getJobApplications,
  getApplication,
  updateApplicationStatus,
  getApplicationStats
} = require('../controllers/applicationController');

router.get('/my-applications', auth, getMyApplications);
router.get('/stats', auth, getApplicationStats);
router.get('/:id', auth, getApplication);
router.post('/:jobId', auth, authorize('candidate'), applyJob);
router.get('/job/:jobId', auth, authorize('recruiter', 'admin'), getJobApplications);
router.put('/:id/status', auth, authorize('recruiter', 'admin'), updateApplicationStatus);

module.exports = router;
