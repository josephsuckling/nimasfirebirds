// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2aR-WxCZLQ4Jd8dL79Sw-HqB-ERJaeBs",
  authDomain: "nimasfirebirds.firebaseapp.com",
  projectId: "nimasfirebirds",
  storageBucket: "nimasfirebirds.appspot.com",
  messagingSenderId: "18815577773",
  appId: "1:18815577773:web:c9c941484ea7482ce56024",
  measurementId: "G-90W89C5WT4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);