import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Clock, HelpCircle, ShieldAlert, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Spline = React.lazy(() => import('@splinetool/react-spline'));

export default function Home() {
  const features = [
    {
      title: "AI Chat Assistant",
      description: "Ask anything about elections and get instant, accurate answers.",
      icon: <MessageSquare size={24} />,
      link: "/chat",
      color: "text-blue-500"
    },
    {
      title: "Election Timeline",
      description: "Follow the step-by-step journey of how India votes.",
      icon: <Clock size={24} />,
      link: "/timeline",
      color: "text-accent"
    },
    {
      title: "Knowledge Quiz",
      description: "Test your understanding of voter rights and processes.",
      icon: <HelpCircle size={24} />,
      link: "/quiz",
      color: "text-success"
    },
    {
      title: "Myth Buster",
      description: "Separate fact from fiction about Indian elections.",
      icon: <ShieldAlert size={24} />,
      link: "/myths",
      color: "text-purple-500"
    }
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-lightBg dark:from-darkBg dark:to-[#081024] transition-colors duration-300">
        
        <div className="absolute inset-0 w-full h-full opacity-30 dark:opacity-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%231B2F5E\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 grid lg:grid-cols-2 gap-12 items-center py-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-extrabold text-primary dark:text-white leading-tight mb-6 tracking-tight">
              Understand Your Vote. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">Shape India's Future.</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              VoteWise makes the Indian election process simple, interactive, and easy to understand for every citizen.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link to="/timeline" className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 duration-300 text-center">
                Start Learning
              </Link>
              <Link to="/chat" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-white/10 text-primary dark:text-white border-2 border-primary/20 dark:border-white/20 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-white/20 transition-colors shadow-sm hover:shadow-md hover:-translate-y-1 duration-300 text-center">
                Ask AI Assistant
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[400px] lg:h-[600px] w-full rounded-2xl overflow-hidden hidden md:block"
          >
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center glass-card">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
              </div>
            }>
              <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
            </Suspense>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-lightBg dark:bg-[#0D1B3E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-primary dark:text-white mb-4">
              Everything you need to be a smart voter
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Master the democratic process through interactive tools built specifically for the Indian electorate.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={feature.link} className="block group">
                  <div className="glass-card h-full p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:bg-white/10">
                    <div className={`w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-6 ${feature.color}`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">{feature.description}</p>
                    <div className="flex items-center text-primary dark:text-accent font-medium group-hover:translate-x-2 transition-transform">
                      Explore <ArrowRight size={18} className="ml-2" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}