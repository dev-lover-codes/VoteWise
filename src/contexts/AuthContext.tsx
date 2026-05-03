import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User, onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithPopup, googleProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '../lib/firebase';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (e: string, p: string) => Promise<void>;
  signUpWithEmail: (e: string, p: string, name: string, state: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Ensure user exists in Supabase
        const { error } = await supabase.from('users_profile').select('id').eq('id', firebaseUser.uid).single();
        if (error && error.code === 'PGRST116') {
          // Record doesn't exist, create it
          await supabase.from('users_profile').insert([{
            id: firebaseUser.uid,
            full_name: firebaseUser.displayName || 'User',
            email: firebaseUser.email,
            avatar_url: firebaseUser.photoURL
          }]);
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signInWithEmail = async (e: string, p: string) => {
    await signInWithEmailAndPassword(auth, e, p);
  };

  const signUpWithEmail = async (e: string, p: string, name: string, state: string) => {
    const res = await createUserWithEmailAndPassword(auth, e, p);
    await supabase.from('users_profile').insert([{
      id: res.user.uid,
      full_name: name,
      email: e,
      state: state,
      registration_status: 'Pending',
      has_voted: false
    }]);
  };

  const logOut = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, logOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}