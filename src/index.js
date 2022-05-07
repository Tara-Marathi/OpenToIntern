// express is an fast and server-side web framework for node.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//import route
const route = require("./route/route");

const app = express();          //used express to create global middleware
const port = 3000;

//body parser is a middleware, used to process data sent through an HTTP request body.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//extended: true, precises that the req.body object will contain values of any type instead of just strings.


mongoose.connect(
    "mongodb+srv://tara:c0VtDGqc7Ugvjpug@cluster0.0vu5f.mongodb.net/tara-p2?retryWrites=true&w=majority",
    { useNewurlparser: true })
    .then(() => console.log("mongoDB Connected"))  //return fullfiled promise
    .catch(err => console.log(err))               //return rejected promise
  
  app.use("/", route)
  
 
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
