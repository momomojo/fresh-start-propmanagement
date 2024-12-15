  const admin = require('firebase-admin');

// Initialize the Firebase Admin SDK
const serviceAccount = require('./prop-management-4f1cc-firebase-adminsdk-ekiy1-472ef565cf.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://prop-management-4f1cc.firebaseio.com'
});

const db = admin.firestore();

// Add a document to 'test_collection'
db.collection('test_collection').add({
  test_field: 'test_value'
})
.then((docRef) => {
  console.log('Document written with ID: ', docRef.id);
})
.catch((error) => {
  console.error('Error adding document: ', error);
});
