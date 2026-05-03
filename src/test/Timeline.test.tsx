import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Timeline from '../pages/Timeline';
import { BrowserRouter } from 'react-router-dom';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock jsPDF
vi.mock('jspdf', () => ({
  jsPDF: vi.fn().mockImplementation(() => ({
    setFontSize: vi.fn(),
    setTextColor: vi.fn(),
    text: vi.fn(),
    setDrawColor: vi.fn(),
    line: vi.fn(),
    save: vi.fn(),
    autoTable: vi.fn(),
  })),
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Timeline Component', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <Timeline />
      </BrowserRouter>
    );
  };

  it('renders the timeline heading', () => {
    renderComponent();
    expect(screen.getByText(/India's Election/i)).toBeInTheDocument();
    expect(screen.getByText(/Journey/i)).toBeInTheDocument();
  });

  it('renders all timeline stages', () => {
    renderComponent();
    expect(screen.getByText('Election Notification')).toBeInTheDocument();
    expect(screen.getByText('Voting Day')).toBeInTheDocument();
    expect(screen.getByText('Vote Counting & Results')).toBeInTheDocument();
  });

  it('expands a stage when clicked', () => {
    renderComponent();
    const stage = screen.getByText('Election Notification');
    fireEvent.click(stage);
    expect(screen.getByText(/The Election Commission of India \(ECI\) announces the complete schedule/i)).toBeInTheDocument();
  });

  it('toggles filter between Lok Sabha and Vidhan Sabha', () => {
    renderComponent();
    const vidhanSabhaBtn = screen.getByText('Vidhan Sabha');
    fireEvent.click(vidhanSabhaBtn);
    expect(vidhanSabhaBtn).toHaveClass('bg-primary');
    
    const lokSabhaBtn = screen.getByText('Lok Sabha');
    fireEvent.click(lokSabhaBtn);
    expect(lokSabhaBtn).toHaveClass('bg-primary');
  });

  it('navigates to chat with pre-filled message when "Ask AI" is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Election Notification'));
    const askAiBtn = screen.getByText(/Ask AI about this step/i);
    fireEvent.click(askAiBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/chat', expect.any(Object));
  });

  it('triggers PDF download when download button is clicked', () => {
    renderComponent();
    const downloadBtn = screen.getByText(/DOWNLOAD GUIDE PDF/i);
    fireEvent.click(downloadBtn);
    // Since we mocked jsPDF, we just check if it was called (via proxy or side effects if we had a more complex mock)
    // For now, we just ensure it doesn't crash
  });
});
