import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { doSignInWithGoogle, doSignInWithGoogleRedirect, getGoogleRedirectResult } from './firebase/auth';

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [message, setMessage] = useState("");
    const [isSigningIn, setIsSigningIn] = useState(false);
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
                setMessage("Failed to complete Google sign-in. Please try again.");
            }
        };
        
        checkRedirectResult();
    }, [navigate]);

    const handleRegister = (e) => {
        e.preventDefault();
        if (!email || !password) return setMessage("Please fill in all fields.");
        if (password !== confirm) return setMessage("Passwords do not match.");

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const exists = users.some((u) => u.email === email);

        if (exists) return setMessage("User already exists");

        const newUser = { email, password };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        setMessage("Registered successfully!");
        setTimeout(() => navigate("/"), 1500);
    };

    const handleGoogleLogin = async () => {
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
                        setMessage("Popup failed, trying redirect method...");
                        await doSignInWithGoogleRedirect();
                        // The redirect will be handled by useEffect when user returns
                    } catch (redirectErr) {
                        console.error("Redirect also failed:", redirectErr);
                        setMessage("Both popup and redirect methods failed. Please check your browser settings.");
                        setIsSigningIn(false);
                    }
                } else {
                    // Don't show alert for user-cancelled sign-in
                    if (err.message !== 'Sign-in was cancelled by user') {
                        setMessage(err.message || "Google sign-in failed. Please try again.");
                    }
                    setIsSigningIn(false);
                }
            }
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-box" onSubmit={handleRegister}>
                <h2 className="title">Register</h2>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Email"
                    className="input"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Password"
                    className="input"
                />
                <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    placeholder="Confirm Password"
                    className="input"
                />
                <button type="submit" className="auth-button">Register</button>

                {/* Circular Google Login Button */}
                <button
                    type="button"
                    className="google-button-icon"
                    onClick={handleGoogleLogin}
                    aria-label="Sign up with Google"
                >
                    <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google logo"
                        className="google-logo-circle"
                    />
                </button>

                <Link to="/" className="link-button">Back to Login</Link>
                {message && <p className="message-text">{message}</p>}
            </form>
        </div>
    );
}

export default Register;
