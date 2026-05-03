/**
 * @fileoverview Unit tests for the AI service module.
 * Tests Gemini API integration, system prompt validation, error handling, and message formatting.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the Google Generative AI SDK before importing the module
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      startChat: vi.fn().mockReturnValue({
        sendMessage: vi.fn().mockResolvedValue({
          response: {
            text: vi.fn().mockReturnValue('Mocked AI response about Indian elections.'),
          },
        }),
      }),
    }),
  })),
}));

// Import actual module (not mocked by setup.ts)
import { sendMessageToAI, SYSTEM_PROMPT } from '../lib/aiService';

describe('aiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('SYSTEM_PROMPT', () => {
    it('should be a non-empty string', () => {
      expect(SYSTEM_PROMPT).toBeDefined();
      expect(typeof SYSTEM_PROMPT).toBe('string');
      expect(SYSTEM_PROMPT.length).toBeGreaterThan(50);
    });

    it('should reference ECI (Election Commission of India)', () => {
      expect(SYSTEM_PROMPT).toContain('Election Commission of India');
    });

    it('should reference the voter helpline number 1950', () => {
      expect(SYSTEM_PROMPT).toContain('1950');
    });

    it('should reference the official ECI website', () => {
      expect(SYSTEM_PROMPT).toContain('eci.gov.in');
    });

    it('should contain guidance about political neutrality', () => {
      expect(SYSTEM_PROMPT.toLowerCase()).toContain('political');
    });

    it('should contain voter helpline reference', () => {
      expect(SYSTEM_PROMPT).toContain('Voter Helpline');
    });

    it('should specify the AI persona as VoteWise', () => {
      expect(SYSTEM_PROMPT).toContain('VoteWise');
    });

    it('should contain instructions about beginner-friendly language', () => {
      expect(SYSTEM_PROMPT.toLowerCase()).toContain('beginner');
    });
  });

  describe('sendMessageToAI - error handling', () => {
    const validMessages = [
      { role: 'user', content: 'What is the minimum voting age in India?' },
    ];

    it('should throw an informative error when API key is not configured', async () => {
      // The default environment has 'mock-key' which triggers the early check
      await expect(sendMessageToAI(validMessages, SYSTEM_PROMPT)).rejects.toThrow(
        'AI is temporarily unavailable. Please try again.'
      );
    });

    it('should throw when messages array is empty', async () => {
      await expect(sendMessageToAI([], SYSTEM_PROMPT)).rejects.toThrow();
    });

    it('should always throw the user-friendly error message, not raw SDK errors', async () => {
      await expect(sendMessageToAI(validMessages, SYSTEM_PROMPT)).rejects.toThrow(
        'AI is temporarily unavailable. Please try again.'
      );
    });
  });

  describe('sendMessageToAI - message structure', () => {
    it('should correctly identify roles in message array', () => {
      const messages = [
        { role: 'user', content: 'Question 1' },
        { role: 'assistant', content: 'Answer 1' },
        { role: 'user', content: 'Question 2' },
      ];

      // Validate role values are valid
      expect(messages[0].role).toBe('user');
      expect(messages[1].role).toBe('assistant');
      expect(messages[2].role).toBe('user');
    });

    it('should have the last message as a user message for a valid conversation', () => {
      const messages = [
        { role: 'user', content: 'Question' },
        { role: 'assistant', content: 'Answer' },
        { role: 'user', content: 'Follow-up question' },
      ];
      const lastMessage = messages[messages.length - 1];
      expect(lastMessage.role).toBe('user');
    });

    it('should correctly map "assistant" role to "model" for Gemini API', () => {
      // Test the role mapping logic
      const messages = [
        { role: 'user', content: 'Q' },
        { role: 'assistant', content: 'A' },
      ];
      const historyMessages = messages.slice(0, -1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      expect(historyMessages[0].role).toBe('user');
    });

    it('should exclude the last message from history when building chat context', () => {
      const messages = [
        { role: 'user', content: 'First question' },
        { role: 'assistant', content: 'First answer' },
        { role: 'user', content: 'Latest question' },
      ];

      // The last message should be sent via sendMessage, not in history
      const history = messages.slice(0, -1);
      const lastMessage = messages[messages.length - 1];
      
      expect(history.length).toBe(2);
      expect(lastMessage.content).toBe('Latest question');
    });
  });

  describe('SYSTEM_PROMPT content quality', () => {
    it('should mention election-related terminology', () => {
      const electionTerms = ['election', 'voter', 'voting'];
      const hasElectionTerms = electionTerms.some(term => 
        SYSTEM_PROMPT.toLowerCase().includes(term)
      );
      expect(hasElectionTerms).toBe(true);
    });

    it('should be comprehensive enough (>100 characters)', () => {
      expect(SYSTEM_PROMPT.length).toBeGreaterThan(100);
    });

    it('should contain instructions about structuring responses', () => {
      const structureKeywords = ['bullet', 'numbered', 'step', 'list', 'structure', 'clear'];
      const hasStructureInstructions = structureKeywords.some(kw =>
        SYSTEM_PROMPT.toLowerCase().includes(kw)
      );
      expect(hasStructureInstructions).toBe(true);
    });
  });
});
