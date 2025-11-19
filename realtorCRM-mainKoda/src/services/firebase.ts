// ⚠️ Замени на свои данные из Firebase Console!
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDn24WoPngXE49Ax0ETVV51XolhTbfvo74",
  authDomain: "realtor-crm-e217e.firebaseapp.com",
  projectId: "realtor-crm-e217e",
  storageBucket: "realtor-crm-e217e.firebasestorage.app",
  messagingSenderId: "73073318558",
  appId: "1:73073318558:web:af820f8dd3b1e67ec7f98f",
  measurementId: "G-RJT0XV28BF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);