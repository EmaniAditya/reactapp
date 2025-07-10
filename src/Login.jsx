// src/Login.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
//import { auth, provider } from "./firebase/firebase";
//import { signInWithPopup } from "firebase/auth";
import "./Auth.css";
import { doSignInWithGoogle, doSignInWithGoogleRedirect, getGoogleRedirectResult, createTestAccount } from './firebase/auth';
//import { useAuth } from "../../../contexts/authContext";
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [isTestingEmulator, setIsTestingEmulator] = useState(false)
    //const [errorMessage, setErrorMessage] = useState("")\
    const navigate = useNavigate();
    
    // Check for redirect result when component mounts
    useEffect(() => {
        const checkRedirectResult = async () => {
            try {
                const user = await getGoogleRedirectResult();
                if (user) {
                    console.log("Redirect sign-in completed successfully", user);
                    
                    // Store user data in localStorage
                    const userData = {
                        email: user.email,
                        name: user.displayName,
                        uid: user.uid,
                        photoURL: user.photoURL,
                    };
                    
                    localStorage.setItem("loggedInUser", JSON.stringify(userData));
                    
                    // Add user to users array if not exists
                    const users = JSON.parse(localStorage.getItem("users")) || [];
                    const exists = users.some((u) => u.email === user.email);
                    if (!exists) {
                        users.push({ email: user.email, password: null, name: user.displayName });
                        localStorage.setItem("users", JSON.stringify(users));
                    }
                    
                    // Navigate to home page
                    navigate("/home");
                }
            } catch (error) {
                console.error("Error getting redirect result:", error);
                alert("Failed to complete Google sign-in. Please try again.");
            }
        };
        
        checkRedirectResult();
    }, [navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const foundUser = users.find(
            (user) => user.email === email && user.password === password
        );

        if (foundUser) {
            localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
            navigate("/home");
        } else {
            alert("Invalid credentials");
        }
    };

    const onGoogleSignIn = async () => {
        if (!isSigningIn) {
            setIsSigningIn(true);
            try {
                // Check if we're on HTTP
                if (window.location.protocol === 'http:') {
                    console.log('Using HTTP mode - will redirect for sign-in');
                    // For HTTP, we'll use redirect which works better
                    await doSignInWithGoogleRedirect();
                    // The redirect will be handled by useEffect when user returns
                    return; // Don't proceed further as we're redirecting
                }
                
                // For HTTPS, proceed with popup
                const user = await doSignInWithGoogle();
                
                // Store user data in localStorage
                const userData = {
                    email: user.email,
                    name: user.displayName,
                    uid: user.uid,
                    photoURL: user.photoURL,
                };
                
                localStorage.setItem("loggedInUser", JSON.stringify(userData));

                // Add user to users array if not exists
                const users = JSON.parse(localStorage.getItem("users")) || [];
                const exists = users.some((u) => u.email === user.email);
                if (!exists) {
                    users.push({ email: user.email, password: null, name: user.displayName });
                    localStorage.setItem("users", JSON.stringify(users));
                }

                // Navigate to home page
                navigate("/home");
            } catch (err) {
                console.error("Google Sign-In Failed:", err);
                
                // If popup fails, try redirect method
                if (err.message.includes('popup') || err.message.includes('blocked')) {
                    try {
                        alert("Popup failed, trying redirect method...");
                        await doSignInWithGoogleRedirect();
                        // The redirect will be handled by useEffect when user returns
                    } catch (redirectErr) {
                        console.error("Redirect also failed:", redirectErr);
                        alert("Both popup and redirect methods failed. Please check your browser settings.");
                        setIsSigningIn(false);
                    }
                } else {
                    // Don't show alert for user-cancelled sign-in
                    if (err.message !== 'Sign-in was cancelled by user') {
                        alert(err.message || "Google sign-in failed. Please try again.");
                    }
                    setIsSigningIn(false);
                }
            }
        }
    };

    const handleEmulatorTest = async () => {
        if (!isTestingEmulator) {
            setIsTestingEmulator(true);
            try {
                const user = await createTestAccount();
                
                // Store user data in localStorage
                const userData = {
                    email: user.email,
                    name: user.displayName || "Test User",
                    uid: user.uid,
                    photoURL: user.photoURL || null,
                };
                
                localStorage.setItem("loggedInUser", JSON.stringify(userData));

                // Add user to users array if not exists
                const users = JSON.parse(localStorage.getItem("users")) || [];
                const exists = users.some((u) => u.email === user.email);
                if (!exists) {
                    users.push({ email: user.email, password: null, name: userData.name });
                    localStorage.setItem("users", JSON.stringify(users));
                }

                // Navigate to home page
                navigate("/home");
            } catch (error) {
                console.error("Emulator Test Failed:", error);
                alert("Failed to test with emulator: " + error.message);
            } finally {
                setIsTestingEmulator(false);
            }
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-box" onSubmit={handleLogin}>
                <h2 className="title">Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input"
                />

                <button type="submit" className="auth-button">Login</button>

                {/* Google Sign-in Button */}
                <div className="google-button-wrapper">
                    <button
                        type="button"
                        className="google-icon-only"
                        aria-label="Sign in with Google"
                        onClick={() => { onGoogleSignIn() } }
                    >
                        <img
                            src="https://img.icons8.com/color/48/000000/google-logo.png"
                            alt="Google"
                            className="google-logo-circle"
                        />
                    </button>
                </div>

                {/* Emulator Test Button */}
                <button
                    type="button"
                    className="auth-button emulator-test-button"
                    onClick={handleEmulatorTest}
                    disabled={isTestingEmulator}
                >
                    {isTestingEmulator ? "Testing..." : "Test with Emulator"}
                </button>

                <Link to="/register" className="link-button">Register</Link>
                <button
                    type="button"
                    className="link-button"
                    onClick={() => alert("Forgot Password feature coming soon!")}
                >
                    Forgot Password?
                </button>
            </form>
        </div>
    );
}

export default Login;
