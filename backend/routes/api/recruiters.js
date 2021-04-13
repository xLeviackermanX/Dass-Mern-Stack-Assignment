const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// Load input validation
const validateRegisterInputr = require("../../validation/register2");
//const validateLoginInput = require("../../validation/login");
// Load User model
const Applicant = require("../../models/Applicant");
const Recruiter = require("../../models/Recruiter");
//const Applicant = require("../../models/Applicant");
// @route POST api/recruiters/register2
// @desc Register user
// @access Public

router.post("/change",(req,res)=>{
    console.log("dass sucks!!");
    var _id = req.body.id;
    console.log(_id);
    var recruiter = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      contactNumber : req.body.contactNumber,
      bio : req.body.bio,
      type : "recruiter",
      rating: req.body.rating,
      count: req.body.count
    };
    const {errors, isValid} = validateRegisterInputr(req.body);
    if(!isValid){
      console.log(errors);
      return res.status(400).json(errors);
    }
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(recruiter.password, salt, (err, hash) => {
        if (err) throw err;
        recruiter.password = hash;
        console.log(hash);
        console.log(recruiter.password);
        Recruiter.findByIdAndUpdate(_id, recruiter , {new : true } , function(err, recruiter){
          if (err) {
            console.log("err", err);
            res.status(500).send(err);
          } else {
            console.log("success");
            res.send(recruiter);
          }
        }
        );
      });
    });
   
});


router.post("/register2", (req, res) => {
    // Form validation
  const { errors, isValid } = validateRegisterInputr(req.body);
  // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Applicant.findOne({email: req.body.email }).then(user2 => {
      if(user2){
        return res.status(400).json({email: "email is already registered"});
      }
      else
      {
        Recruiter.findOne({ email: req.body.email }).then(user => {
          if (user) {
            return res.status(400).json({ email: "Email is already registered" });
          } else {
            const newRecruiter = new Recruiter({
              name: req.body.name,
              email: req.body.email,
              password: req.body.password,
              contactNumber : req.body.contactNumber,
              bio : req.body.bio,
              type : "recruiter",
              rating: "0"
              //rating: req.body.rating
            });
      // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newRecruiter.password, salt, (err, hash) => {
                if (err) throw err;
                newRecruiter.password = hash;
                newRecruiter
                  .save()
                  .then(user => res.json(user))
                  .catch(err => console.log(err));
              });
            });
          }
        });
      }
    });
  });

  // @route POST api/recruiters/login
  // @desc login of recruiter
  // @access PUBLIC

  module.exports = router;