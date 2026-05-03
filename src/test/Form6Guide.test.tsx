import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Form6Guide from '../pages/Form6Guide';
import { BrowserRouter } from 'react-router-dom';
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

// Mock useAuth
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test-user-id', displayName: 'Test User' },
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

describe('Form6Guide Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(supabase.updateRegistrationStatus).mockResolvedValue(null);
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <Form6Guide />
      </BrowserRouter>
    );
  };

  it('renders the registration simulator heading', () => {
    renderComponent();
    expect(screen.getByText(/Voter Registration Simulator/i)).toBeInTheDocument();
  });

  it('navigates through the steps of the registration process', async () => {
    renderComponent();
    
    // Step 1: Personal Details
    expect(screen.getByText(/Step 1: Personal Details/i)).toBeInTheDocument();
    
    const nameInput = screen.getByPlaceholderText(/John Doe/i);
    const dobInput = screen.getByLabelText(/Date of Birth/i);
    const addressInput = screen.getByPlaceholderText(/123 Main St, City, State/i);
    
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.change(dobInput, { target: { value: '1990-01-01' } });
    fireEvent.change(addressInput, { target: { value: '456 Elm St' } });
    
    const continueBtn = screen.getByText(/Continue to Documents/i);
    expect(continueBtn).not.toBeDisabled();
    
    fireEvent.click(continueBtn);
    
    // Step 2: Documents
    expect(await screen.findByRole('heading', { name: /Step 2: Document Checklist/i })).toBeInTheDocument();
    
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);
    
    const reviewBtn = screen.getByRole('button', { name: /^Review$/i });
    fireEvent.click(reviewBtn);
    
    // Step 3: Review
    expect(await screen.findByText(/Review & Submit/i)).toBeInTheDocument();
    
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    
    const submitBtn = screen.getByText(/Submit Form 6/i);
    fireEvent.click(submitBtn);
    
    // Step 4: Success
    expect(await screen.findByText(/Registration Complete!/i)).toBeInTheDocument();
    expect(supabase.updateRegistrationStatus).toHaveBeenCalledWith('test-user-id', 'Complete');
  });
});
