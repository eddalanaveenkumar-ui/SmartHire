const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { AppError } = require('../utils/AppError');

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      throw new AppError('Please provide all required fields', 400);
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new AppError('User already exists with this email', 400);
    }

    const user = await User.create({ name, email, password, role });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    if (user.isBanned) {
      throw new AppError('Your account has been banned. Please contact admin.', 403);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'phone', 'location', 'headline', 'bio', 'skills', 'education', 'experience'];
    const updates = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('Please upload a file', 400);
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        'resume.url': `/uploads/${req.file.filename}`,
        'resume.originalName': req.file.originalname,
        'resume.uploadedAt': new Date()
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('Please upload an image', 400);
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { profilePicture: `/uploads/${req.file.filename}` },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Profile picture updated',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const saveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const user = await User.findById(req.userId);

    const index = user.savedJobs.indexOf(jobId);
    if (index > -1) {
      user.savedJobs.splice(index, 1);
      await user.save();
      return res.json({ success: true, message: 'Job unsaved', saved: false });
    } else {
      user.savedJobs.push(jobId);
      await user.save();
      return res.json({ success: true, message: 'Job saved', saved: true });
    }
  } catch (error) {
    next(error);
  }
};

const getSavedJobs = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate('savedJobs');
    res.json({
      success: true,
      data: user.savedJobs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  uploadResume,
  uploadProfilePicture,
  saveJob,
  getSavedJobs
};
