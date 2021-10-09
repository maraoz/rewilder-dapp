var admin = require('firebase-admin');

if (!process.env.FIREBASE_PROJECT_ID) {
  throw new Error('Must set $FIREBASE_PROJECT_ID env variable');
}

if (!process.env.FIREBASE_CLIENT_EMAIL) {
  throw new Error('Must set $FIREBASE_CLIENT_EMAIL env variable');
}

if (!process.env.FIREBASE_PRIVATE_KEY) {
  throw new Error('Must set $FIREBASE_PRIVATE_KEY env variable');
}

const app = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
});
const db = admin.firestore(app);

module.exports = db;