const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },

  bio: {
    type:String
  },
  //skills: {
  //  type: Array
  //},
  contactNumber: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  type : {
    type : String,
    default: "recruiter"
  },
  count: {
    type: Number,
    default : 0
  },
  rating: {
    type: Number,
    default: 0
  }
});

module.exports = Recruiter = mongoose.model("recruiters",UserSchema);