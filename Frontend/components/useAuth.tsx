import { useContext } from 'react';
import AuthContext from './AuthContext';
import type { AuthContextType } from '../lib/types';

/**
 * Custom hook to use the auth context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}