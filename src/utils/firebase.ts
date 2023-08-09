import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD4lTWXABvoP3GpQ3aWmopcqXiAMOmCOZw",
  authDomain: "threads-app-337be.firebaseapp.com",
  projectId: "threads-app-337be",
  storageBucket: "threads-app-337be.appspot.com",
  messagingSenderId: "152722539202",
  appId: "1:152722539202:web:c79d1da2094e05afeb315b",
  measurementId: "G-QD3S2G4PSF",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
