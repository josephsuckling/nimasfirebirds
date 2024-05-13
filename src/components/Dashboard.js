// src/components/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Dashboard.css'; 


function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Welcome to Your Dashboard</h1>
      <p>This is your main area to access all the features of our application.</p>
      <nav>
        <ul>
          <li><Link to="/profile">My Profile</Link></li>
          <li><Link to="/settings">Settings</Link></li>
          <li><Link to="/logout">Logout</Link></li>
          <li><Link to="/autoparts-hub">View Auto Parts</Link></li>
          <li><Link to="/manage-categories">Manage Categories</Link></li>
          {/* You can add more links or sections as needed */}
        </ul>
      </nav>
    </div>
  );
}

export default Dashboard;
