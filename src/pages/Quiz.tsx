import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { saveQuizAttempt } from '../lib/supabase';
import { ArrowRight, CheckCircle, XCircle, Award, Star, RefreshCcw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { QUIZ_CATEGORIES, type QuizCategory } from '../constants/quizData';

export default function Quiz() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeQuiz, setActiveQuiz] = useState<QuizCategory | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  const startQuiz = useCallback((category: QuizCategory) => {
    setActiveQuiz(category);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setQuizFinished(false);
    setStartTime(Date.now());
  }, []);

  const handleOptionSelect = (index: number) => {
    if (showExplanation) return; // Prevent changing answer after selection
    
    setSelectedOption(index);
    setShowExplanation(true);
    
    if (index === activeQuiz.questions[currentQIndex].correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = async () => {
    if (currentQIndex < activeQuiz.questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // Finish Quiz
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      setQuizFinished(true);
      
      if (user) {
        try {
          await saveQuizAttempt(user.uid, activeQuiz.id, score + (selectedOption === activeQuiz.questions[currentQIndex].correct ? 1 : 0), activeQuiz.questions.length, timeTaken);
          toast.success("Quiz results saved to profile!");
        } catch {
          toast.error("Failed to save quiz results");
        }
      }
    }
  };

  if (quizFinished) {
    const percentage = Math.round((score / activeQuiz.questions.length) * 100);
    const getFeedbackMessage = () => {
      if (percentage <= 40) return "Keep learning! Start with our Election Timeline.";
      if (percentage <= 70) return "Good effort! You know the basics. Explore more in our AI Chat.";
      return "Excellent! You're a VoteWise champion!";
    };

    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card max-w-md w-full p-8 text-center bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10"
        >
          <Award className="w-20 h-20 mx-auto text-accent mb-4" />
          <h2 className="text-3xl font-heading font-bold text-primary dark:text-white mb-2">Quiz Complete!</h2>
          <p className="text-slate-500 mb-6">{activeQuiz.title}</p>
          
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map(star => (
              <Star 
                key={star} 
                className={`w-10 h-10 ${percentage >= star * 33 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
              />
            ))}
          </div>

          <div className="text-6xl font-bold text-primary dark:text-white mb-4">
            {score}<span className="text-2xl text-slate-400">/{activeQuiz.questions.length}</span>
          </div>
          
          <div className="inline-block px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full font-bold text-lg mb-6 text-slate-700 dark:text-slate-300">
            {percentage}%
          </div>
          
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 font-medium">
            {getFeedbackMessage()}
          </p>

          <div className="space-y-3">
            <button 
              onClick={() => startQuiz(activeQuiz)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-md"
            >
              <RefreshCcw size={18} /> Retry Quiz
            </button>
            <button 
              onClick={() => setActiveQuiz(null)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Home size={18} /> Try Another Category
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (activeQuiz) {
    const question = activeQuiz.questions[currentQIndex];
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-heading font-bold text-primary dark:text-white">{activeQuiz.title}</h2>
            <p className="text-slate-500">Question {currentQIndex + 1} of {activeQuiz.questions.length}</p>
          </div>
          <button 
            onClick={() => setActiveQuiz(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            Quit
          </button>
        </div>

        <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-full h-2.5 mb-8">
          <div 
            className="bg-accent h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${((currentQIndex) / activeQuiz.questions.length) * 100}%` }}
          ></div>
        </div>

        <div className="glass-card bg-white dark:bg-white/5 p-6 md:p-8 border border-gray-200 dark:border-white/10 mb-6">
          <h3 className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-white mb-8">
            {question.q}
          </h3>

          <div className="space-y-4 mb-8">
            {question.options.map((opt: string, index: number) => {
              let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 text-lg font-medium ";
              
              if (!showExplanation) {
                btnClass += "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary/50 hover:bg-primary/5 cursor-pointer";
              } else {
                if (index === question.correct) {
                  btnClass += "bg-success/10 border-success text-success dark:text-green-400";
                } else if (index === selectedOption) {
                  btnClass += "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-600 dark:text-red-400";
                } else {
                  btnClass += "bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 opacity-60";
                }
              }

              return (
                <motion.button
                  whileHover={!showExplanation ? { scale: 1.01 } : {}}
                  whileTap={!showExplanation ? { scale: 0.99 } : {}}
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={btnClass}
                  disabled={showExplanation}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {showExplanation && index === question.correct && <CheckCircle className="text-success" />}
                    {showExplanation && index === selectedOption && index !== question.correct && <XCircle className="text-red-500" />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-primary/5 dark:bg-slate-800 rounded-xl border border-primary/10 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                <span className="font-bold text-primary dark:text-blue-400">Explanation: </span>
                {question.explanation}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-end">
          {showExplanation && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg"
            >
              {currentQIndex === activeQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              <ArrowRight size={20} />
            </motion.button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-5xl font-heading font-bold text-primary dark:text-white mb-4">
          Election Knowledge Quiz
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
          Test your understanding of the Indian electoral system. Choose a category below to start.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {QUIZ_CATEGORIES.map((category, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            key={category.id} 
            className="glass-card bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 flex flex-col hover:shadow-xl transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md ${
                category.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
                category.difficulty === 'Intermediate' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30' :
                'bg-red-100 text-red-700 dark:bg-red-900/30'
              }`}>
                {category.difficulty}
              </span>
              <span className="text-sm font-medium text-slate-500">{category.time}</span>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{category.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 flex-grow">{category.description}</p>
            
            <div className="text-sm text-slate-500 font-medium mb-6">
              {category.questions.length} Questions
            </div>

            <button 
              onClick={() => startQuiz(category)}
              className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              Start Quiz <ArrowRight size={18} />
            </button>
          </motion.div>
        ))}
      </div>
      
      {!user && (
        <div className="mt-12 text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-gray-200 dark:border-white/5 max-w-2xl mx-auto">
          <p className="text-slate-600 dark:text-slate-400">
            Want to track your scores and appear on the leaderboard?
          </p>
          <button onClick={() => navigate('/auth')} className="mt-4 px-6 py-2 bg-white dark:bg-slate-700 text-primary dark:text-white font-medium rounded-full shadow-sm hover:shadow-md transition-shadow">
            Sign In to Save Progress
          </button>
        </div>
      )}
    </div>
  );
}