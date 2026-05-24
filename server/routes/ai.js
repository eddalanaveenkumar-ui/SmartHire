const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getRecommendations,
  analyzeResume,
  getCareerAdvice,
  rankApplicants
} = require('../controllers/aiController');

router.get('/recommendations', auth, getRecommendations);
router.post('/analyze-resume', auth, analyzeResume);
router.get('/career-advice', auth, getCareerAdvice);
router.post('/rank-applicants/:jobId', auth, authorize('recruiter', 'admin'), rankApplicants);

module.exports = router;
