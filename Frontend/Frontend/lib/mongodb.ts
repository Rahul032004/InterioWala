// This is a browser-safe MongoDB interface
// In a real application, MongoDB would be used on the server side only

// Import schema definitions
import * as schema from './schema';

// Helper function for deep comparison of objects (for complex queries)
function deepCompare(itemValue: any, queryValue: any): boolean {
  // Handle MongoDB-style operators
  if (queryValue && typeof queryValue === 'object') {
    // $in operator
    if (queryValue.$in && Array.isArray(queryValue.$in)) {
      return queryValue.$in.includes(itemValue);
    }
    
    // $gt operator
    if (queryValue.$gt !== undefined) {
      return itemValue > queryValue.$gt;
    }
    
    // $gte operator
    if (queryValue.$gte !== undefined) {
      return itemValue >= queryValue.$gte;
    }
    
    // $lt operator
    if (queryValue.$lt !== undefined) {
      return itemValue < queryValue.$lt;
    }
    
    // $lte operator
    if (queryValue.$lte !== undefined) {
      return itemValue <= queryValue.$lte;
    }
    
    // $ne operator
    if (queryValue.$ne !== undefined) {
      return itemValue !== queryValue.$ne;
    }
    
    // $regex operator (simplified)
    if (queryValue.$regex) {
      const flags = queryValue.$options || '';
      const regex = new RegExp(queryValue.$regex, flags);
      return regex.test(String(itemValue));
    }
  }
  
  // Default comparison
  return JSON.stringify(itemValue) === JSON.stringify(queryValue);
}

// Mock ObjectId for browser compatibility
class ObjectId {
  private id: string;

  constructor(id?: string) {
    this.id = id || this._generateId();
  }

  toString() {
    return this.id;
  }

  equals(otherId: ObjectId) {
    return this.id === otherId.toString();
  }

  // Simple ID generator for mock purposes
  private _generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
  }
}

// Cache for database collections
const collectionCache: Record<string, any[]> = {};

// Mock database connection
let mockDb: any = null;

// Connect to MongoDB (mock for browser)
async function connectToDatabase() {
  if (mockDb) return mockDb;
  
  try {
    console.log('Using mock MongoDB client for browser environment');
    
    // Initialize mock database with optimized methods
    mockDb = {
      collection: (name: string) => ({
        find: (query = {}) => ({
          sort: (sortOptions = {}) => ({
            toArray: async () => {
              // Use cached data if available
              if (collectionCache[name]) {
                return collectionCache[name];
              }
              
              // Return mock data from localStorage if available
              const storedData = localStorage.getItem(`mock_${name}`);
              const data = storedData ? JSON.parse(storedData) : [];
              
              // Cache the data for future use
              collectionCache[name] = data;
              
              return data;
            }
          })
        }),
        findOne: async (query: any) => {
          // Use cached data if available
          let items;
          if (collectionCache[name]) {
            items = collectionCache[name];
          } else {
            // Get data from localStorage
            const storedData = localStorage.getItem(`mock_${name}`);
            items = storedData ? JSON.parse(storedData) : [];
            // Cache the data
            collectionCache[name] = items;
          }
          
          // Find the first item that matches the query
          return items.find((item: any) => {
            // Handle ObjectId query
            if (query._id) {
              const queryId = query._id instanceof ObjectId 
                ? query._id.toString() 
                : query._id;
              
              const itemId = item._id instanceof ObjectId 
                ? item._id.toString() 
                : item._id;
              
              return itemId === queryId;
            }
            
            // Handle other queries - optimized comparison
            return Object.keys(query).every(key => {
              if (typeof query[key] === 'object' && query[key] !== null) {
                // Handle complex queries like $in, $gt, etc.
                return deepCompare(item[key], query[key]);
              }
              return item[key] === query[key];
            });
          }) || null;
        },
        insertOne: async (doc: any) => {
          // Generate ID if not provided
          if (!doc._id) {
            doc._id = new ObjectId().toString();
          }
          
          // Add timestamps
          const now = new Date().toISOString();
          doc.createdAt = doc.createdAt || now;
          doc.updatedAt = now;
          
          // Get existing data from cache or localStorage
          let items;
          if (collectionCache[name]) {
            items = [...collectionCache[name]];
          } else {
            const storedData = localStorage.getItem(`mock_${name}`);
            items = storedData ? JSON.parse(storedData) : [];
          }
          
          // Add new document
          items.push(doc);
          
          // Update cache
          collectionCache[name] = items;
          
          // Save back to localStorage
          localStorage.setItem(`mock_${name}`, JSON.stringify(items));
          
          return { insertedId: doc._id, acknowledged: true };
        },
        insertMany: async (docs: any[]) => {
          // Get existing data from cache or localStorage
          let items;
          if (collectionCache[name]) {
            items = [...collectionCache[name]];
          } else {
            const storedData = localStorage.getItem(`mock_${name}`);
            items = storedData ? JSON.parse(storedData) : [];
          }
          
          // Process each document
          const now = new Date().toISOString();
          const insertedIds = [];
          
          docs.forEach(doc => {
            // Generate ID if not provided
            if (!doc._id) {
              doc._id = new ObjectId().toString();
            }
            
            // Add timestamps
            doc.createdAt = doc.createdAt || now;
            doc.updatedAt = now;
            
            items.push(doc);
            insertedIds.push(doc._id);
          });
          
          // Update cache
          collectionCache[name] = items;
          
          // Save back to localStorage
          localStorage.setItem(`mock_${name}`, JSON.stringify(items));
          
          return { insertedCount: docs.length, insertedIds, acknowledged: true };
        },
        updateOne: async (query: any, update: any) => {
          // Get existing data from cache or localStorage
          let items;
          if (collectionCache[name]) {
            items = [...collectionCache[name]];
          } else {
            const storedData = localStorage.getItem(`mock_${name}`);
            items = storedData ? JSON.parse(storedData) : [];
          }
          
          // Find the index of the document to update
          const index = items.findIndex((item: any) => {
            if (query._id) {
              const queryId = query._id instanceof ObjectId 
                ? query._id.toString() 
                : query._id;
              
              const itemId = item._id instanceof ObjectId 
                ? item._id.toString() 
                : item._id;
              
              return itemId === queryId;
            }
            
            // Use optimized comparison for complex queries
            return Object.keys(query).every(key => {
              if (typeof query[key] === 'object' && query[key] !== null) {
                return deepCompare(item[key], query[key]);
              }
              return item[key] === query[key];
            });
          });
          
          if (index === -1) {
            return { matchedCount: 0, modifiedCount: 0, acknowledged: true };
          }
          
          // Apply updates
          if (update.$set) {
            Object.keys(update.$set).forEach(key => {
              items[index][key] = update.$set[key];
            });
          }
          
          // Add updatedAt timestamp
          items[index].updatedAt = new Date().toISOString();
          
          // Update cache
          collectionCache[name] = items;
          
          // Save back to localStorage
          localStorage.setItem(`mock_${name}`, JSON.stringify(items));
          
          return { matchedCount: 1, modifiedCount: 1, acknowledged: true };
        },
        deleteOne: async (query: any) => {
          // Get existing data from cache or localStorage
          let items;
          if (collectionCache[name]) {
            items = [...collectionCache[name]];
          } else {
            const storedData = localStorage.getItem(`mock_${name}`);
            items = storedData ? JSON.parse(storedData) : [];
          }
          
          // Find the index of the document to delete
          const index = items.findIndex((item: any) => {
            if (query._id) {
              const queryId = query._id instanceof ObjectId 
                ? query._id.toString() 
                : query._id;
              
              const itemId = item._id instanceof ObjectId 
                ? item._id.toString() 
                : item._id;
              
              return itemId === queryId;
            }
            
            // Use optimized comparison for complex queries
            return Object.keys(query).every(key => {
              if (typeof query[key] === 'object' && query[key] !== null) {
                return deepCompare(item[key], query[key]);
              }
              return item[key] === query[key];
            });
          });
          
          if (index === -1) {
            return { deletedCount: 0, acknowledged: true };
          }
          
          // Remove the document
          items.splice(index, 1);
          
          // Update cache
          collectionCache[name] = items;
          
          // Save back to localStorage
          localStorage.setItem(`mock_${name}`, JSON.stringify(items));
          
          return { deletedCount: 1, acknowledged: true };
        },
        countDocuments: async (query = {}) => {
          // Get data from cache if available
          let items;
          if (collectionCache[name]) {
            items = collectionCache[name];
          } else {
            const storedData = localStorage.getItem(`mock_${name}`);
            items = storedData ? JSON.parse(storedData) : [];
            // Cache the data
            collectionCache[name] = items;
          }
          
          // If no query, return total count
          if (Object.keys(query).length === 0) {
            return items.length;
          }
          
          // Count documents matching the query
          return items.filter((item: any) => {
            return Object.keys(query).every(key => {
              if (typeof query[key] === 'object' && query[key] !== null) {
                return deepCompare(item[key], query[key]);
              }
              return item[key] === query[key];
            });
          }).length;
        }
      })
    };
    
    return mockDb;
  } catch (error) {
    console.error('Mock MongoDB initialization error:', error);
    throw error;
  }
}

// Helper function to convert string IDs to ObjectId
export function toObjectId(id: string) {
  return new ObjectId(id);
}

// Helper function to convert MongoDB _id to string
function fromObjectId(doc: any) {
  if (!doc) return null;
  
  // Create a new object with _id converted to string
  return {
    ...doc,
    _id: doc._id ? doc._id.toString() : doc._id
  };
}

// Helper function to convert an array of MongoDB documents
function fromObjectIdArray(docs: any[]) {
  if (!docs) return [];
  return docs.map(doc => fromObjectId(doc));
}

// Mock client for browser compatibility
const client = {
  connect: async () => Promise.resolve(),
  close: async () => Promise.resolve(),
  db: () => mockDb
};

// Initialize mock data for browser testing
function initializeMockData() {
  // Sample designs data
  const designs = [
    {
      _id: new ObjectId(),
      title: "Modern Living Room",
      description: "Sleek and contemporary living space",
      category: "Living Room",
      imageUrl: "/images/designs/living1.jpg",
      style: "Modern",
      roomType: "Living Room",
      colorScheme: ["Gray", "White", "Black"],
      tags: ["minimalist", "contemporary", "urban"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: new ObjectId(),
      title: "Rustic Kitchen Design",
      description: "Warm and inviting kitchen with natural elements",
      category: "Kitchen",
      imageUrl: "/images/designs/kitchen1.jpg",
      style: "Rustic",
      roomType: "Kitchen",
      colorScheme: ["Brown", "Beige", "Green"],
      tags: ["wooden", "natural", "country"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  // Initialize localStorage with mock data if empty
  if (!localStorage.getItem('mock_designs')) {
    localStorage.setItem('mock_designs', JSON.stringify(designs));
  }
}

// Initialize mock data when in browser environment
if (typeof window !== 'undefined') {
  initializeMockData();
}

// Cache invalidation function
function invalidateCache(collectionName?: string) {
  if (collectionName) {
    // Invalidate specific collection
    delete collectionCache[collectionName];
  } else {
    // Invalidate all collections
    Object.keys(collectionCache).forEach(key => {
      delete collectionCache[key];
    });
  }
}

export { connectToDatabase, client, ObjectId, toObjectId, fromObjectId, fromObjectIdArray, invalidateCache };
