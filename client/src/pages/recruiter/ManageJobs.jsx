import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { jobAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
  Briefcase, Edit, Trash2, Eye, Users, Plus,
  MapPin, Clock, DollarSign, Loader2, Search
} from 'lucide-react';

export default function ManageJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await jobAPI.getMyJobs();
      setJobs(res.data);
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await jobAPI.deleteJob(id);
      setJobs(prev => prev.filter(j => j._id !== id));
      toast.success('Job deleted successfully');
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  const toggleStatus = async (job) => {
    try {
      const newStatus = job.status === 'active' ? 'closed' : 'active';
      await jobAPI.updateJob(job._id, { status: newStatus });
      setJobs(prev => prev.map(j => j._id === job._id ? { ...j, status: newStatus } : j));
      toast.success(`Job ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update job');
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold">Manage Jobs</h1>
            <p className="text-gray-600 dark:text-gray-400">{jobs.length} jobs posted</p>
          </div>
          <Link to="/recruiter/post-job" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Post New Job
          </Link>
        </motion.div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your jobs..."
            className="input-field pl-10"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-gray-500 mb-6">Start by posting your first job</p>
            <Link to="/recruiter/post-job" className="btn-primary">Post a Job</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job, i) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center text-white text-xl font-bold">
                      {job.company?.charAt(0) || 'J'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <span className={`badge ${job.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                          {job.status}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">{job.company}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{job.type}</span>
                        {job.salaryMin && (
                          <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{job.salaryMin} - {job.salaryMax}</span>
                        )}
                        <span className="flex items-center gap-1"><Users className="w-4 h-4" />{job.applicationCount} applicants</span>
                        <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{job.views} views</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.skills?.slice(0, 3).map((skill, j) => (
                          <span key={j} className="badge-primary text-xs">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Link to={`/recruiter/applicants/${job._id}`} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="View Applicants">
                      <Users className="w-5 h-5 text-gray-500" />
                    </Link>
                    <button onClick={() => toggleStatus(job)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Toggle Status">
                      <Eye className="w-5 h-5 text-gray-500" />
                    </button>
                    <button onClick={() => navigate(`/recruiter/post-job`, { state: { job } })} className="p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="Edit">
                      <Edit className="w-5 h-5 text-blue-500" />
                    </button>
                    <button onClick={() => handleDelete(job._id)} className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete">
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
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
