const mongoose = require('mongoose');

const aiRecommendationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['job_recommendation', 'resume_analysis', 'career_advice', 'skill_match'],
    required: true
  },
  recommendations: [{
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    title: String,
    company: String,
    matchPercentage: Number,
    reasons: [String]
  }],
  analysis: {
    score: Number,
    strengths: [String],
    gaps: [String],
    suggestions: [String]
  },
  rawResponse: {
    type: mongoose.Schema.Types.Mixed
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 24*60*60*1000)
  }
}, {
  timestamps: true
});

aiRecommendationSchema.index({ user: 1, type: 1 });
aiRecommendationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('AIRecommendation', aiRecommendationSchema);
