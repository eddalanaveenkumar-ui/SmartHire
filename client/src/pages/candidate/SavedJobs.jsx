import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { Bookmark, MapPin, DollarSign, Clock, Briefcase, Building2, Heart, Trash2 } from 'lucide-react';

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const res = await authAPI.getSavedJobs();
      setSavedJobs(res.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (jobId) => {
    try {
      await authAPI.saveJob(jobId);
      setSavedJobs(prev => prev.filter(j => j._id !== jobId));
      toast.success('Job removed from saved');
    } catch (error) {
      toast.error('Failed to remove');
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="loading-skeleton h-8 w-48 mb-8" />
          {[1,2,3].map(i => (
            <div key={i} className="loading-skeleton h-24 rounded-2xl mb-4" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <Heart className="w-8 h-8 text-red-500" />
          <div>
            <h1 className="text-3xl font-bold">Saved Jobs</h1>
            <p className="text-gray-600 dark:text-gray-400">{savedJobs.length} saved jobs</p>
          </div>
        </motion.div>

        {savedJobs.length === 0 ? (
          <div className="text-center py-16">
            <Bookmark className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold mb-2">No saved jobs</h3>
            <p className="text-gray-500 mb-6">Save jobs you're interested in to review later</p>
            <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedJobs.map((job, i) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-6"
              >
                <div className="flex items-start justify-between">
                  <Link to={`/jobs/${job._id}`} className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center text-white text-xl font-bold">
                      {job.company?.charAt(0) || 'J'}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{job.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">{job.company}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{job.type}</span>
                        {job.salaryMin && (
                          <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{job.salaryMin} - {job.salaryMax}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => handleRemove(job._id)}
                    className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
