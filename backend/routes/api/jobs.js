const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// Load input validation
//const validateRegisterInput = require("../../validation/register");
const validateJobInput = require("../../validation/job");
// Load User model
const Job = require("../../models/Job.js");

router.post("/yourinc", (req, res) => {
    Job.findOne({ _id: req.body.id }).then(user => {
      var userData = user;
      userData.rating+=1;
      Job.findByIdAndUpdate(user._id, userData, { new: true }, function (err, userData) {
        if (err) {
          console.log("err", err);
          res.status(500).send(err);
        } else {
          console.log("success");
          res.send(userData);
        }
      }
      );
      return null;
    });
  });
  router.post("/yourdec", (req, res) => {
    Job.findOne({ _id: req.body.id }).then(user => {
      var userData = user;
      userData.rating-=1;
      Job.findByIdAndUpdate(user._id, userData, { new: true }, function (err, userData) {
        if (err) {
          console.log("err", err);
          res.status(500).send(err);
        } else {
          console.log("success");
          res.send(userData);
        }
      }
      );
      return null;
    });
  });

  

router.post("/activeJobs",(req,res)=>{
    console.log("ha bhai chal rha hai!!");
    Job.find({"email" : req.body.email },(err,jobs)=>{
        console.log(req.body.email);
        if (err) {
			console.log(err);
		} else {
			res.json(jobs);
		}
    });
});
router.post("/allJobs",(req,res)=>{
    console.log("ha bhai chal rha hai!!");
    Job.find((err,jobs)=>{
        console.log(req.body.email);
        if (err) {
			console.log(err);
		} else {
            console.log("coooooool....")
            console.log(jobs);
			res.json(jobs);
		}
    });
});

router.post("/findone", (req, res) => {
    console.log("ha bhai chal rha hai!!");
    var _id = req.body.id;
    Job.findById(_id, (err, jobs) => {
      console.log(req.body.email);
      if (err) {
        res.send(null);
      } else {
        console.log(jobs);
        res.send(jobs);
      }
    });
  });

router.post("/changeApplicant",(req,res)=>{
    var id = req.body._id;
    var job = {
        title: req.body.title,
        email: req.body.email,
        recruiter: req.body.recruiter,
        type: req.body.type,
        day: req.body.day,
        month: req.body.month,
        year: req.body.year,
        hour: req.body.hour,
        minute: req.body.minute,
        maxApplicant: req.body.maxApplicant,
        remainingApplicant: req.body.remainingApplicant,
        _id: req.body._id,
        position: req.body.position,
        remainingPosition: req.body.remainingPosition,
        Applicant: req.body.Applicant,
        skills: req.body.skills,
        duration : req.body.duration,
        rating: req.body.rating,
        count: req.body.count
    }

    Job.findByIdAndUpdate(id, job , {new : true } , function(err, job){
        if (err) {
          console.log("err", err);
          res.status(500).send(err);
        } else {
          console.log("success");
          res.send(job);
        }
      }
      );
});

router.post('/delete',(req,res)=>{
    var id = req.body.id;
    console.log(id);
    Job.findByIdAndDelete(id , function (err, docs) { 
        if (err){ 
            console.log(err) 
        } 
        else{ 
            console.log("Deleted"); 
        } 
    });
});


router.post("/",(req,res)=>{
    console.log("priyansh:::");
    const {errors , isValid} = validateJobInput(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }

    const newJob = new Job({
        title: req.body.title,
        email: req.body.email,
        recruiter: req.body.recruiter,
        type: req.body.type,
        day: req.body.day,
        month: req.body.month,
        year: req.body.year,
        hour: req.body.hour,
        minute: req.body.minute,
        maxApplicant: req.body.maxApplicant,
        remainingApplicant: req.body.maxApplicant,
        salary: req.body.salary,
        position: req.body.position,
        remainingPosition: req.body.position,
        Applicant: req.body.Applicant,
        skills: req.body.skills,
        duration : req.body.duration,
        rating: "0"
    });
    newJob.save()
    .then(job => {
        res.json(job);
    });
});


  module.exports = router;