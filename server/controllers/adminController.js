const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { AppError } = require('../utils/AppError');

const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalRecruiters,
      totalJobs,
      totalApplications,
      recentUsers,
      recentJobs,
      jobStats,
      applicationStatusStats,
      monthlyStats
    ] = await Promise.all([
      User.countDocuments({ role: 'candidate' }),
      User.countDocuments({ role: 'recruiter' }),
      Job.countDocuments(),
      Application.countDocuments(),
      User.find().sort('-createdAt').limit(5).select('name email role createdAt'),
      Job.find().sort('-createdAt').limit(5).populate('recruiter', 'name'),
      Job.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Application.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Application.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            count: { $sum: 1 },
            uniqueJobs: { $addToSet: '$job' }
          }
        },
        { $sort: { _id: 1 } },
        { $limit: 12 }
      ])
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalRecruiters,
          totalJobs,
          totalApplications,
          applicationToJobRatio: totalJobs > 0 ? (totalApplications / totalJobs).toFixed(1) : 0
        },
        jobStats,
        applicationStatusStats,
        monthlyStats: monthlyStats.map(m => ({
          month: m._id,
          applications: m.count,
          uniqueJobs: m.uniqueJobs.length
        })),
        recentUsers,
        recentJobs
      }
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const query = {};
    
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: {
        users,
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

const toggleUserBan = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new AppError('User not found', 404);
    if (user.role === 'admin') throw new AppError('Cannot ban admin users', 403);

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully`,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new AppError('User not found', 404);
    if (user.role === 'admin') throw new AppError('Cannot delete admin users', 403);

    await Application.deleteMany({ applicant: user._id });
    const jobs = await Job.find({ recruiter: user._id });
    const jobIds = jobs.map(j => j._id);
    await Application.deleteMany({ job: { $in: jobIds } });
    await Job.deleteMany({ recruiter: user._id });
    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User and associated data deleted'
    });
  } catch (error) {
    next(error);
  }
};

const getAdminAnalytics = async (req, res, next) => {
  try {
    const [weeklyApplications, popularJobs, topSkills] = await Promise.all([
      Application.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: -1 } },
        { $limit: 30 }
      ]),
      Job.find({ status: 'active' })
        .sort('-applicationCount')
        .limit(10)
        .select('title company applicationCount'),
      Job.aggregate([
        { $unwind: '$skills' },
        { $group: { _id: '$skills', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 20 }
      ])
    ]);

    res.json({
      success: true,
      data: {
        weeklyApplications,
        popularJobs,
        topSkills
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  toggleUserBan,
  deleteUser,
  getAdminAnalytics
};
