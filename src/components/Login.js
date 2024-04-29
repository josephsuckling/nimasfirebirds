import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "../css/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");

  const navigate = useNavigate(); // Initialize the navigate function

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        setLoginSuccess("Login successful! Welcome back.");
        setLoginError("");
        navigate('/dashboard'); // Navigate to dashboard on success
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoginError("Failed to login: " + errorMessage);
        setLoginSuccess("");
      });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleInputChange}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handleInputChange}
        />

        <button type="submit">Login</button>
        {loginError && <p className="error-message">{loginError}</p>}
        {loginSuccess && <p className="success-message">{loginSuccess}</p>}
      </form>
    </div>
  );
}

export default Login;
