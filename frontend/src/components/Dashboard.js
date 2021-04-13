import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../actions/authActions";
import { Link } from "react-router-dom";

class Dashboard extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser(this.props.history);
  };
  render() {
    const { user } = this.props.auth;
    console.log(user.name);
    if (user.type==="applicant") {
      return (
        <div>

          <div className="Row">
            <Link to="/dashboard">
              /Dashboard
            </Link>
          </div>

          <div style={{ height: "75vh" }} className="container valign-wrapper">

            <div className="row">
              <div className="col s12 center-align">
                <h4>
                  <b>Hey there,</b> {user.name}
                  <p className="flow-text grey-text text-darken-1">
                    You are logged into a full-stack{" "}
                    <span style={{ fontFamily: "monospace" }}>web-app as an Applicant</span> app 👏
              </p>
                </h4>
                <button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                  }}
                  onClick={this.onLogoutClick}
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Logout
            </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    else {
      return (
        <div>

          <div className="Row">
            <Link to="/dashboard">
              /Dashboard
            </Link>
          </div>
          <div style={{ height: "75vh" }} className="container valign-wrapper">

            <div className="row">
              <div className="col s12 center-align">
                <h4>
                  <b>Hey there,</b> {user.name}
                  <p className="flow-text grey-text text-darken-1">
                    You are logged into a full-stack{" "}
                    <span style={{ fontFamily: "monospace" }}>web-app as an Recruiter</span> app 👏
              </p>
                </h4>
                <button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                  }}
                  onClick={this.onLogoutClick}
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Logout
            </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { logoutUser,logoutUser }
)(Dashboard);