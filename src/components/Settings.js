import React, { useState, useEffect } from 'react';
import { fetchUserDetails, updateUserDetails, getAdminSettings, updateAdminSettings, uploadImages, checkAdminStatus } from '../api/FirestoreAPI';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import '../css/Settings.css'; // Ensure the CSS file is structured to style these components

function Settings() {
  const [enable2FA, setEnable2FA] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    primaryContact: '',
    secondaryContact: '',
    newsletter: false,
    documentImageUrl: '', // URL for the document image
    shippingAddress: '',
    billingAddress: '',
    paymentMethod: '',
    deliveryInstructions: ''
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [adminSettings, setAdminSettings] = useState({ maxAttempts: 3, lockoutDuration: 15 });
  const [isAdmin, setIsAdmin] = useState(false);

  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserDetails((prevState) => ({
          ...prevState,
          email: user.email // Pre-fill the email from auth
        }));
        localStorage.setItem("userID", user.uid);
        fetchUserDetails(user.uid).then(details => {
          if (details) {
            setUserDetails((prevDetails) => ({ ...prevDetails, ...details }));
          }
          setIsLoaded(true);
        });
        checkAdminStatus(user.uid).then(status => {
          setIsAdmin(status);
          if (status) {
            getAdminSettings().then(settings => {
              setAdminSettings(settings);
            });
          }
        });
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const handleUserDetailsChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === 'checkbox') {
      setUserDetails({ ...userDetails, [name]: checked });
    } else {
      setUserDetails({ ...userDetails, [name]: value });
    }
  };

  const handleDocumentImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrls = await uploadImages([file]); // Assume uploadImages handles file uploads
      setUserDetails({ ...userDetails, documentImageUrl: imageUrls[0] });
    }
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

  const handle2FAToggle = () => {
    setEnable2FA(!enable2FA);
    if (!enable2FA) {
      navigate('/setup-phone-verification');
    }
  };

  const handleAdminSettingsChange = (event) => {
    const { name, value } = event.target;
    setAdminSettings({ ...adminSettings, [name]: parseInt(value) });
  };

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div className="settings">
      <h2>Update Your Details</h2>
      <form onSubmit={handleUserDetailsSubmit}>
        <label>Name:<input type="text" name="name" value={userDetails.name} onChange={handleUserDetailsChange} /></label>
        <label>Email:<input type="email" name="email" value={userDetails.email} onChange={handleUserDetailsChange} disabled /></label>
        <label>Phone:<input type="text" name="phone" value={userDetails.phone} onChange={handleUserDetailsChange} /></label>
        <label>Age:<input type="number" name="age" value={userDetails.age} onChange={handleUserDetailsChange} /></label>
        <label>Primary Contact:<input type="text" name="primaryContact" value={userDetails.primaryContact} onChange={handleUserDetailsChange} /></label>
        <label>Secondary Contact:<input type="text" name="secondaryContact" value={userDetails.secondaryContact} onChange={handleUserDetailsChange} /></label>
        <label>Subscribe to Newsletter:<input type="checkbox" name="newsletter" checked={userDetails.newsletter} onChange={handleUserDetailsChange} /></label>
        <label>Shipping Address:<input type="text" name="shippingAddress" value={userDetails.shippingAddress} onChange={handleUserDetailsChange} /></label>
        <label>Billing Address:<input type="text" name="billingAddress" value={userDetails.billingAddress} onChange={handleUserDetailsChange} /></label>
        <label>Payment Method:<input type="text" name="paymentMethod" value={userDetails.paymentMethod} onChange={handleUserDetailsChange} /></label>
        <label>Delivery Instructions:<textarea name="deliveryInstructions" value={userDetails.deliveryInstructions} onChange={handleUserDetailsChange} /></label>
        <label>Identifying Document (Upload):
          <input type="file" onChange={handleDocumentImageChange} />
          {userDetails.documentImageUrl && <img src={userDetails.documentImageUrl} alt="Document" style={{ width: "100px", height: "auto" }} />}
        </label>
        <button type="submit">Update Details</button>
      </form>
      <h2>Settings</h2>
      <button onClick={handle2FAToggle}>{enable2FA ? "Disable 2FA" : "Enable 2FA"}</button>
      {isAdmin && (
        <div className="admin-settings">
          <h2>Admin Settings</h2>
          <form onSubmit={handleAdminSettingsSubmit}>
            <label>Max Login Attempts:<input type="number" name="maxAttempts" value={adminSettings.maxAttempts} onChange={handleAdminSettingsChange} /></label>
            <label>Lockout Duration (minutes):<input type="number" name="lockoutDuration" value={adminSettings.lockoutDuration} onChange={handleAdminSettingsChange} /></label>
            <button type="submit">Save Settings</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Settings;
