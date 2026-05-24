const Application = require('../models/Application');
const Job = require('../models/Job');
const Notification = require('../models/Notification');
const { AppError } = require('../utils/AppError');

const applyJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      throw new AppError('Job not found', 404);
    }
    if (job.status !== 'active') {
      throw new AppError('This job is no longer accepting applications', 400);
    }

    const existing = await Application.findOne({
      job: req.params.jobId,
      applicant: req.userId
    });
    if (existing) {
      throw new AppError('You have already applied for this job', 400);
    }

    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.userId,
      resume: req.body.resume,
      coverLetter: req.body.coverLetter,
      skills: req.body.skills,
      experience: req.body.experience,
      education: req.body.education
    });

    await Job.findByIdAndUpdate(req.params.jobId, {
      $inc: { applicationCount: 1 }
    });

    await Notification.create({
      recipient: job.recruiter,
      type: 'application',
      title: 'New Application',
      message: `${req.user.name} applied for ${job.title}`,
      link: `/recruiter/applicants/${job._id}`,
      relatedId: application._id
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.userId })
      .populate({
        path: 'job',
        select: 'title company location type salaryMin salaryMax status',
        populate: { path: 'recruiter', select: 'name email' }
      })
      .sort('-createdAt');

    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

const getJobApplications = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      throw new AppError('Job not found', 404);
    }
    if (job.recruiter.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      throw new AppError('Not authorized to view these applications', 403);
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email profilePicture phone location skills education experience headline')
      .sort('-createdAt');

    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'];

    if (!validStatuses.includes(status)) {
      throw new AppError('Invalid status', 400);
    }

    const application = await Application.findById(req.params.id)
      .populate('job', 'title recruiter')
      .populate('applicant', 'name email');

    if (!application) {
      throw new AppError('Application not found', 404);
    }

    if (application.job.recruiter._id.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      throw new AppError('Not authorized', 403);
    }

    application.status = status;
    application.notes = notes || application.notes;
    application.statusHistory.push({
      status,
      changedBy: req.userId,
      note: notes
    });
    await application.save();

    await Notification.create({
      recipient: application.applicant._id,
      type: 'status_change',
      title: 'Application Status Updated',
      message: `Your application for ${application.job.title} has been ${status}`,
      link: `/candidate/applications`,
      relatedId: application._id
    });

    res.json({
      success: true,
      message: `Application ${status}`,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

const getApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('applicant', 'name email profilePicture phone location skills education experience headline')
      .populate('job', 'title company location type salaryMin salaryMax');
    
    if (!application) {
      throw new AppError('Application not found', 404);
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

const getApplicationStats = async (req, res, next) => {
  try {
    let matchStage = {};
    
    // If recruiter, only get stats for their jobs
    if (req.user.role === 'recruiter') {
      const recruiterJobs = await Job.find({ recruiter: req.userId }).select('_id');
      const jobIds = recruiterJobs.map(j => j._id);
      matchStage = { job: { $in: jobIds } };
    }

    const stats = await Application.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyJob,
  getMyApplications,
  getJobApplications,
  getApplication,
  updateApplicationStatus,
  getApplicationStats
};
