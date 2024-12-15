import { initializeApp } from 'firebase/app';
import { 
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  doc
} from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: "prop-management-4f1cc.firebaseapp.com",
  projectId: "prop-management-4f1cc",
  storageBucket: "prop-management-4f1cc.appspot.com",
  messagingSenderId: "397286406249",
  appId: "1:397286406249:web:19bef3f0e8c3c1c6e3a8d7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collection names
const COLLECTIONS = {
  PROPERTIES: 'properties',
  TENANTS: 'tenants'
};

// Test function to verify indexes and updates
async function testFirestore() {
  try {
    // Test 1: Create a property with status and timestamps
    console.log('Test 1: Creating property...');
    const propertyData = {
      name: 'Test Property',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const propertyRef = await addDoc(collection(db, COLLECTIONS.PROPERTIES), propertyData);
    console.log('Property created with ID:', propertyRef.id);

    // Test 2: Update the property
    console.log('\nTest 2: Updating property...');
    const updateData = {
      name: 'Updated Test Property',
      status: 'inactive',
      updated_at: new Date().toISOString()
    };
    
    await updateDoc(doc(db, COLLECTIONS.PROPERTIES, propertyRef.id), updateData);
    console.log('Property updated successfully');

    // Test 3: Query using composite index (status + created_at)
    console.log('\nTest 3: Testing composite index query...');
    const q = query(
      collection(db, COLLECTIONS.PROPERTIES),
      where('status', '==', 'inactive'),
      orderBy('created_at', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    console.log('Query returned', querySnapshot.size, 'documents');
    querySnapshot.forEach(doc => {
      console.log('Document data:', doc.data());
    });

    // Test 4: Create a tenant with similar structure
    console.log('\nTest 4: Creating tenant...');
    const tenantData = {
      name: 'Test Tenant',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const tenantRef = await addDoc(collection(db, COLLECTIONS.TENANTS), tenantData);
    console.log('Tenant created with ID:', tenantRef.id);

    // Test 5: Query tenants using composite index
    console.log('\nTest 5: Testing tenant composite index query...');
    const tenantQuery = query(
      collection(db, COLLECTIONS.TENANTS),
      where('status', '==', 'active'),
      orderBy('created_at', 'desc')
    );
    
    const tenantSnapshot = await getDocs(tenantQuery);
    console.log('Query returned', tenantSnapshot.size, 'documents');
    tenantSnapshot.forEach(doc => {
      console.log('Document data:', doc.data());
    });

    console.log('\nAll tests completed successfully!');
    
  } catch (error) {
    console.error('Error during tests:', error);
    throw error;
  }
}

// Run the tests
testFirestore().catch(console.error);
