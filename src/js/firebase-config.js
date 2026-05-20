import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCN7o8LY7LhcALk7qBFio5pCAmr2AbHing",
  authDomain: "liemresearch.firebaseapp.com",
  projectId: "liemresearch",
  storageBucket: "liemresearch.firebasestorage.app",
  messagingSenderId: "666057393266",
  appId: "1:666057393266:web:57b7095f62acabcf57eeeb",
  measurementId: "G-FE40F17P9D"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export let analytics = null;

isSupported()
  .then((supported) => {
    analytics = supported ? getAnalytics(app) : null;
  })
  .catch(() => {
    analytics = null;
  });