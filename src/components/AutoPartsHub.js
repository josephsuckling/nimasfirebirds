import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAutoParts } from '../api/FirestoreAPI';
import '../css/AutoPartsHub.css';

function AutoPartsHub() {
    const [autoParts, setAutoParts] = useState([]);
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false); // State to manage cart visibility
    const navigate = useNavigate();

    useEffect(() => {
        fetchAutoParts().then(parts => {
            setAutoParts(parts);
        }).catch(error => {
            console.error("Error loading auto parts:", error);
        });
    }, []);

    const addToCart = (part) => {
        const exists = cart.find(item => item.id === part.id);
        if (exists) {
            setCart(cart.map(item => item.id === part.id ? {...item, qty: item.qty + 1} : item));
        } else {
            setCart([...cart, {...part, qty: 1}]);
        }
    };

    const removeFromCart = (partId) => {
        const exists = cart.find(item => item.id === partId);
        if (exists.qty === 1) {
            setCart(cart.filter(item => item.id !== partId));
        } else {
            setCart(cart.map(item => item.id === partId ? {...item, qty: item.qty - 1} : item));
        }
    };

    const toggleCart = () => {
        setShowCart(!showCart);
    };

    const handleCreateNewPart = () => {
        navigate('/create-autopart');
    };

    const handleCheckout = () => {
        const orderDetails = {
            items: cart,
            total: cart.reduce((total, item) => total + item.qty * item.price, 0)
        };
        console.log(orderDetails);
    };

    return (
        <div className="auto-parts-hub">
            <div className="auto-parts-container">
                {autoParts.map(part => (
                    <div key={part.id} className="auto-part-item">
                        <h3>Category: {part.category}</h3>
                        <p><strong>Dimensions:</strong> {part.dimensions}</p>
                        <p><strong>Weight:</strong> {part.weight}</p>
                        <p><strong>Color:</strong> {part.color}</p>
                        <p><strong>Material:</strong> {part.material}</p>
                        <p><strong>Compatible Vehicle Models:</strong> {part.models}</p>
                        <p><strong>Manufacturer:</strong> {part.manufacturer}</p>
                        <p><strong>Warranty:</strong> {part.warranty}</p>
                        <div className="auto-part-images">
                            {part.imageUrls.map((url, index) => (
                                <img key={index} src={url} alt="Auto Part" style={{ width: "100px", margin: "10px" }} />
                            ))}
                        </div>
                        <button onClick={() => addToCart(part)}>Add to Cart</button>
                    </div>
                ))}
            </div>
            <button className="create-part-button" onClick={handleCreateNewPart}>+</button>
            <button className="cart-button" onClick={toggleCart}>Cart</button>
            {showCart && (
                <div className="cart-overlay">
                    <h2>Cart</h2>
                    {cart.map(item => (
                        <div key={item.id}>
                            <h3>{item.name} x {item.qty}</h3>
                            <p>{item.category}</p>
                            <button onClick={() => removeFromCart(item.id)}>Remove</button>
                        </div>
                    ))}
                    <h2>Total: ${cart.reduce((total, item) => total + item.qty * item.price, 0)}</h2>
                    <button onClick={handleCheckout}>Checkout</button>
                    <button onClick={toggleCart}>Close Cart</button>
                </div>
            )}
        </div>
    );
}

export default AutoPartsHub;
