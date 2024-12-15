const { 
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  doc
} = require('firebase/firestore');
const { db } = require('../src/lib/firebase/config');
const { COLLECTIONS } = require('../src/lib/firebase/collections');

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
