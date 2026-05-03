/**
 * @fileoverview Unit tests for Supabase data access layer.
 * Tests all database operations, error handling, and return value contracts.
 * Uses proper mock chains that replicate the Supabase query builder pattern.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// =====================================================
// Mock Supabase JS client BEFORE importing our module
// This must be hoisted by vitest before module loading
// =====================================================

// Reusable mock functions for the query builder chain
const mocks = vi.hoisted(() => ({
  mockFrom: vi.fn(),
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: mocks.mockFrom,
  })),
}));

// Now import the actual functions (which will use the mocked client)
import {
  saveMessage,
  getSessionMessages,
  saveQuizAttempt,
  getUserStats,
  saveMyFeedback,
  getLeaderboard,
  getQuizHistory,
  updateRegistrationStatus,
  updateVotingStatus,
  getUserProfile,
} from '../lib/supabase';

describe('supabase data layer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================
  // Helper to build mock chain
  // ============================
  function createSelectMock(response: unknown = { data: [], error: null }) {
    const mockSingle = vi.fn().mockResolvedValue(response);
    const mockOrderChain = vi.fn().mockResolvedValue(response);
    const mockLimitChain = vi.fn().mockResolvedValue(response);
    const mockOrderWithLimit = vi.fn().mockReturnValue({ limit: mockLimitChain });
    const mockEqChain = vi.fn().mockReturnValue({
      single: mockSingle,
      order: mockOrderChain,
    });
    const mockSelect = vi.fn().mockReturnValue({
      eq: mockEqChain,
      order: mockOrderWithLimit,
    });

    mocks.mockFrom.mockReturnValue({ select: mockSelect });
    return { mockSelect, mockEqChain, mockSingle, mockOrderChain, mockLimitChain };
  }

  function createUpdateMock(response: unknown = { data: null, error: null }) {
    const mockEq = vi.fn().mockResolvedValue(response);
    const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
    mocks.mockFrom.mockReturnValue({ update: mockUpdate });
    return { mockUpdate, mockEq };
  }

  // ============================
  // saveMessage tests
  // ============================
  describe('saveMessage', () => {
    it('should call insert with all required fields', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
      mocks.mockFrom.mockReturnValue({ insert: mockInsert });

      await saveMessage('session-123', 'user', 'Hello world', 'user-456');

      expect(mockInsert).toHaveBeenCalledWith([
        expect.objectContaining({
          session_id: 'session-123',
          role: 'user',
          message: 'Hello world',
          user_id: 'user-456',
        }),
      ]);
    });

    it('should pass null user_id when userId is null (guest user)', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
      mocks.mockFrom.mockReturnValue({ insert: mockInsert });

      await saveMessage('session-123', 'user', 'Guest message', null);

      expect(mockInsert).toHaveBeenCalledWith([
        expect.objectContaining({ user_id: null }),
      ]);
    });

    it('should not throw on database error', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ data: null, error: { message: 'DB Error' } });
      mocks.mockFrom.mockReturnValue({ insert: mockInsert });

      await expect(saveMessage('session-123', 'user', 'Test', null)).resolves.not.toThrow();
    });

    it('should target the "chat_history" table', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
      mocks.mockFrom.mockReturnValue({ insert: mockInsert });

      await saveMessage('session-123', 'assistant', 'AI reply', null);

      expect(mocks.mockFrom).toHaveBeenCalledWith('chat_history');
    });

    it('should save assistant messages correctly', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
      mocks.mockFrom.mockReturnValue({ insert: mockInsert });

      await saveMessage('session-1', 'assistant', 'AI response', 'uid-123');

      expect(mockInsert).toHaveBeenCalledWith([
        expect.objectContaining({ role: 'assistant' }),
      ]);
    });
  });

  // ============================
  // getSessionMessages tests
  // ============================
  describe('getSessionMessages', () => {
    it('should query the "chat_history" table', async () => {
      createSelectMock({ data: [], error: null });
      await getSessionMessages('session-123');
      expect(mocks.mockFrom).toHaveBeenCalledWith('chat_history');
    });

    it('should return an empty array when no messages exist', async () => {
      createSelectMock({ data: [], error: null });
      const result = await getSessionMessages('session-123');
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    it('should return empty array on error', async () => {
      createSelectMock({ data: null, error: { message: 'DB error' } });
      const result = await getSessionMessages('session-123');
      expect(result).toEqual([]);
    });
  });

  // ============================
  // saveQuizAttempt tests
  // ============================
  describe('saveQuizAttempt', () => {
    it('should insert with correctly calculated percentage', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
      mocks.mockFrom.mockReturnValue({ insert: mockInsert });

      await saveQuizAttempt('user-123', 'voter_basics', 8, 10, 120);

      expect(mockInsert).toHaveBeenCalledWith([
        expect.objectContaining({
          user_id: 'user-123',
          quiz_topic: 'voter_basics',
          score: 8,
          total_questions: 10,
          percentage: 80,
          time_taken_seconds: 120,
        }),
      ]);
    });

    it('should calculate 100% for a perfect score', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
      mocks.mockFrom.mockReturnValue({ insert: mockInsert });

      await saveQuizAttempt('user-123', 'voter_basics', 10, 10, 60);

      expect(mockInsert).toHaveBeenCalledWith([
        expect.objectContaining({ percentage: 100 }),
      ]);
    });

    it('should calculate 0% for a zero score', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
      mocks.mockFrom.mockReturnValue({ insert: mockInsert });

      await saveQuizAttempt('user-123', 'voter_basics', 0, 10, 300);

      expect(mockInsert).toHaveBeenCalledWith([
        expect.objectContaining({ percentage: 0 }),
      ]);
    });

    it('should target the "quiz_attempts" table', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
      mocks.mockFrom.mockReturnValue({ insert: mockInsert });

      await saveQuizAttempt('user-123', 'election_process', 7, 10, 180);

      expect(mocks.mockFrom).toHaveBeenCalledWith('quiz_attempts');
    });
  });

  // ============================
  // getUserStats tests
  // ============================
  describe('getUserStats', () => {
    it('should return zeros when user has no quiz history', async () => {
      const mockEq = vi.fn().mockResolvedValue({ data: [], error: null });
      mocks.mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({ eq: mockEq }),
      });

      const stats = await getUserStats('user-123');
      expect(stats).toEqual({ count: 0, avg: 0, best: 0 });
    });

    it('should return zeros on database error', async () => {
      const mockEq = vi.fn().mockResolvedValue({ data: null, error: { message: 'Error' } });
      mocks.mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({ eq: mockEq }),
      });

      const stats = await getUserStats('user-123');
      expect(stats).toEqual({ count: 0, avg: 0, best: 0 });
    });

    it('should correctly calculate count, avg, and best from data', async () => {
      const mockData = [
        { score: 8, percentage: 80 },
        { score: 9, percentage: 90 },
        { score: 7, percentage: 70 },
      ];
      const mockEq = vi.fn().mockResolvedValue({ data: mockData, error: null });
      mocks.mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({ eq: mockEq }),
      });

      const stats = await getUserStats('user-123');
      expect(stats.count).toBe(3);
      expect(stats.avg).toBeCloseTo(80, 0);
      expect(stats.best).toBe(90);
    });

    it('should correctly find the max percentage as "best"', async () => {
      const mockData = [
        { score: 5, percentage: 50 },
        { score: 10, percentage: 100 },
        { score: 3, percentage: 30 },
      ];
      const mockEq = vi.fn().mockResolvedValue({ data: mockData, error: null });
      mocks.mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({ eq: mockEq }),
      });

      const stats = await getUserStats('user-123');
      expect(stats.best).toBe(100);
    });
  });

  // ============================
  // saveMyFeedback tests
  // ============================
  describe('saveMyFeedback', () => {
    it('should insert myth feedback with a userId', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
      mocks.mockFrom.mockReturnValue({ insert: mockInsert });

      await saveMyFeedback('user-123', 'myth-001', true);

      expect(mockInsert).toHaveBeenCalledWith([
        expect.objectContaining({
          user_id: 'user-123',
          myth_id: 'myth-001',
          was_helpful: true,
        }),
      ]);
    });

    it('should insert myth feedback with null userId for guest users', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
      mocks.mockFrom.mockReturnValue({ insert: mockInsert });

      await saveMyFeedback(null, 'myth-001', false);

      expect(mockInsert).toHaveBeenCalledWith([
        expect.objectContaining({ user_id: null, was_helpful: false }),
      ]);
    });

    it('should target the "myth_feedback" table', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
      mocks.mockFrom.mockReturnValue({ insert: mockInsert });

      await saveMyFeedback('uid-123', 'myth-002', true);

      expect(mocks.mockFrom).toHaveBeenCalledWith('myth_feedback');
    });
  });

  // ============================
  // updateRegistrationStatus tests
  // ============================
  describe('updateRegistrationStatus', () => {
    it('should call update with registration_status', async () => {
      const { mockUpdate } = createUpdateMock();

      await updateRegistrationStatus('user-123', 'Submitted');

      expect(mockUpdate).toHaveBeenCalledWith({ registration_status: 'Submitted' });
    });

    it('should target the "users_profile" table', async () => {
      createUpdateMock();
      await updateRegistrationStatus('user-123', 'Approved');
      expect(mocks.mockFrom).toHaveBeenCalledWith('users_profile');
    });
  });

  // ============================
  // updateVotingStatus tests
  // ============================
  describe('updateVotingStatus', () => {
    it('should call update with has_voted=true', async () => {
      const { mockUpdate } = createUpdateMock();

      await updateVotingStatus('user-123', true);

      expect(mockUpdate).toHaveBeenCalledWith({ has_voted: true });
    });

    it('should call update with has_voted=false', async () => {
      const { mockUpdate } = createUpdateMock();

      await updateVotingStatus('user-123', false);

      expect(mockUpdate).toHaveBeenCalledWith({ has_voted: false });
    });
  });

  // ============================
  // getLeaderboard tests
  // ============================
  describe('getLeaderboard', () => {
    it('should query quiz_attempts table for leaderboard data', async () => {
      const mockLimit = vi.fn().mockResolvedValue({ data: [], error: null });
      const mockOrder = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
      mocks.mockFrom.mockReturnValue({ select: mockSelect });

      await getLeaderboard();

      expect(mockSelect).toHaveBeenCalledWith('percentage, score, users_profile(full_name)');
    });

    it('should return an empty array on error', async () => {
      const mockLimit = vi.fn().mockResolvedValue({ data: null, error: { message: 'Error' } });
      const mockOrder = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
      mocks.mockFrom.mockReturnValue({ select: mockSelect });

      const result = await getLeaderboard();
      expect(result).toEqual([]);
    });

    it('should apply a limit of 5 entries', async () => {
      const mockLimit = vi.fn().mockResolvedValue({ data: [], error: null });
      const mockOrder = vi.fn().mockReturnValue({ limit: mockLimit });
      mocks.mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({ order: mockOrder }),
      });

      await getLeaderboard();
      expect(mockLimit).toHaveBeenCalledWith(5);
    });
  });

  // ============================
  // getQuizHistory tests
  // ============================
  describe('getQuizHistory', () => {
    it('should query quiz_attempts table for a specific user', async () => {
      const { mockSelect } = createSelectMock({ data: [], error: null });

      await getQuizHistory('user-123');

      expect(mockSelect).toHaveBeenCalledWith('*');
    });

    it('should return empty array when no history exists', async () => {
      createSelectMock({ data: [], error: null });

      const result = await getQuizHistory('user-123');

      expect(Array.isArray(result)).toBe(true);
    });

    it('should return empty array on database error', async () => {
      createSelectMock({ data: null, error: { message: 'Error' } });

      const result = await getQuizHistory('user-123');

      expect(result).toEqual([]);
    });
  });

  // ============================
  // getUserProfile tests
  // ============================
  describe('getUserProfile', () => {
    it('should query users_profile table for a specific user', async () => {
      const { mockSelect } = createSelectMock();
      await getUserProfile('user-123');
      expect(mockSelect).toHaveBeenCalledWith('*');
    });

    it('should return null when user does not exist', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'Row not found' },
      });
      mocks.mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({ single: mockSingle }),
        }),
      });

      const result = await getUserProfile('nonexistent-user');
      expect(result).toBeNull();
    });

    it('should target the "users_profile" table', async () => {
      createSelectMock();
      await getUserProfile('user-123');
      expect(mocks.mockFrom).toHaveBeenCalledWith('users_profile');
    });
  });
});
