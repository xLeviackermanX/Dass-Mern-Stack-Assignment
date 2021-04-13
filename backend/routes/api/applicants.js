const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// Load input validation
const validateRegisterInput = require("../../validation/register");
//const validateLoginInput = require("../../validation/login");
// Load User model
const Applicant = require("../../models/Applicant");
const Recruiter = require("../../models/Recruiter");
const { count } = require("../../models/Applicant");
// @route POST api/applicants/register
// @desc Register user
// @access Public
var nodemailer = require('nodemailer');

router.post("/change", (req, res) => {
  console.log("dass sucks!!");
  var _id = req.body.id;
  console.log(_id);
  var applicant = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    institute: req.body.institute,
    skills: req.body.skills,
    type: "applicant",
    rating: req.body.rating,
    count: req.body.count,
    jobs: req.body.jobs,
  };
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    console.log(errors);
    return res.status(400).json(errors);
  }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(applicant.password, salt, (err, hash) => {
      if (err) throw err;
      applicant.password = hash;
      console.log(hash);
      console.log(applicant.password);
      Applicant.findByIdAndUpdate(_id, applicant, { new: true }, function (err, applicant) {
        if (err) {
          console.log("err", err);
          res.status(500).send(err);
        } else {
          console.log("success");
          res.send(applicant);
        }
      }
      );
    });
  });

});

router.post("/change2", (req, res) => {
  console.log("dass sucks!!");
  var _id = req.body.id;
  console.log(_id);
  var applicant = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    institute: req.body.institute,
    skills: req.body.skills,
    type: "applicant",
    rating: req.body.rating,
    applied: req.body.applied,
    employeed: req.body.employeed,
    count: req.body.count,
    jobs: req.body.jobs,
  };
  console.log(req.body);
  Applicant.findByIdAndUpdate(_id, applicant, { new: true }, function (err, applicant) {
    if (err) {
      console.log("err", err);
      res.status(500).send(err);
    } else {
      console.log("success");
      res.send(applicant);
    }
  }
  );

});


router.post("/find", (req, res) => {
  console.log("ha bhai chal rha hai!!");
  Applicant.find({ email: req.body.email }, (err, applicants) => {
    console.log(req.body.email);
    if (err) {
      console.log(err);
      console.log("chutiye!!");
    } else {
      console.log(applicants);
      res.json(applicants);
    }
  });
});
router.post("/findone", (req, res) => {
  console.log("ha bhai chal rha hai!!");
  var _id = req.body.id;
  Applicant.findById(_id, (err, applicants) => {
    console.log(req.body.email);
    if (err) {
      console.log(err);
      console.log("chutiye!!");
    } else {
      console.log(applicants);
      res.send(applicants);
    }
  });
});

router.post("/incRating", (req, res) => {
  Applicant.findOne({ email: req.body.email }).then(user => {
    var userData = user;
    userData.rating+= 1;
    Applicant.findByIdAndUpdate(user._id, userData, { new: true }, function (err, userData) {
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
router.post("/accepted", (req, res) => {
  Applicant.findOne({ email: req.body.email }).then(user => {
    var userData = user;
    userData.employeed = 1;
    userData.count += 1;
    userData.applied = 0;
    
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'job.lelo5525@gmail.com',
          pass: 'shreya5525'
        }
      });
      
      var mailOptions = {
        from:  'job.lelo5525@gmail.com',
        to: user.email,
        subject: 'Your job application is accepted',
        text: 'Congratulation! you have been selected for a job by! '+req.body.recemail
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    var i = 0;
    Applicant.findByIdAndUpdate(user._id, userData, { new: true }, function (err, userData) {
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
router.post("/rejected", (req, res) => {
  Applicant.findOne({ email: req.body.email }).then(user => {
    var userData = user;
    userData.applied -= 1;
    var i = 0;
    Applicant.findByIdAndUpdate(user._id, userData, { new: true }, function (err, userData) {
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

router.post("/fired", (req, res) => {
  Applicant.findOne({ email: req.body.email }).then(user => {
    var userData = user;
    userData.employeed = 0;
    var i = 0;
    Applicant.findByIdAndUpdate(user._id, userData, { new: true }, function (err, userData) {
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

router.post("/decRating", (req, res) => {
  Applicant.findOne({ email: req.body.email }).then(user => {
    var userData = user;
    userData.rating -= 1;
    Applicant.findByIdAndUpdate(user._id, userData, { new: true }, function (err, userData) {
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
router.post("/yourinc", (req, res) => {
  Applicant.findOne({ _id: req.body._id }).then(user => {
    var userData = user;
    var i=0;
    while(userData.jobs[i] && userData.jobs[i].id!==req.body.id){
      i+=1;
    }
    userData.jobs[i].rating+=1;
    Applicant.findByIdAndUpdate(user._id, userData, { new: true }, function (err, userData) {
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
  Applicant.findOne({ _id: req.body._id }).then(user => {
    var userData = user;
    var i=0;
    while(userData.jobs[i] && userData.jobs[i].id!==response.body.id){
      i+=1;
    }
    userData.jobs[i].rating-=1;
    Applicant.findByIdAndUpdate(user._id, userData, { new: true }, function (err, userData) {
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

router.post("/register", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  Recruiter.findOne({ email: req.body.email }).then(user2 => {
    if (user2) {
      return res.status(400).json({ email: "Email is already registered" });
    }
    else {
      Applicant.findOne({ email: req.body.email }).then(user => {
        if (user) {
          console.log(user);
          return res.status(400).json({ email: "Email is already registered" });
        } else {
          const newApplicant = new Applicant({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            institute: req.body.institute,
            rating: 0,
            skills: req.body.skills,
            count: 0,
            jobs: [],
            type: "applicant"
          });
          // Hash password before saving in database
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newApplicant.password, salt, (err, hash) => {
              if (err) throw err;
              newApplicant.password = hash;
              newApplicant
                .save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
            });
          });
        }
      });
    }
  }
  )

});

// @route POST api/applicants/login
// @desc login of applicant
// @access PUBLIC


module.exports = router;