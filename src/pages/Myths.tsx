import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ThumbsUp, ThumbsDown, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { saveMyFeedback } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const MYTHS = [
  {
    id: "myth_1",
    myth: "EVMs can be hacked and votes can be changed",
    truth: "EVMs (Electronic Voting Machines) are standalone, non-networked machines. They do not have Bluetooth, Wi-Fi, or internet capabilities, making them completely safe from remote hacking. Multiple mock polls and sealing procedures ensure tampering is impossible."
  },
  {
    id: "myth_2",
    myth: "If you press NOTA and it wins, the election is cancelled",
    truth: "Currently, NOTA (None Of The Above) has no electoral value in determining the winner. Even if NOTA receives the highest number of votes, the candidate with the next highest votes is declared the winner."
  },
  {
    id: "myth_3",
    myth: "You can vote multiple times in the same election",
    truth: "Indelible ink is applied to your finger when you vote, which cannot be washed off for several weeks. ECI also uses advanced de-duplication software to remove duplicate entries from the electoral roll."
  },
  {
    id: "myth_4",
    myth: "Voter ID is the only valid ID to vote",
    truth: "While EPIC (Voter ID) is preferred, the ECI allows 11 other alternative photo identity documents (like Aadhar, PAN Card, Passport, Driving License, etc.) provided your name is already on the electoral roll."
  },
  {
    id: "myth_5",
    myth: "NRIs can vote from abroad online",
    truth: "NRIs (Non-Resident Indians) are eligible to vote, but there is no online voting. They must be physically present at their registered polling booth in India on the day of voting."
  },
  {
    id: "myth_6",
    myth: "Your vote is not secret — the government can see who you voted for",
    truth: "Voting is completely secret. EVMs do not record the voter's identity alongside the vote. The VVPAT slip drops into a sealed box and cannot be taken home."
  },
  {
    id: "myth_7",
    myth: "If NOTA wins, a re-election is held",
    truth: "This is false. The Supreme Court mandated NOTA so voters can express dissatisfaction, but under current laws, it does not trigger a re-election. The runner-up candidate is declared the winner."
  },
  {
    id: "myth_8",
    myth: "First time voters don't need to register if they turn 18 by voting day",
    truth: "You must proactively register using Form 6. You cannot just show up at a polling booth with an age proof. Registration must be complete and your name must be on the electoral roll."
  }
];

export default function Myths() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, boolean>>({});
  const [customMyth, setCustomMyth] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFeedback = async (mythId: string, isHelpful: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    if (feedbackGiven[mythId]) return;
    
    try {
      await saveMyFeedback(user?.uid || null, mythId, isHelpful);
      setFeedbackGiven(prev => ({ ...prev, [mythId]: true }));
      toast.success("Thank you for your feedback!");
    } catch (error) {
      toast.error("Failed to save feedback.");
    }
  };

  const handleCustomMythSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMyth.trim()) return;
    navigate('/chat', { state: { initialMessage: `Is this a myth or fact? "${customMyth}"` } });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary dark:text-white mb-4">
          Election Myths — Busted
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Separate fact from fiction with information straight from the Election Commission.
        </p>
      </div>

      <div className="space-y-6 mb-12">
        {MYTHS.map((item, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            key={item.id}
          >
            <div 
              className="glass-card bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 overflow-hidden cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            >
              <div className="p-6">
                <div className="flex gap-4 items-start">
                  <div className="mt-1 flex-shrink-0">
                    <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-red-600 bg-red-100 dark:bg-red-900/30 rounded-md">
                      False
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-slate-800 dark:text-white flex-grow">
                    "{item.myth}"
                  </h3>
                  <div className="text-slate-400">
                    {expandedId === item.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === item.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10">
                        <div className="flex items-start gap-3">
                          <ShieldAlert className="text-success mt-1 flex-shrink-0" size={20} />
                          <div>
                            <h4 className="font-bold text-success mb-1">The Truth</h4>
                            <p className="text-slate-700 dark:text-slate-300">{item.truth}</p>
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-3 text-sm">
                          <span className="text-slate-500 mr-2">Was this helpful?</span>
                          <button 
                            disabled={feedbackGiven[item.id]}
                            onClick={(e) => handleFeedback(item.id, true, e)}
                            className={`p-2 rounded-full transition-colors ${feedbackGiven[item.id] ? 'text-success bg-success/10' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                          >
                            <ThumbsUp size={18} />
                          </button>
                          <button 
                            disabled={feedbackGiven[item.id]}
                            onClick={(e) => handleFeedback(item.id, false, e)}
                            className={`p-2 rounded-full transition-colors ${feedbackGiven[item.id] ? 'text-slate-300' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                          >
                            <ThumbsDown size={18} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card bg-primary/5 dark:bg-white/5 p-8 text-center border border-primary/20 dark:border-white/10">
        <h3 className="text-xl font-bold text-primary dark:text-white mb-2">Have another myth in mind?</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Ask our AI assistant directly to verify any election information.</p>
        
        <form onSubmit={handleCustomMythSubmit} className="max-w-xl mx-auto flex gap-2">
          <input 
            type="text" 
            value={customMyth}
            onChange={(e) => setCustomMyth(e.target.value)}
            placeholder="e.g. Is it true that EVMs use internet?" 
            className="flex-grow px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button 
            type="submit"
            className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <MessageSquare size={18} /> Ask AI
          </button>
        </form>
      </div>
    </div>
  );
}