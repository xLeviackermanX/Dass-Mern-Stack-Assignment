const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateJobInput(data){
    let errors = {};
    
    data.title = !isEmpty(data.title) ? data.title : "";
    
    data.maxApplicant = !isEmpty(data.maxApplicant) ? data.maxApplicant : "";
    data.position = !isEmpty(data.position) ? data.position : "";
    data.salary = !isEmpty(data.salary) ? data.salary : "";
    data.minute = !isEmpty(data.minute) ? data.minute: "";
    data.day = !isEmpty(data.day) ? data.day: "";
    data.year = !isEmpty(data.year) ? data.year : "";
    data.month = !isEmpty(data.month) ? data.month: "";
    data.hour = !isEmpty(data.hour) ? data.hour: "";
    data.duration = !isEmpty(data.duration) ? data.duration : "";
    let m = ["31","28","31","30","31","30","31","31","30","31","30","31"];
    let i = parseInt(data.month,10);
    let j = parseInt(data.day,10);
    let k = parseInt(data.year,10);
    var d = new Date();
    if(Validator.isEmpty(data.title)){
        errors.title = "Title of the job is required";
    }

    if(Validator.isEmpty(data.maxApplicant)){
        errors.maxApplicant = "Maximum number of applicants field is required";
    }
    if(!Validator.isInt(data.maxApplicant,{min: 1})){
        errors.maxApplicant = "Invalid value";
    }
    if(Validator.isEmpty(data.position)){
        errors.position = "Total positions field is required";
    }
    if(!Validator.isInt(data.position,{min: 1})){
        errors.position = "invalid value";
    }

    if(Validator.isEmpty(data.salary)){
        errors.salary = "salary field is required";
    }
    else if(!Validator.isInt(data.salary, {min:10000})){
        errors.salary = "invalid salary";
    }
    if(Validator.isEmpty(data.duration)){
        errors.duration = "Duration is required field";
    }
    else if(!Validator.isInt(data.duration,{min:1, max:6})){
        errors.duration = "Invalid duration";
    }
    if(Validator.isEmpty(data.day) || Validator.isEmpty(data.month) || Validator.isEmpty(data.year)){
        errors.day = "Please fill full date";
    }
    else if(!Validator.isInt(data.month,{min:1, max:12})){
        errors.day = "Invalid date";
    }
    else if(!Validator.isInt(data.year)){
        errors.day = "Invalid date";
    }
    else if(!Validator.isInt(data.day,{min:1})){
        errors.day = "Invalid date";
    }
    else if(j>m[i]){
        errors.day = "Invalid date";
    }
    else if(k<d.getFullYear()){
        errors.day = "Select a future date for deadline";
    }
    else if(k==d.getFullYear() && i<d.getMonth()+1){
        errors.day = "Select a future date for deadline";
    }
    else if(k==d.getFullYear() && i==d.getMonth()+1 && j<=d.getDate()){
        errors.day = "Select a future date for deadline";
    }

    if(Validator.isEmpty(data.hour) || Validator.isEmpty(data.minute)){
        errors.hour = "Please fill the full time";
    }
    else if(!Validator.isInt(data.hour,{min:0,max:23})){
        errors.hour = "Invalid time";
    }
    else if(!Validator.isInt(data.minute,{min:0,max:59})){
        errors.minute = "invalid time";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};