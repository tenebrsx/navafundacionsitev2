import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace with your Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyATAxvKP2rd4wLiyBXljuKp-zGhbjOgfPs",
    authDomain: "navafundacionorg.firebaseapp.com",
    projectId: "navafundacionorg",
    storageBucket: "navafundacionorg.firebasestorage.app",
    messagingSenderId: "484460050201",
    appId: "1:484460050201:web:99697d14c9708268eef788"
};



// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, storage, googleProvider };
