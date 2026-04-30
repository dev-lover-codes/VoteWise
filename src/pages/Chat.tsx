import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { sendMessageToAI, SYSTEM_PROMPT } from '../lib/aiService';
import { saveMessage, getSessionMessages } from '../lib/supabase';
import { Send, Bot, User as UserIcon, PlusCircle, MessageSquare } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chat() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const guestLimit = 5;
  const [guestCount, setGuestCount] = useState(() => {
    return parseInt(localStorage.getItem('guest_chat_count') || '0', 10);
  });

  const SUGGESTIONS = [
    "How do I register to vote?",
    "What is NOTA?",
    "How does EVM work?",
    "What is Model Code of Conduct?",
    "Who is eligible to vote in India?"
  ];

  useEffect(() => {
    if (location.state?.initialMessage) {
      handleSend(location.state.initialMessage);
      // Clear state so it doesn't resend on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    if (!user && guestCount >= guestLimit) {
      toast.error('Guest limit reached. Please sign in to continue.');
      navigate('/auth');
      return;
    }

    const newUserMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setLoading(true);

    try {
      // Save user message
      await saveMessage(sessionId, 'user', text, user?.uid);

      const aiResponse = await sendMessageToAI([...messages, newUserMsg], SYSTEM_PROMPT);
      
      const newAiMsg = { role: 'assistant', content: aiResponse };
      setMessages(prev => [...prev, newAiMsg]);
      
      // Save AI message
      await saveMessage(sessionId, 'assistant', aiResponse, user?.uid);

      if (!user) {
        const newCount = guestCount + 1;
        setGuestCount(newCount);
        localStorage.setItem('guest_chat_count', newCount.toString());
      }
    } catch (error) {
      toast.error("AI is temporarily unavailable. Please try again.");
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I am having trouble connecting right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setSessionId(crypto.randomUUID());
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] max-w-6xl mx-auto w-full bg-white dark:bg-darkBg">
      {/* Sidebar - Desktop Only */}
      <div className="hidden md:flex flex-col w-64 border-r border-gray-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 p-4">
        <button 
          onClick={handleNewChat}
          className="flex items-center gap-2 w-full py-3 px-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors shadow-sm font-medium mb-6"
        >
          <PlusCircle size={18} /> New Chat
        </button>

        <div className="flex-grow overflow-y-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Recent Sessions</p>
          <div className="space-y-2">
            <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-gray-200 dark:bg-white/10 text-slate-800 dark:text-white text-sm font-medium text-left">
              <MessageSquare size={16} /> Current Session
            </button>
            {/* History mapping would go here if fetched from Supabase */}
          </div>
        </div>

        {!user && (
          <div className="p-4 bg-primary/10 dark:bg-white/5 rounded-xl border border-primary/20 dark:border-white/10 mt-4">
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
              Guest Mode: {guestLimit - guestCount} messages left
            </p>
            <button onClick={() => navigate('/auth')} className="w-full py-2 bg-primary text-white rounded-lg text-sm font-medium">
              Sign In for Unlimited
            </button>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-32">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <Bot size={32} />
              </div>
              <h2 className="text-2xl font-heading font-bold text-slate-800 dark:text-white mb-2">VoteWise Assistant</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-10">
                Ask me anything about Indian elections, voter registration, or the Model Code of Conduct.
              </p>
              
              <div className="flex flex-wrap justify-center gap-3 w-full">
                {SUGGESTIONS.map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSend(s)}
                    className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-slate-600 dark:text-slate-300 rounded-full text-sm hover:border-primary hover:text-primary dark:hover:text-blue-300 transition-colors shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto w-full">
              <AnimatePresence>
                {messages.map((m, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-white' : 'bg-primary text-white'}`}>
                      {m.role === 'user' ? <UserIcon size={18} /> : <Bot size={18} />}
                    </div>
                    <div className={`px-5 py-3 rounded-2xl max-w-[80%] ${
                      m.role === 'user' 
                        ? 'bg-primary text-white rounded-tr-sm' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-gray-200 dark:border-white/5'
                    }`}>
                      <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{m.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {loading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                    <Bot size={18} />
                  </div>
                  <div className="px-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 rounded-tl-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white via-white dark:from-darkBg dark:via-darkBg to-transparent pt-10 pb-6 px-4">
          <div className="max-w-3xl mx-auto relative flex items-center">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about elections..."
              className="w-full bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-white/10 rounded-full py-4 pl-6 pr-14 text-slate-900 dark:text-white focus:outline-none focus:border-primary dark:focus:border-primary shadow-lg transition-colors"
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="absolute right-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
            >
              <Send size={18} className="ml-1" />
            </button>
          </div>
          <p className="text-center text-xs text-slate-500 mt-3">
            VoteWise AI uses official ECI guidelines. For binding info, visit eci.gov.in
          </p>
        </div>
      </div>
    </div>
  );
}