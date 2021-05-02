import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

import { getLoggedUserDetails, formatMoney } from '../../helpers/helper';
import { 
    getPaymentStudentList, getCourses, getStatusCount, getOldStudentInfo, getStudentInfo, getColleges, 
    acknowledgePaymentReceipt, getStudentPayments, getStudentAssessment, sendNotification 
} from '../../helpers/apiCalls';

import SearchStudentPanelFull from '../../components/elements/SearchStudentPanelFull';
import StudentInfoWithPayment from '../../components/enrollment/StudentInfoWithPayment';
import StudentsList from '../../components/enrollment/StudentsList';
import SpinnerGif from '../../assets/sysimg/spinner.gif';
import ApprovalPanel from '../../components/elements/ApprovalPanel';

class Payment extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    state = {
        studentList: null, courseDepartment: '', department: '', viewStatus: 0, exam: '', 
        colleges: null, courses: null, totalPending: 0, totalApproved: 0, totalRecords: 0, rowsPerPage: 20, pageNum: 1,
        selectedStudentID: '', selectedStudentClassification: '', studentAssessment: null,
        searchFilterCollege: '', searchFilterCourse: '', searchFilterClassification: '', searchFilterYear: '0', searchIDNumber: '', searchName: '', searchDate: '',
        selectedTab: "pending", userType: '', showPreloader: false, amountCanPay: 0, textMsgMaxChar: 500, textMsg: '',
        studentPayments: null, showSendNotifForm: false, notificationMsg: '', promissoryData: null, isLoadingStudentList: false
    }
    componentDidMount = () => {  
        const { cookies } = this.props;     
        this.setState({
            exam: getLoggedUserDetails("currentexam"),
            userType: getLoggedUserDetails("usertype"),
        }, () => {            
            getColleges(cookies.get("selterm"))
            .then(response => {
                this.setState({ 
                    colleges: response.data.departments 
                }, () => this.getFilteredStatusCount(""));      
            });
        });
    }
    getFilteredStatusCount = e => {
        const { cookies } = this.props; 
        getStatusCount(e, cookies.get("selterm"))
        .then(response => {             
            this.setState({
                totalApproved: response.data.ack_receipts,
                totalPending: response.data.notaack_receipts                        
            }, () => this.getFilteredStudentList());
        });
    }
    handleOnClickTab = e => {
        const statuses = { pending: 0, approved: 1 };        
        this.setState({
            selectedTab: e,
            viewStatus: statuses[e],
            courses: null,
            studentList: null,
            selectedStudentID: '',
            searchFilterCourse: '', 
            searchFilterClassification: '', 
            searchFilterYear: '0', 
            searchIDNumber: '', 
            searchName: '', 
            searchDate: '',
            pageNum: 1,
            totalRecords: 0, 
            rowsPerPage: 20,
            amountCanPay: '', 
            textMsgMaxChar: 500, 
            textMsg: ''
        }, () => this.getFilteredStudentList());
    }
    handleOnchangeInput = (key, value) => {
        const { cookies } = this.props; 
        if(key === "searchFilterCollege") {
            this.setState({
                searchFilterCollege: value,
                searchFilterCourse: "",
                courses: null,
                selectedStudentID: ''
            }, () => {                       
                if(value) {
                    let data = { department_abbr: this.state.searchFilterCollege, active_term: cookies.get("selterm") }                    
                    getCourses(data)
                    .then(response => {
                        this.setState({ 
                            courses: response.data.colleges.length > 0 ? response.data.colleges : null
                        });
                    });                    
                }
                else {
                    this.setState({ 
                        courses: null,
                        studentList: null,
                        selectedStudentID: ''
                    });
                }
                this.getFilteredStudentList(); 
            });
        }
        if(key === "searchFilterCourse") {
            this.setState({
                searchFilterCourse: value,
                studentList: null,
                pageNum: 1
            }, () => this.getFilteredStudentList());
        }
        else if(key === "searchFilterClassification") {
            this.setState({
                searchFilterClassification: value,
                pageNum: 1
            }, () => this.getFilteredStudentList());
        }
        else if(key === "searchFilterYear") {
            this.setState({
                searchFilterYear: value,                
                pageNum: 1
            }, () => this.getFilteredStudentList());
        }
        else if(key === "amountCanPay") {
            if(/^[0-9 _ ]*$/.test(value)) {
                this.setState({
                    amountCanPay : value    
                });
            }
        }
        else if(key === "disapproveMsg") {
            this.setState({
                textMsg: value
            }, () => {
                this.setState({
                    textMsgMaxChar : 500 - parseInt(this.state.textMsg.length, 10) ,
                })
            }); 
        }
        else {
            this.setState({
                [key]: value
            });
        }
    }
    handleOnSearchEvent = () => {
        this.getFilteredStudentList();  
    }
    handleClickUser = (idNum, classification, courseCode, promissoryData) => {
        this.setState({
            selectedStudentID: idNum,
            selectedStudentClassification: classification, 
            promissoryData: promissoryData
        }, () => this.getStudentInfoData() );
    }
    getFilteredStudentList = () => {
        const { cookies } = this.props; 
        const data = {
            course_department: this.state.searchFilterCollege,
            status: this.state.viewStatus,
            exam: this.state.exam,
            limit: 0,
            page: 1,
            active_term: cookies.get("selterm")
        }
        this.setState({
            isLoadingStudentList: true
        }, () => {
            getPaymentStudentList(data)
            .then(response => {
                if(response.data.students && response.data.students.length > 0) {
                    let studentList = response.data.students;
                    const { 
                        searchFilterCourse, searchFilterClassification, searchFilterYear, searchIDNumber, searchName, searchDate, 
                        pageNum, rowsPerPage
                    } = this.state;
                    const classifications = { H: "NEW STUDENT", O: "OLD STUDENT", T: "TRANSFEREE", C: "CROSS ENROLLEE", R: "RETURNEE", S: "SHIFTEE"  };
                    if(searchFilterCourse) studentList = studentList.filter(student => student.course_code === searchFilterCourse);
                    if(searchFilterClassification) studentList = studentList.filter(student => student.classification === classifications[searchFilterClassification]);
                    if(searchFilterYear !== "0") studentList = studentList.filter(student => student.course_year.trim().split(" ").pop() === searchFilterYear);
                    if(searchIDNumber) studentList = studentList.filter(student => student.id_number === searchIDNumber);
                    if(searchName) studentList = studentList.filter(student => student.lastname === searchName.trim().toUpperCase() || student.firstname === searchName.trim().toUpperCase());
                    if(searchDate) studentList = studentList.filter(student => student.date.substr(0, 10) === searchDate);
                    this.setState({ 
                        studentList: studentList.slice((pageNum - 1) * rowsPerPage, pageNum * rowsPerPage),
                        totalRecords: studentList.length,
                        selectedStudentID: '',
                        isLoadingStudentList: false
                    });
                }
                else {
                    this.setState({ 
                        studentList: null,
                        isLoadingStudentList: false                    
                    });
                }
            });
        })
    }
    getStudentInfoData = () => { 
        const { cookies } = this.props; 
        if(["OLD STUDENT", "RETURNEE", "SHIFTEE"].includes(this.state.selectedStudentClassification)) {        
            getOldStudentInfo(this.state.selectedStudentID, 0, cookies.get("selterm")) 
            .then(response => {
                this.setState({
                    studentInfo: response.data,
                }, () => this.getStudentPaymentsData());
            });   
        }
        else {            
            getStudentInfo(this.state.selectedStudentID, 0, cookies.get("selterm")) 
            .then(response => {            
                this.setState({
                    studentInfo: response.data,
                }, () => this.getStudentPaymentsData());
            }); 
        }
    }
    getStudentPaymentsData = () => {
        const { cookies } = this.props; 
        const data = {
            id_number: this.state.selectedStudentID,
            exam_type: this.state.exam,
            //status: this.state.viewStatus === 1 ? 2 : 0,
            status: 2,
            active_term: cookies.get("selterm")
        }
        getStudentPayments(data)
        .then(response => {    
            if(response.data && response.data.images.length > 0) {   
                let studentPaymentsFilter = response.data.images;
                if(this.state.viewStatus === 1) studentPaymentsFilter = studentPaymentsFilter.filter(payment => payment.status !== 0);
                this.setState({
                    studentPayments: studentPaymentsFilter,
                }, () => {
                    getStudentAssessment(this.state.studentInfo.dept,this.state.selectedStudentID,this.state.exam, cookies.get("selterm"))
                    .then(response => {
                        if(response.data.exams && response.data.exams.length > 0) {
                            this.setState({
                                studentAssessment: response.data.exams[0]                           
                            });
                        }                
                    });
                });
            }
        });
    }
    handleOnChangePage = e => {
        this.setState({
            pageNum: e,
        }, () => this.getFilteredStudentList());
    }
    handleChangeRowsPerPage = e => {
        this.setState({
            rowsPerPage: e,
        }, () => this.getFilteredStudentList());
    }
    togglePreloader = e => {
        this.setState({
            showPreloader: e
        })
    }
    handleApprovalButton = e => {   
        
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
    handleAcknowledgeReceipt = (filename, duplicate) => {
        const { cookies } = this.props; 
        let msg = "Are you sure you want to Acknowledge Receipt? Click Ok to proceed otherwise Cancel.";
        let duplicateRequest = 3; // Acknowledge
        if(duplicate === 1) {
            msg = "Are you sure this is a duplicate Proof of Payment? Click Ok to proceed otherwise Cancel.";
            duplicateRequest = 1; // Duplicate
        }
        if(duplicate === 2) {
            msg = "Are you sure this is NOT a duplicate Proof of Payment? Click Ok to proceed otherwise Cancel.";
            duplicateRequest = 0; // Pending
        }
        if(window.confirm(msg)) {
            acknowledgePaymentReceipt(filename, duplicateRequest, cookies.get("selterm"))
            .then(response => {
                if(response.data.success) {
                    let retMsg = "Payment successfully marked as Acknowledged or Received.";
                    if(duplicate === 1) retMsg = "Proof of Payment successfully marked as duplicate.";
                    if(duplicate === 2) retMsg = "Proof of Payment successfully unmarked as duplicate and now pending.";
                    alert(retMsg);
                    this.getStudentInfoData();
                }
            });
        }        
    }
    render() {
        if (!["CASHIER"].includes(getLoggedUserDetails("usertype") )) {
            return <Redirect to="/login" />;
        }
        const {
            selectedTab, totalPending, totalApproved, userType, colleges, courses, department, 
            studentList, totalRecords, rowsPerPage, pageNum, studentInfo, showPreloader, isLoadingStudentList,
            selectedStudentID, showSendNotifForm, notificationMsg, promissoryData,
            searchFilterCollege, searchFilterCourse, searchFilterClassification, searchFilterYear, searchIDNumber, searchName, searchDate,
            amountCanPay, textMsgMaxChar, textMsg, studentPayments, studentAssessment
        } = this.state;
        const searcheables = { searchFilterCollege, searchFilterCourse, searchFilterClassification, searchFilterYear, searchIDNumber, searchName, searchDate };
        const promissoryMsg = promissoryData && promissoryData.pending_exam_promi === 3 ? (
            <span className="has-text-danger-dark has-text-weight-medium">Promissory Note Approved! Need to pay only {formatMoney(promissoryData.approved_promi_amount)} for the Exam Due.</span>
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
        const loadUploadedPayments = studentPayments ? studentPayments.map((payment, index) => {
            let paymentStatus = "Pending";
            if(payment.status === 1) paymentStatus = "Received";
            if(payment.status === 2) paymentStatus = "Duplicate";
            return (
                <tr key={index}>                                                        
                    <th className="is-narrow">{paymentStatus}</th>   
                    <td><a href={process.env.REACT_APP_PATH_STORAGE_PAYMENTS + payment.file_name} target="_blank">{payment.file_name}</a></td>
                    <td>                        
                        {
                            payment.status === 0 ? ( 
                                <div className="buttons">
                                    <button className="button is-small is-link mt-0 mb-2" onClick={() => this.handleAcknowledgeReceipt(payment.file_name, 0)}>
                                        <span>Acknowledge Receipt</span>
                                    </button> 
                                    <button className="button is-small is-danger mt-0 mb-2" onClick={() => this.handleAcknowledgeReceipt(payment.file_name, 1)}>
                                        <span>Duplicate</span>
                                    </button>  
                                </div>   
                            ) : ""
                        } 
                        {
                            payment.status === 2 ? ( 
                                <button className="button is-small is-danger mt-0 mb-2" onClick={() => this.handleAcknowledgeReceipt(payment.file_name, 2)}>
                                    <span>Not Duplicate</span>
                                </button>     
                            ) : ""
                        }                            
                    </td>                                                     
                </tr>
            );
        }) : <tr><td></td></tr>;
        const loadStudentInfo = studentAssessment ? ( 
            <Fragment>
            <button className="button is-small is-link mt-0 mb-2" onClick={() => this.handleOnClickNotificationBtn("openNotifForm")} disabled={showSendNotifForm}>
                <span>Send Notification</span>
            </button> 
            {showSendNotifForm ? loadSendNotifForm : ""}
            <StudentInfoWithPayment 
                studentInfo={studentInfo} 
                attachments=""
                viewer={userType}
                neededPayment={studentAssessment}
                selectedTab={selectedTab}
                module="AssessmentPayment"
                handleOnchangeInput={this.handleOnchangeInput}  
            />
            <h3 className="has-text-weight-semibold is-size-5 mb-3">Uploaded Proof Payment(s)</h3>   
            <div className="columns">   
                <div className="column">   
                    <div className="table-container">
                        <table className="table is-striped is-size-6">
                            <tbody>
                                {loadUploadedPayments}                                                                                         
                            </tbody>
                        </table>    
                    </div>                                                                    
                </div>  
            </div>   
            </Fragment>
        ) : "";
        const loadApprovalPanel = (
            <ApprovalPanel
                studentID={selectedStudentID}
                approver={userType}
                sections="disable"
                sectionValue=""
                currentTab={selectedTab}
                courseDepartment = {searchFilterCollege}
                title={promissoryMsg}
                step="AssessmentPayment"
                amountCanPay={amountCanPay}
                textMsgMaxChar={textMsgMaxChar}        
                handleApprovalButton={this.handleApprovalButton}
                handleOnchangeInput={this.handleOnchangeInput}
                disapproveMsg={textMsg}
                disableApproveBtn={true} 
            />
        );
        return(
            <div className="box ml-1">
                <div className="buttons has-addons is-centered">                
                    <button name="pending" className={"button " + (selectedTab === "pending" ? "is-info is-selected" : "")} 
                            onClick={() => this.handleOnClickTab("pending")}>
                        <span className="icon is-small">
                            <i className="fas fa-envelope-open-text"></i>
                        </span>
                        <span>Pending <span className="tag is-danger">{totalPending}</span></span>
                    </button>
                    <button name="approved" className={"button " + (selectedTab === "approved" ? "is-info is-selected" : "")}
                            onClick={() => this.handleOnClickTab("approved")}>
                        <span className="icon is-small">
                            <i className="fas fa-check-circle"></i>
                        </span>
                        <span>Received <span className="tag is-link">{totalApproved}</span></span>
                    </button>
                </div>   
                <div className="">
                    <div className="divider is-size-6 mt-0 pt-0"></div>
                </div>
                <div className="columns">
                    <div className="column mt-1 mb-1">
                        <SearchStudentPanelFull
                            searcheables={searcheables}
                            searcher={userType}
                            colleges={colleges}
                            courses={courses}
                            educLevel={department}
                            module="promissoryExam"
                            handleOnSearchEvent={this.handleOnSearchEvent}
                            handleOnchangeInput={this.handleOnchangeInput}
                        />  
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
                                rowsPerPage={rowsPerPage}
                                pageNum={pageNum}
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
                    <div className="column mt-0 mb-0 pt-0 pb-0">
                        {
                            showPreloader ? (
                                <div className="column is-center">
                                    <figure className="image is-64x64">
                                        <img src={SpinnerGif} alt="" />
                                    </figure>
                                </div>
                            ) : (
                                <div className="column mt-0 mb-0 pt-0 pb-0">
                                    {studentInfo && selectedStudentID ? loadApprovalPanel : ""}                            
                                </div>
                            )
                        }
                        {studentInfo && selectedStudentID ? loadStudentInfo : ""}
                        
                    </div>
                </div>
            </div>
        );
    }
}

export default withCookies(Payment);

export class PaymentHeader extends Component {
    render() {
        return(
            <div className="title is-4 ml-1">
                <i className="fas fa-edit"></i> Assessment / Payment
            </div> 
        )
    }
    
}