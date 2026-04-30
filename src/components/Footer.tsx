import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white/50 dark:bg-darkBg border-t border-gray-200 dark:border-white/10 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">V</div>
          <span className="font-heading font-semibold text-primary dark:text-white">VoteWise</span>
        </div>
        <div className="text-center md:text-left">
          Powered by ECI guidelines | Built for PromptWars 2026
        </div>
      </div>
    </footer>
  );
}