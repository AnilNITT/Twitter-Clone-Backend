const mongoose = require("mongoose");

// create User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema,"User");
