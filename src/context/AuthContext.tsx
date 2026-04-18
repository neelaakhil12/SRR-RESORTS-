"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession, signIn, signOut as nextAuthSignOut } from 'next-auth/react';

interface AuthContextType {
  user: any;
  loading: boolean;
  sendOtp: (email: string) => Promise<any>;
  verifyOtp: (email: string, otp: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
    } else {
      setUser(session?.user ?? null);
      setLoading(false);
    }
  }, [session, status]);

  const sendOtp = async (email: string) => {
    const res = await fetch('/api/auth/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  };

  const verifyOtp = async (email: string, otp: string) => {
    return signIn('credentials', { 
      email, 
      otp, 
      redirect: false,
      callbackUrl: '/' 
    });
  };

  const signInWithGoogle = () => signIn('google', { callbackUrl: '/' });
  const signOut = () => nextAuthSignOut({ callbackUrl: '/' });

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      sendOtp,
      verifyOtp,
      signInWithGoogle, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
