import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import classnames from "classnames";
import { profileApp } from "../actions/authActions";
import { logoutUser } from "../actions/authActions";
class ProfileApplicant extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      skills: [],
      institute: [],
      rating: "",
      id: "",
      count: "",
      jobs: [],
      errors: {}
    };
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

createUI2(){
  return this.state.institute.map((el, i) => 
      <div key={i}>
      <div><h5>Name of Institute: </h5></div>
       <input type="text" id="insName" value={el.insName||''} onChange={this.handleChange2.bind(this, i)} />
       <div><h5>Starting year: </h5></div>
       <input type="text" id="sDate" value={el.sDate || ''} onChange={this.handleChange2.bind(this,i)} />
       <div><h5>Year of Completion: </h5></div>
       <input type="text" id="eDate" value={el.eDate || ''} onChange={this.handleChange2.bind(this,i)} />
       <input type='button'  value='remove' onClick={this.removeClick2.bind(this, i)}/>
      </div>          
  )
}

handleChange2(i, event) {
let institute = [...this.state.institute];
institute[i][event.target.id] = event.target.value;
//console.log({values});
this.setState({ institute });
}

addClick2(){
this.setState(prevState => ({ institute: [...prevState.institute, '']}))
}

removeClick2(i){
let institute = [...this.state.institute];
institute.splice(i,1);
this.setState({ institute });
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
      this.setState({skills : user.skills});
      this.setState({institute : user.institute});
      this.setState({rating : user.rating});
      this.setState({count : user.count});
      this.setState({id : user.id});
      this.setState({jobs: user.jobs});
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
      count: this.state.count,
      rating: this.state.rating,
      jobs: this.state.jobs,
      skills : this.state.skills,
      institute: this.state.institute
    };
    this.props.profileApp(newUser);
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

              <div>
            <h4>SKILLS:</h4>
           
          {this.createUI()} 
          <input type='button' value='add more' onClick={this.addClick.bind(this)}/>
          </div>
          <div>
            <h4>Add Institute:</h4>
           
          {this.createUI2()} 
          <input type='button' value='add more' onClick={this.addClick2.bind(this)}/>
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
  {profileApp,logoutUser}
)(withRouter(ProfileApplicant));