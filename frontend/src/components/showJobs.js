import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { showApplicant, changeApplicant, profileApp2 } from "../actions/authActions";
import { Link } from "react-router-dom";
import axios from 'axios';
import classNames from "classnames";
import Moment from "react-moment";
import Fuse from 'fuse.js'
import { logoutUser } from "../actions/authActions";
class showJobs extends Component {

    constructor(props) {
        super(props) //since we are extending class Table so we have to use super in order to override Component class constructor
        this.state = { //state is by default an object
            jobs: [],
            activeJobs: [],
            alljob: [],
            allstatus: [],
            filteredJobs: [],
            appliedJobs: [],
            applicants: [],
            flag: -1,
            user: { email: "" },
            search: "",
            minSalary: 0,
            maxSalary: Number.MAX_SAFE_INTEGER,
            minDuration: 0,
            maxDuration: 6,
            type: { "Work-From-Home": 1, "Part-Time": 1, "Full-Time": 1 },
            arg: "title",
            order: "asc",
            col: ["red", "white", "yellow", "green"],
            errors: {}
        };
        this.upgrade = this.upgrade.bind(this);
        this.reject = this.reject.bind(this);
        this.incApp = this.incApp.bind(this);
        this.incPos = this.incPos.bind(this);
        this.deleteJob = this.deleteJob.bind(this);
        this.onChange = this.onChange.bind(this);
        this.apply = this.apply.bind(this);
        this.onChange2 = this.onChange2.bind(this);
        this.inc = this.inc.bind(this);
        this.dec = this.dec.bind(this);
        // this.sortList = this.sortList.bind(this);
    }
    inc = e => {
        e.preventDefault();
        var i = 0;
        var j = 0;
        const { user } = this.props.auth;
        while (this.state.alljob[i] && this.state.alljob[i]._id !== e.target.id) {
            i += 1;
        }
        while (user.jobs[j] && user.jobs[j].id !== e.target.id) {
            j += 1;
        }
        if (user.jobs[j].rating < 5) {
            user.jobs[j].rating += 1;
            this.state.alljob[i].yourRating += 1;
            this.state.alljob[i].rating += 1;
            axios.post('/api/applicants/yourinc', user.jobs[j])
                .then(response => { return null; })
            axios.post('/api/jobs/yourinc', user.jobs[j])
                .then(response => { return null; })
        }
    }
    dec = e => {
        e.preventDefault();
        var i = 0;
        var j = 0;
        const { user } = this.props.auth;
        while (this.state.alljob[i] && this.state.alljob[i]._id !== e.target.id) {
            i += 1;
        }
        while (user.jobs[j] && user.jobs[j].id !== e.target.id) {
            j += 1;
        }
        if (user.jobs[j].rating > 0) {
            user.jobs[j].rating -= 1;
            this.state.alljob[i].yourRating -= 1;
            this.state.alljob[i].rating -= 1;
            axios.post('/api/applicants/yourdec', user.jobs[j])
                .then(response => { return null; })
            axios.post('/api/jobs/yourdec', user.jobs[j])
                .then(response => { return null; })
        }
    }
    apply = e => {
        e.preventDefault();
        const { user } = this.props.auth;
        if (user.employeed === 0 && user.applied < 10) {
            var i = 0;
            while (this.state.activeJobs[i] && this.state.activeJobs[i]._id !== e.target.id) {
                i += 1;
            }
            this.state.activeJobs[i].remainingApplicant -= 1;

            var d = new Date();
            var words = prompt("Write SOP for applying.....", "");
            if (words !== null) {
                var userData = {
                    joinDate: d,
                    id: user.id,
                    email: user.email,
                    sop: words,
                    name: user.name,
                    rating: 0,
                    realRating: 0,
                    count: 0,
                    skills: user.skills,
                    status: "pending",
                    date: d,
                    statusNum: 1,
                }
                var naya = user;
                naya.applied += 1;
                naya.employeed = 0;
                naya.jobs.push({ id: this.state.activeJobs[i]._id, rating: 0 });
                this.state.activeJobs[i].Applicant.push(userData);
                this.props.changeApplicant(this.state.activeJobs[i]);
                this.props.profileApp2(naya);
            }
        }
        else if (user.employeed === 1) {
            var str = prompt("You are already working in some agency according our database. If you are not working there anymore then type-yes!", "");
            if (str === "yes") {
                var naya = user;
                naya.applied = 0;
                naya.employeed = 0;
                this.props.profileApp2(naya);
            }
        }
        else {
            prompt("Sorry you already have 10 active applications and hence are not allowed to apply!");
        }
        this.setState({ filteredJobs: [] });
    }

    onChange = e => {
        e.preventDefault();

        this.setState({ [e.target.id]: e.target.value });

    }
    onChange2 = e => {
        e.preventDefault();
        var str = this.state.type;
        str[e.target.id] = 1 - str[e.target.id];
        this.setState({ type: str });

    }
    upgrade = e => {
        e.preventDefault();
        var ind = 0;
        console.log(ind);
        while (this.state.activeJobs[this.state.flag].Applicant[ind] && this.state.activeJobs[this.state.flag].Applicant[ind].email !== e.target.id) {
            ind += 1;
        }
        var k = this.state.activeJobs[this.state.flag].Applicant[ind].statusNum;
        if (k === 1) {
            this.state.activeJobs[this.state.flag].Applicant[ind].statusNum += 1;
            this.state.activeJobs[this.state.flag].Applicant[ind].status = "short-listed";

        }
        else if (k === 2) {
            this.state.activeJobs[this.state.flag].Applicant[ind].statusNum += 1;
            this.state.activeJobs[this.state.flag].Applicant[ind].status = "accepted";
            this.state.activeJobs[this.state.flag].remainingPosition -= 1;
        }
        this.props.changeApplicant(this.state.activeJobs[this.state.flag]);
        this.setState({ applicants: [] });
    };

    reject = e => {
        e.preventDefault();
        var ind = 0;
        while (this.state.activeJobs[this.state.flag].Applicant[ind] && this.state.activeJobs[this.state.flag].Applicant[ind].email !== e.target.id) {
            ind += 1;
        }
        this.state.activeJobs[this.state.flag].Applicant[ind].statusNum = 0;
        this.state.activeJobs[this.state.flag].Applicant[ind].status = "rejected";
        this.props.changeApplicant(this.state.activeJobs[this.state.flag]);
        this.setState({ applicants: [] });
    };

    onClick = e => {
        e.preventDefault();
        // console.log(e.target);
        var ind = 0;
        while (this.state.activeJobs[ind] && this.state.activeJobs[ind]._id !== e.target.id) {
            ind += 1;
        }
        this.setState({ flag: ind });
    };

    back = e => {
        e.preventDefault();
        this.state.applicants = [];
        this.setState({ flag: -1 });
    }

    onSubmit = e => {
        e.preventDefault();
        console.log("Aur bhai sb bdia??");
    };

    deleteJob = e => {
        e.preventDefault();
        var userData = {
            id: e.target.id
        }
        axios.post('/api/jobs/delete', userData)
            .then(response => {
                return null;
            });
        var i = 0;
        while (this.state.activeJobs[i] && this.state.activeJobs[i]._id !== e.target.id) {
            i += 1;
        }
        this.state.jobs[i].year = 0;
        this.setState({ activeJobs: [] });
    }

    incApp = e => {
        e.preventDefault();
        var i = 0;
        while (this.state.activeJobs[i] && this.state.activeJobs[i]._id !== e.target.id) {
            i += 1;
        }
        this.state.activeJobs[i].maxApplicant += 1;
        this.state.activeJobs[i].remainingApplicant += 1;
        var userData = this.state.activeJobs[i];
        axios.post('/api/jobs/changeApplicant', userData)
            .then(response => {
                this.props.history.push("/dashboard/showJobs");
            });
    }

    incPos = e => {
        e.preventDefault();
        var i = 0;
        while (this.state.activeJobs[i] && this.state.activeJobs[i]._id !== e.target.id) {
            i += 1;
        }
        this.state.activeJobs[i].position += 1;
        this.state.activeJobs[i].remainingPosition += 1;
        var userData = this.state.activeJobs[i];
        axios.post('/api/jobs/changeApplicant', userData)
            .then(response => {
                this.props.history.push("/dashboard/showJobs");
            });
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }


    componentDidMount() {
        const { user } = this.props.auth;
        const userData = {
            email: user.email
        };

        axios.post('/api/jobs/allJobs', userData)
            .then(response => {
                this.setState({ jobs: response.data });
                console.log(this.state.jobs);
                // console.log(this.state.jobs);
                var index = 0;
                var date = new Date();
                var f = parseInt(date.getFullYear());
                var g = parseInt(date.getMonth());
                var h = parseInt(date.getDate());
                var i = parseInt(date.getHours());
                var j = parseInt(date.getMinutes());
                g += 1;
                while (this.state.jobs[index]) {
                    var a = parseInt(this.state.jobs[index].year);
                    var b = parseInt(this.state.jobs[index].month);
                    var c = parseInt(this.state.jobs[index].day);
                    var d = parseInt(this.state.jobs[index].hour);
                    var e = parseInt(this.state.jobs[index].minute);
                    if (a < f);
                    else if (a === f && b < g);
                    else if (a === f && b === g && c < h);
                    else if (a === f && b === g && c === h && d < i);
                    else if (a === f && b === g && c === h && d === i && e < j);
                    else {
                        this.state.activeJobs.push(this.state.jobs[index]);
                        // console.log("yoyoyoyoyoyoyoyoyoy");
                    }
                    index += 1;
                }
                this.setState({ jobs: response.data });
            })
            .catch(function (error) {
                console.log(error);
                console.log("errorrrr");
            })
    }


    renderTableData() {
        this.state.filteredJobs = [];
        var arg = this.state.arg;
        const { user } = this.props.auth;
        var Jobs = user.jobs;
        console.log(this.state.activeJobs);
        if (arg === "salary") {
            this.state.activeJobs.sort((a, b) => {
                return a.salary - b.salary;
            })

        }
        else if (arg === "duration") {
            this.state.activeJobs.sort((a, b) => {
                return a.duration - b.duration;
            })

        }
        else {
            this.state.activeJobs.sort((a, b) => {
                return a.rating - b.rating;
            })

        }
        if (this.state.ord === "asc");
        else {
            this.state.activeJobs.reverse();
        }
        var i = 0;

        while (this.state.activeJobs[i]) {
            if (this.state.activeJobs[i].salary < this.state.minSalary || this.state.activeJobs[i] > this.state.maxSalary);
            else if (this.state.activeJobs[i].duration < this.state.minDuration || this.state.activeJobs[i].duration > this.state.maxDuration);
            else if (this.state.type[this.state.activeJobs[i].type] === 0);
            else {
                var j = 0;
                var check = 0;
                //console.log(typeof (Jobs));
                while (Jobs[j]) {
                    if (Jobs[j].id === this.state.activeJobs[i]._id) {
                        check = 1;
                    }
                    j += 1
                }
                console.log(this.state.activeJobs[i].duration + "........." + this.state.maxDuration);
                if (check === 0) {
                    this.state.activeJobs[i].flag = 0;
                    this.state.filteredJobs.push(this.state.activeJobs[i]);
                }
                else {
                    this.state.activeJobs[i].flag = 1;
                    this.state.filteredJobs.push(this.state.activeJobs[i]);
                }
            }
            i += 1;
        }
        if(this.state.search!==""){
        const option = {
            includeScore: true,
            keys: ['title']
        }
        const fuse = new Fuse(this.state.filteredJobs, option);
        var results = fuse.search(this.state.search);
        this.state.filteredJobs = results.map(result=>result.item);
    }
        // const arr = [{_id:"1",title:"yo1",position:"5",remainingPosition:"5",maxApplicant:"5",remainingApplicant:"5"},{_id:"2",title:"yo2",position:"5",remainingPosition:"5",maxApplicant:"5",remainingApplicant:"5"}];
        // console.log(this.state.activeJobs[0]);

        return this.state.filteredJobs.map((job, ind) => {
            const { _id, day, type, month, year, title, salary, duration, skills, remainingApplicant, count, flag, rating } = job //destructuring
            return (
                <tr key={_id}>
                    <td>{title}</td>
                    <td>{salary}</td>
                    <td>{duration}</td>
                    <td>{type}</td>
                    <td>{skills.map((skill, i) => { return (<ul><li>{skill}</li></ul>) })}</td>
                    {count === 0 ? (<td>0</td>) : (<td>{parseFloat(rating) / count}</td>)}
                    <td>{day + "-" + month + "-" + year}</td>
                    {remainingApplicant === 0 ? (<td><button style={{ backgroundColor: "red" }} id={_id} >FULL</button></td>) : (<td></td>)}
                    {remainingApplicant !== 0 && flag === 0 ? (<td><button style={{ backgroundColor: "yellow" }} id={_id} onClick={this.apply}>APPLY</button></td>) : (<td></td>)}
                    {remainingApplicant !== 0 && flag === 1 ? (<td><button style={{ backgroundColor: "green" }} id={_id}>APPLIED</button></td>) : (<td></td>)}
                    {/* <td><button style={{ backgroundColor: "yellow" }} id={_id} onClick={this.incApp}>Increase Application</button></td> */}

                </tr>
            )
        });

    }

    renderTableData2() {
        var i = 0;

        while (this.state.activeJobs[this.state.flag].Applicant[i]) {
            if (this.state.activeJobs[this.state.flag].Applicant[i].statusNum !== 0) {
                this.state.applicants.push(this.state.activeJobs[this.state.flag].Applicant[i]);
            }
            i += 1;
        }
        var arg = this.state.arg;
        if (this.state.ord === "asc") {
            if (arg === "name") {
                this.state.applicants.sort((a, b) => {
                    return a.name - b.name;
                })
            }

            else {
                this.state.applicants.sort((a, b) => {
                    return a.realRating - b.realRating;
                })
            }
        }
        else {
            if (arg === "name") {
                this.state.applicants.sort((a, b) => {
                    return b.name - a.name;
                })
            }
            else if (arg === "date") {
                this.state.applicants.sort((a, b) => {
                    return b.date - a.date;
                })
            }
            else {
                this.state.applicants.sort((a, b) => {
                    return b.realRating - a.realRating;
                })
            }
        }
        // const arr = [{_id:"1",title:"yo1",position:"5",remainingPosition:"5",maxApplicant:"5",remainingApplicant:"5"},{_id:"2",title:"yo2",position:"5",remainingPosition:"5",maxApplicant:"5",remainingApplicant:"5"}];
        // console.log(this.state.activeJobs[0]);
        // console.log(this.state.activeJobs[this.state.flag] +"yyyyyyyyyyyyyyyyyyyyyyyy"+this.state.flag);

        return this.state.applicants.map((applicant, ind) => {
            const { email, name, rating, skills, day, month, year, status, statusNum, sop } = applicant //destructuring
            return (
                <tr key={email}>
                    <td>{name}</td>
                    <td>{rating}</td>
                    <td>{skills}</td>
                    <td><p>{sop}</p></td>
                    <td><Moment format="DD-MM-YYYY">{"" + day + month + year}</Moment></td>
                    <td><button className={classNames('ButtonUI', this.state.col[statusNum])} id={email} onClick={this.upgrade}>{status}</button></td>
                    {statusNum !== 3 ? (
                        <td><button style={{ backgroundColor: "red" }} id={email} onClick={this.reject}>Reject this Applicant</button></td>
                    ) : (<td></td>)}
                </tr>
            )
        });
    }

    render() {

        return (
            <div>
                <div className="Row">
                    <Link to="/dashboard">
                        /Dashboard
                    </Link>
                </div>
                <h1 id='header'>Active Jobs</h1>

                <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.search}
                  id="search"
                  type="text"
                />
                <label htmlFor="search">SEARCH:</label>
                </div>
                <div>
                    <h5>Sort According To:</h5>
                    <select id="arg" className="browser-default" value={this.state.arg} onChange={this.onChange}>
                        <option value="salar">Salary</option>
                        <option value="duration">Duration</option>
                        <option value="realRating">Rating</option>

                    </select>
                    <select id="ord" className="browser-default" value={this.state.ord} onChange={this.onChange}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
                <h5>Filters:</h5>
                <div>
                    <h6>Duration:</h6>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <div>From: <select id="minDuration" className="browser-default" style={{ width: "60px" }} value={this.state.minDuration} onChange={this.onChange}>
                            <option value={parseInt("0")}>0</option>
                            <option value={parseInt("1")}>1</option>
                            <option value={parseInt("2")}>2</option>
                            <option value={parseInt("3")}>3</option>
                            <option value={parseInt("4")}>4</option>
                            <option value={parseInt("5")}>5</option>
                            <option value={parseInt("6")}>6</option>
                        </select></div>
                        <div style={{ marginLeft: "50px" }}>To:<select id="maxDuration" className="browser-default" style={{ width: "60px" }} value={this.state.maxDuration} onChange={this.onChange}>
                            <option value={parseInt("0")}>0</option>
                            <option value={parseInt("1")}>1</option>
                            <option value={parseInt("2")}>2</option>
                            <option value={parseInt("3")}>3</option>
                            <option value={parseInt("4")}>4</option>
                            <option value={parseInt("5")}>5</option>
                            <option value={parseInt("6")}>6</option>

                        </select>
                        </div>
                    </div>
                    <h6>Salary</h6>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        From: <div style={{ marginTop: "20px" }}>
                            <input className="browser-default" onClick={this.onChange} id="minSalary" value={this.state.minSalary} style={{ width: "150px" }} />
                        </div>
                        To: <div style={{ marginLeft: "100px", marginTop: "20px" }}>
                            <input onClick={this.onChange} id="maxSalary" value={this.state.maxSalary} style={{ width: "150px" }} />
                        </div>
                    </div>
                    <h6>Type of Job: </h6>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <div>Work-From-Home:</div><div style={{ marginLeft: "100px" }}>{this.state.type["Work-From-Home"] === 1 ? (<button onClick={this.onChange2} id="Work-From-Home" style={{ backgroundColor: "green" }}>INCLUDED</button>) : (<button onClick={this.onChange2} id="Work-From-Home" style={{ backgroundColor: "red" }}>NOT INCLUDED</button>)}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <div>Part-Time:</div><div style={{ marginLeft: "155px" }}>{this.state.type["Part-Time"] === 1 ? (<button onClick={this.onChange2} id="Part-Time" style={{ backgroundColor: "green" }}>INCLUDED</button>) : (<button onClick={this.onChange2} id="Part-Time" style={{ backgroundColor: "red" }}>NOT INCLUDED</button>)}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <div>Full-Time:</div><div style={{ marginLeft: "158px" }}>{this.state.type["Full-Time"] === 1 ? (<button onClick={this.onChange2} id="Full-Time" style={{ backgroundColor: "green" }}>INCLUDED</button>) : (<button onClick={this.onChange2} id="Full-Time" style={{ backgroundColor: "red" }}>NOT INCLUDED</button>)}</div>
                    </div>
                </div>

                <table id='jobs' className="default-browser">
                    <tbody>
                        <tr>
                            <td>TITLE</td>
                            <td>SALARY</td>
                            <td>DURATION</td>
                            <td>TYPE</td>
                            <td>SKILL</td>
                            <td>RATING</td>
                            <td>DEADLINE</td>
                        </tr>
                        {this.renderTableData()}
                    </tbody>
                </table>
            </div>
        )

    }

}

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});
export default connect(
    mapStateToProps,
    { showApplicant, changeApplicant, profileApp2,logoutUser }
)(showJobs);