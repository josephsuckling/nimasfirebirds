import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Welcome.css';

function Welcome() {
  return (
    <div className="welcome-container">
      <h1>Welcome to Our App</h1>
      <p>This is the welcome page of our simple React application. You can navigate to different pages using the links below.</p>
      <nav>
        <ul>
          <li><Link to="/auth">Login/Register</Link></li>
          {/* Add more navigation links as needed */}
        </ul>
      </nav>
    </div>
  );
}

export default Welcome;
