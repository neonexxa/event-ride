import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// Replace these values with your actual Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDp2cj2WgrInNEnCdqknzEkG_En6xVyTUQ",
    authDomain: "awesomeproject-cd995.firebaseapp.com",
    databaseURL: "https://awesomeproject-cd995-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "awesomeproject-cd995",
    storageBucket: "awesomeproject-cd995.firebasestorage.app",
    messagingSenderId: "103763816586",
    appId: "1:103763816586:web:0ac98718fff8a6ab247d73",
    measurementId: "G-XFLGWLHCZS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

