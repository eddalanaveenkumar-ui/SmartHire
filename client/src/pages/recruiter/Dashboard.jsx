import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { jobAPI, applicationAPI } from '../../services/api';
import {
  Briefcase, Users, Eye, TrendingUp, Plus, FileText,
  ChevronRight, Clock, CheckCircle, XCircle, Loader2,
  Building2, MapPin, DollarSign, BarChart3
} from 'lucide-react';

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalJobs: 0, activeJobs: 0, totalApplicants: 0, totalViews: 0 });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, appRes] = await Promise.all([
        jobAPI.getMyJobs(),
        applicationAPI.getStats()
      ]);
      
      const jobs = jobsRes.data;
      setRecentJobs(jobs.slice(0, 5));
      setStats({
        totalJobs: jobs.length,
        activeJobs: jobs.filter(j => j.status === 'active').length,
        totalApplicants: jobs.reduce((sum, j) => sum + (j.applicationCount || 0), 0),
        totalViews: jobs.reduce((sum, j) => sum + (j.views || 0), 0)
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Jobs', value: stats.totalJobs, icon: Briefcase, color: 'from-blue-500 to-cyan-500' },
    { label: 'Active Jobs', value: stats.activeJobs, icon: FileText, color: 'from-green-500 to-teal-500' },
    { label: 'Total Applicants', value: stats.totalApplicants, icon: Users, color: 'from-purple-500 to-pink-500' },
    { label: 'Total Views', value: stats.totalViews, icon: Eye, color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your job postings and applicants</p>
          </div>
          <Link to="/recruiter/post-job" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Post a Job
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Jobs */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Your Job Listings</h3>
                <Link to="/recruiter/manage-jobs" className="text-sm text-primary-600 flex items-center gap-1">
                  Manage All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
              ) : recentJobs.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500 mb-4">No jobs posted yet</p>
                  <Link to="/recruiter/post-job" className="btn-primary">Post Your First Job</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentJobs.map((job, i) => (
                    <div key={job._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-bold">
                          {job.company?.charAt(0) || 'J'}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{job.title}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{job.applicationCount} applicants</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`badge ${job.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                          {job.status}
                        </span>
                        <button
                          onClick={() => navigate(`/recruiter/applicants/${job._id}`)}
                          className="btn-secondary text-xs"
                        >
                          View Applicants
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Post New Job', icon: Plus, path: '/recruiter/post-job', color: 'from-blue-500 to-cyan-500' },
                  { label: 'Manage Jobs', icon: Briefcase, path: '/recruiter/manage-jobs', color: 'from-green-500 to-teal-500' },
                  { label: 'View Analytics', icon: BarChart3, path: '/recruiter/dashboard', color: 'from-purple-500 to-pink-500' },
                  { label: 'Browse Candidates', icon: Users, path: '/jobs', color: 'from-orange-500 to-red-500' },
                ].map((action, i) => (
                  <Link
                    key={i}
                    to={action.path}
                    className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-2`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm font-semibold">{action.label}</p>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Company Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center text-white text-xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold">{user?.name}</h3>
                  <p className="text-sm text-gray-500">Recruiter</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p className="flex items-center gap-2"><Building2 className="w-4 h-4" />{user?.company || 'Your Company'}</p>
              </div>
            </motion.div>

            {/* Tips Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="glass-card p-6"
            >
              <h3 className="font-semibold mb-4">Recruiter Tips</h3>
              <div className="space-y-3">
                {[
                  'Write detailed job descriptions for better matches',
                  'Respond to applicants within 48 hours',
                  'Use AI ranking to shortlist top candidates',
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
