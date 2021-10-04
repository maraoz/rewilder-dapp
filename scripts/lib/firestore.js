var admin = require('firebase-admin');
var serviceAccount = require("../../rewilder-dev-firebase.json");
if (process.env.REWILDER_ENV == "staging") {
  serviceAccount = require("../../rewilder-staging-firebase.json")
}
const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore(app);

module.exports = db;