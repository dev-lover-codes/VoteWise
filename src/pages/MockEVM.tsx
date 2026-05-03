import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { updateVotingStatus } from '../lib/supabase';
import { CheckCircle2, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import { Howl } from 'howler';

interface Party {
  id: string;
  name: string;
  symbol: string;
}

const PARTIES: Party[] = [
  { id: 'A', name: 'Democratic Alliance (DA)', symbol: '🐘' },
  { id: 'B', name: 'Progressive Front (PF)', symbol: '🦁' },
  { id: 'C', name: 'United Citizens Party (UCP)', symbol: '🦅' },
  { id: 'NOTA', name: 'None of the Above (NOTA)', symbol: '🚫' },
];

// Pre-load beep sound
const beepSound = new Howl({
  src: ['https://actions.google.com/sounds/v1/alarms/beep_short.ogg'],
  volume: 0.5
});

export default function MockEVM() {
  const { user } = useAuth();
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleVote = useCallback((party: Party) => {
    if (hasVoted || isProcessing) return;

    setIsProcessing(true);
    beepSound.play();
    setSelectedParty(party);
    
    // Simulate processing time
    setTimeout(async () => {
      setHasVoted(true);
      setIsProcessing(false);

      if (user) {
        try {
          await updateVotingStatus(user.uid, true);
        } catch (err) {
          console.error(err);
        }
      }

      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#FF9933', '#FFFFFF', '#138808'] // Indian flag colors
        });
        toast.success("Vote securely recorded!");
      }, 1000);
    }, 1500);
  }, [hasVoted, isProcessing, user]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col items-center">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary dark:text-accent font-medium text-sm mb-4"
        >
          <Volume2 size={16} />
          Interactive Simulator
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-primary dark:text-white mb-4 tracking-tight">
          Mock <span className="text-accent">EVM</span> Simulator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
          Experience the Indian voting process. Cast your vote on the Ballot Unit and verify it on the VVPAT screen.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 w-full justify-center items-stretch">
        
        {/* EVM Machine (Ballot Unit) */}
        <div className="bg-gray-200 dark:bg-slate-800 p-8 rounded-[2rem] shadow-2xl border-b-[12px] border-gray-400 dark:border-slate-900 w-full max-w-md relative flex flex-col">
          <div className="text-center mb-8 bg-slate-300 dark:bg-slate-700 py-3 rounded-xl border border-slate-400 dark:border-slate-600 shadow-inner">
            <h3 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-[0.2em] text-sm">Ballot Unit</h3>
          </div>
          
          <div className="space-y-4 flex-grow">
            {PARTIES.map((party, index) => (
              <div key={party.id} className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-300 dark:border-slate-700 shadow-sm transition-all">
                <div className="w-8 font-mono font-bold text-slate-400">{String(index + 1).padStart(2, '0')}</div>
                <div className="w-14 h-14 flex items-center justify-center text-4xl bg-slate-50 dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 shadow-inner">
                  {party.symbol}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-800 dark:text-white leading-tight">
                    {party.name}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 transition-all duration-300 ${hasVoted && selectedParty?.id === party.id ? 'bg-red-600 shadow-[0_0_15px_#ef4444]' : 'bg-slate-800'}`}></div>
                  <button 
                    onClick={() => handleVote(party)}
                    disabled={hasVoted || isProcessing}
                    aria-label={`Vote for ${party.name}`}
                    className={`w-14 h-14 rounded-full flex flex-col items-center justify-center text-[10px] font-black tracking-tighter transition-all duration-200
                      ${hasVoted || isProcessing 
                        ? 'bg-slate-400 cursor-not-allowed opacity-50' 
                        : 'bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-lg hover:shadow-blue-500/20 text-white'
                      }`}
                  >
                    VOTE
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between items-center bg-slate-300 dark:bg-slate-700 p-4 rounded-2xl border border-slate-400 dark:border-slate-600">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full transition-all duration-500 ${!hasVoted && !isProcessing ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-slate-500'}`}></div>
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Ready</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest text-right">Busy</span>
              <div className={`w-4 h-4 rounded-full transition-all duration-500 ${isProcessing ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-slate-500'}`}></div>
            </div>
          </div>
        </div>

        {/* VVPAT Machine */}
        <div className="bg-gray-300 dark:bg-slate-800 p-8 rounded-[2rem] shadow-2xl border-b-[12px] border-gray-400 dark:border-slate-900 w-full max-w-sm flex flex-col">
           <div className="text-center mb-8 bg-slate-400 dark:bg-slate-700 py-3 rounded-xl border border-slate-500 dark:border-slate-600 shadow-inner">
            <h3 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-[0.2em] text-sm">VVPAT Unit</h3>
          </div>

          <div className="flex-grow flex flex-col items-center justify-center">
            <div className="w-56 h-72 bg-[#1a1a1a] rounded-2xl border-[12px] border-[#2a2a2a] relative overflow-hidden flex justify-center shadow-inner">
              {/* Glass reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent z-20 pointer-events-none"></div>
              
              {/* Internal light */}
              <div className={`absolute inset-0 transition-colors duration-1000 ${selectedParty ? 'bg-amber-500/5' : 'bg-transparent'}`}></div>

              {/* Receipt Animation */}
              <AnimatePresence>
                {selectedParty && (
                  <motion.div
                    initial={{ y: -300, opacity: 0 }}
                    animate={{ y: 30, opacity: 1 }}
                    exit={{ y: 300, opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    className="w-40 h-56 bg-white border border-gray-200 flex flex-col items-center justify-center p-6 shadow-2xl"
                  >
                    <div className="text-5xl mb-4 grayscale">{selectedParty?.symbol}</div>
                    <div className="font-black text-black text-center text-xs uppercase tracking-tighter mb-2 border-y border-black/10 py-2 w-full">{selectedParty?.name}</div>
                    <div className="text-[10px] text-gray-400 font-mono mt-auto">ID: {selectedParty?.id}00{PARTIES.findIndex(p => p.id === selectedParty?.id) + 1}</div>
                    <div className="text-[8px] text-gray-300 font-mono mt-1 italic">VVPAT VERIFIED</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <p className="mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Verify your vote slip above</p>
          </div>

          {hasVoted && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="text-center mt-8 bg-success/10 p-5 rounded-2xl border border-success/20 flex flex-col items-center shadow-lg"
            >
              <CheckCircle2 className="text-success w-10 h-10 mb-3" />
              <p className="font-bold text-success text-lg">Vote Recorded</p>
              <p className="text-xs text-success/70 mt-1">Thank you for participating in this mock democratic process.</p>
            </motion.div>
          )}
        </div>
      </div>

      <div className="mt-16 max-w-2xl text-center">
        <h4 className="font-bold text-slate-800 dark:text-white mb-2 italic">How it works:</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          In a real election, after you press the blue button on the Ballot Unit, a red light glows next to your choice and a long beep is heard. Simultaneously, the VVPAT prints a slip showing your candidate's serial number, name, and symbol, which is visible for 7 seconds before falling into a sealed box.
        </p>
      </div>
    </div>
  );
}