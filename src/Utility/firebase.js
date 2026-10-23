import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth"; //to use authentication

import "firebase/compat/firestore"; //to use firestore database
import "firebase/compat/auth"; //to use firestore database
//  web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC78PcQyL1YasRvtW-Ugtl8YQbWq_-Gr70",
  authDomain: "clone-9d91c.firebaseapp.com",
  projectId: "clone-9d91c",
  storageBucket: "clone-9d91c.firebasestorage.app",
  messagingSenderId: "312171990207",
  appId: "1:312171990207:web:a575a7cc77d22f6ee8ca0a",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = app.firestore();
