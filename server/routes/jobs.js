const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
  getJobStats
} = require('../controllers/jobController');

router.get('/', getJobs);
router.get('/stats', auth, authorize('admin'), getJobStats);
router.get('/my-jobs', auth, authorize('recruiter'), getMyJobs);
router.get('/:id', getJob);
router.post('/', auth, authorize('recruiter', 'admin'), createJob);
router.put('/:id', auth, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', auth, authorize('recruiter', 'admin'), deleteJob);

module.exports = router;
