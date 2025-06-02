// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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

export { auth, provider, signInWithPopup };
