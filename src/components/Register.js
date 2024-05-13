import React, { useState } from "react";
import "../css/Register.css";
import App from "../FirebaseConfig";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import { doc, setDoc, getFirestore } from "firebase/firestore";


function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userMessage, setUserMessage] = useState(""); // State to store user feedback message

  const auth = getAuth();
  const navigate = useNavigate();  // Initialize the navigate function

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    else if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log(user); // You can remove this later
        setUserMessage("Registration successful! Welcome to our application.");
        navigate('/dashboard');  // Navigate to dashboard on success
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage); // You can remove this later
        setUserMessage("Failed to register: " + errorMessage);
      });
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={handleInputChange}
        />

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

        <button type="submit">Register</button>
        {userMessage && <p>{userMessage}</p>} {/* Display user feedback here */}
      </form>
    </div>
  );
}

export default Register;
