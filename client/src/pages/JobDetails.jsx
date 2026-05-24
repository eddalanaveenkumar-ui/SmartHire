import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { jobAPI, applicationAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  MapPin, Clock, DollarSign, Building2, Briefcase, 
  User, CheckCircle, XCircle, Send, Heart, ArrowLeft,
  Sparkles, Share2, Shield, Calendar
} from 'lucide-react';

export default function JobDetails() {
  const { id } = useParams();
  const { isAuthenticated, isCandidate, user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await jobAPI.getJob(id);
      setJob(res.data);
    } catch (error) {
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply');
      return;
    }
    setApplying(true);
    try {
      await applicationAPI.apply(id, { 
        skills: user?.skills || [],
        experience: user?.experience?.length || 0,
        education: user?.education?.length > 0 ? user.education[0]?.degree : ''
      });
      toast.success('Application submitted successfully!');
      setHasApplied(true);
    } catch (error) {
      toast.error(error.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const handleSaveJob = async () => {
    try {
      const res = await authAPI.saveJob(id);
      setIsSaved(res.saved);
      toast.success(res.saved ? 'Job saved!' : 'Job unsaved');
    } catch (error) {
      toast.error('Failed to save job');
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="loading-skeleton h-8 w-64 mb-4" />
          <div className="loading-skeleton h-4 w-48 mb-8" />
          <div className="loading-skeleton h-64 rounded-2xl mb-4" />
          <div className="loading-skeleton h-32 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
          <p className="text-gray-500 mb-6">This job posting may have been removed</p>
          <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to="/jobs" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 md:p-8"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                  {job.company?.charAt(0)}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {job.title}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">{job.company}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <span className={`badge ${
                      job.type === 'Remote' ? 'badge-success' : 
                      job.type === 'Contract' ? 'badge-warning' : 'badge-primary'
                    }`}>{job.type}</span>
                    <span className="badge bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                      {job.experienceLevel}
                    </span>
                    <span className="badge bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                      {job.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="text-center">
                  <MapPin className="w-5 h-5 mx-auto mb-1 text-primary-500" />
                  <p className="text-sm font-medium">{job.location}</p>
                  <p className="text-xs text-gray-500">Location</p>
                </div>
                <div className="text-center">
                  <Briefcase className="w-5 h-5 mx-auto mb-1 text-primary-500" />
                  <p className="text-sm font-medium">{job.type}</p>
                  <p className="text-xs text-gray-500">Type</p>
                </div>
                {job.salaryMin && (
                  <div className="text-center">
                    <DollarSign className="w-5 h-5 mx-auto mb-1 text-primary-500" />
                    <p className="text-sm font-medium">${job.salaryMin.toLocaleString()} - ${job.salaryMax?.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Salary</p>
                  </div>
                )}
                <div className="text-center">
                  <Calendar className="w-5 h-5 mx-auto mb-1 text-primary-500" />
                  <p className="text-sm font-medium">{new Date(job.createdAt).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500">Posted</p>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 md:p-8"
            >
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <div className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </motion.div>

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass-card p-6 md:p-8"
              >
                <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">{req}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Skills */}
            {job.skills?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6 md:p-8"
              >
                <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, i) => (
                    <span key={i} className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-xl text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Benefits */}
            {job.benefits?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="glass-card p-6 md:p-8"
              >
                <h2 className="text-xl font-semibold mb-4">Benefits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {job.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Shield className="w-4 h-4 text-accent-500" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 sticky top-24"
            >
              {isCandidate && (
                <button
                  onClick={handleApply}
                  disabled={applying || hasApplied}
                  className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                    hasApplied
                      ? 'bg-green-500 text-white cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                >
                  {applying ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : hasApplied ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Applied
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Apply Now
                    </>
                  )}
                </button>
              )}

              {!isAuthenticated && (
                <Link to="/login" className="btn-primary w-full flex items-center justify-center gap-2">
                  <User className="w-5 h-5" />
                  Login to Apply
                </Link>
              )}

              {isAuthenticated && !isCandidate && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center text-sm text-blue-700 dark:text-blue-300">
                  Recruiters cannot apply for jobs
                </div>
              )}

              <button
                onClick={handleSaveJob}
                className={`w-full mt-3 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 border-2 ${
                  isSaved
                    ? 'border-red-300 text-red-600 bg-red-50 dark:bg-red-900/20 dark:border-red-700'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                {isSaved ? 'Saved' : 'Save Job'}
              </button>

              {/* AI Match */}
              <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-950 dark:to-purple-950 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-primary-500" />
                  <span className="font-semibold text-sm">AI Match Score</span>
                </div>
                <p className="text-2xl font-bold gradient-text">92%</p>
                <p className="text-xs text-gray-500 mt-1">Based on your profile match</p>
              </div>

              {/* Job Info */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Building2 className="w-4 h-4" />
                  <span>Posted by {job.recruiter?.name || 'Company'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <User className="w-4 h-4" />
                  <span>{job.applicationCount || 0} applicants</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
