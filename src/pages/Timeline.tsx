import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, Users, CheckSquare, Shield, Megaphone, BoxSelect, TrendingUp, ChevronDown, ChevronUp, Download, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TIMELINE_STAGES = [
  {
    id: 1,
    title: "Election Notification",
    icon: <FileText size={24} />,
    shortDesc: "ECI issues official notification, dates announced",
    details: [
      "The Election Commission of India (ECI) announces the complete schedule.",
      "Notification is issued by the President for Lok Sabha or Governor for Vidhan Sabha.",
      "This triggers the immediate application of the Model Code of Conduct."
    ]
  },
  {
    id: 2,
    title: "Voter Registration & Verification",
    icon: <Search size={24} />,
    shortDesc: "Check your name on voter list using eci.gov.in or 1950 helpline",
    details: [
      "Citizens must ensure their name is on the Electoral Roll.",
      "Use Form 6 for new registration via nvsp.in or Voter Helpline App.",
      "You cannot vote if your name is not on the roll, even if you have a Voter ID."
    ]
  },
  {
    id: 3,
    title: "Filing of Nominations",
    icon: <Users size={24} />,
    shortDesc: "Candidates submit nomination papers to Returning Officer",
    details: [
      "Candidates file their nomination papers along with an affidavit (Form 26).",
      "They must declare criminal records, assets, liabilities, and educational qualifications.",
      "A security deposit is required (Rs 25,000 for general candidates in Lok Sabha)."
    ]
  },
  {
    id: 4,
    title: "Scrutiny of Nominations",
    icon: <CheckSquare size={24} />,
    shortDesc: "Returning Officer checks validity of nominations",
    details: [
      "The Returning Officer (RO) examines all nomination papers.",
      "Invalid forms or those with hidden/false information can be rejected.",
      "Candidates are given a few days to withdraw their nomination if they choose."
    ]
  },
  {
    id: 5,
    title: "Model Code of Conduct",
    icon: <Shield size={24} />,
    shortDesc: "Political parties and candidates must follow ECI rules",
    details: [
      "MCC is a set of guidelines for the conduct of political parties and candidates.",
      "Ensures level playing field and prevents misuse of ruling party power.",
      "No new government schemes can be announced during this period."
    ]
  },
  {
    id: 6,
    title: "Election Campaigning",
    icon: <Megaphone size={24} />,
    shortDesc: "Parties campaign, campaigning stops 48 hours before voting",
    details: [
      "Candidates hold rallies, distribute manifestos, and reach out to voters.",
      "Campaign spending is strictly monitored by ECI observers.",
      "Campaigning officially ends 48 hours before the start of polling (Silence Period)."
    ]
  },
  {
    id: 7,
    title: "Voting Day",
    icon: <BoxSelect size={24} />,
    shortDesc: "Voters cast vote using EVM, VVPAT slip shown for verification",
    details: [
      "Voting is done via Electronic Voting Machines (EVMs).",
      "VVPAT (Voter Verified Paper Audit Trail) prints a slip showing the chosen candidate.",
      "Indelible ink is applied to the left index finger to prevent double voting."
    ]
  },
  {
    id: 8,
    title: "Vote Counting & Results",
    icon: <TrendingUp size={24} />,
    shortDesc: "EVMs opened, votes counted, winner declared",
    details: [
      "EVMs are kept in strong rooms under heavy security.",
      "Counting is done in the presence of candidate representatives.",
      "The candidate with the highest number of votes wins (First-Past-The-Post system)."
    ]
  }
];

export default function Timeline() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState('Lok Sabha');
  const navigate = useNavigate();

  const handleAskAI = (stageTitle: string) => {
    navigate('/chat', { state: { initialMessage: `Can you explain the "${stageTitle}" stage of the Indian election process in more detail?` } });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary dark:text-white mb-4">
          India's Election Process — Step by Step
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Understand the journey from announcement to results.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="glass-card flex p-1 rounded-full bg-slate-100 dark:bg-slate-800">
          <button 
            onClick={() => setFilter('Lok Sabha')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${filter === 'Lok Sabha' ? 'bg-primary text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            General (Lok Sabha)
          </button>
          <button 
            onClick={() => setFilter('Vidhan Sabha')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${filter === 'Vidhan Sabha' ? 'bg-primary text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            State (Vidhan Sabha)
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-slate-700 -translate-x-1/2"></div>
        
        {TIMELINE_STAGES.map((stage, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            key={stage.id} 
            className={`relative mb-8 flex flex-col md:flex-row items-center md:justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
          >
            <div className="hidden md:block md:w-5/12"></div>
            
            <div className="absolute left-4 md:left-1/2 w-10 h-10 rounded-full bg-primary border-4 border-white dark:border-darkBg flex items-center justify-center text-white font-bold shadow-lg -translate-x-1/2 z-10">
              {stage.id}
            </div>

            <div className="w-full pl-12 md:pl-0 md:w-5/12">
              <div 
                className="glass-card bg-white dark:bg-white/5 p-5 cursor-pointer hover:shadow-lg transition-shadow border border-gray-200 dark:border-white/10"
                onClick={() => setExpandedId(expandedId === stage.id ? null : stage.id)}
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="text-accent">{stage.icon}</div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">{stage.title}</h3>
                  <div className="ml-auto text-slate-400">
                    {expandedId === stage.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{stage.shortDesc}</p>
                
                <AnimatePresence>
                  {expandedId === stage.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-gray-100 dark:border-white/10">
                        <ul className="space-y-2 mb-4">
                          {stage.details.map((detail, i) => (
                            <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start">
                              <span className="text-primary mr-2">•</span> {detail}
                            </li>
                          ))}
                        </ul>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleAskAI(stage.title); }}
                          className="w-full flex items-center justify-center gap-2 py-2 bg-primary/10 dark:bg-white/5 text-primary dark:text-white rounded-lg hover:bg-primary/20 transition-colors font-medium text-sm"
                        >
                          <MessageCircle size={16} /> Ask AI about this step
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button className="flex items-center gap-2 mx-auto px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-white/10 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
          <Download size={20} /> Download as PDF
        </button>
      </div>
    </div>
  );
}