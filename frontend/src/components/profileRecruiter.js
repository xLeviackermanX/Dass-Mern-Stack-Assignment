import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import classnames from "classnames";
import { profileRec } from "../actions/authActions";
import { logoutUser } from "../actions/authActions";
class ProfileRecruiter extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      contactNumber: "",
      bio: "",
      rating: "",
      id: "",
      count: "",
      errors: {}
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }
  componentDidMount(){
      const {user} = this.props.auth;
      this.setState({name : user.name});
      this.setState({email : user.email});
      this.setState({contactNumber : user.contactNumber});
      this.setState({bio : user.bio});
      this.setState({rating : user.rating});
      this.setState({count : user.count});
      this.setState({id : user.id});
  }
onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
onSubmit = e => {
    e.preventDefault();
const newUser = {
      id: this.state.id,
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      contactNumber: ""+this.state.contactNumber,
      rating: this.state.rating,
      bio: this.state.bio
    };
    this.props.profileRec(newUser);
  };
render() {
    const { errors } = this.state;
    var rating = 0.0;
    if(this.state.count!==0)
    {
      rating = parseFloat(this.state.rating)/this.state.count;
    }
return (
      <div className="container">
        <div className="row">
          <div className="col s8 offset-s2">
            <Link to="/dashboard" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to
              Dashboard
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                <b>You can edit your profile</b> below
              </h4>
              <h5>Your rating is : {rating}</h5>
            </div>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                  <div><label htmlFor="name">UPDATE NAME:</label></div>
                <input
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  id="name"
                  type="text"
                  className={classnames("", {
                    invalid: errors.name
                  })}
                />
                <span className="red-text">{errors.name}</span>
              </div>
              <div className="input-field col s12">
                 <div> <label htmlFor="email">EMAIL : </label></div>
                <p>{this.state.email}</p>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password
                  })}
                />
                <label htmlFor="password">New Password</label>
                <span className="red-text">{errors.password}</span>
              </div>
              <div className="input-field col s12">
                 
                <input
                  onChange={this.onChange}
                  value={this.state.password2}
                  error={errors.password2}
                  id="password2"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password2
                  })}
                />
                <label htmlFor="password2">Confirm New Password</label>
                <span className="red-text">{errors.password2}</span>
              </div>
              <div className="input-field col s12">
                  <div>
              <label htmlFor="contactNumber">CONTACT NUMBER:</label></div>
                <input
                  onChange={this.onChange}
                  value={this.state.contactNumber}
                  error={errors.contactNumber}
                  id="contactNumber"
                  type="text"
                  className={classnames("", {
                    invalid: errors.contactNumber
                  })}
                />
                <span className="red-text">{errors.contactNumber}</span>
              </div>
              <div>
                <textarea
                  onChange={this.onChange}
                  value={this.state.bio}
                  error={errors.bio}
                  id="bio"
                  style={{height:"200px"}}
                  type="text"
                  className={classnames("", {
                    invalid: errors.bio
                  })}
                />
                <label htmlFor="bio">BIO</label>
                <span className="red-text">{errors.bio}</span>
              </div>
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                  }}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  EDIT
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  {profileRec,logoutUser}
)(withRouter(ProfileRecruiter));