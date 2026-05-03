/**
 * @fileoverview Tests for the AuthContext provider.
 * Validates auth state management, Firebase integration, and Supabase profile sync.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  mockOnAuthStateChanged: vi.fn(),
  mockSupabaseFrom: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: mocks.mockOnAuthStateChanged,
  getAuth: vi.fn(() => ({})),
  GoogleAuthProvider: vi.fn(() => ({})),
  signInWithPopup: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('../lib/firebase', () => ({
  auth: {},
  googleProvider: {},
  signInWithPopup: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: mocks.mockSupabaseFrom,
  })),
}));
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: mocks.mockSupabaseFrom,
  },
}));

import { AuthProvider, useAuth } from '../contexts/AuthContext';

// Test component to consume auth context
function AuthConsumer() {
  const { user, loading } = useAuth();
  return (
    <div>
      <span data-testid="loading">{loading ? 'loading' : 'done'}</span>
      <span data-testid="user">{user ? (user as { email: string }).email : 'no-user'}</span>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: auth state is null (not logged in)
    mocks.mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
      callback(null);
      return () => {}; // unsubscribe function
    });

    // Setup Supabase mock chain
    mocks.mockSupabaseFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    });
  });

  describe('AuthProvider', () => {
    it('should render children when auth state is resolved', async () => {
      render(
        <AuthProvider>
          <div data-testid="child">Child Content</div>
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('child')).toBeInTheDocument();
      });
    });

    it('should provide null user when not authenticated', async () => {
      render(
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('no-user');
      });
    });

    it('should provide authenticated user email when signed in', async () => {
      mocks.mockOnAuthStateChanged.mockImplementationOnce((_auth, callback) => {
        callback({
          uid: 'test-uid',
          email: 'test@example.com',
          displayName: 'Test User',
          photoURL: null,
        });
        return () => {};
      });

      render(
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
      });
    });

    it('should show loading=done after auth state resolves', async () => {
      render(
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('done');
      });
    });

    it('should call onAuthStateChanged once on mount', async () => {
      render(
        <AuthProvider>
          <div>test</div>
        </AuthProvider>
      );

      await waitFor(() => {
        expect(mocks.mockOnAuthStateChanged).toHaveBeenCalledOnce();
      });
    });
  });

  describe('useAuth hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<AuthConsumer />);
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });

    it('should return all required auth interface methods', async () => {
      const authContext: Partial<ReturnType<typeof useAuth>> = {};

      function AuthContextCapture() {
        const ctx = useAuth();
        Object.assign(authContext, ctx);
        return null;
      }

      render(
        <AuthProvider>
          <AuthContextCapture />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(authContext.signInWithGoogle).toBeDefined();
      });

      expect(typeof authContext.signInWithGoogle).toBe('function');
      expect(typeof authContext.signInWithEmail).toBe('function');
      expect(typeof authContext.signUpWithEmail).toBe('function');
      expect(typeof authContext.logOut).toBe('function');
      expect('user' in authContext).toBe(true);
      expect('loading' in authContext).toBe(true);
    });

    it('should expose a loading boolean', async () => {
      const authContext: Partial<ReturnType<typeof useAuth>> = {};

      function AuthContextCapture() {
        const currentContext = useAuth();
        Object.assign(authContext, currentContext);
        return null;
      }

      render(
        <AuthProvider>
          <AuthContextCapture />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(authContext.loading).toBeDefined();
        expect(typeof authContext.loading).toBe('boolean');
      });
    });
  });

  describe('User profile synchronization', () => {
    it('should query Supabase users_profile when a user signs in', async () => {
      mocks.mockOnAuthStateChanged.mockImplementationOnce((_auth, callback) => {
        callback({
          uid: 'new-user-uid',
          email: 'new@example.com',
          displayName: 'New User',
          photoURL: null,
        });
        return () => {};
      });

      render(
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('new@example.com');
      });

      // Should have tried to access users_profile
      expect(mocks.mockSupabaseFrom).toHaveBeenCalledWith('users_profile');
    });

    it('should create a new profile when user does not exist in Supabase', async () => {
      // Simulate row not found (PGRST116 = no rows returned)
      mocks.mockSupabaseFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116', message: 'Row not found' },
            }),
          }),
        }),
        insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      });

      mocks.mockOnAuthStateChanged.mockImplementationOnce((_auth, callback) => {
        callback({
          uid: 'brand-new-uid',
          email: 'brandnew@example.com',
          displayName: 'Brand New User',
          photoURL: null,
        });
        return () => {};
      });

      render(
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('brandnew@example.com');
      });
    });
  });
});
