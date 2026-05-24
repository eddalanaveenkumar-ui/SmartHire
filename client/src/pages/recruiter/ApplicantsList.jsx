import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { applicationAPI, aiAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
  Users, CheckCircle, XCircle, Eye, Clock, Loader2,
  ArrowLeft, Sparkles, Download, Filter, Star, ChevronDown
} from 'lucide-react';

export default function ApplicantsList() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [updating, setUpdating] = useState(null);
  const [ranking, setRanking] = useState(false);

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      const res = await applicationAPI.getJobApplications(jobId);
      setApplications(res.data);
      if (res.data.length > 0) {
        setJobTitle(res.data[0].job?.title || '');
      }
    } catch (error) {
      toast.error('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId, status, notes = '') => {
    setUpdating(appId);
    try {
      await applicationAPI.updateStatus(appId, { status, notes });
      setApplications(prev => prev.map(a => 
        a._id === appId ? { ...a, status } : a
      ));
      toast.success(`Application ${status}`);
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const handleAIRanking = async () => {
    setRanking(true);
    try {
      const res = await aiAPI.rankApplicants(jobId);
      toast.success('AI ranking completed');
    } catch (error) {
      toast.error('AI ranking failed');
    } finally {
      setRanking(false);
    }
  };

  const filteredApps = filterStatus === 'all' 
    ? applications 
    : applications.filter(a => a.status === filterStatus);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-300',
      reviewed: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300',
      shortlisted: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-300',
      rejected: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-300',
      hired: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-300',
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <Link to="/recruiter/manage-jobs" className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Jobs
            </Link>
            <h1 className="text-3xl font-bold">{jobTitle || 'Applicants'}</h1>
            <p className="text-gray-600 dark:text-gray-400">{applications.length} total applicants</p>
          </div>
          <button
            onClick={handleAIRanking}
            disabled={ranking}
            className="btn-primary flex items-center gap-2"
          >
            {ranking ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            {ranking ? 'Ranking...' : 'AI Rank'}
          </button>
        </motion.div>

        {/* Status Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'pending', 'reviewed', 'shortlisted', 'rejected', 'hired'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                filterStatus === status
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100'
              }`}
            >
              {status}
              <span className="ml-2 text-xs opacity-70">
                ({status === 'all' ? applications.length : applications.filter(a => a.status === status).length})
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold mb-2">No applicants found</h3>
            <p className="text-gray-500">Applications will appear here when candidates apply</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app, i) => (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center text-white text-xl font-bold">
                      {app.applicant?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{app.applicant?.name}</h3>
                        {app.aiScore && (
                          <span className="badge-success">AI: {app.aiScore}%</span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{app.applicant?.email}</p>
                      {app.applicant?.headline && (
                        <p className="text-sm text-gray-500 mt-1">{app.applicant.headline}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                        {app.applicant?.location && (
                          <span className="text-gray-500">{app.applicant.location}</span>
                        )}
                        {app.applicant?.phone && (
                          <span className="text-gray-500">{app.applicant.phone}</span>
                        )}
                      </div>
                      {app.applicant?.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {app.applicant.skills.slice(0, 5).map((skill, j) => (
                            <span key={j} className="badge-primary text-xs">{skill}</span>
                          ))}
                        </div>
                      )}
                      {app.aiAnalysis?.matchPercentage && (
                        <div className="mt-3 p-3 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-950 dark:to-purple-950 rounded-xl">
                          <div className="flex items-center gap-2 text-sm">
                            <Sparkles className="w-4 h-4 text-primary-500" />
                            <span className="font-medium">AI Match: {app.aiAnalysis.matchPercentage}%</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {app.aiAnalysis.strengths?.slice(0, 2).map((s, j) => (
                              <span key={j} className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded">
                                ✓ {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1.5 rounded-xl text-sm font-medium ${getStatusColor(app.status)}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                    <div className="flex gap-1">
                      {['shortlisted', 'rejected'].map(action => (
                        <button
                          key={action}
                          onClick={() => handleStatusUpdate(app._id, action)}
                          disabled={updating === app._id}
                          className={`p-2 rounded-lg transition-colors ${
                            action === 'shortlisted' 
                              ? 'hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600'
                              : 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600'
                          }`}
                          title={action}
                        >
                          {updating === app._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : action === 'shortlisted' ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
