import apiRequest from './api';
import { connectToDatabase, toObjectId, fromObjectId, fromObjectIdArray, ObjectId } from './mongodb.js';
import { ErrorType, ErrorSeverity, withErrorHandling, withFallback, withRetry } from './errorHandler';
import type { User, Design, Project, Contact, UserFavorite, AuthUser } from './types';

// Types are now imported from types.ts

// Contact and UserFavorite interfaces are now imported from types.ts

// Cache for frequently accessed data
const serviceCache: Record<string, { data: any; timestamp: number }> = {};

// Cache expiration time (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000;

// Design Services
export const designService = {
  async getAll(): Promise<Design[]> {
    const result = await withErrorHandling(
      async () => {
        // Check cache first
        const cacheKey = 'designs_getAll';
        const cachedData = serviceCache[cacheKey];
        
        if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_EXPIRATION) {
          console.log('Using cached designs data');
          return cachedData.data;
        }
        
        const db = await connectToDatabase();
        const designs = await db.collection('designs')
          .find({})
          .sort({ createdAt: -1 })
          .toArray();

        const formattedDesigns = designs.map((design: { _id: ObjectId | string }) => ({
           ...design,
           id: design._id ? design._id.toString() : design._id
         })) || [];
         
        // Store in cache
        serviceCache[cacheKey] = {
          data: formattedDesigns,
          timestamp: Date.now()
        };

        return formattedDesigns;
      },
      ErrorType.DATABASE,
      'Failed to fetch designs',
      ErrorSeverity.MEDIUM,
      { method: 'designService.getAll' }
    );
    
    return result.data || [];
  },

  async getById(id: string): Promise<Design | null> {
    const result = await withErrorHandling(
      async () => {
        // Check cache first
        const cacheKey = `design_${id}`;
        const cachedData = serviceCache[cacheKey];
        
        if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_EXPIRATION) {
          console.log('Using cached design data for id:', id);
          return cachedData.data;
        }
        
        const db = await connectToDatabase();
        // In browser environment, we need to handle the ID differently
        let query;
        try {
          query = { _id: toObjectId(id) };
        } catch (e) {
          // If toObjectId fails, try using the string ID directly
          query = { _id: id };
        }
        
        const design = await db.collection('designs').findOne(query);

        if (!design) {
          return null;
        }

        const formattedDesign = {
           ...design,
           id: design._id ? design._id.toString() : design._id
         };
         
        // Store in cache
        serviceCache[cacheKey] = {
          data: formattedDesign,
          timestamp: Date.now()
        };
        
        return formattedDesign;
      },
      ErrorType.DATABASE,
      `Failed to fetch design with ID: ${id}`,
      ErrorSeverity.MEDIUM,
      { method: 'designService.getById', designId: id }
    );
    
    return result.data;
  },

  async getByCategory(category: string): Promise<Design[]> {
    const result = await withErrorHandling(
      async () => {
        const db = await connectToDatabase();
        const designs = await db.collection('designs')
          .find({ category })
          .sort({ createdAt: -1 })
          .toArray();

        return designs.map((design: { _id: ObjectId | string }) => ({
          ...design,
          id: design._id ? design._id.toString() : design._id
        })) || [];
      },
      ErrorType.DATABASE,
      `Failed to fetch designs with category: ${category}`,
      ErrorSeverity.MEDIUM,
      { method: 'designService.getByCategory', category }
    );
    
    return result.data || [];
  },

  async search(query: string): Promise<Design[]> {
    const result = await withErrorHandling(
      async () => {
        const db = await connectToDatabase();
        // In browser environment, we need to handle search differently
        // Get all designs from localStorage and filter them manually
        const designs = await db.collection('designs')
          .find({})
          .sort({ createdAt: -1 })
          .toArray();
        
        // Filter designs manually for browser compatibility
        const queryLower = query.toLowerCase();
        const filteredDesigns = designs.filter((design: Design) => {
          return (
            (design.title && design.title.toLowerCase().includes(queryLower)) ||
            (design.description && design.description.toLowerCase().includes(queryLower)) ||
            (design.category && design.category.toLowerCase().includes(queryLower))
          );
        });

        return filteredDesigns.map((design: Design) => ({
          ...design,
          id: design._id ? design._id.toString() : design._id
        })) || [];
      },
      ErrorType.DATABASE,
      `Failed to search designs with query: ${query}`,
      ErrorSeverity.MEDIUM,
      { method: 'designService.search', query }
    );
    
    return result.data || [];
  }
};

// Storage Service for file uploads
// Note: For MongoDB, you would typically use a separate service like AWS S3, Google Cloud Storage, or a local file system
export const storageService = {
  async uploadAvatar(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/users/avatar`, {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type here, it will be set automatically with boundary
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload avatar');
      }
      
      const data = await response.json();
      
      // In a real implementation with MongoDB, you would update the user's avatar URL in the database
      // const token = localStorage.getItem('token');
      // const { userId } = authService.verifyToken(token);
      // if (userId) {
      //   const db = await connectToDatabase();
      //   await db.collection('users').updateOne(
      //     { _id: toObjectId(userId) },
      //     { $set: { avatar: data.avatarUrl, updatedAt: new Date().toISOString() } }
      //   );
      // }
      
      return data.avatarUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  }
};

// Function to invalidate service cache
export function invalidateServiceCache(key?: string) {
  if (key) {
    // Invalidate specific cache entry
    if (key.includes('*')) {
      // Handle wildcard invalidation
      const prefix = key.replace('*', '');
      Object.keys(serviceCache).forEach(cacheKey => {
        if (cacheKey.startsWith(prefix)) {
          delete serviceCache[cacheKey];
        }
      });
    } else {
      // Invalidate exact key
      delete serviceCache[key];
    }
  } else {
    // Invalidate all cache
    Object.keys(serviceCache).forEach(key => {
      delete serviceCache[key];
    });
  }
}

// Project Services
export const projectService = {
  async getAll(): Promise<Project[]> {
    try {
      // Check cache first
      const cacheKey = 'projects_getAll';
      const cachedData = serviceCache[cacheKey];
      
      if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_EXPIRATION) {
        console.log('Using cached projects data');
        return cachedData.data;
      }
      
      const db = await connectToDatabase();
      const projects = await db.collection('projects')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      const formattedProjects = projects.map((project: { _id: ObjectId | string }) => ({
        ...project,
        id: project._id ? project._id.toString() : project._id
      })) || [];
      
      // Store in cache
      serviceCache[cacheKey] = {
        data: formattedProjects,
        timestamp: Date.now()
      };

      return formattedProjects;
    } catch (error) {
      console.error('Error in getAll projects:', error);
      return [];
    }
  },

  async getById(id: string): Promise<Project | null> {
    try {
      // Check cache first
      const cacheKey = `project_${id}`;
      const cachedData = serviceCache[cacheKey];
      
      if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_EXPIRATION) {
        console.log('Using cached project data for id:', id);
        return cachedData.data;
      }
      
      const db = await connectToDatabase();
      const project = await db.collection('projects').findOne({ _id: toObjectId(id) });

      if (!project) {
        return null;
      }

      const formattedProject = {
         ...project,
         id: project._id.toString()
       };
       
      // Store in cache
      serviceCache[cacheKey] = {
        data: formattedProject,
        timestamp: Date.now()
      };
      
      return formattedProject;
    } catch (error) {
      console.error('Error in getById project:', error);
      return null;
    }
  },

  async create(designId: string, title: string, description?: string): Promise<Project | null> {
    try {
      const db = await connectToDatabase();
      const now = new Date().toISOString();
      
      // Find the design first
      const design = await db.collection('designs').findOne({ _id: toObjectId(designId) });
      if (!design) {
        throw new Error('Design not found');
      }
      
      const designWithId = {
        ...design,
        _id: design._id.toString()
      };
      
      // Create the new project
      const newProject = {
        user: '', // Default empty user
        design: toObjectId(designId),
        title,
        description: description || '',
        status: 'saved',
        createdAt: now,
        updatedAt: now
      };
      
      const result = await db.collection('projects').insertOne(newProject);
      
      if (!result.acknowledged) {
        return null;
      }
      
      // Return the complete project with design details
      const project: Project = {
        _id: result.insertedId.toString(),
        user: '', // Default empty user
        design: designWithId as Design,
        title,
        description: description || '',
        status: 'saved' as 'saved' | 'in_progress' | 'completed',
        createdAt: now,
        updatedAt: now
      };
      
      return project;
    } catch (error) {
      console.error('Error creating project:', error);
      return null;
    }
  },

  async update(id: string, updates: Partial<Project>): Promise<Project | null> {
    try {
      const db = await connectToDatabase();
      
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      const result = await db.collection('projects').findOneAndUpdate(
        { _id: toObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      
      if (!result) {
        return null;
      }
      
      return {
        ...result,
        _id: result._id.toString()
      };
    } catch (error) {
      console.error('Error updating project:', error);
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const db = await connectToDatabase();
      
      const result = await db.collection('projects').deleteOne({ _id: toObjectId(id) });
      
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  }
};

// User Favorites Services
export const favoriteService = {
  async getUserFavorites(userId: string): Promise<UserFavorite[]> {
    try {
      const db = await connectToDatabase();
      const favorites = await db.collection('favorites')
        .find({ userId: userId })
        .toArray();

      return favorites.map(favorite => ({
        ...favorite,
        _id: favorite._id.toString()
      })) || [];
    } catch (error) {
      console.error('Error in getUserFavorites:', error);
      return [];
    }
  },

  async addFavorite(userId: string, designId: string): Promise<UserFavorite | null> {
    try {
      const db = await connectToDatabase();
      
      // Check if already favorited
      const existingFavorite = await db.collection('favorites').findOne({
        userId,
        designId: toObjectId(designId)
      });

      if (existingFavorite) {
        return {
          ...existingFavorite,
          _id: existingFavorite._id.toString()
        }; // Already favorited
      }

      const newFavorite = {
        userId,
        designId: toObjectId(designId),
        createdAt: new Date().toISOString()
      };

      const result = await db.collection('favorites').insertOne(newFavorite);

      if (!result.acknowledged) {
        return null;
      }

      return {
        ...newFavorite,
        _id: result.insertedId.toString()
      };
    } catch (error) {
      console.error('Error adding favorite:', error);
      return null;
    }
  },

  async removeFavorite(userId: string, designId: string): Promise<boolean> {
    try {
      const db = await connectToDatabase();
      
      const result = await db.collection('favorites').deleteOne({
        userId,
        designId: toObjectId(designId)
      });

      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error removing favorite:', error);
      return false;
    }
  },

  async checkFavorite(userId: string, designId: string): Promise<boolean> {
    try {
      const db = await connectToDatabase();
      
      const favorite = await db.collection('favorites').findOne({
        userId,
        designId: toObjectId(designId)
      });

      return !!favorite;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }
};

// Contact Services
export const contactService = {
  async submitContactForm(name: string, email: string, subject: string, message: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const db = await connectToDatabase();
      
      const result = await db.collection('contacts').insertOne({
        name,
        email,
        subject,
        message,
        status: 'new',
        createdAt: new Date().toISOString(),
      });

      if (!result.acknowledged) {
        return { success: false, error: 'Failed to submit contact form' };
      }

      return { success: true, error: null };
    } catch (error) {
      console.error('Error submitting contact form:', error);
      return { success: false, error: 'Failed to submit contact form' };
    }
  },
  
  // Added to match usage in ContactPage component
  async create(data: { name: string; email: string; subject: string; message: string }): Promise<boolean> {
    try {
      const result = await this.submitContactForm(data.name, data.email, data.subject, data.message);
      return result.success;
    } catch (error) {
      console.error('Error creating contact:', error);
      return false;
    }
  }
};

// Alias for backward compatibility
export const favoritesService = favoriteService;

// User Services
export const userService = {
  async getById(id: string): Promise<User | null> {
    try {
      // Check cache first
      const cacheKey = `user_${id}`;
      const cachedData = serviceCache[cacheKey];
      
      if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_EXPIRATION) {
        console.log('Using cached user data for id:', id);
        return cachedData.data;
      }
      
      const db = await connectToDatabase();
      const objectId = toObjectId(id);
      const user = await db.collection('users').findOne({ _id: objectId });
      
      if (!user) return null;
      
      const formattedUser = {
        ...user,
        _id: user._id ? user._id.toString() : user._id,
        password: undefined // Remove password from response
      };
      
      // Store in cache
      serviceCache[cacheKey] = {
        data: formattedUser,
        timestamp: Date.now()
      };
      
      return formattedUser;
    } catch (error) {
      console.error('Error in getById user:', error);
      return null;
    }
  }
};

// Auth Services
// AuthUser interface is now imported from types.ts

// Browser-compatible mock for authentication
// Note: In a production app, you would use a proper auth service
const isBrowser = typeof window !== 'undefined';

// Mock implementations for browser environment
const mockBcrypt = {
  async compare(password: string, hash: string): Promise<boolean> {
    // In browser, just do a simple check (DEMO ONLY - NOT SECURE)
    return password === 'demo123'; // Demo password for testing
  }
};

const mockJwt = {
  sign(payload: any, secret: string, options: any): string {
    // Create a simple encoded string as mock token
    return btoa(JSON.stringify(payload));
  }
};

// Use real or mock based on environment
const bcrypt = isBrowser ? mockBcrypt : require('bcryptjs');
const jwt = isBrowser ? mockJwt : require('jsonwebtoken');

// JWT secret key
const JWT_SECRET = typeof process !== 'undefined' && process.env.JWT_SECRET || 'your-secret-key';

export const authService = {
  async login(email: string, password: string): Promise<{ user: AuthUser | null; error: string | null; token?: string }> {
    try {
      // We don't cache login attempts for security reasons
      // But we invalidate user cache on successful login
      
      const db = await connectToDatabase();
      const usersCollection = db.collection('users');
      
      // Find user by email
      const user = await usersCollection.findOne({ email });
      
      if (!user) {
        return { user: null, error: 'Invalid email or password' };
      }
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return { user: null, error: 'Invalid email or password' };
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id.toString(), email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Invalidate any cached data for this user
      invalidateServiceCache(`user_${user._id.toString()}`);
      
      // Return user data without password
      const userData: AuthUser = {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        location: user.location,
        website: user.website,
        createdAt: user.createdAt,
      };
      
      return { user: userData, error: null, token };
    } catch (error) {
      console.error('Login error:', error);
      return { user: null, error: 'An unexpected error occurred' };
    }
  },

  async signup(email: string, password: string, name: string): Promise<{ user: AuthUser | null; error: string | null; token?: string }> {
    try {
      const db = await connectToDatabase();
      const usersCollection = db.collection('users');
      
      // Check if user already exists
      const existingUser = await usersCollection.findOne({ email });
      
      if (existingUser) {
        return { user: null, error: 'Email already in use' };
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create new user
      const now = new Date().toISOString();
      const newUser = {
        email,
        password: hashedPassword,
        name,
        createdAt: now,
        updatedAt: now,
      };
      
      const result = await usersCollection.insertOne(newUser);
      
      if (!result.acknowledged) {
        return { user: null, error: 'Failed to create user' };
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: result.insertedId.toString(), email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Invalidate users cache after registration
      invalidateServiceCache('users_*');
      
      // Return user data without password
      const userData: AuthUser = {
        _id: result.insertedId.toString(),
        email,
        name,
        createdAt: now,
      };
      
      return { user: userData, error: null, token };
    } catch (error) {
      console.error('Signup error:', error);
      return { user: null, error: 'An unexpected error occurred' };
    }
  },

  async logout(): Promise<void> {
    // With JWT, logout is handled client-side by removing the token
    // No server-side action needed
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async updateProfile(userId: string, updates: Partial<AuthUser>): Promise<{ success: boolean; error: string | null }> {
    try {
      const db = await connectToDatabase();
      const usersCollection = db.collection('users');
      
      // Prepare updates
      const profileUpdates: Record<string, any> = {
        updatedAt: new Date().toISOString()
      };
      
      if (updates.name) profileUpdates.name = updates.name;
      if (updates.bio) profileUpdates.bio = updates.bio;
      if (updates.phone) profileUpdates.phone = updates.phone;
      if (updates.location) profileUpdates.location = updates.location;
      if (updates.website) profileUpdates.website = updates.website;
      if (updates.avatar) profileUpdates.avatar = updates.avatar;
      
      // Update user profile
      const result = await usersCollection.updateOne(
        { _id: toObjectId(userId) },
        { $set: profileUpdates }
      );
      
      if (result.matchedCount === 0) {
        return { success: false, error: 'User not found' };
      }
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  async getCurrentUser(token: string): Promise<AuthUser | null> {
    try {
      if (!token) {
        return null;
      }
      
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.id;
      
      const db = await connectToDatabase();
      const usersCollection = db.collection('users');
      
      // Find user by ID
      const user = await usersCollection.findOne({ _id: toObjectId(userId) });
      
      if (!user) {
        return null;
      }
      
      // Return user data without password
      return {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        location: user.location,
        website: user.website,
        createdAt: user.createdAt,
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },
  
  // Verify token and get user ID
  verifyToken(token: string): { userId: string | null; error: string | null } {
    try {
      if (!token) {
        return { userId: null, error: 'No token provided' };
      }
      
      const decoded = jwt.verify(token, JWT_SECRET);
      return { userId: decoded.id, error: null };
    } catch (error) {
      return { userId: null, error: 'Invalid token' };
    }
  }
};