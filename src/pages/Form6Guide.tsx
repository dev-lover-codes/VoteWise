import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { updateRegistrationStatus } from '../lib/supabase';
import { CheckCircle, Upload, User as UserIcon, FileText, CheckSquare, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Form6Guide() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    dob: '',
    address: '',
    ageProof: false,
    addressProof: false,
  });

  const handleComplete = async () => {
    if (!user) {
      toast.error('You need to be logged in to register.');
      navigate('/auth');
      return;
    }

    try {
      await updateRegistrationStatus(user.uid, 'Complete');
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B00', '#1B2F5E', '#1A6B3A']
      });

      toast.success('Registration simulated successfully!');
      setStep(4); // Success step
    } catch {
      toast.error('Failed to complete registration simulation.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-heading font-bold text-primary dark:text-white mb-4">
          Voter Registration Simulator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Learn how to fill out Form 6 to become a registered voter.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="flex items-center w-full max-w-2xl">
          {[1, 2, 3].map((s, idx) => (
            <div key={s} className="flex-1 flex flex-col items-center relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 transition-colors ${step >= s ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-slate-700 text-slate-500'}`}>
                {step > s ? <CheckCircle size={20} /> : s}
              </div>
              <span className={`mt-2 text-sm font-medium ${step >= s ? 'text-primary dark:text-white' : 'text-slate-400'}`}>
                {s === 1 ? 'Personal Details' : s === 2 ? 'Documents' : 'Review'}
              </span>
              {idx < 2 && (
                <div className={`absolute top-5 left-1/2 w-full h-1 -translate-y-1/2 transition-colors ${step > s ? 'bg-primary' : 'bg-gray-200 dark:bg-slate-700'}`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-8 max-w-2xl mx-auto">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <UserIcon className="text-primary" /> Step 1: Personal Details
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="full-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input id="full-name" type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none" placeholder="John Doe" />
              </div>
              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                <input id="dob" type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
                <textarea id="address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none" rows={3} placeholder="123 Main St, City, State"></textarea>
              </div>
              <button onClick={() => setStep(2)} disabled={!formData.name || !formData.dob || !formData.address} className="w-full py-3 bg-primary text-white rounded-xl font-medium disabled:opacity-50 mt-4 transition-colors">
                Continue to Documents
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Upload className="text-primary" /> Step 2: Document Checklist
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              In reality, you would upload scanned copies. For this simulation, just check the boxes.
            </p>
            <div className="space-y-4">
              <label className="flex items-center gap-4 p-4 border border-gray-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <input type="checkbox" checked={formData.ageProof} onChange={e => setFormData({...formData, ageProof: e.target.checked})} className="w-5 h-5 text-primary rounded focus:ring-primary" />
                <div>
                  <span className="block font-medium text-slate-800 dark:text-white">Age Proof Uploaded</span>
                  <span className="text-sm text-slate-500">Aadhar, PAN, Birth Certificate, etc.</span>
                </div>
              </label>
              <label className="flex items-center gap-4 p-4 border border-gray-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <input type="checkbox" checked={formData.addressProof} onChange={e => setFormData({...formData, addressProof: e.target.checked})} className="w-5 h-5 text-primary rounded focus:ring-primary" />
                <div>
                  <span className="block font-medium text-slate-800 dark:text-white">Address Proof Uploaded</span>
                  <span className="text-sm text-slate-500">Aadhar, Passport, Utility Bill, etc.</span>
                </div>
              </label>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-medium">Back</button>
              <button onClick={() => setStep(3)} disabled={!formData.ageProof || !formData.addressProof} className="flex-1 py-3 bg-primary text-white rounded-xl font-medium disabled:opacity-50">Review</button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <FileText className="text-primary" /> Step 3: Review & Submit
            </h2>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-gray-200 dark:border-slate-700 space-y-4 mb-8">
              <div className="flex justify-between border-b border-gray-200 dark:border-slate-700 pb-2">
                <span className="text-slate-500">Name</span>
                <span className="font-medium text-slate-800 dark:text-white">{formData.name}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-slate-700 pb-2">
                <span className="text-slate-500">DOB</span>
                <span className="font-medium text-slate-800 dark:text-white">{formData.dob}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-slate-700 pb-2">
                <span className="text-slate-500">Address</span>
                <span className="font-medium text-slate-800 dark:text-white text-right max-w-[200px] truncate">{formData.address}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-slate-500">Documents</span>
                <span className="font-medium text-success flex items-center gap-1"><CheckSquare size={16}/> Verified</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-medium">Back</button>
              <button onClick={handleComplete} className="flex-1 py-3 bg-success hover:bg-success/90 text-white rounded-xl font-medium shadow-lg transition-colors">Submit Form 6</button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
            <Award className="w-24 h-24 text-success mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Registration Complete!</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              You've successfully learned how to register to vote. Your profile has been updated with the "Certified Registrant" badge.
            </p>
            <button onClick={() => navigate('/profile')} className="px-8 py-3 bg-primary text-white rounded-xl font-medium shadow-md">
              Go to Dashboard
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}