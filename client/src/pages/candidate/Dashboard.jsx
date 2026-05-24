import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { applicationAPI, aiAPI } from '../../services/api';
import { 
  Briefcase, FileText, TrendingUp, Star, Sparkles, 
  Bookmark, ChevronRight, Clock, CheckCircle, XCircle,
  Loader2, User, Mail, MapPin, Phone
} from 'lucide-react';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalApplications: 0,
    pending: 0,
    shortlisted: 0,
    rejected: 0,
    savedJobs: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [appRes, aiRes] = await Promise.all([
        applicationAPI.getMyApplications(),
        aiAPI.getRecommendations()
      ]);
      
      const applications = appRes.data;
      setRecentApplications(applications.slice(0, 5));
      setStats({
        totalApplications: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        shortlisted: applications.filter(a => ['shortlisted', 'reviewed'].includes(a.status)).length,
        rejected: applications.filter(a => a.status === 'rejected').length,
        savedJobs: user?.savedJobs?.length || 0
      });

      if (aiRes?.data?.recommendations) {
        setRecommendations(aiRes.data.recommendations.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Applications', value: stats.totalApplications, icon: FileText, color: 'from-blue-500 to-cyan-500' },
    { label: 'In Review', value: stats.pending, icon: Clock, color: 'from-yellow-500 to-orange-500' },
    { label: 'Shortlisted', value: stats.shortlisted, icon: Star, color: 'from-green-500 to-teal-500' },
    { label: 'Saved Jobs', value: stats.savedJobs, icon: Bookmark, color: 'from-purple-500 to-pink-500' },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      reviewed: 'badge-primary',
      shortlisted: 'badge-success',
      rejected: 'badge-danger',
      hired: 'badge-success',
    };
    return badges[status] || 'badge-primary';
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Here's your career overview</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & AI */}
          <div className="space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center text-white text-xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{user?.name}</h3>
                  <p className="text-sm text-gray-500">{user?.headline || 'Candidate'}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                {user?.email && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                )}
                {user?.location && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    {user.location}
                  </div>
                )}
              </div>
              <Link to="/candidate/profile" className="btn-primary w-full mt-6 text-sm">
                Edit Profile
              </Link>
            </motion.div>

            {/* AI Career Advice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary-500" />
                <h3 className="font-semibold">AI Career Advice</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Get personalized career guidance powered by AI
              </p>
              <Link to="/candidate/recommendations" className="btn-secondary w-full text-sm">
                Get Advice
              </Link>
            </motion.div>
          </div>

          {/* Middle - Recent Applications */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Applications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Recent Applications</h3>
                <Link to="/candidate/applications" className="text-sm text-primary-600 hover:text-primary-500 flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
              ) : recentApplications.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">No applications yet</p>
                  <Link to="/jobs" className="btn-primary mt-4 inline-block">
                    Browse Jobs
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentApplications.map((app, i) => (
                    <motion.div
                      key={app._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-bold">
                          {app.job?.company?.charAt(0) || 'J'}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                            {app.job?.title}
                          </p>
                          <p className="text-xs text-gray-500">{app.job?.company}</p>
                        </div>
                      </div>
                      <span className={`badge ${getStatusBadge(app.status)}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* AI Recommendations */}
            {recommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary-500" />
                    <h3 className="font-semibold text-lg">AI Recommended Jobs</h3>
                  </div>
                  <Link to="/candidate/recommendations" className="text-sm text-primary-600 hover:text-primary-500 flex items-center gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {recommendations.map((rec, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-950 dark:to-purple-950 rounded-xl">
                      <div>
                        <p className="font-semibold text-sm">{rec.title}</p>
                        <p className="text-xs text-gray-500">{rec.company}</p>
                      </div>
                      <div className="text-right">
                        <span className="badge-success">{rec.matchPercentage}% Match</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="glass-card p-6"
            >
              <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Browse Jobs', icon: Briefcase, path: '/jobs', color: 'from-blue-500 to-cyan-500' },
                  { label: 'Saved Jobs', icon: Bookmark, path: '/candidate/saved-jobs', color: 'from-purple-500 to-pink-500' },
                  { label: 'Upload Resume', icon: FileText, path: '/candidate/profile', color: 'from-green-500 to-teal-500' },
                  { label: 'AI Recommendations', icon: Sparkles, path: '/candidate/recommendations', color: 'from-orange-500 to-red-500' },
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
        </div>
      </div>
    </div>
  );
}
