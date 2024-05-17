import React, { useState } from "react";
import "../css/Register.css";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../FirebaseConfig";
import { uploadImages } from '../api/FirestoreAPI';  // Ensure this function is properly defined to handle image uploads

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [age, setAge] = useState("");
    const [primaryContact, setPrimaryContact] = useState("");
    const [secondaryContact, setSecondaryContact] = useState("");
    const [newsletter, setNewsletter] = useState(false);
    const [documentImage, setDocumentImage] = useState(null);
    const [userMessage, setUserMessage] = useState("");

    const auth = getAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setNewsletter(checked);
        } else if (type === 'file') {
            setDocumentImage(e.target.files[0]);
        } else {
            switch (name) {
                case "username": setUsername(value); break;
                case "email": setEmail(value); break;
                case "password": setPassword(value); break;
                case "age": setAge(value); break;
                case "primaryContact": setPrimaryContact(value); break;
                case "secondaryContact": setSecondaryContact(value); break;
                default: break;
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const imageUrl = documentImage ? await uploadImages([documentImage]) : null; // Upload image and retrieve URL
            const userData = {
                username,
                email,
                age,
                primaryContact,
                secondaryContact,
                newsletter,
                documentImageUrl: imageUrl ? imageUrl[0] : "" // Save the URL of the uploaded image
            };
            await setDoc(doc(firestore, "users", user.uid), userData);
            await sendEmailVerification(user);
            setUserMessage("Registration successful! Please verify your email before logging in.");
            navigate('/settings');
        } catch (error) {
            console.error("Error during registration:", error);
            setUserMessage("Failed to register: " + error.message);
        }
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
                
                <label htmlFor="age">Age:</label>
                <input
                    type="number"
                    id="age"
                    name="age"
                    value={age}
                    onChange={handleInputChange}
                />
                
                <label htmlFor="primaryContact">Primary Contact:</label>
                <input
                    type="text"
                    id="primaryContact"
                    name="primaryContact"
                    value={primaryContact}
                    onChange={handleInputChange}
                />
                
                <label htmlFor="secondaryContact">Secondary Contact:</label>
                <input
                    type="text"
                    id="secondaryContact"
                    name="secondaryContact"
                    value={secondaryContact}
                    onChange={handleInputChange}
                />
                
                <label htmlFor="newsletter">Subscribe to Newsletter:</label>
                <input
                    type="checkbox"
                    id="newsletter"
                    name="newsletter"
                    checked={newsletter}
                    onChange={handleInputChange}
                />
                
                <label htmlFor="documentImage">Identifying Document (Upload):</label>
                <input
                    type="file"
                    id="documentImage"
                    name="documentImage"
                    onChange={handleInputChange}
                />

                <button type="submit">Register</button>
                {userMessage && <p>{userMessage}</p>}
            </form>
        </div>
    );
}

export default Register;
