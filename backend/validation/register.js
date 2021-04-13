const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data){
    let errors = {};
    
    data.name = !isEmpty(data.name) ? data.name : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";
    data.email = !isEmpty(data.email) ? data.email : "";
  

    if(Validator.isEmpty(data.name)){
        errors.name = "Name field is required";
    }

    if(Validator.isEmpty(data.email)){
        errors.email = "email is a required field";
    }
    else if(!Validator.isEmail(data.email)){
        errors.email = "email is invalid";
    }

    if(Validator.isEmpty(data.password)){
        errors.password = "Password field is requiered";
    }
    if(!Validator.isLength(data.password,{min: 8, max: 30})){
        errors.password = "Length of password must be in the range 8-30 characters";
        console.log(data.password);
    }

    if(Validator.isEmpty(data.password2)){
        errors.password2 = "Confirm password field is requiered";
    }
    if(!Validator.equals(data.password, data.password2)){
        errors.password2 = "Passwords don't match";
    }


    return {
        errors,
        isValid: isEmpty(errors)
    };
};