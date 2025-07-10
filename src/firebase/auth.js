import { auth } from "./firebase";

import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

//export const doCreateUserWithEmailAndPassword = async (email, password) => {
//    return createUserWithEmailAndPassword(auth, email, password);
//};

//export const doSignInWithEmailAndPassword = (email, password) => {
//    return signInWithEmailAndPassword(auth, email, password);
//};

export const createTestAccount = async () => {
  try {
    // Create a test user for emulator testing
    const email = "test@example.com";
    const password = "password123";
    
    console.log("Creating test account in emulator:", email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Test account created:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log("Test user already exists, try signing in");
      return signInWithEmailAndPassword(auth, "test@example.com", "password123")
        .then(result => result.user);
    }
    console.error("Error creating test account:", error);
    throw error;
  }
};

export const doSignInWithGoogleRedirect = async () => {
    console.log('Starting Google sign-in with redirect...');
    const provider = new GoogleAuthProvider();
    
    // Configure the provider
    provider.setCustomParameters({
        prompt: 'select_account'
    });
    
    // Add scopes
    provider.addScope('email');
    provider.addScope('profile');
    
    try {
        await signInWithRedirect(auth, provider);
        console.log('Redirect initiated - user will leave page now');
        // No return here as this will redirect the user away from the page
    } catch (error) {
        console.error("Google Sign-In Redirect Error:", error);
        throw new Error(`Redirect sign-in failed: ${error.message}`);
    }
};

export const getGoogleRedirectResult = async () => {
    try {
        const result = await getRedirectResult(auth);
        if (result) {
            console.log('Redirect sign-in successful:', result.user);
            return result.user;
        }
        return null;
    } catch (error) {
        console.error("Google Redirect Result Error:", error);
        throw new Error(`Failed to get redirect result: ${error.message}`);
    }
};

export const doSignInWithGoogle = async () => {
    console.log('Starting Google sign-in process...');
    console.log('Current URL:', window.location.href);
    
    const provider = new GoogleAuthProvider();
    
    // Configure the provider for better compatibility
    provider.setCustomParameters({
        prompt: 'select_account'
    });
    
    // Add scopes if needed
    provider.addScope('email');
    provider.addScope('profile');
    
    console.log('Provider configured, attempting sign-in...');
    
    try {
        // Check if we're on HTTP or HTTPS
        if (window.location.protocol === 'http:') {
            console.log('Using HTTP mode for sign-in');
            
            // For HTTP, we need to use a different approach
            // We'll use redirect method which works better with HTTP
            return await doSignInWithGoogleRedirect();
        } else {
            console.log('Using HTTPS mode for sign-in');
            const result = await signInWithPopup(auth, provider);
            console.log('Sign-in successful:', result.user);
            return result.user;
        }
    } catch (error) {
        console.error("Google Sign-In Error Details:", {
            code: error.code,
            message: error.message,
            email: error.email,
            credential: error.credential
        });
        
        // Handle specific error types
        if (error.code === 'auth/popup-closed-by-user') {
            throw new Error('Sign-in was cancelled by user');
        } else if (error.code === 'auth/popup-blocked') {
            throw new Error('Popup was blocked by browser. Please allow popups for this site.');
        } else if (error.code === 'auth/unauthorized-domain') {
            throw new Error('This domain is not authorized for sign-in. Please contact support.');
        } else if (error.code === 'auth/network-request-failed') {
            throw new Error('Network error. Please check your internet connection.');
        } else {
            throw new Error(`Sign-in failed: ${error.message}`);
        }
    }
};

export const doSignOut = () => {
    return auth.signOut();
};

//export const doPasswordReset = (email) => {
//    return sendPasswordResetEmail(auth, email);
//};

//export const doPasswordChange = (password) => {
//    return updatePassword(auth, currentUser, password);
//};

//export const doSendEmailVerification = () => {
//    return sendEmailVerification(auth, currentUser, {
//        url: `${window.location.origin}/home`,
//    });
//};