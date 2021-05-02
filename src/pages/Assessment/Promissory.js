import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

import { getLoggedUserDetails } from '../../helpers/helper';
import { getAssessmentStudentList, getCourses, getStatusCount, getOldStudentInfo, getStudentInfo, getColleges, approvePromissory } from '../../helpers/apiCalls';


import SearchStudentPanelFull from '../../components/elements/SearchStudentPanelFull';
import StudentInfoWithPromissory from '../../components/enrollment/StudentInfoWithPromissory';
import StudentsList from '../../components/enrollment/StudentsList';
import SpinnerGif from '../../assets/sysimg/spinner.gif';
import ApprovalPanel from '../../components/elements/ApprovalPanel';

class Promissory extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    state = {
        studentList: null, courseDepartment: '', department: '', viewStatus: 1, exam: '', isLoadingStudentList: false,
        colleges: null, courses: null, totalPending: 0, totalApproved: 0, totalRecords: 0, rowsPerPage: 20, pageNum: 1,
        selectedStudentID: '', selectedStudentClassification: '', selectedStudentCourseCode: '', promissoryData: null,
        searchFilterCollege: '', searchFilterCourse: '', searchFilterClassification: '', searchFilterYear: '0', searchIDNumber: '', searchName: '', searchDate: '',
        selectedTab: "pending", userType: '', showPreloader: false, amountCanPay: 0, textMsgMaxChar: 500, textMsg: ''
    }
    componentDidMount = () => {
        const { cookies } = this.props; 
        let educLevel = "CL";
        if(getLoggedUserDetails("courseabbr") === "SHS") educLevel = "SH";
        if(getLoggedUserDetails("courseabbr") === "JHS") educLevel = "JH";
        if(getLoggedUserDetails("courseabbr") === "BED") educLevel = "BE";
        
        this.setState({
            searchFilterCollege: getLoggedUserDetails("usertype") === "ACAD" ? "" : getLoggedUserDetails("courseabbr"),
            viewStatus: getLoggedUserDetails("usertype") === "ACAD" ? 2 : 1,
            exam: getLoggedUserDetails("currentexam"),
            userType: getLoggedUserDetails("usertype"),
            department: educLevel,
        }, () => {
            if(["DEAN", "CHAIRPERSON"].includes(getLoggedUserDetails("usertype"))) {
                //const data = getLoggedUserDetails("usertype") === "ACAD" ? { department: "CL" } : { department_abbr: this.state.searchFilterCollege};
                getCourses({ department_abbr: this.state.searchFilterCollege, active_term: cookies.get("selterm") })
                .then(response => {
                    this.setState({ 
                        courses: response.data.colleges.length > 0 ? response.data.colleges : null 
                    }, () => this.getFilteredStatusCount(this.state.searchFilterCollege));
                });
            }
            else {
                getColleges(cookies.get("selterm"))
                .then(response => {
                    this.setState({ 
                        colleges: response.data.departments 
                    }, () => this.getFilteredStatusCount(""));      
                });
            }
        });
    }
    getFilteredStatusCount = e => {
        const { cookies } = this.props; 
        getStatusCount(e, cookies.get("selterm"))
        .then(response => { 
            const examNames = { P: "prelim", M: "midterm", S: "semi", F: "final", }            
            this.setState({
                totalPending: response.data["pending_" + examNames[this.state.exam]],
                totalApproved: response.data["approve_" + examNames[this.state.exam]]                        
            }, () => this.getFilteredStudentList());
        });
    }
    handleOnClickTab = e => {
        const { userType, courses } = this.state;
        const statuses = { pending: userType === "ACAD" ? 2 : 1, approved: 3 };        
        this.setState({
            selectedTab: e,
            viewStatus: statuses[e],
            courses: ["DEAN", "CHAIRPERSON"].includes(userType) ? courses : null,
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
            selectedStudentCourseCode: courseCode,
            promissoryData: promissoryData
        }, () => this.getStudentInfoData() );
    }
    getFilteredStudentList = () => {
        const { cookies } = this.props;
        const data = {
            course_department: this.state.searchFilterCollege,
            status: this.state.viewStatus,
            exam: this.state.exam,
            department: this.state.department,
            limit: 0,
            page: 1,
            active_term: cookies.get("selterm")
        }
        this.setState({
            isLoadingStudentList: true
        }, () => {
            getAssessmentStudentList(data)
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
                });
            });   
        }
        else {            
            getStudentInfo(this.state.selectedStudentID, 0, cookies.get("selterm")) 
            .then(response => {            
                this.setState({
                    studentInfo: response.data,
                });
            }); 
        }
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
        const { cookies } = this.props; 
        this.togglePreloader(true); 
        if(e === "approved") {
            let proceed = true;
            if(this.state.amountCanPay === 0 || this.state.amountCanPay === "") {
                const msg = "Are you sure you dont want to enter an override amount? Click Ok to proceed, Cancel to enter amount.";
                if(window.confirm(msg)) proceed = true;
                else proceed = false;
            }
            if(proceed) {
                const { selectedStudentID, studentInfo, promissoryData, exam, userType, courseDepartment } = this.state
                const fullname = studentInfo.last_name + ", " + studentInfo.first_name + (studentInfo.middle_name ? " " + studentInfo.middle_name + ". " : "") + (studentInfo.suffix ? " " + studentInfo.suffix + ". " : ""); 
                const confirmMsg = "Are you sure you want to approve promisory application of " + fullname + "(ID # " + selectedStudentID + ") ? Click Ok to proceed, otherwise Cancel";
                if(window.confirm(confirmMsg)) {
                    const data = {
                        id_number: selectedStudentID, 
                        promise_pay: this.state.amountCanPay && parseInt(this.state.amountCanPay, 10) > 0 ? this.state.amountCanPay : promissoryData.promise_pay, 
                        message: this.state.textMsg,
                        active_term: cookies.get("selterm")
                    }    
                    if(exam === "P") data["approved_prelim_promissory"] = 3;
                    if(exam === "M") data["approved_midterm_promissory"] = 3;
                    if(exam === "S") data["approved_semi_promissory"] = 3;
                    if(exam === "F") data["approved_final_promissory"] = 3;          
                    approvePromissory(data)
                    .then(response => {            
                        if(response.data.success) {
                            alert("Student Successfully Approved!");
                            this.setState({
                                selectedStudentID: "",
                                showPreloader: false,
                                textMsg: '',
                                promissoryData: null,
                                amountCanPay: ''
                            }, () => this.getFilteredStatusCount(userType === "ACAD" ? "" : courseDepartment)); 
                        }
                        else {
                            alert("Approval Failed. Please try again, if issues persist please contact EDP Office."); 
                            this.togglePreloader(false);
                        }
                    })                    
                }
                else this.togglePreloader(false);
            }
            else this.togglePreloader(false);
        }
        else if(e === "disapproved") {
            
        }
    }
    render() {
        if (!["DEAN", "CHAIRPERSON", "ACAD"].includes(getLoggedUserDetails("usertype") )) {
            return <Redirect to="/login" />;
        }
        const {
            selectedTab, totalPending, totalApproved, userType, colleges, courses, department, exam,
            studentList, totalRecords, rowsPerPage, pageNum, studentInfo, showPreloader, isLoadingStudentList,
            selectedStudentID, selectedStudentClassification, selectedStudentCourseCode, promissoryData,
            searchFilterCollege, searchFilterCourse, searchFilterClassification, searchFilterYear, searchIDNumber, searchName, searchDate,
            amountCanPay, textMsgMaxChar, textMsg
        } = this.state;
        const searcheables = { searchFilterCollege, searchFilterCourse, searchFilterClassification, searchFilterYear, searchIDNumber, searchName, searchDate };
        const loadStudentInfo = ( 
            <StudentInfoWithPromissory 
                studentInfo={studentInfo} 
                promissoryData={promissoryData}
                promissoryType={exam}
            />
        );
        const loadApprovalPanel = (
            <ApprovalPanel
                studentID={selectedStudentID}
                approver={userType}
                sections="disable"
                sectionValue=""
                currentTab={selectedTab}
                courseDepartment = {searchFilterCollege}
                title=""
                step="promissoryExam"
                amountCanPay={amountCanPay}
                textMsgMaxChar={textMsgMaxChar}        
                handleApprovalButton={this.handleApprovalButton}
                handleOnchangeInput={this.handleOnchangeInput}
                disapproveMsg={textMsg}
                disableApproveBtn={false} 
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
                        <span>Pending Approval <span className="tag is-danger">{totalPending}</span></span>
                    </button>
                    <button name="approved" className={"button " + (selectedTab === "approved" ? "is-info is-selected" : "")}
                            onClick={() => this.handleOnClickTab("approved")}>
                        <span className="icon is-small">
                            <i className="fas fa-check-circle"></i>
                        </span>
                        <span>Approved <span className="tag is-link">{totalApproved}</span></span>
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

export default withCookies(Promissory);

export class PromissoryHeader extends Component {
    render() {
        return(
            <div className="title is-4 ml-1">
                <i className="fas fa-edit"></i> Assessment / Promissory
            </div> 
        )
    }
    
}