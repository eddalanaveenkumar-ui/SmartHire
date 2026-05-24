import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap,
  Award, Plus, X, Save, Upload, Sparkles
} from 'lucide-react';

export default function CandidateProfile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    name: '', phone: '', location: '', headline: '', bio: '',
    skills: [],
    education: [],
    experience: []
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
        headline: user.headline || '',
        bio: user.bio || '',
        skills: user.skills || [],
        education: user.education || [{ institution: '', degree: '', field: '', startYear: '', endYear: '' }],
        experience: user.experience || [{ company: '', position: '', description: '', startDate: '', endDate: '', current: false }]
      });
    }
  }, [user]);

  const addSkill = (skill) => {
    if (skill && !profile.skills.includes(skill)) {
      setProfile({ ...profile, skills: [...profile.skills, skill] });
    }
  };

  const removeSkill = (index) => {
    setProfile({ ...profile, skills: profile.skills.filter((_, i) => i !== index) });
  };

  const addEducation = () => {
    setProfile({
      ...profile,
      education: [...profile.education, { institution: '', degree: '', field: '', startYear: '', endYear: '' }]
    });
  };

  const addExperience = () => {
    setProfile({
      ...profile,
      experience: [...profile.experience, { company: '', position: '', description: '', startDate: '', endDate: '', current: false }]
    });
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await authAPI.uploadResume(formData);
      updateUser(res.data);
      toast.success('Resume uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await authAPI.updateProfile(profile);
      updateUser(res.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold">Edit Profile</h1>
            <p className="text-gray-600 dark:text-gray-400">Update your professional information</p>
          </div>
          <button onClick={handleSave} disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </motion.div>

        <div className="space-y-6">
          {/* Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-500" />
              Basic Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Headline</label>
                <input
                  type="text"
                  value={profile.headline}
                  onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Senior React Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="input-field"
                  placeholder="City, State"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="input-field min-h-[100px]"
                placeholder="Tell us about yourself..."
              />
            </div>
          </motion.div>

          {/* Resume Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary-500" />
              Resume
            </h2>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {user?.resume?.originalName || 'Upload your resume (PDF, DOC)'}
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="btn-primary cursor-pointer inline-block">
                {uploading ? 'Uploading...' : 'Choose File'}
              </label>
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary-500" />
              Skills
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.skills.map((skill, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-xl text-sm">
                  {skill}
                  <button onClick={() => removeSkill(i)} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a skill"
                className="input-field flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addSkill(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Add a skill"]');
                  addSkill(input?.value);
                  if (input) input.value = '';
                }}
                className="btn-secondary"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary-500" />
                Education
              </h2>
              <button onClick={addEducation} className="btn-secondary text-sm">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {profile.education.map((edu, i) => (
              <div key={i} className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl mb-4">
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => {
                    const eduArr = [...profile.education];
                    eduArr[i].institution = e.target.value;
                    setProfile({ ...profile, education: eduArr });
                  }}
                  placeholder="Institution"
                  className="input-field"
                />
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => {
                    const eduArr = [...profile.education];
                    eduArr[i].degree = e.target.value;
                    setProfile({ ...profile, education: eduArr });
                  }}
                  placeholder="Degree"
                  className="input-field"
                />
                <input
                  type="text"
                  value={edu.field}
                  onChange={(e) => {
                    const eduArr = [...profile.education];
                    eduArr[i].field = e.target.value;
                    setProfile({ ...profile, education: eduArr });
                  }}
                  placeholder="Field of Study"
                  className="input-field"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={edu.startYear}
                    onChange={(e) => {
                      const eduArr = [...profile.education];
                      eduArr[i].startYear = e.target.value;
                      setProfile({ ...profile, education: eduArr });
                    }}
                    placeholder="Start Year"
                    className="input-field"
                  />
                  <input
                    type="number"
                    value={edu.endYear}
                    onChange={(e) => {
                      const eduArr = [...profile.education];
                      eduArr[i].endYear = e.target.value;
                      setProfile({ ...profile, education: eduArr });
                    }}
                    placeholder="End Year"
                    className="input-field"
                  />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Experience */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary-500" />
                Experience
              </h2>
              <button onClick={addExperience} className="btn-secondary text-sm">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {profile.experience.map((exp, i) => (
              <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl mb-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => {
                      const expArr = [...profile.experience];
                      expArr[i].company = e.target.value;
                      setProfile({ ...profile, experience: expArr });
                    }}
                    placeholder="Company"
                    className="input-field"
                  />
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => {
                      const expArr = [...profile.experience];
                      expArr[i].position = e.target.value;
                      setProfile({ ...profile, experience: expArr });
                    }}
                    placeholder="Position"
                    className="input-field"
                  />
                </div>
                <textarea
                  value={exp.description}
                  onChange={(e) => {
                    const expArr = [...profile.experience];
                    expArr[i].description = e.target.value;
                    setProfile({ ...profile, experience: expArr });
                  }}
                  className="input-field mt-4 min-h-[80px]"
                  placeholder="Description"
                />
                <div className="flex items-center gap-4 mt-4">
                  <input
                    type="date"
                    value={exp.startDate}
                    onChange={(e) => {
                      const expArr = [...profile.experience];
                      expArr[i].startDate = e.target.value;
                      setProfile({ ...profile, experience: expArr });
                    }}
                    className="input-field flex-1"
                  />
                  {!exp.current && (
                    <input
                      type="date"
                      value={exp.endDate}
                      onChange={(e) => {
                        const expArr = [...profile.experience];
                        expArr[i].endDate = e.target.value;
                        setProfile({ ...profile, experience: expArr });
                      }}
                      className="input-field flex-1"
                    />
                  )}
                  <label className="flex items-center gap-2 text-sm whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => {
                        const expArr = [...profile.experience];
                        expArr[i].current = e.target.checked;
                        setProfile({ ...profile, experience: expArr });
                      }}
                      className="rounded"
                    />
                    Current
                  </label>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
