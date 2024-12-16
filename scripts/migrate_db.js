import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import service account
const serviceAccountPath = join(__dirname, '..', 'prop-management-4f1cc-firebase-adminsdk-ekiy1-472ef565cf.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});

const firestore = getFirestore();

// Collection names and their initial data
const COLLECTIONS = {
  users: [
    {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  properties: [
    {
      name: 'Sample Property',
      address: '123 Main St',
      status: 'available',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  property_units: [
    {
      property_id: '', // Will be updated with actual property ID
      unit_number: 'A1',
      status: 'available',
      rent: 1000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  tenants: [],
  leases: [],
  maintenance: [],
  payments: [],
  documents: []
};

// Validation schemas
const schemas = {
  user: {
    required: ['email', 'name', 'role'],
    types: {
      email: 'string',
      name: 'string',
      role: ['admin', 'property_manager', 'tenant']
    }
  },
  property: {
    required: ['name', 'address', 'status'],
    types: {
      name: 'string',
      address: 'string',
      status: ['available', 'occupied', 'maintenance']
    }
  }
};

// Validation function
function validateData(data, schema) {
  if (!schema) return { valid: true };

  const errors = [];

  // Check required fields
  for (const field of schema.required) {
    if (!data[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Check field types
  for (const [field, type] of Object.entries(schema.types)) {
    if (data[field]) {
      if (Array.isArray(type)) {
        if (!type.includes(data[field])) {
          errors.push(`Invalid value for ${field}. Must be one of: ${type.join(', ')}`);
        }
      } else if (typeof data[field] !== type) {
        errors.push(`Invalid type for ${field}. Expected ${type}, got ${typeof data[field]}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Create collection function
async function createCollection(name, initialData) {
  console.log(`Creating collection: ${name}`);
  
  try {
    const collectionRef = firestore.collection(name);
    
    // Add initial data
    for (const data of initialData) {
      const schema = schemas[name.replace('s', '')];
      const validation = validateData(data, schema);
      
      if (!validation.valid) {
        console.error(`Validation failed for ${name}:`, validation.errors);
        continue;
      }

      await collectionRef.add(data);
    }

    console.log(`Successfully created collection: ${name}`);
    return true;
  } catch (error) {
    console.error(`Failed to create collection ${name}:`, error);
    return false;
  }
}

// Main function
async function setupDatabase() {
  console.log('Starting database setup...');
  const results = {};

  try {
    // Create collections in order
    for (const [name, data] of Object.entries(COLLECTIONS)) {
      results[name] = await createCollection(name, data);
    }

    // Update property_units with actual property ID
    if (results.properties && results.property_units) {
      const propertiesSnapshot = await firestore.collection('properties').limit(1).get();
      if (!propertiesSnapshot.empty) {
        const propertyId = propertiesSnapshot.docs[0].id;
        const unitsSnapshot = await firestore.collection('property_units').get();
        
        for (const doc of unitsSnapshot.docs) {
          await doc.ref.update({ property_id: propertyId });
        }
      }
    }

    console.log('Database setup completed successfully');
    console.log('Results:', results);

  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

// Run setup
setupDatabase().catch(console.error);
