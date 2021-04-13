import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { createJob } from "../actions/authActions";
import classnames from "classnames";
import { logoutUser } from "../actions/authActions";
class makeJob extends Component {

  constructor() {
    
    super();
    this.state = {
      title: "",
      email: "",
      recruiter: "",
      type: "Full-Time",
      day: "",
      month: "",
      year: "",
      hour: "",
      minute: "",
      maxApplicant: "",
      remainingApplicant: "",
      salary: "",
      position: "",
      remainingPosition: "",
      Applicant: [],
      skills: ["c++","python","java"],
      duration: "",
      rating: "",
      flag:-1,
      errors: {}
     
    };
    this.onChange = this.onChange.bind(this);
   
  }

  createUI(){
    return this.state.skills.map((el, i) => 
        <div key={i}>
         <input type="text" value={el||''} onChange={this.handleChange.bind(this, i)} />
         {/* <input type="text" value={el || ''} onChange={this.handleChange.bind(this,i)} /> */}
         <input type='button' value='remove' onClick={this.removeClick.bind(this, i)}/>
        </div>          
    )
 }

 handleChange(i, event) {
  let skills = [...this.state.skills];
  skills[i] = event.target.value;
  //console.log({values});
  this.setState({ skills });
}

addClick(){
 this.setState(prevState => ({ skills: [...prevState.skills, '']}))
}

removeClick(i){
  let skills = [...this.state.skills];
  skills.splice(i,1);
  this.setState({ skills });
}


  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

 

  onSubmit = e => {
    e.preventDefault();
    const newUser = {
      title: this.state.title,
      email: this.state.email,
      realRating:this.state.realRating,
      count : this.state.count,
      recruiter: this.state.recruiter,
      type: this.state.type,
      day: this.state.day,
      month: this.state.month,
      year: this.state.year,
      hour: this.state.hour,
      minute: this.state.minute,
      maxApplicant: this.state.maxApplicant,
      remainingApplicant: this.state.remainingApplicant,
      salary: this.state.salary,
      position: this.state.position,
      remainingPosition: this.state.remainingPosition,
      Applicant: this.state.Applicant,
      skills: this.state.skills,
      duration: this.state.duration,
      rating: this.state.rating
    };
    console.log("yeh nayi job hai----"+newUser);
    this.props.createJob(newUser, this.props.history);
    this.setState({flag : -1});
  };
  render() {
    const { errors } = this.state;
    const { user } = this.props.auth;
    this.state.email = user.email;
    this.state.recruiter = user.name;
    this.state.realRating = user.rating;
    this.state.count = user.count;
    // const options = ["Work-from-home", "Part-time", "Full-time"];
    const main = {color: "white",
    backgroundColor: "DodgerBlue",
    fontFamily: "Arial",
    marginTop: "500px",
    fontSize: "20px"
    };
    return (
      <div>

        <div className="Row">
          <Link to="/dashboard">
            /Dashboard
            </Link>
          <Link to="/dashboard/makeJob">
            /create new job
            </Link>
        </div>

        <form noValidate onSubmit={this.onSubmit}>
          <div className="input-field col s12">
            <input
              onChange={this.onChange}
              value={this.state.title}
              error={errors.title}
              id="title"
              type="text"
              className={classnames("", {
                invalid: errors.title
              })}
            />
            <label htmlFor="title">Title</label>
            <span className="red-text">{errors.title}</span>
          </div>
          <div className="input-field col s12">
            <input
              onChange={this.onChange}
              value={this.state.position}
              error={errors.position}
              id="position"
              type="text"
              className={classnames("", {
                invalid: errors.position
              })}
            />
            <label htmlFor="position">Position</label>
            <span className="red-text">{errors.position}</span>
          </div>
          <div className="input-field col s12">
            <input
              onChange={this.onChange}
              value={this.state.salary}
              error={errors.salary}
              id="salary"
              type="text"
              className={classnames("", {
                invalid: errors.salary
              })}
            />
            <label htmlFor="salary">Salary</label>
            <span className="red-text">{errors.salary}</span>
          </div>
          <div className="input-field col s12">
            <input
              onChange={this.onChange}
              value={this.state.duration}
              error={errors.duration}
              id="duration"
              type="text"
              className={classnames("", {
                invalid: errors.duration
              })}
            />
            <label htmlFor="duration">Duration</label>
            <span className="red-text">{errors.duration}</span>
          </div>
          {/* <div>
            <label>SKILLS:</label>
           
          {this.createUI()}        
          <input type='button' value='add more' onClick={this.addClick.bind(this)}/>
          </div> */}
          <div className="input-field col s12">
            <input
              onChange={this.onChange}
              value={this.state.maxApplicant}
              error={errors.maxApplicant}
              id="maxApplicant"
              type="text"
              className={classnames("", {
                invalid: errors.maxApplicant
              })}
            />
            <label htmlFor="maxApplicant">Maximum number of applications</label>
            <span className="red-text">{errors.maxApplicant}</span>
          </div>
          <label>Type of Job:</label>
          <select id="type" className="browser-default" value={this.state.type} onChange={this.onChange}>
              <option value="Work-From-Home">Work-from-home</option>
              <option value="Part-Time">Part-time</option>
              <option value="Full-Time">Full-time</option>
          </select>
          <label style={main}>Choose Deadline</label>
          <div className="Row">
          <label>Day of Deadline</label>
          <input
              onChange={this.onChange}
              value={this.state.day}
              error={errors.day}
              id="day"
              type="text"
              className={classnames("", {
                invalid: errors.day
              })}
            />
            <label>Month of Deadline</label>
            <input
              onChange={this.onChange}
              value={this.state.month}
              error={errors.day}
              id="month"
              type="text"
              className={classnames("", {
                invalid: errors.day
              })}
            />
            <label>year of Deadline</label>
            <input
              onChange={this.onChange}
              value={this.state.year}
              error={errors.day}
              id="year"
              type="text"
              className={classnames("", {
                invalid: errors.day
              })}
            />
            <span className="red-text">{errors.day}</span>
            </div>
            <label style={main}>Choose timing of Deadline</label>
            <div className="Row">
              <label>Hour of deadline</label>
            <input
              onChange={this.onChange}
              value={this.state.hour}
              error={errors.hour}
              id="hour"
              type="text"
              className={classnames("", {
                invalid: errors.hour
              })}
            />
            {/* <label htmlFor="maxApplicant">Maximum number of applications</label> */}
            <label>Minutes of deadline</label>
            <input
              onChange={this.onChange}
              value={this.state.minute}
              error={errors.hour}
              id="minute"
              type="text"
              className={classnames("", {
                invalid: errors.hour
              })}
            />
            {/* <label htmlFor="maxApplicant">Maximum number of applications</label> */}
            <span className="red-text">{errors.hour}</span>
          </div>
          {/* <Select
          value={this.state.type}
          onChange={this.handleType}
          options={options}
          /> */}
              <div className="col s12" style={{ paddingLeft: "11.250px" ,marginTop: "150px"}}>
            <button
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
              }}
              type="submit"
              onSubmit={this.onSubmit}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Create Job
                </button>
          </div>
        </form>
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
  { createJob ,logoutUser}
)(withRouter(makeJob));