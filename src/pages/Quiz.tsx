import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { saveQuizAttempt } from '../lib/supabase';
import { ArrowRight, CheckCircle, XCircle, Award, Star, RefreshCcw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Question {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizCategory {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  time: string;
  questions: Question[];
}

const QUIZ_CATEGORIES: QuizCategory[] = [
  {
    id: "voter_basics",
    title: "Voter Basics",
    description: "Covers registration, eligibility, and basic IDs.",
    difficulty: "Beginner",
    time: "5 min",
    questions: [
      {
        q: "What is the minimum age to vote in India?",
        options: ["16 years", "18 years", "21 years", "25 years"],
        correct: 1,
        explanation: "The Constitution of India sets the minimum voting age at 18 years."
      },
      {
        q: "What document is used as the primary voter identity in India?",
        options: ["Aadhar Card", "PAN Card", "EPIC (Voter ID Card)", "Passport"],
        correct: 2,
        explanation: "EPIC stands for Electors Photo Identity Card, issued by ECI."
      },
      {
        q: "Which form is filled to register as a new voter?",
        options: ["Form 6", "Form 7", "Form 8", "Form 9"],
        correct: 0,
        explanation: "Form 6 is used to enroll as a new voter or to add your name to the electoral roll."
      },
      {
        q: "Where can you check your name on the voter list?",
        options: ["eci.gov.in", "india.gov.in", "aadhar.gov.in", "rbi.gov.in"],
        correct: 0,
        explanation: "The official ECI website eci.gov.in lets you search your voter registration status."
      },
      {
        q: "What is the Voter Helpline number in India?",
        options: ["100", "1090", "1950", "1800"],
        correct: 2,
        explanation: "1950 is the national Voter Helpline number managed by ECI."
      },
      {
        q: "Can a Non-Resident Indian (NRI) vote in Indian elections?",
        options: ["No, NRIs cannot vote", "Yes, they can vote from abroad", "Yes, but only in person at their registered constituency", "Only in Presidential elections"],
        correct: 2,
        explanation: "NRIs can vote but must be physically present in India at their registered constituency on voting day."
      },
      {
        q: "How many times can a voter vote in a single election?",
        options: ["As many times as they wish", "Twice", "Once", "Depends on their state"],
        correct: 2,
        explanation: "Each registered voter can cast their vote only once per election."
      },
      {
        q: "What is the NVSP portal used for?",
        options: ["Checking election results", "National Voter Service Portal for voter registration services", "Paying election taxes", "Filing nomination papers"],
        correct: 1,
        explanation: "NVSP (National Voters Service Portal) at nvsp.in is the one-stop portal for all voter registration services."
      },
      {
        q: "Which authority maintains the electoral rolls in India?",
        options: ["State Government", "Prime Minister's Office", "Election Commission of India", "Supreme Court"],
        correct: 2,
        explanation: "The Election Commission of India (ECI) is the constitutional authority responsible for maintaining electoral rolls."
      },
      {
        q: "What happens if your name is not on the electoral roll on voting day?",
        options: ["You can vote with Aadhar card", "You cannot vote", "You can vote with a court order", "You can add your name on the spot"],
        correct: 1,
        explanation: "If your name is not on the electoral roll, you cannot vote. Registration must be done before the deadline."
      }
    ]
  },
  {
    id: "election_process",
    title: "Election Process",
    description: "Covers EVM, VVPAT, counting, and election timeline.",
    difficulty: "Intermediate",
    time: "5 min",
    questions: [
      {
        q: "What does EVM stand for?",
        options: ["Electronic Voting Module", "Electronic Voting Machine", "Electoral Vote Manager", "Electronic Vote Monitor"],
        correct: 1,
        explanation: "EVM stands for Electronic Voting Machine, used in Indian elections since 2004 nationwide."
      },
      {
        q: "What is VVPAT?",
        options: ["Voter Verified Paper Audit Trail", "Virtual Voter Paper Audit Technology", "Verified Voting Paper Audit Test", "Voter Verified Public Audit Trail"],
        correct: 0,
        explanation: "VVPAT shows a paper slip to the voter confirming their vote after pressing the EVM button."
      },
      {
        q: "How many hours before voting day does campaigning officially stop?",
        options: ["12 hours", "24 hours", "48 hours", "72 hours"],
        correct: 2,
        explanation: "Under the Model Code of Conduct, all campaigning must stop 48 hours before the voting date."
      },
      {
        q: "What is the Model Code of Conduct?",
        options: ["A law passed by Parliament", "A set of guidelines issued by ECI for parties and candidates during elections", "Rules for journalists covering elections", "Code of conduct for EVM manufacturers"],
        correct: 1,
        explanation: "The Model Code of Conduct (MCC) is a set of guidelines issued by ECI that political parties and candidates must follow during election time."
      },
      {
        q: "Who is the Returning Officer?",
        options: ["The winner of the election", "An official appointed by ECI to oversee elections in a constituency", "The Chief Election Commissioner", "The District Collector who counts votes"],
        correct: 1,
        explanation: "The Returning Officer is the government official responsible for conducting elections in a particular constituency."
      },
      {
        q: "What percentage of votes can trigger an election recount request?",
        options: ["Any margin", "Less than 1%", "Less than 5%", "The rules vary by state"],
        correct: 0,
        explanation: "A candidate can request a recount regardless of the margin, subject to payment of a prescribed fee."
      },
      {
        q: "What color ink is used to mark the voter's finger after voting?",
        options: ["Black", "Blue", "Indelible violet/purple", "Red"],
        correct: 2,
        explanation: "Indelible ink (a violet/purple-colored ink that cannot be easily removed) is applied to the left index finger."
      },
      {
        q: "What is the minimum number of voters required to form a polling station?",
        options: ["100", "500", "1000", "1500"],
        correct: 3,
        explanation: "As per ECI guidelines, a polling station typically serves a maximum of 1500 electors."
      },
      {
        q: "Can independent candidates contest in Lok Sabha elections?",
        options: ["No", "Yes, without any restrictions", "Yes, but only if they were previously in a political party", "Yes, but they need a certain number of proposers"],
        correct: 3,
        explanation: "Yes, independent candidates can contest but must submit a nomination with the required number of proposers from the constituency."
      },
      {
        q: "How is the winning candidate determined in a constituency election in India?",
        options: ["Proportional representation", "First-Past-The-Post system", "Ranked choice voting", "Two-round system"],
        correct: 1,
        explanation: "India uses the First-Past-The-Post (FPTP) system — the candidate with the most votes wins, even without a majority."
      }
    ]
  },
  {
    id: "voting_rights",
    title: "Your Voting Rights",
    description: "Covers constitutional rights, NOTA, and legal aspects.",
    difficulty: "Advanced",
    time: "5 min",
    questions: [
      {
        q: "What is NOTA?",
        options: ["Name Of The Applicant", "None Of The Above", "National Online Tallying Application", "No Official Ticket Available"],
        correct: 1,
        explanation: "NOTA (None Of The Above) was introduced in 2013 by the Supreme Court order, allowing voters to reject all candidates."
      },
      {
        q: "Does pressing NOTA affect the election result if it gets the most votes?",
        options: ["Yes, a re-election is held", "No, the candidate with the next highest votes still wins", "Yes, all candidates are disqualified", "The constituency remains unrepresented"],
        correct: 1,
        explanation: "Currently, even if NOTA gets the most votes, the candidate with the highest votes among contestants wins. NOTA has no power to void an election."
      },
      {
        q: "Is voting in India compulsory?",
        options: ["Yes, it is compulsory by law everywhere", "No, it is a right, not a duty", "Yes in some states like Gujarat", "Only for government employees"],
        correct: 2,
        explanation: "Voting is not compulsory in most of India, but Gujarat and a few other states have local laws encouraging compulsory voting in local body elections."
      },
      {
        q: "Under what Article of the Constitution is the Election Commission of India established?",
        options: ["Article 72", "Article 324", "Article 356", "Article 226"],
        correct: 1,
        explanation: "Article 324 of the Indian Constitution establishes the Election Commission of India and grants it superintendence of elections."
      },
      {
        q: "What is the Right to Vote in India classified as?",
        options: ["Fundamental Right", "Constitutional Right", "Statutory Right under Representation of People Act", "Natural Right"],
        correct: 2,
        explanation: "The right to vote in India is a statutory right under the Representation of the People Act, 1951 — not a Fundamental Right under Part III of the Constitution."
      },
      {
        q: "Can a person in judicial custody vote?",
        options: ["Yes", "No", "Only if released on bail", "Only in state elections"],
        correct: 2,
        explanation: "A person in judicial custody (under-trial) can vote only if released on bail on voting day and their name is on the voter list."
      },
      {
        q: "What is the 'silent period' during elections?",
        options: ["When candidates are not allowed to speak publicly", "48 hours before polling when no campaigning is allowed", "The period between announcement and nomination filing", "The counting period"],
        correct: 1,
        explanation: "The 48 hours before voting begins is called the 'silence period' or 'silence zone' when all campaign activities must stop."
      },
      {
        q: "Who appoints the Chief Election Commissioner of India?",
        options: ["The Prime Minister", "The President of India", "The Parliament", "The Supreme Court"],
        correct: 1,
        explanation: "The Chief Election Commissioner (CEC) is appointed by the President of India on the advice of a selection committee."
      },
      {
        q: "What is the security deposit amount for a general category Lok Sabha candidate?",
        options: ["Rs 10,000", "Rs 25,000", "Rs 50,000", "Rs 1,00,000"],
        correct: 1,
        explanation: "The security deposit for Lok Sabha candidates is Rs 25,000 for general category and Rs 12,500 for SC/ST candidates."
      },
      {
        q: "When was the voting age in India reduced from 21 to 18 years?",
        options: ["1947", "1952", "1989", "2000"],
        correct: 2,
        explanation: "The 61st Constitutional Amendment Act of 1988 (in effect from 1989) reduced the voting age from 21 to 18 years."
      }
    ]
  }
];

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