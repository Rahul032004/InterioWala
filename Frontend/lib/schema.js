/**
 * MongoDB Schema Definitions (Browser-Compatible Mock)
 * 
 * This file contains mock schema definitions for browser compatibility.
 * In a real application, these schemas would be used server-side only.
 */

// Browser-compatible mock schemas
// These are simplified versions that don't use MongoDB-specific validation

// User Schema
const userSchema = {
  // Browser-compatible schema definition
  fields: {
    email: { type: "string", required: true },
    fullName: { type: "string", required: true },
    avatarUrl: { type: "string" },
    bio: { type: "string" },
    phone: { type: "string" },
    location: { type: "string" },
    website: { type: "string" },
    createdAt: { type: "date" },
    updatedAt: { type: "date" }
  }
};

// This is a mock implementation for browser compatibility
// In a real application, MongoDB validation would happen server-side

// Design Schema
const designSchema = {
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    category: { type: "string", required: true },
    imageUrl: { type: "string", required: true },
    style: { type: "string", required: true },
    roomType: { type: "string", required: true },
    colorScheme: { type: "array", items: { type: "string" } },
    tags: { type: "array", items: { type: "string" } },
    createdAt: { type: "date" },
    updatedAt: { type: "date" }
  }
};

// Project Schema
const projectSchema = {
  fields: {
    userId: { type: "string", required: true },
    designId: { type: "string", required: true },
    title: { type: "string", required: true },
    description: { type: "string" },
    status: { type: "string", enum: ["saved", "in_progress", "completed"], required: true },
    customSettings: { type: "object" },
    createdAt: { type: "date" },
    updatedAt: { type: "date" }
  }
};

// Favorite Schema
const favoriteSchema = {
  fields: {
    userId: { type: "string", required: true },
    designId: { type: "string", required: true },
        createdAt: {
          bsonType: "date",
          description: "Timestamp when the favorite was created"
        }
      }
    }
  }
};

// Contact Schema
const contactSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "subject", "message", "status"],
      properties: {
        name: {
          bsonType: "string",
          description: "Name of the person submitting the contact form"
        },
        email: {
          bsonType: "string",
          description: "Email of the person submitting the contact form"
        },
        subject: {
          bsonType: "string",
          description: "Subject of the contact message"
        },
        message: {
          bsonType: "string",
          description: "Content of the contact message"
        },
        status: {
          enum: ["new", "in_progress", "resolved"],
          description: "Status of the contact message"
        },
        createdAt: {
          bsonType: "date",
          description: "Timestamp when the contact was created"
        }
      }
    }
  }
};

// Function to create collections with validation
async function createCollections(db) {
  try {
    // Create users collection
    await db.createCollection('users', userSchema);
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    
    // Create designs collection
    await db.createCollection('designs', designSchema);
    await db.collection('designs').createIndex({ title: 'text', description: 'text', category: 'text' });
    
    // Create projects collection
    await db.createCollection('projects', projectSchema);
    await db.collection('projects').createIndex({ userId: 1 });
    
    // Create favorites collection
    await db.createCollection('favorites', favoriteSchema);
    await db.collection('favorites').createIndex({ userId: 1, designId: 1 }, { unique: true });
    
    // Create contacts collection
    createdAt: { type: "date" },
    updatedAt: { type: "date" }
  }
};

// Contact Schema
const contactSchema = {
  fields: {
    name: { type: "string", required: true },
    email: { type: "string", required: true },
    subject: { type: "string", required: true },
    message: { type: "string", required: true },
    createdAt: { type: "date" }
  }
};

// Browser-compatible mock collection creation
async function createCollections(db) {
  try {
    // In browser environment, we just initialize localStorage if needed
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem('mock_users')) {
        localStorage.setItem('mock_users', JSON.stringify([]));
      }
      if (!localStorage.getItem('mock_designs')) {
        localStorage.setItem('mock_designs', JSON.stringify([]));
      }
      if (!localStorage.getItem('mock_projects')) {
        localStorage.setItem('mock_projects', JSON.stringify([]));
      }
      if (!localStorage.getItem('mock_favorites')) {
        localStorage.setItem('mock_favorites', JSON.stringify([]));
      }
      if (!localStorage.getItem('mock_contacts')) {
        localStorage.setItem('mock_contacts', JSON.stringify([]));
      }
    }
    
    console.log('Mock collections initialized successfully');
  } catch (error) {
    console.error('Error initializing mock collections:', error);
  }
}

// Sample data insertion function (browser-compatible)
async function insertSampleDesigns(db) {
  try {
    // Only proceed if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }
    
    const designs = [
      {
        _id: 'id_' + Math.random().toString(36).substr(2, 9),
        title: 'Modern Minimalist Living Room',
        description: 'Clean lines and neutral tones create a serene living space',
        category: 'Living Room',
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        style: 'Modern',
        roomType: 'Living Room',
        colorScheme: ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#333333'],
        tags: ['minimalist', 'modern', 'neutral', 'clean'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'id_' + Math.random().toString(36).substr(2, 9),
        title: 'Scandinavian Bedroom Retreat',
        description: 'Cozy and functional bedroom design with natural materials',
        category: 'Bedroom',
        imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
        style: 'Scandinavian',
        roomType: 'Bedroom',
        colorScheme: ['#FFFFFF', '#F0F0F0', '#D4B5A0', '#8B4513'],
        tags: ['scandinavian', 'cozy', 'natural', 'wood'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    // Store in localStorage for browser environment
    localStorage.setItem('mock_designs', JSON.stringify(designs));
    console.log('Sample designs inserted successfully in browser storage');
  } catch (error) {
    console.error('Error inserting sample designs:', error);
  }
}

// Export as browser-compatible globals
const schemaExports = {
  createCollections,
  insertSampleDesigns,
  schemas: {
    userSchema,
    designSchema,
    projectSchema,
    favoriteSchema,
    contactSchema
  }
};

// Make it available globally for browser compatibility
window.schemaModule = schemaExports;