import React, { Component } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import axios from 'axios';
import store from 'store2';
import moment from 'moment';

import SpinnerGif from '../../assets/sysimg/spinner.gif'
import { getLoggedUserDetails, formatMoney } from '../../helpers/helper';



class ReportEnrollPromissory extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    state = {
        selectedTab: "pending", studentsPending: null, studentsApproved: null, 
    }
    componentDidMount = () => {
         this.getStudentList();
    } 
    handleOnClickTab = e => {
        this.setState({
            selectedTab: e,
        });
    }
    getStudentList = () => {
        const { cookies } = this.props;
        const data1 = {
            course_department: "", status: 1, limit: 0, page: 1, active_term: cookies.get("selterm")   
        };
        const data2 = {
            course_department: "", status: 2, limit: 0, page: 1, active_term: cookies.get("selterm")   
        };
        const data3 = {
            course_department: "", status: 3, limit: 0, page: 1, active_term: cookies.get("selterm")   
        };
        const headers = { 
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + store.get("token")
        };
        const apiRequest1 = axios.post(process.env.REACT_APP_API_UC_VIEW_PROMISSORY, data1, {headers});
        const apiRequest2 = axios.post(process.env.REACT_APP_API_UC_VIEW_PROMISSORY, data2, {headers});
        const apiRequest3 = axios.post(process.env.REACT_APP_API_UC_VIEW_PROMISSORY, data3, {headers});
        Promise.all([apiRequest1, apiRequest2, apiRequest3]).then(values =>  {
            const allStudentsPending = [...values[0].data.students, ...values[1].data.students];
            const allStudentsApproved = values[2].data.students;
            this.setState({
                studentsPending: allStudentsPending && allStudentsPending.length > 0 ? allStudentsPending : null, 
                studentsApproved:  allStudentsApproved && allStudentsApproved.length > 0 ? allStudentsApproved : null,
            });  
        }).catch(error => {
            console.log(error);
        }); 
    }
    render() {
        const today = moment().format("DD-MM-YYYY")
        const { selectedTab, studentsPending, studentsApproved } = this.state;
        const loadStudentsPending = studentsPending ? studentsPending.map((student, index) => {
            return (
                <tr key={index}>
                    <td>{student.id_number}</td>
                    <td>{student.lastname}</td>
                    <td>{student.firstname}</td>
                    <td>{student.mi}</td>
                    <td>{student.course_year}</td>
                    <td>{formatMoney(student.needed_payment)}</td>
                    <td>{formatMoney(student.promise_pay)}</td>
                    <td>{student.message}</td>
                </tr>
            )
        }) : "";
        const loadStudentsApproved = studentsApproved ? studentsApproved.map((student, index) => {
            return (
                <tr key={index}>
                    <td>{student.id_number}</td>
                    <td>{student.lastname}</td>
                    <td>{student.firstname}</td>
                    <td>{student.mi}</td>
                    <td>{student.course_year}</td>
                    <td>{formatMoney(student.needed_payment)}</td>
                    <td>{formatMoney(student.promise_pay)}</td>
                    <td>{student.message}</td>
                </tr>
            )
        }) : "";
        let showLoadedStudents = (
            <tr>
                <td>TBA</td>
                <td>TBA</td>
                <td>TBA</td>
                <td>TBA</td>
                <td>TBA</td>
                <td>TBA</td>
                <td>TBA</td>
                <td>TBA</td>
            </tr>  
        );
        if(selectedTab === "pending" && loadStudentsPending) showLoadedStudents = loadStudentsPending;
        if(selectedTab === "approved" && loadStudentsApproved) showLoadedStudents = loadStudentsApproved;
        return (
            <div className="box ml-1" style={{ borderTop: "1px solid", borderColor: "#E5E8E8" }}>
                <div className="buttons has-addons is-centered">                
                    <button name="pending" className={"button " + (selectedTab === "pending" ? "is-info is-selected" : "")} 
                            onClick={() => this.handleOnClickTab("pending")}>
                        <span>Pending</span>
                    </button>   
                    <button name="approved" className={"button " + (selectedTab === "approved" ? "is-info is-selected" : "")} 
                            onClick={() => this.handleOnClickTab("approved")}>
                        <span>Approved</span>
                    </button>                      
                </div>  
                <div className="">
                    <div className="divider is-size-6 mt-0 mb-2 pt-0"></div>
                </div>
                <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="button is-info is-small mb-3"
                    table="enrollPromissory"
                    filename={"Promissory_" + selectedTab + "_" + today} 
                    sheet="Enrollment"
                    buttonText="Export to Excel"
                />
                {
                    studentsPending && studentsApproved ? (
                        <div className="table-container">
                            <table id="enrollPromissory" className="table is-striped is-fullwidth is-size-7">
                                <thead>
                                    <tr>
                                        <th colSpan="8" className="is-size-6 has-text-centered">{selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1) + " Promissory Requests"}</th>
                                    </tr>
                                    <tr>
                                        <th>ID Number</th>
                                        <th>Last Name</th>
                                        <th>First Name</th>
                                        <th>M.I.</th>
                                        <th>Course</th>
                                        <th>Enrollment Due</th>
                                        <th>Promissory Amount</th>
                                        <th>Message</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {showLoadedStudents}                                                                                                                          
                                </tbody>
                            </table>    
                        </div> 
                    ) : (
                        <div className="column is-center">
                            <figure className="image is-128x128">
                                <img src={SpinnerGif} alt="" />
                            </figure>
                        </div>
                    )
                }    
            </div>       
        );
    }
}

export default withCookies(ReportEnrollPromissory)
