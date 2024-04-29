import React, { useState } from "react";
import "../css/Login.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");  // State for storing login error messages
  const [loginSuccess, setLoginSuccess] = useState("");  // State for storing login success message

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
        const user = userCredential.user;
        setLoginSuccess("Login successful! Welcome back.");
        setLoginError("");  // Clear any previous error messages
        // You might want to redirect the user or change the application state
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoginError("Failed to login: " + errorMessage);  // Set error message
        setLoginSuccess("");  // Clear any previous success messages
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
