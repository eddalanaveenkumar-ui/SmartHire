import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { applicationAPI } from '../../services/api';
import { 
  ArrowLeft, Mail, Phone, MapPin, Briefcase, GraduationCap,
  Award, Sparkles, Download, Star, Calendar
} from 'lucide-react';

export default function CandidateDetails() {
  const { applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, [applicationId]);

  const fetchDetails = async () => {
    try {
      const res = await applicationAPI.getApplication(applicationId);
      setApplication(res.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="loading-skeleton h-8 w-48 mb-4" />
          <div className="loading-skeleton h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Application Not Found</h2>
          <Link to="/recruiter/manage-jobs" className="btn-primary">Back to Jobs</Link>
        </div>
      </div>
    );
  }

  const applicant = application.applicant || {};
  const job = application.job || {};

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to={`/recruiter/applicants/${job._id}`} className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Applicants
        </Link>

        <div className="space-y-6">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 md:p-8"
          >
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center text-white text-3xl font-bold">
                {applicant.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">{applicant.name}</h1>
                <p className="text-gray-600 dark:text-gray-400">{applicant.headline || 'Candidate'}</p>
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                  {applicant.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" />{applicant.email}</span>}
                  {applicant.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" />{applicant.phone}</span>}
                  {applicant.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{applicant.location}</span>}
                </div>
              </div>
              <div className="text-center">
                {application.aiScore && (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                    <div>
                      <div className="text-white text-xl font-bold">{application.aiScore}%</div>
                      <div className="text-white text-[10px]">Match</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {application.aiAnalysis && (
              <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-950 dark:to-purple-950 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-primary-500" />
                  <span className="font-semibold text-sm">AI Analysis</span>
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-green-600 dark:text-green-400 mb-2">Strengths</p>
                    <ul className="space-y-1">
                      {application.aiAnalysis.strengths?.map((s, i) => (
                        <li key={i} className="flex items-center gap-1 text-green-600 dark:text-green-400">✓ {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-red-600 dark:text-red-400 mb-2">Gaps</p>
                    <ul className="space-y-1">
                      {application.aiAnalysis.gaps?.map((g, i) => (
                        <li key={i} className="text-red-600 dark:text-red-400">{g}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-primary-600 mb-2">Match</p>
                    <div className="text-2xl font-bold gradient-text">{application.aiAnalysis.matchPercentage || application.aiScore}%</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Skills */}
          {applicant.skills?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary-500" />
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {applicant.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-xl text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Experience */}
          {applicant.experience?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary-500" />
                Experience
              </h2>
              <div className="space-y-4">
                {applicant.experience.map((exp, i) => (
                  <div key={i} className="border-l-2 border-primary-200 dark:border-primary-800 pl-4">
                    <h3 className="font-semibold">{exp.position}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company}</p>
                    {exp.startDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(exp.startDate).getFullYear()} - {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).getFullYear() : ''}
                      </p>
                    )}
                    {exp.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Education */}
          {applicant.education?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary-500" />
                Education
              </h2>
              <div className="space-y-4">
                {applicant.education.map((edu, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-primary-500 mt-1" />
                    <div>
                      <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{edu.institution}</p>
                      {edu.startYear && (
                        <p className="text-xs text-gray-500">{edu.startYear} - {edu.endYear || 'Present'}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Application Timeline */}
          {application.statusHistory?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-6"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-500" />
                Application Timeline
              </h2>
              <div className="space-y-3">
                {application.statusHistory.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary-500" />
                    <span className="font-medium capitalize">{h.status}</span>
                    <span className="text-gray-500">{new Date(h.changedAt).toLocaleDateString()}</span>
                    {h.note && <span className="text-gray-400">- {h.note}</span>}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
