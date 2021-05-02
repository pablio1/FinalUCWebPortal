import React, { Component } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

import StudentsList from '../enrollment/StudentsList';
import EnrollmentTabs from '../elements/EnrollmentTabs';
import SearchStudentPanel from '../elements/SearchStudentPanel';
import ApprovalPanel from '../elements/ApprovalPanel';
import StudentInfoWithPromissory from '../enrollment/StudentInfoWithPromissory';
import SpinnerGif from '../../assets/sysimg/spinner.gif'
import { getLoggedUserDetails } from '../../helpers/helper';
import { getOldStudentInfo, getStudentInfo, getCourses, studentListPromissory, approvePromissory, getStatusCount } from '../../helpers/apiCalls';

class DeanPromissory extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            totalPending: 0, page: 1, limit: 20, totalApproved: 0, totalDisapproved: 0,
            studentInfo: null, studentList: null, studentGrades: null, 
            name: '', course: '', course_department: '', date: '', id_number: '', session: '', 
            allowed_units: 0, year_level: '', classification: '', totalRecords: 0, section: '', stud_id: '',
            disapproveMsg: '', courses: null,  filterYearLevel: 0,
            selectedStudentID: '', selectedStudentCourseCode: '', selectedStudentClassification: '', selectedTab: 'pending',
            showPreloader: false, isLoadingStudentList: false,
            viewStatus: 1, totalRowsCount: 0, promissoryData: null, amountCanPay: '', textMsgMaxChar: 500
        };
    }
    componentDidMount = () => {
        const { cookies } = this.props;
        let viewStatus = 1;
        if(getLoggedUserDetails("usertype") === "DEAN") viewStatus = 1;
        if(getLoggedUserDetails("usertype") === "ACAD") viewStatus = 2;
        this.setState({
            course_department: getLoggedUserDetails("courseabbr"),
            viewStatus: viewStatus      
        }, () => {
            const data = getLoggedUserDetails("usertype") === "ACAD" ? { department: "CL", active_term: cookies.get("selterm") } : { department_abbr: this.state.course_department, active_term: cookies.get("selterm") };
            getCourses(data)
            .then(response => {
                this.setState({ 
                    courses: response.data.colleges.length > 0 ? response.data.colleges : null
                }, () => {
                    getStatusCount(getLoggedUserDetails("usertype") === "ACAD" ? "" : this.state.course_department, cookies.get("selterm"))
                    .then(response => {            
                        this.setState({
                            totalPending: response.data.pending_promissory,
                            totalApproved: response.data.approved_promissory                        
                        }, () => this.getFilteredStudentList());
                    });
                });
            });
        });
    }
    handleOnClickTab = (tab, value) => {
        this.setState({
            viewStatus: value,
            selectedStudentID: '',
            selectedTab: tab
        }, () =>  this.getFilteredStudentList() );              
    }
    handleOnchangeInput = (key, value) => {
        if(key === "amountCanPay") {
            if(/^[0-9 _ ]*$/.test(value)) {
                this.setState({
                    amountCanPay : value    
                });
            }
        }
        else if(key === "disapproveMsg") {
            this.setState({
                disapproveMsg: value
            }, () => {
                this.setState({
                    textMsgMaxChar : 500 - parseInt(this.state.disapproveMsg.length, 10) ,
                })
            }); 
        }
        else {
            this.setState({
                [key] : value    
            }, () => {
                if(key === "course" || key === "filterYearLevel") this.getFilteredStudentList();  
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
            selectedStudentCourseCode: courseCode,
            promissoryData: promissoryData
        }, () => this.getStudentInfoData() );
    }
    handleApprovalButton = e => {   
        const { cookies } = this.props;
        this.togglePreloader(true); 
        if(e === "approved") {
            let proceed = true;
            if(this.state.amountCanPay === 0) {
                const msg = "Are you sure you dont want to enter an override amount? Click Ok to proceed, Cancel to enter amount.";
                if(window.confirm(msg)) proceed = true;
                else proceed = false;
            }
            if(proceed) {
                const { selectedStudentID, studentInfo, promissoryData } = this.state
                const fullname = studentInfo.last_name + ", " + studentInfo.first_name + (studentInfo.middle_name ? " " + studentInfo.middle_name + ". " : "") + (studentInfo.suffix ? " " + studentInfo.suffix + ". " : ""); 
                const confirmMsg = "Are you sure you want to approve promisory application of " + fullname + "(ID # " + selectedStudentID + ") ? Click Ok to proceed, otherwise Cancel";
                if(window.confirm(confirmMsg)) {
                    const data = {
                        id_number: selectedStudentID, 
                        approved_promissory: 3,
                        promise_pay: this.state.amountCanPay ? this.state.amountCanPay : promissoryData.promise_pay, 
                        message: this.state.disapproveMsg,
                        active_term: cookies.get("selterm")
                    }                
                    approvePromissory(data)
                    .then(response => {            
                        if(response.data.success) {
                            alert("Student Successfully Approved!");
                            this.setState({
                                selectedStudentID: "",
                                showPreloader: false,
                                disapproveMsg: '',
                                promissoryData: null,
                                amountCanPay: ''
                            }, () => {
                                getStatusCount(getLoggedUserDetails("usertype") === "ACAD" ? "" : this.state.course_department, cookies.get("selterm"))
                                .then(response => {            
                                    this.setState({
                                        totalPending: response.data.pending_promissory,
                                        totalApproved: response.data.approved_promissory                        
                                    }, () => this.getFilteredStudentList());
                                });
                            }); 
                        }
                        else {
                            alert("Approval Failed. Please try again, if issues persist please contact EDP Office."); 
                            this.togglePreloader(false);
                        }
                    })                    
                }
                else this.togglePreloader(false);
            }
        }
        else if(e === "disapproved") {
            
        }
    }
    getFilteredStudentList = () => { 
        const { cookies } = this.props;
        const data = {
            course_department: getLoggedUserDetails("usertype") === "ACAD" ?  "" : this.state.course_department,
            status: this.state.viewStatus,
            limit: 0,
            page: 1,
            active_term: cookies.get("selterm")
        };
        this.setState({
            isLoadingStudentList: true
        }, () => {
            studentListPromissory(data)
            .then(response => {
                if(response.data && response.data.students) {    
                    if(response.data.students.length > 0 ) { 
                        const { name, course, id_number, filterYearLevel, page, limit } = this.state;          
                        let studentList = response.data.students;
                        if(name === "" && course === "" && id_number === "" && filterYearLevel === "0") { /* Show All */ }
                        else {
                            studentList = course ? studentList.filter(student => student.course_code === course) : studentList;
                            studentList = filterYearLevel ? studentList.filter(student => student.course_year.split(" ")[1] === filterYearLevel) : studentList;
                            studentList = id_number ? studentList.filter(student => student.id_number === id_number) : studentList;
                            studentList = name ? studentList.filter(student => name.toUpperCase() === student.lastname || name.toUpperCase() === student.firstname) : studentList;
                        }
                        this.setState({
                            studentList: studentList.slice((page - 1) * limit, page * limit),
                            totalRecords: studentList.length,
                            selectedStudentID: '',
                            isLoadingStudentList: false
                        });
                    }
                    else {
                        this.setState({
                            studentList: null,
                            totalRecords: 0,
                            selectedStudentID: '',
                            isLoadingStudentList: false
                        });
                    }
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
                    allowed_units: response.data.allowed_units, 
                    year_level: response.data.year_level, 
                    classification: response.data.classification,
                    stud_id: response.data.stud_id,
                    session: response.data.mdn ? response.data.mdn : ""
                });
            });   
        }
        else {            
            getStudentInfo(this.state.selectedStudentID, 0, cookies.get("selterm")) 
            .then(response => {            
                this.setState({
                    studentInfo: response.data,
                    allowed_units: response.data.allowed_units, 
                    year_level: response.data.year_level, 
                    classification: response.data.classification,
                    stud_id: response.data.stud_id,
                    session: response.data.mdn ? response.data.mdn : ""
                });
            }); 
        }
    }
    handleOnChangePage = e => {
        this.setState({
            page: e,
        }, () => this.getFilteredStudentList());
    }
    handleChangeRowsPerPage = e => {
        this.setState({
            limit: e,
        }, () => this.getFilteredStudentList());
    }
    togglePreloader = e => {
        this.setState({
            showPreloader: e
        })
    }
    render() {
        const { 
            studentList, page, limit, name, course, date, id_number, promissoryData, disapproveMsg, isLoadingStudentList,
            totalPending, totalApproved, totalDisapproved, course_department, courses, filterYearLevel, showPreloader,
            studentInfo, totalRecords, selectedStudentID, selectedTab, amountCanPay, textMsgMaxChar
        } = this.state;
        const searcheables = { name, course, date, id_number, filterYearLevel };
        const approver = getLoggedUserDetails("usertype");
        let loadStudentInfo = ( 
            <StudentInfoWithPromissory 
                studentInfo={studentInfo} 
                promissoryData={promissoryData}
                promissoryType="enrollment"
            />
        );
        const loadApprovalPanel = (
            <ApprovalPanel
                studentID={selectedStudentID}
                approver={approver}
                sections="disable"
                sectionValue=""
                currentTab={selectedTab}
                courseDepartment = {course_department}
                title=""
                step="DeanPromissory"
                amountCanPay={amountCanPay}
                textMsgMaxChar={textMsgMaxChar}        
                handleApprovalButton={this.handleApprovalButton}
                handleOnchangeInput={this.handleOnchangeInput}
                disapproveMsg={disapproveMsg}
                disableApproveBtn={false} 
            />
        );
        return (
                <div className="box ml-1">
                    <EnrollmentTabs 
                        pending={approver === "ACAD" ? 2 : 1}
                        approved={3}
                        disapproved={"disabled"}
                        requests={"none"}
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
                                deptabbr={course_department ? course_department : ""}
                            />   
                        </div>
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
                                    step="DeanPromissory"
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

                            {studentInfo && selectedStudentID ? loadStudentInfo : ""}
                            
                        </div>
                    </div> 
                </div>       
        );
    }
}

export default withCookies(DeanPromissory)