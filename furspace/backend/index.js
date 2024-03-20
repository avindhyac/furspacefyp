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
const { getStorage } = require("firebase-admin/storage");
const busboy = require("busboy");
const path = require("path");
const os = require("os");
const fs = require("fs");
const UUID = require("uuid-v4");

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
  storageBucket: "furspace-99993.appspot.com",
});

const db = getFirestore();
const bucket = getStorage().bucket();

/* 
    endpoint - GET POSTS
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
    endpoint - CREATE POST
*/
app.post("/createPost", (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");

  let uuid = UUID();

  console.log("POST request");

  const bb = busboy({ headers: request.headers });
  let fields = {};
  let fileData = {};

  bb.on("file", (name, file, info) => {
    const { filename, encoding, mimeType } = info;
    console.log(
      `File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
      filename,
      encoding,
      mimeType
    );
    // PATH FORMAT: /tmp/image.png
    let filepath = path.join(os.tmpdir(), filename);
    file.pipe(fs.createWriteStream(filepath));
    fileData = { filepath, mimeType };
  });

  bb.on("field", (name, val, info) => {
    fields[name] = val;
  });

  bb.on("close", () => {
    bucket.upload(
      fileData.filepath,
      {
        uploadType: "media",
        metadata: {
          metadata: {
            contentType: fileData.mimeType,
            firebaseStorageDownloadTokens: uuid,
          },
        },
      },
      (err, uploadedFile) => {
        if (!err) {
          createDocument(uploadedFile);
        }
      }
    );

    function createDocument(uploadedFile) {
      db.collection("posts")
        .doc(fields.id)
        .set({
          id: fields.id,
          caption: fields.caption,
          location: fields.location,
          date: parseInt(fields.date),
          imageURL: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${uploadedFile.name}?alt=media&token=${uuid}`,
        })
        .then(() => {
          response.send("Post added: " + fields.id);
        });
    }
  });

  request.pipe(bb);
});

/* 
    listen
*/
app.listen(port, () => {
  console.log(`furspacebackend listening on port ${port}`);
});
