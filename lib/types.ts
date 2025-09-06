// Type definitions for the Interior project

// Define types here to avoid circular dependencies
export interface User {
  _id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  location?: string;
  website?: string;
  token?: string;
}

// Auth types
export type AuthUser = User;

export interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<AuthUser>) => Promise<boolean>;
  isLoading: boolean;
}

export interface Design {
  _id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  style: string;
  roomType: string;
  colorScheme: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  user: string;
  design: Design;
  title: string;
  description?: string;
  status: 'saved' | 'in_progress' | 'completed';
  customSettings?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  createdAt: string;
}

export interface UserFavorite {
  _id: string;
  user: string;
  design: Design;
  createdAt: string;
}

export interface AuthUser {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  location?: string;
  website?: string;
  createdAt: string;
}