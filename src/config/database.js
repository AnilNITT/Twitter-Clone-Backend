const mongoose = require("mongoose");

const DB=process.env.DB_URL;

const connectDatabase = () => {
  mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`Mongodb connected with server:${data.connection.host}`);
    })
    .catch((error) =>{
        console.error(error.message);
    })
};

module.exports = connectDatabase;