// src/components/Settings.js

import React, { useState, useEffect } from 'react';
import { fetchUserDetails, updateUserDetails, getAdminSettings, updateAdminSettings } from '../api/FirestoreAPI';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import '../css/Settings.css'; // Import the CSS file

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
  const [adminSettings, setAdminSettings] = useState({ maxAttempts: 3, lockoutDuration: 15 });
  const [isAdmin, setIsAdmin] = useState(false); // To track if the user is an admin

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

    const checkAdminStatus = async (userID) => {
      // Replace with your logic to check if the user is an admin
      // For example, fetching admin status from Firestore or using custom claims
      const adminStatus = true; // This should be replaced with actual logic
      setIsAdmin(adminStatus);
      if (adminStatus) {
        const settings = await getAdminSettings();
        setAdminSettings(settings);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserDetails((prevState) => ({
          ...prevState,
          email: user.email
        }));
        localStorage.setItem("userID", user.uid); // Save user ID to localStorage
        getUserDetails(user.uid); // Fetch user details using the correct user ID
        checkAdminStatus(user.uid); // Check if the user is an admin
      } else {
        navigate('/login'); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [auth, navigate]);

  const handleUserDetailsChange = (event) => {
    const { name, value } = event.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleAdminSettingsChange = (event) => {
    const { name, value } = event.target;
    setAdminSettings({ ...adminSettings, [name]: parseInt(value) });
  };

  const handleUserDetailsSubmit = async (event) => {
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

  const handleAdminSettingsSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateAdminSettings(adminSettings);
      alert("Admin settings updated successfully!");
    } catch (error) {
      console.error("Error updating admin settings:", error);
      alert("Failed to update admin settings.");
    }
  };

  if (!isLoaded) {
    return <p>Loading...</p>; // Display loading message until user details are loaded
  }

  return (
    <div className="settings">
      <h2>Update Your Details</h2>
      <form onSubmit={handleUserDetailsSubmit}>
        <label>Name:
          <input type="text" name="name" value={userDetails.name} onChange={handleUserDetailsChange} />
        </label>
        <label>Email:
          <input type="email" name="email" value={userDetails.email} onChange={handleUserDetailsChange} disabled />
        </label>
        <label>Phone:
          <input type="text" name="phone" value={userDetails.phone} onChange={handleUserDetailsChange} />
        </label>
        <label>Shipping Address:
          <input type="text" name="shippingAddress" value={userDetails.shippingAddress} onChange={handleUserDetailsChange} />
        </label>
        <label>Billing Address:
          <input type="text" name="billingAddress" value={userDetails.billingAddress} onChange={handleUserDetailsChange} />
        </label>
        <label>Payment Method:
          <input type="text" name="paymentMethod" value={userDetails.paymentMethod} onChange={handleUserDetailsChange} />
        </label>
        <label>Delivery Instructions:
          <textarea name="deliveryInstructions" value={userDetails.deliveryInstructions} onChange={handleUserDetailsChange} />
        </label>
        <button type="submit">Update Details</button>
      </form>

      {isAdmin && (
        <div className="admin-settings">
          <h2>Admin Settings</h2>
          <form onSubmit={handleAdminSettingsSubmit}>
            <label>Max Login Attempts:
              <input type="number" name="maxAttempts" value={adminSettings.maxAttempts} onChange={handleAdminSettingsChange} />
            </label>
            <label>Lockout Duration (minutes):
              <input type="number" name="lockoutDuration" value={adminSettings.lockoutDuration} onChange={handleAdminSettingsChange} />
            </label>
            <button type="submit">Save Settings</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Settings;
