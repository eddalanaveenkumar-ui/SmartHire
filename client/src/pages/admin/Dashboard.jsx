import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminAPI } from '../../services/api';
import {
  Users, Briefcase, FileText, TrendingUp, Activity,
  BarChart3, Target, UserCheck, UserX, Loader2,
  ChevronRight, Sparkles
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await adminAPI.getDashboard();
      setStats(res.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const overview = stats?.overview || {};
  const statCards = [
    { label: 'Total Candidates', value: overview.totalUsers, icon: Users, color: 'from-blue-500 to-cyan-500', path: '/admin/users?role=candidate' },
    { label: 'Total Recruiters', value: overview.totalRecruiters, icon: UserCheck, color: 'from-green-500 to-teal-500', path: '/admin/users?role=recruiter' },
    { label: 'Total Jobs', value: overview.totalJobs, icon: Briefcase, color: 'from-purple-500 to-pink-500', path: '/admin/users' },
    { label: 'Total Applications', value: overview.totalApplications, icon: FileText, color: 'from-orange-500 to-red-500', path: '/admin/analytics' },
  ];

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Platform overview and analytics</p>
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
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Charts & Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Status Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary-500" />
                Job Status Distribution
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {stats?.jobStats?.map((s, i) => (
                  <div key={i} className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className={`text-2xl font-bold ${
                      s._id === 'active' ? 'text-green-500' : s._id === 'closed' ? 'text-red-500' : 'text-yellow-500'
                    }`}>{s.count}</div>
                    <div className="text-sm text-gray-500 capitalize">{s._id}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Application Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass-card p-6"
            >
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary-500" />
                Application Status Distribution
              </h3>
              <div className="flex flex-wrap gap-3">
                {stats?.applicationStatusStats?.map((s, i) => (
                  <div key={i} className="flex-1 min-w-[120px] text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className={`text-2xl font-bold ${
                      s._id === 'hired' || s._id === 'shortlisted' ? 'text-green-500' :
                      s._id === 'rejected' ? 'text-red-500' :
                      s._id === 'reviewed' ? 'text-blue-500' : 'text-yellow-500'
                    }`}>{s.count}</div>
                    <div className="text-sm text-gray-500 capitalize">{s._id}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Monthly Stats */}
            {stats?.monthlyStats?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6"
              >
                <h3 className="font-semibold text-lg mb-4">Monthly Applications</h3>
                <div className="space-y-3">
                  {stats.monthlyStats.slice(-6).map((m, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-sm text-gray-500 w-20">{m.month}</span>
                      <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((m.applications / Math.max(...stats.monthlyStats.map(x => x.count))) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-16 text-right">{m.applications}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { label: 'Manage Users', icon: Users, path: '/admin/users', color: 'from-blue-500 to-cyan-500' },
                  { label: 'View Analytics', icon: TrendingUp, path: '/admin/analytics', color: 'from-green-500 to-teal-500' },
                ].map((action, i) => (
                  <Link
                    key={i}
                    to={action.path}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-sm">{action.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Recent Users */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="glass-card p-6"
            >
              <h3 className="font-semibold text-lg mb-4">Recent Users</h3>
              <div className="space-y-3">
                {stats?.recentUsers?.map((user, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                      user.role === 'admin' ? 'bg-red-500' : user.role === 'recruiter' ? 'bg-green-500' : 'bg-primary-500'
                    }`}>
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* AI Usage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-6"
            >
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-500" />
                AI Features
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Job Recommendations', active: true },
                  { label: 'Resume Analysis', active: true },
                  { label: 'Career Advice', active: true },
                  { label: 'Applicant Ranking', active: true },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{feature.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      feature.active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {feature.active ? 'Active' : 'Inactive'}
                    </span>
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
