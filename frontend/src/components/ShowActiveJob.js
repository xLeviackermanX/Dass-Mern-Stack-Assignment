import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { showApplicant, changeApplicant } from "../actions/authActions";
import { Link } from "react-router-dom";
import axios from 'axios';
import classNames from "classnames";
import Moment from "react-moment";
import { logoutUser } from "../actions/authActions";

class showActiveJob extends Component {

    constructor(props) {
        super(props) //since we are extending class Table so we have to use super in order to override Component class constructor
        this.state = { //state is by default an object
            jobs: [],
            alljobs: [],
            activeJobs: [],
            applicants: [],
            flag: -1,
            user: { email: "" },
            table: "jobs",
            arg: "title",
            ord: "asc",
            col: ["red", "white", "yellow", "green"],
            errors: {}
        };
        this.upgrade = this.upgrade.bind(this);
        this.reject = this.reject.bind(this);
        this.incApp = this.incApp.bind(this);
        this.incPos = this.incPos.bind(this);
        this.deleteJob = this.deleteJob.bind(this);
        this.onChange = this.onChange.bind(this);
        // this.sortList = this.sortList.bind(this);
    }

    onChange = e => {
        e.preventDefault();
        this.setState({ [e.target.id]: e.target.value });
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
            var date = new Date();
            this.state.activeJobs[this.state.flag].Applicant[ind].statusNum += 1;
            this.state.activeJobs[this.state.flag].Applicant[ind].status = "accepted";
            this.state.activeJobs[this.state.flag].Applicant[ind].joinDate = date;
            this.state.activeJobs[this.state.flag].remainingPosition -= 1;
            this.state.activeJobs[this.state.flag].count += 1;

            var m = 0;
            var n = 0;
            for (m = 0; m < this.state.alljobs.length; m++) {
                if (this.state.alljobs[m]._id === this.state.activeJobs[this.state.flag]._id);
                else {
                    var x = -1;
                    for (n = 0; n < this.state.alljobs[m].Applicant.length; n++) {
                        if (this.state.alljobs[m].Applicant[n].id === this.state.activeJobs[this.state.flag].Applicant[ind].id) {
                            x = n;
                            break;
                        }
                    }
                    console.log("teri maa.....");
                    if (x !== -1 && this.state.alljobs[m].Applicant[x].status !== "accepted") {
                        console.log("teri behen ki.....")
                        this.state.alljobs[m].Applicant[x].status = "rejected";
                        this.state.alljobs[m].Applicant[x].statusNum = 0;
                        this.props.changeApplicant(this.state.alljobs[m]);
                    }
                }
            }

            m = 0;
            n = 0;
            for (m = 0; m < this.state.activeJobs.length; m++) {
                var x = -1;
                for (n = 0; n < this.state.activeJobs[m].Applicant.length; n++) {
                    if (this.state.activeJobs[m].Applicant[n].id === this.state.activeJobs[this.state.flag].Applicant[ind].id) {
                        x = n;
                        break;
                    }
                }
                console.log("teri maa.....");
                if (x !== -1 && this.state.activeJobs[m].Applicant[x].status !== "accepted") {
                    console.log("teri behen ki.....")
                    this.state.activeJobs[m].Applicant[x].status = "rejected";
                    this.state.activeJobs[m].Applicant[x].statusNum = 0;
                }

            }

            if (this.state.activeJobs[this.state.flag].remainingPosition === 0) {
                var j = 0;
                while (this.state.activeJobs[this.state.flag].Applicant[j]) {
                    if (this.state.activeJobs[this.state.flag].Applicant[j].statusNum !== 3) {
                        this.state.activeJobs[this.state.flag].Applicant[j].statusNum = 0;
                        this.state.activeJobs[this.state.flag].Applicant[j].status = "rejected";
                        axios.post('/api/applicants/rejected', this.state.activeJobs[this.state.flag].Applicant[j])
                            .then(response => {
                                return null;
                            });
                    }
                    j += 1
                }

            }
            var pur = {
                email: this.state.activeJobs[this.state.flag].Applicant[ind].email,
                recemail: this.state.activeJobs[this.state.flag].name
            }
            axios.post('/api/applicants/accepted', pur)
                .then(response => {
                    return null;
                });
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
        axios.post('/api/applicants/rejected', this.state.activeJobs[this.state.flag].Applicant[ind])
            .then(response => {
                return null;
            });
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
        this.state.arg = "name";
        this.setState({ flag: ind });
    };

    back = e => {
        e.preventDefault();
        this.state.applicants = [];
        this.setState({ arg: "title" });
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
        while (this.state.jobs[i] && this.state.jobs[i]._id !== e.target.id) {
            i += 1;
        }
        this.state.jobs[i].remainingPosition = 0;
        var j = 0;
        i = 0;
        while (this.state.activeJobs[i] && this.state.activeJobs[i]._id !== e.target.id) {
            i += 1;
        }
        while (this.state.activeJobs[i].Applicant[j]) {
            if (this.state.activeJobs[i].Applicant[j].statusNum !== 3) {
                axios.post('/api/applicants/rejected', this.state.activeJobs[i].Applicant[j])
                    .then(response => {
                        return null;
                    });
            }
            else {
                axios.post('/api/applicants/fired', this.state.activeJobs[i].Applicant[j])
                    .then(response => {
                        return null;
                    });
            }
            j++;
        }
        this.setState({ activeJobs: [] });
        this.componentDidMount();
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
                this.props.history.push("/dashboard/showActiveJob");
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
                this.props.history.push("/dashboard/showActiveJob");
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
        console.log("kartik...");
        axios.post('/api/jobs/allJobs', userData)
            .then(response => {
                this.setState({ alljobs: response.data });
                console.log(response.data);
            })
            .catch(err => console.log(err.response.data));

        axios.post('/api/jobs/activeJobs', userData)
            .then(response => {
                this.setState({ jobs: response.data });
                // console.log(this.state.jobs);
                var index = 0;

                while (this.state.jobs[index]) {
                    if (this.state.jobs[index].remainingPosition === 0);
                    else {
                        this.state.activeJobs.push(this.state.jobs[index]);
                        console.log("yoyoyoyoyoyoyoyoyoy");
                    }
                    index += 1;
                }

                this.setState({ jobs: this.state.jobs });
            })
            .catch(function (error) {
                console.log(error);
                console.log("errorrrr");
            })

    }


    renderTableData() {
        var arg = this.state.arg;
        if (this.state.ord === "asc") {
            if (arg === "title") {
                this.state.activeJobs.sort((a, b) => {
                    return ('' + a.title).localeCompare(b.title);
                })
            }
            else if (arg === "date") {
                this.state.activeJobs.sort((a, b) => {
                    return new Date(a.date) - new Date(b.date);
                })
            }
            else if (arg === "maxApplicant") {
                this.state.activeJobs.sort((a, b) => {
                    return a.maxApplicant - b.maxApplicant;
                })
            }
            else {
                this.state.activeJobs.sort((a, b) => {
                    return a.position - b.position;
                })
            }
        }
        else {
            if (arg === "title") {
                this.state.activeJobs.sort((a, b) => {
                    return ('' + a.title).localeCompare(b.title);
                })
                this.state.activeJobs.reverse();
            }
            else if (arg === "date") {
                this.state.activeJobs.sort((a, b) => {
                    return new Date(a.date) - new Date(b.date);
                })
                this.state.activeJobs.reverse();
            }
            else if (arg === "maxApplicant") {
                this.state.activeJobs.sort((a, b) => {
                    return b.maxApplicant - a.maxApplicant;
                })
            }
            else {
                this.state.activeJobs.sort((a, b) => {
                    return b.position - a.position;
                })
            }
        }
        // const arr = [{_id:"1",title:"yo1",position:"5",remainingPosition:"5",maxApplicant:"5",remainingApplicant:"5"},{_id:"2",title:"yo2",position:"5",remainingPosition:"5",maxApplicant:"5",remainingApplicant:"5"}];
        // console.log(this.state.activeJobs[0]);

        return this.state.activeJobs.map((job, ind) => {
            const { _id, date, title, position, remainingPosition, maxApplicant, remainingApplicant } = job //destructuring
            return (
                <tr key={_id}>
                    <td><button className="button" id={_id} onClick={this.onClick}>{title}</button></td>
                    <td>{position}</td>
                    <td>{remainingPosition}</td>
                    <td>{maxApplicant}</td>
                    <td>{remainingApplicant}</td>
                    <td><Moment format="DD-MM-YYYY">{date}</Moment></td>
                    <td><button style={{ backgroundColor: "yellow" }} id={_id} onClick={this.incApp}>Increase Application</button></td>
                    <td><button style={{ backgroundColor: "green" }} id={_id} onClick={this.incPos}>Increase Position</button></td>
                    <td><button style={{ backgroundColor: "red" }} id={_id} onClick={this.deleteJob}>DELETE</button></td>
                </tr>
            )
        });
    }

    renderTableData2() {
        var i = 0;
        console.log("lodu...");
        this.state.applicants = [];
        while (this.state.activeJobs[this.state.flag].Applicant[i]) {
            if (this.state.activeJobs[this.state.flag].Applicant[i].statusNum !== 0)
                this.state.applicants.push(this.state.activeJobs[this.state.flag].Applicant[i]);

            i += 1;
        }


        // console.log(this.state.applicants);
        var arg = this.state.arg;
        if (arg === "name") {
            this.state.applicants.sort((a, b) => {
                return ('' + a.name).localeCompare(b.name);
            })
        }
        else if (arg === "date") {
            this.state.applicants.sort((a, b) => {
                return new Date(a.date) - new Date(b.date);
            })
        }
        else {
            this.state.applicants.sort((a, b) => {
                return a.realRating - b.realRating;
            })
        }
        if (this.state.ord === "asc");
        else {
            this.state.applicants.reverse();
        }
        // const arr = [{_id:"1",title:"yo1",position:"5",remainingPosition:"5",maxApplicant:"5",remainingApplicant:"5"},{_id:"2",title:"yo2",position:"5",remainingPosition:"5",maxApplicant:"5",remainingApplicant:"5"}];
        // console.log(this.state.activeJobs[0]);
        // console.log(this.state.activeJobs[this.state.flag] +"yyyyyyyyyyyyyyyyyyyyyyyy"+this.state.flag);
        console.log("gaandu");
        return this.state.applicants.map((applicant, ind) => {
            const { email, name, realRating, count, skills, date, status, statusNum, sop } = applicant //destructuring
            return (
                <tr key={email}>
                    <td>{name}</td>
                    {count === 0 ? (<td>0</td>) : (<td>{parseFloat(realRating) / count}</td>)}
                    <td>{skills.map((skill, kl) => { return (<ul><li>{skill}</li></ul>) })}</td>
                    <td><p>{sop}</p></td>
                    <td><Moment format="DD-MM-YYYY">{date}</Moment></td>
                    <td><button className={classNames('ButtonUI', this.state.col[statusNum])} id={email} onClick={this.upgrade}>{status}</button></td>
                    {statusNum !== 3 ? (
                        <td><button style={{ backgroundColor: "red" }} id={email} onClick={this.reject}>Reject this Applicant</button></td>
                    ) : (<td></td>)}
                </tr>

            )
        });
    }

    render() {
        console.log(this.state.applicants);
        if (this.state.flag === -1) {
            return (
                <div>
                    <div className="Row">
                        <Link to="/dashboard">
                            /Dashboard
                        </Link>
                    </div>
                    <div>
                        <select id="arg" className="browser-default" value={this.state.arg} onChange={this.onChange}>
                            <option value="title">Job Title</option>
                            <option value="date">Date of Posting</option>
                            <option value="maxApplicant">Total Applicants</option>
                            <option value="position">Total Positions</option>

                        </select>
                        <select id="ord" className="browser-default" value={this.state.ord} onChange={this.onChange}>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                    <h1 id='header'>Active Jobs Created By You</h1>
                    <table id='jobs' className="default-browser">
                        <tbody>
                            <tr>
                                <td>TITLE</td>
                                <td>TOTAL POSITIONS</td>
                                <td>REMAINING POSITIONS</td>
                                <td>TOTAL APPLICANTS</td>
                                <td>REMAINING APPLICANTS</td>
                                <td>DATE OF POSTING</td>
                            </tr>
                            {this.renderTableData()}
                        </tbody>
                    </table>
                </div>
            )
        }
        else {
            return (
                <div>
                    <div className="Row">
                        <Link to="/dashboard">
                            /Dashboard
                        </Link>
                        <button onClick={this.back}>/Show Active Jobs</button>
                    </div>
                    <div>
                        <select id="arg" className="browser-default" value={this.state.arg} onChange={this.onChange}>
                            <option value="name">Name</option>
                            <option value="date">Date of Application</option>
                            <option value="Rating">Rating</option>

                        </select>
                        <select id="ord" className="browser-default" value={this.state.ord} onChange={this.onChange}>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                    <h1 id='header'>Applications for Selected Job</h1>
                    <table id='applications' className="default-browser">
                        <tbody>
                            <tr>
                                <td>NAME</td>
                                <td>RATING</td>
                                <td>SKILLS</td>
                                <td>SOP</td>
                                <td>DATE OF APPLICATION</td>
                                <td>STATUS</td>
                            </tr>
                            {this.renderTableData2()}
                        </tbody>
                    </table>
                </div>
            )
        }
    }

}

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});
export default connect(
    mapStateToProps,
    { showApplicant, changeApplicant,logoutUser }
)(showActiveJob);