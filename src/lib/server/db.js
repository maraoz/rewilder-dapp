const firebaseAdmin = require("./firebase");
const firestore = firebaseAdmin.firestore();
const config = require("../../config");

const tokenCollectionName = "tokens-"+config.networkName;
const updatesCollectionName = "updates-"+config.networkName;

// Get token
async function getToken(id) {
  return firestore.collection(tokenCollectionName).doc(id).get().then(format);
}

// Get all tokens
async function getAllTokens() {
  return firestore.collection(tokenCollectionName).get().then(format);
}

// get updates for a specific token
async function getUpdatesForToken(id) {
  return firestore.collection(updatesCollectionName).doc(id).get().then(format);
}

// Format Firestore response
function format(response) {
  if (response.docs) {
    return response.docs.map(getDoc);
  } else {
    return getDoc(response);
  }
}

// Get doc data and merge in doc.id
function getDoc(doc) {
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

module.exports = {
  getToken,
  getAllTokens,
  getUpdatesForToken,
};
