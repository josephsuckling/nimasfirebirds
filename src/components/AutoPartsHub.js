// src/components/AutoPartsHub.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAutoParts, fetchUserDetails, getCategories } from '../api/FirestoreAPI';
import '../css/AutoPartsHub.css';

function AutoPartsHub() {
  const [autoParts, setAutoParts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null); // New state for order details
  const navigate = useNavigate();

  const userID = localStorage.getItem("userID");

  useEffect(() => {
    fetchAutoParts().then(parts => {
      setAutoParts(parts);
    }).catch(error => {
      console.error("Error loading auto parts:", error);
    });

    getCategories().then(cats => {
      setCategories(cats);
    }).catch(error => {
      console.error("Error loading categories:", error);
    });
  }, []);

  const addToCart = (part) => {
    if (!part.inStock) {
      alert("This part is out of stock.");
      return;
    }
    const exists = cart.find(item => item.id === part.id);
    if (exists) {
      setCart(cart.map(item => item.id === part.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...part, qty: 1 }]);
    }
  };

  const removeFromCart = (partId) => {
    const exists = cart.find(item => item.id === partId);
    if (exists.qty === 1) {
      setCart(cart.filter(item => item.id !== partId));
    } else {
      setCart(cart.map(item => item.id === partId ? { ...item, qty: item.qty - 1 } : item));
    }
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const handleCreateNewPart = () => {
    navigate('/create-autopart');
  };

  const handleCheckout = async () => {
    const details = await fetchUserDetails(userID);
    setUserDetails(details);

    const purchaseOrderDate = new Date().toLocaleDateString();
    const orderNumber = `ORD-${Math.floor(Math.random() * 1000000)}`;
    const priceTotal = cart.reduce((total, item) => total + item.qty * item.cost, 0).toFixed(2);
    const discountRate = 0.10; // 10% discount
    const discountedPrice = (priceTotal * (1 - discountRate)).toFixed(2);

    setOrderDetails({
      purchaseOrderDate,
      orderNumber,
      priceTotal: discountedPrice,
      discount: 'NASCAR Week 10%',
      salesRep: 'Sarah Harper',
      orderStatus: 'Processing',
      customerNotes: ''
    });

    setShowCheckout(true);
  };

  const handleCheckoutSubmit = (event) => {
    event.preventDefault();
    console.log("Order placed:", { userDetails, items: cart, orderDetails });
    alert("Order placed successfully!");
    setShowCheckout(false);
  };

  return (
    <div className="auto-parts-hub">
      <div className="auto-parts-container">
        {autoParts.map(part => (
          <div key={part.id} className="auto-part-item">
            <h3>Category: {part.category}</h3>
            <p><strong>Name:</strong> {part.name}</p>
            <p><strong>Dimensions:</strong> {part.dimensions}</p>
            <p><strong>Weight:</strong> {part.weight}</p>
            <p><strong>Color:</strong> {part.color}</p>
            <p><strong>Material:</strong> {part.material}</p>
            <p><strong>Compatible Vehicle Models:</strong> {part.models}</p>
            <p><strong>Manufacturer:</strong> {part.manufacturer}</p>
            <p><strong>Warranty:</strong> {part.warranty}</p>
            <p><strong>Cost:</strong> ${part.cost}</p>
            <p><strong>Description:</strong> {part.description}</p>
            <p><strong>In Stock:</strong> {part.inStock ? 'Yes' : 'No'}</p>
            <div className="auto-part-images">
              {part.imageUrls.map((url, index) => (
                <img key={index} src={url} alt="Auto Part" style={{ width: "100px", margin: "10px" }} />
              ))}
            </div>
            <button onClick={() => addToCart(part)} disabled={!part.inStock}>Add to Cart</button>
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
          <h2>Total: ${cart.reduce((total, item) => total + item.qty * item.cost, 0).toFixed(2)}</h2>
          <button onClick={handleCheckout}>Checkout</button>
          <button onClick={toggleCart}>Close Cart</button>
        </div>
      )}
      {showCheckout && (
        <div className="checkout-overlay">
          <h2>Checkout</h2>
          {userDetails && orderDetails ? (
            <form onSubmit={handleCheckoutSubmit}>
              <label>Name:
                <input type="text" name="name" value={userDetails.name} onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })} />
              </label>
              <label>Email:
                <input type="email" name="email" value={userDetails.email} onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })} />
              </label>
              <label>Phone:
                <input type="text" name="phone" value={userDetails.phone} onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })} />
              </label>
              <label>Shipping Address:
                <input type="text" name="shippingAddress" value={userDetails.shippingAddress} onChange={(e) => setUserDetails({ ...userDetails, shippingAddress: e.target.value })} />
              </label>
              <label>Billing Address:
                <input type="text" name="billingAddress" value={userDetails.billingAddress} onChange={(e) => setUserDetails({ ...userDetails, billingAddress: e.target.value })} />
              </label>
              <label>Payment Method:
                <input type="text" name="paymentMethod" value={userDetails.paymentMethod} onChange={(e) => setUserDetails({ ...userDetails, paymentMethod: e.target.value })} />
              </label>
              <label>Delivery Instructions:
                <textarea name="deliveryInstructions" value={userDetails.deliveryInstructions} onChange={(e) => setUserDetails({ ...userDetails, deliveryInstructions: e.target.value })} />
              </label>
              <h3>Order Details</h3>
              <p>Purchase Order Date: {orderDetails.purchaseOrderDate}</p>
              <p>Order Number: {orderDetails.orderNumber}</p>
              <p>Price Total (after discount): ${orderDetails.priceTotal}</p>
              <p>Discounts and Promotions Applied: {orderDetails.discount}</p>
              <p>Sales Representative: {orderDetails.salesRep}</p>
              <p>Order Status: {orderDetails.orderStatus}</p>
              <label>Customer Notes:
                <textarea name="customerNotes" value={orderDetails.customerNotes} onChange={(e) => setOrderDetails({ ...orderDetails, customerNotes: e.target.value })} />
              </label>
              <button type="submit">Place Order</button>
              <button type="button" onClick={() => setShowCheckout(false)}>Cancel</button>
            </form>
          ) : (
            <p>Loading user details...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default AutoPartsHub;
