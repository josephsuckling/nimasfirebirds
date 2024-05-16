// src/utils/firebaseAuth.js

import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Initialize the authentication API from Firebase
const auth = getAuth();

// Function to check if the user is currently authenticated
export function isAuthenticated() {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(true);  // User is logged in
      } else {
        resolve(false); // User is not logged in
      }
    }, reject);
  });
}
