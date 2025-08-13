import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAT5-BVRcqn_XGanvEswSmy9giy20GIUmc",
  authDomain: "mysamplethunders.firebaseapp.com",
  projectId: "mysamplethunders",
  storageBucket: "mysamplethunders.firebasestorage.app",
  messagingSenderId: "702127793371",
  appId: "1:702127793371:web:08644476f57c5835bb58fe",
  measurementId: "G-RESBBLHF8E"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
