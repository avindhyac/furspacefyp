/* 
    dependencies
*/
const express = require("express");
const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
} = require("firebase-admin/firestore");

/* 
    express configuration
*/
const app = express();
const port = 2000;

/* 
    firebase configuration
*/

const firebaseConfig = {
  apiKey: "AIzaSyA3ycX_tDbhnn7UZbNmMfc4ErpuU_GNkCQ",
  authDomain: "furspace-99993.firebaseapp.com",
  projectId: "furspace-99993",
  storageBucket: "furspace-99993.appspot.com",
  messagingSenderId: "700501398555",
  appId: "1:700501398555:web:845fbea444d0f9642814be",
};

const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

/* 
    endpoints
*/
app.get("/posts", (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  let posts = [];
  db.collection("posts")
    .orderBy("date", "desc")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
        posts.push(doc.data());
      });
      response.send(posts);
    });
});

/* 
    listen
*/
app.listen(port, () => {
  console.log(`furspacebackend listening on port ${port}`);
});
