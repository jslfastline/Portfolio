// Firebase Initialization
// This file initializes Firebase with the configuration from firebaseConfig.js

// Initialize Firebase (using global firebase object loaded via CDN)
firebase.initializeApp(window.firebaseConfig);

// Get Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Make Firebase services available globally
window.firebaseAuth = auth;
window.firebaseDb = db;

console.log('Firebase initialized successfully');