import React, { useState } from 'react';
import Register from './Register';
import Login from './Login';
import '../css/Auth.css'; // Ensure the path to the CSS file is correct

function Auth() {
    // State to toggle between forms
    const [showLogin, setShowLogin] = useState(true);

    const toggleForms = () => {
        setShowLogin(!showLogin);
    };

    return (
        <div className="auth-page">
            <h1>Welcome to Nima's Parts Emporium</h1>
            <div className="auth-forms">
                {showLogin ? <Login /> : <Register />}
            </div>
            {showLogin ? (
                <div className="toggle-text">
                    Don't have an account? <button onClick={toggleForms} className="toggle-button">Register</button>
                </div>
            ) : (
                <div className="toggle-text">
                    Already have an account? <button onClick={toggleForms} className="toggle-button">Login</button>
                </div>
            )}
        </div>
    );
}

export default Auth;
