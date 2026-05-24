import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '../../services/api';
import {
  TrendingUp, BarChart3, Target, Briefcase, Award,
  Loader2, Sparkles, Star, Users, Eye
} from 'lucide-react';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await adminAPI.getAnalytics();
      setAnalytics(res.data);
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

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
          <p className="text-gray-600 dark:text-gray-400">Platform performance and insights</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Weekly Applications Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-500" />
              Daily Applications (Last 30 Days)
            </h3>
            <div className="space-y-2">
              {analytics?.weeklyApplications?.slice(0, 14).map((day, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="w-24 text-gray-500 text-xs">{day._id}</span>
                  <div className="flex-1 h-5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((day.count / Math.max(...analytics.weeklyApplications.map(d => d.count))) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="w-10 text-right font-medium text-xs">{day.count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Jobs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-6"
          >
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary-500" />
              Most Popular Jobs
            </h3>
            <div className="space-y-4">
              {analytics?.popularJobs?.map((job, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                      i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-orange-500' : 'bg-primary-500'
                    }`}>
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{job.title}</p>
                      <p className="text-xs text-gray-500">{job.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">{job.applicationCount}</span>
                  </div>
                </div>
              ))}
              {(!analytics?.popularJobs || analytics.popularJobs.length === 0) && (
                <p className="text-center text-gray-500 py-8">No job data available</p>
              )}
            </div>
          </motion.div>

          {/* Top Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary-500" />
              Most In-Demand Skills
            </h3>
            <div className="space-y-3">
              {analytics?.topSkills?.map((skill, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 text-sm font-bold text-primary-500">#{i + 1}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{skill._id}</span>
                      <span className="text-sm text-gray-500">{skill.count} jobs</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((skill.count / Math.max(...analytics.topSkills.map(s => s.count))) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {(!analytics?.topSkills || analytics.topSkills.length === 0) && (
                <p className="text-center text-gray-500 py-8">No skill data available</p>
              )}
            </div>
          </motion.div>

          {/* AI Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-6"
          >
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-500" />
              AI Insights
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-950 dark:to-purple-950 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  SmartHire AI is actively analyzing job-market data to provide personalized recommendations. 
                  The platform has processed thousands of skill matches and continues to improve its matching algorithms.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Active Jobs', value: analytics?.popularJobs?.length || 0, icon: Briefcase },
                  { label: 'Top Skills Tracked', value: analytics?.topSkills?.length || 0, icon: Star },
                ].map((item, i) => (
                  <div key={i} className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <item.icon className="w-6 h-6 mx-auto mb-2 text-primary-500" />
                    <div className="text-2xl font-bold">{item.value}</div>
                    <div className="text-xs text-gray-500">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
