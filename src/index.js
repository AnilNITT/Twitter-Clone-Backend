const express = require("express");
const app = express();
require("dotenv").config({path:"src/config/.env"});
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const Database = require("./config/database")
const user = require("./routes/userRoute");
const tweet = require("./routes/tweetRoute");

// database Connection
Database();


app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  // res.header("Access-Control-Allow-Headers", "Content-Type",'Authorization');
  res.header(
    "Access-Control-Allow-Headers",
    " Origin, X-Requested-With, Content-Type, Accept, form-data,Authorization"
  );
  // res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


// Set Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(morgan("dev"));
app.use(errHandler);


app.get("/", async(req, res)=> {
  res.send({
    status: true,
    message: "Server running successfully.",
  });
});


// User router
app.use("/user", user);
app.use("/tweet", tweet);


// Define the port from helper file
const PORT = process.env.PORT || 8080;

// Server running and listen the port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Multer image error handler
function errHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    res.json({
      success: 0,
      message: err.message,
    });
  }
}

