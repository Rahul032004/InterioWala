import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../lib/services';
import type { AuthUser, AuthContextType } from '../lib/types';

// Using AuthUser type from types.ts with an additional role field
type User = AuthUser & { role?: string };

// Import the context from AuthContext.tsx
import AuthContext from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const currentUser = await authService.getCurrentUser(token);
        if (currentUser) {
          setUser(currentUser as User);
        } else {
          // Token is invalid or expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { user: authUser, error, token } = await authService.login(email, password);

      if (error || !authUser || !token) {
        console.error('Login error:', error);
        setIsLoading(false);
        return false;
      }

      // Store token in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(authUser));
      
      // Set user in state
      setUser(authUser as User);

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { user: authUser, error, token } = await authService.signup(email, password, name);

      if (error || !authUser || !token) {
        console.error('Signup error:', error);
        setIsLoading(false);
        return false;
      }

      // Store token in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(authUser));
      
      // Set user in state
      setUser(authUser as User);

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    setIsLoading(true);
    
    try {
      const { success, error } = await authService.updateProfile(user._id, updates);

      if (!success || error) {
        console.error('Profile update error:', error);
        setIsLoading(false);
        return false;
      }

      // Update local state
      setUser({ ...user, ...updates });
      
      // Update stored user data
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...storedUser, ...updates }));
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      setIsLoading(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      updateProfile,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}