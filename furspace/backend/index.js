/* 
    dependencies
*/
const express = require("express");

/* 
    express configuration
*/
const app = express();
const port = 2000;

/* 
    endpoints
*/
app.get("/posts", (request, response) => {
  let posts = [
    {
      caption: "I like biting people",
      location: "Hokandara, Sri Lanka",
      emotion: "happy",
    },
    {
      caption: "Hiiii Furspace",
      location: "Panadura, Sri Lanka",
      emotion: "relaxed",
    },
  ];
  response.send(posts);
});

/* 
    listen
*/
app.listen(port, () => {
  console.log(`furspacebackend listening on port ${port}`);
});
