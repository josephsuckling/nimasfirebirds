// src/components/Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../FirebaseConfig';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut(auth);
        navigate('/auth'); // Redirect to login page after logout
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };

    handleLogout();
  }, [navigate]);

  return (
    <div>
      <p>Logging out...</p>
    </div>
  );
}

export default Logout;
