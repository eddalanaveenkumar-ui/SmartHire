import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, Sparkles, Building2, Users, Briefcase, 
  TrendingUp, Shield, Zap, ArrowRight, CheckCircle,
  Star, ChevronRight
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: { staggerChildren: 0.1 }
  }
};

export default function Home() {
  const stats = [
    { icon: Briefcase, value: '10K+', label: 'Active Jobs' },
    { icon: Building2, value: '5K+', label: 'Companies' },
    { icon: Users, value: '50K+', label: 'Candidates' },
    { icon: TrendingUp, value: '95%', label: 'Success Rate' },
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'AI Job Matching',
      description: 'Smart algorithms match your skills with perfect job opportunities using advanced AI.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find jobs faster with intelligent filters and personalized recommendations.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Enterprise-grade security to protect your data and privacy.',
      gradient: 'from-green-500 to-teal-500',
    },
    {
      icon: Zap,
      title: 'Quick Apply',
      description: 'Apply to multiple jobs with one click using your stored profile.',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Building2,
      title: 'Top Companies',
      description: 'Connect with leading companies across various industries.',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Get AI-powered career advice and skill development recommendations.',
      gradient: 'from-pink-500 to-rose-500',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      content: 'SmartHire helped me find my dream job within a week! The AI recommendations were spot-on.',
      rating: 5,
      company: 'Tech Corp',
    },
    {
      name: 'Michael Chen',
      role: 'HR Manager',
      content: 'The best recruitment platform we have used. AI screening saved us countless hours.',
      rating: 5,
      company: 'StartupXYZ',
    },
    {
      name: 'Emily Davis',
      role: 'Product Designer',
      content: 'Love the personalized job matches. The platform understands exactly what I am looking for.',
      rating: 5,
      company: 'DesignHub',
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300 dark:bg-primary-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-pulse-slow" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-pulse-slow" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Job Platform
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
                Find Your{' '}
                <span className="gradient-text">Dream Job</span>
                <br />
                With AI Power
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-xl">
                SmartHire uses artificial intelligence to match your unique skills and experience 
                with the perfect job opportunities. Let AI guide your career journey.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/jobs" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2 group">
                  Browse Jobs
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/signup" className="btn-secondary text-lg px-8 py-4">
                  Get Started Free
                </Link>
              </div>
              <div className="flex items-center gap-4 mt-8 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full gradient-bg border-2 border-white dark:border-gray-900 flex items-center justify-center text-white text-xs font-bold">
                      {['S','M','E','J'][i-1]}
                    </div>
                  ))}
                </div>
                <span>Trusted by <strong className="text-gray-700 dark:text-gray-200">50,000+</strong> candidates</span>
              </div>
            </motion.div>

            {/* Right Content - Hero Image/Animation */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="glass-card p-8">
                <div className="space-y-6">
                  {[
                    { role: 'Senior React Developer', match: '95% Match', company: 'TechCorp', color: 'from-blue-500 to-cyan-500' },
                    { role: 'Full Stack Engineer', match: '88% Match', company: 'StartupXYZ', color: 'from-purple-500 to-pink-500' },
                    { role: 'Frontend Lead', match: '82% Match', company: 'DesignHub', color: 'from-green-500 to-teal-500' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                          <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">{item.role}</p>
                          <p className="text-sm text-gray-500">{item.company}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="badge-success">{item.match}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl text-white text-center">
                  <p className="font-semibold">✨ AI-Powered Matching</p>
                  <p className="text-sm opacity-90">Get personalized job recommendations based on your skills</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-10 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 dark:divide-gray-800"
          >
            {stats.map((stat, i) => (
              <div key={i} className="p-6 md:p-8 text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary-500" />
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Why Choose SmartHire?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our AI-powered platform makes job hunting and hiring smarter, faster, and more efficient.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="glass-card p-6 group cursor-default"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">How It Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Get started in three simple steps</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up as a candidate or recruiter in minutes', icon: Users },
              { step: '02', title: 'AI Profile Analysis', desc: 'Our AI analyzes your skills and preferences', icon: Sparkles },
              { step: '03', title: 'Get Matched', desc: 'Receive personalized job recommendations instantly', icon: CheckCircle },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="relative inline-flex mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white dark:bg-gray-900 border-2 border-primary-500 flex items-center justify-center text-primary-500 font-bold text-sm">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">What Our Users Say</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Join thousands of satisfied users</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 italic">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role} at {t.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Find Your Dream Job?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have advanced their careers with SmartHire's AI-powered platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/signup"
                className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-xl inline-flex items-center gap-2"
              >
                Get Started Free
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                to="/jobs"
                className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transform hover:scale-105 transition-all duration-200 border border-white/30 inline-flex items-center gap-2"
              >
                Browse Jobs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
