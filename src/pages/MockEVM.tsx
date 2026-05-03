import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { updateVotingStatus } from '../lib/supabase';
import { CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

const PARTIES = [
  { id: 'A', name: 'Democratic Alliance (DA)', symbol: '🐘' },
  { id: 'B', name: 'Progressive Front (PF)', symbol: '🦁' },
  { id: 'C', name: 'United Citizens Party (UCP)', symbol: '🦅' },
  { id: 'NOTA', name: 'None of the Above (NOTA)', symbol: '🚫' },
];

export default function MockEVM() {
  const { user } = useAuth();
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedParty, setSelectedParty] = useState<any>(null);
  
  const playBeep = () => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 800; // Beep frequency
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1);
  };

  const handleVote = async (party: any) => {
    if (hasVoted) return;

    playBeep();
    setSelectedParty(party);
    setHasVoted(true);

    if (user) {
      try {
        await updateVotingStatus(user.uid, true);
        toast.success("Vote recorded successfully!");
      } catch (err) {
        console.error(err);
      }
    }

    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#FF6B00', '#FFFFFF', '#1A6B3A']
      });
    }, 1500); // Trigger confetti after VVPAT animation
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-heading font-bold text-primary dark:text-white mb-4">
          "Cast Your Vote" Simulator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
          Experience how to use an Electronic Voting Machine (EVM) and verify your choice via VVPAT.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-12 w-full justify-center items-start">
        
        {/* EVM Machine */}
        <div className="bg-gray-200 dark:bg-slate-800 p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border-4 border-gray-300 dark:border-slate-700 w-full max-w-md relative">
          <div className="text-center mb-6 border-b-2 border-gray-400 dark:border-slate-600 pb-2">
            <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-widest">Ballot Unit</h3>
          </div>
          
          <div className="space-y-3">
            {PARTIES.map((party, index) => (
              <div key={party.id} className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-lg border border-gray-300 dark:border-slate-600">
                <div className="w-8 font-bold text-slate-500">{index + 1}</div>
                <div className="w-12 h-12 flex items-center justify-center text-3xl bg-slate-100 dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700">
                  {party.symbol}
                </div>
                <div className="flex-1 font-semibold text-slate-800 dark:text-white">
                  {party.name}
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 border-gray-400 dark:border-slate-600 ${hasVoted && selectedParty?.id === party.id ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-gray-800 dark:bg-black'}`}></div>
                  <button 
                    onClick={() => handleVote(party)}
                    disabled={hasVoted}
                    className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 border-4 border-blue-300 dark:border-blue-900 shadow-inner transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center text-xs font-bold text-slate-500 uppercase flex justify-between px-4">
            <span>Ready</span>
            <div className={`w-3 h-3 rounded-full ${!hasVoted ? 'bg-green-500 shadow-[0_0_8px_green]' : 'bg-gray-800'}`}></div>
          </div>
        </div>

        {/* VVPAT Machine */}
        <div className="bg-gray-300 dark:bg-slate-800 p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border-4 border-gray-400 dark:border-slate-700 w-full max-w-sm flex flex-col items-center">
           <div className="text-center mb-6 w-full border-b-2 border-gray-400 dark:border-slate-600 pb-2">
            <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-widest">VVPAT</h3>
          </div>

          <div className="w-48 h-64 bg-black rounded-lg border-8 border-gray-800 relative overflow-hidden flex justify-center">
            {/* The transparent glass window */}
            <div className="absolute inset-0 bg-white/10 z-10 pointer-events-none backdrop-blur-[1px]"></div>
            
            {/* Receipt Animation */}
            <AnimatePresence>
              {hasVoted && (
                <motion.div
                  initial={{ y: -200, opacity: 0 }}
                  animate={{ y: 20, opacity: 1 }}
                  exit={{ y: 200, opacity: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="w-36 h-48 bg-white border border-gray-200 flex flex-col items-center justify-center p-4 shadow-sm"
                >
                  <div className="text-4xl mb-2">{selectedParty?.symbol}</div>
                  <div className="font-bold text-black text-center text-sm mb-1">{selectedParty?.name}</div>
                  <div className="text-xs text-gray-500 font-mono">Serial: 00{PARTIES.findIndex(p => p.id === selectedParty?.id) + 1}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {hasVoted && (
            <motion.div 
              initial={{ opacity: 0, marginTop: 0 }} 
              animate={{ opacity: 1, marginTop: 24 }} 
              className="text-center mt-6 bg-success/20 px-4 py-3 rounded-xl border border-success/30 flex flex-col items-center"
            >
              <CheckCircle2 className="text-success w-8 h-8 mb-2" />
              <p className="font-bold text-success">Your vote has been securely recorded.</p>
              <p className="text-sm text-success/80 mt-1">This is a mock confirmation.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}