// src/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Auth.css";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];
        const found = allProducts.find(p => p.id === Number(id));
        setProduct(found);
    }, [id]);

    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existing = cart.find(item => item.id === product.id);
        let newCart;
        if (existing) {
            newCart = cart.map(item =>
                item.id === product.id ? { ...item, qty: item.qty + 1 } : item
            );
        } else {
            newCart = [...cart, { ...product, qty: 1 }];
        }
        localStorage.setItem("cart", JSON.stringify(newCart));
        alert("Added to cart");
    };

    if (!product) return <p>Loading...</p>;

    return (
        <div className="ecom-page full-width">
            <div className="ecom-header">
                <div className="ecom-logo" onClick={() => navigate("/home")}>ReactShop 🛒</div>
                <div className="header-actions">
                    <button className="logout-button" onClick={() => navigate("/cart")}>Go to Cart</button>
                </div>
            </div>

            <div className="product-details-container">
                <img src={product.image} alt={product.title} />
                <div className="product-details-info">
                    <h2>{product.title}</h2>
                    <p><strong>Price:</strong> ₹{product.price}</p>
                    <p><strong>Rating:</strong> {"⭐".repeat(product.rating)}</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel lorem eget nisl pulvinar pretium.</p>
                    <button onClick={addToCart}>Add to Cart</button>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
