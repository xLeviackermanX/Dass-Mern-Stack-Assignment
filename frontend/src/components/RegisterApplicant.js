import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { registerApp } from "../actions/authActions";
import classnames from "classnames";
import { logoutUser } from "../actions/authActions";
class registerApplicant extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      institute: [],
      rating: "",
      skills : ["c++","python","java","ruby"],
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
console.log(institute[i][event.target.id]+"......hello");
institute[i][event.target.id] = event.target.value;
//console.log(event.target.value);
this.setState({ institute });
}

addClick2(){
this.setState(prevState => ({ institute: [...prevState.institute, {insName:"",sDate:0,eDate:0}]}))
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


onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
onSubmit = e => {
    e.preventDefault();
const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      institute: this.state.institute,
      //rating: this.state.rating,
      skills: this.state.skills
    };

    this.props.registerApp(newUser, this.props.history); 
  };
render() {
    const { errors } = this.state;
return (
      <div className="container">
        <div className="row">
          <div className="col s8 offset-s2">
            <Link to="/" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to
              home 
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                <b>Register</b> below
              </h4>
              <p className="grey-text text-darken-1">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </div>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  id="name"
                  type="text"
                  className={classnames("",
                    {invalid: errors.name})}
                />
                <label htmlFor="name">Name</label>
                <span className="red-text">{errors.name}</span>            
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                  className={classnames("", {
                    invalid: errors.email
                  })}
                />
                <label htmlFor="email">Email</label>
                <span className="red-text">{errors.email}</span>  
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
                <label htmlFor="password">Password</label>
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
                <label htmlFor="password2">Confirm Password</label>
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
                  Sign up
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
  { registerApp,logoutUser }
)(withRouter(registerApplicant));