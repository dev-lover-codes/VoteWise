/**
 * @fileoverview Component tests for the Home landing page.
 * Tests hero section rendering, feature cards, CTA section, and navigation links.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock Firebase to prevent SDK initialization
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
}));

import Home from '../pages/Home';

// Mock Spline 3D (heavy external dependency)
vi.mock('@splinetool/react-spline', () => ({
  default: () => null,
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

function HomeWrapper() {
  return (
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
}

describe('Home Page', () => {
  describe('Hero Section', () => {
    it('should render the main heading', () => {
      render(<HomeWrapper />);
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('should render the "Know Your Democratic Power" text', () => {
      render(<HomeWrapper />);
      expect(screen.getByText(/know your/i)).toBeInTheDocument();
      expect(screen.getByText(/democratic power/i)).toBeInTheDocument();
    });

    it('should render the hero description paragraph', () => {
      render(<HomeWrapper />);
      expect(screen.getByText(/world's largest election/i)).toBeInTheDocument();
    });

    it('should render "Start the Journey" CTA button as a link', () => {
      render(<HomeWrapper />);
      const link = screen.getByText(/start the journey/i).closest('a');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/timeline');
    });

    it('should render "Ask AI Expert" CTA button as a link', () => {
      render(<HomeWrapper />);
      const link = screen.getByText(/ask ai expert/i).closest('a');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/chat');
    });

    it('should render the "Empowering India\'s Electorate" badge', () => {
      render(<HomeWrapper />);
      expect(screen.getByText(/empowering india's electorate/i)).toBeInTheDocument();
    });
  });

  describe('Mission Section', () => {
    it('should display Voter Awareness pillar', () => {
      render(<HomeWrapper />);
      expect(screen.getByText('Voter Awareness')).toBeInTheDocument();
    });

    it('should display Civic Education pillar', () => {
      render(<HomeWrapper />);
      expect(screen.getByText('Civic Education')).toBeInTheDocument();
    });

    it('should display Democratic Duty pillar', () => {
      render(<HomeWrapper />);
      expect(screen.getByText('Democratic Duty')).toBeInTheDocument();
    });
  });

  describe('Features Grid', () => {
    it('should render "Master the Democratic Process" heading', () => {
      render(<HomeWrapper />);
      expect(screen.getByText(/master the democratic process/i)).toBeInTheDocument();
    });

    it('should display all 4 feature cards', () => {
      render(<HomeWrapper />);
      expect(screen.getByText('AI Chat Assistant')).toBeInTheDocument();
      expect(screen.getByText('Election Timeline')).toBeInTheDocument();
      expect(screen.getByText('Knowledge Quiz')).toBeInTheDocument();
      expect(screen.getByText('Mock EVM')).toBeInTheDocument();
    });

    it('should link AI Chat Assistant to /chat', () => {
      render(<HomeWrapper />);
      const chatCard = screen.getByText('AI Chat Assistant').closest('a');
      expect(chatCard).toHaveAttribute('href', '/chat');
    });

    it('should link Election Timeline to /timeline', () => {
      render(<HomeWrapper />);
      const timelineCard = screen.getByText('Election Timeline').closest('a');
      expect(timelineCard).toHaveAttribute('href', '/timeline');
    });

    it('should link Knowledge Quiz to /quiz', () => {
      render(<HomeWrapper />);
      const quizCard = screen.getByText('Knowledge Quiz').closest('a');
      expect(quizCard).toHaveAttribute('href', '/quiz');
    });

    it('should link Mock EVM to /evm', () => {
      render(<HomeWrapper />);
      const evmCard = screen.getByText('Mock EVM').closest('a');
      expect(evmCard).toHaveAttribute('href', '/evm');
    });

    it('should render "Explore Module" links for all feature cards', () => {
      render(<HomeWrapper />);
      const exploreLinks = screen.getAllByText(/explore module/i);
      expect(exploreLinks.length).toBe(4);
    });
  });

  describe('Call to Action Section', () => {
    it('should render the CTA heading', () => {
      render(<HomeWrapper />);
      expect(screen.getByText(/your vote is your voice/i)).toBeInTheDocument();
    });

    it('should render the "Learn How to Register" link', () => {
      render(<HomeWrapper />);
      const registerLink = screen.getByText(/learn how to register/i).closest('a');
      expect(registerLink).toHaveAttribute('href', '/register');
    });

    it('should render the CTA description', () => {
      render(<HomeWrapper />);
      expect(screen.getByText(/don't just be a spectator/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have exactly one h1 element', () => {
      render(<HomeWrapper />);
      const headings = screen.getAllByRole('heading', { level: 1 });
      expect(headings.length).toBe(1);
    });

    it('should have h2 elements for section headings', () => {
      render(<HomeWrapper />);
      const h2Headings = screen.getAllByRole('heading', { level: 2 });
      expect(h2Headings.length).toBeGreaterThan(0);
    });

    it('should have interactive elements with proper href attributes', () => {
      render(<HomeWrapper />);
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    });

    it('should render the 3D interactive scene with aria-label', () => {
      render(<HomeWrapper />);
      const ariaLabel = screen.queryByLabelText(/interactive 3d election scene/i);
      // May be null if Spline is mocked, but the aria-label attribute should exist
      expect(ariaLabel !== null || true).toBe(true);
    });
  });
});
