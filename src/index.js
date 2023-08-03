const express = require("express");
const app = express();
require("dotenv").config({path:"src/config/.env"});
const cors = require("cors");
const morgan = require("morgan");
const Database = require("./config/database")
const user = require("./routes/userRoute");
const tweet = require("./routes/tweetRoute");

// database Connection
Database();


// set permissions for allow all the Origin and methods n body data types
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    " Origin, X-Requested-With, Content-Type, Accept, form-data,Authorization"
  );
  next();
});


// Set Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(morgan("dev"));



app.get("/", async(req, res)=> {
  res.send({
    status: true,
    message: "Server running successfully.",
  });
});

// APi path router
app.use("/api/user", user);
app.use("/api/tweet", tweet);


// Define the port 
const PORT = process.env.PORT || 8080;

// Server running and listen the port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
