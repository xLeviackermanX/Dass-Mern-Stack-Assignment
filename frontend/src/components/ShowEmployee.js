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
            applicants: [],
            flag: -1,
            user: { email: "" },
            // col: ["red", "white", "yellow", "green"],
            arg: "name",
            ord: "asc",
            errors: {}
        };
        this.inc = this.inc.bind(this);
        this.dec = this.dec.bind(this);
        this.back = this.back.bind(this);
    }

    back = e => {
        this.props.history.push("/dashboard/showEmployee");
        this.setState({ flag: -1 });
    }

    inc = e => {
        e.preventDefault();
        var i = 0;
        var ind = 0;
        while (this.state.applicants[i] && this.state.applicants[i].email !== e.target.id) {
            i += 1;
        }
        while (this.state.jobs[ind] && this.state.applicants[i]._id !== this.state.jobs[ind]._id) {
            ind += 1;
        }
        var index = 0;
        while (this.state.jobs[ind].Applicant[index] && this.state.jobs[ind].Applicant[index].email !== e.target.id) {
            index += 1;
        }
        if (this.state.applicants[i].rating < 5) {
            this.state.applicants[i].rating += 1;
            this.state.applicants[i].realRating += 1;
            this.state.jobs[ind].Applicant[index].rating += 1;
            this.state.jobs[ind].Applicant[index].realRating+=1
            axios.post('/api/jobs/changeApplicant', this.state.jobs[ind])
                .then(response => {
                    return null;
                });

            axios.post('/api/applicants/incRating', this.state.applicants[i])
                .then(response => {
                    return null;
                });
        }

        this.setState({ flag: -1 });
    }

    dec = e => {
        e.preventDefault();
        var i = 0;
        var ind = 0;
        while (this.state.applicants[i] && this.state.applicants[i].email !== e.target.id) {
            i += 1;
        }
        while (this.state.jobs[ind] && this.state.applicants[i]._id !== this.state.jobs[ind]._id) {
            ind += 1;
        }
        var index = 0;
        while (this.state.jobs[ind].Applicant[index] && this.state.jobs[ind].Applicant[index].email !== e.target.id) {
            index += 1;
        }
        if (this.state.applicants[i].rating > 0) {
            this.state.applicants[i].rating -= 1;
            this.state.applicants[i].realRating -= 1;
            this.state.jobs[ind].Applicant[index].rating -= 1;
            this.state.jobs[ind].Applicant[index].realRating -= 1;
            axios.post('/api/jobs/changeApplicant', this.state.jobs[ind])
                .then(response => {
                    return null;
                });

            axios.post('/api/applicants/decRating', this.state.applicants[i])
                .then(response => {
                    return null;
                });
        }

        this.setState({ flag: -1 });
    }

    onClick = e => {
        e.preventDefault();
        // console.log(e.target);
        var ind = 0;
        while (this.state.activeJobs[ind] && this.state.activeJobs[ind]._id !== e.target.id) {
            ind += 1;
        }
        this.setState({ flag: ind });
    };

    onChange = e => {
        e.preventDefault();
        this.setState({ [e.target.id]: e.target.value });
        this.setState({ flag: -1 });
    }

    onSubmit = e => {
        e.preventDefault();
        console.log("Aur bhai sb bdia??");
    };

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


        axios.post('/api/jobs/activeJobs', userData)
            .then(response => {
                this.setState({ jobs: response.data });
                console.log(this.state.jobs);
                var index = 0;
                var i = 0;
                let allapp = [];
                let promises = [];
                while (this.state.jobs[index]) {


                    for (i = 0; i < this.state.jobs[index].Applicant.length; i++) {
                        promises.push(
                            axios.post('/api/applicants/findone',this.state.jobs[index].Applicant[i]).then(response => {
                                // do something with response
                                allapp.push(response.data);
                                // console.log("yeh response aya: ");
                                // console.log(response);
                            })
                        )
                    }
                    index++;
                }
                Promise.all(promises).then(() => {
                    i = 0;
                    var indexi = 0;
                    // console.log(this.state.jobs);
                    // console.log("hello");
                    // console.log(this.state.jobs[0].Applicant);
                    while (this.state.jobs[indexi]) {
                        i=0;
                        while (this.state.jobs[indexi].Applicant[i]) {
                            if (this.state.jobs[indexi].Applicant[i].statusNum === 3) {
                                var j=0;
                                while(allapp[j] && allapp[j]._id!==this.state.jobs[indexi].Applicant[i].id)
                                {
                                    j+=1;
                                }
                                var employee = {
                                    _id: this.state.jobs[indexi]._id,
                                    id: this.state.jobs[indexi].Applicant[i].id,
                                    email: this.state.jobs[indexi].Applicant[i].email,
                                    name: this.state.jobs[indexi].Applicant[i].name,
                                    date: this.state.jobs[indexi].Applicant[i].joinDate,
                                    title: this.state.jobs[indexi].title,
                                    type: this.state.jobs[indexi].type,
                                    rating: this.state.jobs[indexi].Applicant[i].rating,
                                    realRating: allapp[j].rating,
                                    count: allapp[j].count
                                }
                                console.log(i);
                                console.log(employee);
                                this.state.applicants.push(employee);
                                
                            }
                            i += 1;
                        }
                        indexi += 1;
                    }

                    this.setState({ flag: -1 });
                });

            })
            .catch(function (error) {
                console.log(error);
                console.log("errorrrr");
            })
    }



    renderTableData2() {
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
        else if (arg === "rating") {
            this.state.applicants.sort((a, b) => {
                return (a.realRating * b.count) - (b.realRating * a.count);
            })
        }
        else {
            this.state.applicants.sort((a, b) => {
                return ('' + a.title).localeCompare(b.title);
            })
        }
        if (this.state.ord === "asc");
        else {
            this.state.applicants.reverse();
        }
        // const arr = [{_id:"1",title:"yo1",position:"5",remainingPosition:"5",maxApplicant:"5",remainingApplicant:"5"},{_id:"2",title:"yo2",position:"5",remainingPosition:"5",maxApplicant:"5",remainingApplicant:"5"}];
        // console.log(this.state.activeJobs[0]);
        // console.log(this.state.activeJobs[this.state.flag] +"yyyyyyyyyyyyyyyyyyyyyyyy"+this.state.flag);
        return this.state.applicants.map((applicant, ind) => {
            const { email, name, realRating, count, rating, title, date, type } = applicant //destructuring
            return (
                <tr key={email}>
                    <td>{name}</td>
                    <td>{rating}</td>
                    <td>{parseFloat(realRating) / count}</td>
                    <td>{title}</td>
                    <td><Moment format="DD-MM-YYYY">{date}</Moment></td>
                    <td>{type}</td>
                    <td><button style={{ backgroundColor: "green" }} id={email} onClick={this.inc}>Increase Rating</button></td>
                    <td><button style={{ backgroundColor: "red" }} id={email} onClick={this.dec}>Decrease Rating</button></td>
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
                    <button onClick={this.back}>/Your Employees</button>
                </div>
                <div>
                    <select id="arg" className="browser-default" value={this.state.arg} onChange={this.onChange}>
                        <option value="name">Name</option>
                        <option value="date">Date of Joing</option>
                        <option value="rating">Actual Rating</option>
                        <option value="title">Job Title</option>

                    </select>
                    <select id="ord" className="browser-default" value={this.state.ord} onChange={this.onChange}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
                <h1 id='header'>YOUR EMPLOYEES</h1>
                <table id='applications' className="default-browser">
                    <tbody>
                        <tr>
                            <td>NAME</td>
                            <td>RATING BY YOU</td>
                            <td>ACTUAL RATING</td>
                            <td>JOB TITLE</td>
                            <td>DATE OF JOINING</td>
                            <td>TYPE OF JOB</td>
                        </tr>
                        {this.renderTableData2()}
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
    { showApplicant, changeApplicant ,logoutUser}
)(showActiveJob);