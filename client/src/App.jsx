import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Candidate Pages
import CandidateDashboard from './pages/candidate/Dashboard';
import CandidateProfile from './pages/candidate/Profile';
import AppliedJobs from './pages/candidate/AppliedJobs';
import SavedJobs from './pages/candidate/SavedJobs';
import RecommendedJobs from './pages/candidate/RecommendedJobs';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/Dashboard';
import PostJob from './pages/recruiter/PostJob';
import ManageJobs from './pages/recruiter/ManageJobs';
import ApplicantsList from './pages/recruiter/ApplicantsList';
import CandidateDetails from './pages/recruiter/CandidateDetails';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import AdminAnalytics from './pages/admin/Analytics';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" />;
  }
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    if (user?.role === 'admin') return <Navigate to="/admin/dashboard" />;
    if (user?.role === 'recruiter') return <Navigate to="/recruiter/dashboard" />;
    return <Navigate to="/candidate/dashboard" />;
  }
  return children;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

          {/* Candidate Routes */}
          <Route path="/candidate/dashboard" element={<ProtectedRoute allowedRoles={['candidate']}><CandidateDashboard /></ProtectedRoute>} />
          <Route path="/candidate/profile" element={<ProtectedRoute allowedRoles={['candidate']}><CandidateProfile /></ProtectedRoute>} />
          <Route path="/candidate/applications" element={<ProtectedRoute allowedRoles={['candidate']}><AppliedJobs /></ProtectedRoute>} />
          <Route path="/candidate/saved-jobs" element={<ProtectedRoute allowedRoles={['candidate']}><SavedJobs /></ProtectedRoute>} />
          <Route path="/candidate/recommendations" element={<ProtectedRoute allowedRoles={['candidate']}><RecommendedJobs /></ProtectedRoute>} />

          {/* Recruiter Routes */}
          <Route path="/recruiter/dashboard" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterDashboard /></ProtectedRoute>} />
          <Route path="/recruiter/post-job" element={<ProtectedRoute allowedRoles={['recruiter']}><PostJob /></ProtectedRoute>} />
          <Route path="/recruiter/manage-jobs" element={<ProtectedRoute allowedRoles={['recruiter']}><ManageJobs /></ProtectedRoute>} />
          <Route path="/recruiter/applicants/:jobId" element={<ProtectedRoute allowedRoles={['recruiter']}><ApplicantsList /></ProtectedRoute>} />
          <Route path="/recruiter/candidate/:applicationId" element={<ProtectedRoute allowedRoles={['recruiter']}><CandidateDetails /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalytics /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
              <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Page not found</p>
              <a href="/" className="btn-primary">Go Home</a>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
