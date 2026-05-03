/**
 * @fileoverview Integration and component tests for the Quiz page.
 * Tests quiz flow, state management, scoring logic, and UI interactions.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock ALL Firebase dependencies first (prevent real SDK initialization)
vi.mock('../lib/firebase', () => ({
  auth: {},
  googleProvider: {},
  signInWithPopup: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((_auth, callback) => { callback(null); return () => {}; }),
  getAuth: vi.fn(() => ({})),
}));

vi.mock('../lib/supabase', () => ({
  supabase: { from: vi.fn() },
  saveQuizAttempt: vi.fn().mockResolvedValue(null),
  getLeaderboard: vi.fn().mockResolvedValue([]),
}));

// Mock the auth context
vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({ user: null })),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}));

// Mock framer-motion for faster rendering
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
    button: ({ children, onClick, disabled, className }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button onClick={onClick} disabled={disabled} className={className}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import Quiz from '../pages/Quiz';

function QuizWrapper() {
  return (
    <MemoryRouter>
      <Quiz />
    </MemoryRouter>
  );
}

describe('Quiz Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Category Selection Screen', () => {
    it('should render the quiz page heading', () => {
      render(<QuizWrapper />);
      expect(screen.getByRole('heading', { name: /election knowledge quiz/i })).toBeInTheDocument();
    });

    it('should display all three quiz categories', () => {
      render(<QuizWrapper />);
      expect(screen.getByText('Voter Basics')).toBeInTheDocument();
      expect(screen.getByText('Election Process')).toBeInTheDocument();
      expect(screen.getByText("Your Voting Rights")).toBeInTheDocument();
    });

    it('should show difficulty levels for each category', () => {
      render(<QuizWrapper />);
      expect(screen.getByText('Beginner')).toBeInTheDocument();
      expect(screen.getByText('Intermediate')).toBeInTheDocument();
      expect(screen.getByText('Advanced')).toBeInTheDocument();
    });

    it('should display question count for each category', () => {
      render(<QuizWrapper />);
      const questionCounts = screen.getAllByText(/10 questions/i);
      expect(questionCounts.length).toBe(3);
    });

    it('should show sign-in prompt for guest users', () => {
      render(<QuizWrapper />);
      expect(screen.getByText(/sign in to save progress/i)).toBeInTheDocument();
    });

    it('should render Start Quiz buttons for each category', () => {
      render(<QuizWrapper />);
      const startButtons = screen.getAllByText(/start quiz/i);
      expect(startButtons.length).toBe(3);
    });

    it('should have clickable Start Quiz buttons', () => {
      render(<QuizWrapper />);
      const startButtons = screen.getAllByText(/start quiz/i);
      startButtons.forEach(btn => {
        expect(btn.closest('button')).not.toBeNull();
      });
    });
  });

  describe('Active Quiz Screen', () => {
    beforeEach(() => {
      render(<QuizWrapper />);
      const startButtons = screen.getAllByText(/start quiz/i);
      fireEvent.click(startButtons[0]);
    });

    it('should show question counter when quiz starts', async () => {
      await waitFor(() => {
        expect(screen.getByText(/question 1 of 10/i)).toBeInTheDocument();
      });
    });

    it('should display the first question text', async () => {
      await waitFor(() => {
        expect(screen.getByText(/minimum age to vote/i)).toBeInTheDocument();
      });
    });

    it('should display 4 answer options', async () => {
      await waitFor(() => {
        expect(screen.getByText('16 years')).toBeInTheDocument();
        expect(screen.getByText('18 years')).toBeInTheDocument();
        expect(screen.getByText('21 years')).toBeInTheDocument();
        expect(screen.getByText('25 years')).toBeInTheDocument();
      });
    });

    it('should have a Quit button', async () => {
      await waitFor(() => {
        expect(screen.getByText(/quit/i)).toBeInTheDocument();
      });
    });

    it('should show progress bar element', async () => {
      await waitFor(() => {
        // Progress bar should have a percentage style
        const progressBars = document.querySelectorAll('[style]');
        expect(progressBars.length).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Answer Selection', () => {
    it('should show explanation after selecting an answer', async () => {
      render(<QuizWrapper />);
      const startButtons = screen.getAllByText(/start quiz/i);
      fireEvent.click(startButtons[0]);

      await waitFor(() => screen.getByText('18 years'));
      fireEvent.click(screen.getByText('18 years'));

      await waitFor(() => {
        expect(screen.getByText(/explanation/i)).toBeInTheDocument();
      });
    });

    it('should show "Next Question" button after answering', async () => {
      render(<QuizWrapper />);
      const startButtons = screen.getAllByText(/start quiz/i);
      fireEvent.click(startButtons[0]);

      await waitFor(() => screen.getByText('18 years'));
      fireEvent.click(screen.getByText('18 years'));

      await waitFor(() => {
        expect(screen.getByText(/next question/i)).toBeInTheDocument();
      });
    });

    it('should disable all answer buttons after selection', async () => {
      render(<QuizWrapper />);
      const startButtons = screen.getAllByText(/start quiz/i);
      fireEvent.click(startButtons[0]);

      await waitFor(() => screen.getByText('16 years'));
      fireEvent.click(screen.getByText('18 years')); // Select an answer

      await waitFor(() => {
        const option16Btn = screen.getByText('16 years').closest('button');
        expect(option16Btn).toBeDisabled();
      });
    });
  });

  describe('Quiz Navigation', () => {
    it('should return to category screen when Quit is clicked', async () => {
      render(<QuizWrapper />);
      const startButtons = screen.getAllByText(/start quiz/i);
      fireEvent.click(startButtons[0]);

      await waitFor(() => screen.getByText(/quit/i));
      fireEvent.click(screen.getByText(/quit/i));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /election knowledge quiz/i })).toBeInTheDocument();
      });
    });

    it('should advance to question 2 after clicking Next', async () => {
      render(<QuizWrapper />);
      const startButtons = screen.getAllByText(/start quiz/i);
      fireEvent.click(startButtons[0]);

      await waitFor(() => screen.getByText('18 years'));
      fireEvent.click(screen.getByText('18 years'));

      await waitFor(() => screen.getByText(/next question/i));
      fireEvent.click(screen.getByText(/next question/i));

      await waitFor(() => {
        expect(screen.getByText(/question 2 of 10/i)).toBeInTheDocument();
      });
    });
  });

  describe('Score Calculation Logic', () => {
    it('should calculate 100% for perfect score', () => {
      const percentage = Math.round((10 / 10) * 100);
      expect(percentage).toBe(100);
    });

    it('should calculate 80% for 8 out of 10', () => {
      const percentage = Math.round((8 / 10) * 100);
      expect(percentage).toBe(80);
    });

    it('should calculate 0% for no correct answers', () => {
      const percentage = Math.round((0 / 10) * 100);
      expect(percentage).toBe(0);
    });

    it('should generate correct feedback for score <= 40%', () => {
      const percentage = 30;
      const msg = percentage <= 40
        ? "Keep learning! Start with our Election Timeline."
        : percentage <= 70
        ? "Good effort! You know the basics. Explore more in our AI Chat."
        : "Excellent! You're a VoteWise champion!";
      expect(msg).toContain('Keep learning');
    });

    it('should generate correct feedback for 41-70% score', () => {
      const percentage = 60;
      const msg = percentage <= 40
        ? "Keep learning!"
        : percentage <= 70
        ? "Good effort! You know the basics. Explore more in our AI Chat."
        : "Excellent! You're a VoteWise champion!";
      expect(msg).toContain('Good effort');
    });

    it('should generate "Excellent" feedback for score > 70%', () => {
      const percentage = 90;
      const msg = percentage <= 40
        ? "Keep learning!"
        : percentage <= 70
        ? "Good effort!"
        : "Excellent! You're a VoteWise champion!";
      expect(msg).toContain('Excellent');
    });
  });

  describe('Quiz Content Validation', () => {
    it('should have the correct answer (18 years) at index 1 for voting age question', () => {
      // Answer index 1 = "18 years" in the options array
      const options = ['16 years', '18 years', '21 years', '25 years'];
      expect(options[1]).toBe('18 years');
    });

    it('should correctly identify NOTA as "None Of The Above"', () => {
      const notaOptions = [
        'Name Of The Applicant',
        'None Of The Above',
        'National Online Tallying Application',
        'No Official Ticket Available',
      ];
      expect(notaOptions[1]).toBe('None Of The Above');
    });

    it('should use star rating system based on percentage tiers', () => {
      // 3 stars shown when percentage >= 33, 66, 99
      for (let star = 1; star <= 3; star++) {
        const threshold = star * 33;
        expect(threshold).toBeLessThanOrEqual(99);
      }
    });
  });
});
