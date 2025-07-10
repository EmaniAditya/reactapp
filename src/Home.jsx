// src/Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import logo from "./assets/logo.png";

const products = {
    Electronics: [
        { id: 1, title: "Wireless Headphones", price: 1999, image: "https://images.unsplash.com/photo-1625245488600-f03fef636a3c?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", rating: 4 },
        { id: 2, title: "Smartwatch", price: 2999, image: "https://images.unsplash.com/photo-1654208398202-1edef1cf23b5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", rating: 5 },
    ],
    Home: [
        { id: 3, title: "Mixer Grinder", price: 2499, image: "https://images.pexels.com/photos/1450903/pexels-photo-1450903.jpeg", rating: 4 },
        { id: 4, title: "Air Purifier", price: 5999, image: "https://images.unsplash.com/photo-1607748626454-6aed2e006d5b?q=80&w=767&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", rating: 5 },
    ],
    Fashion: [
        { id: 5, title: "Running Shoes", price: 1799, image: "https://images.unsplash.com/photo-1738959142598-d95683c18a65?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", rating: 4 },
        { id: 6, title: "Casual Shirt", price: 999, image: "https://images.unsplash.com/photo-1666358777322-a25eda95848f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", rating: 3 },
    ],
};

const Home = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [searchFocused, setSearchFocused] = useState(false);

    useEffect(() => {
        localStorage.setItem("allProducts", JSON.stringify(Object.values(products).flat()));
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(savedCart);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("loggedInUser");
        navigate("/");
    };

    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id);
        let newCart;

        if (existing) {
            newCart = cart.map(item =>
                item.id === product.id ? { ...item, qty: item.qty + 1 } : item
            );
        } else {
            // Ensure all fields including image are preserved
            newCart = [...cart, { ...product, qty: 1 }];
        }

        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };



    const filteredCategories = selectedCategory === "All"
        ? Object.entries(products)
        : [[selectedCategory, products[selectedCategory]]];

    const filteredItems = (items) =>
        items.filter((item) =>
            item.title.toLowerCase().includes(search.toLowerCase())
        );

    return (
        <div className="ecom-page full-width">
            <div className="ecom-header">
                <div className="ecom-logo" onClick={() => navigate("/home")}>
                    <img src={logo} alt="ReactShop Logo" className="logo-img" />
                </div>

                <div
                    className={`search-bar ${searchFocused ? "focused" : ""}`}
                    onMouseEnter={() => setSearchFocused(true)}
                    onMouseLeave={() => setSearchFocused(false)}
                >
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="header-actions">
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                    <span
                        className="cart-count"
                        onClick={() => navigate("/cart")}
                        style={{ cursor: "pointer" }}
                    >
                        🛒 {cart.length}
                    </span>
                </div>
            </div>

            <div className="category-buttons">
                <button onClick={() => setSelectedCategory("All")}>All</button>
                {Object.keys(products).map((cat) => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)}>
                        {cat}
                    </button>
                ))}
            </div>

            {filteredCategories.map(([category, items]) => (
                <div key={category} className="category-section">
                    <h2 className="category-title">{category}</h2>
                    <div className="product-list">
                        {filteredItems(items).map((product) => (
                            <div
                                key={product.id}
                                className="product-card"
                                onClick={() => navigate(`/product/${product.id}`)}
                            >
                                <img src={product.image} alt={product.title} />
                                <h3>{product.title}</h3>
                                <p>₹{product.price}</p>
                                <p>{"⭐".repeat(product.rating)}</p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // prevent navigating to product page
                                        addToCart(product);
                                    }}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Home;
