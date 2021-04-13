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
  count: {
    type: Number,
    default : 0
  },
  institute: [{
    insName:{ type: String},
    sDate: { 
      type: Number},
    eDate: {type: Number}
  }],
  skills: {
    type: Array
  },
  jobs : [
    {
      id:{type: String},
      rating:{type:Number},
    }
  ],
  rating: {
    type: Number,
    default: 0
  },
  applied: {type: Number, default:0},
  employeed: {type: Number, default: 0},
  date: {
    type: Date,
    default: Date.now
  },
  type : {
    type : String,
    default: "applicant"
  }
});

module.exports = Applicant = mongoose.model("applicants",UserSchema);