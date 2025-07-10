// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyASfKnHN9TJgQPBl_6auGFeiKZvrj8Vqm4",
    authDomain: "auth-3fe42.firebaseapp.com",
    projectId: "auth-3fe42",
    storageBucket: "auth-3fe42.appspot.com",
    messagingSenderId: "534085062219",
    appId: "1:534085062219:web:aab2ea790f0bc1c0d387ce",
    measurementId: "G-KLBYX4THK1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configure auth for local development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Use auth emulator for local development
    if (window.location.protocol === 'http:') {
        try {
            // Connect to auth emulator - this allows Google sign-in to work on HTTP
            connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
            console.log("Using Firebase Auth Emulator for HTTP development");
        } catch (error) {
            console.error("Failed to connect to Auth Emulator:", error);
        }
    }
    
    auth.useDeviceLanguage();
    console.log('Firebase configured for localhost development');
    console.log('Current URL:', window.location.href);
}

const provider = new GoogleAuthProvider();

export { app, auth, provider };
