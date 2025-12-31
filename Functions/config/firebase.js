const admin = require("firebase-admin");
const serviceAccount = require("./firebase/meralda-uae-firebase-adminsdk-fbsvc-8103f18e52.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { admin, db };

