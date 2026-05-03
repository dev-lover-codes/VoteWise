import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Clock, HelpCircle, ArrowRight, UserCheck, Vote, Award, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const Spline = React.lazy(() => import('@splinetool/react-spline'));

export default function Home() {
  const features = [
    {
      title: "AI Chat Assistant",
      description: "Ask anything about elections and get instant, accurate answers from our VoteWise AI.",
      icon: <MessageSquare size={24} />,
      link: "/chat",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Election Timeline",
      description: "Follow the step-by-step journey of how the world's largest democracy votes.",
      icon: <Clock size={24} />,
      link: "/timeline",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      title: "Knowledge Quiz",
      description: "Test your understanding of voter rights and earn your 'Certified Voter' badge.",
      icon: <HelpCircle size={24} />,
      link: "/quiz",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Mock EVM",
      description: "Practice voting on a simulated Electronic Voting Machine with VVPAT verification.",
      icon: <Vote size={24} />,
      link: "/evm",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    }
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-lightBg dark:from-darkBg dark:to-[#081024] transition-colors duration-300">
        
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 w-full h-full opacity-30 dark:opacity-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%231B2F5E\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 grid lg:grid-cols-2 gap-12 items-center py-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary dark:bg-accent/20 dark:text-accent font-bold text-sm mb-6 border border-primary/20"
            >
              <Vote size={18} />
              Empowering India's Electorate
            </motion.div>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-heading font-black text-primary dark:text-white leading-[1.1] mb-8 tracking-tighter">
              Know Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400 text-glow">Democratic Power.</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              VoteWise is your interactive companion to understanding the world's largest election process. From registration to the counting day, we make every step clear.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
              <Link to="/timeline" className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-full font-black hover:bg-primary/90 transition-all shadow-[0_10px_20px_rgba(27,47,94,0.3)] hover:shadow-[0_15px_30px_rgba(27,47,94,0.4)] hover:-translate-y-1 duration-300 text-center uppercase tracking-wider">
                Start the Journey
              </Link>
              <Link to="/chat" className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-white/5 text-primary dark:text-white border-2 border-primary/10 dark:border-white/10 rounded-full font-black hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm hover:shadow-lg hover:-translate-y-1 duration-300 text-center uppercase tracking-wider">
                Ask AI Expert
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[500px] lg:h-[700px] w-full rounded-[3rem] overflow-hidden hidden md:block border border-white/20 shadow-2xl"
          >
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center glass-card">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
              </div>
            }>
              <div className="w-full h-full" aria-label="Interactive 3D Election Scene">
                <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
              </div>
            </Suspense>
            {/* Overlay hint */}
            <div className="absolute bottom-6 right-6 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white/80 text-xs font-medium pointer-events-none">
              Interactive 3D Experience
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Mission Section */}
      <section className="py-24 bg-white dark:bg-[#081024]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center p-8 glass-card border-none bg-accent/5"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent text-white flex items-center justify-center mb-6 shadow-lg shadow-accent/20">
                <UserCheck size={32} />
              </div>
              <h3 className="text-2xl font-bold text-primary dark:text-white mb-4 tracking-tight">Voter Awareness</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Empowering every citizen with the knowledge of their rights and the registration process.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center text-center p-8 glass-card border-none bg-primary/5"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                <BookOpen size={32} />
              </div>
              <h3 className="text-2xl font-bold text-primary dark:text-white mb-4 tracking-tight">Civic Education</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Breaking down complex constitutional processes into simple, interactive modules.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center text-center p-8 glass-card border-none bg-success/5"
            >
              <div className="w-16 h-16 rounded-2xl bg-success text-white flex items-center justify-center mb-6 shadow-lg shadow-success/20">
                <Award size={32} />
              </div>
              <h3 className="text-2xl font-bold text-primary dark:text-white mb-4 tracking-tight">Democratic Duty</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Celebrating the spirit of Indian democracy and the importance of every single vote.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-lightBg dark:bg-[#0D1B3E] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-heading font-black text-primary dark:text-white mb-6 tracking-tight">
              Master the Democratic Process
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Explore our suite of interactive tools designed to make you an informed and empowered voter.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={feature.link} className="block group h-full">
                  <div className="glass-card h-full p-8 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:hover:bg-white/10 group-hover:border-primary/30">
                    <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} shadow-sm flex items-center justify-center mb-8 ${feature.color} group-hover:scale-110 transition-transform duration-500`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 tracking-tight">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">{feature.description}</p>
                    <div className="flex items-center text-primary dark:text-accent font-bold group-hover:translate-x-2 transition-transform mt-auto uppercase text-xs tracking-widest">
                      Explore Module <ArrowRight size={16} className="ml-2" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,1),transparent)]"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-heading font-black text-white mb-6 tracking-tight">Your Vote is Your Voice.</h2>
          <p className="text-white/80 text-xl mb-10 leading-relaxed">
            Don't just be a spectator in the democratic process. Register, educate yourself, and shape the future of our nation.
          </p>
          <Link to="/register" className="inline-block px-12 py-5 bg-white text-primary rounded-full font-black hover:bg-gray-100 transition-all shadow-2xl hover:-translate-y-1 uppercase tracking-widest text-sm">
            Learn How to Register
          </Link>
        </div>
      </section>
    </div>
  );
}