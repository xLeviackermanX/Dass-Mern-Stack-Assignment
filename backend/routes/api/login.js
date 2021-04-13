const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// Load input validation
//const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const Applicant = require("../../models/Applicant");
const Recruiter = require("../../models/Recruiter");


router.post("/", (req, res) => {

    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    Applicant.findOne({ email })
        .then(applicant => {
            if (!applicant) {

                Recruiter.findOne({ email })
                    .then(recruiter => {
                        if (!recruiter) {
                            return res.status(404).json({ emailnotfound: "this email is not registered.You can register by going to registration page" });
                        }

                        bcrypt.compare(password, recruiter.password).then(isMatch => {
                            if (isMatch) {
                                const payload = {
                                    id: recruiter.id,
                                    name: recruiter.name,
                                    email: recruiter.email,
                                    password: recruiter.password,
                                    count: recruiter.count,
                                    rating: recruiter.rating,
                                    bio: recruiter.bio,
                                    type: recruiter.type,
                                    contactNumber: recruiter.contactNumber
                                };

                                jwt.sign(
                                    payload,
                                    keys.secretOrKey,
                                    {
                                        expiresIn: 31556926
                                    },
                                    (err, token) => {
                                        res.json({
                                            success: true,
                                            token: "Bearer " + token
                                        });
                                    }
                                );
                            }
                            else {
                                return res.status(400).json({ passwordincorrect: "Incorrect Password" });
                            }
                        }
                        );
                    }
                    );


            }
            console.log("yoyoyoyo");
            bcrypt.compare(password, applicant.password).then(isMatch => {
                if (isMatch) {
                    const payload = {
                        id: applicant.id,
                        name: applicant.name,
                        institute: applicant.institute,
                        count : applicant.count,
                        email: applicant.email,
                        password: applicant.password,
                        jobs: applicant.jobs,
                        rating: applicant.rating,
                        applied: applicant.applied,
                        employeed:applicant.employeed,
                        skills: applicant.skills,
                        type: applicant.type
                    };

                    jwt.sign(
                        payload,
                        keys.secretOrKey,
                        {
                            expiresIn: 31556926
                        },
                        (err, token) => {
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            });
                        }
                    );
                }
                else {
                    return res.status(400).json({ passwordincorrect: "Incorrect Password" });
                }
            }
            );
        }
        );
}
);

module.exports = router;