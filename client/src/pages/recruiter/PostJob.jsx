import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { jobAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
  Briefcase, Building2, MapPin, DollarSign, FileText,
  Plus, X, Send, Sparkles
} from 'lucide-react';

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
const experienceLevels = ['Entry', 'Mid', 'Senior', 'Lead', 'Executive'];

export default function PostJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    category: 'Engineering',
    experienceLevel: 'Mid',
    salaryMin: '',
    salaryMax: '',
    description: '',
    requirements: [''],
    responsibilities: [''],
    benefits: [''],
    skills: [''],
  });

  const handleArrayChange = (field, index, value) => {
    const arr = [...form[field]];
    arr[index] = value;
    setForm({ ...form, [field]: arr });
  };

  const addArrayItem = (field) => {
    setForm({ ...form, [field]: [...form[field], ''] });
  };

  const removeArrayItem = (field, index) => {
    const arr = form[field].filter((_, i) => i !== index);
    setForm({ ...form, [field]: arr.length ? arr : [''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const jobData = {
        ...form,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
        requirements: form.requirements.filter(r => r.trim()),
        responsibilities: form.responsibilities.filter(r => r.trim()),
        benefits: form.benefits.filter(b => b.trim()),
        skills: form.skills.filter(s => s.trim()),
      };
      await jobAPI.createJob(jobData);
      toast.success('Job posted successfully!');
      navigate('/recruiter/manage-jobs');
    } catch (error) {
      toast.error(error.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold">Post a New Job</h1>
            <p className="text-gray-600 dark:text-gray-400">Fill in the details to attract the best candidates</p>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Job Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Senior React Developer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company *</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="input-field"
                    placeholder="Your company name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location *</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="input-field"
                    placeholder="e.g., San Francisco, CA or Remote"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Job Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="input-field"
                    >
                      {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Experience</label>
                    <select
                      value={form.experienceLevel}
                      onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
                      className="input-field"
                    >
                      {experienceLevels.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Engineering, Design"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Min Salary</label>
                    <input
                      type="number"
                      value={form.salaryMin}
                      onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
                      className="input-field"
                      placeholder="$"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Salary</label>
                    <input
                      type="number"
                      value={form.salaryMax}
                      onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
                      className="input-field"
                      placeholder="$"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Job Description *</h2>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field min-h-[200px]"
                placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
                required
              />
            </motion.div>

            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Requirements</h2>
                <button type="button" onClick={() => addArrayItem('requirements')} className="btn-secondary text-sm">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="space-y-3">
                {form.requirements.map((req, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => handleArrayChange('requirements', i, e.target.value)}
                      className="input-field"
                      placeholder="e.g., 5+ years of React experience"
                    />
                    <button type="button" onClick={() => removeArrayItem('requirements', i)} className="p-2 text-gray-400 hover:text-red-500">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Required Skills</h2>
                <button type="button" onClick={() => addArrayItem('skills')} className="btn-secondary text-sm">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="space-y-3">
                {form.skills.map((skill, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleArrayChange('skills', i, e.target.value)}
                      className="input-field"
                      placeholder="e.g., JavaScript, React, Node.js"
                    />
                    <button type="button" onClick={() => removeArrayItem('skills', i)} className="p-2 text-gray-400 hover:text-red-500">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Benefits</h2>
                <button type="button" onClick={() => addArrayItem('benefits')} className="btn-secondary text-sm">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="space-y-3">
                {form.benefits.map((benefit, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => handleArrayChange('benefits', i, e.target.value)}
                      className="input-field"
                      placeholder="e.g., Health insurance, Remote work"
                    />
                    <button type="button" onClick={() => removeArrayItem('benefits', i)} className="p-2 text-gray-400 hover:text-red-500">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-end gap-4"
            >
              <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Post Job
                  </>
                )}
              </button>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}
