const Job = require('../models/Job');
const Application = require('../models/Application');
const { AppError } = require('../utils/AppError');

const getJobs = async (req, res, next) => {
  try {
    const {
      search,
      type,
      category,
      location,
      experienceLevel,
      salaryMin,
      salaryMax,
      skills,
      page = 1,
      limit = 12,
      sort = '-createdAt'
    } = req.query;

    const query = { status: 'active' };

    if (search) {
      query.$text = { $search: search };
    }
    if (type) query.type = type;
    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (salaryMin) query.salaryMin = { $gte: Number(salaryMin) };
    if (salaryMax) query.salaryMax = { $lte: Number(salaryMax) };
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query.skills = { $in: skillsArray };
    }

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('recruiter', 'name email company profilePicture')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const getJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('recruiter', 'name email company profilePicture');

    if (!job) {
      throw new AppError('Job not found', 404);
    }

    const applicationCount = await Application.countDocuments({ job: job._id });

    res.json({
      success: true,
      data: { ...job.toObject(), applicationCount }
    });
  } catch (error) {
    next(error);
  }
};

const createJob = async (req, res, next) => {
  try {
    const jobData = {
      ...req.body,
      recruiter: req.userId,
      company: req.body.company || req.user.name
    };

    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      throw new AppError('Job not found', 404);
    }

    if (job.recruiter.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      throw new AppError('Not authorized to update this job', 403);
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob
    });
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      throw new AppError('Job not found', 404);
    }

    if (job.recruiter.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      throw new AppError('Not authorized to delete this job', 403);
    }

    await Application.deleteMany({ job: job._id });
    await Job.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Job and associated applications deleted'
    });
  } catch (error) {
    next(error);
  }
};

const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiter: req.userId })
      .sort('-createdAt');

    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

const getJobStats = async (req, res, next) => {
  try {
    const stats = await Job.aggregate([
      { $group: {
        _id: null,
        totalJobs: { $sum: 1 },
        activeJobs: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        totalViews: { $sum: '$views' },
        totalApplications: { $sum: '$applicationCount' },
        avgViews: { $avg: '$views' }
      }}
    ]);

    const categoryStats = await Job.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || { totalJobs: 0, activeJobs: 0, totalViews: 0, totalApplications: 0 },
        byCategory: categoryStats
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
  getJobStats
};
