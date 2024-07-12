// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"
import {  getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyD3PgRYo0tVGLe3c9xJC9b6QIax8QE3F0w",
  authDomain: "chat-app-e0f18.firebaseapp.com",
  databaseURL: "https://chat-app-e0f18-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chat-app-e0f18",
  storageBucket: "chat-app-e0f18.appspot.com",
  messagingSenderId: "768054060285",
  appId: "1:768054060285:web:b8c5ebca2910f3105a8a94"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
