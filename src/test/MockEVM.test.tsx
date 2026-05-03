import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MockEVM from '../pages/MockEVM';
import * as supabase from '../lib/supabase';

// Mock useAuth
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test-user-id' },
    loading: false,
    signInWithGoogle: async () => {},
    signInWithEmail: async () => {},
    signUpWithEmail: async () => {},
    logOut: async () => {},
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Automock supabase
vi.mock('../lib/supabase');

describe('MockEVM Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(supabase.updateVotingStatus).mockResolvedValue(null);
  });

  it('renders the EVM simulator heading', () => {
    render(<MockEVM />);
    expect(screen.getByRole('heading', { name: /Mock EVM Simulator/i })).toBeInTheDocument();
  });

  it('renders all parties in the ballot unit', () => {
    render(<MockEVM />);
    expect(screen.getByText('Democratic Alliance (DA)')).toBeInTheDocument();
    expect(screen.getByText('Progressive Front (PF)')).toBeInTheDocument();
    expect(screen.getByText('None of the Above (NOTA)')).toBeInTheDocument();
  });

  it('allows a user to cast a vote', async () => {
    vi.useFakeTimers();
    render(<MockEVM />);
    
    const voteBtn = screen.getByLabelText(/Vote for Democratic Alliance \(DA\)/i);
    fireEvent.click(voteBtn);
    
    // Should show busy state
    expect(screen.getByText('Busy')).toBeInTheDocument();
    
    // Fast forward for the vote processing (1500ms)
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });
    
    // Should show vote recorded
    expect(screen.getByText('Vote Recorded')).toBeInTheDocument();
    expect(supabase.updateVotingStatus).toHaveBeenCalled();
    
    vi.useRealTimers();
  });

  it('disables voting buttons after a vote is cast', async () => {
    vi.useFakeTimers();
    render(<MockEVM />);
    
    const voteBtn = screen.getByLabelText(/Vote for Democratic Alliance \(DA\)/i);
    fireEvent.click(voteBtn);
    
    // Buttons should be disabled immediately
    expect(voteBtn).toBeDisabled();
    
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });
    
    // Still disabled after vote recorded
    expect(voteBtn).toBeDisabled();
    
    vi.useRealTimers();
  });
});
