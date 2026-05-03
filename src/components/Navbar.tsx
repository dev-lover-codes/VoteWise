import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User } from 'lucide-react';

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Timeline', path: '/timeline' },
    { name: 'Quiz', path: '/quiz' },
    { name: 'Myths', path: '/myths' },
    { name: 'Register', path: '/register' },
    { name: 'Mock EVM', path: '/evm' },
    { name: 'Chat AI', path: '/chat' }
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-darkBg/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">V</div>
              <span className="font-heading font-bold text-xl text-primary dark:text-white">VoteWise</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors hover:text-accent ${location.pathname === link.path ? 'text-accent' : 'text-slate-600 dark:text-slate-300'}`}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <Link to="/profile" className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary dark:bg-white/10 dark:text-white hover:bg-primary/20 transition-colors">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full" />
                ) : (
                  <User size={18} />
                )}
                <span className="font-medium text-sm truncate max-w-[100px]">{user.displayName || 'Profile'}</span>
              </Link>
            ) : (
              <Link to="/auth" className="px-5 py-2 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-md">
                Login
              </Link>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-300 p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-darkBg border-b border-gray-200 dark:border-white/10 absolute w-full left-0 shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md font-medium ${location.pathname === link.path ? 'bg-primary/10 text-accent' : 'text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 mt-2 border-t border-gray-200 dark:border-white/10">
              {user ? (
                <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md font-medium text-primary dark:text-white hover:bg-primary/10 dark:hover:bg-white/5">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
                  ) : (
                    <User size={20} />
                  )}
                  {user.displayName || 'Profile'}
                </Link>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)} className="block text-center w-full px-5 py-2 rounded-full bg-primary text-white font-medium hover:bg-primary/90">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}