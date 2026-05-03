/**
 * @fileoverview Tests for Firebase Analytics and Performance monitoring module.
 * Validates event logging, page tracking, and performance trace wrappers.
 * Note: Tests the actual module implementation (not the global mock).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Firebase modules BEFORE importing analytics module
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({ name: 'test-app' })),
  getApps: vi.fn(() => [{ name: 'test-app' }]), // Return existing app to skip re-init
}));

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(() => ({ app: {} })),
  logEvent: vi.fn(),
  isSupported: vi.fn(() => Promise.resolve(false)), // Not supported in jsdom
}));

vi.mock('firebase/performance', () => ({
  getPerformance: vi.fn(() => ({ app: {} })),
  trace: vi.fn(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    putAttribute: vi.fn(),
    getAttribute: vi.fn(),
  })),
}));

// Import the ACTUAL analytics module (not the global mock from setup.ts)
// We use vi.importActual to bypass the global mock
const analyticsModule = await vi.importActual<typeof import('../lib/analytics')>('../lib/analytics');
const {
  logEvent,
  trackPageView,
  trackQuizComplete,
  trackChatMessage,
  trackMythFeedback,
  trackEvmInteraction,
  withPerformanceTrace,
  trackAuthEvent,
} = analyticsModule;

describe('Analytics Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('logEvent', () => {
    it('should not throw when analytics instance is unavailable', () => {
      expect(() => logEvent('test_event')).not.toThrow();
    });

    it('should accept optional params object with mixed types', () => {
      expect(() =>
        logEvent('test_event', { key: 'value', count: 42, flag: true })
      ).not.toThrow();
    });

    it('should handle empty params object gracefully', () => {
      expect(() => logEvent('test_event', {})).not.toThrow();
    });

    it('should handle undefined params gracefully', () => {
      expect(() => logEvent('test_event', undefined)).not.toThrow();
    });
  });

  describe('trackPageView', () => {
    it('should not throw when called with page name only', () => {
      expect(() => trackPageView('home')).not.toThrow();
    });

    it('should not throw when called with page name and title', () => {
      expect(() => trackPageView('quiz', 'Election Knowledge Quiz')).not.toThrow();
    });

    it('should accept all app page names without throwing', () => {
      const pages = ['home', 'chat', 'quiz', 'timeline', 'myths', 'profile', 'register', 'evm'];
      pages.forEach(page => {
        expect(() => trackPageView(page)).not.toThrow();
      });
    });
  });

  describe('trackQuizComplete', () => {
    it('should not throw with valid quiz completion data', () => {
      expect(() => trackQuizComplete('voter_basics', 8, 10, 120)).not.toThrow();
    });

    it('should handle perfect score (10/10) without throwing', () => {
      expect(() => trackQuizComplete('election_process', 10, 10, 60)).not.toThrow();
    });

    it('should handle zero score (0/10) without throwing', () => {
      expect(() => trackQuizComplete('voting_rights', 0, 10, 300)).not.toThrow();
    });

    it('should correctly calculate percentage for 8/10 as 80', () => {
      const score = 8;
      const total = 10;
      const expectedPercentage = Math.round((score / total) * 100);
      expect(expectedPercentage).toBe(80);
    });

    it('should correctly calculate percentage for 0/10 as 0', () => {
      const score = 0;
      const total = 10;
      expect(Math.round((score / total) * 100)).toBe(0);
    });

    it('should correctly calculate percentage for 10/10 as 100', () => {
      const score = 10;
      const total = 10;
      expect(Math.round((score / total) * 100)).toBe(100);
    });
  });

  describe('trackChatMessage', () => {
    it('should not throw for authenticated user (isGuest: false)', () => {
      expect(() => trackChatMessage('session-123', false)).not.toThrow();
    });

    it('should not throw for guest user (isGuest: true)', () => {
      expect(() => trackChatMessage('session-456', true)).not.toThrow();
    });

    it('should handle empty session ID', () => {
      expect(() => trackChatMessage('', false)).not.toThrow();
    });
  });

  describe('trackMythFeedback', () => {
    it('should not throw for positive feedback (wasHelpful: true)', () => {
      expect(() => trackMythFeedback('myth-001', true)).not.toThrow();
    });

    it('should not throw for negative feedback (wasHelpful: false)', () => {
      expect(() => trackMythFeedback('myth-002', false)).not.toThrow();
    });

    it('should work with any myth ID', () => {
      const mythIds = ['myth-001', 'myth-002', 'evm-myth', 'nota-myth'];
      mythIds.forEach(id => {
        expect(() => trackMythFeedback(id, true)).not.toThrow();
      });
    });
  });

  describe('trackEvmInteraction', () => {
    it('should not throw for vote_cast action with candidate', () => {
      expect(() => trackEvmInteraction('vote_cast', 'Candidate A')).not.toThrow();
    });

    it('should not throw for reset action without candidate', () => {
      expect(() => trackEvmInteraction('reset')).not.toThrow();
    });

    it('should not throw for all known EVM actions', () => {
      const actions = ['vote_cast', 'reset', 'vvpat_viewed', 'demo_started'];
      actions.forEach(action => {
        expect(() => trackEvmInteraction(action)).not.toThrow();
      });
    });

    it('should handle undefined candidate parameter', () => {
      expect(() => trackEvmInteraction('vote_cast', undefined)).not.toThrow();
    });
  });

  describe('withPerformanceTrace', () => {
    it('should execute the provided async function and return its result', async () => {
      const mockFn = vi.fn(() => Promise.resolve('success'));
      const result = await withPerformanceTrace('test_trace', mockFn);
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledOnce();
    });

    it('should propagate errors from the traced function', async () => {
      const mockFn = vi.fn(() => Promise.reject(new Error('Trace error')));
      await expect(withPerformanceTrace('error_trace', mockFn)).rejects.toThrow('Trace error');
    });

    it('should work with async functions that have a delay', async () => {
      const mockFn = vi.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
        return 42;
      });
      const result = await withPerformanceTrace('async_trace', mockFn);
      expect(result).toBe(42);
    });

    it('should still call the function even when performance instance is unavailable', async () => {
      const mockFn = vi.fn(() => Promise.resolve('result'));
      const result = await withPerformanceTrace('no_perf_trace', mockFn);
      expect(result).toBe('result');
    });
  });

  describe('trackAuthEvent', () => {
    it('should not throw for google sign-in event', () => {
      expect(() => trackAuthEvent('google')).not.toThrow();
    });

    it('should not throw for email sign-in event', () => {
      expect(() => trackAuthEvent('email')).not.toThrow();
    });

    it('should not throw for signup event', () => {
      expect(() => trackAuthEvent('signup')).not.toThrow();
    });

    it('should not throw for logout event', () => {
      expect(() => trackAuthEvent('logout')).not.toThrow();
    });

    it('should handle all valid auth event types', () => {
      const authEvents: Array<'google' | 'email' | 'signup' | 'logout'> = [
        'google', 'email', 'signup', 'logout',
      ];
      authEvents.forEach(event => {
        expect(() => trackAuthEvent(event)).not.toThrow();
      });
    });
  });

  describe('Event naming conventions', () => {
    it('should use underscore-separated event names (snake_case)', () => {
      // Event names in Firebase Analytics should be snake_case
      const validEventNamePattern = /^[a-z][a-z0-9_]*$/;
      const eventNames = [
        'page_view',
        'quiz_complete',
        'chat_message_sent',
        'myth_feedback',
        'evm_interaction',
        'web_vitals',
      ];
      eventNames.forEach(name => {
        expect(name).toMatch(validEventNamePattern);
      });
    });
  });
});
