import React, { Component } from "react";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { Link } from "react-router-dom";
class Navbar extends Component {

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser(this.props.history);
  };
  render() {
    const { user } = this.props.auth;
    if ( user.type ==="applicant") {
      return (
        <div className="navbar-fixed">
          <nav className="z-depth-0" >
            <div className="nav-wrapper black" style={{backgroundColor:"black"}}>
              <Link
                to="/dashboard"
                style={{color: "white"}}
               >  
              Dashboard
            </Link>

              <Link to="/dashboard/showJobs" style={{color: "white",marginLeft:"20px"}}>Find Job</Link>
           
              <Link to="/dashboard/showApplication" style={{color: "white",marginLeft:"20px"}}>Show Your Applications</Link>
    
              <Link to="/dashboard/profileApplicant" style={{color: "white",marginLeft:"20px"}}>Edit Your Profile</Link>
              <button style={{color: "white",marginTop:"20px",float:"right",border:"none",backgroundColor:"black"}} onClick={this.onLogoutClick}>Log Out</button>            
            </div>
          </nav>
        </div>
      );
    }
    else if(user.type==="recruiter"){
      return (
        <div className="navbar-fixed">
          <nav className="z-depth-0" >
            <div className="nav-wrapper black" style={{backgroundColor:"black"}}>
              <Link
                to="/dashboard"
                style={{color: "white"}}
               >  
              Dashboard
            </Link>

              <Link to="/dashboard/makeJob" style={{color: "white",marginLeft:"20px"}}>Create new Job</Link>
           
              <Link to="/dashboard/showActiveJob" style={{color: "white",marginLeft:"20px"}}>Show Your Active Jobs</Link>
              <Link to="/dashboard/showEmployee" style={{color: "white",marginLeft:"20px"}}>Show Employees</Link>
              <Link to="/dashboard/profileRecruiter" style={{color: "white",marginLeft:"20px"}}>Edit Your Profile</Link>
              <button style={{color: "white",marginTop:"20px",float:"right",border:"none",backgroundColor:"black"}} onClick={this.onLogoutClick}>Log Out</button>            
            </div>
          </nav>
        </div>
      );
    }
    else{
      return (
        <div className="navbar-fixed">
          <nav className="z-depth-0">
            <div className="nav-wrapper white">
              <Link
                to="/"
                style={{
                  fontFamily: "monospace"
                }}
                className="col s5 brand-logo center black-text"
              >
                <i className="material-icons">code</i>
              BONDani
            </Link>
            </div>
          </nav>
        </div>
      );
    }
  }
}
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { logoutUser }
)(Navbar);