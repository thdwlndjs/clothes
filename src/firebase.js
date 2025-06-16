// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import {getMessaging} from "firebase/messaging";


const firebaseConfig = {
  apiKey: "AIzaSyDbmnQqQPDKYQz8usU1RD3vAgqlpMFG8d4",
  authDomain: "clothes-1e339.firebaseapp.com",
  projectId: "clothes-1e339",
  storageBucket: "clothes-1e339.firebasestorage.app",
  messagingSenderId: "725626993177",
  appId: "1:725626993177:web:74d48d02df818f75fac888",
  measurementId: "G-VWEFTV5HJZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // ✅ 로그인 등에 사용
const provider = new GoogleAuthProvider();
const messaging = getMessaging(app);

export const db = getFirestore(app);
export const functions = getFunctions(app);

export const checkProductStatus = httpsCallable(functions, 'checkProductStatus');

export { auth, provider, signInWithPopup, messaging };
// export const firebaseProjectId = "clothes-1e339";


