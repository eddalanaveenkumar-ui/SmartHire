import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { jobAPI } from '../services/api';
import { Search, MapPin, Briefcase, Clock, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, Building2, DollarSign, Sparkles } from 'lucide-react';

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
const experienceLevels = ['Entry', 'Mid', 'Senior', 'Lead', 'Executive'];
const categories = ['Engineering', 'Design', 'Marketing', 'Sales', 'Finance', 'Healthcare', 'Education', 'Other'];

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    location: '',
    experienceLevel: '',
    salaryMin: '',
    salaryMax: '',
  });

  useEffect(() => {
    fetchJobs();
  }, [filters.type, filters.category, filters.experienceLevel, pagination.page]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, limit: 12 };
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });
      const res = await jobAPI.getJobs(params);
      setJobs(res.data.jobs);
      setPagination(prev => ({ ...prev, ...res.data.pagination }));
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchJobs();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ search: '', type: '', category: '', location: '', experienceLevel: '', salaryMin: '', salaryMax: '' });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div className="pt-20 min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Job</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Browse thousands of jobs from top companies with AI-powered matching
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSearch}
            className="mt-8 max-w-3xl mx-auto"
          >
            <div className="glass flex items-center gap-2 p-2 rounded-2xl shadow-2xl">
              <div className="flex-1 flex items-center gap-2 px-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search jobs by title, company, or keywords..."
                  className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 py-2"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <SlidersHorizontal className="w-5 h-5 text-gray-500" />
                </button>
                <button type="submit" className="btn-primary !py-2.5 !px-6">
                  Search
                </button>
              </div>
            </div>
          </motion.form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-64 flex-shrink-0 space-y-6"
            >
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Filter className="w-4 h-4" /> Filters
                  </h3>
                  <button onClick={clearFilters} className="text-sm text-primary-600 hover:text-primary-500">
                    Clear
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Job Type</label>
                    <select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="input-field text-sm"
                    >
                      <option value="">All Types</option>
                      {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="input-field text-sm"
                    >
                      <option value="">All Categories</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Experience Level</label>
                    <select
                      value={filters.experienceLevel}
                      onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                      className="input-field text-sm"
                    >
                      <option value="">Any Level</option>
                      {experienceLevels.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Location</label>
                    <input
                      type="text"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      placeholder="City or remote"
                      className="input-field text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Min Salary</label>
                    <input
                      type="number"
                      value={filters.salaryMin}
                      onChange={(e) => handleFilterChange('salaryMin', e.target.value)}
                      placeholder="$ min"
                      className="input-field text-sm"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Job Listings */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{pagination.total}</span> jobs found
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select className="input-field text-sm py-1.5 w-32">
                  <option>Newest</option>
                  <option>Oldest</option>
                  <option>Salary: High</option>
                  <option>Salary: Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid gap-4">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="glass-card p-6">
                    <div className="flex items-start gap-4">
                      <div className="loading-skeleton w-16 h-16 rounded-xl" />
                      <div className="flex-1">
                        <div className="loading-skeleton h-5 w-48 mb-2" />
                        <div className="loading-skeleton h-4 w-32 mb-3" />
                        <div className="loading-skeleton h-4 w-full max-w-md" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-16">
                <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job, i) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link to={`/jobs/${job._id}`} className="block glass-card p-6 card-hover">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {job.company?.charAt(0) || 'C'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                {job.title}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 font-medium">{job.company}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className={`badge ${
                                job.type === 'Remote' ? 'badge-success' : 
                                job.type === 'Contract' ? 'badge-warning' : 'badge-primary'
                              }`}>
                                {job.type}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                            {job.salaryMin && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {job.salaryMin.toLocaleString()} - {job.salaryMax?.toLocaleString()}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {job.experienceLevel}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {job.skills?.slice(0, 4).map((skill, j) => (
                              <span key={j} className="badge-primary text-xs">{skill}</span>
                            ))}
                            {job.skills?.length > 4 && (
                              <span className="text-xs text-gray-400">+{job.skills.length - 4} more</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setPagination(prev => ({ ...prev, page }))}
                    className={`w-10 h-10 rounded-xl font-medium transition-colors ${
                      page === pagination.page
                        ? 'bg-primary-500 text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
