// src/Cart.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(savedCart);
    }, []);

    const updateCart = (newCart) => {
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    const handleRemove = (id) => {
        const updated = cart.filter(item => item.id !== id);
        updateCart(updated);
    };

    const increaseQty = (id) => {
        const updated = cart.map(item =>
            item.id === id ? { ...item, qty: item.qty + 1 } : item
        );
        updateCart(updated);
    };

    const decreaseQty = (id) => {
        const updated = cart.map(item =>
            item.id === id ? { ...item, qty: Math.max(1, item.qty - 1) } : item
        );
        updateCart(updated);
    };

    const total = cart.reduce((sum, item) => {
        const price = Number(item.price);
        const qty = Number(item.qty || 1);
        return sum + (isNaN(price) ? 0 : price * qty);
    }, 0);

    return (
        <div className="ecom-page full-width">
            <div className="ecom-header">
                <div className="ecom-logo" onClick={() => navigate("/home")}>ReactShop 🛒</div>
                <div className="header-actions">
                    <button className="logout-button" onClick={() => navigate("/home")}>Back to Home</button>
                </div>
            </div>

            <div className="cart-container">
                <h2>Your Cart</h2>
                {cart.length === 0 ? (
                    <p style={{ color: "#000" }}>No items in cart</p>
                ) : (
                    <div className="cart-list">
                        {cart.map(item => (
                            <div key={item.id} className="cart-card">
                                <img
                                    src={item.image || "https://via.placeholder.com/150"}
                                    alt={item.title}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://via.placeholder.com/150";
                                    }}
                                    style={{
                                        width: "120px",
                                        height: "120px",
                                        objectFit: "cover",
                                        borderRadius: "10px"
                                    }}
                                />
                                <div className="cart-info">
                                    <h3 style={{ color: "#000" }}>{item.title}</h3>
                                    <p style={{ color: "#000" }}>₹{item.price}</p>
                                    <p style={{ color: "#000" }}>Quantity:</p>
                                    <div className="qty-buttons">
                                        <button onClick={() => decreaseQty(item.id)}>-</button>
                                        <span>{item.qty}</span>
                                        <button onClick={() => increaseQty(item.id)}>+</button>
                                    </div>
                                    <button onClick={() => handleRemove(item.id)} className="remove-btn">Remove</button>
                                </div>
                            </div>
                        ))}
                        <div className="cart-total" style={{ color: "#000" }}>
                            Total: ₹{total}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;
