import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import './App.css'; 

import Navbar from "./components/layout/Navbar";
import Landing from "./components/Landing";
import RegisterApplicant from "./components/RegisterApplicant";
import RegisterRecruiter from "./components/RegisterRecruiter";
import Login from "./components/Login";
import Register from "./components/Register";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./components/Dashboard";
import makeJob from "./components/makeJob";
import showActiveJob from "./components/ShowActiveJob";
import ProfileRecruiter from "./components/profileRecruiter";
import ShowEmployee from "./components/ShowEmployee";
import ProfileApplicant from "./components/profileApplicant";
import ShowJobs from "./components/showJobs";
import showApplication from "./components/showApplication";
// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = JSON.parse(localStorage.getItem("USER"));
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
// Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

class  App extends Component{
  render(){
  return (
    <Provider store={store}>
    <Router>
    <div className="App">
      <Navbar />
      <Route exact path="/" component={Landing} />
      <Route exact path="/registerApplicant" component={RegisterApplicant} />
      <Route exact path="/registerRecruiter" component={RegisterRecruiter} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/dashboard/makeJob" component={makeJob} />
      <Route exact path="/dashboard/showActiveJob" component={showActiveJob} />
      <Route exact path="/dashboard/profileRecruiter" component={ProfileRecruiter} />
      <Route exact path="/dashboard/profileApplicant" component={ProfileApplicant} />
      <Route exact path="/dashboard/showEmployee" component={ShowEmployee} />
      <Route exact path="/dashboard/showJobs" component={ShowJobs} />
      <Route exact path="/dashboard/showApplication" component={showApplication} />
      <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
      </Switch>
    </div>
    </Router>
    </Provider>
  );
  }
}

export default App;
