import React, { Component } from "react";
import { logoutUser } from "../actions/authActions";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { createJob } from "../actions/authActions";
import classnames from "classnames";

class Landing extends Component {
  render() {
    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <h4>
              <b>Welcome</b> ,Become rich bruh by making good use of this web-app....{" "}
              <span style={{ fontFamily: "monospace" }}>BONDani</span> , Now you can also be called snakes by your friends
            </h4>
            <p className="flow-text grey-text text-darken-1">
              Please grade my assignment leniently...
            </p>
            <br />
            <div className="col s6">
              <Link
                to="/register"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
              >
                Register
              </Link>
            </div>
            <div className="col s6">
              <Link
                to="/login"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
                className="btn btn-large btn-flat waves-effect white black-text"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Landing