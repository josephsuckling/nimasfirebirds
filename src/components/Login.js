import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { incrementLoginAttempts, getLoginAttempts, resetLoginAttempts, getAdminSettings } from "../api/FirestoreAPI";
import "../css/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");
  const [lockoutError, setLockoutError] = useState("");
  const [lockoutDuration, setLockoutDuration] = useState(0);

  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const checkLockout = async () => {
      if (!email) return;

      const loginAttempts = await getLoginAttempts(email);
      const settings = await getAdminSettings();

      if (loginAttempts) {
        const { attempts, lastAttempt } = loginAttempts;
        const now = new Date();
        const lastAttemptTime = lastAttempt ? lastAttempt.toDate() : null;
        const lockoutTime = lastAttemptTime ? new Date(lastAttemptTime.getTime() + settings.lockoutDuration * 60000) : null;

        if (attempts >= settings.maxAttempts && now < lockoutTime) {
          setLockoutDuration((lockoutTime - now) / 60000);
        }
      }
    };

    checkLockout();
  }, [email]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const settings = await getAdminSettings();
    const loginAttempts = await getLoginAttempts(email);

    if (loginAttempts && loginAttempts.attempts >= settings.maxAttempts) {
      const now = new Date();
      const lastAttemptTime = loginAttempts.lastAttempt ? loginAttempts.lastAttempt.toDate() : null;
      const lockoutTime = lastAttemptTime ? new Date(lastAttemptTime.getTime() + settings.lockoutDuration * 60000) : null;

      if (now < lockoutTime) {
        setLockoutError(`Too many login attempts. Please try again in ${Math.ceil((lockoutTime - now) / 60000)} minutes.`);
        return;
      } else {
        await resetLoginAttempts(email);
      }
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user.emailVerified) {
          setLoginSuccess("Login successful! Welcome.");
          setLoginError("");
          resetLoginAttempts(email);
          if (user.phoneNumber) {
            navigate('/phone-verification');
          } else {
            navigate('/dashboard');
          }
        } else {
          setLoginError("Please verify your email to login.");
        }
      })
      .catch(async (error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoginError("Failed to login: " + errorMessage);
        setLoginSuccess("");
        await incrementLoginAttempts(email);
      });
  };

  if (lockoutError) {
    return <div className="login-container"><p>{lockoutError}</p></div>;
  }

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
