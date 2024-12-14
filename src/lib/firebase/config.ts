import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBBMCXwjLt3hGRvC7ZDf4Crj-ZOK_A1SwQ",
  authDomain: "prop-management-4f1cc.firebaseapp.com",
  projectId: "prop-management-4f1cc",
  storageBucket: "prop-management-4f1cc.firebasestorage.app",
  messagingSenderId: "494993300962",
  appId: "1:494993300962:web:cbcea8be2d42478de5adbb",
  measurementId: "G-BHVBHTCZ97"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

export default app;