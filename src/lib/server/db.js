const firebaseAdmin = require("./firebase");

const firestore = firebaseAdmin.firestore();

const config = require("../../config");

const collectionName = "tokens-"+config.networkName;

// Get token
function getToken(id) {
  return firestore.collection(collectionName).doc(id).get().then(format);
}

// Get all tokens
function getAllTokens() {
  return firestore.collection(collectionName).get().then(format);
}

/**** HELPERS ****/

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
};
