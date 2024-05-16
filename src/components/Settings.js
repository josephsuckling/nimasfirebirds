// src/components/Settings.js

import React, { useState, useEffect } from 'react';
import { fetchUserDetails, updateUserDetails } from '../api/FirestoreAPI';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function Settings() {
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    shippingAddress: '',
    billingAddress: '',
    paymentMethod: '',
    deliveryInstructions: ''
  });
  const [isLoaded, setIsLoaded] = useState(false); // To track if user details are loaded

  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getUserDetails = async (userID) => {
      const details = await fetchUserDetails(userID);
      if (details) {
        setUserDetails((prevDetails) => ({
          ...prevDetails,
          ...details
        }));
      }
      setIsLoaded(true); // Set to true after fetching user details
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserDetails((prevState) => ({
          ...prevState,
          email: user.email
        }));
        localStorage.setItem("userID", user.uid); // Save user ID to localStorage
        getUserDetails(user.uid); // Fetch user details using the correct user ID
      } else {
        navigate('/login'); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [auth, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userID = localStorage.getItem("userID");
      await updateUserDetails(userID, userDetails);
      alert("Details updated successfully!");
    } catch (error) {
      console.error("Error updating details:", error);
      alert("Failed to update details.");
    }
  };

  if (!isLoaded) {
    return <p>Loading...</p>; // Display loading message until user details are loaded
  }

  return (
    <div className="settings">
      <h2>Update Your Details</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:
          <input type="text" name="name" value={userDetails.name} onChange={handleChange} />
        </label>
        <label>Email:
          <input type="email" name="email" value={userDetails.email} onChange={handleChange} disabled />
        </label>
        <label>Phone:
          <input type="text" name="phone" value={userDetails.phone} onChange={handleChange} />
        </label>
        <label>Shipping Address:
          <input type="text" name="shippingAddress" value={userDetails.shippingAddress} onChange={handleChange} />
        </label>
        <label>Billing Address:
          <input type="text" name="billingAddress" value={userDetails.billingAddress} onChange={handleChange} />
        </label>
        <label>Payment Method:
          <input type="text" name="paymentMethod" value={userDetails.paymentMethod} onChange={handleChange} />
        </label>
        <label>Delivery Instructions:
          <textarea name="deliveryInstructions" value={userDetails.deliveryInstructions} onChange={handleChange} />
        </label>
        <button type="submit">Update Details</button>
      </form>
    </div>
  );
}

export default Settings;
