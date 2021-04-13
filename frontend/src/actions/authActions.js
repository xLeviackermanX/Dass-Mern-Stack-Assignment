import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING
} from "./types";
// Register User
export const createJob = (userData, history) => dispatch => {
  axios
    .post('/api/jobs', userData)
    .then(res => history.push("/dashboard")) // re-direct to login on successful register
    .catch(err => 
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    
    );
    console.log("hey something happended");
};

export const showApplicant = (userData, data) => dispatch => {
  axios
    .post('/api/activeJobs', userData)
    .then(res => {
        return data;
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
    console.log("hey something happended");
};

export const registerApp = (userData, history) => dispatch => {
  axios
    .post('/api/applicants/register', userData)
    .then(res => history.push("/login")) // re-direct to login on successful register
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
    console.log("hey something happended");
};
// Register Recruiter
export const registerRec = (userData, history) => dispatch => {
    axios
      .post('/api/recruiters/register2', userData)
      .then(res => history.push("/login")) // re-direct to login on successful register
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  };

  export const profileRec = userData => dispatch => {
    axios
      .post('/api/recruiters/change', userData)
      .then(res => {
        var USER = JSON.parse(localStorage.getItem("USER"));
        USER.name = userData.name;
        USER.contactNum = userData.contactNum;
        USER.bio = userData.bio; 
        localStorage.removeItem("USER");
        localStorage.setItem("USER",JSON.stringify(USER)); 
        dispatch(setCurrentUser(USER));
      })
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  };
  
  export const profileApp = userData => dispatch => {
    axios
      .post('/api/applicants/change', userData)
      .then(res => {
        var USER = JSON.parse(localStorage.getItem("USER"));
        USER.name = userData.name;
        USER.skills = userData.skills;
        USER.institute = userData.institute; 
        USER.applied = userData.applied;
        USER.employeed = userData.employeed;
        USER.jobs= userData.jobs;
        localStorage.removeItem("USER");
        localStorage.setItem("USER",JSON.stringify(USER)); 
        dispatch(setCurrentUser(USER));
      })
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  }; 
  
  export const profileApp2 = userData => dispatch => {
    axios
      .post('/api/applicants/change2', userData)
      .then(res => {
        var USER = JSON.parse(localStorage.getItem("USER"));
        USER.name = userData.name;
        USER.skills = userData.skills;
        USER.institute = userData.institute; 
        USER.applied = userData.applied;
        USER.employeed = userData.employeed;
        USER.jobs= userData.jobs;
        localStorage.removeItem("USER");
        localStorage.setItem("USER",JSON.stringify(USER)); 
        dispatch(setCurrentUser(USER));
      })
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  }; 
 
  export const changeApplicant = userData => dispatch => {
    axios
      .post('/api/jobs/changeApplicant', userData)
      .then(res => {
        return null;
      })  
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  }; 


// Login - get user token
export const loginUser = userData => dispatch => {
  axios
    .post('/api/login', userData)
    .then(res => {
      // Save to localStorage
// Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      localStorage.setItem("USER",JSON.stringify(decoded));
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};
// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};
// Log user out
export const logoutUser = history => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
  window.location.href = "./login";
};