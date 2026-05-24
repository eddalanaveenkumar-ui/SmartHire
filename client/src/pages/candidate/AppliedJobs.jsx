import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { applicationAPI } from '../../services/api';
import { 
  Briefcase, FileText, Clock, CheckCircle, XCircle, 
  Eye, ChevronRight, Loader2, Building2, MapPin,
  Calendar
} from 'lucide-react';

export default function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await applicationAPI.getMyApplications();
      setApplications(res.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = filter === 'all' 
    ? applications 
    : applications.filter(a => a.status === filter);

  const statusConfig = {
    pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20', label: 'Pending' },
    reviewed: { icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', label: 'Reviewed' },
    shortlisted: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', label: 'Shortlisted' },
    rejected: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', label: 'Rejected' },
    hired: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', label: 'Hired' },
  };

  const statusTabs = ['all', 'pending', 'reviewed', 'shortlisted', 'rejected'];

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">My Applications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your job applications ({applications.length} total)
          </p>
        </motion.div>

        {/* Status Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {statusTabs.map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                filter === status
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {status}
              <span className="ml-2 text-xs opacity-70">
                ({status === 'all' ? applications.length : applications.filter(a => a.status === status).length})
              </span>
            </button>
          ))}
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold mb-2">No applications found</h3>
            <p className="text-gray-500 mb-6">Start applying to jobs that match your skills</p>
            <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app, i) => {
              const status = statusConfig[app.status] || statusConfig.pending;
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center text-white text-xl font-bold">
                        {app.job?.company?.charAt(0) || 'J'}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {app.job?.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">{app.job?.company}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {app.job?.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Applied {new Date(app.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${status.bg}`}>
                        <StatusIcon className={`w-4 h-4 ${status.color}`} />
                        <span className={`text-sm font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      {app.aiScore && (
                        <span className="badge-success">AI Score: {app.aiScore}%</span>
                      )}
                    </div>
                  </div>
                  {app.statusHistory?.length > 0 && (
                    <div className="mt-4 flex gap-2">
                      {app.statusHistory.map((h, j) => (
                        <span key={j} className="text-xs text-gray-400">
                          {new Date(h.changedAt).toLocaleDateString()} - {h.status}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
