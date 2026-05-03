const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
  // ❌ DO NOT put storageBucket here
});

// ✅ FORCE correct bucket manually
const bucket = admin.storage().bucket("mitos-pdf-app.firebasestorage.app");

module.exports = { admin, bucket };