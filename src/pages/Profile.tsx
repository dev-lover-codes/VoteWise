import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserStats, getQuizHistory, getUserProfile } from '../lib/supabase';
import { LogOut, User, Award, CheckCircle, BarChart3, Sun, Moon, BadgeCheck, Activity, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface QuizAttempt {
  id: string;
  quiz_topic: string;
  score: number;
  total_questions: number;
  percentage: number;
  completed_at: string;
}

interface UserProfile {
  registration_status?: string;
  has_voted?: boolean;
}

export default function Profile() {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ count: 0, avg: 0, best: 0 });
  const [history, setHistory] = useState<QuizAttempt[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    if (user) {
      getUserStats(user.uid).then(setStats);
      getQuizHistory(user.uid).then(setHistory);
      getUserProfile(user.uid).then(setUserProfile);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch {
      toast.error('Error logging out');
    }
  };

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setDarkMode(!darkMode);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold text-primary dark:text-white mb-8">Voter Dashboard</h1>
      
      {/* Progress Bar Section */}
      <div className="glass-card bg-white dark:bg-white/5 p-6 mb-8 border border-gray-200 dark:border-white/10">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Activity className="text-primary" size={20} /> Voter Education Progress
          </h3>
          <span className="font-bold text-accent">
            {Math.round(((userProfile?.registration_status === 'Complete' ? 1 : 0) + (userProfile?.has_voted ? 1 : 0) + (stats.count > 0 ? 1 : 0)) / 3 * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
          <div className="bg-primary h-3 rounded-full transition-all duration-1000" style={{ width: `${((userProfile?.registration_status === 'Complete' ? 1 : 0) + (userProfile?.has_voted ? 1 : 0) + (stats.count > 0 ? 1 : 0)) / 3 * 100}%` }}></div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card bg-white dark:bg-white/5 p-6 flex flex-col items-center justify-center text-center md:col-span-1">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Avatar" className="w-24 h-24 rounded-full mb-4 border-4 border-white dark:border-white/10 shadow-lg" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <User size={40} />
            </div>
          )}
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.displayName || 'User'}</h2>
          <p className="text-slate-500 mb-6">{user.email}</p>
          
          <div className="w-full space-y-3 mb-6">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Registration</span>
              <span className={`text-sm font-bold ${userProfile?.registration_status === 'Complete' ? 'text-success' : 'text-accent'}`}>
                {userProfile?.registration_status || 'Pending'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Badges Earned</span>
              <div className="flex gap-2">
                {userProfile?.registration_status === 'Complete' && <div title="Certified Registrant"><BadgeCheck className="text-primary" size={20} /></div>}
                {userProfile?.has_voted && <div title="Certified Voter"><Award className="text-success" size={20} /></div>}
                {stats.best >= 70 && <div title="Quiz Master"><Star className="text-accent" size={20} fill="currentColor" /></div>}
              </div>
            </div>
          </div>
          
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <LogOut size={18} /> Sign Out
          </button>
          
          <div className="mt-4 w-full pt-4 border-t border-gray-200 dark:border-white/10">
            <button onClick={toggleDarkMode} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              Toggle {darkMode ? 'Light' : 'Dark'} Mode
            </button>
          </div>
        </div>

        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <div className="glass-card bg-white dark:bg-white/5 p-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2 text-primary dark:text-blue-400">
              <CheckCircle size={24} />
              <h3 className="font-medium">Quizzes Taken</h3>
            </div>
            <p className="text-4xl font-bold text-slate-800 dark:text-white">{stats.count}</p>
          </div>
          
          <div className="glass-card bg-white dark:bg-white/5 p-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2 text-accent">
              <BarChart3 size={24} />
              <h3 className="font-medium">Average Score</h3>
            </div>
            <p className="text-4xl font-bold text-slate-800 dark:text-white">{Math.round(stats.avg)}%</p>
          </div>
          
          <div className="glass-card bg-white dark:bg-white/5 p-6 flex flex-col justify-center col-span-2">
            <div className="flex items-center gap-3 mb-2 text-success">
              <Award size={24} />
              <h3 className="font-medium">Best Score</h3>
            </div>
            <p className="text-4xl font-bold text-slate-800 dark:text-white">{stats.best}%</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-heading font-bold text-slate-800 dark:text-white mb-4">Quiz History</h2>
      
      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="glass-card bg-white dark:bg-white/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-lg text-slate-800 dark:text-white capitalize">{item.quiz_topic.replace('_', ' ')}</h4>
                <p className="text-sm text-slate-500">{new Date(item.completed_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-slate-500">Score</p>
                  <p className="font-bold text-primary dark:text-blue-300">{item.score} / {item.total_questions}</p>
                </div>
                <div className={`w-16 text-center py-1 rounded-lg font-bold ${
                  item.percentage >= 70 ? 'bg-success/20 text-success' : 
                  item.percentage >= 40 ? 'bg-accent/20 text-accent' : 
                  'bg-red-500/20 text-red-500'
                }`}>
                  {item.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white/50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
          <p className="text-slate-500">You haven't taken any quizzes yet.</p>
          <button onClick={() => navigate('/quiz')} className="mt-4 px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors">
            Take a Quiz
          </button>
        </div>
      )}
    </div>
  );
}