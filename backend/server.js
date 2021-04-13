const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const applicants = require("./routes/api/applicants");
const recruiters = require("./routes/api/recruiters");
const login = require("./routes/api/login");
const jobs = require("./routes/api/jobs");

const app = express();

//bodyparser middleware
app.use(bodyParser.json());

//db config
const db = require('./config/keys').mongoURI;

//connect to mongo
mongoose.connect(db,{useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>console.log("mongodb connected successfully..."))
    .catch(err=>console.log(err));

app.use(passport.initialize());

require("./config/passport")(passport);

app.use("/api/applicants", applicants);
app.use("/api/recruiters",recruiters);
app.use("/api/login", login);
app.use("/api/jobs", jobs);

const port = process.env.PORT || 5000;

app.listen(port, ()=>console.log(`server started on port ${port}`));
