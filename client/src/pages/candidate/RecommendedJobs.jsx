import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { aiAPI } from '../../services/api';
import { Sparkles, TrendingUp, Target, BookOpen, ArrowRight, Loader2, Briefcase } from 'lucide-react';

export default function RecommendedJobs() {
  const [recommendations, setRecommendations] = useState([]);
  const [careerAdvice, setCareerAdvice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [recRes, adviceRes] = await Promise.all([
        aiAPI.getRecommendations(),
        aiAPI.getCareerAdvice()
      ]);
      setRecommendations(recRes.data?.recommendations || []);
      setCareerAdvice(adviceRes.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AI Recommendations</h1>
              <p className="text-gray-600 dark:text-gray-400">Personalized jobs and career advice powered by AI</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'jobs', icon: Briefcase, label: 'Job Matches' },
            { id: 'career', icon: TrendingUp, label: 'Career Advice' },
            { id: 'skills', icon: Target, label: 'Skill Analysis' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : activeTab === 'jobs' ? (
          <div className="space-y-4">
            {recommendations.length === 0 ? (
              <div className="text-center py-16">
                <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2">No recommendations yet</h3>
                <p className="text-gray-500">Update your profile to get personalized job matches</p>
              </div>
            ) : (
              recommendations.map((rec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                          {rec.company?.charAt(0) || 'J'}
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 text-white text-xs font-bold flex items-center justify-center">
                          {rec.matchPercentage}%
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{rec.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{rec.company}</p>
                        {rec.reasons?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {rec.reasons.map((reason, j) => (
                              <span key={j} className="badge-primary text-xs">{reason}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <Link to={`/jobs/${rec.jobId}`} className="btn-primary text-sm">
                      View Job
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        ) : activeTab === 'career' && careerAdvice ? (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-500" />
                Career Suggestions
              </h2>
              <div className="space-y-3">
                {careerAdvice.suggestions?.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <Sparkles className="w-5 h-5 text-primary-500 mt-0.5" />
                    <p className="text-gray-600 dark:text-gray-400">{s}</p>
                  </div>
                ))}
              </div>
            </div>

            {careerAdvice.recommendedRoles?.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold mb-4">Recommended Roles</h2>
                <div className="flex flex-wrap gap-2">
                  {careerAdvice.recommendedRoles.map((role, i) => (
                    <span key={i} className="px-4 py-2 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-950 dark:to-purple-950 rounded-xl text-sm font-medium">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {careerAdvice.learningPath?.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary-500" />
                  Learning Path
                </h2>
                <div className="space-y-3">
                  {careerAdvice.learningPath.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </div>
                      <span className="text-gray-600 dark:text-gray-400">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary-500" />
              Resume Analysis
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Upload your resume or update your profile to get AI-powered skill analysis
            </p>
            <Link to="/candidate/profile" className="btn-primary">
              Update Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
