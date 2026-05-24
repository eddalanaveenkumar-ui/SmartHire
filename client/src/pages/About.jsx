import { motion } from 'framer-motion';
import { Sparkles, Target, Heart, Globe, Shield, Zap, Users, Rocket } from 'lucide-react';

export default function About() {
  const values = [
    { icon: Sparkles, title: 'Innovation', desc: 'Leveraging AI to transform recruitment' },
    { icon: Target, title: 'Precision', desc: 'Accurate skill matching and recommendations' },
    { icon: Heart, title: 'People First', desc: 'Putting candidates and companies first' },
    { icon: Globe, title: 'Global Reach', desc: 'Connecting talent worldwide' },
  ];

  const stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '10K+', label: 'Jobs Posted' },
    { value: '5K+', label: 'Companies' },
    { value: '95%', label: 'Satisfaction' },
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-950 dark:to-primary-950" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
              <Rocket className="w-4 h-4" />
              About SmartHire
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transforming Recruitment with{' '}
              <span className="gradient-text">AI</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              SmartHire is an AI-powered job portal that connects talented professionals with 
              their dream careers. Our intelligent platform uses advanced algorithms to match 
              candidates with positions where they'll thrive.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 dark:divide-gray-800">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 text-center"
              >
                <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                At SmartHire, we believe the right job can change your life. Our mission is to 
                democratize career opportunities by using AI to remove biases and connect talent 
                with opportunity based on skills and potential.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We're building a future where finding the perfect job is as simple as letting 
                our AI understand who you are and what you're capable of achieving.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Our Team</h3>
                  <p className="text-sm text-gray-500">Passionate about innovation</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                We're a diverse team of engineers, designers, and HR professionals committed to 
                making recruitment smarter, faster, and more inclusive through AI technology.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Our Values</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">What drives us every day</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <v.icon className="w-10 h-10 mx-auto mb-4 text-primary-500" />
                <h3 className="font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
