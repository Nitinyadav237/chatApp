// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"
import {  getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyATLxZh34MNAj1OJGti0muUWgPkbPJyaJw",
  authDomain: "chattingapp-e6c49.firebaseapp.com",
  projectId: "chattingapp-e6c49",
  storageBucket: "chattingapp-e6c49.appspot.com",
  messagingSenderId: "609311268871",
  appId: "1:609311268871:web:4d01ff26d8816782a74aa2"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
