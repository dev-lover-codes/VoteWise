import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Myths from '../pages/Myths';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import * as supabase from '../lib/supabase';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useAuth directly
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    signInWithGoogle: vi.fn(),
    signInWithEmail: vi.fn(),
    signUpWithEmail: vi.fn(),
    logOut: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock supabase functions
vi.mock('../lib/supabase', () => ({
  saveMyFeedback: vi.fn().mockResolvedValue({}),
}));

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Myths Component', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Myths />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('renders the myths page heading', () => {
    renderComponent();
    expect(screen.getByText(/Election Myths — Busted/i)).toBeInTheDocument();
  });

  it('renders a list of myths', () => {
    renderComponent();
    expect(screen.getByText(/EVMs can be hacked and votes can be changed/i)).toBeInTheDocument();
    expect(screen.getByText(/You can vote multiple times in the same election/i)).toBeInTheDocument();
  });

  it('expands a myth to show the truth when clicked', () => {
    renderComponent();
    const mythTitle = screen.getByText(/EVMs can be hacked and votes can be changed/i);
    fireEvent.click(mythTitle);
    expect(screen.getByText(/The Truth/i)).toBeInTheDocument();
    expect(screen.getByText(/EVMs \(Electronic Voting Machines\) are standalone, non-networked machines/i)).toBeInTheDocument();
  });

  it('handles feedback submission', async () => {
    renderComponent();
    const mythTitle = screen.getByText(/EVMs can be hacked and votes can be changed/i);
    fireEvent.click(mythTitle);
    
    const thumbsUpBtn = screen.getAllByRole('button').find(btn => btn.querySelector('svg')); // Simplified selector
    // Actually, let's just find by icon if possible or use a more specific way
    const buttons = screen.getAllByRole('button');
    // The thumbs up button is the first one in the feedback section
    fireEvent.click(buttons[0]); 
    
    await waitFor(() => {
      expect(supabase.saveMyFeedback).toHaveBeenCalled();
    });
  });

  it('navigates to chat when custom myth is submitted', () => {
    renderComponent();
    const input = screen.getByPlaceholderText(/Is it true that EVMs use internet\?/i);
    fireEvent.change(input, { target: { value: 'My custom myth' } });
    
    const askAiBtn = screen.getByText(/Ask AI/i);
    fireEvent.click(askAiBtn);
    
    expect(mockNavigate).toHaveBeenCalledWith('/chat', { state: { initialMessage: 'Is this a myth or fact? "My custom myth"' } });
  });
});
