const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
    default: 'pending'
  },
  resume: {
    url: { type: String },
    originalName: { type: String }
  },
  coverLetter: {
    type: String,
    maxlength: [2000, 'Cover letter cannot exceed 2000 characters']
  },
  skills: [{
    type: String,
    trim: true
  }],
  experience: {
    type: Number,
    default: 0
  },
  education: {
    type: String,
    default: ''
  },
  aiScore: {
    type: Number,
    min: 0,
    max: 100
  },
  aiAnalysis: {
    strengths: [String],
    gaps: [String],
    recommendations: String,
    matchPercentage: Number
  },
  notes: {
    type: String
  },
  statusHistory: [{
    status: { type: String },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    changedAt: { type: Date, default: Date.now },
    note: { type: String }
  }]
}, {
  timestamps: true
});

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
applicationSchema.index({ status: 1 });
applicationSchema.index({ applicant: 1 });

module.exports = mongoose.model('Application', applicationSchema);
