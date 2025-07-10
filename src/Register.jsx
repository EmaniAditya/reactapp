import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

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

    const handleGoogleLogin = () => {
        // Implement your Google login logic here (Firebase or OAuth)
        setMessage("Google login clicked (not yet functional)");
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
