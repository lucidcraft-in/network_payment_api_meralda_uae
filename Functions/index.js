// functions/index.js
import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import admin from 'firebase-admin';
import express from 'express';
import paymentController from './Controllers/paymentController';
import cors from 'cors';

// ESM imports used above; remove CommonJS requires

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
  console.log('Firebase Admin SDK initialized');
}

// Initialize Firestore (if you need to import it elsewhere)
export const db = admin.firestore();
console.log('Firestore initialized');

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
app.post('/process-payment', paymentController.processPayment);

// ✅ Export only this function — DO NOT export default db
export const api = onRequest(
  {
    timeoutSeconds: 60,
    memory: '256MiB',
    invoker: 'public', // Allow unauthenticated access
  },
  app
);
