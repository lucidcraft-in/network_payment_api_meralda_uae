const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const {processPayment} = require('./Controllers/paymentController');

if (!admin.apps.length) {
  admin.initializeApp();
  console.log('Firebase Admin SDK initialized');
}

// Initialize Express app
const app = express();
console.log('Express app initialized');
app.use(express.json());
app.use(cors({ origin: true }));


// ✅ Health check route (for Cloud Run)
app.get('/', (req, res) => {
  console.log('Health check endpoint hit');
  res.status(200).send('Hello from Express on Firebase Functions ✅');
});

// ✅ PhonePe routes
// app.post("/auth-token", phonepeController.getAuthToken);
app.post('/process-payment', processPayment);

// ✅ Export Cloud Function
exports.api = functions.https.onRequest(app);
