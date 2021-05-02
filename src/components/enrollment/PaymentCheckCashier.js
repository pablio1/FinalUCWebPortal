import React, { Component, Fragment } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import store from 'store2';

import StudentsList from '../../components/enrollment/StudentsList';
import EnrollmentTabs from '../../components/elements/EnrollmentTabs';
import SearchStudentPanel from '../../components/elements/SearchStudentPanel';
import ApprovalPanel from '../../components/elements/ApprovalPanel';
import StudentInfoWithPayment from '../../components/enrollment/StudentInfoWithPayment';
import { getLoggedUserDetails, formatMoney } from '../../helpers/helper';
import { getStudentList, updateStudentStatus, getCourses, getStatusCount, sendNotification } from '../../helpers/apiCalls';
import SpinnerGif from '../../assets/sysimg/spinner.gif'

class PaymentCheckCashier extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            enrollStatus: 8, totalPending: 0, page: 1, limit: 20, totalApproved: 0, totalDisapproved: 0,
            studentInfo: null, studentList: null, studentGrades: null, attachments: [],
            name: '', course: '', date: '', id_number: '', course_department: '',  
            allowed_units: 0, year_level: '', classification: '', totalRecords: 0, section: '', stud_id: '',
            approvalStatus: null, courses: null, needed_payment: 0,
            selectedStudentID: '', selectedStudentClassification: '', selectedTab: "pending",
            showPreloader: false, pending_promissory: 0, promi_pay: 0,
            showSendNotifForm: false, notificationMsg: '', isLoadingStudentList: false
        };
    }
    componentDidMount = () => {
        const { cookies } = this.props;
        getCourses({ department_abbr: "", active_term: cookies.get("selterm") })
        .then(response => {
            this.setState({ 
                courses: response.data.colleges.length > 0 ? response.data.colleges : null
            }, () => this.getFilteredStudentList());
        });
    }
    handleOnClickTab = (tab, value) => {
        this.setState({
            enrollStatus: value,
            selectedStudentID: '',
            selectedTab: tab
        }, () =>  this.getFilteredStudentList() );        
    }
    handleOnchangeInput = (key, value) => {
        this.setState({
            [key] : value    
        }, () => {
            if(key === "course") this.getFilteredStudentList();  
        });
    }
    handleOnSearchEvent = () => {
        this.getFilteredStudentList();  
    }
    handleClickUser = (idNum, classification, courseCode) => {
        this.setState({
            selectedStudentID: idNum,
            selectedStudentClassification: classification 
        }, () => this.getStudentInfo() );
    }
    handleApprovalButton = e => {
        const { cookies } = this.props;
        this.setState({
            approvalStatus: e,
            showPreloader: true
        }, () => {
            const approveStatuses = { pending: 8, approved: 9, disapproved: 2 };    
            const data = {
                status: approveStatuses[this.state.approvalStatus],
                name_of_approver: getLoggedUserDetails("fullname"),
                //year_level: this.state.year_level,
                classification: this.state.classification,
                allowed_units: this.state.allowed_units,
                //course_code: "string",
                //section: "string",
                //needed_payment: 0,
                active_term: cookies.get("selterm")           
            };
            updateStudentStatus(this.state.selectedStudentID, data)
            .then(response => {            
                if(response.data.success) {
                    alert("Student payment approved!")
                    this.setState({
                        selectedStudentID: "",
                        showPreloader: false
                    }, () => this.getFilteredStudentList() ); 
                }
            });
        });  
    }
    getFilteredStudentList = () => { 
        const { cookies } = this.props;
        let data = {
            status: this.state.enrollStatus,  
            page: this.state.page,
            limit: this.state.limit,
            name: this.state.name,
            course: this.state.course,
            course_department: this.state.course_department,
            date: this.state.date,
            id_number: this.state.id_number,
            is_cashier: this.state.enrollStatus === 8 ? 1 : "",
            //year_level: this.state.year_level,
            //classification: this.state.searchFilterClassification,
            active_term: cookies.get("selterm")
        };
        this.setState({
            isLoadingStudentList: true
        }, () => {
            getStudentList(data)
            .then(response => {
                if(response.data && response.data.count > 0) {
                    const retStudent = response.data.students;
                    this.setState({
                        studentList: retStudent.filter(student => student.has_payment === 1),
                        totalRecords: response.data.count,
                        isLoadingStudentList: false
                    }, () => {
                        getStatusCount(this.state.course_department, cookies.get("selterm"))
                        .then(response => {            
                            this.setState({
                                totalPending: response.data.approved_by_accounting,
                                totalApproved: response.data.officially_enrolled,
                            });
                        });
                    });
                }
                else {
                    this.setState({
                        studentList: null,
                        totalRecords: 0,
                        isLoadingStudentList: false
                    }, () => {
                        getStatusCount(this.state.course_department, cookies.get("selterm"))
                        .then(response => {            
                            this.setState({
                                totalPending: response.data.approved_by_accounting,
                                totalApproved: response.data.officially_enrolled,
                            });
                        });
                    });
                }            
            });
        })
    }
    getStudentInfo = () => { 
        const { cookies } = this.props;
        const headers = { 
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + store.get("token")
        }; 

        const apiResource = ["OLD STUDENT", "RETURNEE", "SHIFTEE"].includes(this.state.selectedStudentClassification) ? process.env.REACT_APP_API_UC_OLD_STUDENT_INFO : process.env.REACT_APP_API_UC_GET_STUDENT_INFO;
        const apiRequest1 = axios.post(apiResource, { id_number: this.state.selectedStudentID, payment: 0, active_term: cookies.get("selterm") }, {headers});
        const apiRequest2 = axios.post(apiResource, { id_number: this.state.selectedStudentID, payment: 1, active_term: cookies.get("selterm") }, {headers});
        const apiRequest3 = axios.post(process.env.REACT_APP_API_UC_CHECK_ENROLLMENT_STATUS, { id_number: this.state.selectedStudentID, active_term: cookies.get("selterm") }, {headers});
        Promise.all([apiRequest1, apiRequest2, apiRequest3]).then(values =>  {
            this.setState({
                studentInfo: values[0].data,
                allowed_units: values[0].data.allowed_units, 
                year_level: values[0].data.year_level, 
                classification: values[0].data.classification,
                stud_id: values[0].data.stud_id,
                attachments:  values[1].data.attachments,
                needed_payment: values[2].data.needed_payment,
                pending_promissory: values[2].data.pending_promissory,
                promi_pay: values[2].data.promi_pay
            });
        }).catch(error => {
            console.log(error);
        });    
    }
    handleOnChangePage = e => {
        this.setState({
            page: e
        }, () => this.getFilteredStudentList());
    }
    handleChangeRowsPerPage = e => {
        this.setState({
            limit: e
        }, () => this.getFilteredStudentList());
    }
    handleOnClickNotificationBtn = e => {
        if(e === "openNotifForm") {
            const { showSendNotifForm } = this.state;
            this.setState({
                showSendNotifForm: !showSendNotifForm,
                notificationMsg: ''
            })
        }
        if(e === "sendNotification") {
            const data = {
                stud_id: this.state.selectedStudentID,
                from_sender: getLoggedUserDetails("fullname") + " [CASHIER]",
                message: this.state.notificationMsg
            }
            sendNotification(data)
            .then(response => {
                if(response.data.success) {
                    alert("Notification successfully sent!");
                    this.setState({
                        showSendNotifForm: false,
                        notificationMsg: ''
                    })
                }
            });
        }
    }
    handleOnChangeNotifMsg = e => {
        this.setState({
            notificationMsg: e.target.value
        });
    }
    render() {
        if (getLoggedUserDetails("usertype") !== "CASHIER") {
            return <Redirect to="/login" />;
        }
        const { 
            studentList, page, limit, name, course, date, id_number, selectedTab, showSendNotifForm,
            totalPending, totalApproved, totalDisapproved, attachments, totalRecords, courses, notificationMsg,
            studentInfo, selectedStudentID, showPreloader, needed_payment, pending_promissory, promi_pay, isLoadingStudentList
        } = this.state;
        const searcheables = { name, course, date, id_number };
        const approver = getLoggedUserDetails("usertype");
        const promissoryMsg = pending_promissory === 0 && parseInt(promi_pay, 10) > 0 ? (
            <span className="has-text-danger-dark has-text-weight-medium">Promissory Note Approved! Need to pay only {formatMoney(promi_pay)} for the Enrollment.</span>
        ) : "";
        const loadSendNotifForm = (
            <Fragment>
                <textarea className="textarea" rows="3" maxLength="500" placeholder="Enter Message. Minimum 20 characters." name="notificationMsg" 
                          value={notificationMsg} onChange={this.handleOnChangeNotifMsg}></textarea>
                <nav className="level">
                    <div className="level-left mb-0 pb-0"></div>
                    <div className="level-right mt-1 pt-0">
                        <div className="buttons">
                            <button className="button is-small is-danger mt-1 has-text-weight-semibold" name="disapproveBtn"
                                    onClick={() => this.handleOnClickNotificationBtn("openNotifForm")} disabled={false} >
                                <span className="icon is-small">
                                    <i className="fas fa-ban"></i>
                                </span>
                                <span>Cancel</span>                                
                            </button>  
                            <button className="button is-small is-primary mt-1 has-text-weight-semibold" name="disapproveBtn"
                                    onClick={() => this.handleOnClickNotificationBtn("sendNotification")} disabled={notificationMsg.length > 20 ? false : true } >
                                <span className="icon is-small">
                                    <i className="fas fa-paper-plane"></i>
                                </span>
                                <span>Send</span>                                
                            </button>        
                        </div>
                    </div>  
                </nav>
            </Fragment>
        );
        let loadStudentInfo = (
            <Fragment>
                <button className="button is-small is-link mt-0 mb-2" onClick={() => this.handleOnClickNotificationBtn("openNotifForm")} disabled={showSendNotifForm}>
                    <span>Send Notification</span>
                </button> 
                {showSendNotifForm ? loadSendNotifForm : ""}
                <StudentInfoWithPayment 
                    studentInfo={studentInfo} 
                    attachments={attachments}
                    viewer={approver}
                    neededPayment={needed_payment}
                    selectedTab={selectedTab}
                    module="PaymentCheckCashier"
                    handleOnchangeInput={this.handleOnchangeInput}  
                />
            </Fragment>
        );

        return (
                <div className="box ml-1">
                    <EnrollmentTabs 
                        pending={8}
                        approved={10}
                        disapproved={9}
                        totalPending={totalPending}
                        totalApproved={totalApproved} 
                        totalDisapproved={totalDisapproved}
                        handleOnClickTab={this.handleOnClickTab}
                        viewer={approver}
                    />
                    <div className="">
                        <div className="divider is-size-6 mt-0 pt-0"></div>
                    </div>
                    <div className="columns">
                        <div className="column is-5 mt-0 mb-0 pt-0 pb-0">
                            <SearchStudentPanel
                                searcheables={searcheables}
                                handleOnchangeInput={this.handleOnchangeInput}
                                handleOnSearchEvent={this.handleOnSearchEvent}
                                searcher={approver}
                                courses={courses ? courses : null}
                            />   
                        </div>
                        <div className="column mt-0 mb-0 pt-0 pb-0">
                            {
                                selectedStudentID ? (
                                    <ApprovalPanel
                                        studentID={selectedStudentID}
                                        approver={approver}
                                        sections={"disable"}
                                        currentTab={selectedTab}
                                        title={promissoryMsg}
                                        sectionValue={""}
                                        courseDepartment = {""}
                                        step="Cashier"
                                        disapproveMsg={""}
                                        handleApprovalButton={this.handleApprovalButton}
                                        handleOnchangeInput={this.handleOnchangeInput}   
                                        disableApproveBtn={false}
                                    />
                                ) : ""
                            }
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-5 mt-0 mb-0 pt-0 pb-0">
                            { 
                                isLoadingStudentList ? (
                                    <div className="columns is-vcentered">
                                        <div className="column is-center">
                                            <figure className="image is-128x128">
                                                <img src={SpinnerGif} alt="" />
                                            </figure>
                                        </div>
                                    </div> 
                                ) : ""
                            }                     
                            {studentList ? (
                                <StudentsList
                                    studentList={studentList}
                                    selectedStudentID={selectedStudentID}
                                    totalRowsCount={totalRecords}
                                    rowsPerPage={limit}
                                    pageNum={page}
                                    step=""
                                    isLoading={isLoadingStudentList}
                                    handleOnchangeInput={this.handleOnchangeInput}
                                    handleClickUser={this.handleClickUser}
                                    handleOnChangePage={this.handleOnChangePage}
                                    handleChangeRowsPerPage={this.handleChangeRowsPerPage}
                                />  
                                ) : ""
                            }
                        </div>
                        {
                            showPreloader ? (
                                <div className="column is-center">
                                    <figure className="image is-128x128">
                                        <img src={SpinnerGif} alt="" />
                                    </figure>
                                </div>
                            ) : (
                                <div className="column mt-0 mb-0 pt-0 pb-0">
                                    {studentInfo && selectedStudentID ? loadStudentInfo : ""}                            
                                </div>
                            )
                        }
                    </div> 
                </div>       
        );
    }
}

export default withCookies(PaymentCheckCashier)