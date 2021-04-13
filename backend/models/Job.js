const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  realRating: {
    type: Number,
    default: 0
  },
  salary:{type:Number,default: 0},
  count: { type: Number, default: 0 },
  recruiter: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  remainingApplicant: {
    type: Number
  },
  remainingPosition: {
    type: Number
  },
  position: {
    type: Number,
    required: true
  },
  maxApplicant: {
    type: Number,
    required: true
  },
  Applicant: [{
    joinDate: { type: Date },
    id: { type: String, required: true },
    email: { type: String, required: true },
    sop: { type: String, required: true },
    name: { type: String, required: true },
    rating: { type: Number, default: 0 },
    realRating: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    skills: [],
    status: {
      type: String,
      default: "pending"
    },
    date: {
      type: Date,
      default: Date.now
    },
    statusNum: {
      type: Number,
      default: 1
    }
  }],
  skills: [{
    type: String
  }],

  date: {
    type: Date,
    default: Date.now
  },
  day: { type: Number },
  month: { type: Number },
  year: { type: Number },
  hour: { type: Number },
  minute: { type: Number },

  type: {
    type: String
  },
  flag: {
    type:Number,
    default: 0
  },
  duration: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true
  }
});

module.exports = Job = mongoose.model("jobs", UserSchema);