// Firebase imports
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDxgqi9beqrM_L-LFVWsG1Njq0QBQ5C7I4",
  authDomain: "barcha-medicous.firebaseapp.com",
  databaseURL: "https://barcha-medicous-default-rtdb.firebaseio.com",
  projectId: "barcha-medicous",
  storageBucket: "barcha-medicous.firebasestorage.app",
  messagingSenderId: "351174899452",
  appId: "1:351174899452:web:7198e4509710b7fec20979",
  measurementId: "G-77LNJWGRTX",
};

// Initialize
const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);

export default app;
