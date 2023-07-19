// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"
import {  getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyA6MTyzxPP3cbAz5yfrpPQFJTIJnC8yKlk",
  authDomain: "chatapp-64342.firebaseapp.com",
  projectId: "chatapp-64342",
  storageBucket: "chatapp-64342.appspot.com",
  messagingSenderId: "691053756868",
  appId: "1:691053756868:web:74ecbc588f598fb918e491"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
