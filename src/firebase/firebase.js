// firebase/firebase.js

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBAUhQnvst1RvP-JQfcoeR80ui4VstKK6Y",
  authDomain: "testing-88bc3.firebaseapp.com",
  databaseURL: "https://testing-88bc3-default-rtdb.firebaseio.com",
  projectId: "testing-88bc3",
  storageBucket: "testing-88bc3.appspot.com",
  messagingSenderId: "633592353172",
  appId: "1:633592353172:web:5fa3678eacc9125a90bf81",
  measurementId: "G-DX55Q8CSS2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const dbf = getFirestore(app); // Firestore instance
export const db = getDatabase(app); // Realtime Database
export const storage = getStorage(app); // Firebase Storage

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword };

export default app;